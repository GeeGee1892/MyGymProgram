import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { Card, LineChart } from '../components';
import { useStore } from '../hooks/useStore';
import { formatNumber } from '../utils/calculations';

const ProgressScreen = ({ navigation }) => {
  const { userData, workoutHistory, weightHistory, prs } = useStore();
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Calculate stats
  const totalWorkouts = workoutHistory.length;
  const totalSets = workoutHistory.reduce((sum, w) => sum + w.sets.length, 0);
  const totalVolume = workoutHistory.reduce((sum, w) => 
    sum + w.sets.reduce((s, set) => s + (set.reps * set.weight), 0), 0
  );

  // Build exercise history
  const exerciseHistory = {};
  workoutHistory.forEach((w) => {
    w.sets.forEach((set) => {
      if (!exerciseHistory[set.exercise]) {
        exerciseHistory[set.exercise] = [];
      }
      exerciseHistory[set.exercise].push({
        weight: set.weight,
        reps: set.reps,
      });
    });
  });

  // Volume per workout
  const volumeData = workoutHistory.map((w) => 
    w.sets.reduce((sum, s) => sum + s.reps * s.weight, 0)
  );

  // Weight history
  const weightData = weightHistory.map((w) => w.weight);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Analytics</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Overview Stats */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{totalWorkouts}</Text>
            <Text style={styles.statLabel}>workouts</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{totalSets}</Text>
            <Text style={styles.statLabel}>sets</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{formatNumber(totalVolume)}</Text>
            <Text style={styles.statLabel}>kg</Text>
          </Card>
        </View>

        {/* Weight Progress */}
        {weightData.length >= 2 && (
          <Card style={styles.chartCard}>
            <Text style={styles.chartLabel}>Weight Progress</Text>
            <LineChart data={weightData} height={100} />
          </Card>
        )}

        {/* Volume Trend */}
        {volumeData.length >= 2 && (
          <Card style={styles.chartCard}>
            <Text style={styles.chartLabel}>Volume per Workout</Text>
            <LineChart data={volumeData} height={100} />
          </Card>
        )}

        {/* Personal Records */}
        {Object.keys(prs).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Records</Text>
            {Object.entries(prs).map(([exercise, pr]) => (
              <Card 
                key={exercise} 
                style={styles.prCard}
                onPress={() => setSelectedExercise(selectedExercise === exercise ? null : exercise)}
              >
                <View style={styles.prRow}>
                  <Text style={styles.prExercise}>{exercise}</Text>
                  <Text style={styles.prWeight}>{pr}kg</Text>
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* Selected Exercise Detail */}
        {selectedExercise && exerciseHistory[selectedExercise] && (
          <Card style={styles.chartCard}>
            <Text style={styles.chartLabel}>{selectedExercise}</Text>
            <LineChart 
              data={exerciseHistory[selectedExercise].map((x) => x.weight)} 
              height={80} 
            />
          </Card>
        )}

        {/* Empty State */}
        {totalWorkouts === 0 && (
          <Card>
            <Text style={styles.emptyText}>Complete workouts to see progress</Text>
          </Card>
        )}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.goBack()}>
          <Text style={styles.navIcon}>◆</Text>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconActive}>◈</Text>
          <Text style={styles.navLabelActive}>Analytics</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#18181b',
  },
  backButton: {
    color: '#71717a',
    fontSize: 14,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#71717a',
  },
  chartCard: {
    marginBottom: 16,
  },
  chartLabel: {
    fontSize: 14,
    color: '#71717a',
    marginBottom: 12,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#71717a',
    marginBottom: 12,
  },
  prCard: {
    marginBottom: 8,
  },
  prRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prExercise: {
    fontSize: 15,
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
    color: '#52525b',
    textAlign: 'center',
    paddingVertical: 16,
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
});

export default ProgressScreen;
