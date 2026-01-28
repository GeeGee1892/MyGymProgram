import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, SafeAreaView } from 'react-native';
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ==================== DATA ====================
export const exerciseDB = {
  chest_press_incline: { name: 'Incline Dumbbell Press', muscles: 'Upper chest, front delts', cues: ['30° incline', 'Control negative', 'Full stretch'] },
  chest_press_flat_bb: { name: 'Flat Bench Press', muscles: 'Mid chest, triceps', cues: ['Slight arch', 'Touch mid-chest', 'Drive through floor'] },
  chest_press_flat_db: { name: 'Flat Dumbbell Press', muscles: 'Mid chest, triceps', cues: ['Full ROM', 'Squeeze at top'] },
  chest_press_machine: { name: 'Machine Chest Press', muscles: 'Chest, triceps', cues: ['Adjust seat', 'Full extension'] },
  chest_fly_cable: { name: 'Cable Fly', muscles: 'Chest', cues: ['Slight elbow bend', 'Squeeze center'] },
  chest_fly_machine: { name: 'Pec Deck', muscles: 'Chest', cues: ['Elbows at 90°', 'Squeeze hard'] },
  chest_dip: { name: 'Chest Dip', muscles: 'Lower chest, triceps', cues: ['Lean forward', 'Deep stretch'] },
  shoulder_press_db: { name: 'Seated Dumbbell Press', muscles: 'Front & side delts', cues: ['Neutral spine', 'Full lockout'] },
  shoulder_press_machine: { name: 'Machine Shoulder Press', muscles: 'Shoulders', cues: ['Back against pad', 'Full ROM'] },
  shoulder_press_bb: { name: 'Overhead Barbell Press', muscles: 'Shoulders, triceps', cues: ['Tight core', 'Full lockout'] },
  lateral_raise_db: { name: 'Dumbbell Lateral Raise', muscles: 'Side delts', cues: ['Lead with elbows', 'No swinging'] },
  lateral_raise_cable: { name: 'Cable Lateral Raise', muscles: 'Side delts', cues: ['Constant tension', 'Control'] },
  lateral_raise_machine: { name: 'Machine Lateral Raise', muscles: 'Side delts', cues: ['Squeeze at top'] },
  tricep_pushdown_rope: { name: 'Rope Pushdown', muscles: 'Triceps', cues: ['Elbows pinned', 'Spread rope'] },
  tricep_pushdown_bar: { name: 'Bar Pushdown', muscles: 'Triceps', cues: ['Elbows still', 'Squeeze'] },
  tricep_overhead_cable: { name: 'Overhead Cable Extension', muscles: 'Triceps long head', cues: ['Elbows forward', 'Full stretch'] },
  tricep_overhead_db: { name: 'Overhead Dumbbell Extension', muscles: 'Triceps long head', cues: ['Elbows in', 'Full ROM'] },
  tricep_skullcrusher: { name: 'Skull Crushers', muscles: 'Triceps', cues: ['Lower to forehead', 'Elbows still'] },
  tricep_dip: { name: 'Tricep Dip', muscles: 'Triceps', cues: ['Upright torso', 'Full lockout'] },
  tricep_kickback: { name: 'Tricep Kickback', muscles: 'Triceps', cues: ['Full extension', 'Squeeze'] },
  lat_pulldown: { name: 'Lat Pulldown', muscles: 'Lats, biceps', cues: ['Slight lean', 'Pull to chest'] },
  lat_pulldown_close: { name: 'Close Grip Pulldown', muscles: 'Lats, mid-back', cues: ['Squeeze lats'] },
  pullup: { name: 'Pull-Up', muscles: 'Lats, biceps', cues: ['Dead hang', 'Chin over bar'] },
  pullup_assisted: { name: 'Assisted Pull-Up', muscles: 'Lats, biceps', cues: ['Full ROM'] },
  row_barbell: { name: 'Barbell Row', muscles: 'Mid-back, lats', cues: ['Hinge at hips', 'Pull to belly'] },
  row_dumbbell: { name: 'Dumbbell Row', muscles: 'Lats, mid-back', cues: ['Pull to hip', 'Full stretch'] },
  row_cable_seated: { name: 'Seated Cable Row', muscles: 'Mid-back', cues: ['Chest up', 'Squeeze'] },
  row_chest_supported: { name: 'Chest Supported Row', muscles: 'Mid-back, rear delts', cues: ['No momentum', 'Squeeze'] },
  row_machine: { name: 'Machine Row', muscles: 'Mid-back', cues: ['Full ROM', 'Control'] },
  face_pull: { name: 'Face Pull', muscles: 'Rear delts, rotator cuff', cues: ['High pull', 'External rotate'] },
  rear_delt_fly_cable: { name: 'Cable Rear Delt Fly', muscles: 'Rear delts', cues: ['Lead with elbows'] },
  rear_delt_fly_machine: { name: 'Reverse Pec Deck', muscles: 'Rear delts', cues: ['Squeeze back'] },
  curl_incline: { name: 'Incline Dumbbell Curl', muscles: 'Biceps', cues: ['Arms hang back', 'No swinging'] },
  curl_preacher: { name: 'Preacher Curl', muscles: 'Biceps', cues: ['Full extension', 'Squeeze'] },
  curl_cable: { name: 'Cable Curl', muscles: 'Biceps', cues: ['Constant tension'] },
  curl_dumbbell: { name: 'Dumbbell Curl', muscles: 'Biceps', cues: ['Supinate at top'] },
  curl_hammer: { name: 'Hammer Curl', muscles: 'Brachialis, forearms', cues: ['Neutral grip', 'Control'] },
  curl_reverse: { name: 'Reverse Curl', muscles: 'Forearm extensors', cues: ['Overhand grip', 'Wrists straight'] },
  squat_hack: { name: 'Hack Squat', muscles: 'Quads, glutes', cues: ['Full depth', 'Drive through heels'] },
  squat_barbell: { name: 'Barbell Squat', muscles: 'Quads, glutes', cues: ['Bar on traps', 'Knees out'] },
  squat_goblet: { name: 'Goblet Squat', muscles: 'Quads, glutes', cues: ['DB at chest', 'Upright'] },
  leg_press: { name: 'Leg Press', muscles: 'Quads, glutes', cues: ['Full depth', 'Don\'t lock'] },
  leg_extension: { name: 'Leg Extension', muscles: 'Quads', cues: ['Full extension', 'Squeeze'] },
  lunge_walking: { name: 'Walking Lunge', muscles: 'Quads, glutes', cues: ['Long stride', 'Upright'] },
  lunge_reverse: { name: 'Reverse Lunge', muscles: 'Quads, glutes', cues: ['Step back', 'Drive up'] },
  split_squat_bulgarian: { name: 'Bulgarian Split Squat', muscles: 'Quads, glutes', cues: ['Rear foot elevated', 'Full depth'] },
  rdl_barbell: { name: 'Romanian Deadlift', muscles: 'Hamstrings, glutes', cues: ['Push hips back', 'Feel stretch'] },
  rdl_dumbbell: { name: 'Dumbbell RDL', muscles: 'Hamstrings, glutes', cues: ['Hinge pattern', 'Squeeze glutes'] },
  leg_curl_lying: { name: 'Lying Leg Curl', muscles: 'Hamstrings', cues: ['Hips down', 'Squeeze'] },
  leg_curl_seated: { name: 'Seated Leg Curl', muscles: 'Hamstrings', cues: ['Full curl', 'Control'] },
  calf_raise_standing: { name: 'Standing Calf Raise', muscles: 'Gastrocnemius', cues: ['Full stretch', 'Pause at top'] },
  calf_raise_seated: { name: 'Seated Calf Raise', muscles: 'Soleus', cues: ['Full ROM', 'Squeeze'] },
  calf_raise_leg_press: { name: 'Leg Press Calf Raise', muscles: 'Calves', cues: ['Full extension'] },
  crunch_cable: { name: 'Cable Crunch', muscles: 'Abs', cues: ['Crunch ribs to hips', 'Hold'] },
  crunch_machine: { name: 'Ab Machine', muscles: 'Abs', cues: ['Crunch down', 'Control'] },
  leg_raise_hanging: { name: 'Hanging Leg Raise', muscles: 'Lower abs', cues: ['Curl pelvis', 'Control'] },
  plank: { name: 'Plank', muscles: 'Core', cues: ['Straight line', 'Breathe'] },
};

