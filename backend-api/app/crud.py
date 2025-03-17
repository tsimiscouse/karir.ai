from uuid import UUID
from sqlalchemy.orm import Session
from .models import JobPosting
from .schemas import JobCreate
from datetime import datetime

def create_job(db: Session, job: JobCreate):
    db_job = JobPosting(
        id=UUID(str(job.id)),
        title=job.title,
        logo=job.logo,
        companyName=job.companyName,
        salaryMin=job.salaryMin,
        salaryMax=job.salaryMax,
        location=job.location,
        employmentType=job.employmentType,
        experience=job.experience,
        description=job.description,
        jobTags=job.jobTags,
        scrapeAt=datetime.utcnow(),
        source_url=job.source_url
    )
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

def get_jobs(db: Session, skip: int = 0, limit: int = 10):
    return db.query(JobPosting).offset(skip).limit(limit).all()
