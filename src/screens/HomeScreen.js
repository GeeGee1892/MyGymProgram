import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Button, Card, MiniChart } from '../components';
import { useStore } from '../hooks/useStore';
import { workoutTypes, workoutTemplates } from '../data/workouts';

const HomeScreen = ({ navigation }) => {
  const { userData, streak, workoutHistory, prs, startWorkout, updateWeight, getNextWorkoutType } = useStore();
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');

  const suggestedType = getNextWorkoutType();
  const suggestedInfo = workoutTypes[suggestedType];
  const totalSets = workoutTemplates[suggestedType].reduce((sum, ex) => sum + ex.sets, 0);

  // Get recent PR
  const prList = Object.entries(prs);
  const recentPR = prList.length > 0 ? prList[prList.length - 1] : null;

  // Volume data for mini chart
  const volData = workoutHistory.slice(-7).map(w => 
    w.sets.reduce((sum, s) => sum + s.reps * s.weight, 0)
  );

  const handleStartWorkout = (type) => {
    startWorkout(type);
    navigation.navigate('Workout', { type });
  };

  const handleWeightUpdate = () => {
    if (newWeight) {
      updateWeight(parseFloat(newWeight));
      setNewWeight('');
      setShowWeightModal(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.nameText}>{userData.name}</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakIcon}>🔥</Text>
            <Text style={styles.streakText}>{streak}</Text>
          </View>
        </View>

        {/* Suggested Workout */}
        <Text style={styles.sectionLabel}>SUGGESTED</Text>
        <Card style={styles.workoutCard} onPress={() => handleStartWorkout(suggestedType)}>
          <View style={styles.workoutHeader}>
            <View style={[styles.workoutIcon, { backgroundColor: suggestedInfo.color }]} />
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutName}>{suggestedInfo.name}</Text>
              <Text style={styles.workoutSubtitle}>{suggestedInfo.subtitle}</Text>
            </View>
          </View>
          <Text style={styles.workoutMeta}>
            {workoutTemplates[suggestedType].length} exercises · {totalSets} sets
          </Text>
          <View style={styles.startButton}>
            <Text style={styles.startButtonText}>Start →</Text>
          </View>
        </Card>

        {/* Quick Select */}
        <View style={styles.quickSelect}>
          {['push', 'pull', 'legs', 'cardio'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.quickButton, type === suggestedType && styles.quickButtonActive]}
              onPress={() => handleStartWorkout(type)}
            >
              <Text style={[styles.quickButtonText, type === suggestedType && styles.quickButtonTextActive]}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard} onPress={() => setShowWeightModal(true)}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>Weight</Text>
              <Text style={styles.editText}>Edit</Text>
            </View>
            <Text style={styles.statValue}>{userData.weight}kg</Text>
          </Card>
          <Card style={styles.statCard} onPress={() => navigation.navigate('Progress')}>
            <Text style={styles.statLabel}>Workouts</Text>
            <Text style={styles.statValue}>{workoutHistory.length}</Text>
          </Card>
        </View>

        {/* Volume Trend */}
        {volData.length >= 2 && (
          <Card style={styles.chartCard} onPress={() => navigation.navigate('Progress')}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartLabel}>Volume Trend</Text>
              <Text style={styles.chartArrow}>→</Text>
            </View>
            <MiniChart data={volData} height={50} />
          </Card>
        )}

        {/* Recent PR */}
        {recentPR && (
          <Card onPress={() => navigation.navigate('Progress')}>
            <View style={styles.prRow}>
              <View style={styles.prIcon}>
                <Text>🏆</Text>
              </View>
              <View style={styles.prInfo}>
                <Text style={styles.prLabel}>Recent PR</Text>
                <Text style={styles.prExercise}>{recentPR[0]}</Text>
              </View>
              <Text style={styles.prWeight}>{recentPR[1]}kg</Text>
            </View>
          </Card>
        )}

        {workoutHistory.length === 0 && !recentPR && (
          <Card>
            <Text style={styles.emptyText}>Complete workouts to see trends & PRs</Text>
          </Card>
        )}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconActive}>◆</Text>
          <Text style={styles.navLabelActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Progress')}>
          <Text style={styles.navIcon}>◈</Text>
          <Text style={styles.navLabel}>Analytics</Text>
        </TouchableOpacity>
      </View>

      {/* Weight Modal */}
      <Modal visible={showWeightModal} transparent animationType="fade">
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowWeightModal(false)}
        >
          <Card style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Weight</Text>
            <TextInput
              style={styles.modalInput}
              value={newWeight}
              onChangeText={setNewWeight}
              placeholder={userData.weight.toString()}
              placeholderTextColor="#52525b"
              keyboardType="numeric"
              autoFocus
            />
            <Text style={styles.modalUnit}>kg</Text>
            <Button onPress={handleWeightUpdate} disabled={!newWeight}>
              Save
            </Button>
          </Card>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 14,
    color: '#71717a',
  },
  nameText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#18181b',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  streakIcon: {
    fontSize: 14,
  },
  streakText: {
    color: '#fff',
    fontWeight: '700',
  },
  sectionLabel: {
    fontSize: 12,
    color: '#71717a',
    letterSpacing: 1,
    marginBottom: 8,
  },
  workoutCard: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    paddingBottom: 8,
  },
  workoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  workoutSubtitle: {
    fontSize: 14,
    color: '#71717a',
  },
  workoutMeta: {
    fontSize: 14,
    color: '#71717a',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  startButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  quickSelect: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  quickButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27272a',
    alignItems: 'center',
  },
  quickButtonActive: {
    borderColor: '#10b981',
  },
  quickButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#a1a1aa',
  },
  quickButtonTextActive: {
    color: '#10b981',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    padding: 12,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#71717a',
  },
  editText: {
    fontSize: 12,
    color: '#10b981',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  chartCard: {
    marginBottom: 12,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 14,
    color: '#71717a',
  },
  chartArrow: {
    color: '#52525b',
  },
  prRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  prIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prInfo: {
    flex: 1,
  },
  prLabel: {
    fontSize: 12,
    color: '#71717a',
  },
  prExercise: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  prWeight: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f59e0b',
  },
  emptyText: {
    fontSize: 14,
    color: '#71717a',
    textAlign: 'center',
    paddingVertical: 8,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#09090b',
    borderTopWidth: 1,
    borderTopColor: '#27272a',
    paddingVertical: 16,
    paddingBottom: 32,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 18,
    color: '#52525b',
    marginBottom: 4,
  },
  navIconActive: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 10,
    color: '#52525b',
  },
  navLabelActive: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 320,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalInput: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#27272a',
    marginBottom: 8,
  },
  modalUnit: {
    fontSize: 14,
    color: '#71717a',
    textAlign: 'center',
    marginBottom: 24,
  },
});

export default HomeScreen;
