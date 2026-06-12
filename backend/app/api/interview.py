from fastapi import APIRouter
from app.database.database import SessionLocal
from app.database.model import Candidate, Role
from app.services.retrieval_query_service import build_retrieval_query
from app.rag.retriever import retrieve_context
from app.services.question_generation_service import generate_questions
from app.database.model import InterviewSession, QuestionAnswer
from app.schema.interview import StartInterviewRequest
from app.schema.question_answer import AnswerRequest
from app.schema.next_question import NextQuestionRequest
from app.services.followup_question_service import generate_followup_question
from app.services.report_service import generate_report

interview_router = APIRouter()


@interview_router.post("/start-interview")
def start_interview(data: StartInterviewRequest):

    db = SessionLocal()

    session = InterviewSession(
        candidate_id=data.candidate_id,
        role_id=data.role_id,
        experience_level=data.experience_level,
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

@interview_router.get("/generate-question/{session_id}")
def generate_first_question(session_id: int):

    db = SessionLocal()

    session = (
        db.query(InterviewSession)
        .filter(InterviewSession.id == session_id)
        .first()
    )

    if not session:
        db.close()
        return {"message": "Session not found"}

    candidate = (
        db.query(Candidate)
        .filter(Candidate.id == session.candidate_id)
        .first()
    )

    role = (
        db.query(Role)
        .filter(Role.id == session.role_id)
        .first()
    )

    candidate_skills = candidate.skills.split(",")

    query = build_retrieval_query(
        role_name=role.role_name,
        matched_skills=candidate_skills,
        missing_skills=[]
    )

    docs = retrieve_context(
        query=query,
        role=role.role_name
    )

    context = "\n\n".join(
        doc.page_content
        for doc in docs
    )

    questions = generate_questions(
        role=role.role_name,
        experience_level=session.experience_level,
        resume_skills=candidate.skills.split(","),
        context=context
    )

    db.close()

    return {
        "session_id": session_id,
        "questions": questions
    }


@interview_router.post("/next-question")
def next_question(data: NextQuestionRequest):

    db = SessionLocal()

    qa = QuestionAnswer(
        session_id=data.session_id,
        question=data.question,
        answer=data.answer
    )

    db.add(qa)
    db.commit()

    followup = generate_followup_question(
        previous_question=data.question,
        candidate_answer=data.answer,
        role=data.role
    )

    db.close()

    return {
        "next_question": followup
    }

@interview_router.get("/interview/{session_id}")
def get_interview(session_id: int):

    db = SessionLocal()

    questions_answers = (
        db.query(QuestionAnswer)
        .filter(QuestionAnswer.session_id == session_id)
        .all()
    )

    db.close()

    return {
        "session_id": session_id,
        "questions_answers": [
            {
                "question": qa.question,
                "answer": qa.answer
            }
            for qa in questions_answers
        ]
    }

@interview_router.post("/end-interview/{session_id}")
def end_interview(session_id: int):

    db = SessionLocal()

    session = (
        db.query(InterviewSession)
        .filter(InterviewSession.id == session_id)
        .first()
    )

    if not session:
        db.close()
        return {
            "message": "Interview session not found"
        }

    session.status = "Completed"

    db.commit()
    db.refresh(session)

    db.close()

    return {
        "session_id": session.id,
        "status": session.status
    }

@interview_router.get("/session/{session_id}")
def get_session(session_id: int):

    db = SessionLocal()

    session = (
        db.query(InterviewSession)
        .filter(InterviewSession.id == session_id)
        .first()
    )

    db.close()

    return {
        "session_id": session.id,
        "candidate_id": session.candidate_id,
        "role_id": session.role_id,
        "experience_level": session.experience_level,
        "status": session.status
    }

@interview_router.get("/report/{session_id}")
def get_report(session_id: int):

    db = SessionLocal()

    qa_list = (
        db.query(QuestionAnswer)
        .filter(QuestionAnswer.session_id == session_id)
        .all()
    )

    report = generate_report(qa_list)

    db.close()

    return {
        "session_id": session_id,
        "questions_answered": len(qa_list),
        "report": report
    }