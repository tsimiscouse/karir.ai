from datetime import datetime
from http.client import HTTPException
import uuid
from fastapi import FastAPI, UploadFile, File, APIRouter, Depends, Body
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import ResumeAnalysis
import pdfplumber
import re
import textstat
import nltk
from collections import defaultdict
from fastapi.middleware.cors import CORSMiddleware
import string
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
import statistics

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

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Enhanced action verbs dataset - expanded significantly
action_verbs = {
    "achieved", "administered", "advanced", "advised", "analyzed", "assembled", "assessed", "assigned",
    "attained", "authored", "balanced", "built", "calculated", "chaired", "coached", "collaborated",
    "communicated", "compiled", "computed", "conceptualized", "conducted", "consolidated", "constructed",
    "consulted", "contracted", "controlled", "converted", "coordinated", "created", "customized", 
    "decreased", "defined", "delegated", "delivered", "demonstrated", "designed", "determined", "developed",
    "devised", "directed", "distributed", "documented", "doubled", "drove", "earned", "edited", "eliminated",
    "enabled", "engineered", "enhanced", "established", "evaluated", "executed", "expanded", "expedited",
    "fabricated", "facilitated", "forecasted", "formulated", "founded", "generated", "guided", "handled",
    "headed", "identified", "implemented", "improved", "increased", "influenced", "initiated", "innovated",
    "inspected", "installed", "instituted", "instructed", "integrated", "introduced", "invented", "launched",
    "led", "maintained", "managed", "marketed", "maximized", "mediated", "mentored", "minimized", "modernized",
    "monitored", "motivated", "negotiated", "operated", "optimized", "orchestrated", "organized", "overhauled",
    "oversaw", "performed", "pioneered", "planned", "prepared", "presented", "processed", "produced", 
    "programmed", "proposed", "provided", "published", "purchased", "recommended", "reconciled", "recorded",
    "redesigned", "reduced", "refined", "reinforced", "reorganized", "researched", "resolved", "restored",
    "restructured", "revamped", "reviewed", "revised", "revitalized", "saved", "scheduled", "secured",
    "selected", "simplified", "solved", "spearheaded", "standardized", "streamlined", "strengthened",
    "supervised", "supported", "surpassed", "synthesized", "targeted", "taught", "tested", "trained",
    "transformed", "translated", "upgraded", "utilized", "validated", "verified", "visualized", "wrote"
}

# Expanded industry-specific keywords with more comprehensive coverage
industry_keywords = {
    "Technology": {
        "python", "java", "javascript", "typescript", "react", "angular", "vue", "node.js", "express", 
        "django", "flask", "fastapi", "docker", "kubernetes", "aws", "azure", "gcp", "cloud", "devops", 
        "ci/cd", "jenkins", "github actions", "git", "agile", "scrum", "jira", "machine learning", "ai", 
        "data science", "big data", "hadoop", "spark", "sql", "nosql", "mongodb", "postgresql", "mysql", 
        "api", "rest", "graphql", "microservices", "serverless", "linux", "unix", "cybersecurity", 
        "network security", "blockchain", "iot", "frontend", "backend", "full stack", "mobile development",
        "ios", "android", "swift", "kotlin", "react native", "flutter", "ui/ux", "figma", "sketch"
    },
    "Finance": {
        "investment", "portfolio management", "risk analysis", "equity", "stocks", "bonds", "derivatives", 
        "options", "futures", "hedge funds", "private equity", "venture capital", "m&a", "financial modeling", 
        "valuation", "dcf", "accounting", "gaap", "ifrs", "financial statements", "balance sheet", "income statement", 
        "cash flow", "budgeting", "forecasting", "auditing", "compliance", "sarbanes-oxley", "financial regulation", 
        "fintech", "blockchain", "cryptocurrency", "bitcoin", "ethereum", "payment processing", "insurance", 
        "actuarial", "underwriting", "claims", "banking", "commercial banking", "investment banking", "credit analysis", 
        "loan origination", "mortgage", "capital markets", "trading", "bloomberg terminal", "refinitiv", "factset"
    },
    "Marketing": {
        "branding", "brand strategy", "brand identity", "marketing strategy", "digital marketing", "content marketing", 
        "social media marketing", "influencer marketing", "email marketing", "seo", "sem", "ppc", "google ads", 
        "facebook ads", "instagram ads", "tiktok marketing", "content strategy", "copywriting", "content creation", 
        "content calendar", "content distribution", "analytics", "google analytics", "marketing attribution", "a/b testing", 
        "conversion rate optimization", "customer acquisition", "customer retention", "customer journey", "marketing funnel", 
        "lead generation", "market research", "competitive analysis", "product marketing", "pricing strategy", 
        "marketing automation", "hubspot", "marketo", "mailchimp", "crm", "salesforce", "event marketing", 
        "trade shows", "public relations", "media relations", "press releases"
    },
    "Healthcare": {
        "patient care", "clinical research", "clinical trials", "diagnostics", "medical devices", "pharmaceuticals", 
        "biotechnology", "healthcare informatics", "electronic health records", "ehr", "emr", "hipaa", "patient privacy", 
        "medical coding", "icd-10", "cpt", "medical billing", "healthcare administration", "hospital management", 
        "healthcare policy", "public health", "epidemiology", "biostatistics", "telemedicine", "remote patient monitoring", 
        "preventive care", "chronic disease management", "population health", "healthcare analytics", "quality improvement", 
        "patient safety", "clinical workflow", "medical staff credentialing", "healthcare compliance", "medicare", 
        "medicaid", "health insurance", "payer relations", "value-based care", "patient experience", "clinical documentation"
    },
    "Education": {
        "curriculum development", "instructional design", "pedagogy", "teaching methodology", "student assessment", 
        "educational technology", "e-learning", "lms", "canvas", "blackboard", "moodle", "google classroom", 
        "remote learning", "hybrid learning", "k-12 education", "higher education", "special education", "iep", 
        "differentiated instruction", "stem education", "steam", "project-based learning", "inquiry-based learning", 
        "student engagement", "classroom management", "educational leadership", "academic advising", "student support", 
        "academic research", "grant writing", "educational policy", "standardized testing", "formative assessment", 
        "summative assessment", "learning outcomes", "rubrics", "educational psychology", "cognitive development", 
        "professional development", "teacher training", "educational equity", "diversity and inclusion"
    },
    "General": {
        "communication", "teamwork", "leadership", "management", "project management", "problem-solving", "critical thinking", 
        "decision making", "time management", "organization", "adaptability", "flexibility", "innovation", "creativity", 
        "emotional intelligence", "interpersonal skills", "negotiation", "conflict resolution", "customer service", 
        "client relations", "strategic planning", "operational excellence", "process improvement", "resource management", 
        "budget management", "cost reduction", "revenue growth", "performance metrics", "kpis", "data analysis", 
        "presentation skills", "public speaking", "writing", "reporting", "collaboration", "cross-functional", 
        "stakeholder management", "change management", "crisis management", "risk management", "compliance", "ethics"
    },
}