export const alternatives = {
  chest_press_incline: ['chest_press_flat_db', 'chest_press_machine', 'chest_dip'],
  chest_press_flat_bb: ['chest_press_flat_db', 'chest_press_machine', 'chest_dip'],
  chest_fly_cable: ['chest_fly_machine', 'chest_press_flat_db'],
  shoulder_press_db: ['shoulder_press_machine', 'shoulder_press_bb'],
  lateral_raise_db: ['lateral_raise_cable', 'lateral_raise_machine'],
  tricep_pushdown_rope: ['tricep_pushdown_bar', 'tricep_kickback', 'tricep_dip'],
  tricep_overhead_cable: ['tricep_overhead_db', 'tricep_skullcrusher'],
  lat_pulldown: ['lat_pulldown_close', 'pullup', 'pullup_assisted'],
  row_barbell: ['row_dumbbell', 'row_cable_seated', 'row_chest_supported', 'row_machine'],
  row_chest_supported: ['row_dumbbell', 'row_machine', 'row_cable_seated'],
  face_pull: ['rear_delt_fly_cable', 'rear_delt_fly_machine'],
  curl_incline: ['curl_preacher', 'curl_cable', 'curl_dumbbell'],
  curl_hammer: ['curl_reverse', 'curl_cable'],
  leg_press: ['squat_hack', 'squat_barbell', 'squat_goblet'],
  rdl_barbell: ['rdl_dumbbell', 'leg_curl_lying'],
  leg_extension: ['lunge_walking', 'split_squat_bulgarian'],
  leg_curl_lying: ['leg_curl_seated', 'rdl_dumbbell'],
  split_squat_bulgarian: ['lunge_reverse', 'lunge_walking'],
  calf_raise_standing: ['calf_raise_leg_press', 'calf_raise_seated'],
  crunch_cable: ['crunch_machine', 'leg_raise_hanging', 'plank'],
};

export const workoutTemplates = {
  push: [
    { id: 'chest_press_incline', sets: 3, reps: '8-10' }, { id: 'chest_press_flat_bb', sets: 3, reps: '6-8' },
    { id: 'chest_fly_cable', sets: 3, reps: '12-15' }, { id: 'shoulder_press_db', sets: 3, reps: '8-10' },
    { id: 'lateral_raise_db', sets: 3, reps: '12-15' }, { id: 'tricep_pushdown_rope', sets: 3, reps: '10-12' },
    { id: 'tricep_overhead_cable', sets: 2, reps: '10-12' }, { id: 'crunch_cable', sets: 2, reps: '15-20' },
  ],
  pull: [
    { id: 'lat_pulldown', sets: 3, reps: '8-10' }, { id: 'row_barbell', sets: 3, reps: '8-10' },
    { id: 'row_chest_supported', sets: 3, reps: '10-12' }, { id: 'face_pull', sets: 3, reps: '15-20' },
    { id: 'curl_incline', sets: 3, reps: '10-12' }, { id: 'curl_hammer', sets: 3, reps: '10-12' },
    { id: 'curl_reverse', sets: 2, reps: '12-15' },
  ],
  legs: [
    { id: 'leg_press', sets: 4, reps: '10-12' }, { id: 'rdl_barbell', sets: 3, reps: '8-10' },
    { id: 'leg_extension', sets: 3, reps: '12-15' }, { id: 'leg_curl_lying', sets: 3, reps: '10-12' },
    { id: 'split_squat_bulgarian', sets: 3, reps: '10 each' }, { id: 'calf_raise_standing', sets: 3, reps: '12-15' },
  ],
  cardio: [
    { id: 'cardio_warmup', sets: 1, reps: '5 min', name: 'Warm-up', muscles: 'Full body' },
    { id: 'cardio_main', sets: 1, reps: '20-30 min', name: 'Steady State Cardio', muscles: 'Cardiovascular' },
    { id: 'cardio_cooldown', sets: 1, reps: '5 min', name: 'Cool-down', muscles: 'Recovery' },
  ],
};

export const workoutTypes = {
  push: { name: 'Push', subtitle: 'Chest · Shoulders · Triceps', color: '#3b82f6' },
  pull: { name: 'Pull', subtitle: 'Back · Biceps · Forearms', color: '#8b5cf6' },
  legs: { name: 'Legs', subtitle: 'Quads · Hamstrings · Glutes', color: '#f97316' },
  cardio: { name: 'Cardio', subtitle: 'Heart health · Recovery', color: '#10b981' },
};

// ==================== UTILS ====================
const calcBMR = (w, h, a, s) => Math.round((10 * w) + (6.25 * h) - (5 * a) + (s === 'female' ? -161 : 5));
export const calcCalories = (d) => Math.round(calcBMR(+d.weight, +d.height, +d.age, d.sex) * 1.55) + ({ cut: -500, bulk: 300, maintain: 0 }[d.goal] || 0);
export const calcProtein = (w, g) => Math.round(+w * (g === 'cut' ? 2.2 : 1.8));
export const calcVolume = (sets) => sets.reduce((s, x) => s + x.reps * x.weight, 0);
export const fmtTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
export const fmtNum = (n) => n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n.toString();

// Moving average (4-session window)
export const calcMA = (data, w = 4) => {
  if (!data || data.length < 2) return [];
  return data.map((_, i) => {
    const slice = data.slice(Math.max(0, i - w + 1), i + 1);
    return slice.reduce((a, b) => a + b, 0) / slice.length;
  });
};

// Get max kg per session for an exercise
export const getExerciseSessions = (history, exId, exName) => {
  const sessions = [];
  history.forEach(w => {
    const exSets = w.sets.filter(s => s.exerciseId === exId || s.exercise === exName);
    if (exSets.length > 0) {
      const maxKg = Math.max(...exSets.map(s => s.weight));
      const best = exSets.find(s => s.weight === maxKg);
      sessions.push({ date: w.date, ts: w.timestamp || Date.now(), maxKg, reps: best?.reps || 0, vol: exSets.reduce((s, x) => s + x.weight * x.reps, 0), sets: exSets.length });
    }
  });
  return sessions.sort((a, b) => a.ts - b.ts);
};

