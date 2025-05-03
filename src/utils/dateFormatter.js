/**
 * Date formatting utilities for the train tracker application
 */
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';

// Initialize dayjs plugins
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

/**
 * Formats a date string to DD-MMM-YYYY format (e.g., 27-Apr-2025)
 * @param {Date} date - The date to format
 * @returns {string} - Formatted date string
 */
export const formatDateForApi = (date) => {
  return dayjs(date).format('DD-MMM-YYYY');
};

/**
 * Formats a time string to a human-readable format (e.g., "5 minutes ago")
 * @param {string} timestamp - The timestamp to format
 * @returns {string} - Formatted relative time
 */
export const formatRelativeTime = (timestamp) => {
  return dayjs(timestamp).fromNow();
};

/**
 * Formats a time string to 12-hour format (e.g., "10:30 AM")
 * @param {string} timeString - The time string to format (HH:MM format)
 * @returns {string} - Formatted time string
 */
export const formatTime = (timeString) => {
  if (!timeString) return 'N/A';
  
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  
  return `${formattedHour}:${minutes} ${ampm}`;
};

/**
 * Calculates the delay in minutes from a delay string
 * @param {string} delayString - The delay string (e.g., "00:30")
 * @returns {number} - Delay in minutes
 */
export const calculateDelayMinutes = (delayString) => {
  if (!delayString) return 0;
  
  const [hours, minutes] = delayString.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Formats a delay string to a human-readable format
 * @param {string} delayString - The delay string (e.g., "00:30")
 * @returns {string} - Formatted delay string
 */
export const formatDelay = (delayString) => {
  if (!delayString) return 'On time';
  
  const delayMinutes = calculateDelayMinutes(delayString);
  
  if (delayMinutes === 0) return 'On time';
  
  const hours = Math.floor(delayMinutes / 60);
  const minutes = delayMinutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m late`;
  }
  
  return `${minutes}m late`;
};
