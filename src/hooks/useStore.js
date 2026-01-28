import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { workoutTemplates } from '../data/workouts';

const STORAGE_KEY = '@keystone_data';

export const useStore = create((set, get) => ({
  // User data
  userData: {
    name: '',
    sex: '',
    age: '',
    height: '',
    weight: '',
    targetWeight: '',
    goal: '',
    trainingDays: 0,
  },
  
  // App state
  isOnboarded: false,
  streak: 0,
  workoutHistory: [],
  weightHistory: [],
  prs: {},
  
  // Current workout
  currentWorkoutType: null,
  currentExercises: [],
  currentSets: [],
  
  // Actions
  setUserData: (data) => set({ userData: { ...get().userData, ...data } }),
  
  completeOnboarding: () => {
    set({ isOnboarded: true });
    get().saveData();
  },
  
  startWorkout: (type) => {
    set({
      currentWorkoutType: type,
      currentExercises: [...workoutTemplates[type]],
      currentSets: [],
    });
  },
  
  swapExercise: (index, newExerciseId) => {
    const exercises = [...get().currentExercises];
    exercises[index] = { ...exercises[index], id: newExerciseId };
    set({ currentExercises: exercises });
  },
  
  completeWorkout: (sets) => {
    const { workoutHistory, prs, currentWorkoutType, streak, userData } = get();
    
    // Update PRs
    const newPrs = { ...prs };
    sets.forEach((s) => {
      if (!newPrs[s.exercise] || s.weight > newPrs[s.exercise]) {
        newPrs[s.exercise] = s.weight;
      }
    });
    
    // Add to history
    const workout = {
      type: currentWorkoutType,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      timestamp: Date.now(),
      sets,
    };
    
    set({
      workoutHistory: [...workoutHistory, workout],
      prs: newPrs,
      streak: streak + 1,
      currentSets: sets,
    });
    
    get().saveData();
  },
  
  updateWeight: (weight) => {
    const { userData, weightHistory } = get();
    set({
      userData: { ...userData, weight },
      weightHistory: [
        ...weightHistory,
        { date: new Date().toLocaleDateString(), weight, timestamp: Date.now() },
      ],
    });
    get().saveData();
  },
  
  getNextWorkoutType: () => {
    const { workoutHistory } = get();
    if (workoutHistory.length === 0) return 'push';
    const last = workoutHistory[workoutHistory.length - 1].type;
    if (last === 'push') return 'pull';
    if (last === 'pull') return 'legs';
    return 'push';
  },
  
  // Persistence
  saveData: async () => {
    try {
      const { userData, isOnboarded, streak, workoutHistory, weightHistory, prs } = get();
      const data = { userData, isOnboarded, streak, workoutHistory, weightHistory, prs };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving data:', e);
    }
  },
  
  loadData: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        set({
          userData: data.userData || get().userData,
          isOnboarded: data.isOnboarded || false,
          streak: data.streak || 0,
          workoutHistory: data.workoutHistory || [],
          weightHistory: data.weightHistory || [],
          prs: data.prs || {},
        });
      }
    } catch (e) {
      console.error('Error loading data:', e);
    }
  },
  
  resetData: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set({
      userData: { name: '', sex: '', age: '', height: '', weight: '', targetWeight: '', goal: '', trainingDays: 0 },
      isOnboarded: false,
      streak: 0,
      workoutHistory: [],
      weightHistory: [],
      prs: {},
      currentWorkoutType: null,
      currentExercises: [],
      currentSets: [],
    });
  },
}));

export default useStore;
