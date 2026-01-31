import React, { useState, useMemo } from 'react';
import { 
  View, Text, TouchableOpacity, ScrollView, SafeAreaView, 
  StyleSheet, TextInput, Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../../store';
import { Button } from '../../components';
import { exerciseDB } from '../../data';
import { spacing, colors, radius, fontSize, fontWeight } from '../../utils/theme';

export const CustomWorkoutBuilder = () => {
  const navigation = useNavigation();
  const { startWorkout } = useStore();
  
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [muscleFilter, setMuscleFilter] = useState('All');
  
  // Get all exercises from exerciseDB
  const allExercises = useMemo(() => {
    return Object.entries(exerciseDB).map(([id, data]) => ({
      id,
      name: data.name,
      muscles: data.muscles,
    }));
  }, []);
  
  // FIXED: Improved muscle filter logic
  const muscleGroups = ['All', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core'];
  
  const getMuscleMatch = (muscles, filter) => {
    if (filter === 'All') return true;
    if (!muscles) return false;
    
    const musclesLower = muscles.toLowerCase();
    
    // Special handling for "Arms" to match biceps, triceps, and forearms
    if (filter === 'Arms') {
      return musclesLower.includes('bicep') || 
             musclesLower.includes('tricep') || 
             musclesLower.includes('forearm');
    }
    
    // Special handling for "Core"
    if (filter === 'Core') {
      return musclesLower.includes('ab') || 
             musclesLower.includes('core') || 
             musclesLower.includes('oblique');
    }
    
    return musclesLower.includes(filter.toLowerCase());
  };
  
  // Filter exercises
  const filteredExercises = useMemo(() => {
    return allExercises.filter(ex => {
      const matchesSearch = !searchQuery || 
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.muscles?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesMuscle = getMuscleMatch(ex.muscles, muscleFilter);
      
      return matchesSearch && matchesMuscle;
    });
  }, [allExercises, searchQuery, muscleFilter]);
  
  // Toggle exercise selection
  const toggleExercise = (exercise) => {
    setSelectedExercises(prev => {
      const exists = prev.find(e => e.id === exercise.id);
      if (exists) {
        return prev.filter(e => e.id !== exercise.id);
      }
      return [...prev, { ...exercise, sets: 3, reps: '8-12' }];
    });
  };
  
  // Update sets for selected exercise
  const updateSets = (exerciseId, sets) => {
    const setsNum = parseInt(sets, 10);
    if (isNaN(setsNum) || setsNum < 1 || setsNum > 10) return;
    
    setSelectedExercises(prev => 
      prev.map(e => e.id === exerciseId ? { ...e, sets: setsNum } : e)
    );
  };
  
  // Move exercise up/down in order
  const moveExercise = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= selectedExercises.length) return;
    
    setSelectedExercises(prev => {
      const newArr = [...prev];
      [newArr[index], newArr[newIndex]] = [newArr[newIndex], newArr[index]];
      return newArr;
    });
  };
  
  // Remove exercise from selection
  const removeExercise = (exerciseId) => {
    setSelectedExercises(prev => prev.filter(e => e.id !== exerciseId));
  };
  
  // Start custom workout
  const handleStartWorkout = () => {
    if (selectedExercises.length === 0) {
      // FIXED: Use Alert.alert instead of alert()
      Alert.alert('No Exercises', 'Please select at least one exercise for your workout.');
      return;
    }
    
    // Format exercises for workout
    const formattedExercises = selectedExercises.map(e => ({
      id: e.id,
      sets: e.sets,
      reps: e.reps,
    }));
    
    startWorkout('Custom', formattedExercises);
    
    // FIXED: Navigate properly from tab to stack
    navigation.navigate('ActiveWorkout', { type: 'Custom' });
  };
  
  // Clear selection
  const handleClear = () => {
    if (selectedExercises.length > 0) {
      Alert.alert(
        'Clear Selection',
        'Remove all selected exercises?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Clear', style: 'destructive', onPress: () => setSelectedExercises([]) },
        ]
      );
    }
  };
  
  const isSelected = (exerciseId) => selectedExercises.some(e => e.id === exerciseId);
  const totalSets = selectedExercises.reduce((sum, e) => sum + e.sets, 0);
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Build Workout</Text>
          {selectedExercises.length > 0 && (
            <TouchableOpacity onPress={handleClear}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.subtitle}>
          {selectedExercises.length} exercises · {totalSets} sets
        </Text>
      </View>
      
      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search exercises..."
          placeholderTextColor={colors.textDisabled}
        />
      </View>
      
      {/* Muscle filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContainer}
      >
        {muscleGroups.map((muscle) => (
          <TouchableOpacity
            key={muscle}
            style={[styles.filterChip, muscleFilter === muscle && styles.filterChipActive]}
            onPress={() => setMuscleFilter(muscle)}
          >
            <Text style={[styles.filterText, muscleFilter === muscle && styles.filterTextActive]}>
              {muscle}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Two-column layout */}
      <View style={styles.mainContent}>
        {/* Exercise list */}
        <View style={styles.exerciseListContainer}>
          <Text style={styles.sectionTitle}>EXERCISES</Text>
          <ScrollView style={styles.exerciseList} showsVerticalScrollIndicator={false}>
            {filteredExercises.map((exercise) => (
              <TouchableOpacity
                key={exercise.id}
                style={[styles.exerciseItem, isSelected(exercise.id) && styles.exerciseItemSelected]}
                onPress={() => toggleExercise(exercise)}
              >
                <View style={styles.exerciseCheckbox}>
                  {isSelected(exercise.id) && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <View style={styles.exerciseInfo}>
                  <Text style={[styles.exerciseName, isSelected(exercise.id) && styles.exerciseNameSelected]}>
                    {exercise.name}
                  </Text>
                  <Text style={styles.exerciseMuscle}>{exercise.muscles}</Text>
                </View>
              </TouchableOpacity>
            ))}
            {filteredExercises.length === 0 && (
              <View style={styles.emptySearch}>
                <Text style={styles.emptySearchText}>No exercises found</Text>
              </View>
            )}
          </ScrollView>
        </View>
        
        {/* Selected exercises */}
        <View style={styles.selectedContainer}>
          <Text style={styles.sectionTitle}>YOUR WORKOUT</Text>
          {selectedExercises.length > 0 ? (
            <ScrollView style={styles.selectedList} showsVerticalScrollIndicator={false}>
              {selectedExercises.map((exercise, index) => (
                <View key={exercise.id} style={styles.selectedItem}>
                  <View style={styles.selectedHeader}>
                    <Text style={styles.selectedNumber}>{index + 1}</Text>
                    <Text style={styles.selectedName} numberOfLines={1}>
                      {exercise.name}
                    </Text>
                    <TouchableOpacity onPress={() => removeExercise(exercise.id)}>
                      <Text style={styles.removeBtn}>✕</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.selectedControls}>
                    <View style={styles.setsControl}>
                      <TouchableOpacity 
                        style={styles.setsBtn}
                        onPress={() => updateSets(exercise.id, exercise.sets - 1)}
                      >
                        <Text style={styles.setsBtnText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.setsValue}>{exercise.sets} sets</Text>
                      <TouchableOpacity 
                        style={styles.setsBtn}
                        onPress={() => updateSets(exercise.id, exercise.sets + 1)}
                      >
                        <Text style={styles.setsBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.orderControls}>
                      <TouchableOpacity 
                        onPress={() => moveExercise(index, -1)}
                        disabled={index === 0}
                      >
                        <Text style={[styles.orderBtn, index === 0 && styles.orderBtnDisabled]}>↑</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => moveExercise(index, 1)}
                        disabled={index === selectedExercises.length - 1}
                      >
                        <Text style={[
                          styles.orderBtn, 
                          index === selectedExercises.length - 1 && styles.orderBtnDisabled
                        ]}>↓</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptySelection}>
              <Text style={styles.emptyEmoji}>👈</Text>
              <Text style={styles.emptyTitle}>No exercises yet</Text>
              <Text style={styles.emptySubtext}>Tap exercises on the left to add them</Text>
            </View>
          )}
        </View>
      </View>
      
      {/* Start button */}
      <View style={styles.footer}>
        <Button 
          onPress={handleStartWorkout} 
          disabled={selectedExercises.length === 0}
        >
          Start Workout ({totalSets} sets)
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  clearText: {
    fontSize: fontSize.base,
    color: colors.danger,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  searchContainer: {
    paddingHorizontal: spacing.xxl,
    marginBottom: spacing.md,
  },
  searchInput: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterScroll: {
    maxHeight: 44,
    marginBottom: spacing.md,
  },
  filterContainer: {
    paddingHorizontal: spacing.xxl,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.textPrimary,
    borderColor: colors.textPrimary,
  },
  filterText: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    fontWeight: fontWeight.medium,
  },
  filterTextActive: {
    color: colors.background,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  exerciseListContainer: {
    flex: 1,
  },
  selectedContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textDisabled,
    letterSpacing: 1,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  exerciseList: {
    flex: 1,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  exerciseItemSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  exerciseCheckbox: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  exerciseNameSelected: {
    color: colors.primary,
  },
  exerciseMuscle: {
    fontSize: fontSize.xs,
    color: colors.textDisabled,
  },
  selectedList: {
    flex: 1,
  },
  selectedItem: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  selectedNumber: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginRight: spacing.sm,
  },
  selectedName: {
    flex: 1,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
  },
  removeBtn: {
    fontSize: fontSize.md,
    color: colors.textDisabled,
    padding: spacing.xs,
  },
  selectedControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  setsControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  setsBtn: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    backgroundColor: colors.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setsBtnText: {
    fontSize: fontSize.lg,
    color: colors.textPrimary,
    fontWeight: fontWeight.medium,
  },
  setsValue: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    marginHorizontal: spacing.md,
    minWidth: 50,
    textAlign: 'center',
  },
  orderControls: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  orderBtn: {
    fontSize: fontSize.md,
    color: colors.textTertiary,
    padding: spacing.xs,
  },
  orderBtnDisabled: {
    opacity: 0.3,
  },
  emptySelection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  emptyEmoji: {
    fontSize: 32,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: fontSize.sm,
    color: colors.textDisabled,
    textAlign: 'center',
  },
  emptySearch: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  emptySearchText: {
    fontSize: fontSize.sm,
    color: colors.textDisabled,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
    backgroundColor: '#09090b',
    borderTopWidth: 1,
    borderTopColor: colors.elevated,
  },
});

export default CustomWorkoutBuilder;
