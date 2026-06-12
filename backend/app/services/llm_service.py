from dotenv import load_dotenv
from langchain_groq import ChatGroq

def get_llm() -> ChatGroq:
    load_dotenv()
    
    return ChatGroq(
        # model="llama-3.1-8b-instant",
        model="llama-3.3-70b-versatile",
        temperature=0,
        max_retries=2,
    )