// Calculation utilities for fitness metrics

// Calculate Basal Metabolic Rate using Mifflin-St Jeor equation
export const calcBMR = (weight, height, age, gender) => {
  const s = gender === 'male' ? 5 : -161;
  return 10 * weight + 6.25 * height - 5 * age + s;
};

// Calculate daily calorie target based on goal
export const calcCalories = (bmr, activityLevel, goal) => {
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };
  
  const tdee = bmr * (activityMultipliers[activityLevel] || 1.55);
  
  // For cutting: -500 cal/day (roughly 0.5kg/week)
  if (goal === 'cut') return Math.round(tdee - 500);
  if (goal === 'bulk') return Math.round(tdee + 300);
  return Math.round(tdee); // maintain
};

// Calculate protein target (2g per kg bodyweight for cutting)
export const calcProtein = (weight, goal) => {
  if (goal === 'cut') return Math.round(weight * 2);
  if (goal === 'bulk') return Math.round(weight * 1.8);
  return Math.round(weight * 1.6);
};

// Calculate workout volume (sets × reps × weight)
export const calcVolume = (sets) => {
  if (!sets || !Array.isArray(sets)) return 0;
  return sets.reduce((sum, set) => {
    const weight = parseFloat(set.weight) || 0;
    const reps = parseInt(set.reps) || 0;
    return sum + (weight * reps);
  }, 0);
};

// Calculate moving average
export const calcMA = (data, window = 4) => {
  if (!data || data.length < window) return [];
  const result = [];
  for (let i = window - 1; i < data.length; i++) {
    const slice = data.slice(i - window + 1, i + 1);
    const avg = slice.reduce((sum, val) => sum + val, 0) / window;
    result.push(avg);
  }
  return result;
};

// Get exercise session data (max kg lifted per session)
export const getExerciseSessions = (history, exId, exName) => {
  if (!history || !Array.isArray(history)) return [];
  
  const sessions = [];
  history.forEach((workout) => {
    if (!workout.sets) return;
    const exerciseSets = workout.sets.filter(
      (s) => s.exerciseId === exId || s.exercise === exName
    );
    if (exerciseSets.length > 0) {
      const maxWeight = Math.max(...exerciseSets.map((s) => parseFloat(s.weight) || 0));
      sessions.push({
        date: workout.date,
        maxWeight,
      });
    }
  });
  return sessions;
};

// Get volume by workout type
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

// Check if weight is reasonable (sanity check)
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
    
    // Legs
    squat_barbell: 300,
    squat_hack: 400,
    leg_press: 500,
    rdl: 250,
    
    // Back
    lat_pulldown: 150,
    row_barbell: 180,
    
    // Default for unlisted exercises
    _default: 150,
  };
  
  const limit = limits[exerciseId] || limits._default;
  return w <= limit;
};

// Calculate progressive overload suggestion
export const calcProgressiveSuggestion = (lastWorkout, exerciseId) => {
  if (!lastWorkout || !lastWorkout.sets) return null;
  
  const exerciseSets = lastWorkout.sets.filter((s) => s.exerciseId === exerciseId);
  if (exerciseSets.length === 0) return null;
  
  // Simple rule: if hit top of rep range on ALL sets → suggest +2.5kg
  // Otherwise suggest +1 rep
  
  const avgWeight = exerciseSets.reduce((sum, s) => sum + parseFloat(s.weight), 0) / exerciseSets.length;
  const allReps = exerciseSets.map((s) => parseInt(s.reps));
  const minReps = Math.min(...allReps);
  const maxReps = Math.max(...allReps);
  const avgReps = Math.round(allReps.reduce((a, b) => a + b, 0) / allReps.length);
  
  // If all sets hit 12+ reps (top of typical range), increase weight
  if (minReps >= 12) {
    return {
      type: 'weight',
      suggestion: `+2.5kg → ${(avgWeight + 2.5).toFixed(1)}kg for 8-10 reps`,
      targetWeight: avgWeight + 2.5,
      targetReps: '8-10',
      reason: 'Hit high reps - time to increase weight',
    };
  }
  
  // If all sets hit 10+ reps (mid-high range), suggest weight OR reps
  if (minReps >= 10) {
    return {
      type: 'weight_or_reps',
      suggestion: `+2.5kg or push for ${maxReps + 1} reps`,
      targetWeight: avgWeight + 2.5,
      targetReps: maxReps + 1,
      reason: 'Ready to progress',
    };
  }
  
  // If reps are in range (8-10), suggest adding 1 rep
  if (minReps >= 8 && maxReps < 12) {
    return {
      type: 'reps',
      suggestion: `+1 rep → aim for ${maxReps + 1} reps`,
      targetWeight: avgWeight,
      targetReps: maxReps + 1,
      reason: 'Build reps before adding weight',
    };
  }
  
  // If struggling (under 8 reps), maintain or reduce
  if (maxReps < 8) {
    return {
      type: 'maintain',
      suggestion: `Maintain ${avgWeight.toFixed(1)}kg, work on form`,
      targetWeight: avgWeight,
      targetReps: '8-10',
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

// Detect if deload is needed (3 consecutive failed sessions)
export const needsDeload = (exerciseHistory) => {
  if (!exerciseHistory || exerciseHistory.length < 3) return false;
  
  const last3 = exerciseHistory.slice(-3);
  // Check if volume is declining for 3 sessions
  for (let i = 1; i < last3.length; i++) {
    if (last3[i].maxWeight >= last3[i - 1].maxWeight) return false;
  }
  
  return true; // 3 declining sessions
};

// Calculate recommended deload weight
export const calcDeloadWeight = (currentWeight) => {
  return Math.round(currentWeight * 0.9 * 2) / 2; // 90% of current, rounded to nearest 2.5kg
};

// Weekly calorie adjustment based on weight change
export const calcWeeklyCalorieAdjustment = (weightChange, currentCalories) => {
  // Target: -0.5 to -0.75kg per week for cutting
  // If losing too fast (>1kg/week): +200 cal
  // If losing too slow (<0.3kg/week): -200 cal
  // If on target: no change
  
  if (weightChange < -1) {
    return {
      adjustment: 200,
      reason: 'Losing weight too quickly',
      newCalories: currentCalories + 200,
    };
  } else if (weightChange > -0.3) {
    return {
      adjustment: -200,
      reason: 'Weight loss too slow',
      newCalories: currentCalories - 200,
    };
  }
  
  return {
    adjustment: 0,
    reason: 'On track',
    newCalories: currentCalories,
  };
};
