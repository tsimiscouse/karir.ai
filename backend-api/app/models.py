import uuid
from sqlalchemy import Column, String, Integer, Float, DateTime, Text, UUID
from sqlalchemy.dialects.postgresql import UUID 
from datetime import datetime
from app.database import Base

class JobPosting(Base):
    __tablename__ = "job_scrape"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    title = Column(String, nullable=False)
    logo = Column(String, nullable=True)
    companyName = Column(String, nullable=False)
    salaryMin = Column(Float, nullable=True)
    salaryMax = Column(Float, nullable=True)
    location = Column(String, nullable=False)
    employmentType = Column(String, nullable=False)
    experience = Column(String, nullable=True)
    description = Column(Text, nullable=False)
    jobTags = Column(String, nullable=True)
    scrapeAt = Column(DateTime, default=datetime.utcnow)
    source_url = Column(String, nullable=True)

