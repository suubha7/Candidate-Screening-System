# Candidate Screening System

An AI-powered Candidate Screening System that automates resume processing and skill extraction for technical interview preparation.

## Features Implemented

* Resume upload using FastAPI
* PDF file storage
* Resume text extraction using PyMuPDF
* Technical skill extraction using LLMs
* Candidate data persistence using SQLite
* Swagger API documentation

---

## Current Workflow

```text
Candidate Uploads Resume
        ↓
Save PDF
        ↓
Extract Resume Text
        ↓
Extract Technical Skills
        ↓
Store Candidate Information
```

---

## Tech Stack

### Backend

* FastAPI
* Python

### Database

* SQLite
* SQLAlchemy

### AI / LLM

* LangChain
* Groq
* Llama 3.1 8B Instant

### Document Processing

* PyMuPDF (fitz)

---

## Database Schema

### Candidate Table

| Column      | Type    |
| ----------- | ------- |
| id          | Integer |
| name        | String  |
| email       | String  |
| resume_path | String  |
| resume_text | Text    |
| skills      | Text    |

---

## Project Structure

```text
backend/
│
├── app/
│   ├── api/
│   │   └── candidate.py
│   │
│   ├── database/
│   │   ├── database.py
│   │   └── model.py
│   │
│   ├── services/
│   │   ├── resume_service.py
│   │   ├── skill_extraction_service.py
│   │   └── llm_service.py
│   │
│   └── main.py
│
├── uploads/
│
├── interview.db
│
└── README.md
```

---

## API Endpoint

### Upload Resume

**POST** `/upload_resume`

#### Form Data

| Field  | Type     |
| ------ | -------- |
| name   | String   |
| email  | String   |
| resume | PDF File |

#### Response

```json
{
  "candidate_id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "skills": [
    "Python",
    "FastAPI",
    "LangChain"
  ]
}
```

---

## Implemented Modules

### Resume Service

* PDF text extraction
* Resume content processing

### Skill Extraction Service

* LLM-based technical skill extraction
* Structured output using Pydantic

### Candidate API

* Resume upload endpoint
* Candidate data processing

---

## Roadmap

### Phase 1 

* Resume Upload
* Resume Parsing
* Skill Extraction
* Candidate Storage

### Phase 2

* Role Table
* InterviewSession Table
* QuestionAnswer Table
* FinalReport Table

### Phase 3

* Resume Skill vs Role Skill Comparison
* Retrieval Query Generation

### Phase 4

* RAG Pipeline
* FAISS Vector Database
* Interview Question Generation

### Phase 5

* Adaptive Follow-up Questions
* Candidate Evaluation
* Final Interview Report

---

## Author

Subham Maharana
