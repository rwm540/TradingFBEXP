import React from 'react';

interface LoadingSpinnerProps {
    isOpen: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100]" aria-label="Loading">
            <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-blue-500 rounded-full opacity-50"></div>
                <div 
                    className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"
                    style={{ animationDuration: '1.2s' }}
                ></div>
                <div 
                    className="absolute inset-2 border-2 border-transparent border-t-cyan-400 rounded-full animate-spin"
                    style={{ animationDuration: '0.8s', animationDirection: 'reverse' }}
                ></div>
                 <div 
                    className="absolute inset-4 border-2 border-transparent border-b-purple-500 rounded-full animate-spin"
                    style={{ animationDuration: '1.5s' }}
                ></div>
            </div>
        </div>
    );
};

export default LoadingSpinner;