"use client";

import React, { useState } from "react";
import JobCard from "@/components/Job/JobCard";
import Layout from "@/components/Layout/Layout";

interface Job {
  title: string;
  company: string;
  location: string;
  jobType: string;
  salary: string;
}

const JobListingPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Sample job data
  const initialJobs: Job[] = Array(30).fill({
    logo: "/logokarirtegakblack.png",
    title: "Tidak ada lamaran",
    companyName: "Tidak ada nama perusahaan",
    location: "Tidak ada alamat perusahaan",
    employmentType: "Tidak ada tipe pekerjaan",
    salary: "Tidak ada rentang gaji",
  });

  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 12;

  React.useEffect(() => {
    if (!searchTerm?.trim()) {
      setJobs(initialJobs);
    } else {
      const filtered = initialJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setJobs(filtered);
    }
  }, [searchTerm, initialJobs]);

  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Layout>
    <div className="flex flex-col min-h-screen bg-[#F8F6F3]">
      

      {/* Main Content */}
      <section className="p-20 pt-[8vw] bg-white rounded-lg flex-grow">
        <h2 className="text-2xl text-center mb-4 text-black" style={{ fontFamily: "Righteous" }}>
          DAFTAR LOWONGAN TERSEDIA
        </h2>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <input
            type="text"
            placeholder="Cari pekerjaan..."
            className="p-2 border border-gray-300 rounded-md"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={() => setFilterOpen(!filterOpen)} className="w-full md:w-1/3 p-3 bg-[#F4EFEB] rounded-lg flex items-center justify-center space-x-2 text-gray-700">
            <span>Filter Berdasarkan Lokasi</span>
          </button>
        </div>

        {filterOpen && (
          <div className="bg-[#F4EFEB] text-gray-700 p-4 mb-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                <span>Sleman, DIY</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                <span>Jakarta</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                <span>Bandung</span>
              </label>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentJobs.map((job, index) => (
            <JobCard key={index} {...job} />
          ))}
        </div>

        <div id="Paginasi" className="flex items-center justify-between p-4 border-t border-blue-gray-50 mt-10">
          <p className="block font-sans text-sm antialiased font-normal leading-normal text-gray-900">
            Page {currentPage} of {totalPages} | Total Jobs: {jobs.length}
          </p>
          <div className="flex gap-2 me-2">
            <button onClick={prevPage} disabled={currentPage === 1} className="select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75">
              Previous
            </button>
            <button onClick={nextPage} disabled={currentPage === totalPages} className="select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75">
              Next
            </button>
          </div>
        </div>
      </section>

    </div>
    </Layout>
  );
};

export default JobListingPage;
