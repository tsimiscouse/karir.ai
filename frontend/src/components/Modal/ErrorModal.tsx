import React from 'react';
import { useRouter } from 'next/navigation';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, onClose, message }) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleRedirect = () => {
    router.push('/');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div 
        className="bg-white rounded-lg md:rounded-xl shadow-xl w-full max-w-[90%] md:max-w-md transform transition-all"
        data-aos="zoom-in"
        data-aos-duration="300"
      >
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-red-100 p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 md:h-8 md:w-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 text-center mb-2">
            User Not Found
          </h3>
          
          <p className="text-sm md:text-base text-gray-600 text-center mb-6">
            {message}
          </p>

          <div className="flex flex-col md:flex-row gap-3 justify-center">
            <button
              onClick={handleRedirect}
              className="px-4 py-2 bg-[#577C8E] text-white rounded-lg text-sm md:text-base font-medium hover:bg-[#3A5566] transition-colors duration-200"
            >
              Go to Homepage
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm md:text-base font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
