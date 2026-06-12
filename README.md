# AI-Powered Candidate Screening System

## Overview

AI-Powered Candidate Screening System is a full-stack application that helps automate technical candidate screening using Generative AI and Retrieval-Augmented Generation (RAG).

The system uploads and analyzes a candidate resume, extracts technical skills, lets the candidate select a target role and experience level, generates role-specific interview questions, asks adaptive follow-up questions based on answers, and produces an AI evaluation report.

---

## Key Features

### Candidate Resume Processing

* Upload PDF resumes
* Extract resume text
* Detect technical skills using an LLM
* Store candidate profile, resume text, and extracted skills

### Role-Based Screening

* Fetch available roles from the backend
* Select the role the candidate is applying for
* Match interview context with role requirements
* Support role creation and role deletion through backend APIs

### Experience-Level Interviews

* Select candidate experience level before starting the interview
* Supported levels:
  * Fresher
  * Associate
  * Senior
* Send `experience_level` with the interview start request
* Use experience level as part of the interview session setup

### AI Interview Flow

* Generate technical interview questions using RAG
* Show one question at a time
* Ask a follow-up question based on the candidate's answer
* Continue with the next main question after the follow-up
* Store answered questions during the session

### AI Evaluation Report

* Generate a final report after the interview
* Summarize candidate performance
* Identify strengths, weaknesses, and knowledge gaps
* Provide AI-generated evaluation feedback
* View a structured recruiter-ready report in the app
* Download the report as a PDF for sharing or record-keeping

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
* Uvicorn
* ReportLab
* uv

### AI / Machine Learning

* LangChain
* FAISS
* HuggingFace embeddings
* Groq LLM
* Retrieval-Augmented Generation

---

## Project Structure

```text
Candidate-Screening-System/
|-- backend/
|   |-- app/
|   |   |-- api/
|   |   |-- database/
|   |   |-- rag/
|   |   |-- schema/
|   |   |-- services/
|   |   `-- main.py
|   |-- books/
|   |-- faiss_index/
|   |-- uploads/
|   |-- interview.db
|   |-- pyproject.toml
|   `-- uv.lock
|
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- context/
|   |   |-- pages/
|   |   |-- services/
|   |   `-- App.jsx
|   |-- package.json
|   `-- vite.config.js
|
`-- README.md
```

---

## Application Workflow

1. Candidate uploads a PDF resume.
2. Backend extracts resume text and skills.
3. Candidate selects a job role.
4. Candidate selects an experience level: Fresher, Associate, or Senior.
5. Frontend starts an interview session with candidate id, role id, and experience level.
6. Backend generates clean role-specific questions using RAG.
7. Frontend displays one main question at a time.
8. Candidate answers the question.
9. Backend generates a follow-up question based on the answer.
10. Flow continues with the next main question.
11. Candidate ends the interview.
12. Backend generates the final AI evaluation report.
13. Frontend displays a structured evaluation summary.
14. Candidate or recruiter can download the report as a PDF.

---

## API Endpoints

### Candidate

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| POST | `/upload_resume` | Upload candidate resume and extract skills |

### Role

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| POST | `/create_role` | Create a new role |
| GET | `/get_roles` | Fetch all available roles |
| DELETE | `/roles` | Delete all roles |

### Interview

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| POST | `/start-interview` | Start an interview session |
| GET | `/generate-question/{session_id}` | Generate main interview questions |
| POST | `/next-question` | Save an answer and generate a follow-up question |
| GET | `/interview/{session_id}` | Fetch interview Q&A history |
| POST | `/end-interview/{session_id}` | Mark interview as completed |
| GET | `/session/{session_id}` | Fetch interview session details |
| GET | `/report/{session_id}` | Generate structured interview report |
| GET | `/report/{session_id}/pdf` | Download interview report as PDF |

### Start Interview Request

```json
{
  "candidate_id": 1,
  "role_id": 1,
  "experience_level": "Fresher"
}
```

Valid `experience_level` values:

* `Fresher`
* `Associate`
* `Senior`

---

## Database Tables

### Candidate

| Field | Type |
| ----- | ---- |
| id | Integer |
| name | String |
| email | String |
| resume_path | String |
| resume_text | Text |
| skills | Text |

### Role

| Field | Type |
| ----- | ---- |
| id | Integer |
| role_name | String |
| required_skills | Text |

### InterviewSession

| Field | Type |
| ----- | ---- |
| id | Integer |
| candidate_id | Foreign Key |
| role_id | Foreign Key |
| experience_level | String |
| status | String |

### QuestionAnswer

| Field | Type |
| ----- | ---- |
| id | Integer |
| session_id | Foreign Key |
| question | Text |
| answer | Text |

---

## Knowledge Base

The RAG pipeline retrieves interview context from the local knowledge base and vector index. Example resources include:

* Machine Learning by Tom Mitchell
* The Hundred-Page Machine Learning Book
* Machine Learning for Absolute Beginners
* Introduction to Machine Learning with Python
* Master Machine Learning Algorithms
* Pattern Recognition and Machine Learning
* Artificial Intelligence, Machine Learning and Deep Learning

---

## RAG Pipeline

```text
PDF documents
    |
    v
Document loading
    |
    v
Text chunking
    |
    v
Embedding generation
    |
    v
FAISS vector store
    |
    v
Semantic retrieval
    |
    v
Question generation
```

---

## Backend Setup

Go to the backend folder:

```bash
cd backend
```

Create and install the environment with `uv`:

```bash
uv sync
```

Run the FastAPI backend:

```bash
uv run uvicorn app.main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

If port `8000` is already in use, stop the existing process or run on another port:

```bash
uv run uvicorn app.main:app --reload --port 8001
```

---

## Frontend Setup

Go to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the frontend:

```bash
npm run dev
```

Frontend URL:

```text
http://127.0.0.1:5173
```

The frontend uses the Vite dev proxy for backend API calls and does not require backend API URL changes.

---

## Environment Notes

The backend uses external AI services. Add required API keys in the backend `.env` file.

Example:

```text
GROQ_API_KEY=your_api_key_here
```

HuggingFace may show a warning when running without `HF_TOKEN`. The app can still run, but setting a token may improve rate limits and download reliability.

---

## Report PDF Export

After an interview is completed, the report page includes a **Download PDF Report** button.

The PDF includes:

* Candidate information (name, email, role, experience level, session ID, status)
* Interview evaluation (overall rating, job eligibility, strengths, weaknesses, knowledge gaps, recommendations, and reason)

The downloaded file is named in this format:

```text
CandidateName_Session_{session_id}_Report.pdf
```

Example:

```text
Arush_Session_1_Report.pdf
```

---

## Current Limitations

* No separate admin frontend panel yet
* Role creation and role deletion are available through backend APIs only

---

## Future Improvements

* Admin dashboard for role management
* Candidate scoring system
* Interview analytics dashboard
* Multi-round interviews
* Authentication for admin and candidate flows

---

## Author

Subham
