// Formatting utilities

// Format number with k/M suffix
export const fmtNum = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return Math.round(num).toString();
};

// Format time in MM:SS
export const fmtTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Format date to readable string
export const fmtDate = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  const options = { month: 'short', day: 'numeric' };
  return d.toLocaleDateString('en-US', options);
};

// Format date for charts (e.g., "Jan 25")
export const fmtChartDate = (date) => {
  const d = new Date(date);
  const options = { month: 'short', day: 'numeric' };
  return d.toLocaleDateString('en-US', options);
};

// Format weight with 1 decimal
export const fmtWeight = (weight) => {
  return parseFloat(weight).toFixed(1);
};

// Format reps (singular/plural)
export const fmtReps = (reps) => {
  return `${reps} ${reps === 1 ? 'rep' : 'reps'}`;
};

// Format duration in minutes
export const fmtDuration = (minutes) => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

// Parse rep range (e.g., "8-10" -> { min: 8, max: 10 })
export const parseRepRange = (range) => {
  if (typeof range === 'number') return { min: range, max: range };
  const parts = range.toString().split('-');
  return {
    min: parseInt(parts[0]) || 0,
    max: parseInt(parts[1] || parts[0]) || 0,
  };
};

// Get greeting based on time of day
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};
