# AI-Powered Candidate Screening System

## Overview

AI-Powered Candidate Screening System is a full-stack application that automates technical candidate interviews using Generative AI and Retrieval-Augmented Generation (RAG).

The system analyzes a candidate's resume, extracts technical skills, generates role-specific interview questions, asks follow-up questions based on answers, and creates an AI-generated evaluation report.

---

## Features

### Resume Processing

* Upload PDF resumes
* Extract resume content
* Identify technical skills using LLMs

### Role-Based Interviews

* Select a job role
* Generate role-specific interview questions
* Use RAG to retrieve knowledge from a custom knowledge base

### Dynamic Follow-Up Questions

* Generate follow-up questions based on candidate answers
* Adapt interview flow dynamically

### Interview Session Management

* Create interview sessions
* Store questions and answers
* Track interview progress

### AI Evaluation Report

* Analyze candidate responses
* Identify strengths and weaknesses
* Detect knowledge gaps
* Generate recommendations
* Determine job eligibility

---

## Technology Stack

### Frontend

* React
* Vite
* React Router
* Axios
* Tailwind CSS

### Backend

* FastAPI
* Python
* SQLAlchemy
* SQLite

### AI / Machine Learning

* LangChain
* FAISS
* HuggingFace Embeddings
* Groq LLM

---

## Project Structure

```text
Candidate-Screening-System/

├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── database/
│   │   ├── rag/
│   │   ├── schema/
│   │   ├── services/
│   │   └── main.py
│   │
│   ├── books/
│   ├── vector_store/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   └── package.json
│
└── README.md
```

---

## Application Workflow

1. Upload Resume
2. Extract Skills
3. Select Job Role
4. Start Interview Session
5. Generate Questions using RAG
6. Answer Questions
7. Generate Follow-Up Questions
8. End Interview
9. Generate AI Evaluation Report

---

## Database Tables

### Candidate

| Field       | Type    |
| ----------- | ------- |
| id          | Integer |
| name        | String  |
| email       | String  |
| resume_path | String  |
| resume_text | Text    |
| skills      | Text    |

### Role

| Field           | Type    |
| --------------- | ------- |
| id              | Integer |
| role_name       | String  |
| required_skills | Text    |

### InterviewSession

| Field        | Type        |
| ------------ | ----------- |
| id           | Integer     |
| candidate_id | Foreign Key |
| role_id      | Foreign Key |
| status       | String      |

### QuestionAnswer

| Field      | Type        |
| ---------- | ----------- |
| id         | Integer     |
| session_id | Foreign Key |
| question   | Text        |
| answer     | Text        |

---

## API Endpoints

### Candidate

| Method | Endpoint       |
| ------ | -------------- |
| POST   | /upload_resume |

### Role

| Method | Endpoint     |
| ------ | ------------ |
| POST   | /create_role |
| GET    | /get_roles   |

### Interview

| Method | Endpoint                        |
| ------ | ------------------------------- |
| POST   | /start-interview                |
| GET    | /generate-question/{session_id} |
| POST   | /next-question                  |
| GET    | /interview/{session_id}         |
| POST   | /end-interview/{session_id}     |
| GET    | /session/{session_id}           |
| GET    | /report/{session_id}            |

---

## Knowledge Base

The RAG pipeline uses the following books:

* Machine Learning — Tom Mitchell
* The Hundred-Page Machine Learning Book
* Machine Learning for Absolute Beginners
* Introduction to Machine Learning with Python
* Master Machine Learning Algorithms
* Pattern Recognition and Machine Learning
* Artificial Intelligence, Machine Learning and Deep Learning

---

## RAG Pipeline

```text
PDF Documents
      ↓
Document Loading
      ↓
Text Chunking
      ↓
Embeddings
      ↓
FAISS Vector Store
      ↓
Semantic Retrieval
      ↓
Question Generation
```

---

## Backend Setup

### Create Virtual Environment

```bash
python -m venv .venv
```

### Activate Environment

Windows:

```bash
.venv\Scripts\activate
```

### Install Dependencies

```bash
pip install .
or
pip install -e .
```

### Run Backend

```bash
uvicorn app.main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

Swagger Documentation:

```text
http://127.0.0.1:8000/docs
```

---

## Frontend Setup

### Install Dependencies

```bash
npm install
```

### Run Frontend

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

## CORS Configuration

Make sure FastAPI allows requests from the frontend:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Future Improvements

* Experience Levels (Fresher, Associate, Senior)
* Candidate Scoring System
* PDF Report Export
* Interview Analytics Dashboard
* Multi-Round Interviews
* Admin Dashboard
* Authentication and Authorization

---

## Author

Subham