// Get volume by workout type
export const getVolByType = (history, type) => history.filter(w => !type || w.type === type).map(w => ({ date: w.date, ts: w.timestamp || Date.now(), vol: w.sets.reduce((s, x) => s + x.weight * x.reps, 0), type: w.type })).sort((a, b) => a.ts - b.ts);

// ==================== STORE ====================
const KEY = '@keystone';
export const useStore = create((set, get) => ({
  userData: { name: '', sex: '', age: '', height: '', weight: '', targetWeight: '', goal: '', trainingDays: 0 },
  isOnboarded: false, streak: 0, workoutHistory: [], weightHistory: [], prs: {},
  currentWorkoutType: null, currentExercises: [], currentSets: [],
  setUserData: (d) => set({ userData: { ...get().userData, ...d } }),
  completeOnboarding: () => { set({ isOnboarded: true }); get().saveData(); },
  startWorkout: (t) => set({ currentWorkoutType: t, currentExercises: [...workoutTemplates[t]], currentSets: [] }),
  swapExercise: (i, id) => { const e = [...get().currentExercises]; e[i] = { ...e[i], id }; set({ currentExercises: e }); },
  completeWorkout: (sets) => {
    const { workoutHistory, prs, currentWorkoutType, streak } = get();
    const newPrs = { ...prs }; sets.forEach((s) => { if (!newPrs[s.exercise] || s.weight > newPrs[s.exercise]) newPrs[s.exercise] = s.weight; });
    set({ workoutHistory: [...workoutHistory, { type: currentWorkoutType, date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }), timestamp: Date.now(), sets }], prs: newPrs, streak: streak + 1, currentSets: sets });
    get().saveData();
  },
  updateWeight: (w) => { const { userData, weightHistory } = get(); set({ userData: { ...userData, weight: w }, weightHistory: [...weightHistory, { weight: w }] }); get().saveData(); },
  getNextWorkoutType: () => { const h = get().workoutHistory; if (!h.length) return 'push'; const l = h[h.length - 1].type; return l === 'push' ? 'pull' : l === 'pull' ? 'legs' : 'push'; },
  saveData: async () => { try { const { userData, isOnboarded, streak, workoutHistory, weightHistory, prs } = get(); await AsyncStorage.setItem(KEY, JSON.stringify({ userData, isOnboarded, streak, workoutHistory, weightHistory, prs })); } catch (e) {} },
  loadData: async () => { try { const s = await AsyncStorage.getItem(KEY); if (s) { const d = JSON.parse(s); set({ userData: d.userData || get().userData, isOnboarded: d.isOnboarded || false, streak: d.streak || 0, workoutHistory: d.workoutHistory || [], weightHistory: d.weightHistory || [], prs: d.prs || {} }); } } catch (e) {} },
}));

// ==================== COMPONENTS ====================
export const Btn = ({ children, onPress, v = 'primary', disabled, sz = 'md', style }) => {
  const vars = { primary: { bg: '#fff', tx: '#000' }, secondary: { bg: '#27272a', tx: '#fff', bd: '#3f3f46' }, ghost: { bg: 'transparent', tx: '#a1a1aa' }, accent: { bg: '#10b981', tx: '#000' } };
  const c = vars[v]; const py = sz === 'sm' ? 8 : 16;
  return <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.8} style={[{ backgroundColor: c.bg, paddingVertical: py, paddingHorizontal: 24, borderRadius: 12, alignItems: 'center', borderWidth: c.bd ? 1 : 0, borderColor: c.bd }, disabled && { opacity: 0.4 }, style]}><Text style={{ color: c.tx, fontWeight: '600', fontSize: sz === 'sm' ? 14 : 16 }}>{children}</Text></TouchableOpacity>;
};

export const Card = ({ children, onPress, style }) => {
  const C = onPress ? TouchableOpacity : View;
  return <C onPress={onPress} activeOpacity={0.8} style={[{ backgroundColor: '#18181b', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#27272a' }, style]}>{children}</C>;
};

export const Progress = ({ cur, tot }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
    <View style={{ flex: 1, height: 4, backgroundColor: '#27272a', borderRadius: 2, overflow: 'hidden' }}><View style={{ height: '100%', width: `${tot > 0 ? (cur / tot) * 100 : 0}%`, backgroundColor: '#fff', borderRadius: 2 }} /></View>
    <Text style={{ color: '#52525b', fontSize: 12 }}>{cur} of {tot}</Text>
  </View>
);

export const MiniChart = ({ data, h = 40 }) => {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data), min = Math.min(...data), r = max - min || 1;
  return <View style={{ height: h, flexDirection: 'row', alignItems: 'flex-end', gap: 2 }}>{data.slice(-10).map((v, i, a) => <View key={i} style={{ flex: 1, borderRadius: 2, minHeight: 4, height: `${((v - min) / r) * 80 + 20}%`, backgroundColor: i === a.length - 1 ? '#10b981' : '#3f3f46' }} />)}</View>;
};

export const LineChart = ({ data, h = 100 }) => {
  if (!data || data.length < 2) return <View style={{ height: h, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: '#52525b', fontSize: 14 }}>Need more data</Text></View>;
  const max = Math.max(...data), min = Math.min(...data), r = max - min || 1;
  return <View style={{ height: h, flexDirection: 'row', alignItems: 'flex-end', gap: 4, paddingVertical: 8 }}>{data.map((v, i) => <View key={i} style={{ flex: 1, alignItems: 'center' }}><View style={{ width: 8, height: ((v - min) / r) * (h - 24) + 12, borderRadius: 4, backgroundColor: i === data.length - 1 ? '#10b981' : '#3f3f46' }} /></View>)}</View>;
};

// Enhanced chart: dots for raw data, bars behind for MA trend
export const TrendChart = ({ data, h = 120, showMA = true, labels }) => {
  if (!data || data.length < 2) return <View style={{ height: h, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: '#52525b', fontSize: 14 }}>Need more data</Text></View>;
  const ma = showMA ? calcMA(data, 4) : data;
  const all = [...data, ...ma];
  const max = Math.max(...all), min = Math.min(...all), r = max - min || 1;
  const getY = (v) => ((v - min) / r) * (h - 40) + 16;
  return (
    <View style={{ height: h }}>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 2 }}>
        {data.map((v, i) => {
          const maH = showMA && ma[i] ? getY(ma[i]) : 0;
          const isLast = i === data.length - 1;
          return (
            <View key={i} style={{ flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
              {showMA && ma[i] && <View style={{ position: 'absolute', bottom: 16, width: '100%', height: maH, backgroundColor: 'rgba(16,185,129,0.15)', borderRadius: 2 }} />}
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: isLast ? '#10b981' : '#52525b', marginBottom: getY(v) - 5, zIndex: 1 }} />
            </View>
          );
        })}
      </View>
      {labels && <View style={{ flexDirection: 'row', marginTop: 4 }}>{labels.slice(-data.length).map((l, i) => <Text key={i} style={{ flex: 1, textAlign: 'center', fontSize: 9, color: '#52525b' }}>{l}</Text>)}</View>}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
        <Text style={{ fontSize: 10, color: '#52525b' }}>{min.toFixed(0)}kg</Text>
        <Text style={{ fontSize: 10, color: '#52525b' }}>{max.toFixed(0)}kg</Text>
      </View>
    </View>
  );
};

