from fastapi import APIRouter
from app.database.database import SessionLocal
from app.database.model import InterviewSession
from app.schema.interview import StartInterviewRequest

interview_router = APIRouter()


@interview_router.post("/start-interview")
def start_interview(data: StartInterviewRequest):

    db = SessionLocal()

    session = InterviewSession(
        candidate_id=data.candidate_id,
        role_id=data.role_id,
        status="Started"
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    db.close()

    return {
        "session_id": session.id,
        "status": session.status
    }