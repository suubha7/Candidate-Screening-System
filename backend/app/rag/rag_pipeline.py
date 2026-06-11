from pathlib import Path

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS


BOOKS = {
    "AI/ML Engineer": [
        "books/MachineLearningTomMitchell.pdf",
        "books/Machine Learning For Absolute Beginners.pdf"
    ],

    "Data Scientist": [
        "books/Introduction to Machine Learning with Python ( PDFDrive.com )-min.pdf",
        "books/Master Machine Learning Algorithms - Discover how they work and Implement Them From Scratch by Jason Brownlee (z-lib.org).pdf"
    ],

    "Advanced ML Engineer": [
        "books/Bishop-Pattern-Recognition-and-Machine-Learning-2006.pdf",
        "books/Artificial Intelligence, Machine Learning, and Deep Learning.pdf"
    ]
}


documents = []

for role, pdfs in BOOKS.items():
    for pdf_path in pdfs:

        print(f"Loading: {pdf_path}")

        loader = PyPDFLoader(pdf_path)
        docs = loader.load()

        for doc in docs:
            doc.metadata["role"] = role

        documents.extend(docs)

print("Pages:", len(documents))

splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)

chunks = splitter.split_documents(documents)

print("Chunks:", len(chunks))

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

vector_store = FAISS.from_documents(
    chunks,
    embeddings
)

vector_store.save_local("faiss_index")

print("FAISS Index Created")