// ==================== SCREENS ====================
const dot = { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10b981' };

export const WelcomeScreen = ({ navigation }) => (
  <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
    <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 60 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 48 }}>
        <View style={{ width: 48, height: 48, backgroundColor: '#0d1117', borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#27272a' }}><Text style={{ color: '#10b981', fontSize: 18 }}>📈</Text></View>
        <View><Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>MyGymProgram</Text><Text style={{ color: '#71717a', fontSize: 10, letterSpacing: 2 }}>Plans • Log • Analytics</Text></View>
      </View>
      <Text style={{ fontSize: 36, fontWeight: '700', color: '#fff', lineHeight: 44, marginBottom: 16 }}>Track your lifts.{'\n'}<Text style={{ color: '#71717a' }}>See your progress.</Text></Text>
      <Text style={{ fontSize: 18, color: '#71717a', marginBottom: 48 }}>Simple workout tracking with smart suggestions.</Text>
      {['Log sets, reps & weight', 'Swap exercises on the fly', 'Track PRs & progress'].map((t, i) => <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 }}><View style={dot} /><Text style={{ color: '#fff', fontSize: 16 }}>{t}</Text></View>)}
    </View>
    <View style={{ paddingHorizontal: 24, paddingBottom: 40 }}><Btn onPress={() => navigation.navigate('Name')}>Get Started</Btn></View>
  </SafeAreaView>
);

export const NameScreen = ({ navigation }) => {
  const { userData, setUserData } = useStore();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 24 }}>
        <View style={{ marginBottom: 32 }}><Progress cur={1} tot={5} /></View>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 8 }}>What's your name?</Text>
        <Text style={{ fontSize: 16, color: '#71717a', marginBottom: 32 }}>We'll use this to personalize your experience.</Text>
        <TextInput style={{ backgroundColor: '#18181b', borderWidth: 1, borderColor: '#27272a', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 18, color: '#fff', fontWeight: '500' }} value={userData.name} onChangeText={(t) => setUserData({ name: t })} placeholder="Enter your name" placeholderTextColor="#52525b" autoFocus />
      </View>
      <View style={{ paddingHorizontal: 24, paddingBottom: 40 }}><Btn onPress={() => navigation.navigate('Stats')} disabled={!userData.name.trim()}>Continue</Btn></View>
    </SafeAreaView>
  );
};

export const StatsScreen = ({ navigation }) => {
  const { userData, setUserData } = useStore();
  const valid = userData.sex && userData.age && userData.height && userData.weight && userData.targetWeight;
  const fields = [{ k: 'age', l: 'Age', u: 'years' }, { k: 'height', l: 'Height', u: 'cm' }, { k: 'weight', l: 'Current weight', u: 'kg' }, { k: 'targetWeight', l: 'Target weight', u: 'kg' }];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 24, paddingTop: 24 }} showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: 32 }}><Progress cur={2} tot={5} /></View>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 8 }}>Your stats</Text>
        <Text style={{ fontSize: 16, color: '#71717a', marginBottom: 24 }}>Used to calculate your targets.</Text>
        <Text style={{ fontSize: 14, color: '#71717a', marginBottom: 8 }}>Sex</Text>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          {['male', 'female'].map((x) => <TouchableOpacity key={x} style={{ flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: userData.sex === x ? '#fff' : '#27272a', backgroundColor: userData.sex === x ? '#fff' : 'transparent', alignItems: 'center' }} onPress={() => setUserData({ sex: x })}><Text style={{ color: userData.sex === x ? '#000' : '#a1a1aa', fontWeight: '500', fontSize: 16 }}>{x.charAt(0).toUpperCase() + x.slice(1)}</Text></TouchableOpacity>)}
        </View>
        {fields.map((f) => <View key={f.k} style={{ marginBottom: 20 }}><Text style={{ fontSize: 14, color: '#71717a', marginBottom: 8 }}>{f.l}</Text><View style={{ position: 'relative' }}><TextInput style={{ backgroundColor: '#18181b', borderWidth: 1, borderColor: '#27272a', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 18, color: '#fff' }} value={userData[f.k]} onChangeText={(t) => setUserData({ [f.k]: t })} keyboardType="numeric" /><Text style={{ position: 'absolute', right: 16, top: '50%', transform: [{ translateY: -8 }], color: '#52525b' }}>{f.u}</Text></View></View>)}
      </ScrollView>
      <View style={{ paddingHorizontal: 24, paddingBottom: 40, paddingTop: 16 }}><Btn onPress={() => navigation.navigate('Goal')} disabled={!valid}>Continue</Btn></View>
    </SafeAreaView>
  );
};

export const GoalScreen = ({ navigation }) => {
  const { userData, setUserData } = useStore();
  const goals = [{ id: 'cut', l: 'Lose fat', d: 'Calorie deficit, preserve muscle' }, { id: 'bulk', l: 'Build muscle', d: 'Calorie surplus for growth' }, { id: 'maintain', l: 'Maintain', d: 'Stay at current weight' }];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 24 }}>
        <View style={{ marginBottom: 32 }}><Progress cur={3} tot={5} /></View>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 8 }}>Your goal</Text>
        <Text style={{ fontSize: 16, color: '#71717a', marginBottom: 24 }}>What are you working towards?</Text>
        {goals.map((g) => <TouchableOpacity key={g.id} style={{ flexDirection: 'row', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: userData.goal === g.id ? '#fff' : '#27272a', backgroundColor: userData.goal === g.id ? '#fff' : 'transparent', marginBottom: 12, justifyContent: 'space-between', alignItems: 'center' }} onPress={() => setUserData({ goal: g.id })}><View><Text style={{ fontWeight: '600', fontSize: 16, color: userData.goal === g.id ? '#000' : '#fff' }}>{g.l}</Text><Text style={{ fontSize: 14, color: userData.goal === g.id ? '#52525b' : '#71717a' }}>{g.d}</Text></View>{userData.goal === g.id && <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#fff', fontSize: 12 }}>✓</Text></View>}</TouchableOpacity>)}
      </View>
      <View style={{ paddingHorizontal: 24, paddingBottom: 40 }}><Btn onPress={() => navigation.navigate('TrainingDays')} disabled={!userData.goal}>Continue</Btn></View>
    </SafeAreaView>
  );
};

export const TrainingDaysScreen = ({ navigation }) => {
  const { userData, setUserData } = useStore();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 24 }}>
        <View style={{ marginBottom: 32 }}><Progress cur={4} tot={5} /></View>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 8 }}>Training days</Text>
        <Text style={{ fontSize: 16, color: '#71717a', marginBottom: 24 }}>How many days per week?</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24 }}>{[3, 4, 5, 6].map((d) => <TouchableOpacity key={d} style={{ flex: 1, aspectRatio: 1, borderRadius: 12, borderWidth: 1, borderColor: userData.trainingDays === d ? '#fff' : '#27272a', backgroundColor: userData.trainingDays === d ? '#fff' : 'transparent', alignItems: 'center', justifyContent: 'center' }} onPress={() => setUserData({ trainingDays: d })}><Text style={{ fontSize: 20, fontWeight: '700', color: userData.trainingDays === d ? '#000' : '#a1a1aa' }}>{d}</Text></TouchableOpacity>)}</View>
        <Card><Text style={{ color: '#a1a1aa', fontSize: 14 }}><Text style={{ color: '#10b981' }}>Tip: </Text>3-4 days is optimal. Recovery matters.</Text></Card>
      </View>
      <View style={{ paddingHorizontal: 24, paddingBottom: 40 }}><Btn onPress={() => navigation.navigate('PlanReady')} disabled={!userData.trainingDays}>Continue</Btn></View>
    </SafeAreaView>
  );
};

