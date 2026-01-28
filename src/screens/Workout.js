import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, SafeAreaView, StyleSheet } from 'react-native';
import { Button, Card } from '../components';
import { useStore } from '../store';
import { exerciseDB, alternatives, workoutTypes } from '../data';
import { formatTime, formatNumber, calculateVolume } from '../utils';

export const WorkoutScreen = ({ navigation, route }) => {
  const { type } = route.params;
  const { currentExercises, swapExercise } = useStore();
  const [selectedEx, setSelectedEx] = useState(null);
  const [swapIdx, setSwapIdx] = useState(null);

  const info = workoutTypes[type];
  const totalSets = currentExercises.reduce((s, e) => s + e.sets, 0);

  const handleSwap = (idx, newId) => { swapExercise(idx, newId); setSwapIdx(null); };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#18181b' }}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={{ color: '#71717a', fontSize: 14, marginBottom: 16 }}>← Back</Text></TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: info.color }} />
          <View><Text style={{ fontSize: 20, fontWeight: '700', color: '#fff' }}>{info.name}</Text><Text style={{ fontSize: 14, color: '#71717a' }}>{info.subtitle}</Text></View>
        </View>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 16 }} showsVerticalScrollIndicator={false}>
        {currentExercises.map((ex, i) => {
          const data = exerciseDB[ex.id] || { name: ex.name || ex.id, muscles: ex.muscles || '' };
          const hasAlts = alternatives[ex.id]?.length > 0;
          return (
            <TouchableOpacity key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#18181b', gap: 12 }} onPress={() => setSelectedEx({ ...ex, ...data })}>
              <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#27272a', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#71717a', fontSize: 14 }}>{i + 1}</Text></View>
              <View style={{ flex: 1 }}><Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>{data.name}</Text><Text style={{ color: '#71717a', fontSize: 14 }}>{ex.sets} × {ex.reps}</Text></View>
              {hasAlts && <TouchableOpacity style={{ backgroundColor: 'rgba(34,211,238,0.1)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 }} onPress={() => setSwapIdx(i)}><Text style={{ color: '#22d3ee', fontSize: 12, fontWeight: '500' }}>Swap</Text></TouchableOpacity>}
            </TouchableOpacity>
          );
        })}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#18181b', borderRadius: 12, paddingVertical: 16, marginTop: 16, marginBottom: 100 }}>
          <View style={{ alignItems: 'center' }}><Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>{currentExercises.length}</Text><Text style={{ color: '#71717a', fontSize: 12 }}>exercises</Text></View>
          <View style={{ alignItems: 'center' }}><Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>{totalSets}</Text><Text style={{ color: '#71717a', fontSize: 12 }}>sets</Text></View>
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 40, backgroundColor: '#000', borderTopWidth: 1, borderTopColor: '#18181b' }}>
        <Button onPress={() => navigation.navigate('ActiveWorkout', { type })}>Start Workout</Button>
      </View>

      <Modal visible={!!selectedEx} transparent animationType="slide">
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'flex-end' }} activeOpacity={1} onPress={() => setSelectedEx(null)}>
          <View style={{ backgroundColor: '#18181b', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 }}>
            <View style={{ width: 48, height: 4, backgroundColor: '#3f3f46', borderRadius: 2, alignSelf: 'center', marginBottom: 24 }} />
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 8 }}>{selectedEx?.name}</Text>
            <Text style={{ fontSize: 14, color: '#10b981', marginBottom: 16 }}>{selectedEx?.muscles}</Text>
            {selectedEx?.cues && <><Text style={{ fontSize: 14, color: '#71717a', marginBottom: 8 }}>Tips</Text>{selectedEx.cues.map((c, i) => <Text key={i} style={{ fontSize: 14, color: '#d4d4d8', marginBottom: 4 }}>• {c}</Text>)}</>}
            <Button variant="secondary" onPress={() => setSelectedEx(null)} style={{ marginTop: 16 }}>Close</Button>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={swapIdx !== null} transparent animationType="slide">
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'flex-end' }} activeOpacity={1} onPress={() => setSwapIdx(null)}>
          <View style={{ backgroundColor: '#18181b', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '70%' }}>
            <View style={{ width: 48, height: 4, backgroundColor: '#3f3f46', borderRadius: 2, alignSelf: 'center', marginBottom: 24 }} />
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 16 }}>Swap Exercise</Text>
            <ScrollView style={{ maxHeight: 300, marginBottom: 16 }}>
              {swapIdx !== null && (alternatives[currentExercises[swapIdx]?.id] || []).map((altId) => {
                const alt = exerciseDB[altId];
                return (
                  <TouchableOpacity key={altId} style={{ backgroundColor: '#27272a', borderRadius: 12, padding: 16, marginBottom: 8 }} onPress={() => handleSwap(swapIdx, altId)}>
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500', marginBottom: 4 }}>{alt.name}</Text>
                    <Text style={{ color: '#71717a', fontSize: 14 }}>{alt.muscles}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <Button variant="ghost" onPress={() => setSwapIdx(null)}>Cancel</Button>
          </View>
        </TouchableOpacity>
      </Modal>
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

  const totalSets = currentExercises.reduce((s, e) => s + e.sets, 0);
  const progress = totalSets > 0 ? (logged.length / totalSets) * 100 : 0;

  useEffect(() => {
    let t;
    if (resting && restTime > 0) t = setTimeout(() => setRestTime(r => r - 1), 1000);
    else if (restTime === 0 && resting) { setResting(false); setRestTime(60); }
    return () => clearTimeout(t);
  }, [resting, restTime]);

  const handleSelect = (ex, idx) => {
    const done = completedSets[idx] || 0;
    if (done >= ex.sets) return;
    setActiveEx({ ...ex, idx });
    setActiveSet(done + 1);
    setReps(''); setWeight('');
  };

  const handleLog = () => {
    if (!reps || !weight || !activeEx) return;
    const data = exerciseDB[activeEx.id] || { name: activeEx.name || activeEx.id };
    const newLog = { exercise: data.name, exerciseId: activeEx.id, set: activeSet, reps: parseInt(reps), weight: parseFloat(weight) };
    const newLogged = [...logged, newLog];
    setLogged(newLogged);
    const newCompleted = { ...completedSets, [activeEx.idx]: (completedSets[activeEx.idx] || 0) + 1 };
    setCompletedSets(newCompleted);
    const totalDone = Object.values(newCompleted).reduce((a, b) => a + b, 0);
    if (totalDone >= totalSets) { completeWorkout(newLogged); navigation.replace('WorkoutComplete'); }
    else { setActiveEx(null); setResting(true); }
  };

  const isComplete = (idx, ex) => (completedSets[idx] || 0) >= ex.sets;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ color: '#71717a', fontSize: 14 }}>{logged.length} / {totalSets} sets</Text>
          <Text style={{ color: '#71717a', fontSize: 14 }}>{Math.round(progress)}%</Text>
        </View>
        <View style={{ height: 4, backgroundColor: '#27272a', borderRadius: 2, overflow: 'hidden' }}>
          <View style={{ height: '100%', width: `${progress}%`, backgroundColor: '#10b981', borderRadius: 2 }} />
        </View>
      </View>

      {resting && !activeEx ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
          <Text style={{ color: '#71717a', fontSize: 14, marginBottom: 8 }}>REST</Text>
          <Text style={{ color: '#fff', fontSize: 56, fontWeight: '700', fontVariant: ['tabular-nums'], marginBottom: 24 }}>{formatTime(restTime)}</Text>
          <Button variant="ghost" size="small" onPress={() => { setResting(false); setRestTime(60); }}>Skip</Button>
          <Text style={{ color: '#52525b', fontSize: 14, marginTop: 32 }}>Tap an exercise below to continue</Text>
        </View>
      ) : activeEx ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
          <Text style={{ color: '#71717a', fontSize: 12, letterSpacing: 1, marginBottom: 8 }}>SET {activeSet} OF {activeEx.sets}</Text>
          <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 8 }}>{exerciseDB[activeEx.id]?.name || activeEx.id}</Text>
          <Text style={{ color: '#71717a', fontSize: 14, marginBottom: 32 }}>Target: {activeEx.reps}</Text>
          <View style={{ flexDirection: 'row', gap: 16, width: '100%', maxWidth: 280, marginBottom: 24 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#52525b', fontSize: 12, textAlign: 'center', marginBottom: 8 }}>REPS</Text>
              <TextInput style={{ backgroundColor: '#18181b', borderWidth: 1, borderColor: '#27272a', borderRadius: 12, paddingVertical: 16, fontSize: 28, fontWeight: '700', color: '#fff', textAlign: 'center' }} value={reps} onChangeText={setReps} placeholder="10" placeholderTextColor="#52525b" keyboardType="numeric" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#52525b', fontSize: 12, textAlign: 'center', marginBottom: 8 }}>KG</Text>
              <TextInput style={{ backgroundColor: '#18181b', borderWidth: 1, borderColor: '#27272a', borderRadius: 12, paddingVertical: 16, fontSize: 28, fontWeight: '700', color: '#fff', textAlign: 'center' }} value={weight} onChangeText={setWeight} placeholder="20" placeholderTextColor="#52525b" keyboardType="numeric" />
            </View>
          </View>
          <Button onPress={handleLog} disabled={!reps || !weight} style={{ width: '100%', maxWidth: 280 }}>Log Set</Button>
          <TouchableOpacity onPress={() => setActiveEx(null)}><Text style={{ color: '#52525b', fontSize: 14, marginTop: 16 }}>Cancel</Text></TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#a1a1aa', fontSize: 14 }}>Tap any exercise to log</Text></View>
      )}

      <ScrollView style={{ maxHeight: '45%', paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: '#18181b' }}>
        {currentExercises.map((ex, i) => {
          const data = exerciseDB[ex.id] || { name: ex.name || ex.id };
          const done = completedSets[i] || 0;
          const complete = isComplete(i, ex);
          return (
            <TouchableOpacity key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#18181b', gap: 12, opacity: complete ? 0.4 : 1 }} onPress={() => handleSelect(ex, i)} disabled={complete}>
              <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: complete ? '#10b981' : '#27272a', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: complete ? '#000' : '#71717a', fontSize: 14, fontWeight: '500' }}>{complete ? '✓' : i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[{ color: '#fff', fontSize: 15, fontWeight: '500' }, complete && { color: '#71717a', textDecorationLine: 'line-through' }]}>{data.name}</Text>
                <Text style={{ color: '#52525b', fontSize: 13 }}>{done}/{ex.sets} sets</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={{ padding: 16, paddingBottom: 32, backgroundColor: '#09090b', borderTopWidth: 1, borderTopColor: '#27272a', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={{ color: '#71717a', fontSize: 14 }}>End Workout</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export const WorkoutCompleteScreen = ({ navigation }) => {
  const { userData, currentSets } = useStore();
  const totalVol = calculateVolume(currentSets);
  const handleDone = () => navigation.reset({ index: 0, routes: [{ name: 'Home' }] });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
      <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}><Text style={{ fontSize: 36, color: '#000' }}>✓</Text></View>
      <Text style={{ fontSize: 28, fontWeight: '700', color: '#fff', marginBottom: 8, textAlign: 'center' }}>Great work, {userData.name}!</Text>
      <Text style={{ fontSize: 16, color: '#71717a', marginBottom: 32 }}>Workout complete.</Text>
      <View style={{ flexDirection: 'row', gap: 48, marginBottom: 40 }}>
        <View style={{ alignItems: 'center' }}><Text style={{ fontSize: 32, fontWeight: '700', color: '#fff' }}>{currentSets.length}</Text><Text style={{ fontSize: 14, color: '#71717a' }}>sets</Text></View>
        <View style={{ alignItems: 'center' }}><Text style={{ fontSize: 32, fontWeight: '700', color: '#fff' }}>{formatNumber(totalVol)}</Text><Text style={{ fontSize: 14, color: '#71717a' }}>kg</Text></View>
      </View>
      <Button onPress={handleDone} style={{ width: '100%', maxWidth: 280 }}>Done</Button>
    </SafeAreaView>
  );
};
