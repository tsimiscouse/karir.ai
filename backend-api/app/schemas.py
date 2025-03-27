from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from uuid import UUID
from typing import List, Optional

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

class PaginationMeta(BaseModel):
    current_page: int
    total_pages: int
    total_items: int

class JobListingResponse(BaseModel):
    data: List[JobResponse]
    meta: PaginationMeta

class ResumeAnalysisBase(BaseModel):
    userInputId: str
    resumeScore: float
    analysis: str

class ResumeAnalysisCreate(ResumeAnalysisBase):
    pass  # For creating a new record

class ResumeAnalysisResponse(ResumeAnalysisBase):
    createdAt: datetime

    class Config:
        from_attributes = True
