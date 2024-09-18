import torch
from langchain_community.llms import Ollama
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain.schema.runnable import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain import hub

from rest_framework.views import APIView
from rest_framework.response import Response
from .models import ChatSession, Message
from .serializers import ChatSessionSerializer, MessageSerializer

import warnings
warnings.filterwarnings('ignore')

llm = Ollama(model="llama3")

device = "cuda" if torch.cuda.is_available() else "cpu"

model_name = "sentence-transformers/all-mpnet-base-v2"
model_kwargs = {"device": device}

embeddings = HuggingFaceEmbeddings(
    model_name=model_name,
    model_kwargs=model_kwargs
) 

prompt = hub.pull("rlm/rag-prompt")

vector_db = Chroma(persist_directory="chroma_db", embedding_function=embeddings)

retriever = vector_db.as_retriever(search_type="mmr")

# Format the retrieved documents
def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

# Define the RAG chain
rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

def generate_answer(query):
    response = rag_chain.invoke(query)
    return response

# Create your views here.
class ChatSessionsView(APIView):
    def get(self, request):
        try:
            chat_sessions = ChatSession.objects.all()
            serializer = ChatSessionSerializer(chat_sessions, many=True)
            print(serializer.data)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class SingleSessionView(APIView):
    # getting a single session with an id
    def get(self, request, session_id):
        try:
            messages = Message.objects.filter(session__session_id = session_id)
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

            answer = generate_answer(query)
            print(type(answer))
            print(f"Generated answer: {answer}")

            session = ChatSession.objects.get(session_id=session_id)
            Message.objects.create(session=session, text=query, is_bot=False)
            Message.objects.create(session=session, text=answer, is_bot=True)

            return Response({"answer": answer}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)



     # delete the session with an id
    def delete(self, request, session_id):
        try:
            session = ChatSession.objects.get(session_id=session_id)
            session.delete()
            return Response(status=204)
        except ChatSession.DoesNotExist:
            return Response({"error": "Session does not exist"}, status=404)