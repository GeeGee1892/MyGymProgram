// Calculation utilities for fitness metrics

/**
 * Calculate Basal Metabolic Rate using Mifflin-St Jeor equation
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @param {number} age - Age in years
 * @param {string} gender - 'male' or 'female'
 * @returns {number} BMR in calories
 */
export const calcBMR = (weight, height, age, gender) => {
  const w = parseFloat(weight) || 0;
  const h = parseFloat(height) || 0;
  const a = parseFloat(age) || 25;
  
  if (w <= 0 || h <= 0) return 0;
  
  const s = gender === 'female' ? -161 : 5;
  return 10 * w + 6.25 * h - 5 * a + s;
};

/**
 * Calculate daily calorie target based on goal
 * @param {number} bmr - Basal Metabolic Rate
 * @param {string} activityLevel - 'sedentary', 'light', 'moderate', 'active', 'veryActive'
 * @param {string} goal - 'cut', 'bulk', or 'maintain'
 * @returns {number} Daily calorie target
 */
export const calcCalories = (bmr, activityLevel, goal) => {
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };
  
  const tdee = bmr * (activityMultipliers[activityLevel] || 1.55);
  
  // Adjust based on goal
  if (goal === 'cut') return Math.round(tdee - 500);  // ~0.5kg/week loss
  if (goal === 'bulk') return Math.round(tdee + 300); // Lean bulk
  return Math.round(tdee); // maintain
};

/**
 * Calculate protein target
 * @param {number} weight - Weight in kg
 * @param {string} goal - 'cut', 'bulk', or 'maintain'
 * @returns {number} Daily protein target in grams
 */
export const calcProtein = (weight, goal) => {
  const w = parseFloat(weight) || 80;
  
  // Higher protein during cut to preserve muscle
  if (goal === 'cut') return Math.round(w * 2.0);   // 2g/kg
  if (goal === 'bulk') return Math.round(w * 1.8);  // 1.8g/kg
  return Math.round(w * 1.6);                        // 1.6g/kg maintain
};

/**
 * Calculate workout volume (sets × reps × weight)
 * @param {Array} sets - Array of set objects with reps and weight
 * @returns {number} Total volume in kg
 */
export const calcVolume = (sets) => {
  if (!sets || !Array.isArray(sets)) return 0;
  
  return sets.reduce((sum, set) => {
    const weight = parseFloat(set.weight) || 0;
    const reps = parseInt(set.reps, 10) || 0;
    return sum + (weight * reps);
  }, 0);
};

/**
 * Calculate moving average
 * @param {Array<number>} data - Array of numbers
 * @param {number} window - Window size (default: 4)
 * @returns {Array<number>} Moving average values
 */
export const calcMA = (data, window = 4) => {
  if (!data || data.length < window) return data || [];
  
  const result = [];
  for (let i = 0; i < data.length; i++) {
    if (i < window - 1) {
      // For early values, use available data
      const slice = data.slice(0, i + 1);
      const avg = slice.reduce((sum, val) => sum + val, 0) / slice.length;
      result.push(avg);
    } else {
      const slice = data.slice(i - window + 1, i + 1);
      const avg = slice.reduce((sum, val) => sum + val, 0) / window;
      result.push(avg);
    }
  }
  return result;
};

/**
 * Get exercise session data (max kg lifted per session)
 * @param {Array} history - Workout history array
 * @param {string} exId - Exercise ID
 * @param {string} exName - Exercise name (fallback)
 * @returns {Array} Array of session data objects
 */
export const getExerciseSessions = (history, exId, exName) => {
  if (!history || !Array.isArray(history)) return [];
  
  const sessions = [];
  history.forEach((workout) => {
    if (!workout.sets) return;
    
    const exerciseSets = workout.sets.filter(
      (s) => s.exerciseId === exId || s.exercise === exName
    );
    
    if (exerciseSets.length > 0) {
      const maxWeight = Math.max(
        ...exerciseSets.map((s) => parseFloat(s.weight) || 0)
      );
      sessions.push({
        date: workout.date,
        maxWeight,
        totalSets: exerciseSets.length,
      });
    }
  });
  
  return sessions;
};

/**
 * Get volume by workout type
 * @param {Array} history - Workout history array
 * @param {string} type - Workout type filter (or 'All')
 * @returns {Array} Array of volume data objects
 */
export const getVolByType = (history, type) => {
  if (!history || !Array.isArray(history)) return [];
  
  return history
    .filter((w) => !type || type === 'All' || w.type === type)
    .map((w) => ({
      date: w.date,
      volume: calcVolume(w.sets),
      type: w.type,
    }));
};

/**
 * Check if weight is reasonable (sanity check)
 * @param {number} weight - Weight to check
 * @param {string} exerciseId - Exercise ID for context
 * @returns {boolean} True if weight seems reasonable
 */
