from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import requests
from app.database import get_db
import app.crud as crud 
from app.schemas import JobCreate, JobResponse
from typing import List
from uuid import uuid4
import time

API_URL = "https://jobdataapi.com/api/jobs/?country_code=ID&max_age=30"

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
    api_url = API_URL
    all_jobs = []

    while api_url:  # Keep fetching until there are no more pages
        response = requests.get(api_url)
        if response.status_code == 429:  # If rate-limited
            wait_time = int(response.headers.get("Retry-After", 10))  # Use Retry-After header if available
            print(f"Rate limited! Waiting for {wait_time} seconds...")
            time.sleep(wait_time)  # Wait before retrying
            continue  # Retry the same request

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to fetch job data")

        data = response.json()
        raw_jobs = data["results"]
        all_jobs.extend(raw_jobs)  # Append jobs from this page
        
        api_url = data.get("next")  # Get the next page URL

        time.sleep(1.5)  # Prevent hitting rate limits too fast

    transformed_jobs = [
        JobCreate(
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
        ) for job in all_jobs
    ]

    return [crud.create_job(db, job) for job in transformed_jobs]
