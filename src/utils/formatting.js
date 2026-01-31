// Formatting utilities for display

/**
 * Format seconds to MM:SS display
 * @param {number} seconds - Total seconds
 * @returns {string} Formatted time string (e.g., "1:30")
 */
export const fmtTime = (seconds) => {
  if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
    return '0:00';
  }
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format number with decimal places and optional unit
 * @param {number} value - Number to format
 * @param {number} decimals - Decimal places (default: 1)
 * @param {string} unit - Optional unit suffix (e.g., 'kg')
 * @returns {string} Formatted number string
 */
export const fmtNum = (value, decimals = 1, unit = '') => {
  if (typeof value !== 'number' || isNaN(value)) {
    return unit ? `0${unit}` : '0';
  }
  
  const formatted = value.toFixed(decimals);
  // Remove trailing zeros after decimal point
  const cleaned = formatted.replace(/\.?0+$/, '');
  return unit ? `${cleaned}${unit}` : cleaned;
};

/**
 * Format weight with kg suffix
 * @param {number} weight - Weight in kg
 * @returns {string} Formatted weight (e.g., "85kg")
 */
export const fmtWeight = (weight) => fmtNum(weight, 1, 'kg');

/**
 * Format percentage
 * @param {number} value - Value between 0-100 or 0-1
 * @param {boolean} isDecimal - If true, value is 0-1 (will multiply by 100)
 * @returns {string} Formatted percentage (e.g., "85%")
 */
export const fmtPercent = (value, isDecimal = false) => {
  const percent = isDecimal ? value * 100 : value;
  return `${Math.round(percent)}%`;
};

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type: 'short', 'medium', 'long'
 * @returns {string} Formatted date
 */
export const fmtDate = (date, format = 'short') => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const options = {
    short: { month: 'short', day: 'numeric' },
    medium: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' },
  };
  
  return d.toLocaleDateString('en-US', options[format] || options.short);
};

/**
 * Format relative time (e.g., "2 days ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const fmtRelativeTime = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const now = new Date();
  const diffMs = now - d;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 30) return fmtDate(date, 'short');
  if (diffDays > 1) return `${diffDays} days ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffHours > 1) return `${diffHours} hours ago`;
  if (diffHours === 1) return '1 hour ago';
  if (diffMins > 1) return `${diffMins} mins ago`;
  if (diffMins === 1) return '1 min ago';
  return 'Just now';
};

/**
 * Format exercise name from ID
 * @param {string} exerciseId - Exercise ID (e.g., "chest_press_incline")
 * @returns {string} Formatted name (e.g., "Chest Press Incline")
 */
export const fmtExerciseName = (exerciseId) => {
  if (!exerciseId || typeof exerciseId !== 'string') return '';
  
  return exerciseId
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Format volume (total weight moved)
 * @param {number} volume - Volume in kg
 * @returns {string} Formatted volume (e.g., "12,500kg")
 */
export const fmtVolume = (volume) => {
  if (typeof volume !== 'number' || isNaN(volume)) return '0kg';
  
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}k kg`;
  }
  return `${Math.round(volume)}kg`;
};

/**
 * Pluralize a word based on count
 * @param {number} count - Count
 * @param {string} singular - Singular form
 * @param {string} plural - Plural form (optional, defaults to singular + 's')
 * @returns {string} Pluralized word with count
 */
export const pluralize = (count, singular, plural = null) => {
  const word = count === 1 ? singular : (plural || `${singular}s`);
  return `${count} ${word}`;
};
