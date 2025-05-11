'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
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

  // Disable body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Portal content
  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center font-sans"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-lg w-full max-w-[90%] md:max-w-[85%] lg:max-w-[70%] xl:max-w-[50%] max-h-[90vh] md:max-h-[80vh] overflow-y-auto scrollbar-hide font-sans m-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#577C8E] to-[#3A5566] text-white p-6 md:p-8 pb-6 md:pb-10 flex flex-col md:flex-row justify-between items-start md:items-center sticky top-0 z-10">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 w-full pr-10 md:pr-0">
                <Image 
                  src={job.logo || "/logokarirtegak.png"} 
                  alt={`${job.companyName} logo`} 
                  width={100} 
                  height={100} 
                  className="w-16 h-16 md:w-20 md:h-20 object-contain rounded-md"
                />
                <div>
                  <h2 className="text-xl md:text-2xl font-bold">{job.title}</h2>
                  <p className="text-sm md:text-base text-white/80">{job.companyName}</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="absolute top-4 right-4 z-20 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all duration-300 shadow-md text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="bg-gray-100 p-4 md:p-6 space-y-4 md:space-y-6">
              {/* Job Info Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                <div className="bg-white rounded-lg p-3 md:p-4 flex items-center space-x-3">
                  <div className="bg-[#EFF6FA] p-3 rounded-full">
                    <MapPin className="w-5 h-5 text-[#577C8E]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-semibold text-gray-800">{job.location}</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 md:p-4 flex items-center space-x-3">
                  <div className="bg-[#EFF6FA] p-3 rounded-full">
                    <Briefcase className="w-5 h-5 text-[#577C8E]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Job Type</p>
                    <p className="text-sm font-semibold text-gray-800">{job.employmentType}</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 md:p-4 flex items-center space-x-3">
                  <div className="bg-[#EFF6FA] p-3 rounded-full">
                    <Clock className="w-5 h-5 text-[#577C8E]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Experience</p>
                    <p className="text-sm font-semibold text-gray-800">{experienceLabel(job.experience)}</p>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className='px-1 md:px-2'>
                <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-[#3A5566] flex items-center">
                  <span className="bg-[#577C8E] w-1 h-5 mr-2 rounded-full inline-block"></span>
                  Job Description
                </h3>
                <div className="text-sm md:text-base p-3 md:p-4 rounded-lg bg-white text-gray-700 leading-relaxed whitespace-normal">
                  {stripHtmlTags(job.description)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 md:space-x-4 mt-4 md:mt-6 sticky bottom-0 z-10 bg-gray-100 px-4 md:px-6 py-4 md:py-6">
                <a 
                  href={job.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-[#577C8E] to-[#3A5566] text-white text-sm px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
                >
                  Apply Now
                </a>
                <button 
                  onClick={onClose}
                  className="border border-gray-300 text-[#577C8E] text-sm px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
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

  // Use portal to render modal at document root
  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  
  // Fallback for SSR
  return null;
};

export default JobDetailModal;