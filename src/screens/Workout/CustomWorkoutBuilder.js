import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useStore } from '../../store';
import { exerciseDB } from '../../data';
import { Button, EmptyState } from '../../components';
import { spacing, colors, radius, fontSize, fontWeight } from '../../utils/theme';

export const CustomWorkoutBuilder = ({ navigation }) => {
  const { startWorkout } = useStore();
  
  const [workoutName, setWorkoutName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMuscle, setFilterMuscle] = useState('All');
  
  // Filter exercises based on search and muscle group
  const allExercises = Object.keys(exerciseDB).map(id => ({
    id,
    ...exerciseDB[id],
  }));
  
  const filteredExercises = allExercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscle = filterMuscle === 'All' || ex.muscles.toLowerCase().includes(filterMuscle.toLowerCase());
    return matchesSearch && matchesMuscle;
  });
  
  const muscleGroups = ['All', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core'];
  
  // Add exercise to workout
  const addExercise = (exercise) => {
    const newEx = {
      id: exercise.id,
      sets: 3,
      reps: '8-12',
    };
    setSelectedExercises([...selectedExercises, newEx]);
  };
  
  // Remove exercise from workout
  const removeExercise = (index) => {
    const updated = [...selectedExercises];
    updated.splice(index, 1);
    setSelectedExercises(updated);
  };
  
  // Update sets/reps for an exercise
  const updateExercise = (index, field, value) => {
    const updated = [...selectedExercises];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedExercises(updated);
  };
  
  // Start the custom workout
  const handleStart = () => {
    if (selectedExercises.length === 0) {
      alert('Please add at least one exercise');
      return;
    }
    
    startWorkout('Custom', selectedExercises);
    navigation.navigate('ActiveWorkout', { type: 'Custom' });
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Build Custom Workout</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Workout Name */}
        <View style={styles.section}>
          <Text style={styles.label}>Workout Name (Optional)</Text>
          <TextInput
            style={styles.input}
            value={workoutName}
            onChangeText={setWorkoutName}
            placeholder="e.g., Upper Body Power"
            placeholderTextColor={colors.textDisabled}
          />
        </View>
        
        {/* Selected Exercises */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Your Workout ({selectedExercises.length} exercises)
          </Text>
          
          {selectedExercises.length === 0 ? (
            <View style={styles.emptyWorkout}>
              <Text style={styles.emptyText}>No exercises added yet</Text>
              <Text style={styles.emptyHint}>Search and tap exercises below to add them</Text>
            </View>
          ) : (
            selectedExercises.map((ex, index) => {
              const data = exerciseDB[ex.id];
              return (
                <View key={index} style={styles.selectedExercise}>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>{data.name}</Text>
                    <Text style={styles.exerciseMuscle}>{data.muscles}</Text>
                  </View>
                  
                  <View style={styles.exerciseControls}>
                    <View style={styles.controlGroup}>
                      <Text style={styles.controlLabel}>Sets</Text>
                      <TextInput
                        style={styles.controlInput}
                        value={ex.sets.toString()}
                        onChangeText={(val) => updateExercise(index, 'sets', parseInt(val) || 3)}
                        keyboardType="numeric"
                      />
                    </View>
                    
                    <View style={styles.controlGroup}>
                      <Text style={styles.controlLabel}>Reps</Text>
                      <TextInput
                        style={styles.controlInput}
                        value={ex.reps}
                        onChangeText={(val) => updateExercise(index, 'reps', val)}
                        placeholder="8-12"
                      />
                    </View>
                    
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeExercise(index)}
                    >
                      <Text style={styles.removeButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>
        
        {/* Exercise Library */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exercise Library</Text>
          
          {/* Search */}
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search exercises..."
            placeholderTextColor={colors.textDisabled}
          />
          
          {/* Muscle Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            {muscleGroups.map((muscle) => (
              <TouchableOpacity
                key={muscle}
                style={[
                  styles.filterButton,
                  filterMuscle === muscle && styles.filterButtonActive,
                ]}
                onPress={() => setFilterMuscle(muscle)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filterMuscle === muscle && styles.filterButtonTextActive,
                  ]}
                >
                  {muscle}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {/* Exercise List */}
          {filteredExercises.map((ex) => {
            const isAdded = selectedExercises.some((sel) => sel.id === ex.id);
            
            return (
              <TouchableOpacity
                key={ex.id}
                style={[
                  styles.exerciseCard,
                  isAdded && styles.exerciseCardAdded,
                ]}
                onPress={() => !isAdded && addExercise(ex)}
                disabled={isAdded}
              >
                <View style={styles.exerciseCardContent}>
                  <Text style={styles.exerciseCardName}>{ex.name}</Text>
                  <Text style={styles.exerciseCardMuscle}>{ex.muscles}</Text>
                </View>
                {isAdded ? (
                  <View style={styles.addedBadge}>
                    <Text style={styles.addedBadgeText}>✓ Added</Text>
                  </View>
                ) : (
                  <View style={styles.addButton}>
                    <Text style={styles.addButtonText}>+ Add</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      
      {/* Bottom Bar */}
      {selectedExercises.length > 0 && (
        <View style={styles.bottomBar}>
          <Button onPress={handleStart} style={styles.startButton}>
            Start Workout ({selectedExercises.length} exercises)
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    fontSize: fontSize.md,
    color: colors.primary,
    marginRight: spacing.lg,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: spacing.xxl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
    fontWeight: fontWeight.semibold,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  emptyWorkout: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
  },
  emptyHint: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  selectedExercise: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  exerciseInfo: {
    marginBottom: spacing.md,
  },
  exerciseName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  exerciseMuscle: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
  exerciseControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  controlGroup: {
    flex: 1,
  },
  controlLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginBottom: spacing.xs,
    fontWeight: fontWeight.semibold,
  },
  controlInput: {
    backgroundColor: colors.elevated,
    borderRadius: radius.sm,
    padding: spacing.sm,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    fontSize: fontSize.lg,
    color: colors.textPrimary,
  },
  searchInput: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  filterScroll: {
    marginBottom: spacing.lg,
  },
  filterButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  filterButtonTextActive: {
    color: colors.background,
    fontWeight: fontWeight.semibold,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  exerciseCardAdded: {
    opacity: 0.5,
    borderColor: colors.primary,
  },
  exerciseCardContent: {
    flex: 1,
  },
  exerciseCardName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  exerciseCardMuscle: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
  },
  addButtonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.background,
  },
  addedBadge: {
    backgroundColor: colors.elevated,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
  },
  addedBadgeText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
  bottomBar: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
    backgroundColor: '#09090b',
    borderTopWidth: 1,
    borderTopColor: colors.elevated,
  },
  startButton: {
    width: '100%',
  },
});
