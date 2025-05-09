import React from 'react';
import Image from 'next/image';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  showText = true,
}) => {
  const dimensions = {
    small: 'w-12 h-12',
    medium: 'w-20 h-20',
    large: 'w-[13vw] h-[13vw]',
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-black">
      <div className="flex flex-col items-center justify-center">
        <div className={`animate-spin-slow ${dimensions[size]}`}>
          <Image 
            src="/logokarirtegak.png" 
            alt="Loading" 
            className="w-full h-full object-contain"
            width={size === 'small' ? 48 : size === 'medium' ? 80 : 128}
            height={size === 'small' ? 48 : size === 'medium' ? 80 : 128}
          />
        </div>
        {showText && (
          <div className="mt-[5vw] w-[20vw] h-3 rounded-full overflow-hidden">
            <div className="h-full bg-white animate-loading-bar" />
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
