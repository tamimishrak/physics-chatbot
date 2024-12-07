import torch
from langchain_community.llms import Ollama
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain.schema.runnable import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain import hub

from langchain.globals import set_llm_cache
from langchain_community.cache import InMemoryCache

from langchain.prompts import PromptTemplate
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.prompts import MessagesPlaceholder

from langchain.chains import create_history_aware_retriever
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.messages import HumanMessage, AIMessage

from rest_framework.views import APIView
from rest_framework.response import Response
from .models import ChatSession, Message
from .serializers import ChatSessionSerializer, MessageSerializer, UserSerializer
from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated, AllowAny

import uuid
import warnings
warnings.filterwarnings('ignore')

# llm/slm
llama = "llama3"
gemma = "gemma:2b"
qwen = "qwen:4b"

llm = Ollama(model=llama)

set_llm_cache(InMemoryCache())

device = "cuda" if torch.cuda.is_available() else "cpu"

model_name = "sentence-transformers/all-mpnet-base-v2"
model_kwargs = {"device": device}

embeddings = HuggingFaceEmbeddings(
    model_name=model_name,
    model_kwargs=model_kwargs
) 

prompt = PromptTemplate.from_template(
    """
    You are an assistant aimed to answer only physics based questions.
    You should use the following pieces of context to answer the question at the end. 
    If you don't know the answer, say that you don't know.
    Do not answer any questions that are irrelevant to physics and Keep the answer concise.

    {context}

    Question: {question}
    Answer:
    """
)

vector_db = Chroma(persist_directory="chroma_db", embedding_function=embeddings)

retriever = vector_db.as_retriever(
    search_type="mmr"
)

# Format the retrieved documents
def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

# Define the RAG chain
"""
rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)
"""
retriever_prompt = (
    "You are an assistant aimed to answer only physics based questions."
    "You should use the following pieces of context to answer the question at the end." 
    "If you don't know the answer, say that you don't know."
    "Do not answer any questions that are irrelevant to physics and Keep the answer concise."
    "Given a chat history and the latest user question which might reference context in the chat history,"
    "formulate a standalone question which can be understood without the chat history."
    "Do NOT answer the question, just reformulate it if needed and otherwise return it as is."
)

contextualize_q_prompt  = ChatPromptTemplate.from_messages(
    [
        ("system", retriever_prompt),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{input}"),    ]
)

history_aware_retriever = create_history_aware_retriever(llm,retriever,contextualize_q_prompt)

system_prompt = (
    "You are an assistant for question-answering tasks. "
    "Use the following pieces of retrieved context to answer the question "
    "If you don't know the answer, say that you don't know."
    "Keep the answer concise."
    "\n\n"
    "{context}"
)

qa_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)

question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)

rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

chat_history = []

def generate_answer(query):
    response = rag_chain.invoke(query)
    return response

# Create your views here.
class ChatSessionsView(APIView):
    def get(self, request):
        try:
            chat_sessions = ChatSession.objects.filter(user=request.user)
            serializer = ChatSessionSerializer(chat_sessions, many=True)
            print(serializer.data)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        
    def post(self, request):
        query= request.data.get('text')
        try:
            print(f"User Query: {query}")
            new_session = ChatSession.objects.create(
                user=request.user,
                session_id=str(uuid.uuid4()),
                session_title=query[:25]
            )
            
            retrieved_docs = retriever.invoke(query)

            print(f"Length of retrieved docs {len(retrieved_docs)}")
            
            for doc in retrieved_docs:
                print(f"Doc: {doc.page_content}")
                print("\n")
            
            Message.objects.create(session=new_session, text=query, is_bot=False)
            
            chat_history = []

            if not retrieved_docs:
                t = "I don't know the answer."
                Message.objects.create(session=new_session, text=t, is_bot=True)
                
                return Response({
                'id': new_session.session_id,
                'answer': t
                }, status=201) 
            
            #answer = generate_answer(query)
            response = rag_chain.invoke({"input": query, "chat_history": chat_history})
            answer = response["answer"]

            chat_history.extend(
                [
                    HumanMessage(content=query),
                    AIMessage(content=answer),
                ]
            )

            print(f"Generated answer: {answer}")
            
            Message.objects.create(session=new_session, text=answer, is_bot=True)
            
            return Response({
                'id': new_session.session_id,
                'answer': answer
                }, status=201)
        
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class SingleSessionView(APIView):
    # getting a single session with an id
    def get(self, request, session_id):
        try:
            messages = Message.objects.filter(session__session_id = session_id, session__user=request.user)
            serializer = MessageSerializer(messages, many=True)
            print(serializer.data)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        
    # generating the answer
    def post(self, request, session_id):
        try:
            query = request.data.get('text')
            print(f"User query: {query}")

            retrieved_docs = retriever.invoke(query)

            print(f"Length of retrieved docs {len(retrieved_docs)}")
            for doc in retrieved_docs:
                print(f"Doc: {doc.page_content}")
                print("\n")

            session = ChatSession.objects.get(session_id=session_id, user=request.user)
            Message.objects.create(session=session, text=query, is_bot=False)

            messages = Message.objects.filter(session=session).order_by("m_created_at")

            chat_history = [
                HumanMessage(content=msg.text) if not msg.is_bot else AIMessage(content=msg.text)
                for msg in messages
            ]

            if not retrieved_docs:
                t = "I don't know the answer."
                Message.objects.create(session=session, text=t, is_bot=True)
                return Response({"answer": t}, status=200)

            #answer = generate_answer(query)
            response = rag_chain.invoke({"input": query, "chat_history": chat_history})
            answer = response["answer"]

            chat_history.extend(
                [
                    HumanMessage(content=query),
                    AIMessage(content=answer),
                ]
            )

            print(type(answer))
            print(f"Generated answer: {answer}")    
            Message.objects.create(session=session, text=answer, is_bot=True)

            return Response({"answer": answer}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)



     # delete the session with an id
    def delete(self, request, session_id):
        try:
            session = ChatSession.objects.get(session_id=session_id, user=request.user)
            session.delete()
            return Response(status=204)
        except ChatSession.DoesNotExist:
            return Response({"error": "Session does not exist"}, status=404)
        
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]