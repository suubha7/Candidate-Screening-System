from app.services.llm_service import get_llm
import re


def _clean_question(text: str) -> str:
    text = re.sub(r"^\s*(?:[-*]\s*)?\d+[\).:-]\s+", "", text).strip()
    text = re.sub(r"^\s*(?:question\s*\d+\s*[:.-]\s*)", "", text, flags=re.I).strip()
    return text


def _parse_questions(text: str) -> list[str]:
    text = re.sub(
        r"^\s*here\s+are\s+\d+\s+.*?questions?\s*(?:based\s+on.*?)?:\s*",
        "",
        text,
        flags=re.I | re.S,
    ).strip()

    matches = re.findall(
        r"(?:^|\s)\d+[\).:-]\s+(.+?)(?=(?:\s+\d+[\).:-]\s+)|\Z)",
        text,
        flags=re.S,
    )
    raw_questions = matches if matches else text.splitlines()
    questions = [
        _clean_question(question)
        for question in raw_questions
        if _clean_question(question).endswith("?")
    ]

    return questions[:5]

def generate_questions(role, resume_skills, context):
    llm = get_llm()
    messages = [
    (
        "system",
        """
        You are an expert technical interviewer.
        Generate questions ONLY from the retrieved context.
        Do not introduce topics that are not present in the context.
        Return exactly 5 technical interview questions.
        Return ONLY the questions.
        Do not add an introduction.
        Do not add explanations.
        Do not combine multiple questions into one paragraph.
        """
    ),
    (
        "human",
        f"""
        Role: {role}
        Candidate Skills:
        {', '.join(resume_skills)}
        Retrieved Context:
        {context}
        """
    )
]

    response = llm.invoke(messages)

    questions = _parse_questions(response.content)
    return questions if questions else [_clean_question(response.content)]