export const isWeightReasonable = (weight, exerciseId) => {
  const w = parseFloat(weight);
  if (isNaN(w) || w <= 0) return false;
  
  // Upper bounds for sanity (very strong lifters as max)
  const limits = {
    // Chest
    chest_press_incline: 80,
    chest_press_flat_bb: 200,
    chest_press_flat_db: 80,
    chest_press_machine: 150,
    
    // Shoulders
    shoulder_press_db: 60,
    shoulder_press_bb: 150,
    shoulder_press_machine: 100,
    
    // Legs
    squat_barbell: 300,
    squat_hack: 400,
    leg_press: 500,
    rdl: 250,
    
    // Back
    lat_pulldown: 150,
    row_barbell: 180,
    pullup: 50, // Additional bodyweight
    
    // Arms
    curl_dumbbell: 30,
    curl_barbell: 60,
    tricep_pushdown_rope: 60,
    
    // Default for unlisted exercises
    _default: 150,
  };
  
  const limit = limits[exerciseId] || limits._default;
  return w <= limit;
};

// FIXED: Rep range configurations for different exercise types
const REP_RANGES = {
  // Compound exercises - lower rep range
  compound: { min: 6, mid: 8, max: 10, top: 12 },
  // Isolation exercises - higher rep range
  isolation: { min: 10, mid: 12, max: 15, top: 20 },
  // Calf/ab exercises - very high rep range
  endurance: { min: 12, mid: 15, max: 20, top: 25 },
  // Default
  default: { min: 8, mid: 10, max: 12, top: 15 },
};

// Exercise type categorization
const EXERCISE_TYPES = {
  // Compound (lower rep ranges)
  pullup: 'compound',
  pullup_assisted: 'compound',
  lat_pulldown: 'compound',
  squat_barbell: 'compound',
  squat_hack: 'compound',
  leg_press: 'compound',
  rdl: 'compound',
  rdl_dumbbell: 'compound',
  chest_press_flat_bb: 'compound',
  row_barbell: 'compound',
  
  // Endurance (higher rep ranges)
  calf_raise_standing: 'endurance',
  calf_raise_seated: 'endurance',
  cable_crunch: 'endurance',
  hanging_knee_raise: 'endurance',
  wrist_curl: 'endurance',
  wrist_curl_cable: 'endurance',
  face_pull: 'endurance',
  
  // Default to isolation for everything else
};

/**
 * Get rep range configuration for an exercise
 * @param {string} exerciseId - Exercise ID
 * @returns {Object} Rep range configuration
 */
const getRepRange = (exerciseId) => {
  const type = EXERCISE_TYPES[exerciseId] || 'default';
  return REP_RANGES[type] || REP_RANGES.default;
};

/**
 * Calculate progressive overload suggestion
 * FIXED: Now uses exercise-specific rep ranges instead of hardcoded 8-12
 * @param {Object} lastWorkout - Last workout object
 * @param {string} exerciseId - Exercise ID
 * @returns {Object|null} Suggestion object or null
 */
export const calcProgressiveSuggestion = (lastWorkout, exerciseId) => {
  if (!lastWorkout || !lastWorkout.sets) return null;
  
  const exerciseSets = lastWorkout.sets.filter((s) => s.exerciseId === exerciseId);
  if (exerciseSets.length === 0) return null;
  
  const repRange = getRepRange(exerciseId);
  
  const avgWeight = exerciseSets.reduce((sum, s) => sum + parseFloat(s.weight), 0) / exerciseSets.length;
  const allReps = exerciseSets.map((s) => parseInt(s.reps, 10) || 0);
  const minReps = Math.min(...allReps);
  const maxReps = Math.max(...allReps);
  const avgReps = Math.round(allReps.reduce((a, b) => a + b, 0) / allReps.length);
  
  // FIXED: Unicode arrows now display correctly
  // If all sets hit top of range, increase weight
  if (minReps >= repRange.max) {
    return {
      type: 'weight',
      suggestion: `+2.5kg → ${(avgWeight + 2.5).toFixed(1)}kg for ${repRange.min}-${repRange.mid} reps`,
      targetWeight: avgWeight + 2.5,
      targetReps: `${repRange.min}-${repRange.mid}`,
      reason: 'Hit high reps - time to increase weight',
    };
  }
  
  // If sets hit mid-high range, suggest weight OR reps
  if (minReps >= repRange.mid) {
    return {
      type: 'weight_or_reps',
      suggestion: `+2.5kg or push for ${maxReps + 1} reps`,
      targetWeight: avgWeight + 2.5,
      targetReps: maxReps + 1,
      reason: 'Ready to progress',
    };
  }
  
  // If reps are in mid range, suggest adding 1 rep
  if (minReps >= repRange.min && maxReps < repRange.max) {
    return {
      type: 'reps',
      suggestion: `+1 rep → aim for ${maxReps + 1} reps`,
      targetWeight: avgWeight,
      targetReps: maxReps + 1,
      reason: 'Build reps before adding weight',
    };
  }
  
  // If struggling (under min reps), maintain or reduce
  if (maxReps < repRange.min) {
    return {
      type: 'maintain',
      suggestion: `Maintain ${avgWeight.toFixed(1)}kg, work on form`,
      targetWeight: avgWeight,
      targetReps: `${repRange.min}-${repRange.mid}`,
      reason: 'Focus on consistent reps',
    };
  }
  
  // Default: maintain
  return {
    type: 'maintain',
    suggestion: `Keep ${avgWeight.toFixed(1)}kg for ${avgReps} reps`,
    targetWeight: avgWeight,
    targetReps: avgReps,
    reason: 'Good work - maintain this level',
  };
};

