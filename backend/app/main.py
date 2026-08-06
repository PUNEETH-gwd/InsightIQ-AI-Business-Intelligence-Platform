from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.auth import router as auth_router
from app.core.database import engine, Base
from app.models.user import User
from app.models.dataset import Dataset
from app.api.v1.datasets import router as dataset_router
from app.api.v1 import ml
from app.api.v1 import pdf

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="InsightIQ API",
    description="AI Business Intelligence & Decision Support Platform",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(dataset_router)
app.include_router(ml.router)
app.include_router(pdf.router, prefix="/api/v1")

@app.get("/")
def root():
    return {
        "message": "Welcome to InsightIQ API",
        "status": "Running"
    }