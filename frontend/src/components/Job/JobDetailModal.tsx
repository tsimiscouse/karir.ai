'use client';
import React, { useEffect } from 'react';
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
            className="bg-white rounded-[0.6vw] w-full max-w-[50vw] max-h-[80vh] overflow-y-auto scrollbar-hide font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#577C8E] to-[#3A5566] text-white p-[2vw] pb-[2.5vw] flex justify-between items-center sticky top-0 z-10">
              <div className="flex items-center space-x-[1vw]">
                <img 
                  src={job.logo || "/logokarirtegak.png"} 
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
                className="absolute top-[1.2vw] right-[1.2vw] z-20 bg-white/20 hover:bg-white/30 rounded-full p-[0.6vw] transition-all duration-300 shadow-md text-white"
              >
                <X className="w-[1.2vw] h-[1.2vw]" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="bg-gray-100 p-[1.5vw] space-y-[1vw]">
              {/* Job Info Tiles */}
              <div className="grid grid-cols-3 gap-[0.75vw]">
                <div className="bg-white rounded-[0.5vw] p-[1vw] flex items-center space-x-[0.5vw]">
                  <div className="bg-[#EFF6FA] p-[0.8vw] rounded-full">
                    <MapPin className="w-[1.2vw] h-[1.2vw] text-[#577C8E]" />
                  </div>
                  <div>
                    <p className="text-[0.6vw] text-gray-500">Location</p>
                    <p className="text-[0.7vw] text-gray-800 font-semibold">{job.location}</p>
                  </div>
                </div>
                <div className="bg-white rounded-[0.5vw] p-[1vw] flex items-center space-x-[0.5vw]">
                  <div className="bg-[#EFF6FA] p-[0.8vw] rounded-full">
                    <Briefcase className="w-[1.2vw] h-[1.2vw] text-[#577C8E]" />
                  </div>
                  <div>
                    <p className="text-[0.6vw] text-gray-500">Job Type</p>
                    <p className="text-[0.7vw] text-gray-800 font-semibold">{job.employmentType}</p>
                  </div>
                </div>
                <div className="bg-white rounded-[0.5vw] p-[1vw] flex items-center space-x-[0.5vw]">
                  <div className="bg-[#EFF6FA] p-[0.8vw] rounded-full">
                    <Clock className="w-[1.2vw] h-[1.2vw] text-[#577C8E]" />
                  </div>
                  <div>
                    <p className="text-[0.6vw] text-gray-500">Experience</p>
                    <p className="text-[0.7vw] text-gray-800 font-semibold">{experienceLabel(job.experience)}</p>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className='px-[0.5vw]'>
                <h3 className="text-[1.2vw] font-bold mb-[1vw] text-[#3A5566] flex items-center">
                  <span className="bg-[#577C8E] w-[0.3vw] h-[1.2vw] mr-[0.6vw] rounded-full inline-block"></span>
                  Job Description
                </h3>
                <div className="text-[0.8vw] p-[0.8vw] rounded-[0.6vw] bg-white text-gray-700 leading-[1.6] whitespace-normal">
                  {stripHtmlTags(job.description)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-[0.75vw] mt-[1vw] sticky bottom-0 z-10 bg-gray-100 px-[1vw] py-[1.5vw]">
                <a 
                  href={job.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-[#577C8E] to-[#3A5566] text-white text-[0.7vw] px-[1vw] py-[0.5vw] rounded-[0.5vw] hover:bg-opacity-90 transition-colors"
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

  // Use portal to render modal at document root
  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  
  // Fallback for SSR
  return null;
};

export default JobDetailModal;