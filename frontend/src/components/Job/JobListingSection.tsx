'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import JobCard from './JobCard';
import { Search, MapPin, Filter } from 'lucide-react';

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
  const [searchInput, setSearchInput] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('All Locations');
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const locations = ['All Locations', 'Yogyakarta', 'Jakarta', 'Bandung', 'Palembang', 'Surabaya', 'Semarang'];
  const pagesPerView = 5;

  const fetchJobs = async (page = 1, search = '', location = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get<ApiResponse>('http://127.0.0.1:8000/api/jobs', {
        params: {
          page,
          limit: 9,
          search,
          location: location === 'All Locations' ? '' : location,
        },
      });

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
      console.error('Error fetching jobs:', error);
      setError('Failed to fetch jobs. Please try again.');
      setJobs([]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Debounce the search to prevent too many API calls
    const timerId = setTimeout(() => {
      fetchJobs(1, searchInput, selectedLocation);
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchInput, selectedLocation]);

  const handleLocationChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocation(e.target.value);
  };

  const handlePageChange = (page: number) => {
    fetchJobs(page, searchInput, selectedLocation);
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
      <div className="flex justify-center mt-[2vw] space-x-[0.5vw]">
        {/* Previous Button */}
        {current_page > 1 && (
          <button 
            onClick={() => handlePageChange(current_page - 1)} 
            className="px-[1vw] py-[0.5vw] rounded bg-gray-100 text-[1vw] text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Prev
          </button>
        )}

        {/* Page Buttons */}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-[1vw] py-[0.5vw] rounded text-[1vw] transition-colors ${page === current_page 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        {current_page < total_pages && (
          <button 
            onClick={() => handlePageChange(current_page + 1)} 
            className="px-[1vw] py-[0.5vw] rounded bg-gray-100 text-[1vw] text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Next
          </button>
        )}
      </div>
    );
  };

  return (
    <section className="container mx-auto py-[3vw]">
      <div className="bg-white shadow-lg rounded-[1vw] overflow-hidden">
        {/* Header */}
        <div className="bg-[#577C8E] p-[1.5vw]">
          <h2 className="text-[2vw] font-bold text-center text-white mb-[1vw]">
            Available Job Listings
          </h2>
          
          {/* Search and Filter Container */}
          <div className="flex flex-col md:flex-row gap-[1vw] w-full">
            {/* Search Input */}
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search jobs..."
                className="w-full p-[0.75vw] pl-[3vw] text-[1vw] font-sans rounded-[0.75vw] border border-gray-300 focus:ring-[0.25vw] focus:ring-blue-500 focus:outline-none transition-all"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <Search className="absolute left-[0.75vw] top-1/2 -translate-y-1/2 text-[1.25vw] text-gray-400" />
            </div>

            {/* Location Filter */}
            <div className="relative font-sans flex-grow md:flex-grow-0 md:w-1/3">
              <select 
                value={selectedLocation} 
                onChange={handleLocationChange} 
                className="w-full p-[0.75vw] pl-[2.5vw] text-gray-400 text-[1vw] rounded-[0.75vw] border border-gray-300 focus:ring-[0.25vw] focus:ring-blue-500 focus:outline-none transition-all"
              >
                {locations.map((location) => (
                  <option key={location} value={location} className="text-[0.9vw] text-gray-800">{location}</option>
                ))}
              </select>
              <MapPin className="absolute left-[0.75vw] top-1/2 -translate-y-1/2 text-[1.25vw] text-gray-400" />
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="p-[1.5vw]">
          {isLoading ? (
            <div className="flex justify-center items-center py-[2.5vw]">
              <div className="animate-spin rounded-full h-[2.5vw] w-[2.5vw] border-t-[0.25vw] border-blue-500"></div>
            </div>
          ) : error ? (
            <p className="text-center text-[1.25vw] text-red-500 py-[2.5vw]">{error}</p>
          ) : jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-[2.5vw] text-gray-500">
              <Filter size="3vw" className="mb-[1vw]" />
              <p className="text-[1.5vw]">No jobs found matching your criteria</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1.5vw]">
                {jobs.map((job) => (
                  <JobCard key={job.id} {...job} sourceUrl={job.source_url} />
                ))}
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