from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
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
from io import BytesIO
import re
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

interview_router = APIRouter()

REPORT_SECTIONS = [
    "Overall Rating",
    "Strengths",
    "Weaknesses",
    "Knowledge Gaps",
    "Recommendations",
    "Job Eligibility",
    "Reason",
]


def parse_evaluation_report(report_text: str):
    parsed = {section: "" for section in REPORT_SECTIONS}
    pattern = r"(?im)^\s*(Overall Rating|Strengths|Weaknesses|Knowledge Gaps|Recommendations|Job Eligibility|Reason)\s*:\s*"
    matches = list(re.finditer(pattern, report_text or ""))

    for index, match in enumerate(matches):
        section = match.group(1)
        start = match.end()
        end = matches[index + 1].start() if index + 1 < len(matches) else len(report_text)
        parsed[section] = report_text[start:end].strip()

    return {
        "overall_rating": parsed["Overall Rating"],
        "strengths": parsed["Strengths"],
        "weaknesses": parsed["Weaknesses"],
        "knowledge_gaps": parsed["Knowledge Gaps"],
        "recommendations": parsed["Recommendations"],
        "job_eligibility": parsed["Job Eligibility"],
        "reason": parsed["Reason"],
    }


def get_report_payload(session_id: int):
    db = SessionLocal()

    session = (
        db.query(InterviewSession)
        .filter(InterviewSession.id == session_id)
        .first()
    )

    if not session:
        db.close()
        raise HTTPException(status_code=404, detail="Interview session not found")

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
    qa_list = (
        db.query(QuestionAnswer)
        .filter(QuestionAnswer.session_id == session_id)
        .all()
    )

    report_text = generate_report(qa_list)

    payload = {
        "session_id": session.id,
        "status": session.status,
        "questions_answered": len(qa_list),
        "candidate": {
            "name": candidate.name if candidate else "Unknown",
            "email": candidate.email if candidate else "Unknown",
        },
        "role": {
            "id": role.id if role else None,
            "name": role.role_name if role else "Unknown",
        },
        "experience_level": session.experience_level,
        "report": report_text,
        "evaluation": parse_evaluation_report(report_text),
    }

    db.close()
    return payload


def safe_filename(value: str):
    return re.sub(r"[^A-Za-z0-9_-]+", "_", value or "Candidate").strip("_")


def bullet_lines(value: str):
    lines = []
    for line in (value or "Not available").splitlines():
        cleaned = re.sub(r"^\s*[-*]\s*", "", line).strip()
        if cleaned:
            lines.append(cleaned)
    return lines or ["Not available"]


def build_report_pdf(payload):
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=0.7 * inch,
        leftMargin=0.7 * inch,
        topMargin=0.65 * inch,
        bottomMargin=0.65 * inch,
    )

    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(
        name="ReportTitle",
        parent=styles["Title"],
        fontSize=22,
        leading=28,
        textColor=colors.HexColor("#111827"),
        spaceAfter=8,
    ))
    styles.add(ParagraphStyle(
        name="SectionTitle",
        parent=styles["Heading2"],
        fontSize=13,
        leading=16,
        textColor=colors.HexColor("#1f2937"),
        spaceBefore=14,
        spaceAfter=8,
    ))
    styles.add(ParagraphStyle(
        name="BodyTextSmall",
        parent=styles["BodyText"],
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#374151"),
    ))

    evaluation = payload["evaluation"]
    candidate = payload["candidate"]
    role = payload["role"]

    story = [
        Paragraph("AI Candidate Screening Report", styles["ReportTitle"]),
        Paragraph("Professional interview evaluation summary", styles["BodyTextSmall"]),
        Spacer(1, 0.18 * inch),
        Paragraph("Candidate Information", styles["SectionTitle"]),
    ]

    info_rows = [
        ["Name", candidate["name"]],
        ["Email", candidate["email"]],
        ["Role", role["name"]],
        ["Experience Level", payload.get("experience_level") or "Not available"],
        ["Session ID", str(payload["session_id"])],
        ["Status", payload["status"]],
    ]
    info_table = Table(info_rows, colWidths=[1.55 * inch, 4.8 * inch])
    info_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#eef2ff")),
        ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#3730a3")),
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTNAME", (1, 0), (1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#cbd5e1")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ROWBACKGROUNDS", (1, 0), (1, -1), [colors.white, colors.HexColor("#f8fafc")]),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    story.extend([info_table, Spacer(1, 0.12 * inch), Paragraph("Interview Evaluation", styles["SectionTitle"])])

    evaluation_rows = [
        ["Overall Rating", evaluation["overall_rating"] or "Not available"],
        ["Job Eligibility", evaluation["job_eligibility"] or "Not available"],
        ["Strengths", "<br/>".join(f"&bull; {item}" for item in bullet_lines(evaluation["strengths"]))],
        ["Weaknesses", "<br/>".join(f"&bull; {item}" for item in bullet_lines(evaluation["weaknesses"]))],
        ["Knowledge Gaps", "<br/>".join(f"&bull; {item}" for item in bullet_lines(evaluation["knowledge_gaps"]))],
        ["Recommendations", "<br/>".join(f"&bull; {item}" for item in bullet_lines(evaluation["recommendations"]))],
        ["Reason", evaluation["reason"] or "Not available"],
    ]
    evaluation_table = Table(
        [[Paragraph(label, styles["BodyTextSmall"]), Paragraph(value, styles["BodyTextSmall"])] for label, value in evaluation_rows],
        colWidths=[1.55 * inch, 4.8 * inch],
    )
    evaluation_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f1f5f9")),
        ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#0f172a")),
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#cbd5e1")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    story.append(evaluation_table)

    doc.build(story)
    buffer.seek(0)
    return buffer


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
    return get_report_payload(session_id)


@interview_router.get("/report/{session_id}/pdf")
def get_report_pdf(session_id: int):
    payload = get_report_payload(session_id)
    pdf_buffer = build_report_pdf(payload)
    candidate_name = safe_filename(payload["candidate"]["name"])
    filename = f"{candidate_name}_Session_{session_id}_Report.pdf"

    return Response(
        content=pdf_buffer.getvalue(),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        },
    )
