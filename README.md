# AI-Powered Candidate Screening System

## Overview

This project is an AI-powered role-based candidate screening system that simulates a structured technical interview using Retrieval-Augmented Generation (RAG).

The system dynamically generates interview questions based on:

* Candidate Resume
* Selected Job Role
* Role-Specific Knowledge Base

The application evaluates candidate responses, generates follow-up questions, stores interview sessions, and produces an AI-generated interview report.

---

## Features

### Resume Processing

* Upload resume in PDF format
* Extract resume text
* Extract technical skills using LLM

### Role Management

* Create job roles
* Store required skills for each role

### Candidate Screening

* Start interview sessions
* Generate role-specific interview questions
* Generate dynamic follow-up questions
* Store questions and answers

### RAG Pipeline

* Load role-specific books
* Chunk documents
* Generate embeddings
* Store embeddings in FAISS
* Retrieve relevant context for question generation

### Interview Evaluation

* Analyze candidate responses
* Generate interview summary report
* Provide strengths and improvement suggestions

---

## Tech Stack

### Backend

* FastAPI
* Python
* SQLAlchemy
* SQLite

### AI / ML

* LangChain
* FAISS
* HuggingFace Embeddings
* Groq LLM

### Frontend

* React (Planned)

---

## Project Structure

backend/

├── app/

│ ├── api/

│ ├── database/

│ ├── rag/

│ ├── schema/

│ ├── services/

│ └── main.py

│

├── books/

├── vector_store/

├── requirements.txt

└── README.md

---

## System Flow

1. Upload Resume
2. Extract Skills
3. Select Role
4. Start Interview Session
5. Retrieve Knowledge Context using FAISS
6. Generate Interview Questions
7. Candidate Answers Questions
8. Generate Follow-up Questions
9. Store Responses
10. Generate Interview Report

---

## Database Schema

### Candidate

| Field  | Type    |
| ------ | ------- |
| id     | Integer |
| name   | String  |
| skills | Text    |

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

* POST /upload_resume

### Role

* POST /create_role

### Interview

* POST /start-interview
* GET /generate-question/{session_id}
* POST /next-question
* GET /interview/{session_id}
* POST /end-interview/{session_id}
* GET /session/{session_id}
* GET /report/{session_id}

---

## Knowledge Base

The system uses the following books as its primary knowledge source:

* Machine Learning — Tom Mitchell
* Machine Learning for Absolute Beginners
* Introduction to Machine Learning with Python
* Master Machine Learning Algorithms
* Pattern Recognition and Machine Learning
* Artificial Intelligence, Machine Learning and Deep Learning

---

## RAG Architecture

Document PDFs
↓
Chunking
↓
Embeddings
↓
FAISS Vector Store
↓
Context Retrieval
↓
Question Generation

---

## Setup

### Clone Repository

```bash
git clone <repository_url>
cd Candidate-Screening-System/backend
```

### Create Virtual Environment

```bash
python -m venv .venv
```

### Activate Environment

```bash
.venv\Scripts\activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run Application

```bash
uvicorn app.main:app --reload
```

### API Documentation

```text
http://127.0.0.1:8000/docs
```

---

## Future Improvements

* React Frontend
* Candidate Scoring System
* Multi-Round Interviews
* Advanced Skill Gap Analysis
* Interview Analytics Dashboard

---

## Author

Subham
