from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import requests
from app.database import get_db
import app.crud as crud 
from app.schemas import JobCreate, JobResponse
from app.models import JobPosting  
from typing import List
from uuid import uuid4
import time

API_URL = "https://jobdataapi.com/api/jobs/?country_code=ID&max_age=30&page="

router = APIRouter()

@router.post("/store-job", response_model=JobResponse)
def store_job(job: JobCreate, db: Session = Depends(get_db)):
    return crud.create_job(db, job)

@router.post("/store-jobs", response_model=List[JobResponse])
def store_jobs(jobs: List[JobCreate], db: Session = Depends(get_db)):
    return [crud.create_job(db, job) for job in jobs]

@router.get("/jobs", response_model=List[JobResponse])
def get_jobs(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_jobs(db, skip, limit)

@router.post("/fetch-store-jobs")
def fetch_store_jobs(db: Session = Depends(get_db)):
    api_url = "https://jobdataapi.com/api/jobs/?country_code=ID&max_age=30"
    response = requests.get(api_url)

    if response.status_code == 429:  # If rate-limited
        wait_time = int(response.headers.get("Retry-After", 10))  # Use Retry-After header if available
        print(f"Rate limited! Waiting for {wait_time} seconds...")
        time.sleep(wait_time)  # Wait before retrying
        return {"message": "Rate limited, try again later"}

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch job data")

    data = response.json()
    raw_jobs = data["results"]

    new_jobs = []

    for job in raw_jobs:
        # Check if job already exists
        existing_job = db.query(JobPosting).filter(
            JobPosting.title == job["title"],
            JobPosting.companyName == job["company"]["name"],
            JobPosting.location == job["location"]
        ).first()

        if existing_job:
            continue  # Skip this job, it's a duplicate

        # Create new job object
        new_job = JobCreate(
            id=uuid4(),
            title=job["title"],
            companyName=job["company"]["name"],
            logo=job["company"].get("logo", "Unknown"),
            salaryMin=job.get("salary_min", -1),
            salaryMax=job.get("salary_max", -1),
            location=job["location"],
            employmentType=job["types"][0]["name"] if job["types"] else "Unknown",
            experience=job.get("experience_level", "Unknown"),
            description=job["description"],
            jobTags=", ".join([tag["name"] for tag in job.get("types", [])]) if job["types"] else "",
            source_url=job.get("application_url", "Unknown")
        )
        
        new_jobs.append(new_job)

    # Store only unique jobs
    created_jobs = [crud.create_job(db, job) for job in new_jobs]
    return created_jobs

'''
# @router.post("/fetch-store-jobs/{page}", response_model=List[JobResponse])
# def fetch_store_jobs(page: int, db: Session = Depends(get_db)):
    """
    Fetch and store job listings from a specific page.
    Example: /fetch-store-jobs/1 fetches jobs from page 1.
    """
    api_url = f"{API_URL}{page}"
    response = requests.get(api_url)

    if response.status_code == 429:  # If rate-limited
        wait_time = int(response.headers.get("Retry-After", 10))  # Use Retry-After header if available
        print(f"Rate limited! Waiting for {wait_time} seconds...")
        time.sleep(wait_time)  # Wait before retrying
        return {"message": "Rate limited, try again later"}

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch job data")

    data = response.json()
    raw_jobs = data["results"]

    new_jobs = []

    for job in raw_jobs:
        # Check if job already exists
        existing_job = db.query(JobPosting).filter(
            JobPosting.title == job["title"],
            JobPosting.companyName == job["company"]["name"],
            JobPosting.location == job["location"]
        ).first()

        if existing_job:
            continue  # Skip this job, it's a duplicate

        # Create new job object
        new_job = JobCreate(
            id=uuid4(),
            title=job["title"],
            companyName=job["company"]["name"],
            logo=job["company"].get("logo", "Unknown"),
            salaryMin=job.get("salary_min", -1),
            salaryMax=job.get("salary_max", -1),
            location=job["location"],
            employmentType=job["types"][0]["name"] if job["types"] else "Unknown",
            experience=job.get("experience_level", "Unknown"),
            description=job["description"],
            jobTags=", ".join([tag["name"] for tag in job.get("types", [])]) if job["types"] else "",
            source_url=job.get("application_url", "Unknown")
        )
        
        new_jobs.append(new_job)

    # Store only unique jobs
    created_jobs = [crud.create_job(db, job) for job in new_jobs]
    return created_jobs
'''

@router.post("/fetch-store-jobs/{country}", response_model=List[JobResponse])
def fetch_store_jobs(country: str, db: Session = Depends(get_db)):
    """
    Fetch and store job listings from a specific country.
    Example: /fetch-store-jobs/MY fetches jobs from Malaysia.
    """
    api_url = f"https://jobdataapi.com/api/jobs/?country_code={country}"
    response = requests.get(api_url)

    if response.status_code == 429:  # If rate-limited
        wait_time = int(response.headers.get("Retry-After", 10))  # Use Retry-After header if available
        print(f"Rate limited! Waiting for {wait_time} seconds...")
        time.sleep(wait_time)  # Wait before retrying
        return {"message": "Rate limited, try again later"}

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch job data")

    data = response.json()
    raw_jobs = data["results"]

    new_jobs = []

    for job in raw_jobs:
        # Check if job already exists
        existing_job = db.query(JobPosting).filter(
            JobPosting.title == job["title"],
            JobPosting.companyName == job["company"]["name"],
            JobPosting.location == job["location"]
        ).first()

        if existing_job:
            continue  # Skip this job, it's a duplicate

        # Create new job object
        new_job = JobCreate(
            id=uuid4(),
            title=job["title"],
            companyName=job["company"]["name"],
            logo=job["company"].get("logo", "Unknown"),
            salaryMin=job.get("salary_min", -1),
            salaryMax=job.get("salary_max", -1),
            location=job["location"],
            employmentType=job["types"][0]["name"] if job["types"] else "Unknown",
            experience=job.get("experience_level", "Unknown"),
            description=job["description"],
            jobTags=", ".join([tag["name"] for tag in job.get("types", [])]) if job["types"] else "",
            source_url=job.get("application_url", "Unknown")
        )
        
        new_jobs.append(new_job)

    # Store only unique jobs
    created_jobs = [crud.create_job(db, job) for job in new_jobs]
    return created_jobs

@router.delete("/delete-all-jobs")
def delete_all_jobs(db: Session = Depends(get_db)):
    try:
        deleted_rows = db.query(JobPosting).delete()  # Deletes all rows
        db.commit()  # Commit the transaction

        return {"message": f"Successfully deleted {deleted_rows} job postings"}
    
    except Exception as e:
        db.rollback()  # Rollback if there's an error
        raise HTTPException(status_code=500, detail=f"Error deleting jobs: {str(e)}")

