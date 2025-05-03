import React from 'react';
import { useNavigate } from 'react-router-dom';
import TrainForm from '../components/TrainForm';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Home page component with the train form
 */
const Home = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /**
   * Handle form submission
   * @param {Object} formData - Form data with trainNumber and date
   */
  const handleSubmit = (formData) => {
    // Store the form data in query params and navigate to status page
    navigate(`/status?trainNumber=${formData.trainNumber}&date=${formData.date}`);
    
    // Invalidate any existing queries to ensure fresh data
    queryClient.invalidateQueries(['trainStatus']);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Train Tracker
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Get real-time updates on your train's location, arrival times, and delays
        </p>
      </div>
      
      <TrainForm onSubmit={handleSubmit} />
      
      <div className="mt-12 text-center text-sm text-gray-500">
        <p>Enter your train number and journey date to track your train in real-time</p>
      </div>
    </div>
  );
};

export default Home;
