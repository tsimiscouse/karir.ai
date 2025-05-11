"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import JobCard from "./JobCard";
import { Search, Filter, Briefcase } from "lucide-react";

interface Job {
  id: string;
  title: string;
  companyName: string;
  description: string;
  employmentType: string;
  experience: string;
  jobTags: string;
  location: string;
  logo: string;
  salaryMax: number | null;
  salaryMin: number | null;
  scrapeAt: string;
  source_url: string;
}

interface ApiResponse {
  data?: Job[];
  meta?: {
    current_page: number;
    total_pages: number;
    total_items: number;
  };
}

const JobListingSection: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([
    "All Locations",
  ]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const jobListingRef = useRef<HTMLDivElement>(null);

  const pagesPerView = 5;

  const fetchJobs = async (page = 1, search = "", locations: string[] = []) => {
    setIsLoading(true);
    setError(null);

    let locationParam = "";
    if (locations.length > 0 && !locations.includes("All Locations")) {
      locationParam = locations.join(",");
    }

    try {
      const response = await axios.get<ApiResponse>(
        "https://karirai-backend.victoriousdune-d492059e.southeastasia.azurecontainerapps.io/api/jobs",
        {
          params: {
            page,
            limit: 9,
            search,
            location: locationParam,
          },
        }
      );

      const jobData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      setJobs(jobData);
      setPagination({
        current_page: response.data?.meta?.current_page || 1,
        total_pages: response.data?.meta?.total_pages || 1,
        total_items: response.data?.meta?.total_items || jobData.length,
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError("Failed to fetch jobs. Please try again.");
      setJobs([]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      fetchJobs(1, searchInput, selectedLocations);
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchInput, selectedLocations]);

  useEffect(() => {
    fetchJobs(1, searchInput, selectedLocations);
  }, [searchInput, selectedLocations]);

  const handlePageChange = (page: number) => {
    fetchJobs(page, searchInput, selectedLocations);

    if (jobListingRef.current) {
      jobListingRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const renderPaginationButtons = () => {
    const { current_page, total_pages } = pagination;
    const pages: number[] = [];

    let startPage: number;
    let endPage: number;

    if (total_pages <= pagesPerView) {
      startPage = 1;
      endPage = total_pages;
    } else if (current_page <= 3) {
      startPage = 1;
      endPage = pagesPerView;
    } else if (current_page > total_pages - 2) {
      startPage = total_pages - (pagesPerView - 1);
      endPage = total_pages;
    } else {
      startPage = current_page - 2;
      endPage = current_page + 2;
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex flex-wrap justify-center mt-6 md:mt-8 space-x-2 md:space-x-3">
        {/* Previous Button */}
        {current_page > 1 && (
          <button
            onClick={() => handlePageChange(current_page - 1)}
            className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 md:py-2.5 rounded-lg font-medium bg-[#FFFFFF] text-xs sm:text-sm md:text-base text-[#577C8E] border border-[#E0E7EC] hover:bg-[#F5F8FA] transition-all shadow-sm flex items-center gap-1 md:gap-2 mb-2 sm:mb-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Prev
          </button>
        )}

        {/* Page Buttons - Hide on smallest screens */}
        <div className="hidden sm:flex space-x-1 sm:space-x-2 md:space-x-3">
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 md:py-2.5 rounded-lg text-xs sm:text-sm md:text-base transition-all ${
                page === current_page
                  ? "bg-[#577C8E] text-white font-medium shadow-md"
                  : "bg-[#FFFFFF] text-[#577C8E] border border-[#E0E7EC] hover:bg-[#F5F8FA]"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Current page indicator for smallest screens */}
        <div className="sm:hidden px-3 py-1.5 rounded-lg text-xs bg-[#577C8E] text-white font-medium">
          Page {current_page} of {total_pages}
        </div>

        {/* Next Button */}
        {current_page < total_pages && (
          <button
            onClick={() => handlePageChange(current_page + 1)}
            className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 md:py-2.5 rounded-lg font-medium bg-[#FFFFFF] text-xs sm:text-sm md:text-base text-[#577C8E] border border-[#E0E7EC] hover:bg-[#F5F8FA] transition-all shadow-sm flex items-center gap-1 md:gap-2 mb-2 sm:mb-0"
          >
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>
    );
  };

  return (
    <section
      className="container mx-auto py-4 sm:py-6 md:py-8 lg:py-12 px-3 sm:px-4 md:px-6"
      data-aos="fade-up"
      data-aos-duration="1000"
      ref={jobListingRef}
      id="job-listing-container"
    >
      <div className="bg-gradient-to-br from-[#577C8E] to-[#3A5566] shadow-xl rounded-lg md:rounded-xl lg:rounded-2xl">
        {/* Header */}
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 pb-4 sm:pb-6 md:pb-8 lg:pb-10">
          <h2
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center text-white mb-3 sm:mb-4 md:mb-6"
            data-aos="fade-up"
            data-aos-duration="800"
          >
            Available Job Listings
          </h2>

          {/* Search and Filter Container */}
          <div
            className="flex flex-col md:flex-row gap-2 sm:gap-3 md:gap-4 w-full"
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-duration="800"
          >
            {/* Search Input */}
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search jobs..."
                className="w-full p-2 sm:p-3 md:p-4 pl-8 sm:pl-10 md:pl-12 text-xs sm:text-sm md:text-base rounded-lg md:rounded-xl border-2 border-[#FFFFFF30] bg-[#FFFFFF15] backdrop-blur-sm focus:outline-none focus:border-white text-white placeholder-gray-300 font-sans transition-all duration-300 focus:shadow-lg"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <Search className="absolute left-2 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-300" />
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-white rounded-t-lg sm:rounded-t-xl md:rounded-t-2xl lg:rounded-t-3xl">
          {isLoading ? (
            <div className="flex justify-center items-center py-8 md:py-12 lg:py-16">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 border-2 md:border-3 lg:border-4 border-[#577C8E] border-t-transparent"></div>
                <p className="mt-2 sm:mt-3 md:mt-4 text-xs sm:text-sm md:text-base text-gray-500">
                  Loading jobs...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 md:py-12 lg:py-16 text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 mb-2 sm:mb-3 md:mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl px-4 text-center">{error}</p>
              <button
                onClick={() => fetchJobs(1, searchInput, selectedLocations)}
                className="mt-2 sm:mt-3 md:mt-4 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 bg-[#577C8E] text-white rounded-lg hover:bg-[#3A5566] transition-all text-xs sm:text-sm md:text-base"
              >
                Try Again
              </button>
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 md:py-12 lg:py-16 text-gray-500">
              <div className="bg-gray-100 p-3 sm:p-4 md:p-6 rounded-full mb-3 sm:mb-4 md:mb-6">
                <Briefcase className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-[#577C8E]" />
              </div>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium mb-1 sm:mb-2 md:mb-3">
                No jobs found
              </p>
              <p className="text-xs sm:text-sm md:text-base text-gray-400 mb-3 sm:mb-4 md:mb-6 text-center max-w-[280px] md:max-w-[400px] lg:max-w-[500px] px-4">
                We couldn&apos;t find any jobs matching your criteria. Try
                adjusting your search or location filters.
              </p>
              <button
                onClick={() => {
                  setSearchInput("");
                  setSelectedLocations(["All Locations"]);
                }}
                className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 bg-[#577C8E] text-white rounded-lg hover:bg-[#3A5566] transition-all text-xs sm:text-sm md:text-base flex items-center gap-1 sm:gap-2"
              >
                <Filter className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {jobs.map((job) => (
                  <JobCard key={job.id} {...job} sourceUrl={job.source_url} />
                ))}
              </div>

              {/* Results count */}
              <div className="text-center text-xs md:text-sm text-gray-500 mt-4 sm:mt-6 md:mt-8 mb-2 sm:mb-3 md:mb-4">
                Showing {jobs.length} of {pagination.total_items} jobs
              </div>

              {/* Pagination */}
              {renderPaginationButtons()}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default JobListingSection;