'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

interface JobListing {
  id: string;
  title: string;
  companyName: string;
  logo: string;
  location: string;
  employmentType: string;
  experience: string;
  jobTags: string;
  description: string;
  source_url: string;
}

interface JobRecommendation {
  id: string;
  similarity_score: number;
  jobListing: JobListing;
}

interface ResumeAnalysis {
  id: string;
  resumeScore: number;
  analysis: {
    length: number;
    skills: number;
    education: number;
    formatting: number;
    redundancy: number;
    readability: number;
    action_verbs: number;
    contact_info: number;
    overall_score: number;
    length_details: {
      message: string;
      word_count: number;
      estimated_pages: number;
    };
    quantification: number;
    skills_details: {
      components: {
        organization: number;
        skills_count: number;
        industry_relevance: number;
        proficiency_levels: number;
      };
      skills_count: number;
      extracted_skills: string[];
      has_organization: boolean;
      has_proficiency_levels: boolean;
      industry_relevant_count: number;
    };
    recommendations: string[];
    work_experience: number;
    keyword_analysis: {
      percentage: number;
      matched_keywords: string[];
      matched_keywords_count: number;
    };
    overused_phrases: Record<string, number>;
    education_details: {
      components: {
        dates: number;
        degrees: number;
        structure: number;
        coursework: number;
        gpa_honors: number;
        institutions: number;
      };
      found_degrees: string[];
      has_detailed_information: boolean;
      includes_performance_metrics: boolean;
    };
    sections_analysis: {
      depth_score: number;
      section_depth: {
        skills: number;
        projects: number;
        education: number;
        experience: number;
        certifications: number;
      };
      found_sections: number;
      section_presence: {
        skills: boolean;
        projects: boolean;
        education: boolean;
        experience: boolean;
        certifications: boolean;
      };
    };
    industry_detection: {
      industry_scores: Record<string, number>;
      detected_industry: string;
    };
    readability_details: {
      flesch_reading_ease: number;
      flesch_kincaid_grade: number;
      industry_ideal_grade: number;
      industry_ideal_range: string;
    };
    achievements_projects: number;
    work_experience_details: {
      components: {
        dates: number;
        companies: number;
        job_titles: number;
        strong_bullets: number;
        bullet_structure: number;
      };
      bullet_points_count: number;
      number_of_positions: number;
      has_dates_and_titles: boolean;
      strong_bullets_count: number;
    };
    achievements_projects_details: {
      has_projects_section: boolean;
      includes_recognition: boolean;
      achievements_quantified: boolean;
      has_achievements_section: boolean;
    };
  };
  createdAt: string;
}

interface UserReportData {
  user: {
    id: string;
    email: string;
    location: string;
    preferredJobTypes: string[];
  };
  resumeAnalysis: ResumeAnalysis;
  jobRecommendations: JobRecommendation[];
}

