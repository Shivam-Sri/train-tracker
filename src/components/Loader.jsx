import React from 'react';

/**
 * Loader component for displaying loading state
 */
const Loader = () => {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <span className="ml-3 text-lg font-medium text-gray-700">Loading...</span>
    </div>
  );
};

export default Loader;
