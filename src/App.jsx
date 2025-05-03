import { useState } from 'react';
import './index.css';

// Helper functions
function calculateDelayMinutes(delayString) {
  if (!delayString) return 0;

  const [hours, minutes] = delayString.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatTime(timeString) {
  if (!timeString) return 'N/A';

  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;

  return `${formattedHour}:${minutes} ${ampm}`;
}

function formatDelay(delayString) {
  if (!delayString) return 'On time';

  const delayMinutes = calculateDelayMinutes(delayString);

  if (delayMinutes === 0) return 'On time';

  const hours = Math.floor(delayMinutes / 60);
  const minutes = delayMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m late`;
  }

  return `${minutes}m late`;
}

function App() {
  const [trainNumber, setTrainNumber] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [trainData, setTrainData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!trainNumber.trim()) {
      setError('Please enter a train number');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Format date to YYYYMMDD (e.g., 20250427)
      const formattedDate = new Date(date).toISOString().slice(0, 10).replace(/-/g, '');

      const response = await fetch(
        `https://le2r9wfld2.execute-api.us-east-1.amazonaws.com/dev/train-details?trainNumber=${trainNumber}&date=${formattedDate}`,
        {
          headers: {
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'origin': window.location.origin,
            'referer': window.location.href,
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'user-agent': navigator.userAgent
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch train status: ${response.status}`);
      }

      const data = await response.json();
      setTrainData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch train data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Train Tracker</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 animate-fadeIn">
        {!trainData ? (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Track Your Train</h2>
              <p className="text-gray-600">
                Get real-time updates on your train's location, arrival times, and delays
              </p>
            </div>

            <div className="card">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-md">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="trainNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Train Number
                  </label>
                  <input
                    type="text"
                    id="trainNumber"
                    className="input-field"
                    placeholder="Enter train number (e.g., 12050)"
                    value={trainNumber}
                    onChange={(e) => setTrainNumber(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Journey Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    className="input-field"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    disabled={isLoading}
                    min={new Date().toISOString().split('T')[0]}
                  />
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
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => setTrainData(null)}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-6"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Search
            </button>

            <div className="card">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{trainData.trainNumber} - {trainData.trainName}</h2>
                  <p className="text-gray-600 mt-1">{trainData.source} to {trainData.destination}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Last updated: {new Date(trainData.lastUpdated).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={handleSubmit}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  title="Refresh"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>

              {trainData.stations && trainData.stations.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Station Timeline</h3>

                  <div className="space-y-0">
                    {trainData.stations.map((station, index) => {
                      const isCurrentStation = station.stationCode === (trainData.currentStation?.stationCode || '');
                      const delayMinutes = calculateDelayMinutes(station.delayDeparture || station.delayArrival);
                      const isDelayed = delayMinutes > 10;

                      return (
                        <div
                          key={`${station.stationCode}-${index}`}
                          className={`station-item ${isCurrentStation ? 'station-current' : ''} ${isDelayed ? 'station-delayed' : ''}`}
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

                              {(station.delayArrival || station.delayDeparture) && (
                                <div className={`mt-1 text-sm ${isDelayed ? 'text-red-600 font-medium' : 'text-orange-500'}`}>
                                  {formatDelay(station.delayDeparture || station.delayArrival)}

                                  {isDelayed && (
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                      Delayed
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} Train Tracker | Real-time train tracking application</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
