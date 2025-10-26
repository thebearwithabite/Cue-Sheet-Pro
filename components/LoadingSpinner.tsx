
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-4">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-dark"></div>
      <p className="ml-3 text-primary-dark">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
