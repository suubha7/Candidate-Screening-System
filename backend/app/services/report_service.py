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
        """
You are a senior AI/ML technical interviewer.
Return ONLY plain text.
Format exactly like this:
Overall Rating: X/10

Strengths:
- ...
- ...

Weaknesses:
- ...
- ...

Knowledge Gaps:
- ...
- ...

Recommendations:
- ...
- ...

Job Eligibility:
Eligible
or
Not Eligible

Reason:
...

Do not use markdown.
Do not use ** symbols.
Do not use headings with #.
Return clean plain text only.
"""
    ),
    (
        "human",
        interview_text
    )
]

    response = llm.invoke(messages)

    return response.content