from pydantic import BaseModel


class NextQuestionRequest(BaseModel):
    session_id: int
    question: str
    answer: str
    role: str