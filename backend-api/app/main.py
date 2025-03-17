from fastapi import FastAPI
from .database import engine
from . import models
from .routes import job_routes

app = FastAPI()

# Create database tables
models.Base.metadata.create_all(bind=engine) 

# Include job routes
app.include_router(job_routes.router, prefix="/api", tags=["jobs"]) 

@app.get("/")
def read_root():
    return {"message": "Hello from Senpro Backend Service!"}
