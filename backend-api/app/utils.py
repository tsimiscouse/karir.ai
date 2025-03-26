import json
import uuid
import datetime
from sqlalchemy.orm import Session
from sqlalchemy import insert
from sentence_transformers import SentenceTransformer 
from .database import SessionLocal
import numpy as np
import pdfplumber
from .models import UserInput, JobEmbeddings, JobPosting
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Load model
embedding_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

def get_db_session():
    """Create a database session."""
    return SessionLocal()

def extract_text_from_pdf(pdf_path):
    """Extract text from a PDF resume."""
    with pdfplumber.open(pdf_path) as pdf:
        return "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])

def get_resume_text(user_id):
    """Fetch resume text from users_input table."""
    db = get_db_session()
    try:
        user_resume = db.query(UserInput).filter(UserInput.id == user_id).first()
        return user_resume.resume if user_resume else None
    finally:
        db.close()

def compute_embedding(text):
    """Convert text into SentenceTransformer embedding."""
    return embedding_model.encode([text])[0]  # Get 768-dim vector

def get_job_embeddings():
    """Fetch job embeddings from job_embeddings table."""
    db = get_db_session()
    try:
        jobs = db.query(JobEmbeddings).all()
        return {job.job_id: np.array(json.loads(job.embedding)) for job in jobs}
    finally:
        db.close()


def generate_job_embedding(job_description: str):
    """
    Generate embeddings for the given job description using Sentence Transformers.
    """
    return embedding_model.encode(job_description).tolist()

def store_job_embeddings(db: Session):
    """
    Fetch all job descriptions, compute embeddings, and store them in the job_embeddings table.
    """
    jobs = db.query(JobPosting).all()
    for job in jobs:
        # Generate embedding
        embedding_vector = generate_job_embedding(job.description)

        # Insert into job_embeddings table
        db.execute(
            insert(JobEmbeddings).values(
                id=str(uuid.uuid4()),
                job_id=job.id,
                embedding=json.dumps(embedding_vector),
                created_at=datetime.datetime.utcnow(),
                updated_at=datetime.datetime.utcnow()
            )
        )
    db.commit()
