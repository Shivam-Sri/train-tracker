import React from 'react';
import { formatTime, formatDelay, calculateDelayMinutes } from '../utils/dateFormatter';

/**
 * StationTimeline component for displaying train stations in a timeline
 * @param {Object} props - Component props
 * @param {Array} props.stations - Array of station objects
 * @param {string} props.currentStationCode - Code of the current/latest station
 */
const StationTimeline = ({ stations = [], currentStationCode }) => {
  if (!stations || stations.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No station information available
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Station Timeline</h3>
      
      <div className="space-y-0">
        {stations.map((station, index) => {
          const isCurrentStation = station.stationCode === currentStationCode;
          const delayMinutes = calculateDelayMinutes(station.delayDeparture || station.delayArrival);
          const isDelayed = delayMinutes > 10;
          
          // Determine station status class
          let stationClass = '';
          if (isCurrentStation) stationClass = 'station-current';
          if (isDelayed) stationClass = `${stationClass} station-delayed`;
          
          return (
            <div 
              key={`${station.stationCode}-${index}`}
              className={`station-item ${stationClass} transition-all duration-300 ${isCurrentStation ? 'bg-blue-50 -mx-4 px-4 py-2 rounded-lg' : ''}`}
            >
              <div className="station-dot"></div>
              
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <h4 className="text-base font-medium text-gray-900">
                    {station.stationName}
                    {isCurrentStation && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Current
                      </span>
                    )}
                  </h4>
                  
                  <p className="text-sm text-gray-600">
                    Day {station.day} • {station.date}
                  </p>
                </div>
                
                <div className="flex flex-col md:items-end mt-2 md:mt-0">
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="text-xs text-gray-500">Arrival</div>
                      <div className="font-medium">{formatTime(station.arrivalTime) || 'N/A'}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500">Departure</div>
                      <div className="font-medium">{formatTime(station.departureTime) || 'N/A'}</div>
                    </div>
                  </div>
                  
                  {/* Display delay information */}
                  <div className="mt-1">
                    {station.delay ? (
                      <div className={`text-sm ${station.delay !== 'Right Time' ? 'text-red-600 font-medium' : 'text-green-600'}`}>
                        {station.delay}
                        {station.delay !== 'Right Time' && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            Delayed
                          </span>
                        )}
                      </div>
                    ) : (station.delayArrival || station.delayDeparture) ? (
                      <div className={`text-sm ${isDelayed ? 'text-red-600 font-medium' : 'text-orange-500'}`}>
                        {formatDelay(station.delayDeparture || station.delayArrival)}
                        
                        {isDelayed && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            Delayed
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-green-600">On time</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StationTimeline;
