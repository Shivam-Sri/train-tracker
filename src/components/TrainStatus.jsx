import React from 'react';
import { formatRelativeTime } from '../utils/dateFormatter';
import StationTimeline from './StationTimeline';

/**
 * TrainStatus component for displaying train details and station timeline
 * @param {Object} props - Component props
 * @param {Object} props.trainData - Train data object
 * @param {Function} props.onRefresh - Callback function for refresh action
 */
const TrainStatus = ({ trainData, onRefresh }) => {
  if (!trainData) return null;

  const { 
    trainNumber, 
    trainName, 
    source, 
    destination, 
    lastUpdated, 
    stations = [],
    currentStation,
    route
  } = trainData;

  // Find the current station code
  const currentStationCode = currentStation?.stationCode || '';
  
  // Extract route information
  const routeInfo = parseRouteInfo(route);

  return (
    <div className="card max-w-3xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{trainNumber} - {trainName}</h2>
          <p className="text-gray-600 mt-1">{source} to {destination}</p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated {formatRelativeTime(lastUpdated)}
          </p>
        </div>
        
        <button 
          onClick={onRefresh}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          title="Refresh"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      {/* Route Information Card */}
      {routeInfo && (
        <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-100">
          <h3 className="text-md font-semibold text-blue-800 mb-2">Route Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-gray-500 mb-1">Starts From</div>
              <div className="font-medium text-gray-800">{routeInfo.startLocation}</div>
            </div>
            
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-gray-500 mb-1">Ends At</div>
              <div className="font-medium text-gray-800">{routeInfo.endLocation}</div>
            </div>
            
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-gray-500 mb-1">Journey Duration</div>
              <div className="font-medium text-gray-800">{routeInfo.journeyDuration}</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Progress indicator */}
      {stations.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>{source}</span>
            <span>{destination}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
              style={{ 
                width: `${calculateJourneyProgress(stations, currentStationCode)}%` 
              }}
            ></div>
          </div>
        </div>
      )}
      
      {/* Station Timeline */}
      <StationTimeline 
        stations={stations} 
        currentStationCode={currentStationCode} 
      />
    </div>
  );
};

/**
 * Parse route information from the route string
 * @param {string} routeString - The route string from the API
 * @returns {Object} - Parsed route information
 */
const parseRouteInfo = (routeString) => {
  if (!routeString) return null;
  
  // Example route string: "Train 18117 starts from\n          Rourkela(Rourkela) and ends at\n          Gunupur(Gunupur). Total journey duration is\n          16:25 hours"
  
  try {
    // Extract start location
    const startMatch = routeString.match(/starts from\s*([^\(]+)\(([^\)]+)\)/);
    const startLocation = startMatch ? `${startMatch[1].trim()} (${startMatch[2].trim()})` : 'N/A';
    
    // Extract end location
    const endMatch = routeString.match(/ends at\s*([^\(]+)\(([^\)]+)\)/);
    const endLocation = endMatch ? `${endMatch[1].trim()} (${endMatch[2].trim()})` : 'N/A';
    
    // Extract journey duration
    const durationMatch = routeString.match(/journey duration is\s*([\d:]+)\s*hours/);
    const journeyDuration = durationMatch ? `${durationMatch[1].trim()} hours` : 'N/A';
    
    return {
      startLocation,
      endLocation,
      journeyDuration
    };
  } catch (error) {
    console.error('Error parsing route information:', error);
    return {
      startLocation: 'N/A',
      endLocation: 'N/A',
      journeyDuration: 'N/A'
    };
  }
};

/**
 * Calculate the journey progress percentage
 * @param {Array} stations - Array of station objects
 * @param {string} currentStationCode - Code of the current station
 * @returns {number} - Progress percentage (0-100)
 */
const calculateJourneyProgress = (stations, currentStationCode) => {
  if (!stations || stations.length === 0 || !currentStationCode) {
    return 0;
  }

  const totalStations = stations.length;
  const currentStationIndex = stations.findIndex(
    station => station.stationCode === currentStationCode
  );

  if (currentStationIndex === -1) return 0;
  
  return Math.round((currentStationIndex / (totalStations - 1)) * 100);
};

export default TrainStatus;
