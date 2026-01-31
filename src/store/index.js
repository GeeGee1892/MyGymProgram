import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { workoutTemplates } from '../data/workoutTemplates';
// FIXED: Import alternatives - this was missing and caused crashes
import { alternatives, getAlternatives } from '../data/alternatives';
import { calcProgressiveSuggestion } from '../utils/calculations';

const STORAGE_KEY = '@MyGymProgram:data';
const SCHEMA_VERSION = 1;

// Default state shape for validation
const defaultState = {
  // User profile
  userData: {
    name: '',
    gender: null,
    age: null,
    height: null,
    weight: null,
    targetWeight: null,
    goal: null,
    trainingDaysPerWeek: null,
    calories: null,
    protein: null,
  },
  
  // App state
  isOnboarded: false,
  
  // Workout state
  currentWorkoutType: null,
  currentExercises: [],
  currentSets: [],
  
  // History
  workoutHistory: [],
  dailyCheckIns: [],
  weightHistory: [],
  
  // Progress tracking
  prs: {},
  lastWorkoutPRs: [],
  streak: 0,
  lastWorkoutDate: null,
  
  // Draft state
  draftWorkout: null,
  
  // Schema version for migrations
  schemaVersion: SCHEMA_VERSION,
};

// FIXED: Schema validation function
const validateAndMigrateState = (loadedState) => {
  if (!loadedState || typeof loadedState !== 'object') {
    console.warn('Invalid state loaded, using defaults');
    return { ...defaultState };
  }
  
  // Merge with defaults to ensure all fields exist
  const state = {
    ...defaultState,
    ...loadedState,
    userData: {
      ...defaultState.userData,
      ...(loadedState.userData || {}),
    },
  };
  
  // Ensure arrays are arrays
  if (!Array.isArray(state.workoutHistory)) state.workoutHistory = [];
  if (!Array.isArray(state.dailyCheckIns)) state.dailyCheckIns = [];
  if (!Array.isArray(state.weightHistory)) state.weightHistory = [];
  if (!Array.isArray(state.currentExercises)) state.currentExercises = [];
  if (!Array.isArray(state.currentSets)) state.currentSets = [];
  if (!Array.isArray(state.lastWorkoutPRs)) state.lastWorkoutPRs = [];
  
  // Ensure objects are objects
  if (typeof state.prs !== 'object' || state.prs === null) state.prs = {};
  
  // Handle schema migrations
  if (state.schemaVersion !== SCHEMA_VERSION) {
    console.log(`Migrating schema from v${state.schemaVersion} to v${SCHEMA_VERSION}`);
    state.schemaVersion = SCHEMA_VERSION;
  }
  
  return state;
};

// FIXED: Safe number parsing with NaN guards
const safeParseFloat = (value, fallback = 0) => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? fallback : parsed;
};

const safeParseInt = (value, fallback = 0) => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
};

// FIXED: Debounced save to prevent race conditions
let saveTimeout = null;
const SAVE_DEBOUNCE_MS = 1000;

