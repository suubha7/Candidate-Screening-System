from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.candidate import candidate_router
from app.api.roles import role_router
from app.api.interview import interview_router
from app.database.database import engine
from app.database.model import Base

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)


@app.get("/")
def read_root():
    return {"message": "Hello World"}

app.include_router(candidate_router)
app.include_router(role_router)
app.include_router(interview_router)