export const PlanReadyScreen = ({ navigation }) => {
  const { userData, completeOnboarding } = useStore();
  const cals = calcCalories(userData), prot = calcProtein(userData.weight, userData.goal);
  const handleStart = () => { completeOnboarding(); navigation.reset({ index: 0, routes: [{ name: 'Home' }] }); };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 24, paddingTop: 24 }} showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: 32 }}><Progress cur={5} tot={5} /></View>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 8 }}>You're all set, {userData.name}!</Text>
        <Text style={{ fontSize: 16, color: '#71717a', marginBottom: 24 }}>Here's your plan.</Text>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}><Card style={{ flex: 1 }}><Text style={{ color: '#71717a', fontSize: 14 }}>Calories</Text><Text style={{ color: '#fff', fontSize: 24, fontWeight: '700' }}>{cals}</Text></Card><Card style={{ flex: 1 }}><Text style={{ color: '#71717a', fontSize: 14 }}>Protein</Text><Text style={{ color: '#fff', fontSize: 24, fontWeight: '700' }}>{prot}g</Text></Card></View>
        <Card style={{ marginBottom: 12 }}><Text style={{ color: '#71717a', fontSize: 14 }}>Current → Target</Text><Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>{userData.weight}kg → {userData.targetWeight}kg</Text></Card>
        <Card><Text style={{ color: '#71717a', fontSize: 14, marginBottom: 12 }}>Features</Text>{['Smart workout rotation', 'Swap exercises anytime', 'Log in any order', 'Automatic PR tracking'].map((f, i) => <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}><View style={dot} /><Text style={{ color: '#fff', fontSize: 14 }}>{f}</Text></View>)}</Card>
      </ScrollView>
      <View style={{ paddingHorizontal: 24, paddingBottom: 40, paddingTop: 16 }}><Btn v="accent" onPress={handleStart}>Start Training</Btn></View>
    </SafeAreaView>
  );
};

export const HomeScreen = ({ navigation }) => {
  const { userData, streak, workoutHistory, prs, startWorkout, updateWeight, getNextWorkoutType } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const suggested = getNextWorkoutType(), info = workoutTypes[suggested], totalSets = workoutTemplates[suggested].reduce((s, e) => s + e.sets, 0);
  const prList = Object.entries(prs), recentPR = prList.length > 0 ? prList[prList.length - 1] : null;
  const volData = workoutHistory.slice(-7).map(w => w.sets.reduce((s, x) => s + x.reps * x.weight, 0));
  const handleStart = (t) => { startWorkout(t); navigation.navigate('Workout', { type: t }); };
  const handleWeight = () => { if (newWeight) { updateWeight(parseFloat(newWeight)); setNewWeight(''); setShowModal(false); } };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <View><Text style={{ fontSize: 14, color: '#71717a' }}>Welcome back,</Text><Text style={{ fontSize: 24, fontWeight: '700', color: '#fff' }}>{userData.name}</Text></View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#18181b', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#27272a' }}><Text>🔥</Text><Text style={{ color: '#fff', fontWeight: '700' }}>{streak}</Text></View>
        </View>
        <Text style={{ fontSize: 12, color: '#71717a', letterSpacing: 1, marginBottom: 8 }}>SUGGESTED</Text>
        <Card style={{ marginBottom: 16, padding: 0, overflow: 'hidden' }} onPress={() => handleStart(suggested)}>
          <View style={{ padding: 16, paddingBottom: 8 }}><View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}><View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: info.color }} /><View><Text style={{ fontSize: 18, fontWeight: '700', color: '#fff' }}>{info.name}</Text><Text style={{ fontSize: 14, color: '#71717a' }}>{info.subtitle}</Text></View></View><Text style={{ fontSize: 14, color: '#71717a' }}>{workoutTemplates[suggested].length} exercises · {totalSets} sets</Text></View>
          <View style={{ backgroundColor: '#fff', paddingVertical: 12, alignItems: 'center' }}><Text style={{ color: '#000', fontWeight: '600' }}>Start →</Text></View>
        </Card>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>{['push', 'pull', 'legs', 'cardio'].map((t) => <TouchableOpacity key={t} style={{ flex: 1, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: t === suggested ? '#10b981' : '#27272a', alignItems: 'center' }} onPress={() => handleStart(t)}><Text style={{ fontSize: 12, fontWeight: '500', color: t === suggested ? '#10b981' : '#a1a1aa' }}>{t.charAt(0).toUpperCase() + t.slice(1)}</Text></TouchableOpacity>)}</View>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}><Card style={{ flex: 1, padding: 12 }} onPress={() => setShowModal(true)}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ fontSize: 12, color: '#71717a' }}>Weight</Text><Text style={{ fontSize: 12, color: '#10b981' }}>Edit</Text></View><Text style={{ fontSize: 18, fontWeight: '700', color: '#fff' }}>{userData.weight}kg</Text></Card><Card style={{ flex: 1, padding: 12 }} onPress={() => navigation.navigate('Progress')}><Text style={{ fontSize: 12, color: '#71717a' }}>Workouts</Text><Text style={{ fontSize: 18, fontWeight: '700', color: '#fff' }}>{workoutHistory.length}</Text></Card></View>
        {volData.length >= 2 && <Card style={{ marginBottom: 12 }} onPress={() => navigation.navigate('Progress')}><View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}><Text style={{ fontSize: 14, color: '#71717a' }}>Volume Trend</Text><Text style={{ color: '#52525b' }}>→</Text></View><MiniChart data={volData} h={50} /></Card>}
        {recentPR && <Card onPress={() => navigation.navigate('Progress')}><View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}><View style={{ width: 40, height: 40, backgroundColor: 'rgba(245,158,11,0.2)', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}><Text>🏆</Text></View><View style={{ flex: 1 }}><Text style={{ fontSize: 12, color: '#71717a' }}>Recent PR</Text><Text style={{ fontSize: 14, fontWeight: '500', color: '#fff' }}>{recentPR[0]}</Text></View><Text style={{ fontSize: 16, fontWeight: '700', color: '#f59e0b' }}>{recentPR[1]}kg</Text></View></Card>}
        {workoutHistory.length === 0 && !recentPR && <Card><Text style={{ fontSize: 14, color: '#71717a', textAlign: 'center', paddingVertical: 8 }}>Complete workouts to see trends & PRs</Text></Card>}
      </ScrollView>
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: '#09090b', borderTopWidth: 1, borderTopColor: '#27272a', paddingVertical: 16, paddingBottom: 32 }}><View style={{ flex: 1, alignItems: 'center' }}><Text style={{ fontSize: 18, color: '#fff', marginBottom: 4 }}>◆</Text><Text style={{ fontSize: 10, color: '#fff', fontWeight: '500' }}>Home</Text></View><TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={() => navigation.navigate('Progress')}><Text style={{ fontSize: 18, color: '#52525b', marginBottom: 4 }}>◈</Text><Text style={{ fontSize: 10, color: '#52525b' }}>Analytics</Text></TouchableOpacity></View>
      <Modal visible={showModal} transparent animationType="fade"><TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 24 }} activeOpacity={1} onPress={() => setShowModal(false)}><Card style={{ width: '100%', maxWidth: 320, padding: 24 }}><Text style={{ fontSize: 20, fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: 24 }}>Update Weight</Text><TextInput style={{ fontSize: 36, fontWeight: '700', color: '#fff', textAlign: 'center', paddingVertical: 16, borderBottomWidth: 2, borderBottomColor: '#27272a', marginBottom: 8 }} value={newWeight} onChangeText={setNewWeight} placeholder={userData.weight.toString()} placeholderTextColor="#52525b" keyboardType="numeric" autoFocus /><Text style={{ fontSize: 14, color: '#71717a', textAlign: 'center', marginBottom: 24 }}>kg</Text><Btn onPress={handleWeight} disabled={!newWeight}>Save</Btn></Card></TouchableOpacity></Modal>
    </SafeAreaView>
  );
};