const debouncedSave = async (state) => {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  
  saveTimeout = setTimeout(async () => {
    try {
      const stateToSave = {
        userData: state.userData,
        isOnboarded: state.isOnboarded,
        workoutHistory: state.workoutHistory,
        dailyCheckIns: state.dailyCheckIns,
        weightHistory: state.weightHistory,
        prs: state.prs,
        streak: state.streak,
        lastWorkoutDate: state.lastWorkoutDate,
        draftWorkout: state.draftWorkout,
        schemaVersion: SCHEMA_VERSION,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Failed to save data:', error);
      // TODO: Could emit an event here for UI to show error toast
    }
  }, SAVE_DEBOUNCE_MS);
};

// FIXED: Streak calculation
const calculateStreak = (workoutHistory, lastDate) => {
  if (!workoutHistory || workoutHistory.length === 0) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Sort workouts by date descending
  const sortedWorkouts = [...workoutHistory].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  
  let streak = 0;
  let checkDate = new Date(today);
  
  for (const workout of sortedWorkouts) {
    const workoutDate = new Date(workout.date);
    workoutDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((checkDate - workoutDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) {
      streak++;
      checkDate = workoutDate;
    } else if (diffDays > 1) {
      break;
    }
  }
  
  return streak;
};

export const useStore = create((set, get) => ({
  ...defaultState,
  
  // ============================================
  // DATA PERSISTENCE
  // ============================================
  
  loadData: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = validateAndMigrateState(parsed);
        
        // Recalculate streak on load
        const streak = calculateStreak(validated.workoutHistory, validated.lastWorkoutDate);
        
        set({ ...validated, streak });
        return true;
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
    return false;
  },
  
  saveData: async () => {
    const state = get();
    debouncedSave(state);
  },
  
  // ============================================
  // USER DATA
  // ============================================
  
  setUserData: (updates) => {
    set((state) => {
      const newState = {
        userData: { ...state.userData, ...updates },
      };
      debouncedSave({ ...state, ...newState });
      return newState;
    });
  },
  
  completeOnboarding: () => {
    set((state) => {
      const newState = { isOnboarded: true };
      // Force immediate save for onboarding completion
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...state,
        ...newState,
        schemaVersion: SCHEMA_VERSION,
      })).catch(console.error);
      return newState;
    });
  },
  
  // ============================================
  // WEIGHT TRACKING
  // ============================================
  
  updateWeight: (weight) => {
    const parsedWeight = safeParseFloat(weight);
    if (parsedWeight <= 0 || parsedWeight > 500) {
      console.warn('Invalid weight value:', weight);
      return;
    }
    
    set((state) => {
      // Update user data weight
      const newUserData = { ...state.userData, weight: parsedWeight };
      
      // FIXED: Don't add to weightHistory here - only addDailyCheckIn does this
      // This prevents duplicate entries
      
      const newState = { userData: newUserData };
      debouncedSave({ ...state, ...newState });
      return newState;
    });
  },
  
  // ============================================
  // DAILY CHECK-INS
  // ============================================
  
  addDailyCheckIn: (data) => {
    const weight = safeParseFloat(data.weight);
    if (weight <= 0 || weight > 500) {
      console.warn('Invalid check-in weight:', data.weight);
      return;
    }
    
    set((state) => {
      const today = new Date().toISOString();
      const checkIn = {
        date: today,
        weight,
        hitProtein: Boolean(data.hitProtein),
        calories: data.calories ? safeParseInt(data.calories) : null,
      };
      
      // Update weight history (single source of truth for weight tracking)
      const weightEntry = {
        date: today,
        weight,
      };
      
      // Check if we already have an entry for today
      const todayDate = new Date().toDateString();
      const existingIndex = state.weightHistory.findIndex(
        (w) => new Date(w.date).toDateString() === todayDate
      );
      
      let newWeightHistory;
      if (existingIndex >= 0) {
        // Update existing entry
        newWeightHistory = [...state.weightHistory];
        newWeightHistory[existingIndex] = weightEntry;
      } else {
        // Add new entry
        newWeightHistory = [...state.weightHistory, weightEntry];
      }
      
      // Also check for duplicate daily check-in
      const existingCheckInIndex = state.dailyCheckIns.findIndex(
        (c) => new Date(c.date).toDateString() === todayDate
      );
      
      let newDailyCheckIns;
      if (existingCheckInIndex >= 0) {
        newDailyCheckIns = [...state.dailyCheckIns];
        newDailyCheckIns[existingCheckInIndex] = checkIn;
      } else {
        newDailyCheckIns = [...state.dailyCheckIns, checkIn];
      }
      
      // Update user's current weight
      const newUserData = { ...state.userData, weight };
      
      const newState = {
        dailyCheckIns: newDailyCheckIns,
        weightHistory: newWeightHistory,
        userData: newUserData,
      };
      
      debouncedSave({ ...state, ...newState });
      return newState;
    });
  },
  
  // ============================================
  // WORKOUTS
  // ============================================
  
  startWorkout: (type, customExercises = null) => {
    set((state) => {
      const exercises = customExercises || workoutTemplates[type] || [];
      const newState = {
        currentWorkoutType: type,
        currentExercises: exercises,
        currentSets: [],
      };
      return newState;
    });
  },
  
  completeWorkout: (loggedSets) => {
    set((state) => {
      const date = new Date().toISOString();
      
      // Check for PRs
      const newPRs = { ...state.prs };
      const sessionPRs = [];
      
      // Group sets by exercise
      const setsByExercise = {};
      loggedSets.forEach((set) => {
        const key = set.exerciseId || set.exercise;
        if (!setsByExercise[key]) setsByExercise[key] = [];
        setsByExercise[key].push(set);
      });
      
      // Check each exercise for PR
      Object.entries(setsByExercise).forEach(([exerciseId, sets]) => {
        const maxWeight = Math.max(...sets.map((s) => safeParseFloat(s.weight)));
        const currentPR = newPRs[exerciseId];
        const currentPRWeight = typeof currentPR === 'object' ? currentPR.weight : currentPR;
        
        if (!currentPRWeight || maxWeight > currentPRWeight) {
          newPRs[exerciseId] = {
            weight: maxWeight,
            date,
            reps: sets.find((s) => safeParseFloat(s.weight) === maxWeight)?.reps || 0,
          };
          sessionPRs.push({ exerciseId, weight: maxWeight });
        }
      });
      
      const workout = {
        id: Date.now().toString(),
        date,
        type: state.currentWorkoutType,
        sets: loggedSets,
        duration: null, // Could calculate from first to last set timestamp
      };
      
      const newWorkoutHistory = [...state.workoutHistory, workout];
      const newStreak = calculateStreak(newWorkoutHistory, date);
      
      const newState = {
        workoutHistory: newWorkoutHistory,
        currentWorkoutType: null,
        currentExercises: [],
        currentSets: [],
        prs: newPRs,
        lastWorkoutPRs: sessionPRs,
        lastWorkoutDate: date,
        streak: newStreak,
        draftWorkout: null, // Clear any draft
      };
      
      debouncedSave({ ...state, ...newState });
      return newState;
    });
  },
  
  saveDraftWorkout: (localSets = []) => {
    set((state) => {
      const draft = {
        type: state.currentWorkoutType,
        exercises: state.currentExercises,
        sets: [...state.currentSets, ...localSets], // FIXED: Include local state
        savedAt: new Date().toISOString(),
      };
      
      const newState = { draftWorkout: draft };
      debouncedSave({ ...state, ...newState });
      return newState;
    });
  },
  
  loadDraftWorkout: () => {
    const state = get();
    if (state.draftWorkout) {
      set({
        currentWorkoutType: state.draftWorkout.type,
        currentExercises: state.draftWorkout.exercises,
        currentSets: state.draftWorkout.sets,
      });
      return true;
    }
    return false;
  },
  
  clearDraftWorkout: () => {
    set((state) => {
      const newState = { draftWorkout: null };
      debouncedSave({ ...state, ...newState });
      return newState;
    });
  },
  
  // ============================================
  // EXERCISE ALTERNATIVES
  // ============================================
  
  // FIXED: Now properly imports and uses alternatives
  getExerciseAlternatives: (exerciseId) => {
    return getAlternatives(exerciseId);
  },
  
  swapExercise: (index, newExerciseId) => {
    set((state) => {
      const newExercises = [...state.currentExercises];
      if (index >= 0 && index < newExercises.length) {
        newExercises[index] = {
          ...newExercises[index],
          id: newExerciseId,
        };
      }
      return { currentExercises: newExercises };
    });
  },
  
  // ============================================
  // PROGRESSION & HISTORY
  // ============================================
  
  getLastSession: (exerciseId) => {
    const state = get();
    const history = state.workoutHistory;
    
    if (!history || history.length === 0) return null;
    
    // Find the most recent workout with this exercise
    for (let i = history.length - 1; i >= 0; i--) {
      const workout = history[i];
      if (!workout.sets) continue;
      
      const exerciseSets = workout.sets.filter(
        (s) => s.exerciseId === exerciseId || s.exercise === exerciseId
      );
      
      if (exerciseSets.length > 0) {
        const weights = exerciseSets.map((s) => safeParseFloat(s.weight));
        const reps = exerciseSets.map((s) => safeParseInt(s.reps));
        
        return {
          date: workout.date,
          sets: exerciseSets,
          maxWeight: Math.max(...weights),
          commonWeight: weights.sort((a, b) => 
            weights.filter(w => w === a).length - weights.filter(w => w === b).length
          ).pop(), // Most frequent weight
          avgReps: Math.round(reps.reduce((a, b) => a + b, 0) / reps.length),
        };
      }
    }
    
    return null;
  },
  
  getProgressiveSuggestions: (exerciseId) => {
    const state = get();
    const history = state.workoutHistory;
    
    if (!history || history.length === 0) return null;
    
    // Find most recent workout with this exercise
    for (let i = history.length - 1; i >= 0; i--) {
      const workout = history[i];
      if (!workout.sets) continue;
      
      const hasExercise = workout.sets.some(
        (s) => s.exerciseId === exerciseId || s.exercise === exerciseId
      );
      
      if (hasExercise) {
        return calcProgressiveSuggestion(workout, exerciseId);
      }
    }
    
    return null;
  },
  
  // ============================================
  // WORKOUT ROTATION
  // ============================================
  
  getNextWorkoutType: () => {
    const state = get();
    const history = state.workoutHistory;
    
    if (!history || history.length === 0) return 'Push';
    
    // Get last non-Custom workout
    const lastWorkout = [...history]
      .reverse()
      .find((w) => w.type && w.type !== 'Custom' && w.type !== 'Cardio');
    
    if (!lastWorkout) return 'Push';
    
    const rotation = ['Push', 'Pull', 'Legs'];
    const lastIndex = rotation.indexOf(lastWorkout.type);
    
    if (lastIndex === -1) return 'Push';
    
    return rotation[(lastIndex + 1) % rotation.length];
  },
  
  // ============================================
  // RESET (for testing/debugging)
  // ============================================
  
  resetAllData: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      set({ ...defaultState });
    } catch (error) {
      console.error('Failed to reset data:', error);
    }
  },
}));

// REMOVED: Auto-save subscription that caused race conditions
// Instead, we call debouncedSave explicitly when state changes

export default useStore;
