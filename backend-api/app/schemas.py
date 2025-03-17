from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from uuid import UUID

class JobCreate(BaseModel):
    id: UUID 
    title: str
    logo: Optional[str] = None
    companyName: str
    salaryMin: Optional[float] = None
    salaryMax: Optional[float] = None
    location: str
    employmentType: str
    experience: Optional[str] = None
    description: str
    jobTags: Optional[str] = None
    source_url: str

    model_config = {"arbitrary_types_allowed": True} 

class JobResponse(JobCreate):
    scrapeAt: datetime

    class Config:
        from_attributes = True
