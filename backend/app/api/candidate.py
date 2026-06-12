from fastapi import APIRouter, UploadFile, File, Form
from app.services.resume_service import extract_text_from_pdf
from app.services.skill_extraction_service import extract_skills
from app.database.database import SessionLocal
from app.database.model import Candidate
import os

candidate_router =  APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@candidate_router.post("/upload_resume")
async def upload_resume(
    name: str=Form(...),
    email: str=Form(...),
    resume: UploadFile= File(...)
):
    file_path = os.path.join(UPLOAD_DIR, resume.filename)

    with open(file_path, "wb") as buffer:
        content = await resume.read()
        buffer.write(content)
    
    resume_text = extract_text_from_pdf(file_path)
    skills = extract_skills(resume_text)

    db = SessionLocal()

    candidate = Candidate(
        name=name,
        email=email,
        resume_path=file_path,
        resume_text=resume_text,
        skills=",".join(skills.skills)
    )

    db.add(candidate)
    db.commit()
    db.refresh(candidate)

    db.close()

    return {
        "id": candidate.id,
        "candidate_id": candidate.id,
        "name": name,
        "email": email,
        "filename": resume.filename,
        "saved_path": file_path,
        "resume_text": resume_text,
        "skills": skills
    } 
