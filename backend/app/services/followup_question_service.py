from app.services.llm_service import get_llm


def generate_followup_question(
    previous_question: str,
    candidate_answer: str,
    role: str
):

    llm = get_llm()

    messages = [
    (
        "system",
        """
        You are an expert technical interviewer.
        Generate exactly one follow-up interview question.
        Return ONLY the question.

        Do not add explanations.
        Do not add introductions.
        Do not add bullet points.
        """
    ),
    (
        "human",
        f"""
        Role: {role}
        Previous Question:
        {previous_question}
        Candidate Answer:
        {candidate_answer}
        """
    )
]

    response = llm.invoke(messages)

    return response.content