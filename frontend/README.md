# AI-Powered Candidate Screening System — Frontend

React + Vite frontend for the FastAPI screening backend.

## Quick Start

```bash
cd ai-screening-frontend
npm install
npm run dev
```

Opens at **http://localhost:5173**  
Backend must be running at **http://127.0.0.1:8000**

---

## Project Structure

```
src/
├── context/
│   └── SessionContext.jsx     # Global state (candidateId, roleId, sessionId)
├── services/
│   └── api.js                 # Axios API layer — all backend calls
├── components/
│   ├── Layout.jsx             # Shell with header + step rail
│   ├── StepRail.jsx           # 5-step animated progress indicator
│   ├── LoadingSpinner.jsx     # Spinner w/ optional label
│   ├── ErrorAlert.jsx         # Dismissable error banner
│   └── SkillBadge.jsx         # Coloured skill chip
└── pages/
    ├── UploadResumePage.jsx   # Step 1 — resume upload + skill extraction
    ├── RoleSelectionPage.jsx  # Step 2 — role cards grid
    ├── StartInterviewPage.jsx # Step 3 — session setup + confirm
    ├── InterviewPage.jsx      # Step 4 — Q&A loop with follow-ups
    ├── ReportPage.jsx         # Step 5 — AI report + full transcript
    └── NotFoundPage.jsx       # 404
```

## API Endpoints Used

| Method | Path | Page |
|--------|------|------|
| POST | `/upload_resume` | Upload Resume |
| GET | `/get_roles` | Role Selection |
| POST | `/start-interview` | Start Interview |
| GET | `/generate-question/{session_id}` | Interview |
| POST | `/next-question` | Interview |
| POST | `/end-interview/{session_id}` | Interview |
| GET | `/report/{session_id}` | Report |
| GET | `/interview/{session_id}` | Report (transcript) |

## Tech Stack

- **React 18** + **Vite 5**
- **React Router DOM v6**
- **Axios** — API layer
- **Tailwind CSS v3** — utility-first styling
- **Inter + JetBrains Mono** — Google Fonts

## CORS

Make sure your FastAPI backend has CORS enabled for `http://localhost:5173`:

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
