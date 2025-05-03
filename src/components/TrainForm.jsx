import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { formatDateForApi } from '../utils/dateFormatter';

/**
 * TrainForm component for collecting train number and date inputs
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Callback function when form is submitted
 * @param {boolean} props.isLoading - Loading state
 */
const TrainForm = ({ onSubmit, isLoading }) => {
  const [trainNumber, setTrainNumber] = useState('');
  const [date, setDate] = useState(new Date());
  const [errors, setErrors] = useState({});

  /**
   * Validates the form inputs
   * @returns {boolean} - Whether the form is valid
   */
  const validateForm = () => {
    const newErrors = {};
    
    if (!trainNumber.trim()) {
      newErrors.trainNumber = 'Train number is required';
    } else if (!/^\d{1,5}$/.test(trainNumber.trim())) {
      newErrors.trainNumber = 'Train number must be 1-5 digits';
    }
    
    if (!date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        trainNumber: trainNumber.trim(),
        date: formatDateForApi(date)
      });
    }
  };

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Track Your Train</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="trainNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Train Number
          </label>
          <input
            type="text"
            id="trainNumber"
            className={`input-field ${errors.trainNumber ? 'border-red-500' : ''}`}
            placeholder="Enter train number (e.g., 12050)"
            value={trainNumber}
            onChange={(e) => setTrainNumber(e.target.value)}
            disabled={isLoading}
          />
          {errors.trainNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.trainNumber}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Journey Date
          </label>
          <DatePicker
            id="date"
            selected={date}
            onChange={(date) => setDate(date)}
            dateFormat="dd-MMM-yyyy"
            className={`input-field ${errors.date ? 'border-red-500' : ''}`}
            disabled={isLoading}
            minDate={new Date()}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date}</p>
          )}
        </div>
        
        <button
          type="submit"
          className="btn-primary w-full flex justify-center items-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Fetching...
            </>
          ) : (
            'Track Train'
          )}
        </button>
      </form>
    </div>
  );
};

export default TrainForm;
