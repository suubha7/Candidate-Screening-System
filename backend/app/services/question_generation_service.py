from app.services.llm_service import get_llm

def generate_questions(role, resume_skills, context):
    llm = get_llm()
    messages = [
    (
        "system",
        """
        You are an expert technical interviewer.
        Generate questions ONLY from the retrieved context.
        Do not introduce topics that are not present in the context.
        Return exactly 5 questions.
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

    return response.content