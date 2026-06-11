from app.services.llm_service import get_llm


def generate_report(questions_answers):

    llm = get_llm()

    interview_text = "\n".join([
        f"Question: {qa.question}\nAnswer: {qa.answer}"
        for qa in questions_answers
    ])

    messages = [
        (
            "system",
            "Analyze the interview and provide a short evaluation."
        ),
        (
            "human",
            interview_text
        )
    ]

    response = llm.invoke(messages)

    return response.content