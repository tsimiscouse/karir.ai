"use client";
import React, { useState } from "react";
import JobCard from "@/components/Job/JobCard";
import Image from "next/image";
import Link from "next/link";

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
    title: "Sales Promotion Girls",
    company: "PT. Gadjah Mada UKT, TBK",
    location: "Jalan Bulaksumur, No. 1, Sleman, DIY",
    jobType: "Penuh Waktu",
    salary: "Rp2.000.000 - Rp3.500.000 / bulan",
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
  }, [searchTerm]);

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
    <div className="flex flex-col min-h-screen bg-[#F8F6F3]">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 bg-[#ECEDE8] shadow-md">
        <div className="flex items-center space-x-2">
          <Image src="/logokarirmiring.png" alt="Karir.AI Logo" width={120} height={40} />
        </div>
        <div className="flex space-x-6 text-lg font-medium text-[#2F4157]">
          <Link href="/analisa" className="hover:text-gray-600">Analisa Resume</Link>
          <Link href="/joblistsearch" className="hover:text-gray-600">Lowongan</Link>
          <Link href="/about" className="hover:text-gray-600">About</Link>
        </div>
      </nav>

      {/* Main Content */}
      <section className="p-20 pt-0 bg-white rounded-lg flex-grow">
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

      {/* Footer */}
      <footer className="bg-[#2F4157] text-[#F4EFEB] py-6 px-10 mt-auto">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Image src="/logokarirtegak.png" alt="Karir.ai logo" width={50} height={50} className="mr-2" />
            <span className="text-xl font-bold">KARIR.AI</span>
          </div>
          <div className="text-center md:text-left">
            <p>Karir.ai adalah produk dari proyek senior UGM.</p>
            <p>Made with ❤️ and ☕ by:</p>
            <p>1. Muhammad Luthfi Attaqi - 22/496427/TK/54387</p>
            <p>2. Septian Eka Rahmadi - 22/496732/TK/54442</p>
            <p>3. Shafa Aura Yogadiasa - 22/496508/TK/54406</p>
          </div>
          <nav className="space-x-8">
            <Link href="/analisa" className="text-gray-400 hover:text-gray-200">Analisa Resume</Link>
            <Link href="/joblistsearch" className="text-gray-400 hover:text-gray-200">Lowongan</Link>
            <Link href="/about" className="text-gray-400 hover:text-gray-200">About</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default JobListingPage;
