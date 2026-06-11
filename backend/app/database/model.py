from sqlalchemy import Column, String, Integer, Text, ForeignKey
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String)

    resume_path = Column(String)
    resume_text = Column(Text)
    skills = Column(Text)


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True)

    role_name = Column(String)
    required_skills = Column(Text)


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True)
    candidate_id = Column(
        Integer,
        ForeignKey("candidates.id")
    )

    role_id = Column(
        Integer,
        ForeignKey("roles.id")
    )
    status = Column(String)

class QuestionAnswer(Base):
    __tablename__ = "question_answers"

    id = Column(Integer, primary_key=True)

    session_id = Column(
        Integer,
        ForeignKey("interview_sessions.id")
    )

    question = Column(Text)
    answer = Column(Text)