// Calculate BMR using Mifflin-St Jeor equation
export const calculateBMR = (weight, height, age, sex) => {
  const base = (10 * weight) + (6.25 * height) - (5 * age);
  return Math.round(sex === 'female' ? base - 161 : base + 5);
};

// Calculate TDEE (Total Daily Energy Expenditure)
export const calculateTDEE = (bmr, activityLevel = 1.55) => {
  return Math.round(bmr * activityLevel);
};

// Calculate daily calorie target based on goal
export const calculateCalories = (userData) => {
  const { weight, height, age, sex, goal } = userData;
  const bmr = calculateBMR(Number(weight), Number(height), Number(age), sex);
  const tdee = calculateTDEE(bmr);
  
  const adjustments = {
    cut: -500,
    bulk: 300,
    maintain: 0,
  };
  
  return tdee + (adjustments[goal] || 0);
};

// Calculate protein target
export const calculateProtein = (weight, goal) => {
  const multiplier = goal === 'cut' ? 2.2 : 1.8;
  return Math.round(Number(weight) * multiplier);
};

// Calculate estimated weeks to reach target weight
export const calculateWeeksToGoal = (currentWeight, targetWeight, weeklyChange = 0.5) => {
  const diff = Math.abs(Number(currentWeight) - Number(targetWeight));
  return Math.round(diff / weeklyChange);
};

// Calculate total volume from sets
export const calculateVolume = (sets) => {
  return sets.reduce((sum, set) => sum + (set.reps * set.weight), 0);
};

// Format time (seconds to MM:SS)
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Format large numbers (e.g., 12500 -> 12.5k)
export const formatNumber = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

// Get date string
export const getDateString = () => {
  return new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
};

export default {
  calculateBMR,
  calculateTDEE,
  calculateCalories,
  calculateProtein,
  calculateWeeksToGoal,
  calculateVolume,
  formatTime,
  formatNumber,
  getDateString,
};
