from services.resume_service import extract_text_from_pdf
from services.skill_extraction_service import extract_skills

path = "uploads/Subham_Maharana_AI_Engineer.pdf"

resume_text = extract_text_from_pdf(path)

skills = extract_skills(resume_text)

print(skills)