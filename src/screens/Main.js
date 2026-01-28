import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, SafeAreaView, StyleSheet } from 'react-native';
import { Button, Card, MiniChart, LineChart } from '../components';
import { useStore } from '../store';
import { workoutTypes, workoutTemplates } from '../data';
import { formatNumber } from '../utils';

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  nav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: '#09090b', borderTopWidth: 1, borderTopColor: '#27272a', paddingVertical: 16, paddingBottom: 32 },
  navItem: { flex: 1, alignItems: 'center' },
});

export const HomeScreen = ({ navigation }) => {
  const { userData, streak, workoutHistory, prs, startWorkout, updateWeight, getNextWorkoutType } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');

  const suggested = getNextWorkoutType();
  const info = workoutTypes[suggested];
  const totalSets = workoutTemplates[suggested].reduce((sum, ex) => sum + ex.sets, 0);
  const prList = Object.entries(prs);
  const recentPR = prList.length > 0 ? prList[prList.length - 1] : null;
  const volData = workoutHistory.slice(-7).map(w => w.sets.reduce((s, x) => s + x.reps * x.weight, 0));

  const handleStart = (type) => { startWorkout(type); navigation.navigate('Workout', { type }); };
  const handleWeight = () => { if (newWeight) { updateWeight(parseFloat(newWeight)); setNewWeight(''); setShowModal(false); } };

  return (
    <SafeAreaView style={s.container}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <View><Text style={{ fontSize: 14, color: '#71717a' }}>Welcome back,</Text><Text style={{ fontSize: 24, fontWeight: '700', color: '#fff' }}>{userData.name}</Text></View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#18181b', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#27272a' }}>
            <Text>🔥</Text><Text style={{ color: '#fff', fontWeight: '700' }}>{streak}</Text>
          </View>
        </View>

        <Text style={{ fontSize: 12, color: '#71717a', letterSpacing: 1, marginBottom: 8 }}>SUGGESTED</Text>
        <Card style={{ marginBottom: 16, padding: 0, overflow: 'hidden' }} onPress={() => handleStart(suggested)}>
          <View style={{ padding: 16, paddingBottom: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: info.color }} />
              <View><Text style={{ fontSize: 18, fontWeight: '700', color: '#fff' }}>{info.name}</Text><Text style={{ fontSize: 14, color: '#71717a' }}>{info.subtitle}</Text></View>
            </View>
            <Text style={{ fontSize: 14, color: '#71717a' }}>{workoutTemplates[suggested].length} exercises · {totalSets} sets</Text>
          </View>
          <View style={{ backgroundColor: '#fff', paddingVertical: 12, alignItems: 'center' }}><Text style={{ color: '#000', fontWeight: '600' }}>Start →</Text></View>
        </Card>

        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          {['push', 'pull', 'legs', 'cardio'].map((type) => (
            <TouchableOpacity key={type} style={{ flex: 1, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: type === suggested ? '#10b981' : '#27272a', alignItems: 'center' }} onPress={() => handleStart(type)}>
              <Text style={{ fontSize: 12, fontWeight: '500', color: type === suggested ? '#10b981' : '#a1a1aa' }}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
          <Card style={{ flex: 1, padding: 12 }} onPress={() => setShowModal(true)}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ fontSize: 12, color: '#71717a' }}>Weight</Text><Text style={{ fontSize: 12, color: '#10b981' }}>Edit</Text></View>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff' }}>{userData.weight}kg</Text>
          </Card>
          <Card style={{ flex: 1, padding: 12 }} onPress={() => navigation.navigate('Progress')}>
            <Text style={{ fontSize: 12, color: '#71717a' }}>Workouts</Text>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff' }}>{workoutHistory.length}</Text>
          </Card>
        </View>

        {volData.length >= 2 && (
          <Card style={{ marginBottom: 12 }} onPress={() => navigation.navigate('Progress')}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}><Text style={{ fontSize: 14, color: '#71717a' }}>Volume Trend</Text><Text style={{ color: '#52525b' }}>→</Text></View>
            <MiniChart data={volData} height={50} />
          </Card>
        )}

        {recentPR && (
          <Card onPress={() => navigation.navigate('Progress')}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 40, height: 40, backgroundColor: 'rgba(245,158,11,0.2)', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}><Text>🏆</Text></View>
              <View style={{ flex: 1 }}><Text style={{ fontSize: 12, color: '#71717a' }}>Recent PR</Text><Text style={{ fontSize: 14, fontWeight: '500', color: '#fff' }}>{recentPR[0]}</Text></View>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#f59e0b' }}>{recentPR[1]}kg</Text>
            </View>
          </Card>
        )}

        {workoutHistory.length === 0 && !recentPR && <Card><Text style={{ fontSize: 14, color: '#71717a', textAlign: 'center', paddingVertical: 8 }}>Complete workouts to see trends & PRs</Text></Card>}
      </ScrollView>

      <View style={s.nav}>
        <View style={s.navItem}><Text style={{ fontSize: 18, color: '#fff', marginBottom: 4 }}>◆</Text><Text style={{ fontSize: 10, color: '#fff', fontWeight: '500' }}>Home</Text></View>
        <TouchableOpacity style={s.navItem} onPress={() => navigation.navigate('Progress')}><Text style={{ fontSize: 18, color: '#52525b', marginBottom: 4 }}>◈</Text><Text style={{ fontSize: 10, color: '#52525b' }}>Analytics</Text></TouchableOpacity>
      </View>

      <Modal visible={showModal} transparent animationType="fade">
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 24 }} activeOpacity={1} onPress={() => setShowModal(false)}>
          <Card style={{ width: '100%', maxWidth: 320, padding: 24 }}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: 24 }}>Update Weight</Text>
            <TextInput style={{ fontSize: 36, fontWeight: '700', color: '#fff', textAlign: 'center', paddingVertical: 16, borderBottomWidth: 2, borderBottomColor: '#27272a', marginBottom: 8 }} value={newWeight} onChangeText={setNewWeight} placeholder={userData.weight.toString()} placeholderTextColor="#52525b" keyboardType="numeric" autoFocus />
            <Text style={{ fontSize: 14, color: '#71717a', textAlign: 'center', marginBottom: 24 }}>kg</Text>
            <Button onPress={handleWeight} disabled={!newWeight}>Save</Button>
          </Card>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export const ProgressScreen = ({ navigation }) => {
  const { userData, workoutHistory, weightHistory, prs } = useStore();
  const [selectedEx, setSelectedEx] = useState(null);

  const totalWorkouts = workoutHistory.length;
  const totalSets = workoutHistory.reduce((sum, w) => sum + w.sets.length, 0);
  const totalVol = workoutHistory.reduce((sum, w) => sum + w.sets.reduce((s, x) => s + x.reps * x.weight, 0), 0);

  const exHistory = {};
  workoutHistory.forEach(w => w.sets.forEach(s => { if (!exHistory[s.exercise]) exHistory[s.exercise] = []; exHistory[s.exercise].push({ weight: s.weight }); }));
  const volData = workoutHistory.map(w => w.sets.reduce((s, x) => s + x.reps * x.weight, 0));
  const weightData = weightHistory.map(w => w.weight);

  return (
    <SafeAreaView style={s.container}>
      <View style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#18181b' }}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={{ color: '#71717a', fontSize: 14, marginBottom: 16 }}>← Back</Text></TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#fff' }}>Analytics</Text>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
          <Card style={{ flex: 1, alignItems: 'center', padding: 12 }}><Text style={{ fontSize: 20, fontWeight: '700', color: '#fff' }}>{totalWorkouts}</Text><Text style={{ fontSize: 12, color: '#71717a' }}>workouts</Text></Card>
          <Card style={{ flex: 1, alignItems: 'center', padding: 12 }}><Text style={{ fontSize: 20, fontWeight: '700', color: '#fff' }}>{totalSets}</Text><Text style={{ fontSize: 12, color: '#71717a' }}>sets</Text></Card>
          <Card style={{ flex: 1, alignItems: 'center', padding: 12 }}><Text style={{ fontSize: 20, fontWeight: '700', color: '#fff' }}>{formatNumber(totalVol)}</Text><Text style={{ fontSize: 12, color: '#71717a' }}>kg</Text></Card>
        </View>

        {weightData.length >= 2 && <Card style={{ marginBottom: 16 }}><Text style={{ fontSize: 14, color: '#71717a', marginBottom: 12 }}>Weight Progress</Text><LineChart data={weightData} height={100} /></Card>}
        {volData.length >= 2 && <Card style={{ marginBottom: 16 }}><Text style={{ fontSize: 14, color: '#71717a', marginBottom: 12 }}>Volume per Workout</Text><LineChart data={volData} height={100} /></Card>}

        {Object.keys(prs).length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, color: '#71717a', marginBottom: 12 }}>Personal Records</Text>
            {Object.entries(prs).map(([ex, pr]) => (
              <Card key={ex} style={{ marginBottom: 8 }} onPress={() => setSelectedEx(selectedEx === ex ? null : ex)}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 15, fontWeight: '500', color: '#fff' }}>{ex}</Text>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#f59e0b' }}>{pr}kg</Text>
                </View>
              </Card>
            ))}
          </View>
        )}

        {selectedEx && exHistory[selectedEx] && <Card style={{ marginBottom: 16 }}><Text style={{ fontSize: 14, color: '#fff', marginBottom: 8 }}>{selectedEx}</Text><LineChart data={exHistory[selectedEx].map(x => x.weight)} height={80} /></Card>}
        {totalWorkouts === 0 && <Card><Text style={{ fontSize: 14, color: '#52525b', textAlign: 'center', paddingVertical: 16 }}>Complete workouts to see progress</Text></Card>}
      </ScrollView>

      <View style={s.nav}>
        <TouchableOpacity style={s.navItem} onPress={() => navigation.goBack()}><Text style={{ fontSize: 18, color: '#52525b', marginBottom: 4 }}>◆</Text><Text style={{ fontSize: 10, color: '#52525b' }}>Home</Text></TouchableOpacity>
        <View style={s.navItem}><Text style={{ fontSize: 18, color: '#fff', marginBottom: 4 }}>◈</Text><Text style={{ fontSize: 10, color: '#fff', fontWeight: '500' }}>Analytics</Text></View>
      </View>
    </SafeAreaView>
  );
};
