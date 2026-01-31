import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ScrollView, SafeAreaView, Alert, Modal, Image, Platform
} from 'react-native';
import { useStore } from '../../store';
import { Button, LastSessionBadge, EmptyState } from '../../components';
import { fmtTime, spacing, colors, radius, fontSize, fontWeight } from '../../utils';
import { exerciseDB } from '../../data';

export const ActiveWorkoutScreen = ({ navigation, route }) => {
  const { type } = route.params;
  const { 
    currentExercises, 
    completeWorkout, 
    saveDraftWorkout,
    getLastSession,
    getProgressiveSuggestions,
    getExerciseAlternatives,
    swapExercise,
  } = useStore();
  
  const [logged, setLogged] = useState([]);
  const [completedSets, setCompletedSets] = useState({});
  const [activeEx, setActiveEx] = useState(null);
  const [activeSet, setActiveSet] = useState(1);
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [resting, setResting] = useState(false);
  const [restTime, setRestTime] = useState(60);
  
  // Exercise swap modal state
  const [swapModalVisible, setSwapModalVisible] = useState(false);
  const [swapExerciseIndex, setSwapExerciseIndex] = useState(null);
  const [swapAlternatives, setSwapAlternatives] = useState([]);
  
  // End workout confirmation modal (for Expo compatibility)
  const [endModalVisible, setEndModalVisible] = useState(false);
  
  // Get last session data for prefilling
  const [lastSessionData, setLastSessionData] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  
  // Use ref for timer to properly clean up
  const timerRef = useRef(null);
  
  const totalSets = currentExercises.reduce((s, e) => s + e.sets, 0);
  const progress = totalSets > 0 ? (logged.length / totalSets) * 100 : 0;
  
  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (logged.length > 0) {
        saveDraftWorkout(logged);
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [logged, saveDraftWorkout]);
  
  // Rest timer with proper cleanup
  useEffect(() => {
    if (resting && restTime > 0) {
      timerRef.current = setTimeout(() => setRestTime(r => r - 1), 1000);
    } else if (restTime === 0 && resting) {
      setResting(false);
      setRestTime(60);
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [resting, restTime]);
  
  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  
  // Handle exercise selection
  const handleSelect = (ex, idx) => {
    const done = completedSets[idx] || 0;
    if (done >= ex.sets) return;
    
    const lastData = getLastSession(ex.id);
    const progSuggestion = getProgressiveSuggestions(ex.id);
    
    setActiveEx({ ...ex, idx });
    setActiveSet(done + 1);
    setReps('');
    
    if (lastData && lastData.commonWeight) {
      setWeight(lastData.commonWeight.toString());
    } else {
      setWeight('');
    }
    
    setLastSessionData(lastData);
    setSuggestion(progSuggestion);
  };
  
  // Cancel active exercise - FIXED
  const handleCancelExercise = () => {
    setActiveEx(null);
    setLastSessionData(null);
    setSuggestion(null);
    setReps('');
    setWeight('');
  };
  
  // Log a set
  const handleLog = () => {
    if (!reps || !weight || !activeEx) return;
    
    const parsedReps = parseInt(reps, 10);
    const parsedWeight = parseFloat(weight);
    
    if (isNaN(parsedReps) || parsedReps <= 0) {
      Alert.alert('Invalid Reps', 'Please enter a valid number of reps.');
      return;
    }
    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      Alert.alert('Invalid Weight', 'Please enter a valid weight.');
      return;
    }
    
    const data = exerciseDB[activeEx.id] || { name: activeEx.name || activeEx.id };
    const newLog = {
      exercise: data.name,
      exerciseId: activeEx.id,
      set: activeSet,
      reps: parsedReps,
      weight: parsedWeight,
      timestamp: new Date().toISOString(),
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
      Alert.alert(
        'Complete Workout?',
        `You've finished all ${totalSets} sets. Complete this workout?`,
        [
          { 
            text: 'Review First', 
            style: 'cancel',
            onPress: handleCancelExercise
          },
          { 
            text: 'Complete', 
            onPress: () => {
              completeWorkout(newLogged);
              navigation.replace('WorkoutComplete');
            }
          },
        ]
      );
    } else {
      handleCancelExercise();
      setResting(true);
    }
  };
  
  // End workout - FIXED for Expo
  const handleEndWorkout = () => {
    // Clean up timer first
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setResting(false);
    setEndModalVisible(true);
  };
  
  const handleEndAction = (action) => {
    setEndModalVisible(false);
    
    if (action === 'continue') {
      return;
    }
    
    if (action === 'draft') {
      saveDraftWorkout(logged);
      navigation.goBack();
    } else if (action === 'complete') {
      completeWorkout(logged);
      navigation.replace('WorkoutComplete');
    } else if (action === 'discard') {
      navigation.goBack();
    }
  };
  
  // Open swap modal for exercise
  const handleOpenSwap = (exerciseIndex) => {
    const exercise = currentExercises[exerciseIndex];
    if (!exercise) return;
    
    const alternatives = getExerciseAlternatives(exercise.id);
    if (!alternatives || alternatives.length === 0) {
      Alert.alert(
        'No Alternatives',
        'No alternative exercises available for this movement.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    setSwapExerciseIndex(exerciseIndex);
    setSwapAlternatives(alternatives);
    setSwapModalVisible(true);
  };
  
  // Swap exercise
  const handleSwapExercise = (newExerciseId) => {
    if (swapExerciseIndex !== null) {
      swapExercise(swapExerciseIndex, newExerciseId);
      setSwapModalVisible(false);
      setSwapExerciseIndex(null);
      setSwapAlternatives([]);
    }
  };
  
  const isComplete = (i, ex) => (completedSets[i] || 0) >= ex.sets;
  
  // Empty state
  if (currentExercises.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          icon="+"
          title="No exercises selected"
          message="Add some exercises to your workout to get started"
          actionLabel="Go Back"
          onAction={() => navigation.goBack()}
        />
      </SafeAreaView>
    );
  }
  
  // Get current exercise data for image
  const activeExData = activeEx ? exerciseDB[activeEx.id] : null;
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.workoutType}>{type} Day</Text>
          <Text style={styles.progressText}>{logged.length} / {totalSets} sets</Text>
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
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={() => { setResting(false); setRestTime(60); }}
          >
            <Text style={styles.skipButtonText}>Skip Rest</Text>
          </TouchableOpacity>
          <Text style={styles.restHint}>Tap an exercise below to continue</Text>
        </View>
      ) : activeEx ? (
        <View style={styles.logScreen}>
          {/* Exercise image */}
          {activeExData?.media && (
            <View style={styles.exerciseImageContainer}>
              <Image 
                source={activeExData.media} 
                style={styles.exerciseImage}
                resizeMode="contain"
              />
            </View>
          )}
          
          {/* Last session badge */}
          {lastSessionData && <LastSessionBadge lastSession={lastSessionData} />}
          
          {/* Progression suggestion */}
          {suggestion && (
            <View style={styles.suggestionBadge}>
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
          
          <TouchableOpacity 
            style={[styles.logButton, (!reps || !weight) && styles.logButtonDisabled]}
            onPress={handleLog} 
            disabled={!reps || !weight}
          >
            <Text style={[styles.logButtonText, (!reps || !weight) && styles.logButtonTextDisabled]}>
              Log Set
            </Text>
          </TouchableOpacity>
          
          {/* Cancel button - FIXED */}
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={handleCancelExercise}
            hitSlop={{ top: 10, bottom: 10, left: 20, right: 20 }}
          >
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
            <View key={i} style={[styles.exerciseItem, complete && styles.exerciseItemComplete]}>
              <TouchableOpacity
                style={styles.exerciseTouchable}
                onPress={() => handleSelect(ex, i)}
                disabled={complete}
              >
                {/* Small thumbnail */}
                {data.media && (
                  <Image 
                    source={data.media} 
                    style={styles.exerciseThumbnail}
                    resizeMode="cover"
                  />
                )}
                
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
              
              {/* Swap button with text - FIXED */}
              {!complete && (
                <TouchableOpacity 
                  style={styles.swapButton}
                  onPress={() => handleOpenSwap(i)}
                >
                  <Text style={styles.swapButtonText}>Swap</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </ScrollView>
      
      {/* Bottom bar - End workout button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.endButton} 
          onPress={handleEndWorkout}
        >
          <Text style={styles.endText}>End Workout</Text>
        </TouchableOpacity>
      </View>
      
      {/* End Workout Modal - for Expo compatibility */}
      <Modal
        visible={endModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEndModalVisible(false)}
      >
        <View style={styles.endModalOverlay}>
          <View style={styles.endModalContent}>
            <Text style={styles.endModalTitle}>
              {logged.length > 0 ? 'End Workout' : 'Discard Workout?'}
            </Text>
            <Text style={styles.endModalMessage}>
              {logged.length > 0 
                ? `You've completed ${logged.length} sets. What would you like to do?`
                : 'No sets logged. Are you sure you want to exit?'
              }
            </Text>
            
            {logged.length > 0 ? (
              <>
                <TouchableOpacity 
                  style={styles.endModalButton}
                  onPress={() => handleEndAction('complete')}
                >
                  <Text style={styles.endModalButtonText}>Complete & Save</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.endModalButton}
                  onPress={() => handleEndAction('draft')}
                >
                  <Text style={styles.endModalButtonText}>Save as Draft</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.endModalButton, styles.endModalButtonCancel]}
                  onPress={() => handleEndAction('continue')}
                >
                  <Text style={styles.endModalButtonTextCancel}>Continue Workout</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity 
                  style={[styles.endModalButton, styles.endModalButtonDanger]}
                  onPress={() => handleEndAction('discard')}
                >
                  <Text style={styles.endModalButtonText}>Discard</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.endModalButton, styles.endModalButtonCancel]}
                  onPress={() => handleEndAction('continue')}
                >
                  <Text style={styles.endModalButtonTextCancel}>Continue</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
      
      {/* Exercise Swap Modal */}
      <Modal
        visible={swapModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSwapModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Swap Exercise</Text>
            <TouchableOpacity onPress={() => setSwapModalVisible(false)}>
              <Text style={styles.modalClose}>×</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.modalSubtitle}>
            Choose an alternative for:{'\n'}
            <Text style={styles.modalExerciseName}>
              {swapExerciseIndex !== null && currentExercises[swapExerciseIndex] 
                ? exerciseDB[currentExercises[swapExerciseIndex].id]?.name || currentExercises[swapExerciseIndex].id
                : ''}
            </Text>
          </Text>
          
          <ScrollView style={styles.alternativesList}>
            {swapAlternatives.map((altId) => {
              const altData = exerciseDB[altId] || { name: altId, muscles: '' };
              return (
                <TouchableOpacity
                  key={altId}
                  style={styles.alternativeItem}
                  onPress={() => handleSwapExercise(altId)}
                >
                  {altData.media && (
                    <Image 
                      source={altData.media} 
                      style={styles.alternativeThumbnail}
                      resizeMode="cover"
                    />
                  )}
                  <View style={styles.alternativeInfo}>
                    <Text style={styles.alternativeName}>{altData.name}</Text>
                    <Text style={styles.alternativeMuscle}>{altData.muscles}</Text>
                  </View>
                  <Text style={styles.alternativeArrow}>→</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  workoutType: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  progressText: {
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
  skipButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  skipButtonText: {
    color: colors.textTertiary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
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
  exerciseImageContainer: {
    width: 120,
    height: 120,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
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
    backgroundColor: '#fff',
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  logButtonDisabled: {
    backgroundColor: colors.elevated,
  },
  logButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: '#000',
  },
  logButtonTextDisabled: {
    color: colors.textDisabled,
  },
  cancelButton: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
  },
  cancelText: {
    color: colors.textDisabled,
    fontSize: fontSize.base,
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
  },
  exerciseTouchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  exerciseItemComplete: {
    opacity: 0.4,
  },
  exerciseThumbnail: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.elevated,
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
  // Swap button with text
  swapButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.elevated,
    marginLeft: spacing.sm,
  },
  swapButtonText: {
    color: colors.textTertiary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  bottomBar: {
    padding: spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? spacing.xxxl : spacing.lg,
    backgroundColor: '#09090b',
    borderTopWidth: 1,
    borderTopColor: colors.elevated,
    alignItems: 'center',
  },
  endButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
  },
  endText: {
    color: colors.danger,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
  // End Modal styles
  endModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  endModalContent: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.xxl,
    width: '100%',
    maxWidth: 320,
  },
  endModalTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  endModalMessage: {
    fontSize: fontSize.base,
    color: colors.textTertiary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  endModalButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  endModalButtonCancel: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  endModalButtonDanger: {
    backgroundColor: colors.danger,
  },
  endModalButtonText: {
    color: '#fff',
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  endModalButtonTextCancel: {
    color: colors.textTertiary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  // Swap Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  modalClose: {
    fontSize: 28,
    color: colors.textTertiary,
    padding: spacing.sm,
    lineHeight: 28,
  },
  modalSubtitle: {
    fontSize: fontSize.md,
    color: colors.textTertiary,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
  },
  modalExerciseName: {
    color: colors.textPrimary,
    fontWeight: fontWeight.semibold,
  },
  alternativesList: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
  },
  alternativeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  alternativeThumbnail: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    backgroundColor: colors.elevated,
    marginRight: spacing.md,
  },
  alternativeInfo: {
    flex: 1,
  },
  alternativeName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  alternativeMuscle: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
  alternativeArrow: {
    fontSize: fontSize.xl,
    color: colors.primary,
    marginLeft: spacing.md,
  },
});

export default ActiveWorkoutScreen;
