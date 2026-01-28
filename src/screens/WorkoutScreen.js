import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { Button, Card } from '../components';
import { useStore } from '../hooks/useStore';
import { exerciseDB, alternatives } from '../data/exercises';
import { workoutTypes } from '../data/workouts';

const WorkoutScreen = ({ navigation, route }) => {
  const { type } = route.params;
  const { currentExercises, swapExercise } = useStore();
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [swappingIndex, setSwappingIndex] = useState(null);

  const info = workoutTypes[type];
  const totalSets = currentExercises.reduce((sum, ex) => sum + ex.sets, 0);

  const handleSwap = (index, newId) => {
    swapExercise(index, newId);
    setSwappingIndex(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.titleRow}>
          <View style={[styles.icon, { backgroundColor: info.color }]} />
          <View>
            <Text style={styles.title}>{info.name}</Text>
            <Text style={styles.subtitle}>{info.subtitle}</Text>
          </View>
        </View>
      </View>

      {/* Exercise List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentExercises.map((ex, index) => {
          const exData = exerciseDB[ex.id] || { name: ex.name || ex.id, muscles: ex.muscles || '' };
          const hasAlternatives = alternatives[ex.id]?.length > 0;

          return (
            <TouchableOpacity
              key={index}
              style={styles.exerciseRow}
              onPress={() => setSelectedExercise({ ...ex, ...exData })}
            >
              <View style={styles.exerciseNumber}>
                <Text style={styles.numberText}>{index + 1}</Text>
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{exData.name}</Text>
                <Text style={styles.exerciseMeta}>{ex.sets} × {ex.reps}</Text>
              </View>
              {hasAlternatives && (
                <TouchableOpacity
                  style={styles.swapButton}
                  onPress={() => setSwappingIndex(index)}
                >
                  <Text style={styles.swapText}>Swap</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{currentExercises.length}</Text>
            <Text style={styles.summaryLabel}>exercises</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{totalSets}</Text>
            <Text style={styles.summaryLabel}>sets</Text>
          </View>
        </View>
      </ScrollView>

      {/* Start Button */}
      <View style={styles.footer}>
        <Button onPress={() => navigation.navigate('ActiveWorkout', { type })}>
          Start Workout
        </Button>
      </View>

      {/* Exercise Info Modal */}
      <Modal visible={!!selectedExercise} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedExercise(null)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{selectedExercise?.name}</Text>
            <Text style={styles.modalMuscles}>{selectedExercise?.muscles}</Text>
            {selectedExercise?.cues && (
              <>
                <Text style={styles.tipsLabel}>Tips</Text>
                {selectedExercise.cues.map((cue, i) => (
                  <Text key={i} style={styles.tipText}>• {cue}</Text>
                ))}
              </>
            )}
            <Button variant="secondary" onPress={() => setSelectedExercise(null)} style={styles.modalButton}>
              Close
            </Button>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Swap Modal */}
      <Modal visible={swappingIndex !== null} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSwappingIndex(null)}
        >
          <View style={[styles.modalContent, styles.swapModal]}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Swap Exercise</Text>
            <ScrollView style={styles.swapList}>
              {swappingIndex !== null && (alternatives[currentExercises[swappingIndex]?.id] || []).map((altId) => {
                const alt = exerciseDB[altId];
                return (
                  <TouchableOpacity
                    key={altId}
                    style={styles.swapOption}
                    onPress={() => handleSwap(swappingIndex, altId)}
                  >
                    <Text style={styles.swapOptionName}>{alt.name}</Text>
                    <Text style={styles.swapOptionMuscles}>{alt.muscles}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <Button variant="ghost" onPress={() => setSwappingIndex(null)}>
              Cancel
            </Button>
          </View>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#71717a',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#18181b',
    gap: 12,
  },
  exerciseNumber: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#27272a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    color: '#71717a',
    fontSize: 14,
    fontWeight: '500',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  exerciseMeta: {
    color: '#71717a',
    fontSize: 14,
  },
  swapButton: {
    backgroundColor: 'rgba(34, 211, 238, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  swapText: {
    color: '#22d3ee',
    fontSize: 12,
    fontWeight: '500',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#18181b',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 16,
    marginBottom: 100,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  summaryLabel: {
    color: '#71717a',
    fontSize: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#18181b',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#18181b',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#27272a',
  },
  swapModal: {
    maxHeight: '70%',
  },
  modalHandle: {
    width: 48,
    height: 4,
    backgroundColor: '#3f3f46',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  modalMuscles: {
    fontSize: 14,
    color: '#10b981',
    marginBottom: 16,
  },
  tipsLabel: {
    fontSize: 14,
    color: '#71717a',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#d4d4d8',
    marginBottom: 4,
  },
  modalButton: {
    marginTop: 16,
  },
  swapList: {
    maxHeight: 300,
    marginBottom: 16,
  },
  swapOption: {
    backgroundColor: '#27272a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  swapOptionName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  swapOptionMuscles: {
    color: '#71717a',
    fontSize: 14,
  },
});

export default WorkoutScreen;
