from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

vector_store = FAISS.load_local(
    "faiss_index",
    embeddings,
    allow_dangerous_deserialization=True
)


def retrieve_context(
    query: str,
    role: str,
    k: int = 5
):

    docs = vector_store.similarity_search(
        query=query,
        k=20
    )

    docs = [
        doc
        for doc in docs
        if doc.metadata.get("role") == role
    ]

    return docs[:k]