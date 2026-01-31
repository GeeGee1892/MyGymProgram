import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated, ScrollView } from 'react-native';
import { useStore } from '../../store';
import { Button } from '../../components';
import { exerciseDB } from '../../data';
import { spacing, colors, radius, fontSize, fontWeight } from '../../utils/theme';

export const WorkoutCompleteScreen = ({ navigation }) => {
  const { lastWorkoutPRs, workoutHistory, streak, userData } = useStore();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const prAnim = useRef(new Animated.Value(0)).current;
  
  // Get last workout stats
  const lastWorkout = workoutHistory[workoutHistory.length - 1];
  const totalSets = lastWorkout?.sets?.length || 0;
  const totalVolume = lastWorkout?.sets?.reduce((sum, set) => {
    return sum + (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0);
  }, 0) || 0;
  
  // Unique exercises
  const uniqueExercises = lastWorkout?.sets 
    ? [...new Set(lastWorkout.sets.map(s => s.exerciseId || s.exercise))].length
    : 0;
  
  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
    
    // PR animation (delayed)
    if (lastWorkoutPRs && lastWorkoutPRs.length > 0) {
      setTimeout(() => {
        Animated.spring(prAnim, {
          toValue: 1,
          friction: 6,
          tension: 50,
          useNativeDriver: true,
        }).start();
      }, 500);
    }
  }, []);
  
  const handleDone = () => {
    // Navigate back to main tabs
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };
  
  const getExerciseName = (exerciseId) => {
    return exerciseDB[exerciseId]?.name || exerciseId.replace(/_/g, ' ');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.content,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
          ]}
        >
          {/* Success icon */}
          <View style={styles.successIcon}>
            <Text style={styles.successEmoji}>🎉</Text>
          </View>
          
          {/* Title */}
          <Text style={styles.title}>Workout Complete!</Text>
          <Text style={styles.subtitle}>
            Great work{userData?.name ? `, ${userData.name}` : ''}! Keep pushing.
          </Text>
          
          {/* Stats cards */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{totalSets}</Text>
              <Text style={styles.statLabel}>Sets</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{uniqueExercises}</Text>
              <Text style={styles.statLabel}>Exercises</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {totalVolume >= 1000 
                  ? `${(totalVolume / 1000).toFixed(1)}k` 
                  : Math.round(totalVolume)}
              </Text>
              <Text style={styles.statLabel}>Volume (kg)</Text>
            </View>
          </View>
          
          {/* Streak */}
          {streak > 0 && (
            <View style={styles.streakCard}>
              <Text style={styles.streakEmoji}>🔥</Text>
              <View style={styles.streakContent}>
                <Text style={styles.streakValue}>{streak} Day Streak!</Text>
                <Text style={styles.streakLabel}>Keep the momentum going</Text>
              </View>
            </View>
          )}
          
          {/* PRs section */}
          {lastWorkoutPRs && lastWorkoutPRs.length > 0 && (
            <Animated.View 
              style={[
                styles.prSection,
                { 
                  opacity: prAnim,
                  transform: [{ 
                    translateY: prAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    })
                  }]
                }
              ]}
            >
              <View style={styles.prHeader}>
                <Text style={styles.prTrophy}>🏆</Text>
                <Text style={styles.prTitle}>New Personal Records!</Text>
              </View>
              
              {lastWorkoutPRs.map((pr, index) => (
                <View key={index} style={styles.prCard}>
                  <Text style={styles.prExercise}>{getExerciseName(pr.exerciseId)}</Text>
                  <Text style={styles.prWeight}>{pr.weight}kg</Text>
                </View>
              ))}
            </Animated.View>
          )}
          
          {/* Workout type badge */}
          {lastWorkout?.type && (
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>
                {lastWorkout.type} Day Complete
              </Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>
      
      {/* Bottom button */}
      <View style={styles.bottomBar}>
        <Button onPress={handleDone} style={styles.doneButton}>
          Back to Home
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxxl,
  },
  content: {
    alignItems: 'center',
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  successEmoji: {
    fontSize: 48,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textTertiary,
    marginBottom: spacing.xxxl,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xxl,
    width: '100%',
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    borderRadius: radius.md,
    padding: spacing.lg,
    width: '100%',
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.3)',
  },
  streakEmoji: {
    fontSize: 32,
    marginRight: spacing.lg,
  },
  streakContent: {
    flex: 1,
  },
  streakValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: '#f97316',
  },
  streakLabel: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  prSection: {
    width: '100%',
    marginBottom: spacing.xxl,
  },
  prHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  prTrophy: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  prTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: '#eab308',
  },
  prCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(234, 179, 8, 0.1)',
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(234, 179, 8, 0.3)',
  },
  prExercise: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
    flex: 1,
  },
  prWeight: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: '#eab308',
  },
  typeBadge: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textTertiary,
  },
  bottomBar: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
    backgroundColor: '#09090b',
    borderTopWidth: 1,
    borderTopColor: colors.elevated,
  },
  doneButton: {
    width: '100%',
  },
});

export default WorkoutCompleteScreen;
