from fastapi import FastAPI
from app.api.candidate import candidate_router
from app.api.roles import role_router
from app.database.database import engine
from app.database.model import Base

Base.metadata.create_all(bind=engine)

app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "Hello World"}

app.include_router(candidate_router)
app.include_router(role_router)