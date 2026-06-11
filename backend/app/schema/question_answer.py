from pydantic import BaseModel

class AnswerRequest(BaseModel):
    session_id: int
    question: str
    answer: str