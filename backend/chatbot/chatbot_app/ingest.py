import torch
from langchain_community.llms import Ollama
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import Chroma
import os
import warnings
warnings.filterwarnings('ignore')


def main():
    device = "cuda" if torch.cuda.is_available() else "cpu"
    file_path = os.path.join(os.path.dirname(__file__), 'pdf', 'Physics Classes 9-10.pdf')

    # Loading the document
    print("Loading document...")
    loader = PyPDFLoader(file_path)
    documents = loader.load()

    # adding meta data to each document
    for doc in documents:
        doc.metadata = {"source": "Physics Classes 9-10.pdf"}

    # Splitting Text
    print("Splitting document...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=100
    )

    print(f"Creating embeddings using {device}...")
    all_splits = text_splitter.split_documents(documents)

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


if __name__ == "__main__":
    main()

