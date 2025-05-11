import React, { useState } from "react";
import Image from "next/image";
import { Building2, MapPin, Clock, DollarSign } from "lucide-react";
import JobDetailModal from "./JobDetailModal";

interface JobCardProps {
  id: string;
  title: string;
  companyName: string;
  location: string;
  employmentType: string;
  salaryMin: number | null;
  salaryMax: number | null;
  logo: string;
  sourceUrl: string;
  description: string;
  experience: string;
}

const JobCard: React.FC<JobCardProps> = ({
  id,
  title,
  companyName,
  location,
  employmentType,
  salaryMin,
  salaryMax,
  logo,
  description,
  experience,
  sourceUrl,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Format salary
  const formatSalary = () => {
    if (salaryMin === null || salaryMin === -1) {
      return "Salary not specified";
    }

    if (salaryMax === null || salaryMax === -1) {
      return `From Rp${salaryMin.toLocaleString()}`;
    }

    return `Rp${salaryMin.toLocaleString()} - Rp${salaryMax.toLocaleString()}`;
  };

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        className="group relative p-4 sm:p-6 border border-gray-200 rounded-xl bg-white 
  hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 
  cursor-pointer font-sans"
        onClick={handleCardClick}
      >
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

        {/* Logo and Title */}
        <div className="flex items-start mb-4 sm:mb-6">
          {logo ? (
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 mr-4 rounded-lg overflow-hidden border border-gray-100 bg-white p-1 shadow-sm">
              <Image
                src={logo}
                alt={`${companyName} logo`}
                fill
                className="object-contain"
                sizes="100%"
              />
            </div>
          ) : (
            <div className="w-14 h-14 sm:w-16 sm:h-16 mr-4 bg-[#EFF6FA] flex items-center justify-center rounded-lg border border-gray-100">
              <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-[#577C8E]" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 line-clamp-2 group-hover:text-[#577C8E] transition-colors duration-300">
              {title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{companyName}</p>
          </div>
        </div>

        {/* Info Items */}
        <div className="space-y-3">
          {/* Location */}
          <div className="flex items-center text-sm text-gray-700">
            <div className="w-7 h-7 mr-2 bg-[#EFF6FA] rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-[#577C8E]" />
            </div>
            <p className="truncate">{location}</p>
          </div>

          {/* Employment Type */}
          <div className="flex items-center text-sm text-gray-700">
            <div className="w-7 h-7 mr-2 bg-[#EFF6FA] rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-[#577C8E]" />
            </div>
            <p className="truncate">{employmentType}</p>
          </div>

          {/* Salary */}
          <div className="flex items-center text-sm text-gray-700">
            <div className="w-7 h-7 mr-2 bg-[#EFF6FA] rounded-full flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-4 h-4 text-[#577C8E]" />
            </div>
            <p className="truncate">{formatSalary()}</p>
          </div>
        </div>

        {/* Apply Button (appears on hover in desktop) */}
        <div className="mt-4 hidden sm:block overflow-auto h-9">
          <div className="transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button className="w-full py-2 bg-gradient-to-r from-[#577C8E] to-[#3A5566] text-white text-sm rounded-md font-medium">
              View Details
            </button>
          </div>
        </div>

        {/* Mobile Button always visible */}
        <div className="mt-4 sm:hidden">
          <button className="w-full py-2 bg-gradient-to-r from-[#577C8E] to-[#3A5566] text-white text-sm rounded-md font-medium">
            View Details
          </button>
        </div>

        {/* Bottom indicator bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#577C8E] to-[#3A5566] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 hidden sm:block"></div>
      </div>

      {/* Modal portal to render at the document root */}
      {isModalOpen && (
        <JobDetailModal
          job={{
            id,
            title,
            logo,
            companyName,
            location,
            employmentType,
            salaryMin,
            salaryMax,
            description,
            experience,
            sourceUrl,
          }}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default JobCard;
