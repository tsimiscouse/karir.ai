"use client";
import React, { useState, useMemo } from "react";
import JobCard from "@/components/Job/JobCard";

interface Job {
  logo: string;
  title: string;
  companyName: string;
  location: string;
  employmentType: string;
  salary: string;
}

interface ListJobProps {
  searchTerm: string;
}

const JobListingSection: React.FC<ListJobProps> = ({ searchTerm }) => {
  // Sample job data
  const initialJobs: Job[] = useMemo(
    () =>
      Array(30).fill({
        logo: "/logokarirtegakblack.png",
        title: "Sales Promotion Girls",
        companyName: "PT. Gadjah Mada UKT, TBK",
        location: "Jalan Bulaksumur, No. 1, Sleman, DIY",
        employmentType: "Penuh Waktu",
        salary: "Rp2.000.000 - Rp3.500.000 / bulan",
      }),
    []
  );

  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 12;

  // Filter jobs berdasarkan searchTerm
  const jobs = useMemo(() => {
    if (!searchTerm.trim()) return initialJobs;
    return initialJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, initialJobs]);

  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  return (
    <section className="p-20 pt-0 bg-white rounded-lg">
      <h2 className="text-2xl text-center mb-4 text-black font-righteous">
        DAFTAR LOWONGAN TERSEDIA
      </h2>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="w-full md:w-1/3 p-3 bg-[#F4EFEB] rounded-lg flex items-center justify-center space-x-2 text-gray-700 hover:bg-[#e0d6cf] transition-colors"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            ></path>
          </svg>
          <span>Filter Berdasarkan Lokasi</span>
          <svg
            className={`w-4 h-4 text-gray-600 transform ${
              filterOpen ? "rotate-180" : ""
            } transition-transform`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
      </div>

      {filterOpen && (
        <div className="bg-[#F4EFEB] text-gray-700 p-4 mb-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Sleman, DIY", "Jakarta", "Bandung"].map((city) => (
              <label key={city} className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                <span>{city}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentJobs.map((job, index) => (
          <JobCard
            key={`${job.companyName}-${index}`}
            logo={job.logo}
            title={job.title}
            companyName={job.companyName}
            location={job.location}
            employmentType={job.employmentType}
            salary={job.salary}
          />
        ))}
      </div>

      {/* Paginasi */}
      <div id="Paginasi" className="flex items-center justify-between p-4 border-t border-blue-gray-50 mt-10">
        <p className="text-sm text-gray-900">
          Page {currentPage} of {totalPages} | Total Jobs: {jobs.length}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-gray-900 py-2 px-4 text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-gray-900 py-2 px-4 text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default JobListingSection;
