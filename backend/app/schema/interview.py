from pydantic import BaseModel

class StartInterviewRequest(BaseModel):
    candidate_id: int
    role_id: int