# Expanded list of overused resume phrases for redundancy analysis
overused_phrases = {
    "responsible for": 0.8,
    "duties included": 0.8,
    "worked on": 0.7,
    "assisted with": 0.7,
    "helped with": 0.7,
    "involved in": 0.7,
    "participated in": 0.6,
    "experienced in": 0.6,
    "familiar with": 0.5,
    "knowledge of": 0.5,
    "skilled in": 0.4,
    "proficient in": 0.4,
    "results-driven": 0.9,
    "detail-oriented": 0.9,
    "team player": 0.9,
    "hardworking": 0.9,
    "go-getter": 0.9,
    "self-starter": 0.8,
    "proactive": 0.7,
    "excellent communication skills": 0.8,
    "strong analytical skills": 0.7,
    "proven track record": 0.8,
    "think outside the box": 0.9,
    "hit the ground running": 0.9,
    "go above and beyond": 0.8,
    "at the end of the day": 0.8,
    "synergy": 0.9,
    "best of breed": 0.9,
    "win-win": 0.8,
    "value add": 0.8,
    "dynamic": 0.7,
    "references available upon request": 0.9,
}

# Section names and their expected content patterns for depth analysis
section_content_patterns = {
    "education": [
        r"(bachelor|master|ph\.?d|mba|b\.?s|m\.?s|b\.?a|m\.?a)",
        r"(university|college|institute|school)",
        r"(20\d{2}|19\d{2})", # years
        r"(gpa|cum laude|magna cum laude|summa cum laude|honors|distinction)"
    ],
    "experience": [
        r"(20\d{2}|19\d{2})", # years
        r"(present|current|now)",
        r"(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)",
        r"\b[A-Z][a-z]+ (Inc|LLC|Ltd|Corp|Corporation|Company)\b"
    ],
    "skills": [
        r"(technical|soft|hard|language|programming|computer|software|hardware)",
        r"(proficient|fluent|familiar|experienced|certified|advanced|intermediate|beginner)"
    ],
    "projects": [
        r"(github|gitlab|bitbucket|repository|repo)",
        r"(project|developed|created|built|implemented|designed)",
        r"(team|solo|collaborated|partnered)"
    ],
    "certifications": [
        r"(certified|certificate|certification|license|licensed)",
        r"(awarded|earned|received|completed|achieved)",
        r"(20\d{2}|19\d{2})" # years
    ]
}

def extract_text_from_pdf(pdf_file):
    """Extract text from a PDF resume."""
    with pdfplumber.open(pdf_file) as pdf:
        return "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])

def preprocess_text(text):
    """Clean and preprocess text for analysis."""
    text_lower = text.lower()
    # Remove punctuation except for important symbols like % $ @ - •
    translator = str.maketrans('', '', ''.join(c for c in string.punctuation if c not in ['%', '$', '@', '-', '•']))
    text_clean = text_lower.translate(translator)
    return text_clean

def detect_industry(text):
    """Determine the industry based on detected keywords using TF-IDF like approach."""
    text_lower = text.lower()
    
    # Count occurrences of keywords for each industry
    industry_counts = {}
    industry_weights = {}
    
    for industry, keywords in industry_keywords.items():
        # Create a weighted score - rare keywords across industries get higher weight
        keyword_counts = {}
        for keyword in keywords:
            count = text_lower.count(keyword)
            if count > 0:
                # Give higher weight to multi-word terms that are more specific
                term_weight = 1 + 0.5 * keyword.count(" ")
                keyword_counts[keyword] = count * term_weight
        
        industry_counts[industry] = sum(keyword_counts.values())
        industry_weights[industry] = len(keyword_counts) / len(keywords) if keywords else 0
    
    # Compute final score as a combination of total keyword count and keyword coverage
    industry_scores = {
        industry: (count * 0.6) + (industry_weights[industry] * 100 * 0.4)
        for industry, count in industry_counts.items()
    }
    
    detected_industry = max(industry_scores, key=industry_scores.get) if industry_scores and max(industry_scores.values()) > 0 else "General"
    return detected_industry, industry_scores

def keyword_score(text, industry):
    """Enhanced score based on industry-specific keywords with context awareness."""
    text_lower = text.lower()
    
    # Track all matches with their counts
    matched_keywords = {}
    sentences = sent_tokenize(text_lower)
    
    for keyword in industry_keywords[industry]:
        # Count direct matches
        direct_matches = text_lower.count(keyword)
        
        # Analyze context - higher weight if keyword appears in achievement contexts
        context_bonus = 0
        for sentence in sentences:
            if keyword in sentence:
                # Check if sentence contains achievement indicators
                if any(verb in sentence for verb in action_verbs):
                    context_bonus += 0.3
                # Check if sentence contains metrics
                if re.search(r'\d+%|\d+x|\$\d+|increased|decreased|reduced|improved', sentence):
                    context_bonus += 0.3
        
        if direct_matches > 0:
            matched_keywords[keyword] = direct_matches + context_bonus
    
    # Calculate keyword density relative to total keywords
    percentage = (len(matched_keywords) / len(industry_keywords[industry])) * 100 if industry_keywords[industry] else 0
    
    # Calculate weighted score - factoring in both presence and effective usage
    total_keyword_score = sum(matched_keywords.values())
    weighted_score = (percentage * 0.7) + min(30, total_keyword_score) * (100/30) * 0.3
    
    return {
        "percentage": round(min(100, weighted_score), 2),
        "matched_keywords_count": len(matched_keywords),
        "matched_keywords": list(matched_keywords.keys())[:10]  # Return top 10 matches
    }

