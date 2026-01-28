export const calculateBMR = (weight, height, age, sex) => {
  const base = (10 * weight) + (6.25 * height) - (5 * age);
  return Math.round(sex === 'female' ? base - 161 : base + 5);
};

export const calculateCalories = (userData) => {
  const { weight, height, age, sex, goal } = userData;
  const bmr = calculateBMR(Number(weight), Number(height), Number(age), sex);
  const tdee = Math.round(bmr * 1.55);
  const adj = { cut: -500, bulk: 300, maintain: 0 };
  return tdee + (adj[goal] || 0);
};

export const calculateProtein = (weight, goal) => Math.round(Number(weight) * (goal === 'cut' ? 2.2 : 1.8));

export const calculateVolume = (sets) => sets.reduce((sum, s) => sum + (s.reps * s.weight), 0);

export const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

export const formatNumber = (num) => num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num.toString();
