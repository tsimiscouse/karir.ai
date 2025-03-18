from celery import Celery
from .database import SessionLocal
from .utils import store_job_embeddings

celery_app = Celery("tasks", broker="redis://localhost:6379/0")

@celery_app.task
def update_daily_embeddings():
    """
    Celery task to update job embeddings daily.
    """
    db = SessionLocal()
    store_job_embeddings(db)
    db.close()
