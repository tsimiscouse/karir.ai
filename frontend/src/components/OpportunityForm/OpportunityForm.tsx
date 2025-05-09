"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";

interface FormData {
  email: string;
  name: string;
  location: string[];
  jobTypes: string[];
  resume: File | null;
}

interface ApiResponse {
  id: string;
  email: string;
  emailStatus: boolean;
  paymentStatus: boolean;
  resume: string;
  location: string;
  prefJobType: string[];
  verificationToken: string | null;
  verificationTokenExpiry: string | null;
  createdAt: string;
  updatedAt: string;
  message?: string;
}

const OpportunityForm: React.FC = () => {
  const Router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    name: "",
    location: [],
    jobTypes: [],
    resume: null,
  });

  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [resumeName, setResumeName] = useState<string>("");
  
  // State for handling API responses and user feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
    userId?: string;
    emailVerified?: boolean;
  } | null>(null);
  const [isResendingVerification, setIsResendingVerification] = useState(false);

  useEffect(() => {
    AOS.init({ 
      once: false,
      duration: 800,
      easing: 'ease-out-cubic'
    });

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updatedLocations = checked
        ? [...prev.location, value]
        : prev.location.filter((loc) => loc !== value);
      return { ...prev, location: updatedLocations };
    });
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updatedJobTypes = checked
        ? [...prev.jobTypes, value]
        : prev.jobTypes.filter((type) => type !== value);
      return { ...prev, jobTypes: updatedJobTypes };
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        resume: file,
      });
      setResumeName(file.name);
    }
  };

  const checkEmailStatus = async (userId: string): Promise<boolean> => {
    try {
      const response = await axios.get<{ emailStatus: boolean }>(`http://localhost:3001/api/check-email-status/${userId}`);
      return response.data.emailStatus;
    } catch (error) {
      console.error("Error checking email status:", error);
      return false;
    }
  };

  const handleResendVerification = async () => {
    if (!submitStatus?.userId) return;
    
    setIsResendingVerification(true);
    try {
      await axios.post(`http://localhost:3001/api/resend-verification/${submitStatus.userId}`);
      setSubmitStatus(prev => prev ? {
        ...prev,
        message: "Verification email has been resent. Please check your inbox."
      } : null);
    } catch (error) {
      console.error("Error resending verification:", error);
      setSubmitStatus(prev => prev ? {
        ...prev,
        message: "Failed to resend verification email. Please try again later."
      } : null);
    } finally {
      setIsResendingVerification(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const apiFormData = new FormData();
      apiFormData.append("email", formData.email);
      apiFormData.append("location", formData.location.join(", "));
      formData.jobTypes.forEach(jobType => {
        apiFormData.append("prefJobType", jobType);
      });
      
      if (formData.resume) {
        apiFormData.append("resume", formData.resume);
      }
      
      // Submit to create user input API
      const response = await axios.post<ApiResponse>(
        "http://localhost:3001/api/users-input",
        apiFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      const userId = response.data.id;
      
      // Check if email is verified
      const emailVerified = await checkEmailStatus(userId);
      
      // If resume exists, send to CV scoring API
      if (formData.resume) {
        const scoreFormData = new FormData();
        scoreFormData.append("file", formData.resume);
        scoreFormData.append("userInputId", userId);
        
        try {
          await axios.post(
            "http://127.0.0.1:8000/api/score_resume/",
            scoreFormData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );
        } catch (scoreError) {
          console.error("Error scoring resume:", scoreError);
          // Continue with job recommendations even if scoring fails
        }
      }
      
      // Request job recommendations
      try {
        await axios.get(`http://127.0.0.1:8000/api/recommend_jobs/${userId}`);
      } catch (recommendError) {
        console.error("Error getting job recommendations:", recommendError);
        // Continue without failing the entire process
      }
      
      // Update UI with success message
      setSubmitStatus({
        success: true,
        message: emailVerified 
          ? "Your information has been submitted successfully!" 
          : "Please check your email to verify your account.",
        userId: userId,
        emailVerified: emailVerified
      });
      
      // Reset form if successful
      if (emailVerified) {
        setFormData({
          email: "",
          name: "",
          location: [],
          jobTypes: [],
          resume: null,
        });
        setResumeName("");
      }
      
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus({
        success: false,
        message: "There was an error submitting your information. Please try again."
      });
    } finally {
      setIsSubmitting(false);
      Router.push(`/result/${submitStatus?.userId}`);
    }
  };

  const availableLocations = [
    "Sleman, Yogyakarta",
    "Jakarta",
    "Bandung",
    "Surabaya",
  ];

  return (
    <section className="bg-gradient-to-br from-[#577C8E] to-[#3A5566] text-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-[68vw] mx-auto"
      data-aos="fade-up"
      data-aos-duration="1000">
      <h2 className="text-3xl font-bold text-center mb-8">
        JOB MATCHING | CV SCORING
      </h2>

      {submitStatus && (
        <div 
          className={`mb-6 p-4 rounded-xl ${submitStatus.success ? 'bg-green-600 bg-opacity-30' : 'bg-red-600 bg-opacity-30'}`}
          data-aos="fade-in"
        >
          <div className="flex items-start">
            <div className={`rounded-full p-1 ${submitStatus.success ? 'bg-green-500' : 'bg-red-500'} mr-3 mt-1`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                {submitStatus.success ? (
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                )}
              </svg>
            </div>
            <div>
              <p className="font-medium">{submitStatus.message}</p>
              
              {submitStatus.success && !submitStatus.emailVerified && submitStatus.userId && (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={isResendingVerification}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center"
                  >
                    {isResendingVerification ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Resend Verification Email
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Left Column */}
        <div
          className="space-y-5"
          data-aos="fade-right"
          data-aos-delay="200"
          data-aos-duration="800"
        >
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full p-4 pl-12 rounded-xl border-2 border-[#FFFFFF30] bg-[#FFFFFF15] backdrop-blur-sm focus:outline-none focus:border-white text-white placeholder-gray-300 font-sans transition-all duration-300 focus:shadow-lg"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full p-4 pl-12 rounded-xl border-2 border-[#FFFFFF30] bg-[#FFFFFF15] backdrop-blur-sm focus:outline-none focus:border-white text-white placeholder-gray-300 font-sans transition-all duration-300 focus:shadow-lg"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>

          <div className="relative font-sans" ref={dropdownRef}>
            <div
              className={`w-full p-4 pl-12 border-2 ${showLocationDropdown ? 'border-white shadow-lg' : 'border-[#FFFFFF30]'} bg-[#FFFFFF15] backdrop-blur-sm rounded-xl text-white font-sans cursor-pointer flex justify-between items-center transition-all duration-300`}
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
            >
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className={formData.location.length === 0 ? "text-gray-300" : ""}>
                {formData.location.length > 0
                  ? formData.location.join(", ")
                  : "Select Preferred Locations"}
              </span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 transition-transform duration-300 ${showLocationDropdown ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <div 
              className={`absolute z-10 w-full bg-[#FFFFFF] mt-2 rounded-xl shadow-xl overflow-hidden transition-all duration-300 origin-top ${showLocationDropdown ? 'opacity-100 scale-y-100 max-h-48' : 'opacity-0 scale-y-0 max-h-0'} overflow-y-auto`}
            >
              {availableLocations.map((loc) => (
                <label
                  key={loc}
                  className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer text-gray-800 transition-colors duration-200"
                >
                  <input
                    type="checkbox"
                    value={loc}
                    checked={formData.location.includes(loc)}
                    onChange={handleLocationChange}
                    className="mr-3 h-4 w-4 text-[#577C8E] focus:ring-[#577C8E] border-gray-300 rounded-sm"
                  />
                  {loc}
                </label>
              ))}
            </div>
          </div>

          {/* Job Types */}
          <div className="bg-[#FFFFFF15] backdrop-blur-sm p-5 rounded-xl border-2 border-[#FFFFFF30] text-white font-sans">
            <label className="block font-medium mb-3 text-white">
              Preferred Job Type (Optional)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["Full-time", "Part-time", "Internship", "Freelance"].map(
                (type) => (
                  <label
                    key={type}
                    className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      formData.jobTypes.includes(type) 
                        ? 'bg-[#FFFFFF30] border-2 border-white' 
                        : 'bg-[#FFFFFF15] border-2 border-[#FFFFFF20] hover:bg-[#FFFFFF25]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={type}
                      checked={formData.jobTypes.includes(type)}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-[#2D3F4B] focus:ring-[#2D3F4B] border-gray-300 rounded-sm"
                    />
                    <span>{type}</span>
                  </label>
                )
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div
          className="flex flex-col justify-between"
          data-aos="fade-left"
          data-aos-delay="300"
          data-aos-duration="800"
        >
          <label className={`w-full h-64 bg-[#FFFFFF15] backdrop-blur-sm rounded-xl border-2 border-dashed ${resumeName ? 'border-white' : 'border-[#FFFFFF30]'} flex flex-col items-center justify-center cursor-pointer p-4 transition-all duration-300 hover:bg-[#FFFFFF20] group`}>
            {resumeName ? (
              <>
                <div className="h-14 w-14 bg-white rounded-full flex items-center justify-center mb-3 text-[#577C8E] group-hover:scale-110 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-white font-medium">{resumeName}</span>
                <span className="text-gray-300 text-sm mt-1">Click to change file</span>
              </>
            ) : (
              <>
                <div className="h-14 w-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <span className="text-white font-medium text-lg">Upload Your Resume</span>
                <span className="text-gray-300 text-sm mt-1">(PDF Only, Max Size 5MB)</span>
              </>
            )}
            <input
              type="file"
              className="hidden"
              name="resume"
              accept=".pdf"
              onChange={handleFileChange}
              required
            />
          </label>

          <div
            className="mt-8"
            data-aos="fade-up"
            data-aos-delay="500"
            data-aos-duration="1000"
          >
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#2D3F4B] text-white px-6 py-4 rounded-xl hover:bg-[#1a2b37] transition-all duration-300 w-full font-medium text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:bg-[#2D3F4B] disabled:hover:translate-y-0"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <span>CV Scoring & Job Matching</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default OpportunityForm;