export const ProgressScreen = ({ navigation }) => {
  const { workoutHistory, weightHistory, prs } = useStore();
  const [selectedEx, setSelectedEx] = useState(null);
  const [volFilter, setVolFilter] = useState(null); // null = all, or 'push'/'pull'/'legs'
  
  const totalWorkouts = workoutHistory.length;
  const totalSets = workoutHistory.reduce((s, w) => s + w.sets.length, 0);
  const totalVol = workoutHistory.reduce((s, w) => s + w.sets.reduce((x, y) => x + y.reps * y.weight, 0), 0);
  
  // Volume data filtered by type
  const filteredVol = getVolByType(workoutHistory, volFilter);
  const volData = filteredVol.map(w => w.vol);
  const volLabels = filteredVol.map(w => w.date);
  
  // Weight progress
  const weightData = weightHistory.map(w => w.weight);
  
  // Get exercise session data for selected exercise
  const getExData = (exName) => {
    // Find the exerciseId from workout history
    let exId = null;
    for (const w of workoutHistory) {
      const found = w.sets.find(s => s.exercise === exName);
      if (found?.exerciseId) { exId = found.exerciseId; break; }
    }
    return getExerciseSessions(workoutHistory, exId, exName);
  };
  
  const selectedData = selectedEx ? getExData(selectedEx) : [];
  const lastSession = selectedData.length > 0 ? selectedData[selectedData.length - 1] : null;
  
  // Workout count by type
  const countByType = { push: 0, pull: 0, legs: 0 };
  workoutHistory.forEach(w => { if (countByType[w.type] !== undefined) countByType[w.type]++; });
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#18181b' }}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={{ color: '#71717a', fontSize: 14, marginBottom: 16 }}>← Back</Text></TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#fff' }}>Analytics</Text>
      </View>
      <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Stats row */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
          <Card style={{ flex: 1, alignItems: 'center', padding: 12 }}><Text style={{ fontSize: 20, fontWeight: '700', color: '#fff' }}>{totalWorkouts}</Text><Text style={{ fontSize: 12, color: '#71717a' }}>workouts</Text></Card>
          <Card style={{ flex: 1, alignItems: 'center', padding: 12 }}><Text style={{ fontSize: 20, fontWeight: '700', color: '#fff' }}>{totalSets}</Text><Text style={{ fontSize: 12, color: '#71717a' }}>sets</Text></Card>
          <Card style={{ flex: 1, alignItems: 'center', padding: 12 }}><Text style={{ fontSize: 20, fontWeight: '700', color: '#fff' }}>{fmtNum(totalVol)}</Text><Text style={{ fontSize: 12, color: '#71717a' }}>kg lifted</Text></Card>
        </View>
        
        {/* Weight Progress */}
        {weightData.length >= 2 && <Card style={{ marginBottom: 16 }}><Text style={{ fontSize: 14, color: '#71717a', marginBottom: 12 }}>Body Weight</Text><LineChart data={weightData} h={100} /></Card>}
        
        {/* Volume by Workout Type */}
        {workoutHistory.length >= 2 && (
          <Card style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, color: '#71717a', marginBottom: 12 }}>Volume Trend</Text>
            <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
              {[{ k: null, l: 'All' }, { k: 'push', l: 'Push' }, { k: 'pull', l: 'Pull' }, { k: 'legs', l: 'Legs' }].map(t => (
                <TouchableOpacity key={t.l} onPress={() => setVolFilter(t.k)} style={{ flex: 1, paddingVertical: 6, borderRadius: 6, backgroundColor: volFilter === t.k ? '#27272a' : 'transparent', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, color: volFilter === t.k ? '#fff' : '#52525b', fontWeight: volFilter === t.k ? '600' : '400' }}>{t.l}</Text>
                  {t.k && <Text style={{ fontSize: 10, color: '#52525b' }}>{countByType[t.k]}</Text>}
                </TouchableOpacity>
              ))}
            </View>
            {volData.length >= 2 ? <TrendChart data={volData} h={120} showMA={true} labels={volLabels} /> : <Text style={{ color: '#52525b', fontSize: 14, textAlign: 'center', paddingVertical: 16 }}>Need more {volFilter || ''} workouts</Text>}
          </Card>
        )}
        
        {/* Personal Records - tappable for detail */}
        {Object.keys(prs).length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, color: '#71717a', marginBottom: 12 }}>Personal Records</Text>
            {Object.entries(prs).map(([ex, pr]) => (
              <Card key={ex} style={{ marginBottom: 8 }} onPress={() => setSelectedEx(selectedEx === ex ? null : ex)}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '500', color: '#fff' }}>{ex}</Text>
                    <Text style={{ fontSize: 12, color: '#52525b' }}>Tap for history</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#f59e0b' }}>{pr}kg</Text>
                    <Text style={{ fontSize: 10, color: '#52525b' }}>PR</Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}
        
        {/* Empty state */}
        {totalWorkouts === 0 && <Card><Text style={{ fontSize: 14, color: '#52525b', textAlign: 'center', paddingVertical: 16 }}>Complete workouts to see progress</Text></Card>}
      </ScrollView>
      
      {/* Bottom nav */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: '#09090b', borderTopWidth: 1, borderTopColor: '#27272a', paddingVertical: 16, paddingBottom: 32 }}>
        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={() => navigation.goBack()}><Text style={{ fontSize: 18, color: '#52525b', marginBottom: 4 }}>◆</Text><Text style={{ fontSize: 10, color: '#52525b' }}>Home</Text></TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}><Text style={{ fontSize: 18, color: '#fff', marginBottom: 4 }}>◈</Text><Text style={{ fontSize: 10, color: '#fff', fontWeight: '500' }}>Analytics</Text></View>
      </View>
      
      {/* Exercise Detail Modal */}
      <Modal visible={!!selectedEx} transparent animationType="slide">
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'flex-end' }} activeOpacity={1} onPress={() => setSelectedEx(null)}>
          <View style={{ backgroundColor: '#18181b', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '80%' }}>
            <View style={{ width: 48, height: 4, backgroundColor: '#3f3f46', borderRadius: 2, alignSelf: 'center', marginBottom: 16 }} />
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 4 }}>{selectedEx}</Text>
            {lastSession && (
              <View style={{ flexDirection: 'row', gap: 16, marginBottom: 16 }}>
                <View><Text style={{ fontSize: 12, color: '#52525b' }}>PR</Text><Text style={{ fontSize: 18, fontWeight: '700', color: '#f59e0b' }}>{prs[selectedEx]}kg</Text></View>
                <View><Text style={{ fontSize: 12, color: '#52525b' }}>Last</Text><Text style={{ fontSize: 18, fontWeight: '600', color: '#fff' }}>{lastSession.maxKg}kg × {lastSession.reps}</Text></View>
                <View><Text style={{ fontSize: 12, color: '#52525b' }}>Sessions</Text><Text style={{ fontSize: 18, fontWeight: '600', color: '#fff' }}>{selectedData.length}</Text></View>
              </View>
            )}
            <Text style={{ fontSize: 12, color: '#71717a', marginBottom: 8 }}>Max kg per session (dots) + 4-session trend (bars)</Text>
            {selectedData.length >= 2 ? (
              <TrendChart data={selectedData.map(s => s.maxKg)} h={140} showMA={true} labels={selectedData.map(s => s.date)} />
            ) : (
              <View style={{ height: 140, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: '#52525b', fontSize: 14 }}>Need 2+ sessions</Text></View>
            )}
            <Btn v="secondary" onPress={() => setSelectedEx(null)} style={{ marginTop: 16 }}>Close</Btn>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export const WorkoutScreen = ({ navigation, route }) => {
  const { type } = route.params;
  const { currentExercises, swapExercise } = useStore();
  const [selectedEx, setSelectedEx] = useState(null);
  const [swapIdx, setSwapIdx] = useState(null);
  const info = workoutTypes[type], totalSets = currentExercises.reduce((s, e) => s + e.sets, 0);
  const handleSwap = (i, id) => { swapExercise(i, id); setSwapIdx(null); };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#18181b' }}><TouchableOpacity onPress={() => navigation.goBack()}><Text style={{ color: '#71717a', fontSize: 14, marginBottom: 16 }}>← Back</Text></TouchableOpacity><View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}><View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: info.color }} /><View><Text style={{ fontSize: 20, fontWeight: '700', color: '#fff' }}>{info.name}</Text><Text style={{ fontSize: 14, color: '#71717a' }}>{info.subtitle}</Text></View></View></View>
      <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 16 }} showsVerticalScrollIndicator={false}>
        {currentExercises.map((ex, i) => { const data = exerciseDB[ex.id] || { name: ex.name || ex.id, muscles: ex.muscles || '' }; const hasAlts = alternatives[ex.id]?.length > 0; return <TouchableOpacity key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#18181b', gap: 12 }} onPress={() => setSelectedEx({ ...ex, ...data })}><View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#27272a', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#71717a', fontSize: 14 }}>{i + 1}</Text></View><View style={{ flex: 1 }}><Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>{data.name}</Text><Text style={{ color: '#71717a', fontSize: 14 }}>{ex.sets} × {ex.reps}</Text></View>{hasAlts && <TouchableOpacity style={{ backgroundColor: 'rgba(34,211,238,0.1)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 }} onPress={() => setSwapIdx(i)}><Text style={{ color: '#22d3ee', fontSize: 12, fontWeight: '500' }}>Swap</Text></TouchableOpacity>}</TouchableOpacity>; })}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#18181b', borderRadius: 12, paddingVertical: 16, marginTop: 16, marginBottom: 100 }}><View style={{ alignItems: 'center' }}><Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>{currentExercises.length}</Text><Text style={{ color: '#71717a', fontSize: 12 }}>exercises</Text></View><View style={{ alignItems: 'center' }}><Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>{totalSets}</Text><Text style={{ color: '#71717a', fontSize: 12 }}>sets</Text></View></View>
      </ScrollView>
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 40, backgroundColor: '#000', borderTopWidth: 1, borderTopColor: '#18181b' }}><Btn onPress={() => navigation.navigate('ActiveWorkout', { type })}>Start Workout</Btn></View>
      <Modal visible={!!selectedEx} transparent animationType="slide"><TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'flex-end' }} activeOpacity={1} onPress={() => setSelectedEx(null)}><View style={{ backgroundColor: '#18181b', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 }}><View style={{ width: 48, height: 4, backgroundColor: '#3f3f46', borderRadius: 2, alignSelf: 'center', marginBottom: 24 }} /><Text style={{ fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 8 }}>{selectedEx?.name}</Text><Text style={{ fontSize: 14, color: '#10b981', marginBottom: 16 }}>{selectedEx?.muscles}</Text>{selectedEx?.cues && <><Text style={{ fontSize: 14, color: '#71717a', marginBottom: 8 }}>Tips</Text>{selectedEx.cues.map((c, i) => <Text key={i} style={{ fontSize: 14, color: '#d4d4d8', marginBottom: 4 }}>• {c}</Text>)}</>}<Btn v="secondary" onPress={() => setSelectedEx(null)} style={{ marginTop: 16 }}>Close</Btn></View></TouchableOpacity></Modal>
      <Modal visible={swapIdx !== null} transparent animationType="slide"><TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'flex-end' }} activeOpacity={1} onPress={() => setSwapIdx(null)}><View style={{ backgroundColor: '#18181b', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '70%' }}><View style={{ width: 48, height: 4, backgroundColor: '#3f3f46', borderRadius: 2, alignSelf: 'center', marginBottom: 24 }} /><Text style={{ fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 16 }}>Swap Exercise</Text><ScrollView style={{ maxHeight: 300, marginBottom: 16 }}>{swapIdx !== null && (alternatives[currentExercises[swapIdx]?.id] || []).map((altId) => { const alt = exerciseDB[altId]; return <TouchableOpacity key={altId} style={{ backgroundColor: '#27272a', borderRadius: 12, padding: 16, marginBottom: 8 }} onPress={() => handleSwap(swapIdx, altId)}><Text style={{ color: '#fff', fontSize: 16, fontWeight: '500', marginBottom: 4 }}>{alt.name}</Text><Text style={{ color: '#71717a', fontSize: 14 }}>{alt.muscles}</Text></TouchableOpacity>; })}</ScrollView><Btn v="ghost" onPress={() => setSwapIdx(null)}>Cancel</Btn></View></TouchableOpacity></Modal>
    </SafeAreaView>
  );
};

