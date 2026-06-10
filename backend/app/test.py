# from services.resume_service import extract_text_from_pdf
# from services.skill_extraction_service import extract_skills

# path = "uploads/Subham_Maharana_AI_Engineer.pdf"

# resume_text = extract_text_from_pdf(path)

# skills = extract_skills(resume_text)

# print(skills)




# Usage
from services.llm_service import get_llm
import json
llm = get_llm()

text = """ Extract all technical skills from the resume.

    Return ONLY valid JSON in this format:

    {
        "skills": [
            "Python",
            "FastAPI",
            "Machine Learning"
        ]
    }

    Resume:Recognised for analytical problem-solving and contribution to team performance. 
  PROJECTS 
InboxPilot - Autonomous Email AI Agent Python  |  LangGraph  |  Retrieval-Augmented Generation (RAG)  |  AWS Bedrock  
|  FAISS 
• Designed and deployed an autonomous email-processing system handling 500+ emails/week with ~92% 
classification accuracy without human intervention. 
• Built a LangGraph-based agent workflow with modules for intent classification, spam filtering, priority routing, 
retrieval, and LLM response generation. 
• Developed a Retrieval-Augmented Generation (RAG) pipeline using FAISS over 20+ documents, improving query 
response time by ~60%. 
• Built AI infrastructure including LLM response caching, observability logging, and retrieval tuning - reducing 
hallucination rates across 3 failure modes and improving query response time by ~60%. 
• Integrated LangSmith for LLM observability and trace monitoring. 
GitHub: https://github.com/suubha7/InboxPilot 
Intellexa AI - Enterprise Knowledge Platform Python  |  LangChain  |  ChromaDB  |  FAISS  |  Vertex AI  |  Streamlit  |  GCP 
• Built a full-stack Generative AI application using Retrieval-Augmented Generation (RAG) for enterprise 
document-based question answering with semantic search and source citations. 
• Designed end-to-end pipeline for document ingestion (PDF, DOCX, TXT), embedding generation, vector storage 
(ChromaDB/FAISS), and Natural Language Processing (NLP) response generation via Vertex AI. 
• Developed a Streamlit interface with chat history and multi-document support, improving knowledge retrieval 
efficiency by ~40%ver manual search. 
Live Demo: https://intellexa-ai-n5s4.onrender.com/ 
GitHub: https://github.com/suubha7/intellexa-ai 
Employee Management System - Full-Stack Backend App Python  |  FastAPI  |  SQLAlchemy  |  SQLite  |  REST APIs 
• Designed and deployed a production-grade RESTful API using Python (FastAPI) for employee data management 
with full CRUD operations, optimised for scalability, security, and high availability. 
• Implemented data validation using Pydantic and Object-Relational Mapping (ORM) using SQLAlchemy for 
structured database access. 
• Enabled automatic API documentation using Swagger and ReDoc; supported search, filter, bulk delete, and 
update operations. 
GitHub: https://github.com/suubha7/Employee-Management-System 
TECHNICAL SKILLS 
Generative AI & NLP: Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), Natural Language 
Processing (NLP), Prompt Engineering (few-shot, chain-of-thought, system prompts), RLHF, Fine-tuning, Model 
Evaluation 
Frameworks & Tools: LangChain, LangGraph, LangSmith, FastAPI, Streamlit, Pydantic, SQLAlchemy 
Programming: Python (Object-Oriented Programming, Scripting, Async), Pandas, NumPy 
Vector Databases: FAISS, ChromaDB, Embeddings, Semantic Search 
LLM Platforms: OpenAI API, Anthropic Claude API, Google Gemini API, AWS Bedrock, Vertex AI, Hugging Face 
Cloud & DevOps: AWS, GCP, Docker, Git, GitHub, CI/CD Pipeline 
Databases: MySQL, SQLite 
EDUCATION 
Bachelor of Computer Applications (BCA) 
2022 - 2025 
Kalam Institute of Management and Studies, Berhampur, Odisha  |  CGPA: 8.34 / 10 
Higher Secondary - Science Stream 
2020 - 2022 
Kalam Science Higher Secondary School, Berhampur, Odisha  |  85.83% 
CERTIFICATIONS & TRAINING 
• Generative AI Developer Training Program - Quality Thoughts, Hyderabad | 2025 
• LLM Post-Training Internship Certificate - Ethara AI | Jan 2026 – Mar 2026 
• AI/ML Internship Certificate - EvoAstra Ventures | 2025 
 """

messages = [
    ("system", "You are a helpful assistant."),
    ("human", text),
]

response = llm.invoke(messages)
print(type(json.loads(response.content)))