def check_sections(text):
    """Enhanced section checking with depth analysis."""
    sections = {"education": [], "experience": [], "skills": [], "projects": [], "certifications": []}
    text_lower = text.lower()
    
    # Check for section headers
    section_found = {section: False for section in sections}
    
    # Split text into potential sections
    lines = text_lower.split('\n')
    current_section = None
    section_content = {}
    
    # First identify sections
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        for section in sections:
            # Check if line is a section header (either standalone or with formatting)
            if re.search(fr'\b{section}\b', line.lower()) and (len(line) < 30 or line.lower().startswith(section)):
                current_section = section
                section_found[section] = True
                section_content[section] = []
                break
                
        if current_section and line and not any(section in line.lower() for section in sections if section != current_section):
            section_content.setdefault(current_section, []).append(line)
    
    # Analyze depth of each section
    section_depth = {}
    for section, content in section_content.items():
        section_text = " ".join(content)
        depth_score = 0
        
        if section in section_content_patterns:
            for pattern in section_content_patterns[section]:
                if re.search(pattern, section_text, re.IGNORECASE):
                    depth_score += 25  # Each pattern is worth 25 points
        
        # Cap at 100
        section_depth[section] = min(100, depth_score)
    
    # Fill in missing sections
    for section in sections:
        if section not in section_depth:
            section_depth[section] = 0
    
    # Calculate average depth score for found sections
    found_sections = sum(1 for s, found in section_found.items() if found)
    avg_depth = sum(depth for section, depth in section_depth.items() if section_found[section]) / max(1, found_sections)
    
    return found_sections, section_found, section_depth, round(avg_depth, 2)

def contact_info_score(text):
    """Enhanced check for contact details with quality assessment."""
    # Basic presence checks
    email_matches = re.findall(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b", text)
    phone_matches = re.findall(r"(?:\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}", text)
    linkedin = "linkedin.com" in text.lower()
    portfolio = any(x in text.lower() for x in ["portfolio", "github.com", "gitlab.com", "bitbucket.org", "website"])
    location = bool(re.search(r"\b[A-Z][a-z]+,\s*[A-Z]{2}\b", text))  # City, State format
    
    # Quality assessment
    contact_quality = 0
    
    # Email quality (professional vs personal)
    if email_matches:
        email = email_matches[0].lower()
        professional_domains = ["gmail.com", "outlook.com", "hotmail.com", "yahoo.com", "icloud.com", "me.com"]
        if any(domain in email for domain in professional_domains):
            contact_quality += 15
        else:
            # Could be a custom or university domain - give full points
            contact_quality += 20
    
    # Phone formatting
    if phone_matches:
        contact_quality += 20
    
    # Professional networking
    if linkedin:
        contact_quality += 20
    
    # Portfolio/website
    if portfolio:
        contact_quality += 20
    
    # Location information
    if location:
        contact_quality += 20
    
    # Calculate base score from presence of essential elements
    base_score = sum([bool(email_matches), bool(phone_matches), linkedin]) / 3 * 60
    
    # Combine base score with quality score
    return round(base_score + min(40, contact_quality), 2)

def formatting_score(text):
    """Enhanced formatting scoring with more comprehensive checks."""
    # Check for bullet point usage
    bullet_points_count = len(re.findall(r"[-•]", text))
    bullet_points_score = min(30, bullet_points_count * 3)
    
    # Check for consistent spacing - not too cramped, not too spacious
    excessive_spacing = len(re.findall(r"\n{3,}", text))
    spacing_score = max(0, 20 - excessive_spacing * 5)
    
    # Check for section headers (capitalization, bolding patterns)
    section_header_patterns = [
        r'[A-Z]{2,}.*\n',              # ALL CAPS followed by newline
        r'\*\*.*\*\*',                 # Markdown bold
        r'__.*__',                     # Alternative markdown bold
        r'[A-Z][a-z]+\s*[A-Z][a-z]+:',  # Title Case with colon
    ]
    
    section_headers_found = 0
    for pattern in section_header_patterns:
        section_headers_found += len(re.findall(pattern, text))
    
    section_headers_score = min(20, section_headers_found * 4)
    
    # Check for consistent date formatting
    date_patterns = [
        r'\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}\b',  # Month Year
        r'\b\d{1,2}/\d{1,2}/\d{2,4}\b',  # MM/DD/YYYY
        r'\b\d{4}-\d{2}-\d{2}\b',        # YYYY-MM-DD
    ]
    
    date_formats_found = set()
    for pattern in date_patterns:
        if re.search(pattern, text):
            date_formats_found.add(pattern)
    
    date_consistency_score = 15 if len(date_formats_found) == 1 else max(0, 15 - (len(date_formats_found) - 1) * 5)
    
    # Check for consistent company/role formatting
    role_patterns = [
        r'[A-Z][a-z]+ [A-Z][a-z]+, [A-Z][a-z]+ [A-Z][a-z]+',  # Title, Company
        r'[A-Z][a-z]+ [A-Z][a-z]+ at [A-Z][a-z]+ [A-Z][a-z]+',  # Title at Company
    ]
    
    role_formats_found = set()
    for pattern in role_patterns:
        if re.search(pattern, text):
            role_formats_found.add(pattern)
    
    role_consistency_score = 15 if role_formats_found else 0
    
    # Calculate total formatting score
    total_formatting_score = bullet_points_score + spacing_score + section_headers_score + date_consistency_score + role_consistency_score
    
    return round(total_formatting_score, 2)

def action_verb_score(text):
    """Enhanced check for strong action verbs with context awareness."""
    words = word_tokenize(text.lower())
    stop_words = set(stopwords.words('english'))
    
    # Calculate total meaningful words (excluding stop words)
    meaningful_words = [word for word in words if word not in stop_words and word.isalpha()]
    
    # Find action verbs
    found_verbs = [word for word in meaningful_words if word in action_verbs]
    unique_verbs = set(found_verbs)
    
    # Calculate basic frequency
    verb_frequency = len(found_verbs) / max(1, len(meaningful_words))
    
    # Calculate verb diversity (unique verbs)
    verb_diversity = len(unique_verbs) / max(1, len(found_verbs)) if found_verbs else 0
    
    # Check if verbs are at the beginning of bullet points or sentences
    lines = text.split('\n')
    leading_verb_lines = 0
    
    for line in lines:
        line = line.strip()
        if line.startswith('-') or line.startswith('•'):
            first_word = line[1:].strip().split(' ')[0].lower()
            if first_word in action_verbs:
                leading_verb_lines += 1
        elif line and line[0].isupper():  # Potential sentence
            first_word = line.split(' ')[0].lower()
            if first_word in action_verbs:
                leading_verb_lines += 1
    
    # Calculate leading verb score
    leading_verb_ratio = leading_verb_lines / max(1, len([l for l in lines if l.strip()]))
    
    # Calculate final verb score with weights
    frequency_score = min(50, verb_frequency * 200)  # Cap at 50
    diversity_score = verb_diversity * 25
    leading_score = leading_verb_ratio * 25
    
    final_verb_score = frequency_score + diversity_score + leading_score
    
    return round(min(100, final_verb_score), 2)

def quantification_score(text):
    """Enhanced check for metrics and quantifiable achievements."""
    # Look for different types of metrics
    percentage_matches = re.findall(r'\b\d+%', text)
    currency_matches = re.findall(r'[$€£¥]\d+(?:[.,]\d+)*(?:K|M|B)?|\d+(?:[.,]\d+)*\s*(?:dollars|euros|pounds)', text, re.IGNORECASE)
    numeric_range_matches = re.findall(r'\d+\s*-\s*\d+', text)
    numeric_improvement = re.findall(r'(increased|decreased|reduced|improved|grew|saved|generated|delivered)(?:\s\w+){0,5}\s\d+', text, re.IGNORECASE)
    time_metrics = re.findall(r'\d+\s*(days|weeks|months|years|quarters)', text, re.IGNORECASE)
    scale_metrics = re.findall(r'(?:team|group|department) of \d+', text, re.IGNORECASE)
    
    # Count different metric types used
    metric_types_used = sum([
        bool(percentage_matches),
        bool(currency_matches),
        bool(numeric_improvement), 
        bool(time_metrics),
        bool(scale_metrics),
        bool(numeric_range_matches)
    ])
    
    # Count total metrics mentioned
    total_metrics = len(percentage_matches) + len(currency_matches) + len(numeric_improvement) + len(time_metrics) + len(scale_metrics) + len(numeric_range_matches)
    
    # Check for metrics in context of achievements
    sentences = sent_tokenize(text.lower())
    contextual_metrics = 0
    
    for sentence in sentences:
        has_metric = bool(re.search(r'\d+%|\$\d+|\d+x|\d+ percent|\d+ team members', sentence))
        has_achievement = bool(re.search(r'achieved|increased|improved|reduced|decreased|generated|delivered|saved|won|awarded', sentence))
        
        if has_metric and has_achievement:
            contextual_metrics += 1
    
    # Calculate scores for different components
    metric_type_score = metric_types_used * 10  # Up to 60 points for using diverse metrics
    metric_count_score = min(20, total_metrics * 2)  # Up to 20 points for quantity
    context_score = min(20, contextual_metrics * 5)  # Up to 20 points for contextual usage
    
    # Calculate final quantification score 
    final_score = metric_type_score + metric_count_score + context_score
    
    return round(min(100, final_score), 2)

def redundancy_score(text):
    """Enhanced redundancy scoring with phrase frequency analysis and contextual scoring."""
    text_lower = text.lower()
    words = word_tokenize(text_lower)
    word_count = len(words)
    
    # Initialize penalty score
    penalty = 0
    found_phrases = {}
    
    # Check for overused phrases 
    for phrase, penalty_weight in overused_phrases.items():
        count = text_lower.count(phrase)
        if count > 0:
            # Scale penalty based on:
            # 1. How overused the phrase is (penalty_weight)
            # 2. How many times it appears
            # 3. Relative to resume length
            normalized_count = count / (word_count / 500)  # Normalize for 500-word resume
            phrase_penalty = normalized_count * penalty_weight * 10
            penalty += phrase_penalty
            found_phrases[phrase] = count
    
    # Check for phrase repetition (when same phrase is used multiple times in close proximity)
    lines = text.lower().split('\n')
    for i in range(len(lines)):
        if not lines[i].strip():
            continue
        
        for j in range(i+1, min(i+5, len(lines))):
            if not lines[j].strip():
                continue
                
            line1_tokens = set(word_tokenize(lines[i]))
            line2_tokens = set(word_tokenize(lines[j]))
            
            # If lines are very similar (>70% overlap)
            if len(line1_tokens) > 3 and len(line2_tokens) > 3:
                overlap = len(line1_tokens.intersection(line2_tokens))
                if overlap / min(len(line1_tokens), len(line2_tokens)) > 0.7:
                    penalty += 5
    
    # Check for repetitive sentence structures
    sentence_starters = []
    for sentence in sent_tokenize(text_lower):
        if not sentence.strip():
            continue
        
        words = word_tokenize(sentence)
        if words:
            sentence_starters.append(words[0])
    
    # Penalize repetitive sentence starters
    starter_counts = defaultdict(int)
    for starter in sentence_starters:
        starter_counts[starter] += 1
    
    repetitive_starters_penalty = sum(count - 1 for count in starter_counts.values() if count > 2) * 2
    penalty += repetitive_starters_penalty
    
    # Calculate final redundancy score (100 is best - no redundancy)
    redundancy_score = max(0, 100 - penalty)
    
    return round(redundancy_score, 2), found_phrases

def readability_score(text, industry):
    """Enhanced readability scoring with industry-specific benchmarks."""
    # Get base readability scores
    flesch_reading_ease = textstat.flesch_reading_ease(text)
    flesch_kincaid_grade = textstat.flesch_kincaid_grade(text)
    
    # Industry-specific optimal reading levels
    # Higher score is better for flesch_reading_ease (easier to read)
    # Lower score is better for flesch_kincaid_grade (lower grade level)
    industry_benchmarks = {
        "Technology": {"min_ease": 40, "max_ease": 60, "ideal_grade": 11},
        "Finance": {"min_ease": 30, "max_ease": 50, "ideal_grade": 12},
        "Marketing": {"min_ease": 50, "max_ease": 70, "ideal_grade": 10},
        "Healthcare": {"min_ease": 45, "max_ease": 65, "ideal_grade": 12},
        "Education": {"min_ease": 50, "max_ease": 70, "ideal_grade": 11},
        "General": {"min_ease": 50, "max_ease": 70, "ideal_grade": 10},
    }
    
    benchmark = industry_benchmarks.get(industry, industry_benchmarks["General"])
    
    # Score the ease of reading (50% of score)
    if flesch_reading_ease < benchmark["min_ease"]:
        # Too complex - penalize proportionally to how far below minimum
        ease_score = 50 * (flesch_reading_ease / benchmark["min_ease"])
    elif flesch_reading_ease > benchmark["max_ease"]:
        # Too simplistic - penalize proportionally to how far above maximum
        excess = flesch_reading_ease - benchmark["max_ease"]
        ease_score = max(0, 50 * (1 - (excess / 30)))  # Penalty increases with distance from max
    else:
        # Within ideal range - full points
        ease_score = 50
    
    # Score the grade level (50% of score)
    grade_diff = abs(flesch_kincaid_grade - benchmark["ideal_grade"])
    grade_score = 50 * max(0, (1 - (grade_diff / 5)))  # Lose points proportionally to distance from ideal
    
    # Calculate sentence complexity diversity
    sentences = sent_tokenize(text)
    sentence_lengths = [len(word_tokenize(s)) for s in sentences if s.strip()]
    
    # Bonus for having varied sentence structures (up to 10 points)
    if sentence_lengths:
        length_variance = statistics.variance(sentence_lengths) if len(sentence_lengths) > 1 else 0
        structure_bonus = min(10, length_variance / 5)
    else:
        structure_bonus = 0
        
    final_score = ease_score + grade_score + structure_bonus
    
    return round(min(100, final_score), 2), {
        "flesch_reading_ease": round(flesch_reading_ease, 2),
        "flesch_kincaid_grade": round(flesch_kincaid_grade, 2),
        "industry_ideal_range": f"{benchmark['min_ease']}-{benchmark['max_ease']}",
        "industry_ideal_grade": benchmark["ideal_grade"]
    }

def relevance_score(text, job_description=None):
    """Evaluate relevance to a specific job description if provided."""
    if not job_description:
        return 50, {"message": "No job description provided for comparison"}
    
    # Clean and tokenize both texts
    resume_words = set(word_tokenize(text.lower()))
    jd_words = set(word_tokenize(job_description.lower()))
    
    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    resume_keywords = [w for w in resume_words if w.isalpha() and w not in stop_words]
    jd_keywords = [w for w in jd_words if w.isalpha() and w not in stop_words]
    
    # Calculate direct keyword match
    common_keywords = set(resume_keywords) & set(jd_keywords)
    keyword_coverage = len(common_keywords) / max(1, len(set(jd_keywords))) * 100
    
    # Extract key phrases from job description (noun phrases)
    jd_phrases = extract_noun_phrases(job_description)
    resume_phrases = extract_noun_phrases(text)
    
    phrase_matches = set(resume_phrases) & set(jd_phrases)
    phrase_coverage = len(phrase_matches) / max(1, len(set(jd_phrases))) * 100
    
    # Check for required skills/qualifications
    required_pattern = r"(required|requirements|qualifications|must have|essential).*?(?=\n\n|\Z)"
    required_sections = re.findall(required_pattern, job_description.lower(), re.DOTALL)
    
    required_coverage = 0
    missing_key_requirements = []
    
    if required_sections:
        required_text = " ".join(required_sections)
        required_skills = extract_key_requirements(required_text)
        
        matched_requirements = 0
        for skill in required_skills:
            if skill.lower() in text.lower():
                matched_requirements += 1
            else:
                missing_key_requirements.append(skill)
        
        required_coverage = matched_requirements / max(1, len(required_skills)) * 100
    
    # Calculate weighted relevance score
    weighted_score = (keyword_coverage * 0.3) + (phrase_coverage * 0.3) + (required_coverage * 0.4)
    
    return round(min(100, weighted_score), 2), {
        "keyword_match_percentage": round(keyword_coverage, 2),
        "phrase_match_percentage": round(phrase_coverage, 2),
        "required_skills_coverage": round(required_coverage, 2),
        "missing_key_requirements": missing_key_requirements[:5]  # Top 5 missing requirements
    }

def extract_noun_phrases(text):
    """Extract important noun phrases from text."""
    # This is a simplified version - in a real implementation, use NLP libraries like spaCy
    # for proper noun phrase extraction
    sentences = sent_tokenize(text.lower())
    phrases = []
    
    # Simple patterns for common resume/job description noun phrases
    patterns = [
        r'\b([a-z]+ing\s[a-z]+(?:\s[a-z]+)?)\b',  # gerund phrases
        r'\b([a-z]+\s(?:management|analysis|development|engineering|design|implementation))\b',
        r'\b((?:senior|junior|lead|principal)\s[a-z]+(?:\s[a-z]+)?)\b',  # job titles
        r'\b([a-z]+\s(?:tools|methodologies|technologies|platforms|languages|frameworks))\b'
    ]
    
    for sentence in sentences:
        for pattern in patterns:
            matches = re.findall(pattern, sentence)
            phrases.extend(matches)
    
    return phrases

def extract_key_requirements(text):
    """Extract key requirements from job description text."""
    lines = text.split('\n')
    requirements = []
    
    for line in lines:
        line = line.strip()
        # Bullet points often indicate requirements
        if line.startswith('•') or line.startswith('-') or line.startswith('*'):
            requirements.append(line[1:].strip())
        # Look for skill mentions
        elif re.search(r'\b(?:experience|knowledge|familiarity|proficiency|ability) (?:in|with|of|to)\b', line, re.IGNORECASE):
            requirements.append(line)
    
    # If no structured requirements found, extract sentences with key requirement indicators
    if not requirements:
        sentences = sent_tokenize(text)
        for sentence in sentences:
            if re.search(r'\b(?:require|must|should|need to|able to)\b', sentence, re.IGNORECASE):
                requirements.append(sentence)
    
    return requirements

def education_score(text):
    """Evaluate education section quality."""
    text_lower = text.lower()
    
    # Look for education section
    education_pattern = r"(?:education|academic background|qualification|degrees).*?(?=\n\n|\Z)"
    education_section = re.search(education_pattern, text_lower, re.DOTALL)
    
    if not education_section:
        return 0, {"message": "No education section found"}
    
    education_text = education_section.group(0)
    
    # Check for degree details
    degree_types = ["ph.d", "phd", "doctorate", "master", "ms", "ma", "mba", "bachelor", "bs", "ba", "associate", "certification"]
    found_degrees = [degree for degree in degree_types if degree in education_text]
    
    # Check for institution details
    has_institutions = bool(re.search(r"university|college|institute|school", education_text))
    
    # Check for dates/years
    has_years = bool(re.search(r"20\d{2}|19\d{2}", education_text))
    
    # Check for GPA or honors
    has_gpa = bool(re.search(r"gpa|[0-9]\.[0-9]|cum laude|honors|distinction", education_text))
    
    # Check for relevant coursework or thesis
    has_coursework = bool(re.search(r"coursework|courses|thesis|dissertation|project|research", education_text))
    
    # Check for structure and formatting
    has_structure = bool(re.search(r"[-•]|^\s*\w+:", education_text, re.MULTILINE))
    
    # Calculate education score components
    components = {
        "degrees": 30 if found_degrees else 0,
        "institutions": 20 if has_institutions else 0,
        "dates": 15 if has_years else 0,
        "gpa_honors": 15 if has_gpa else 0,
        "coursework": 10 if has_coursework else 0,
        "structure": 10 if has_structure else 0
    }
    
    total_score = sum(components.values())
    
    return round(total_score, 2), {
        "found_degrees": found_degrees,
        "has_detailed_information": bool(has_institutions and has_years),
        "includes_performance_metrics": has_gpa,
        "components": components
    }

def work_experience_score(text):
    """Evaluate work experience section quality."""
    text_lower = text.lower()
    
    # Look for experience section
    experience_pattern = r"(?:experience|employment|work history|professional background).*?(?=\n\n|\Z)"
    experience_section = re.search(experience_pattern, text_lower, re.DOTALL)
    
    if not experience_section:
        return 0, {"message": "No work experience section found"}
    
    experience_text = experience_section.group(0)
    lines = experience_text.split('\n')
    
    # Check for company names
    company_pattern = r"\b[A-Z][a-z]+ (?:Inc|LLC|Ltd|Corp|Corporation|Company)\b|\b[A-Z][A-Z]+\b"
    companies = re.findall(company_pattern, experience_text)
    
    # Check for job titles
    title_pattern = r"\b(senior|junior|lead|principal|manager|director|specialist|analyst|engineer|developer|designer|coordinator|associate)\b"
    has_titles = bool(re.search(title_pattern, experience_text, re.IGNORECASE))
    
    # Check for dates/duration
    has_dates = bool(re.search(r"(20\d{2}|19\d{2})(-|–|to)?(20\d{2}|19\d{2}|present|current)", experience_text))
    
    # Check for bullet points with accomplishments
    bullet_points = [line for line in lines if line.strip().startswith('-') or line.strip().startswith('•')]
    
    # Count bullet points that start with action verbs and include metrics
    strong_bullets = 0
    for bullet in bullet_points:
        first_word = bullet.strip('-• ').split(' ')[0].lower() if bullet.strip() else ""
        if first_word in action_verbs:
            strong_bullets += 1
            if re.search(r'\d+%|\$\d+|\d+\s*x|\bby\s+\d+', bullet):
                strong_bullets += 1  # Extra point for quantified results
    
    # Calculate experience score components
    num_companies = len(set(companies))
    
    components = {
        "companies": min(20, num_companies * 10),  # Up to 20 points for multiple companies
        "job_titles": 15 if has_titles else 0,
        "dates": 15 if has_dates else 0,
        "bullet_structure": min(20, len(bullet_points) * 2),  # Up to 20 points for structured bullets
        "strong_bullets": min(30, strong_bullets * 3)  # Up to 30 points for strong accomplishment bullets
    }
    
    total_score = sum(components.values())
    
    return round(total_score, 2), {
        "number_of_positions": num_companies,
        "bullet_points_count": len(bullet_points),
        "strong_bullets_count": strong_bullets,
        "has_dates_and_titles": bool(has_dates and has_titles),
        "components": components
    }

def skills_score(text, industry):
    """Evaluate skills section quality with industry relevance."""
    text_lower = text.lower()
    
    # Look for skills section
    skills_pattern = r"(?:skills|technical skills|proficiencies|competencies|expertise).*?(?=\n\n|\Z)"
    skills_section = re.search(skills_pattern, text_lower, re.DOTALL)
    
    if not skills_section:
        return 0, {"message": "No skills section found"}
    
    skills_text = skills_section.group(0)
    
    # Extract skills from section
    potential_skills = re.findall(r"[-•]\s*([^-•\n]+)|\b([a-z]+(?:\s+[a-z]+)?(?:\s*[,&]\s*[a-z]+(?:\s+[a-z]+)?)*)\b", skills_text)
    extracted_skills = []
    
    for skill_tuple in potential_skills:
        for part in skill_tuple:
            if part and len(part) > 2:  # Ignore empty matches and too short terms
                skills = [s.strip() for s in part.split(',')]
                extracted_skills.extend(skills)
    
    extracted_skills = list(set([s for s in extracted_skills if len(s) > 2]))
    
    # Check organization and categorization
    has_categories = bool(re.search(r"technical|soft|programming|software|language|hardware|framework", skills_text))
    
    # Check for skill levels
    has_proficiency = bool(re.search(r"proficient|advanced|intermediate|beginner|expert|familiar", skills_text))
    
    # Calculate industry relevance of skills
    industry_relevant_skills = 0
    if industry in industry_keywords:
        for skill in extracted_skills:
            if any(keyword in skill for keyword in industry_keywords[industry]):
                industry_relevant_skills += 1
    
    industry_relevance_percentage = (industry_relevant_skills / max(1, len(extracted_skills))) * 100
    
    # Calculate skills score components
    components = {
        "skills_count": min(30, len(extracted_skills) * 2),  # Up to 30 points for number of skills
        "organization": 20 if has_categories else 0,
        "proficiency_levels": 20 if has_proficiency else 0,
        "industry_relevance": round(industry_relevance_percentage * 0.3)  # Up to 30 points for relevance
    }
    
    total_score = sum(components.values())
    
    return round(total_score, 2), {
        "skills_count": len(extracted_skills),
        "extracted_skills": extracted_skills[:10],  # List first 10 skills
        "industry_relevant_count": industry_relevant_skills,
        "has_organization": has_categories,
        "has_proficiency_levels": has_proficiency,
        "components": components
    }

def achievements_projects_score(text):
    """Evaluate achievements and projects sections."""
    text_lower = text.lower()
    
    # Look for achievements and projects sections
    achievements_pattern = r"(?:achievements|accomplishments|awards|recognition).*?(?=\n\n|\Z)"
    projects_pattern = r"(?:projects|portfolio|publications|research).*?(?=\n\n|\Z)"
    
    achievements_section = re.search(achievements_pattern, text_lower, re.DOTALL)
    projects_section = re.search(projects_pattern, text_lower, re.DOTALL)
    
    has_achievements = bool(achievements_section)
    has_projects = bool(projects_section)
    
    score = 0
    details = {"has_achievements_section": has_achievements, "has_projects_section": has_projects}
    
    # Evaluate achievements section if present
    if has_achievements:
        achievements_text = achievements_section.group(0)
        
        # Check for quantified achievements
        quantified = bool(re.search(r'\d+%|\$\d+|\d+\s*x|\bby\s+\d+', achievements_text))
        
        # Check for recognition indicators
        recognition = bool(re.search(r'award|honor|recipient|recognized|selected|chosen|earned', achievements_text))
        
        score += 25  # Base points for having the section
        score += 10 if quantified else 0
        score += 10 if recognition else 0
        
        details["achievements_quantified"] = quantified
        details["includes_recognition"] = recognition
    
    # Evaluate projects section if present
    if has_projects:
        projects_text = projects_section.group(0)
        
        # Check for project descriptions with technical details
        tech_details = bool(re.search(r'using|developed with|built on|implemented|designed|created|technology|stack|platform', projects_text))
        
        # Check for project outcomes or impact
        outcomes = bool(re.search(r'resulted in|achieved|improved|increased|reduced|enabled|solved|outcome|impact', projects_text))
        
        # Check for links to portfolio, GitHub, etc.
        links = bool(re.search(r'github|gitlab|bitbucket|portfolio|link|url|website', projects_text))
        
        score += 25  # Base points for having the section
        score += 10 if tech_details else 0
        score += 10 if outcomes else 0
        score += 10 if links else 0
        
        details["projects_technical_details"] = tech_details
        details["projects_outcomes_mentioned"] = outcomes
        details["includes_project_links"] = links
    
    return round(score, 2), details

def length_appropriateness(text):
    """Evaluate if resume length is appropriate."""
    # Count words, lines, and pages (estimated)
    words = word_tokenize(text)
    word_count = len(words)
    lines = text.split('\n')
    line_count = len([line for line in lines if line.strip()])
    
    # Estimate pages (typical resume has ~50 lines per page)
    estimated_pages = line_count / 50
    
    # Evaluate appropriateness
    if estimated_pages < 0.7:  # Less than 3/4 page
        return 50, {
            "message": "Resume appears too short. Consider adding more relevant details.",
            "estimated_pages": round(estimated_pages, 1),
            "word_count": word_count
        }
    elif estimated_pages > 2.2:  # More than 2 pages
        return 70, {
            "message": "Resume may be too long. Consider focusing on most relevant and recent information.",
            "estimated_pages": round(estimated_pages, 1),
            "word_count": word_count
        }
    elif estimated_pages > 1.8:  # Around 2 pages
        return 90, {
            "message": "Resume length is appropriate for experienced professionals (about 2 pages).",
            "estimated_pages": round(estimated_pages, 1),
            "word_count": word_count
        }
    else:  # 1-1.5 pages
        return 100, {
            "message": "Resume length is ideal (1-2 pages).",
            "estimated_pages": round(estimated_pages, 1),
            "word_count": word_count
        }

def analyze_resume(text, job_description=None):
    """Comprehensive resume analysis."""
    # Clean and preprocess text
    text_clean = preprocess_text(text)
    
    # Basic industry detection
    detected_industry, industry_scores = detect_industry(text)
    
    # Perform comprehensive analysis
    analysis = {
        "industry_detection": {
            "detected_industry": detected_industry,
            "industry_scores": {k: round(v, 2) for k, v in industry_scores.items() if v > 0}
        },
        "keyword_analysis": keyword_score(text, detected_industry),
        "sections_analysis": {
            "found_sections": check_sections(text)[0],
            "section_presence": check_sections(text)[1],
            "section_depth": check_sections(text)[2],
            "depth_score": check_sections(text)[3]
        },
        "contact_info": contact_info_score(text),
        "formatting": formatting_score(text),
        "action_verbs": action_verb_score(text),
        "quantification": quantification_score(text),
        "redundancy": redundancy_score(text)[0],
        "overused_phrases": redundancy_score(text)[1],
        "readability": readability_score(text, detected_industry)[0],
        "readability_details": readability_score(text, detected_industry)[1],
        "education": education_score(text)[0],
        "education_details": education_score(text)[1],
        "work_experience": work_experience_score(text)[0],
        "work_experience_details": work_experience_score(text)[1],
        "skills": skills_score(text, detected_industry)[0],
        "skills_details": skills_score(text, detected_industry)[1],
        "achievements_projects": achievements_projects_score(text)[0],
        "achievements_projects_details": achievements_projects_score(text)[1],
        "length": length_appropriateness(text)[0],
        "length_details": length_appropriateness(text)[1]
    }
    
    # Add job relevance if job description provided
    if job_description:
        analysis["job_relevance"] = relevance_score(text, job_description)[0]
        analysis["job_relevance_details"] = relevance_score(text, job_description)[1]
    
    # Calculate overall score with weighted components
    weights = {
        "keyword_analysis": 0.10,
        "sections_analysis": 0.05,
        "contact_info": 0.05,
        "formatting": 0.05,
        "action_verbs": 0.10,
        "quantification": 0.10,
        "redundancy": 0.05,
        "readability": 0.05,
        "education": 0.10,
        "work_experience": 0.15,
        "skills": 0.10,
        "achievements_projects": 0.05,
        "length": 0.05
    }
    
    # Add job relevance weight if available
    if job_description:
        # Adjust weights to include job relevance
        for key in weights:
            weights[key] *= 0.8  # Reduce other weights to make room for job relevance
        weights["job_relevance"] = 0.2
    
    # Calculate overall score
    overall_score = 0
    for key, weight in weights.items():
        if key in analysis and isinstance(analysis[key], (int, float)):
            overall_score += analysis[key] * weight
    
    analysis["overall_score"] = round(overall_score, 2)
    
    # Generate improvement recommendations
    analysis["recommendations"] = generate_recommendations(analysis)
    
    return analysis

def generate_recommendations(analysis):
    """Generate personalized recommendations based on analysis results."""
    recommendations = []
    
    # Prioritize areas with lowest scores
    focus_areas = []
    for area, score in analysis.items():
        if isinstance(score, (int, float)) and area != "overall_score":
            focus_areas.append((area, score))
    
    # Sort by score (ascending)
    focus_areas.sort(key=lambda x: x[1])
    
    # Generate specific recommendations for weakest areas
    for area, score in focus_areas[:3]:  # Focus on top 3 weakest areas
        if area == "keyword_analysis" and score < 60:
            industry = analysis["industry_detection"]["detected_industry"]
            recommendations.append(f"Enhance industry-specific keywords for {industry}. Consider adding terms related to {', '.join(list(industry_keywords[industry])[:5])}.")
        
        elif area == "action_verbs" and score < 60:
            recommendations.append("Replace passive language with strong action verbs. Start bullet points with impactful verbs like 'Implemented', 'Developed', or 'Increased'.")
        
        elif area == "quantification" and score < 60:
            recommendations.append("Add more measurable achievements with specific metrics (%, $, time saved, etc.) to demonstrate your impact.")
        
        elif area == "redundancy" and score < 70:
            overused = list(analysis["overused_phrases"].keys())[:3]
            if overused:
                recommendations.append(f"Reduce repetitive language, particularly: {', '.join(overused)}.")
        
        elif area == "work_experience" and score < 70:
            if "work_experience_details" in analysis:
                details = analysis["work_experience_details"]
                if isinstance(details, dict):
                    if details.get("strong_bullets_count", 0) < 5:
                        recommendations.append("Transform job descriptions into accomplishment statements that show results, not just responsibilities.")
        
        elif area == "skills" and score < 70:
            if "skills_details" in analysis and isinstance(analysis["skills_details"], dict):
                if not analysis["skills_details"].get("has_organization", False):
                    recommendations.append("Organize your skills into categories (e.g., Technical, Soft Skills, Languages) for better readability.")
        
        elif area == "formatting" and score < 70:
            recommendations.append("Improve formatting consistency with clear section headers, bullet points, and consistent date formats.")
    
    # Add general recommendations if needed
    if not recommendations:
        recommendations.append("Your resume is strong overall. Consider customizing it further for specific job applications.")
    
    # Add job-specific recommendation if job description was provided
    if "job_relevance" in analysis and analysis["job_relevance"] < 80:
        if "job_relevance_details" in analysis and isinstance(analysis["job_relevance_details"], dict):
            missing = analysis["job_relevance_details"].get("missing_key_requirements", [])
            if missing:
                recommendations.append(f"Tailor your resume to address key job requirements, particularly: {', '.join(missing[:3])}.")
    
    return recommendations

# Set up endpoints
@router.post("/score_resume")
async def analyze_resume_endpoint(
    file: UploadFile = File(...), 
    job_description: str = None,
    userInputId: str = Body(...),
    db: Session = Depends(get_db)
):
    try:
        pdf_content = await file.read()
        with open("temp_resume.pdf", "wb") as f:
            f.write(pdf_content)

        text = extract_text_from_pdf("temp_resume.pdf")
        if not text:
            return {"error": "Could not extract text from PDF. Please ensure the file is a valid PDF with text content."}

        analysis_results = analyze_resume(text, job_description)

        resume_score = analysis_results.get("overall_score", 0)

        # Save to DB
        new_result = ResumeAnalysis(
            id=str(uuid.uuid4()),
            userInputId=userInputId, 
            resumeScore=resume_score, 
            analysis=analysis_results,
            createdAt=datetime.utcnow() 
        )
        db.add(new_result)
        db.commit()
        db.refresh(new_result)

        return {
            "message": "Resume analyzed and saved successfully.",
            "data": analysis_results,
            "id": new_result.id
        }

    except Exception as e:
        return {"error": f"Analysis failed: {str(e)}"}
    
@router.get("/resume_analysis/{id}")
def get_resume_analysis(id: int, db: Session = Depends(get_db)):
    result = db.query(ResumeAnalysis).filter(ResumeAnalysis.id == id).first()
    if not result:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return result.analysis

