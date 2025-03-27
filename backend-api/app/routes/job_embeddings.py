from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.utils import store_job_embeddings

router = APIRouter()

@router.post("/generate-embeddings")
def generate_embeddings(db: Session = Depends(get_db)):
    """
    Endpoint to generate and store embeddings for all job listings.
    """
    store_job_embeddings(db)
    return {"message": "Embeddings generated and stored successfully"}
