/**
 * Train API service for fetching train status data
 */

// Base URL for the train status API
const BASE_URL = 'https://miawz4m9pi.execute-api.us-east-1.amazonaws.com/dev';

/**
 * Fetches train status data from the API
 * @param {string} trainNumber - The train number
 * @param {string} date - The date in DD-MMM-YYYY format (e.g., 27-Apr-2025)
 * @returns {Promise<Object>} - The train status data
 */
export const getTrainStatus = async (trainNumber, date) => {
  try {
    const response = await fetch(
      `${BASE_URL}/train-status?trainNumber=${trainNumber}&date=${date}`
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to fetch train status: ${response.status}`
      );
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching train status:', error);
    throw error;
  }
};
