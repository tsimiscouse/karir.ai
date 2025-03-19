from fastapi import FastAPI
from .database import engine
from . import models
from .routes import job_routes, job_matching, job_embeddings, resume_scoring
from celery.schedules import crontab
from .celery_tasks import celery_app

app = FastAPI()

# Create database tables
models.Base.metadata.create_all(bind=engine) 

# Include job routes
app.include_router(job_routes.router, prefix="/api", tags=["Jobs Fetching"]) 
app.include_router(job_matching.router, prefix="/api", tags=["Job Matching"])
app.include_router(job_embeddings.router, prefix="/api", tags=["Job Embeddings"])
app.include_router(resume_scoring.router, prefix="/api", tags=["Resume Scoring"])

@app.get("/")
def read_root():
    return {"message": "Hello from Senpro Backend Service!"}

celery_app.conf.beat_schedule = {
    "update-embeddings-every-day": {
        "task": "celery_tasks.update_daily_embeddings",
        "schedule": crontab(hour=0, minute=0),  # Runs every day at midnight
    },
}
