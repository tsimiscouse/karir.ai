from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
import requests
from app.database import get_db
import app.crud as crud 
from app.schemas import JobCreate, JobListingResponse, JobResponse, PaginationMeta
from app.models import JobPosting  
from typing import List
from uuid import uuid4
import time

API_URL = "https://jobdataapi.com/api/jobs/?country_code=ID&max_age=30&page="

router = APIRouter()

def get_filtered_jobs(db: Session, page: int, limit: int, search: Optional[str], locations: Optional[str]):
    query = db.query(JobPosting)

    if search:
        search_terms = search.replace("+", " ").split()
        search_conditions = [JobPosting.title.ilike(f"%{term}%") for term in search_terms]
        query = query.filter(or_(*search_conditions))

    if locations:
        location_list = [loc.strip() for loc in locations.split(",")]
        location_conditions = [JobPosting.location.ilike(f"%{loc}%") for loc in location_list]
        query = query.filter(or_(*location_conditions))

    total_items = query.count()  
    total_pages = (total_items // limit) + (1 if total_items % limit > 0 else 0) 

    offset = (page - 1) * limit
    jobs = query.offset(offset).limit(limit).all()

    return jobs, total_items, total_pages

@router.post("/store-job", response_model=JobResponse)
def store_job(job: JobCreate, db: Session = Depends(get_db)):
    return crud.create_job(db, job)

@router.post("/store-jobs", response_model=List[JobResponse])
def store_jobs(jobs: List[JobCreate], db: Session = Depends(get_db)):
    return [crud.create_job(db, job) for job in jobs]

@router.get("/jobs", response_model=JobListingResponse)
def get_jobs(
    page: int = Query(1, alias="page", description="Page number"),
    limit: int = Query(10, alias="limit", description="Number of jobs per page"),
    search: Optional[str] = Query(None, alias="search", description="Search query for job title"),
    locations: Optional[str] = Query(None, alias="locations", description="Comma-separated locations"),
    db: Session = Depends(get_db),
):
    jobs, total_items, total_pages = get_filtered_jobs(db, page, limit, search, locations)

    job_responses = [JobResponse(**job.__dict__) for job in jobs]

    return JobListingResponse(
        data=job_responses,
        meta=PaginationMeta(
            current_page=page,
            total_pages=total_pages,
            total_items=total_items
        )
    )

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