export const ActiveWorkoutScreen = ({ navigation, route }) => {
  const { type } = route.params;
  const { currentExercises, completeWorkout } = useStore();
  const [logged, setLogged] = useState([]);
  const [completedSets, setCompletedSets] = useState({});
  const [activeEx, setActiveEx] = useState(null);
  const [activeSet, setActiveSet] = useState(1);
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [resting, setResting] = useState(false);
  const [restTime, setRestTime] = useState(60);
  const totalSets = currentExercises.reduce((s, e) => s + e.sets, 0), progress = totalSets > 0 ? (logged.length / totalSets) * 100 : 0;
  useEffect(() => { let t; if (resting && restTime > 0) t = setTimeout(() => setRestTime(r => r - 1), 1000); else if (restTime === 0 && resting) { setResting(false); setRestTime(60); } return () => clearTimeout(t); }, [resting, restTime]);
  const handleSelect = (ex, idx) => { const done = completedSets[idx] || 0; if (done >= ex.sets) return; setActiveEx({ ...ex, idx }); setActiveSet(done + 1); setReps(''); setWeight(''); };
  const handleLog = () => { if (!reps || !weight || !activeEx) return; const data = exerciseDB[activeEx.id] || { name: activeEx.name || activeEx.id }; const newLog = { exercise: data.name, exerciseId: activeEx.id, set: activeSet, reps: parseInt(reps), weight: parseFloat(weight) }; const newLogged = [...logged, newLog]; setLogged(newLogged); const newCompleted = { ...completedSets, [activeEx.idx]: (completedSets[activeEx.idx] || 0) + 1 }; setCompletedSets(newCompleted); const totalDone = Object.values(newCompleted).reduce((a, b) => a + b, 0); if (totalDone >= totalSets) { completeWorkout(newLogged); navigation.replace('WorkoutComplete'); } else { setActiveEx(null); setResting(true); } };
  const isComplete = (i, ex) => (completedSets[i] || 0) >= ex.sets;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16 }}><View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}><Text style={{ color: '#71717a', fontSize: 14 }}>{logged.length} / {totalSets} sets</Text><Text style={{ color: '#71717a', fontSize: 14 }}>{Math.round(progress)}%</Text></View><View style={{ height: 4, backgroundColor: '#27272a', borderRadius: 2, overflow: 'hidden' }}><View style={{ height: '100%', width: `${progress}%`, backgroundColor: '#10b981', borderRadius: 2 }} /></View></View>
      {resting && !activeEx ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}><Text style={{ color: '#71717a', fontSize: 14, marginBottom: 8 }}>REST</Text><Text style={{ color: '#fff', fontSize: 56, fontWeight: '700', fontVariant: ['tabular-nums'], marginBottom: 24 }}>{fmtTime(restTime)}</Text><Btn v="ghost" sz="sm" onPress={() => { setResting(false); setRestTime(60); }}>Skip</Btn><Text style={{ color: '#52525b', fontSize: 14, marginTop: 32 }}>Tap an exercise below to continue</Text></View> : activeEx ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}><Text style={{ color: '#71717a', fontSize: 12, letterSpacing: 1, marginBottom: 8 }}>SET {activeSet} OF {activeEx.sets}</Text><Text style={{ color: '#fff', fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 8 }}>{exerciseDB[activeEx.id]?.name || activeEx.id}</Text><Text style={{ color: '#71717a', fontSize: 14, marginBottom: 32 }}>Target: {activeEx.reps}</Text><View style={{ flexDirection: 'row', gap: 16, width: '100%', maxWidth: 280, marginBottom: 24 }}><View style={{ flex: 1 }}><Text style={{ color: '#52525b', fontSize: 12, textAlign: 'center', marginBottom: 8 }}>REPS</Text><TextInput style={{ backgroundColor: '#18181b', borderWidth: 1, borderColor: '#27272a', borderRadius: 12, paddingVertical: 16, fontSize: 28, fontWeight: '700', color: '#fff', textAlign: 'center' }} value={reps} onChangeText={setReps} placeholder="10" placeholderTextColor="#52525b" keyboardType="numeric" /></View><View style={{ flex: 1 }}><Text style={{ color: '#52525b', fontSize: 12, textAlign: 'center', marginBottom: 8 }}>KG</Text><TextInput style={{ backgroundColor: '#18181b', borderWidth: 1, borderColor: '#27272a', borderRadius: 12, paddingVertical: 16, fontSize: 28, fontWeight: '700', color: '#fff', textAlign: 'center' }} value={weight} onChangeText={setWeight} placeholder="20" placeholderTextColor="#52525b" keyboardType="numeric" /></View></View><Btn onPress={handleLog} disabled={!reps || !weight} style={{ width: '100%', maxWidth: 280 }}>Log Set</Btn><TouchableOpacity onPress={() => setActiveEx(null)}><Text style={{ color: '#52525b', fontSize: 14, marginTop: 16 }}>Cancel</Text></TouchableOpacity></View> : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#a1a1aa', fontSize: 14 }}>Tap any exercise to log</Text></View>}
      <ScrollView style={{ maxHeight: '45%', paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: '#18181b' }}>{currentExercises.map((ex, i) => { const data = exerciseDB[ex.id] || { name: ex.name || ex.id }; const done = completedSets[i] || 0; const complete = isComplete(i, ex); return <TouchableOpacity key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#18181b', gap: 12, opacity: complete ? 0.4 : 1 }} onPress={() => handleSelect(ex, i)} disabled={complete}><View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: complete ? '#10b981' : '#27272a', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: complete ? '#000' : '#71717a', fontSize: 14, fontWeight: '500' }}>{complete ? '✓' : i + 1}</Text></View><View style={{ flex: 1 }}><Text style={[{ color: '#fff', fontSize: 15, fontWeight: '500' }, complete && { color: '#71717a', textDecorationLine: 'line-through' }]}>{data.name}</Text><Text style={{ color: '#52525b', fontSize: 13 }}>{done}/{ex.sets} sets</Text></View></TouchableOpacity>; })}</ScrollView>
      <View style={{ padding: 16, paddingBottom: 32, backgroundColor: '#09090b', borderTopWidth: 1, borderTopColor: '#27272a', alignItems: 'center' }}><TouchableOpacity onPress={() => navigation.goBack()}><Text style={{ color: '#71717a', fontSize: 14 }}>End Workout</Text></TouchableOpacity></View>
    </SafeAreaView>
  );
};

export const WorkoutCompleteScreen = ({ navigation }) => {
  const { userData, currentSets } = useStore();
  const totalVol = calcVolume(currentSets);
  const handleDone = () => navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
      <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}><Text style={{ fontSize: 36, color: '#000' }}>✓</Text></View>
      <Text style={{ fontSize: 28, fontWeight: '700', color: '#fff', marginBottom: 8, textAlign: 'center' }}>Great work, {userData.name}!</Text>
      <Text style={{ fontSize: 16, color: '#71717a', marginBottom: 32 }}>Workout complete.</Text>
      <View style={{ flexDirection: 'row', gap: 48, marginBottom: 40 }}><View style={{ alignItems: 'center' }}><Text style={{ fontSize: 32, fontWeight: '700', color: '#fff' }}>{currentSets.length}</Text><Text style={{ fontSize: 14, color: '#71717a' }}>sets</Text></View><View style={{ alignItems: 'center' }}><Text style={{ fontSize: 32, fontWeight: '700', color: '#fff' }}>{fmtNum(totalVol)}</Text><Text style={{ fontSize: 14, color: '#71717a' }}>kg</Text></View></View>
      <Btn onPress={handleDone} style={{ width: '100%', maxWidth: 280 }}>Done</Btn>
    </SafeAreaView>
  );
};
