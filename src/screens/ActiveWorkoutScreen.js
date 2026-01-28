import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { Button } from '../components';
import { useStore } from '../hooks/useStore';
import { exerciseDB } from '../data/exercises';
import { formatTime } from '../utils/calculations';

const ActiveWorkoutScreen = ({ navigation, route }) => {
  const { type } = route.params;
  const { currentExercises, completeWorkout } = useStore();

  const [logged, setLogged] = useState([]);
  const [completedSets, setCompletedSets] = useState({});
  const [activeExercise, setActiveExercise] = useState(null);
  const [activeSet, setActiveSet] = useState(1);
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [resting, setResting] = useState(false);
  const [restTime, setRestTime] = useState(60);

  const totalSets = currentExercises.reduce((sum, ex) => sum + ex.sets, 0);
  const completedTotal = logged.length;
  const progress = totalSets > 0 ? (completedTotal / totalSets) * 100 : 0;

  // Rest timer
  useEffect(() => {
    let interval;
    if (resting && restTime > 0) {
      interval = setInterval(() => setRestTime((t) => t - 1), 1000);
    } else if (restTime === 0 && resting) {
      setResting(false);
      setRestTime(60);
    }
    return () => clearInterval(interval);
  }, [resting, restTime]);

  const handleSelectExercise = (ex, index) => {
    const done = completedSets[index] || 0;
    if (done >= ex.sets) return; // Already complete
    setActiveExercise({ ...ex, index });
    setActiveSet(done + 1);
    setReps('');
    setWeight('');
  };

  const handleLogSet = () => {
    if (!reps || !weight || !activeExercise) return;

    const exData = exerciseDB[activeExercise.id] || { name: activeExercise.name || activeExercise.id };
    const newLog = {
      exercise: exData.name,
      exerciseId: activeExercise.id,
      set: activeSet,
      reps: parseInt(reps),
      weight: parseFloat(weight),
    };

    const newLogged = [...logged, newLog];
    setLogged(newLogged);

    const newCompleted = {
      ...completedSets,
      [activeExercise.index]: (completedSets[activeExercise.index] || 0) + 1,
    };
    setCompletedSets(newCompleted);

    // Check if workout complete
    const totalDone = Object.values(newCompleted).reduce((a, b) => a + b, 0);
    if (totalDone >= totalSets) {
      completeWorkout(newLogged);
      navigation.replace('WorkoutComplete');
    } else {
      setActiveExercise(null);
      setResting(true);
    }
  };

  const isExerciseComplete = (index, ex) => (completedSets[index] || 0) >= ex.sets;

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Header */}
      <View style={styles.header}>
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>{completedTotal} / {totalSets} sets</Text>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      {/* Main Content */}
      {resting && !activeExercise ? (
        <View style={styles.restContainer}>
          <Text style={styles.restLabel}>REST</Text>
          <Text style={styles.restTimer}>{formatTime(restTime)}</Text>
          <Button variant="ghost" size="small" onPress={() => { setResting(false); setRestTime(60); }}>
            Skip
          </Button>
          <Text style={styles.restHint}>Tap an exercise below to continue</Text>
        </View>
      ) : activeExercise ? (
        <View style={styles.activeContainer}>
          <Text style={styles.setLabel}>SET {activeSet} OF {activeExercise.sets}</Text>
          <Text style={styles.exerciseName}>
            {exerciseDB[activeExercise.id]?.name || activeExercise.id}
          </Text>
          <Text style={styles.targetReps}>Target: {activeExercise.reps}</Text>

          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>REPS</Text>
              <TextInput
                style={styles.input}
                value={reps}
                onChangeText={setReps}
                placeholder="10"
                placeholderTextColor="#52525b"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>KG</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                placeholder="20"
                placeholderTextColor="#52525b"
                keyboardType="numeric"
              />
            </View>
          </View>

          <Button
            onPress={handleLogSet}
            disabled={!reps || !weight}
            style={styles.logButton}
          >
            Log Set
          </Button>

          <TouchableOpacity onPress={() => setActiveExercise(null)}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.selectContainer}>
          <Text style={styles.selectHint}>Tap any exercise to log</Text>
        </View>
      )}

      {/* Exercise List */}
      <ScrollView style={styles.exerciseList}>
        {currentExercises.map((ex, index) => {
          const exData = exerciseDB[ex.id] || { name: ex.name || ex.id };
          const done = completedSets[index] || 0;
          const complete = isExerciseComplete(index, ex);

          return (
            <TouchableOpacity
              key={index}
              style={[styles.exerciseRow, complete && styles.exerciseRowComplete]}
              onPress={() => handleSelectExercise(ex, index)}
              disabled={complete}
            >
              <View style={[styles.exerciseNumber, complete && styles.exerciseNumberComplete]}>
                <Text style={[styles.numberText, complete && styles.numberTextComplete]}>
                  {complete ? '✓' : index + 1}
                </Text>
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={[styles.exerciseNameSmall, complete && styles.exerciseNameComplete]}>
                  {exData.name}
                </Text>
                <Text style={styles.exerciseSets}>{done}/{ex.sets} sets</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* End Button */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.endText}>End Workout</Text>
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
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    color: '#71717a',
    fontSize: 14,
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#27272a',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 2,
  },
  restContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  restLabel: {
    color: '#71717a',
    fontSize: 14,
    marginBottom: 8,
  },
  restTimer: {
    color: '#fff',
    fontSize: 56,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    marginBottom: 24,
  },
  restHint: {
    color: '#52525b',
    fontSize: 14,
    marginTop: 32,
  },
  activeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  setLabel: {
    color: '#71717a',
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 8,
  },
  exerciseName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  targetReps: {
    color: '#71717a',
    fontSize: 14,
    marginBottom: 32,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    maxWidth: 280,
    marginBottom: 24,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    color: '#52525b',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 12,
    paddingVertical: 16,
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  logButton: {
    width: '100%',
    maxWidth: 280,
  },
  cancelText: {
    color: '#52525b',
    fontSize: 14,
    marginTop: 16,
  },
  selectContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectHint: {
    color: '#a1a1aa',
    fontSize: 14,
  },
  exerciseList: {
    maxHeight: '45%',
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#18181b',
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#18181b',
    gap: 12,
  },
  exerciseRowComplete: {
    opacity: 0.4,
  },
  exerciseNumber: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#27272a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseNumberComplete: {
    backgroundColor: '#10b981',
  },
  numberText: {
    color: '#71717a',
    fontSize: 14,
    fontWeight: '500',
  },
  numberTextComplete: {
    color: '#000',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseNameSmall: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  exerciseNameComplete: {
    color: '#71717a',
    textDecorationLine: 'line-through',
  },
  exerciseSets: {
    color: '#52525b',
    fontSize: 13,
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#09090b',
    borderTopWidth: 1,
    borderTopColor: '#27272a',
    alignItems: 'center',
  },
  endText: {
    color: '#71717a',
    fontSize: 14,
  },
});

export default ActiveWorkoutScreen;
