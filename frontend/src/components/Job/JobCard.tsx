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
        className="group relative p-[1.5vw] border border-gray-200 rounded-[1vw] bg-white 
        hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-[0.3vw] 
        cursor-pointer font-sans"
        onClick={handleCardClick}
      >
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
        
        {/* Logo and Title */}
        <div className="flex items-start mb-[1.2vw]">
          {logo ? (
            <div className="relative w-[3.5vw] h-[3.5vw] mr-[1vw] rounded-[0.8vw] overflow-hidden border border-gray-100 bg-white p-[0.3vw] shadow-sm">
              <Image
                src={logo}
                alt={`${companyName} logo`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ) : (
            <div className="w-[3.5vw] h-[3.5vw] mr-[1vw] bg-[#EFF6FA] flex items-center justify-center rounded-[0.8vw] border border-gray-100">
              <Building2 className="w-[1.5vw] h-[1.5vw] text-[#577C8E]" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-[1.1vw] font-bold text-gray-800 line-clamp-2 group-hover:text-[#577C8E] transition-colors duration-300">
              {title}
            </h3>
            <p className="text-[0.8vw] text-gray-500 mt-[0.2vw]">{companyName}</p>
          </div>
        </div>

        {/* Info Items */}
        <div className="space-y-[0.7vw]">
          {/* Location */}
          <div className="flex items-center text-[0.8vw] text-gray-700">
            <div className="w-[1.8vw] h-[1.8vw] mr-[0.6vw] bg-[#EFF6FA] rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-[0.9vw] h-[0.9vw] text-[#577C8E]" />
            </div>
            <p className="truncate">{location}</p>
          </div>

          {/* Employment Type */}
          <div className="flex items-center text-[0.8vw] text-gray-700">
            <div className="w-[1.8vw] h-[1.8vw] mr-[0.6vw] bg-[#EFF6FA] rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="w-[0.9vw] h-[0.9vw] text-[#577C8E]" />
            </div>
            <p className="truncate">{employmentType}</p>
          </div>

          {/* Salary */}
          <div className="flex items-center text-[0.8vw] text-gray-700">
            <div className="w-[1.8vw] h-[1.8vw] mr-[0.6vw] bg-[#EFF6FA] rounded-full flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-[0.9vw] h-[0.9vw] text-[#577C8E]" />
            </div>
            <p className="truncate">{formatSalary()}</p>
          </div>
        </div>

        {/* Apply Button (appears on hover) */}
        <div className="mt-[1.2vw] overflow-auto h-[2.2vw]">
          <div className="transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button className="w-full py-[0.5vw] bg-gradient-to-r from-[#577C8E] to-[#3A5566] text-white text-[0.8vw] rounded-[0.5vw] font-medium">
              View Details
            </button>
          </div>
        </div>

        {/* Bottom indicator bar */}
        <div className="absolute bottom-0 left-0 w-full h-[0.2vw] bg-gradient-to-r from-[#577C8E] to-[#3A5566] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
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