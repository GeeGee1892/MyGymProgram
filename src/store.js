import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { workoutTemplates } from './data';

const STORAGE_KEY = '@keystone_data';

export const useStore = create((set, get) => ({
  userData: { name: '', sex: '', age: '', height: '', weight: '', targetWeight: '', goal: '', trainingDays: 0 },
  isOnboarded: false,
  streak: 0,
  workoutHistory: [],
  weightHistory: [],
  prs: {},
  currentWorkoutType: null,
  currentExercises: [],
  currentSets: [],

  setUserData: (data) => set({ userData: { ...get().userData, ...data } }),

  completeOnboarding: () => { set({ isOnboarded: true }); get().saveData(); },

  startWorkout: (type) => set({ currentWorkoutType: type, currentExercises: [...workoutTemplates[type]], currentSets: [] }),

  swapExercise: (index, newId) => {
    const exercises = [...get().currentExercises];
    exercises[index] = { ...exercises[index], id: newId };
    set({ currentExercises: exercises });
  },

  completeWorkout: (sets) => {
    const { workoutHistory, prs, currentWorkoutType, streak } = get();
    const newPrs = { ...prs };
    sets.forEach((s) => { if (!newPrs[s.exercise] || s.weight > newPrs[s.exercise]) newPrs[s.exercise] = s.weight; });
    const workout = { type: currentWorkoutType, date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }), timestamp: Date.now(), sets };
    set({ workoutHistory: [...workoutHistory, workout], prs: newPrs, streak: streak + 1, currentSets: sets });
    get().saveData();
  },

  updateWeight: (weight) => {
    const { userData, weightHistory } = get();
    set({ userData: { ...userData, weight }, weightHistory: [...weightHistory, { date: new Date().toLocaleDateString(), weight, timestamp: Date.now() }] });
    get().saveData();
  },

  getNextWorkoutType: () => {
    const { workoutHistory } = get();
    if (workoutHistory.length === 0) return 'push';
    const last = workoutHistory[workoutHistory.length - 1].type;
    return last === 'push' ? 'pull' : last === 'pull' ? 'legs' : 'push';
  },

  saveData: async () => {
    try {
      const { userData, isOnboarded, streak, workoutHistory, weightHistory, prs } = get();
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ userData, isOnboarded, streak, workoutHistory, weightHistory, prs }));
    } catch (e) { console.error('Save error:', e); }
  },

  loadData: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        set({ userData: data.userData || get().userData, isOnboarded: data.isOnboarded || false, streak: data.streak || 0, workoutHistory: data.workoutHistory || [], weightHistory: data.weightHistory || [], prs: data.prs || {} });
      }
    } catch (e) { console.error('Load error:', e); }
  },
}));
