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

  const formatSalary = (salaryMin: number | null, salaryMax: number | null) => {
    if (salaryMin === null || salaryMin === -1) {
      return "Salary not specified";
    }
  
    if (salaryMax === null || salaryMax === -1) {
      return `From Rp${salaryMin.toLocaleString()}`;
    }
  
    // Ensure salaryMin and salaryMax are numbers before formatting
    if (typeof salaryMin === 'number' && typeof salaryMax === 'number') {
      return `Rp${salaryMin.toLocaleString()} - Rp${salaryMax.toLocaleString()}`;
    }
  
    return "Range Gaji Belum Valid";
  };
  

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        className="group relative p-[3vw] md:p-[1vw] border border-gray-200 rounded-[1vw] bg-white 
      hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-[0.5vw] 
      cursor-pointer overflow-hidden font-sans"
        onClick={handleCardClick}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>

        {/* Card Content */}
        <div className="flex items-center mb-[1vw] relative">
          {logo ? (
            <div className="relative w-[8vw] h-[8vw] mr-[2vw]  md:w-[3vw] md:h-[3vw] md:mr-[1vw] rounded-[0.5vw] overflow-hidden shadow-md">
              <Image
                src={logo}
                alt={`${companyName} logo`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ) : (
            <div className="w-[3vw] h-[3vw] mr-[1vw] bg-gray-200 flex items-center justify-center rounded-[0.5vw]">
              <span className="text-[0.8vw] text-gray-500">No Logo</span>
            </div>
          )}
          <h3 className="text-[3vw] md:text-[1.2vw] font-bold text-black line-clamp-2">
            {title}
          </h3>
        </div>

        <div className="space-y-[1vw] md:space-y-[0.5vw] mt-4 md:mt-0">
          {/* Company */}
          <div className="flex items-center text-[2.5vw] md:text-[0.9vw] text-gray-700">
            <Building2 className="w-[4vw] h-[4vw] md:w-[1.2vw] md:h-[1.2vw] mr-[0.5vw] text-gray-500" />
            <p>{companyName}</p>
          </div>

          {/* Location */}
          <div className="flex items-center text-[2.5vw] md:text-[0.9vw] text-gray-700">
            <MapPin className="w-[4vw] h-[4vw] md:w-[1.2vw] md:h-[1.2vw] mr-[0.5vw] text-gray-500" />
            <p>{location}</p>
          </div>

          {/* Employment Type */}
          <div className="flex items-center text-[2.5vw] md:text-[0.9vw] text-gray-700">
            <Clock className="w-[4vw] h-[4vw] md:w-[1.2vw] md:h-[1.2vw] mr-[0.5vw] text-gray-500" />
            <p>{employmentType}</p>
          </div>

          {/* Salary */}
          <div className="flex items-center text-[2.5vw] md:text-[0.9vw] text-gray-700">
            <DollarSign className="w-[4vw] h-[4vw] md:w-[1.2vw] md:h-[1.2vw] mr-[0.5vw] text-gray-500" />
            <p>{formatSalary()}</p>
          </div>
        </div>

        {/* Hover Effect Indicator */}
        <div
          className="absolute bottom-0 left-0 w-full h-[0.25vw] bg-blue-500 
        origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
        ></div>
      </div>
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
    </>
  );
};

export default JobCard;
