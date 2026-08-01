from fastapi import FastAPI

from app.core.database import engine, Base
from app.models.user import User

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="InsightIQ API",
    description="AI Business Intelligence & Decision Support Platform",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "Welcome to InsightIQ API",
        "status": "Running"
    }