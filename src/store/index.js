import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { workoutTemplates } from '../data/workoutTemplates';
import { calcCalories, calcProtein, calcVolume, calcWeeklyCalorieAdjustment, calcProgressiveSuggestion } from '../utils/calculations';

const STORAGE_KEY = '@MyGymProgram:store';

export const useStore = create((set, get) => ({
  // ==================== USER DATA ====================
  userData: {
    name: '',
    weight: 0,
    height: 0,
    age: 0,
    gender: 'male',
    goal: 'cut',
    activityLevel: 'moderate',
    trainingDaysPerWeek: 4,
    targetWeight: 82,
    calories: 0,
    protein: 0,
  },
  isOnboarded: false,
  
  setUserData: (data) => set((state) => {
    const updated = { ...state.userData, ...data };
    // Auto-calculate calories and protein if weight/goal changes
    if (data.weight || data.goal || data.activityLevel) {
      const bmr = 10 * updated.weight + 6.25 * updated.height - 5 * updated.age + (updated.gender === 'male' ? 5 : -161);
      updated.calories = calcCalories(bmr, updated.activityLevel, updated.goal);
      updated.protein = calcProtein(updated.weight, updated.goal);
    }
    return { userData: updated };
  }),
  
  completeOnboarding: () => set({ isOnboarded: true }),
  
  // ==================== WORKOUT STATE ====================
  currentWorkoutType: null,
  currentExercises: [],
  currentSets: [],
  draftWorkout: null, // Save incomplete workouts
  
  startWorkout: (type, customExercises = null) => {
    // Custom workout with user-provided exercises
    if (type === 'Custom' && customExercises) {
      set({ 
        currentWorkoutType: 'Custom', 
        currentExercises: customExercises,
        currentSets: [],
        draftWorkout: null,
      });
      return;
    }
    
    // Template-based workout (PPL)
    const template = workoutTemplates[type] || [];
    const exercises = template.map((ex) => ({ ...ex }));
    set({ 
      currentWorkoutType: type, 
      currentExercises: exercises,
      currentSets: [],
      draftWorkout: null, // Clear any existing draft
    });
  },
  
  swapExercise: (index, newExerciseId) => set((state) => {
    const exercises = [...state.currentExercises];
    const oldExercise = exercises[index];
    
    // Keep the same sets/reps, just change the exercise ID
    exercises[index] = { 
      ...oldExercise,
      id: newExerciseId,
      // Preserve sets and reps from original
      sets: oldExercise.sets,
      reps: oldExercise.reps,
    };
    
    return { currentExercises: exercises };
  }),
  
  // Get all available alternatives for any exercise (works for swapped exercises too)
  getExerciseAlternatives: (exerciseId) => {
    // Direct alternatives from mapping
    const directAlts = alternatives[exerciseId] || [];
    
    // Reverse lookup - find any exercise that lists this as an alternative
    const reverseAlts = Object.keys(alternatives).filter(
      (key) => alternatives[key].includes(exerciseId)
    );
    
    // Also get siblings (alternatives of the reverse alternatives)
    const siblings = [];
    reverseAlts.forEach((parentId) => {
      alternatives[parentId].forEach((siblingId) => {
        if (siblingId !== exerciseId && !siblings.includes(siblingId)) {
          siblings.push(siblingId);
        }
      });
    });
    
    // Combine all and deduplicate
    const allAlts = [...new Set([...directAlts, ...reverseAlts, ...siblings])];
    
    // Remove the current exercise itself
    return allAlts.filter((id) => id !== exerciseId);
  },
  
  addExercise: (exercise) => set((state) => ({
    currentExercises: [...state.currentExercises, exercise],
  })),
  
  removeExercise: (index) => set((state) => ({
    currentExercises: state.currentExercises.filter((_, i) => i !== index),
  })),
  
  updateExercise: (index, updates) => set((state) => {
    const exercises = [...state.currentExercises];
    exercises[index] = { ...exercises[index], ...updates };
    return { currentExercises: exercises };
  }),
  
  saveDraftWorkout: () => set((state) => ({
    draftWorkout: {
      type: state.currentWorkoutType,
      exercises: state.currentExercises,
      sets: state.currentSets,
      savedAt: new Date().toISOString(),
    },
  })),
  
  loadDraftWorkout: () => set((state) => {
    if (!state.draftWorkout) return {};
    return {
      currentWorkoutType: state.draftWorkout.type,
      currentExercises: state.draftWorkout.exercises,
      currentSets: state.draftWorkout.sets,
    };
  }),
  
  clearDraftWorkout: () => set({ draftWorkout: null }),
  
  completeWorkout: (sets) => set((state) => {
    const workout = {
      type: state.currentWorkoutType,
      date: new Date().toISOString(),
      sets,
      volume: calcVolume(sets),
    };
    
    // Check for new PRs
    const newPRs = {};
    sets.forEach((s) => {
      const key = s.exerciseId;
      const weight = parseFloat(s.weight);
      const currentPR = state.prs[key] || 0;
      if (weight > currentPR) {
        newPRs[key] = {
          weight,
          date: workout.date,
          reps: s.reps,
        };
      }
    });
    
    return {
      workoutHistory: [...state.workoutHistory, workout],
      currentSets: sets,
      currentWorkoutType: null,
      currentExercises: [],
      prs: { ...state.prs, ...newPRs },
      draftWorkout: null,
      lastWorkoutPRs: Object.keys(newPRs).length > 0 ? newPRs : null,
    };
  }),
  
  // ==================== HISTORY & TRACKING ====================
  workoutHistory: [],
  weightHistory: [],
  dailyCheckIns: [], // { date, weight, sleep, hitProtein }
  prs: {}, // { exerciseId: { weight, date, reps } }
  lastWorkoutPRs: null, // PRs from last completed workout
  streak: 0,
  
  updateWeight: (weight, date) => set((state) => {
    const entry = { 
      weight: parseFloat(weight), 
      date: date || new Date().toISOString() 
    };
    return {
      weightHistory: [...state.weightHistory, entry],
      userData: { ...state.userData, weight: parseFloat(weight) },
    };
  }),
  
  addDailyCheckIn: (data) => set((state) => {
    const checkIn = {
      date: new Date().toISOString(),
      weight: data.weight,
      sleep: data.sleep, // 1-10 rating
      hitProtein: data.hitProtein, // boolean
      calories: data.calories || null, // daily calorie intake
    };
    
    // Also update weight history
    const newWeightHistory = [...state.weightHistory, { 
      weight: data.weight, 
      date: checkIn.date 
    }];
    
    // Update user's current weight
    const newUserData = { ...state.userData, weight: data.weight };
    
    return {
      dailyCheckIns: [...state.dailyCheckIns, checkIn],
      weightHistory: newWeightHistory,
      userData: newUserData,
    };
  }),
  
  // ==================== WEEKLY REVIEW ====================
  weeklyReviews: [], // { date, weightChange, workoutsCompleted, avgVolume, calorieAdjustment }
  lastReviewDate: null,
  
  generateWeeklyReview: () => set((state) => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Get this week's data
    const thisWeekWorkouts = state.workoutHistory.filter(
      (w) => new Date(w.date) >= oneWeekAgo
    );
    const thisWeekCheckIns = state.dailyCheckIns.filter(
      (c) => new Date(c.date) >= oneWeekAgo
    );
    
    // Calculate weight change
    const startWeight = thisWeekCheckIns[0]?.weight || state.userData.weight;
    const endWeight = thisWeekCheckIns[thisWeekCheckIns.length - 1]?.weight || state.userData.weight;
    const weightChange = endWeight - startWeight;
    
    // Calculate average volume
    const totalVolume = thisWeekWorkouts.reduce((sum, w) => sum + w.volume, 0);
    const avgVolume = thisWeekWorkouts.length > 0 ? totalVolume / thisWeekWorkouts.length : 0;
    
    // Calculate calorie adjustment
    const calorieAdj = calcWeeklyCalorieAdjustment(weightChange, state.userData.calories);
    
    // Count protein hits
    const proteinHits = thisWeekCheckIns.filter((c) => c.hitProtein).length;
    
    // Sleep average
    const avgSleep = thisWeekCheckIns.length > 0
      ? thisWeekCheckIns.reduce((sum, c) => sum + c.sleep, 0) / thisWeekCheckIns.length
      : 0;
    
    const review = {
      date: now.toISOString(),
      weekStart: oneWeekAgo.toISOString(),
      workoutsCompleted: thisWeekWorkouts.length,
      weightChange,
      avgVolume,
      calorieAdjustment: calorieAdj,
      proteinHits,
      proteinHitRate: thisWeekCheckIns.length > 0 ? proteinHits / thisWeekCheckIns.length : 0,
      avgSleep: avgSleep.toFixed(1),
    };
    
    // Update user calories if adjustment needed
    const newUserData = calorieAdj.adjustment !== 0
      ? { ...state.userData, calories: calorieAdj.newCalories }
      : state.userData;
    
    return {
      weeklyReviews: [...state.weeklyReviews, review],
      lastReviewDate: now.toISOString(),
      userData: newUserData,
    };
  }),
  
  // ==================== SMART SUGGESTIONS ====================
  getNextWorkoutType: () => {
    const state = get();
    const history = state.workoutHistory;
    
    if (history.length === 0) return 'Push';
    
    const last = history[history.length - 1];
    const rotation = ['Push', 'Pull', 'Legs'];
    const currentIndex = rotation.indexOf(last.type);
    
    if (currentIndex === -1) return 'Push';
    return rotation[(currentIndex + 1) % rotation.length];
  },
  
  getWorkoutInsight: (type) => {
    const state = get();
    const now = new Date();
    const history = state.workoutHistory;
    
    // Find last workout of this type
    const lastOfType = history.filter((w) => w.type === type).pop();
    
    if (!lastOfType) {
      return { message: `Your first ${type} session. Let's crush it!`, type: 'info' };
    }
    
    const daysSince = Math.floor(
      (now - new Date(lastOfType.date)) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSince <= 2) {
      return { 
        message: `Last ${type} was ${daysSince} days ago. Good frequency!`, 
        type: 'success' 
      };
    }
    
    if (daysSince >= 5) {
      return { 
        message: `Last ${type} was ${daysSince} days ago. You're well rested!`, 
        type: 'info' 
      };
    }
    
    return { message: `Ready for ${type}!`, type: 'info' };
  },
  
  getProgressiveSuggestions: (exerciseId) => {
    const state = get();
    const lastWorkout = state.workoutHistory
      .filter((w) => w.sets.some((s) => s.exerciseId === exerciseId))
      .pop();
    
    if (!lastWorkout) return null;
    return calcProgressiveSuggestion(lastWorkout, exerciseId);
  },
  
  getLastSession: (exerciseId) => {
    const state = get();
    // Find the most recent workout containing this exercise
    const lastWorkout = state.workoutHistory
      .filter((w) => w.sets.some((s) => s.exerciseId === exerciseId))
      .pop();
    
    if (!lastWorkout) return null;
    
    // Get all sets for this exercise in that workout
    const exerciseSets = lastWorkout.sets.filter((s) => s.exerciseId === exerciseId);
    if (exerciseSets.length === 0) return null;
    
    // Return summary of last session
    return {
      date: lastWorkout.date,
      sets: exerciseSets,
      // Get most common weight (mode)
      commonWeight: exerciseSets
        .map((s) => parseFloat(s.weight))
        .sort((a, b) => 
          exerciseSets.filter((s) => parseFloat(s.weight) === b).length -
          exerciseSets.filter((s) => parseFloat(s.weight) === a).length
        )[0],
      // Get most common reps
      commonReps: exerciseSets
        .map((s) => parseInt(s.reps))
        .sort((a, b) => 
          exerciseSets.filter((s) => parseInt(s.reps) === b).length -
          exerciseSets.filter((s) => parseInt(s.reps) === a).length
        )[0],
    };
  },
  
  // ==================== PERSISTENCE ====================
  saveData: async () => {
    try {
      const state = get();
      const dataToSave = {
        userData: state.userData,
        isOnboarded: state.isOnboarded,
        workoutHistory: state.workoutHistory,
        weightHistory: state.weightHistory,
        dailyCheckIns: state.dailyCheckIns,
        prs: state.prs,
        draftWorkout: state.draftWorkout,
        weeklyReviews: state.weeklyReviews,
        lastReviewDate: state.lastReviewDate,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Save failed:', error);
    }
  },
  
  loadData: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        set({
          userData: parsed.userData || get().userData,
          isOnboarded: parsed.isOnboarded || false,
          workoutHistory: parsed.workoutHistory || [],
          weightHistory: parsed.weightHistory || [],
          dailyCheckIns: parsed.dailyCheckIns || [],
          prs: parsed.prs || {},
          draftWorkout: parsed.draftWorkout || null,
          weeklyReviews: parsed.weeklyReviews || [],
          lastReviewDate: parsed.lastReviewDate || null,
        });
      }
    } catch (error) {
      console.error('Load failed:', error);
    }
  },
}));

// Auto-save on state changes
useStore.subscribe((state) => {
  state.saveData();
});
