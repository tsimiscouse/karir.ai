"use client";
import React from "react";

interface EmailVerificationModalProps {
  email: string;
  onResendVerification: () => void;
  onVerificationConfirmed: () => void;
  isChecking: boolean;
  onClose: () => void;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  email,
  onResendVerification,
  onVerificationConfirmed,
  isChecking,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 font-sans bg-black bg-opacity-[70%] z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[90%] sm:max-w-[80%] md:max-w-[60%] lg:max-w-[40vw] overflow-hidden animate-fadeIn"
        data-aos="zoom-in"
        data-aos-duration="400"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#577C8E] to-[#3A5566] px-4 sm:px-5 md:px-[2vw] py-4 md:py-[1.2vw] text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-3 md:top-4 right-3 md:right-4 text-white hover:text-gray-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h3 className="text-lg md:text-xl lg:text-[1.3vw] font-bold">Email Verification Required</h3>
          <p className="mt-1 text-sm md:text-base lg:text-[0.9vw] text-white text-opacity-90">Check your inbox to continue</p>
        </div>
        
        {/* Body */}
        <div className="p-4 sm:p-5 md:p-6">
          <div className="flex justify-center mb-4 sm:mb-5 md:mb-6">
            <div className="bg-blue-50 rounded-full p-3 md:p-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-[#577C8E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          
          <div className="text-center mb-4 sm:mb-5 md:mb-[1vw]">
            <p className="text-gray-700 mb-2 text-sm sm:text-base md:text-[1vw]">We&apos;ve sent a verification link to:</p>
            <p className="font-bold text-gray-900 break-all text-sm sm:text-base md:text-[1vw]">{email}</p>
            <p className="text-gray-600 mt-2 sm:mt-3 text-xs sm:text-sm md:text-[0.9vw]">Please click the link in the email to verify your account and access your results.</p>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <button
              onClick={onVerificationConfirmed}
              disabled={isChecking}
              className="w-full py-2 sm:py-3 md:py-[0.7vw] bg-[#577C8E] text-xs sm:text-sm md:text-[0.9vw] text-white rounded-lg hover:bg-[#4a6b7d] transition-colors font-medium flex items-center justify-center"
            >
              {isChecking ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Checking verification status...
                </>
              ) : (
                "I've verified my email"
              )}
            </button>
            
            <button
              onClick={onResendVerification}
              className="w-full py-2 sm:py-3 md:py-[0.7vw] border text-xs sm:text-sm md:text-[0.9vw] border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Resend verification email
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 p-3 sm:p-4 md:p-[3vh] text-center text-gray-500 border-t text-xs sm:text-sm md:text-[0.9vw]">
          <p>Didn&apos;t receive an email? Check your spam folder or contact support.</p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal;