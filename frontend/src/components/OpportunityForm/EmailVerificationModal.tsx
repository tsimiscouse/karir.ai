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
    <div className="fixed inset-0 font-sans bg-black bg-opacity-[70%] z-50 flex items-center justify-center">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[40vw] overflow-hidden animate-fadeIn"
        data-aos="zoom-in"
        data-aos-duration="400"
      >
        {/* Header */}
        <div className="bg-[#577C8E] px-[2vw] py-[1.2vw] text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h3 className="text-[1.3vw] font-righteous">Email Verification Required</h3>
          <p className="mt-[0.1vh] text-[0.9vw] text-white text-opacity-90">Check your inbox to continue</p>
        </div>
        
        {/* Body */}
        <div className="p-6">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-50 rounded-full p-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#577C8E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          
          <div className="text-center mb-[1vw]">
            <p className="text-gray-700 mb-2 text-[1vw]">We&apos;ve sent a verification link to:</p>
            <p className="font-bold text-gray-900 break-all text-[1vw]">{email}</p>
            <p className="text-gray-600 mt-3 text-[0.9vw]">Please click the link in the email to verify your account and access your results.</p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={onVerificationConfirmed}
              disabled={isChecking}
              className="w-full py-[0.7vw] bg-[#577C8E] text-[0.9vw] text-white rounded-lg hover:bg-[#4a6b7d] transition-colors font-medium flex items-center justify-center"
            >
              {isChecking ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
              className="w-full py-[0.7vw] border text-[0.9vw] border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Resend verification email
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 p-[3vh] text-center text-gray-500 border-t text-[0.9vw]">
          <p>Didn&apos;t receive an email? Check your spam folder or contact support.</p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal;