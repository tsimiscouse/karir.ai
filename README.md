# 🚀 karir.ai

<div align="center">
  <img src="https://img.shields.io/badge/Status-In%20Development-yellow?style=for-the-badge" alt="Status"/>
  <img src="https://img.shields.io/badge/Next.js-13.4.9-black?style=for-the-badge&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/Tailwind-3.3.2-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/FastAPI-0.98.0-009688?style=for-the-badge&logo=fastapi" alt="FastAPI"/>
</div>

<div align="center">
  <h3>AI-Powered Career Matchmaking and Resume Analysis Platform</h3>
  <p><i>Helping job seekers find their perfect career path through advanced AI analysis</i></p>
</div>

## 📋 Table of Contents
- [About karir.ai](#-about-kariai)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Technical Implementation](#-technical-implementation)
  - [Job Matching with Sentence-BERT](#job-matching-with-sentence-bert)
  - [Resume Scoring with TF-IDF Approach](#resume-scoring-with-tf-idf-approach)
- [Getting Started](#-getting-started)
- [Development Team](#-development-team)

## 🌟 About karir.ai

**karir.ai** is a web-based platform that leverages artificial intelligence to help individuals—particularly fresh graduates and young professionals—understand their potential and find suitable career paths based on their experiences and skills derived from their resumes.

The platform was developed to address the **job mismatch** problem in Indonesia, where individuals often work in fields that don't align with their skills, interests, or educational background. According to Populix surveys and BPS data, approximately **30% of job seekers** in Indonesia report that their educational background doesn't match the jobs they apply for.

## 🔍 Key Features

- **🔍 Resume Analysis**: Advanced NLP-based analysis of resumes to extract key skills and experiences
- **📊 Resume Quality Assessment**: Evaluates resume quality based on diction, structure, and language strength
- **🎯 Career Path Recommendations**: Suggests the most relevant jobs and career paths for users
- **💼 AI-Powered Job Matching**: Automatically matches users with job openings based on their profile
- **🧠 Skill Gap Analysis**: Identifies skills users need to develop for their desired career paths

🏗 System Architecture
Our system follows a modern microservices architecture with specialized components for AI processing, data storage, and frontend interaction.
<div align="center">
  <img src="./architecture.png" alt="karir.ai System Architecture" width="800px"/>
</div>
Architecture Components
The karir.ai platform is built with a sophisticated multi-layered architecture:
🖥️ Frontend Layer

Next.js: Server-side rendered React application for optimal performance and SEO
React: Component-based UI architecture for dynamic user experiences
Tailwind CSS: Utility-first CSS framework for responsive design
AOS (Animate on Scroll): Library for smooth scroll animations
Deployment: Vercel for continuous deployment and edge performance

🔄 Backend Layer

Express.js: Node.js web application framework for RESTful API endpoints
Node.js: JavaScript runtime for server-side operations
FastAPI: High-performance Python framework for AI model endpoints
ORM: Prisma for Express.js and SQLAlchemy for FastAPI

💾 Database Layer

Aiven: Cloud database service based on PostgreSQL
PostgreSQL: Robust relational database for structured data storage
Data Organization: Normalized schema design for efficient storage and retrieval

🧠 AI Layer

Sentence-BERT: Transformer-based model for semantic text matching
TF-IDF Models: Statistical models for resume scoring and keyword analysis
NLP Processing Pipeline: Custom NLP pipelines for text extraction and analysis

Cloud Infrastructure
<div align="center">
  <table>
    <tr>
      <th>Component</th>
      <th>Cloud Service</th>
      <th>Justification</th>
    </tr>
    <tr>
      <td>Frontend Application</td>
      <td>Vercel</td>
      <td>Optimized for Next.js, global CDN, automatic preview deployments</td>
    </tr>
    <tr>
      <td>Backend API & Logic</td>
      <td>Azure Container Apps</td>
      <td>Scalable, microservices architecture support, cost-efficient</td>
    </tr>
    <tr>
      <td>AI Models & Processing</td>
      <td>Azure Container Registry (ACR)</td>
      <td>Containerized model deployment, version control, integration with Azure ecosystem</td>
    </tr>
    <tr>
      <td>Database</td>
      <td>Aiven for PostgreSQL</td>
      <td>Managed PostgreSQL service, high availability, automated backups</td>
    </tr>
    <tr>
      <td>Version Control</td>
      <td>GitHub</td>
      <td>Collaborative development, CI/CD integration, code review</td>
    </tr>
    <tr>
      <td>Prototyping</td>
      <td>Figma</td>
      <td>Collaborative UI/UX design, component libraries, interactive prototypes</td>
    </tr>
  </table>
</div>
Deployment & Scaling Strategy
AI Model Deployment
Our AI models are containerized and deployed using Azure Container Registry (ACR) and Azure Container Apps:

Model Training: Models are trained in development environments
Containerization: Models are packaged with FastAPI in Docker containers
Registry Storage: Containers are pushed to Azure Container Registry
Deployment: Containers are deployed to Azure Container Apps
Scaling: Automatic scaling based on request volume

This approach enables us to:

Update AI models independently
Scale based on demand
Maintain version control for models
Deploy different models for different purposes

Backend API Deployment
The Express.js backend follows a similar containerized approach:

Logic Apps: Business logic is organized into modular components
Container Packaging: Components are packaged into containers
Azure Deployment: Deployed to Azure Container Apps
Database Connection: Connected to Aiven PostgreSQL via secure connections

Frontend Deployment
Our Next.js frontend is deployed through Vercel's platform for optimal performance:

CI/CD Integration: Connected to GitHub repository
Preview Deployments: Automatic deployments for pull requests
Edge Network: Global CDN for fast content delivery
Analytics: Built-in performance monitoring

## 💻 Technical Implementation

### Job Matching with Sentence-BERT

karir.ai uses **Sentence-BERT** (SBERT) for semantic matching between job descriptions and user resumes:

1. **Encoding**: Both the job description and the complete user resume are encoded into dense vector representations using pre-trained Sentence-BERT models.

2. **Semantic Similarity**: We calculate the **cosine similarity** between these vectors to determine how well a candidate's resume matches a job description.

3. **Ranking System**: Jobs are ranked by similarity score, with the highest matching positions recommended to users.

This approach captures semantic meaning beyond keyword matching, understanding context and related concepts for more accurate job recommendations.

### Resume Scoring with TF-IDF Approach

Our resume scoring system uses a TF-IDF (Term Frequency-Inverse Document Frequency) inspired approach:

1. **Document Corpus**: We maintain a corpus of high-quality resumes for various industries and positions.

2. **Term Weighting**: Important resume terms are weighted based on:
   - Frequency in successful resumes
   - Rarity across the general resume population
   - Industry-specific importance

3. **Quality Metrics**: Resumes are scored on multiple dimensions:
   - **Content Relevance**: How well the resume's content matches industry expectations
   - **Keyword Optimization**: Presence of industry-standard terminology
   - **Structure & Format**: Adherence to best practices in resume organization
   - **Action Verbs & Language Strength**: Use of powerful action verbs and quantifiable achievements

4. **Scoring Algorithm**: The final score combines these metrics with industry-specific weightings.

## 👨‍💻 Development Team

This project was developed as a Senior Project by:

- **Septian Eka Rahmadi** - 22/496732/TK/54442
- **Muhammad Luthfi Attaqi** - 22/496427/TK/54387
- **Shafa Aura Yogadiasa** - 22/496508/TK/54406

<div align="center">
  <p><b>Department of Electrical and Information Technology</b></p>
  <p><b>Faculty of Engineering, Universitas Gadjah Mada</b></p>
</div>

---

<div align="center">
  <p>✨ <b>Your journey to career excellence starts here!</b> ✨</p>
</div>
