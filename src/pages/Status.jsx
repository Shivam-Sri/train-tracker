import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTrainStatus } from '../services/trainApi';
import TrainStatus from '../components/TrainStatus';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

/**
 * Status page component to display train status
 */
const Status = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const trainNumber = searchParams.get('trainNumber');
  const date = searchParams.get('date');
  
  // Redirect to home if no train number or date
  useEffect(() => {
    if (!trainNumber || !date) {
      navigate('/');
    }
  }, [trainNumber, date, navigate]);
  
  // Fetch train status data
  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    refetch,
    isFetching
  } = useQuery(
    ['trainStatus', trainNumber, date],
    () => getTrainStatus(trainNumber, date),
    {
      enabled: !!trainNumber && !!date,
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
  
  // Handle back button click
  const handleBack = () => {
    navigate('/');
  };
  
  // Handle refresh button click
  const handleRefresh = () => {
    refetch();
  };
  
  // Check for offline status
  const isOffline = !navigator.onLine;
  
  if (isOffline) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card max-w-3xl mx-auto">
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
            </svg>
            <h2 className="text-xl font-bold text-gray-800 mb-2">You're offline</h2>
            <p className="text-gray-600">Please check your internet connection and try again</p>
            <button 
              onClick={handleRefresh}
              className="btn-primary mt-4"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Search
        </button>
      </div>
      
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <ErrorMessage 
          message={error?.message || 'Failed to fetch train status'} 
          onRetry={refetch}
        />
      ) : data ? (
        <div className={`transition-opacity duration-300 ${isFetching ? 'opacity-50' : 'opacity-100'}`}>
          <TrainStatus 
            trainData={data} 
            onRefresh={handleRefresh} 
          />
        </div>
      ) : (
        <div className="card max-w-3xl mx-auto text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Data Found</h2>
          <p className="text-gray-600">No information available for this train</p>
          <button 
            onClick={handleBack}
            className="btn-primary mt-4"
          >
            Try Another Train
          </button>
        </div>
      )}
    </div>
  );
};

export default Status;
