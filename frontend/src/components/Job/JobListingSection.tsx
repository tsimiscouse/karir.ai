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
  // const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // const dropdownRef = useRef<HTMLDivElement>(null);
  const jobListingRef = useRef<HTMLDivElement>(null);

  // const locations = [
  //   "All Locations",
  //   "Yogyakarta",
  //   "Jakarta",
  //   "Bandung",
  //   "Palembang",
  //   "Surabaya",
  //   "Semarang",
  // ];
  const pagesPerView = 5;

  const fetchJobs = async (page = 1, search = "", locations: string[] = []) => {
    setIsLoading(true);
    setError(null);

    // Handle location filtering logic
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
    // Debounce the search to prevent too many API calls
    const timerId = setTimeout(() => {
      fetchJobs(1, searchInput, selectedLocations);
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchInput, selectedLocations]);

  useEffect(() => {
    fetchJobs(1, searchInput, selectedLocations);
  }, [searchInput, selectedLocations]);

  // useEffect(() => {
  //   // Close dropdown when clicking outside
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       dropdownRef.current &&
  //       !dropdownRef.current.contains(event.target as Node)
  //     ) {
  //       setShowLocationDropdown(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  // const handleLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const { value, checked } = e.target;

  //   // Handle "All Locations" special case
  //   if (value === "All Locations") {
  //     if (checked) {
  //       setSelectedLocations(["All Locations"]);
  //     } else {
  //       setSelectedLocations([]);
  //     }
  //     return;
  //   }

  //   setSelectedLocations((prev) => {
  //     // If "All Locations" is already selected and we're selecting something else,
  //     if (prev.includes("All Locations")) {
  //       return [value];
  //     }

  //     const updatedLocations = checked
  //       ? [...prev, value]
  //       : prev.filter((loc) => loc !== value);

  //     return updatedLocations.length === 0
  //       ? ["All Locations"]
  //       : updatedLocations;
  //   });
  // };

  const handlePageChange = (page: number) => {
    fetchJobs(page, searchInput, selectedLocations);
    
    if (jobListingRef.current) {
      jobListingRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const renderPaginationButtons = () => {
    const { current_page, total_pages } = pagination;
    const pages: number[] = [];

    // Calculate the range of pages to display
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

    // Generate page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex justify-center mt-[2vw] space-x-[0.75vw]">
        {/* Previous Button */}
        {current_page > 1 && (
          <button
            onClick={() => handlePageChange(current_page - 1)}
            className="px-[1.2vw] py-[0.6vw] rounded-[0.6vw] font-medium bg-[#FFFFFF] text-[1vw] text-[#577C8E] border border-[#E0E7EC] hover:bg-[#F5F8FA] transition-all shadow-sm flex items-center gap-[0.4vw]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-[1vw] w-[1vw]"
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

        {/* Page Buttons */}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-[1.2vw] py-[0.6vw] rounded-[0.6vw] text-[1vw] transition-all ${
              page === current_page
                ? "bg-[#577C8E] text-white font-medium shadow-md"
                : "bg-[#FFFFFF] text-[#577C8E] border border-[#E0E7EC] hover:bg-[#F5F8FA]"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        {current_page < total_pages && (
          <button
            onClick={() => handlePageChange(current_page + 1)}
            className="px-[1.2vw] py-[0.6vw] rounded-[0.6vw] font-medium bg-[#FFFFFF] text-[1vw] text-[#577C8E] border border-[#E0E7EC] hover:bg-[#F5F8FA] transition-all shadow-sm flex items-center gap-[0.4vw]"
          >
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-[1vw] w-[1vw]"
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
      className="container mx-auto py-[3vw]"
      data-aos="fade-up"
      data-aos-duration="1000"
      ref={jobListingRef}
      id="job-listing-container"
    >
      <div className="bg-gradient-to-br from-[#577C8E] to-[#3A5566] shadow-xl rounded-[1.2vw]">
        {/* Header */}
        <div className="p-[2vw] pb-[2.5vw]">
          <h2
            className="text-[2.2vw] font-bold text-center text-white mb-[1.5vw]"
            data-aos="fade-up"
            data-aos-duration="800"
          >
            Available Job Listings
          </h2>

          {/* Search and Filter Container */}
          <div
            className="flex flex-col md:flex-row gap-[1.2vw] w-full"
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-duration="800"
          >
            {/* Search Input */}
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search jobs..."
                className="w-full p-[1vw] pl-[3.2vw] text-[1vw] rounded-xl border-2 border-[#FFFFFF30] bg-[#FFFFFF15] backdrop-blur-sm focus:outline-none focus:border-white text-white placeholder-gray-300 font-sans transition-all duration-300 focus:shadow-lg"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <Search className="absolute left-[1vw] top-1/2 -translate-y-1/2 text-[1.2vw] text-gray-300" />
            </div>

            {/* Location Multi-Select Dropdown */}
            {/* <div
              className="relative font-sans flex-grow md:flex-grow-0 md:w-1/4 z-[0]"
              ref={dropdownRef}
            >
              <div
                className={`w-full p-[1vw] pl-[3.2vw] border-2 ${
                  showLocationDropdown
                    ? "border-white shadow-lg"
                    : "border-[#FFFFFF30]"
                } bg-[#FFFFFF15] backdrop-blur-sm rounded-xl text-white font-sans cursor-pointer flex justify-between items-center transition-all duration-300`}
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              >
                <div className="absolute inset-y-0 left-[1vw] flex items-center pointer-events-none text-gray-300">
                  <MapPin size="1.2vw" />
                </div>
                <span className="truncate pr-[2vw]">
                  {selectedLocations.length === 0 ||
                  (selectedLocations.length === 1 &&
                    selectedLocations[0] === "All Locations")
                    ? "Select Locations"
                    : selectedLocations.join(", ")}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-[1vw] w-[1vw] absolute right-[1vw] transition-transform duration-300 ${
                    showLocationDropdown ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              <div
                className={`absolute w-full bg-[#FFFFFF] mt-[0.5vw] rounded-xl shadow-xl transition-all duration-300 origin-top ${
                  showLocationDropdown
                    ? "opacity-100 scale-y-100 max-h-[10vw]"
                    : "opacity-0 scale-y-0 max-h-0"
                } overflow-y-auto bottom-full mb-[0.5vw]`}
              >
                {locations.map((loc) => (
                  <label
                    key={loc}
                    className="flex items-center px-[1vw] py-[0.8vw] hover:bg-gray-100 cursor-pointer text-gray-800 transition-colors duration-200"
                  >
                    <input
                      type="checkbox"
                      value={loc}
                      checked={selectedLocations.includes(loc)}
                      onChange={handleLocationChange}
                      className="mr-[0.8vw] h-[1vw] w-[1vw] text-[#577C8E] focus:ring-[#577C8E] border-gray-300 rounded-sm"
                    />
                    {loc}
                  </label>
                ))}
              </div>
            </div> */}
          </div>
        </div>

        {/* Job Listings */}
        <div className="p-[2vw] bg-white rounded-t-[2vw]">
          {isLoading ? (
            <div className="flex justify-center items-center py-[4vw]">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-[3vw] w-[3vw] border-[0.3vw] border-[#577C8E] border-t-transparent"></div>
                <p className="mt-[1vw] text-[1vw] text-gray-500">
                  Loading jobs...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-[4vw] text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-[3vw] w-[3vw] mb-[1vw]"
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
              <p className="text-[1.3vw]">{error}</p>
              <button
                onClick={() => fetchJobs(1, searchInput, selectedLocations)}
                className="mt-[1vw] px-[1.5vw] py-[0.7vw] bg-[#577C8E] text-white rounded-[0.6vw] hover:bg-[#3A5566] transition-all text-[0.9vw]"
              >
                Try Again
              </button>
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-[4vw] text-gray-500">
              <div className="bg-gray-100 p-[1.5vw] rounded-full mb-[1.5vw]">
                <Briefcase size="3vw" className="text-[#577C8E]" />
              </div>
              <p className="text-[1.5vw] font-medium mb-[0.5vw]">
                No jobs found
              </p>
              <p className="text-[1vw] text-gray-400 mb-[1.5vw] text-center max-w-[30vw]">
                We couldn&apos;t find any jobs matching your criteria. Try
                adjusting your search or location filters.
              </p>
              <button
                onClick={() => {
                  setSearchInput("");
                  setSelectedLocations(["All Locations"]);
                }}
                className="px-[1.5vw] py-[0.7vw] bg-[#577C8E] text-white rounded-[0.6vw] hover:bg-[#3A5566] transition-all text-[0.9vw] flex items-center gap-[0.5vw]"
              >
                <Filter size="0.9vw" />
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1.5vw]">
                {jobs.map((job) => (
                  <JobCard key={job.id} {...job} sourceUrl={job.source_url} />
                ))}
              </div>

              {/* Results count */}
              <div className="text-center text-[0.9vw] text-gray-500 mt-[2vw] mb-[1vw]">
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