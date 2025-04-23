import uuid
from sqlalchemy import Column, String, Float, DateTime, Text, ForeignKey, JSON, TIMESTAMP, Integer
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.dialects.postgresql import UUID 
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

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

class JobEmbeddings(Base):
    __tablename__ = "job_embeddings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(UUID(as_uuid=True), ForeignKey("job_scrape.id", ondelete="CASCADE"), nullable=False)
    embedding = Column(JSON, nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow, nullable=False)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, nullable=False)

class JobListing(Base):
    __tablename__ = "job_listings"

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
    jobTags = Column(String, nullable=True, default="Not specified")
    scrapeAt = Column(DateTime, default=datetime.utcnow)
    source_url = Column(String, nullable=True)

class UserInput(Base):
    __tablename__ = "users_input"

    id = Column(String, primary_key=True, index=True)
    resume = Column(String)

    resume_analysis = relationship("ResumeAnalysis", back_populates="user")

class RecommendedJobsTitle(Base):
    __tablename__ = "recommended_jobs_title"

    id = Column(String, primary_key=True, index=True)
    userInputId = Column(String, ForeignKey("users_input.id"))
    jobListingId = Column(String, ForeignKey("job_listings.id"))
    similarity_score = Column(Float)

class ResumeAnalysis(Base):
    __tablename__ = "resume_analysis"

    id = Column(String, primary_key=True, index=True)
    userInputId = Column(String, ForeignKey("users_input.id"), nullable=False)
    resumeScore = Column(Float, nullable=False)
    analysis = Column(JSONB)
    createdAt = Column(TIMESTAMP, default=datetime.utcnow)

    user = relationship("UserInput", back_populates="resume_analysis")
