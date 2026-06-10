from pydantic import BaseModel
from .llm_service import get_llm


class SkillsOutput(BaseModel):
    skills: list[str]


def extract_skills(resume_text: str) -> SkillsOutput:
    llm = get_llm()

    structured_llm = llm.with_structured_output(SkillsOutput)

    messages = [
        ("system", "You are a helpful assistant."),
        ("human", f"Extract all technical skills from this resume:\n\n{resume_text}")
    ]

    return structured_llm.invoke(messages)