from fastapi import FastAPI

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