export default function UserReports() {
  const params = useParams();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<UserReportData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchReport = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/api/reports/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch report');
        }
        
        const data = await response.json();
        setReport(data);
      } catch (err) {
        setError('Failed to load report. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-600';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getScoreGrade = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Average';
    if (score >= 20) return 'Below Average';
    return 'Poor';
  };

  const prepareDoughnutData = (analysis: ResumeAnalysis['analysis']) => {
    return {
      labels: [
        'Length',
        'Skills',
        'Education',
        'Formatting',
        'Work Experience',
        'Readability'
      ],
      datasets: [
        {
          label: 'Score',
          data: [
            analysis.length,
            analysis.skills,
            analysis.education,
            analysis.formatting,
            analysis.work_experience,
            analysis.readability
          ],
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const calculateMatchPercentage = (similarityScore: number) => {
    return (similarityScore * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center bg-red-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-red-700 mb-4">Error</h2>
            <p className="text-red-600">{error || 'Report not found'}</p>
            <Link
              href="/"
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition inline-block"
            >
              Go Back Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const { user, resumeAnalysis, jobRecommendations } = report;
  const chartData = prepareDoughnutData(resumeAnalysis.analysis);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-[20vh]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Career Report</h1>
          <p className="text-gray-600">
            Generated on {formatDate(resumeAnalysis.createdAt)} for {user.email}
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Resume Score</h2>
            <div className="flex items-end">
              <span className={`text-4xl font-bold ${getScoreColor(resumeAnalysis.resumeScore)}`}>
                {resumeAnalysis.resumeScore.toFixed(1)}
              </span>
              <span className="text-gray-500 ml-2">/100</span>
            </div>
            <p className="mt-2 text-gray-600">
              {getScoreGrade(resumeAnalysis.resumeScore)}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Industry Match</h2>
            <div className="text-xl font-bold text-blue-600">
              {resumeAnalysis.analysis.industry_detection.detected_industry}
            </div>
            <p className="mt-2 text-gray-600">
              Based on your skills and experience
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Keywords Match</h2>
            <div className="text-xl font-bold text-indigo-600">
              {resumeAnalysis.analysis.keyword_analysis.percentage.toFixed(1)}%
            </div>
            <p className="mt-2 text-gray-600">
              {resumeAnalysis.analysis.keyword_analysis.matched_keywords_count} industry-relevant keywords found
            </p>
          </div>
        </div>
        
        {/* Resume Analysis Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-2xl font-bold text-gray-800">Resume Analysis</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Chart */}
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Score Breakdown</h3>
                <div className="w-64 h-64">
                  <Doughnut data={chartData} />
                </div>
              </div>
              
              {/* Key Metrics */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Key Metrics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Length</span>
                      <span className={`text-sm font-medium ${getScoreColor(resumeAnalysis.analysis.length)}`}>
                        {resumeAnalysis.analysis.length}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${resumeAnalysis.analysis.length}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {resumeAnalysis.analysis.length_details.word_count} words, ~{resumeAnalysis.analysis.length_details.estimated_pages} pages
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Skills</span>
                      <span className={`text-sm font-medium ${getScoreColor(resumeAnalysis.analysis.skills)}`}>
                        {resumeAnalysis.analysis.skills}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${resumeAnalysis.analysis.skills}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Education</span>
                      <span className={`text-sm font-medium ${getScoreColor(resumeAnalysis.analysis.education)}`}>
                        {resumeAnalysis.analysis.education}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${resumeAnalysis.analysis.education}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Work Experience</span>
                      <span className={`text-sm font-medium ${getScoreColor(resumeAnalysis.analysis.work_experience)}`}>
                        {resumeAnalysis.analysis.work_experience}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full" 
                        style={{ width: `${resumeAnalysis.analysis.work_experience}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Formatting</span>
                      <span className={`text-sm font-medium ${getScoreColor(resumeAnalysis.analysis.formatting)}`}>
                        {resumeAnalysis.analysis.formatting}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-teal-500 h-2 rounded-full" 
                        style={{ width: `${resumeAnalysis.analysis.formatting}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Readability</span>
                      <span className={`text-sm font-medium ${getScoreColor(resumeAnalysis.analysis.readability)}`}>
                        {resumeAnalysis.analysis.readability}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full" 
                        style={{ width: `${resumeAnalysis.analysis.readability}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Flesch-Kincaid Grade Level: {resumeAnalysis.analysis.readability_details.flesch_kincaid_grade.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recommendations */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Improvement Recommendations</h3>
              <ul className="list-disc pl-5 space-y-2">
                {resumeAnalysis.analysis.recommendations.map((recommendation, index) => (
                  <li key={index} className="text-gray-700">{recommendation}</li>
                ))}
              </ul>
            </div>
            
            {/* Skills */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Key Skills Detected</h3>
              <div className="flex flex-wrap gap-2">
                {resumeAnalysis.analysis.skills_details.extracted_skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Job Recommendations Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-2xl font-bold text-gray-800">Job Recommendations</h2>
            <p className="text-gray-600">Based on your resume and preferences</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              {jobRecommendations.map((job) => (
                <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      {job.jobListing.logo ? (
                        <Image 
                          src={job.jobListing.logo} 
                          alt={`${job.jobListing.companyName} logo`}
                          width={80} 
                          height={80}
                          className="rounded-md object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                          <span className="text-gray-500 text-2xl font-bold">
                            {job.jobListing.companyName.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-[0.2vw]">
                            {job.jobListing.title}
                          </h3>
                          <p className="text-gray-600">{job.jobListing.companyName} - {job.jobListing.employmentType}</p>
                          <div className="flex items-center mt-[0.3vw] text-gray-600">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                            </svg>
                            <span>{job.jobListing.location}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="bg-blue-100 text-blue-800 font-medium rounded-full px-3 py-1 text-sm">
                            {calculateMatchPercentage(job.similarity_score)}% Match
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <a
                          href={job.jobListing.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          View Job
                          <svg className="ml-2 -mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}