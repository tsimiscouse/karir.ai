from fastapi import FastAPI, UploadFile, File, APIRouter
import pdfplumber
import re
import textstat
import nltk
from collections import defaultdict
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI
app = FastAPI()
router = APIRouter()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load action verbs dataset
nltk.download("words")
action_verbs = {"led", "developed", "managed", "designed", "optimized", "achieved", "implemented", "analyzed"}

# Industry-specific keywords
industry_keywords = {
    "Technology": {"python", "java", "cloud", "machine learning", "sql", "api", "big data"},
    "Finance": {"investment", "risk analysis", "equity", "accounting", "auditing", "financial modeling"},
    "Marketing": {"branding", "SEO", "content strategy", "digital marketing", "social media"},
    "Healthcare": {"patient care", "clinical research", "diagnostics", "public health", "medical records"},
    "Education": {"curriculum", "pedagogy", "student assessment", "e-learning", "teaching methodology"},
    "General": {"communication", "teamwork", "leadership", "problem-solving", "adaptability"},
}

def extract_text_from_pdf(pdf_file):
    """Extract text from a PDF resume."""
    with pdfplumber.open(pdf_file) as pdf:
        return "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])

def detect_industry(text):
    """Determine the industry based on detected keywords."""
    industry_scores = {industry: sum(1 for word in words if word in text.lower()) for industry, words in industry_keywords.items()}
    detected_industry = max(industry_scores, key=industry_scores.get) if max(industry_scores.values()) > 0 else "General"
    return detected_industry

def keyword_score(text, industry):
    """Score based on industry-specific keywords."""
    matched_keywords = [word for word in industry_keywords[industry] if word in text.lower()]
    percentage = (len(matched_keywords) / len(industry_keywords[industry])) * 100 if industry_keywords[industry] else 0
    return {"percentage": round(percentage, 2), "matched_keywords_count": len(matched_keywords)}

def check_sections(text):
    """Check if the resume contains key sections."""
    sections = ["education", "experience", "skills", "projects", "certifications"]
    found = {section: (section in text.lower()) for section in sections}
    return sum(found.values()), found

def contact_info_score(text):
    """Ensure resume includes contact details (email, phone, LinkedIn)."""
    email = bool(re.search(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b", text))
    phone = bool(re.search(r"\b\d{10,}\b", text))
    linkedin = "linkedin.com" in text.lower()
    return (sum([email, phone, linkedin]) / 3) * 100  # Scaled to 100

def formatting_score(text):
    """Score formatting based on bullet points and spacing."""
    bullet_points = len(re.findall(r"[-•]", text)) > 5
    spacing = not bool(re.search(r"\n{3,}", text))
    return (bullet_points + spacing) * 50  # Score out of 100

def action_verb_score(text):
    """Check for strong action verbs in the resume."""
    words = set(text.lower().split())
    matches = len(words.intersection(action_verbs))
    return round(min(100, (matches / len(action_verbs)) * 100), 2)

def quantification_score(text):
    """Check for numbers (percentages, statistics) to show impact."""
    numbers = len(re.findall(r"\b\d+\b", text))
    return round(min(100, numbers * 10), 2)

def redundancy_score(text):
    """Penalize overused resume phrases."""
    overused_words = {"responsible for", "hardworking", "team player", "results-driven"}
    found = sum(1 for word in overused_words if word in text.lower())
    return max(0, 100 - (found * 20))

@router.post("/score_resume/")
async def score_resume(file: UploadFile = File(...)):
    text = extract_text_from_pdf(file.file)

    # Detect industry and calculate keyword match score
    detected_industry = detect_industry(text)
    keyword_match = keyword_score(text, detected_industry)

    # Calculate various scoring criteria
    length_score = min(100, max(0, (len(text.split()) - 250) / 350 * 100))
    section_count, section_scores = check_sections(text)
    readability = max(0, textstat.flesch_reading_ease(text))  # Ensure non-negative score
    contact_score = contact_info_score(text)
    formatting = formatting_score(text)
    action_verbs = action_verb_score(text)
    quantification = quantification_score(text)
    redundancy = redundancy_score(text)

    # Weighted final score calculation
    final_score = (length_score * 0.15 + section_count * 15 + keyword_match["percentage"] * 0.15 +
                   readability * 0.1 + contact_score * 0.1 +
                   formatting * 0.1 + action_verbs * 0.1 + quantification * 0.1 - redundancy * 0.05)
    
    final_score = round(min(100, max(0, final_score)), 2)  # Ensure score stays between 0-100

    return {
        "final_score": final_score,
        "detected_industry": detected_industry,
        "scores": {
            "length": round(length_score, 2),
            "sections": section_scores,
            "keywords": keyword_match,
            "readability": round(readability, 2),
            "contact_info": round(contact_score, 2),
            "formatting": round(formatting, 2),
            "action_verbs": action_verbs,
            "quantification": quantification,
            "redundancy": redundancy
        },
        "suggestions": {
            "missing_sections": [s for s, v in section_scores.items() if not v],
            "contact_info": "Add email, phone, or LinkedIn" if contact_score < 100 else "Complete",
            "redundant_phrases": "Avoid common phrases like 'hardworking' or 'responsible for'" if redundancy > 0 else "Good",
            "improve_formatting": "Use bullet points and avoid excessive spacing" if formatting < 100 else "Well-formatted",
            "industry_keywords": f"Consider adding more relevant {detected_industry} terms."
        }
    }

# Mount the router to the FastAPI app
app.include_router(router)
