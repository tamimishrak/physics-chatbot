import torch
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
import os
import warnings
warnings.filterwarnings('ignore')


def create_vectordb_retriever():
    # getting the file from the path 
    device = "cuda" if torch.cuda.is_available() else "cpu"
    file_path = os.path.join(os.path.dirname(__file__), 'pdf', 'Physics Classes 9-10.pdf')

    # Loading the document
    print("Loading document...")
    loader = PyPDFLoader(file_path)
    documents = loader.load()

    # Splitting Text
    print("Splitting document...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=100
    )


    all_splits = text_splitter.split_documents(documents)

    print(f"Creating embeddings using {device}...")

    model_name = "sentence-transformers/all-mpnet-base-v2"
    model_kwargs = {"device": device}

    embeddings = HuggingFaceEmbeddings(
        model_name = model_name, 
        model_kwargs = model_kwargs
    )

    # creating a vector store
    print("Creating a vector store...")
    vectordb = Chroma.from_documents(
        documents=all_splits,
        embedding=embeddings,
        persist_directory="chroma_db"
    )
    
    print("Created the vectoddb and the retirever successfully!")
    

if __name__ == "__main__":
    create_vectordb_retriever()