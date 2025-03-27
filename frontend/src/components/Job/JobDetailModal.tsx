'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Briefcase, Clock } from 'lucide-react';

interface JobDetailModalProps {
  job: {
    id: string;
    title: string;
    companyName: string;
    description: string;
    employmentType: string;
    experience: string;
    location: string;
    logo: string;
    sourceUrl: string;
    salaryMin: number | null;
    salaryMax: number | null;
  };
  isOpen: boolean;
  onClose: () => void;
}

const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, isOpen, onClose }) => {
  // Helper function to strip HTML tags
  const stripHtmlTags = (html: string) => html.replace(/<[^>]*>/g, '');

  // Map experience codes to readable labels
  const experienceLabel = (code: string) => {
    const labels: Record<string, string> = {
      MI: "Mid Level",
      SE: "Senior Level",
      EX: "Expert Level",
      EN: "Entry Level",
    };
    return labels[code] || "Unknown Level";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed font-sans inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-[1vw]"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-[0.6vw] w-full max-w-[50vw] max-h-[70vh] overflow-y-auto scrollbar-hide"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#577C8E] text-white p-[1.5vw] flex justify-between items-center sticky top-0 z-10">
              <div className="flex items-center space-x-[1vw]">
                <img 
                  src={job.logo || "/api/placeholder/50/50"} 
                  alt={`${job.companyName} logo`} 
                  className="w-[5vw] h-[5vw] object-contain rounded-[0.5vw]"
                />
                <div>
                  <h2 className="text-[1.5vw] font-bold">{job.title}</h2>
                  <p className="text-[0.9vw] text-white/80">{job.companyName}</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="hover:bg-white/20 rounded-full p-[0.5vw] transition-colors top-[1vw] right-[1vw] absolute"
              >
                <X className="w-[1.5vw] h-[1.5vw]" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-[1.5vw] space-y-[1vw]">
              {/* Job Info Tiles */}
              <div className="grid grid-cols-3 gap-[0.75vw]">
                <div className="bg-gray-100 rounded-[0.5vw] p-[1vw] flex items-center space-x-[0.5vw]">
                  <MapPin className="w-[1vw] h-[1vw] text-[#577C8E]" />
                  <div>
                    <p className="text-[0.6vw] text-gray-500">Location</p>
                    <p className="text-[0.7vw] text-gray-800 font-semibold">{job.location}</p>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-[0.5vw] p-[1vw] flex items-center space-x-[0.5vw]">
                  <Briefcase className="w-[1vw] h-[1vw] text-[#577C8E]" />
                  <div>
                    <p className="text-[0.6vw] text-gray-500">Job Type</p>
                    <p className="text-[0.7vw] text-gray-800 font-semibold">{job.employmentType}</p>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-[0.5vw] p-[1vw] flex items-center space-x-[0.5vw]">
                  <Clock className="w-[1vw] h-[1vw] text-[#577C8E]" />
                  <div>
                    <p className="text-[0.6vw] text-gray-500">Experience</p>
                    <p className="text-[0.7vw] text-gray-800 font-semibold">{experienceLabel(job.experience)}</p>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div>
                <h3 className="text-[1vw] font-bold mb-[0.5vw] text-[#577C8E]">Job Description</h3>
                <p className="text-[0.75vw] text-gray-700 leading-[1.5]">
                  {stripHtmlTags(job.description)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-[0.75vw] mt-[1vw] sticky bottom-0 z-10 bg-white px-[1vw] py-[1.5vw]">
                <a 
                  href={job.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#577C8E] text-white text-[0.7vw] px-[1vw] py-[0.5vw] rounded-[0.5vw] hover:bg-opacity-90 transition-colors"
                >
                  Apply Now
                </a>
                <button 
                  onClick={onClose}
                  className="border border-gray-300 text-[#577C8E] text-[0.7vw] px-[1vw] py-[0.5vw] rounded-[0.5vw] hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JobDetailModal;