/**
 * Detect if deload is needed (3 consecutive failed sessions)
 * @param {Array} exerciseHistory - Array of exercise session data
 * @returns {boolean} True if deload recommended
 */
export const needsDeload = (exerciseHistory) => {
  if (!exerciseHistory || exerciseHistory.length < 3) return false;
  
  const last3 = exerciseHistory.slice(-3);
  
  // Check if volume/weight is declining for 3 sessions
  for (let i = 1; i < last3.length; i++) {
    if (last3[i].maxWeight >= last3[i - 1].maxWeight) return false;
  }
  
  return true; // 3 declining sessions
};

/**
 * Calculate recommended deload weight
 * @param {number} currentWeight - Current working weight
 * @returns {number} Deload weight (90% rounded to nearest 2.5kg)
 */
export const calcDeloadWeight = (currentWeight) => {
  const deload = currentWeight * 0.9;
  return Math.round(deload * 2) / 2; // Round to nearest 0.5kg
};

/**
 * Calculate weekly calorie adjustment based on weight change
 * FIXED: Now properly handles all goals (cut, bulk, maintain)
 * @param {number} weightChange - Weight change over the period (negative = loss)
 * @param {number} currentCalories - Current calorie target
 * @param {string} goal - 'cut', 'bulk', or 'maintain'
 * @returns {Object} Adjustment recommendation
 */
export const calcWeeklyCalorieAdjustment = (weightChange, currentCalories, goal = 'cut') => {
  const change = parseFloat(weightChange) || 0;
  const cals = parseInt(currentCalories, 10) || 2000;
  
  if (goal === 'cut') {
    // Target: -0.5 to -0.75kg per week for cutting
    if (change < -1) {
      // Losing too fast
      return {
        adjustment: 200,
        reason: 'Losing weight too quickly - add calories to preserve muscle',
        newCalories: cals + 200,
      };
    } else if (change > -0.3) {
      // Losing too slow
      return {
        adjustment: -200,
        reason: 'Weight loss too slow - reduce calories slightly',
        newCalories: cals - 200,
      };
    }
  } else if (goal === 'bulk') {
    // Target: +0.25 to +0.5kg per week for lean bulk
    if (change > 0.75) {
      // Gaining too fast (likely fat)
      return {
        adjustment: -150,
        reason: 'Gaining too quickly - reduce to minimize fat gain',
        newCalories: cals - 150,
      };
    } else if (change < 0.2) {
      // Not gaining enough
      return {
        adjustment: 150,
        reason: 'Not gaining enough - add calories for growth',
        newCalories: cals + 150,
      };
    }
  } else {
    // Maintain: target ±0.25kg
    if (Math.abs(change) > 0.5) {
      const adj = change > 0 ? -100 : 100;
      return {
        adjustment: adj,
        reason: `Weight ${change > 0 ? 'increasing' : 'decreasing'} - adjust to maintain`,
        newCalories: cals + adj,
      };
    }
  }
  
  // On track
  return {
    adjustment: 0,
    reason: 'On track - maintain current calories',
    newCalories: cals,
  };
};

/**
 * Calculate estimated time to goal
 * @param {number} currentWeight - Current weight in kg
 * @param {number} targetWeight - Target weight in kg
 * @param {string} goal - 'cut' or 'bulk'
 * @returns {Object} Time estimate
 */
export const calcTimeToGoal = (currentWeight, targetWeight, goal = 'cut') => {
  const current = parseFloat(currentWeight) || 0;
  const target = parseFloat(targetWeight) || current;
  
  const diff = Math.abs(current - target);
  
  // Realistic rate: 0.5kg/week for cut, 0.25kg/week for bulk
  const ratePerWeek = goal === 'cut' ? 0.5 : 0.25;
  const weeks = Math.ceil(diff / ratePerWeek);
  
  return {
    weeks,
    months: Math.ceil(weeks / 4.3),
    weightToChange: diff,
    direction: current > target ? 'lose' : 'gain',
  };
};
