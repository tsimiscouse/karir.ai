"use client";
import React from "react";

interface ResultsModalProps {
  onSeeResults: () => void;
  onDownloadResults: () => void;
  onClose: () => void;
}

const ResultsModal: React.FC<ResultsModalProps> = ({
  onSeeResults,
  onDownloadResults,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn"
        data-aos="zoom-in"
        data-aos-duration="400"
      >
        {/* Header with confetti background */}
        <div className="bg-gradient-to-r from-[#577C8E] to-[#3A5566] p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h3 className="text-xl font-bold">Your Results Are Ready!</h3>
          <p className="mt-1 text-white text-opacity-90">Thank you for using our service</p>
        </div>
        
        {/* Success icon */}
        <div className="p-6">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          
          <div className="text-center mb-6">
            <h4 className="text-lg font-bold text-gray-900 mb-2">Processing Complete</h4>
            <p className="text-gray-600">
              We&apos;ve analyzed your resume and found matching job opportunities for you. 
              You can now view your detailed results or download them as a PDF.
            </p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={onSeeResults}
              className="w-full py-3 bg-[#577C8E] text-white rounded-lg hover:bg-[#4a6b7d] transition-colors font-medium flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View My Results
            </button>
            
            <button
              onClick={onDownloadResults}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF Report
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 p-4 text-center border-t">
          <p className="text-sm text-gray-500">
            Don&apos;t forget to check your email for additional information and updates on your job matches.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsModal;