import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useStore } from '../../store';
import { Button, LastSessionBadge, EmptyState } from '../../components';
import { fmtTime, fmtNum, spacing, colors, radius, fontSize, fontWeight } from '../../utils';
import { exerciseDB } from '../../data';

export const ActiveWorkoutScreen = ({ navigation, route }) => {
  const { type } = route.params;
  const { 
    currentExercises, 
    completeWorkout, 
    saveDraftWorkout,
    getLastSession,
    getProgressiveSuggestions,
  } = useStore();
  
  const [logged, setLogged] = useState([]);
  const [completedSets, setCompletedSets] = useState({});
  const [activeEx, setActiveEx] = useState(null);
  const [activeSet, setActiveSet] = useState(1);
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [resting, setResting] = useState(false);
  const [restTime, setRestTime] = useState(60);
  
  // Get last session data for prefilling
  const [lastSessionData, setLastSessionData] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  
  const totalSets = currentExercises.reduce((s, e) => s + e.sets, 0);
  const progress = totalSets > 0 ? (logged.length / totalSets) * 100 : 0;
  
  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (logged.length > 0) {
        saveDraftWorkout();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [logged]);
  
  // Rest timer
  useEffect(() => {
    let t;
    if (resting && restTime > 0) {
      t = setTimeout(() => setRestTime(r => r - 1), 1000);
    } else if (restTime === 0 && resting) {
      setResting(false);
      setRestTime(60);
    }
    return () => clearTimeout(t);
  }, [resting, restTime]);
  
  // Handle exercise selection
  const handleSelect = (ex, idx) => {
    const done = completedSets[idx] || 0;
    if (done >= ex.sets) return;
    
    // Get last session data for this exercise
    const lastData = getLastSession(ex.id);
    const progSuggestion = getProgressiveSuggestions(ex.id);
    
    setActiveEx({ ...ex, idx });
    setActiveSet(done + 1);
    setReps('');
    
    // Prefill weight from last session
    if (lastData && lastData.commonWeight) {
      setWeight(lastData.commonWeight.toString());
    } else {
      setWeight('');
    }
    
    setLastSessionData(lastData);
    setSuggestion(progSuggestion);
  };
  
  // Log a set
  const handleLog = () => {
    if (!reps || !weight || !activeEx) return;
    
    const data = exerciseDB[activeEx.id] || { name: activeEx.name || activeEx.id };
    const newLog = {
      exercise: data.name,
      exerciseId: activeEx.id,
      set: activeSet,
      reps: parseInt(reps),
      weight: parseFloat(weight),
    };
    
    const newLogged = [...logged, newLog];
    setLogged(newLogged);
    
    const newCompleted = {
      ...completedSets,
      [activeEx.idx]: (completedSets[activeEx.idx] || 0) + 1,
    };
    setCompletedSets(newCompleted);
    
    const totalDone = Object.values(newCompleted).reduce((a, b) => a + b, 0);
    
    if (totalDone >= totalSets) {
      completeWorkout(newLogged);
      navigation.replace('WorkoutComplete');
    } else {
      setActiveEx(null);
      setLastSessionData(null);
      setSuggestion(null);
      setResting(true);
    }
  };
  
  // End workout early
  const handleEndWorkout = () => {
    if (logged.length > 0) {
      Alert.alert(
        'Save Draft?',
        'You have incomplete sets. Save as draft?',
        [
          { text: 'Discard', onPress: () => navigation.goBack(), style: 'destructive' },
          {
            text: 'Save Draft',
            onPress: () => {
              saveDraftWorkout();
              navigation.goBack();
            },
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };
  
  const isComplete = (i, ex) => (completedSets[i] || 0) >= ex.sets;
  
  // Empty state
  if (currentExercises.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          icon="💪"
          title="No exercises selected"
          message="Add some exercises to your workout to get started"
          actionLabel="Add Exercises"
          onAction={() => navigation.goBack()}
        />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>{logged.length} / {totalSets} sets</Text>
          <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>
      
      {/* Main content area */}
      {resting && !activeEx ? (
        <View style={styles.restScreen}>
          <Text style={styles.restLabel}>REST</Text>
          <Text style={styles.restTimer}>{fmtTime(restTime)}</Text>
          <Button variant="ghost" size="sm" onPress={() => { setResting(false); setRestTime(60); }}>
            Skip Rest
          </Button>
          <Text style={styles.restHint}>Tap an exercise below to continue</Text>
        </View>
      ) : activeEx ? (
        <View style={styles.logScreen}>
          {/* Last session badge */}
          {lastSessionData && <LastSessionBadge lastSession={lastSessionData} />}
          
          {/* Progression suggestion */}
          {suggestion && (
            <View style={styles.suggestionBadge}>
              <Text style={styles.suggestionIcon}>💡</Text>
              <View style={styles.suggestionContent}>
                <Text style={styles.suggestionLabel}>SUGGESTED</Text>
                <Text style={styles.suggestionText}>{suggestion.suggestion}</Text>
                {suggestion.reason && (
                  <Text style={styles.suggestionReason}>{suggestion.reason}</Text>
                )}
              </View>
            </View>
          )}
          
          <Text style={styles.setNumber}>SET {activeSet} OF {activeEx.sets}</Text>
          <Text style={styles.exerciseName}>
            {exerciseDB[activeEx.id]?.name || activeEx.id}
          </Text>
          <Text style={styles.targetReps}>Target: {activeEx.reps}</Text>
          
          {/* Input fields */}
          <View style={styles.inputs}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>REPS</Text>
              <TextInput
                style={styles.input}
                value={reps}
                onChangeText={setReps}
                placeholder="10"
                placeholderTextColor={colors.textDisabled}
                keyboardType="numeric"
                autoFocus
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>KG</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                placeholder="20"
                placeholderTextColor={colors.textDisabled}
                keyboardType="decimal-pad"
              />
            </View>
          </View>
          
          <Button onPress={handleLog} disabled={!reps || !weight} style={styles.logButton}>
            Log Set
          </Button>
          
          <TouchableOpacity onPress={() => {
            setActiveEx(null);
            setLastSessionData(null);
            setSuggestion(null);
          }}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.emptyLog}>
          <Text style={styles.emptyLogText}>Tap any exercise to log a set</Text>
        </View>
      )}
      
      {/* Exercise list */}
      <ScrollView style={styles.exerciseList}>
        {currentExercises.map((ex, i) => {
          const data = exerciseDB[ex.id] || { name: ex.name || ex.id };
          const done = completedSets[i] || 0;
          const complete = isComplete(i, ex);
          
          return (
            <TouchableOpacity
              key={i}
              style={[styles.exerciseItem, complete && styles.exerciseItemComplete]}
              onPress={() => handleSelect(ex, i)}
              disabled={complete}
            >
              <View style={[styles.exerciseBadge, complete && styles.exerciseBadgeComplete]}>
                <Text style={[styles.exerciseBadgeText, complete && styles.exerciseBadgeTextComplete]}>
                  {complete ? '✓' : i + 1}
                </Text>
              </View>
              
              <View style={styles.exerciseInfo}>
                <Text style={[styles.exerciseName2, complete && styles.exerciseNameComplete]}>
                  {data.name}
                </Text>
                <Text style={styles.exerciseProgress}>{done}/{ex.sets} sets</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      
      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={handleEndWorkout}>
          <Text style={styles.endText}>End Workout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  progressSection: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  progressText: {
    color: colors.textTertiary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  progressPercent: {
    color: colors.textTertiary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.elevated,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
  },
  restScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  restLabel: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
    fontWeight: fontWeight.semibold,
    letterSpacing: 1,
  },
  restTimer: {
    fontSize: 56,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
    marginBottom: spacing.xxl,
  },
  restHint: {
    fontSize: fontSize.sm,
    color: colors.textDisabled,
    marginTop: spacing.xxxl,
  },
  logScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  suggestionBadge: {
    flexDirection: 'row',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    alignSelf: 'stretch',
  },
  suggestionIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  suggestionText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  suggestionReason: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
  },
  setNumber: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    letterSpacing: 1,
    marginBottom: spacing.sm,
    fontWeight: fontWeight.semibold,
  },
  exerciseName: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
    marginBottom: spacing.sm,
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },
  targetReps: {
    fontSize: fontSize.base,
    color: colors.textTertiary,
    marginBottom: spacing.xxxl,
  },
  inputs: {
    flexDirection: 'row',
    gap: spacing.lg,
    width: '100%',
    maxWidth: 280,
    marginBottom: spacing.xxl,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    color: colors.textDisabled,
    fontSize: fontSize.xs,
    textAlign: 'center',
    marginBottom: spacing.sm,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  logButton: {
    width: '100%',
    maxWidth: 280,
  },
  cancelText: {
    color: colors.textDisabled,
    fontSize: fontSize.base,
    marginTop: spacing.lg,
  },
  emptyLog: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyLogText: {
    color: colors.textTertiary,
    fontSize: fontSize.base,
  },
  exerciseList: {
    maxHeight: '45%',
    paddingHorizontal: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.card,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.card,
    gap: spacing.md,
  },
  exerciseItemComplete: {
    opacity: 0.4,
  },
  exerciseBadge: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    backgroundColor: colors.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseBadgeComplete: {
    backgroundColor: colors.primary,
  },
  exerciseBadgeText: {
    color: colors.textTertiary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  exerciseBadgeTextComplete: {
    color: colors.background,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName2: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    marginBottom: 2,
  },
  exerciseNameComplete: {
    color: colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  exerciseProgress: {
    color: colors.textDisabled,
    fontSize: fontSize.sm,
  },
  bottomBar: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
    backgroundColor: '#09090b',
    borderTopWidth: 1,
    borderTopColor: colors.elevated,
    alignItems: 'center',
  },
  endText: {
    color: colors.textTertiary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
});
