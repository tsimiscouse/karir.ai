import datetime
from http.client import HTTPException
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import RecommendedJobsTitle, JobListing, JobPosting
from app.utils import get_resume_text, compute_embedding, get_job_embeddings
from sklearn.metrics.pairwise import cosine_similarity
import uuid

router = APIRouter()

def get_top_5_jobs(user_id: str, db: Session):
    """Find and store the top 5 job recommendations for a user."""
    
    # Get user resume text
    resume_text = get_resume_text(user_id)
    if not resume_text:
        return {"error": "No resume found for user."}

    # Compute SentenceTransformer embedding for user resume
    resume_embedding = compute_embedding(resume_text)

    # Get job embeddings from the database
    job_embeddings = get_job_embeddings()

    # Compute cosine similarity between resume and job embeddings
    similarity_scores = {
        job_id: float(cosine_similarity([resume_embedding], [embedding])[0][0])  # Ensure float conversion
        for job_id, embedding in job_embeddings.items()
    }

    # Get top 5 job matches
    top_5_jobs = sorted(similarity_scores.items(), key=lambda x: x[1], reverse=True)[:5]

    # Store recommendations in the database
    for job_id, score in top_5_jobs:
        job_exists = db.query(JobListing).filter(JobListing.id == str(job_id)).first()
        
        if not job_exists:
            # Get job details from job_scrape
            job_scrape = db.query(JobPosting).filter(JobPosting.id == job_id).first()
            if job_scrape:
                job_listing = JobListing(
                    id=str(job_scrape.id),
                    title=job_scrape.title or "Unknown Title",
                    logo=job_scrape.logo or "No logo available",
                    companyName=job_scrape.companyName or "Unknown Company",
                    salaryMin=job_scrape.salaryMin if job_scrape.salaryMin is not None else -1,
                    salaryMax=job_scrape.salaryMax if job_scrape.salaryMax is not None else -1,
                    location=job_scrape.location or "Unknown Location",
                    employmentType=job_scrape.employmentType or "Unknown",
                    experience=job_scrape.experience or "Not specified",
                    description=job_scrape.description or "No description available",
                    jobTags=job_scrape.jobTags or "Not specified",
                    scrapeAt=job_scrape.scrapeAt or datetime.utcnow(),
                    source_url=job_scrape.source_url or "No source available"
                )
                db.add(job_listing) 

        recommended_job = RecommendedJobsTitle(
            id=str(uuid.uuid4()),
            userInputId=str(user_id),
            jobListingId=str(job_id),
            similarity_score=score  
        )
        db.add(recommended_job)

    db.commit()
    
    return [{"job_id": job[0], "similarity_score": job[1]} for job in top_5_jobs]

@router.get("/recommend_jobs/{user_id}")
def recommend_jobs(user_id: str, db: Session = Depends(get_db)):
    """API endpoint to get and store top 5 job recommendations."""
    top_jobs = get_top_5_jobs(user_id, db)
    return {"user_id": user_id, "recommendations": top_jobs}
    
@router.get("/job-details/{id}")
def get_job_by_id(id: str, db: Session = Depends(get_db)):
    job = db.query(JobListing).filter(JobListing.id == id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return {
        "id": job.id,
        "title": job.title,
        "logo": job.logo,
        "companyName": job.companyName,
        "salaryMin": job.salaryMin,
        "salaryMax": job.salaryMax,
        "location": job.location,
        "employmentType": job.employmentType,
        "experience": job.experience,
        "description": job.description,
        "jobTags": job.jobTags,
        "scrapeAt": job.scrapeAt,
        "source_url": job.source_url
    }