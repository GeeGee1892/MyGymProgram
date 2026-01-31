import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, 
  SafeAreaView, StyleSheet, Platform, Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../../store';
import { Button } from '../../components';

export const HomeScreen = () => {
  const navigation = useNavigation();
  const { 
    userData, 
    addDailyCheckIn, 
    dailyCheckIns, 
    workoutHistory, 
    startWorkout, 
    getNextWorkoutType, 
    streak, 
    prs 
  } = useStore();

  const [weight, setWeight] = useState('');
  const [hitProtein, setHitProtein] = useState(null);
  const [showCheckIn, setShowCheckIn] = useState(true);
  const [checkInExpanded, setCheckInExpanded] = useState(false);

  const checkIns = dailyCheckIns || [];
  const workouts = workoutHistory || [];

  // Check if already checked in today
  useEffect(() => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const todayCheckIn = checkIns.find(c => {
      const checkInDate = new Date(c.date);
      const checkInStart = new Date(
        checkInDate.getFullYear(), 
        checkInDate.getMonth(), 
        checkInDate.getDate()
      );
      return checkInStart.getTime() === todayStart.getTime();
    });
    
    if (todayCheckIn) setShowCheckIn(false);
  }, [checkIns]);

  // Format today's date
  const formatDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-GB', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  const handleCheckIn = () => {
    const parsedWeight = parseFloat(weight);
    
    if (!weight || isNaN(parsedWeight) || parsedWeight <= 0 || parsedWeight > 300) {
      Alert.alert('Invalid Weight', 'Please enter a valid weight (1-300 kg)');
      return;
    }
    
    addDailyCheckIn({ 
      weight: parsedWeight, 
      hitProtein: hitProtein || false, 
      calories: null 
    });
    setShowCheckIn(false);
    setCheckInExpanded(false);
    setWeight('');
    setHitProtein(null);
  };

  const handleStartWorkout = (type) => {
    startWorkout(type);
    navigation.navigate('ActiveWorkout', { type });
  };

  const handleCustomWorkout = () => {
    // Navigate to custom workout builder as a screen, not tab
    navigation.navigate('CustomWorkout');
  };

  const suggestedType = getNextWorkoutType ? getNextWorkoutType() : 'Push';
  
  const DEFAULT_PROTEIN = 180;
  const DEFAULT_CALORIES = 2200;
  const proteinTarget = userData?.protein || DEFAULT_PROTEIN;

  // Workout types without emojis
  const workoutTypes = {
    Push: { subtitle: 'Chest, Shoulders, Triceps', color: '#3b82f6' },
    Pull: { subtitle: 'Back, Biceps, Forearms', color: '#8b5cf6' },
    Legs: { subtitle: 'Quads, Hamstrings, Glutes', color: '#f97316' },
  };

  // Weekly stats
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weeklyWorkouts = workouts.filter(w => {
    const workoutTime = new Date(w.date).getTime();
    return !isNaN(workoutTime) && workoutTime > oneWeekAgo;
  }).length;
  
  const currentStreak = streak || 0;
  const totalPRs = Object.keys(prs || {}).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Date Header */}
        <View style={styles.dateHeader}>
          <Text style={styles.dateText}>{formatDate()}</Text>
          {currentStreak > 0 && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>{currentStreak} day streak</Text>
            </View>
          )}
        </View>

        {/* Main Workout Card - DOMINANT */}
        <View style={styles.workoutSection}>
          <Text style={styles.sectionLabel}>TODAY'S WORKOUT</Text>
          <TouchableOpacity 
            style={[styles.mainWorkoutCard, { borderColor: workoutTypes[suggestedType]?.color }]} 
            onPress={() => handleStartWorkout(suggestedType)}
            activeOpacity={0.8}
          >
            <View style={styles.mainWorkoutContent}>
              <Text style={styles.mainWorkoutType}>{suggestedType}</Text>
              <Text style={styles.mainWorkoutSubtitle}>
                {workoutTypes[suggestedType]?.subtitle}
              </Text>
            </View>
            <View style={[styles.startButton, { backgroundColor: workoutTypes[suggestedType]?.color }]}>
              <Text style={styles.startButtonText}>Start</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Other Workout Options */}
        <View style={styles.otherWorkouts}>
          <Text style={styles.sectionLabelSmall}>Or choose</Text>
          <View style={styles.workoutOptions}>
            {Object.entries(workoutTypes)
              .filter(([type]) => type !== suggestedType)
              .map(([type, info]) => (
                <TouchableOpacity 
                  key={type} 
                  style={styles.workoutOption} 
                  onPress={() => handleStartWorkout(type)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.workoutOptionName}>{type}</Text>
                </TouchableOpacity>
              ))}
            <TouchableOpacity 
              style={[styles.workoutOption, styles.customOption]} 
              onPress={handleCustomWorkout}
              activeOpacity={0.7}
            >
              <Text style={styles.workoutOptionName}>Custom</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Compact Check-in (collapsible) */}
        {showCheckIn && (
          <View style={styles.checkInSection}>
            {!checkInExpanded ? (
              <TouchableOpacity 
                style={styles.checkInCollapsed}
                onPress={() => setCheckInExpanded(true)}
                activeOpacity={0.7}
              >
                <View style={styles.checkInCollapsedContent}>
                  <View style={styles.checkInDot} />
                  <Text style={styles.checkInCollapsedText}>Log today's weight</Text>
                </View>
                <Text style={styles.checkInArrow}>+</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.checkInExpanded}>
                <View style={styles.checkInHeader}>
                  <Text style={styles.checkInTitle}>Daily Check-in</Text>
                  <TouchableOpacity onPress={() => setCheckInExpanded(false)}>
                    <Text style={styles.checkInClose}>×</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.checkInRow}>
                  <Text style={styles.checkInLabel}>Weight</Text>
                  <View style={styles.checkInInputRow}>
                    <TextInput 
                      style={styles.checkInInput} 
                      value={weight} 
                      onChangeText={setWeight} 
                      placeholder={userData?.weight?.toString() || '85'} 
                      placeholderTextColor="#52525b" 
                      keyboardType="decimal-pad"
                      maxLength={6}
                    />
                    <Text style={styles.checkInUnit}>kg</Text>
                  </View>
                </View>
                
                <View style={styles.checkInRow}>
                  <Text style={styles.checkInLabel}>Hit {proteinTarget}g protein?</Text>
                  <View style={styles.proteinToggle}>
                    <TouchableOpacity 
                      style={[styles.proteinBtn, hitProtein === false && styles.proteinBtnActive]} 
                      onPress={() => setHitProtein(false)}
                    >
                      <Text style={[styles.proteinBtnText, hitProtein === false && styles.proteinBtnTextActive]}>No</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.proteinBtn, hitProtein === true && styles.proteinBtnActiveYes]} 
                      onPress={() => setHitProtein(true)}
                    >
                      <Text style={[styles.proteinBtnText, hitProtein === true && styles.proteinBtnTextActive]}>Yes</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={[styles.checkInSubmit, !weight && styles.checkInSubmitDisabled]}
                  onPress={handleCheckIn}
                  disabled={!weight}
                >
                  <Text style={styles.checkInSubmitText}>Log</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Quick Stats Row */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{weeklyWorkouts}</Text>
            <Text style={styles.statLabel}>this week</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalPRs}</Text>
            <Text style={styles.statLabel}>PRs</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userData?.targetWeight || 82}</Text>
            <Text style={styles.statLabel}>kg goal</Text>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scrollView: { flex: 1 },
  
  // Date header
  dateHeader: { 
    paddingHorizontal: 24, 
    paddingTop: 20, 
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: { 
    fontSize: 15, 
    color: '#a1a1aa',
    fontWeight: '500',
  },
  streakBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakText: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '600',
  },
  
  // Main workout section
  workoutSection: { 
    paddingHorizontal: 24, 
    marginBottom: 16,
  },
  sectionLabel: { 
    fontSize: 11, 
    fontWeight: '600', 
    color: '#52525b', 
    letterSpacing: 1,
    marginBottom: 12,
  },
  mainWorkoutCard: { 
    backgroundColor: '#18181b', 
    borderRadius: 16, 
    padding: 24, 
    borderWidth: 2, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  mainWorkoutContent: { flex: 1 },
  mainWorkoutType: { 
    fontSize: 28, 
    fontWeight: '700', 
    color: '#fff',
    marginBottom: 4,
  },
  mainWorkoutSubtitle: { 
    fontSize: 14, 
    color: '#71717a',
  },
  startButton: { 
    paddingHorizontal: 24, 
    paddingVertical: 14, 
    borderRadius: 12,
  },
  startButtonText: { 
    color: '#fff', 
    fontWeight: '600', 
    fontSize: 15,
  },
  
  // Other workouts
  otherWorkouts: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionLabelSmall: {
    fontSize: 12,
    color: '#52525b',
    marginBottom: 10,
  },
  workoutOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  workoutOption: {
    flex: 1,
    backgroundColor: '#18181b',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27272a',
  },
  customOption: {
    borderStyle: 'dashed',
  },
  workoutOptionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#a1a1aa',
  },
  
  // Check-in section
  checkInSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  checkInCollapsed: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#27272a',
  },
  checkInCollapsedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkInDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f59e0b',
  },
  checkInCollapsedText: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  checkInArrow: {
    fontSize: 20,
    color: '#52525b',
    fontWeight: '300',
  },
  checkInExpanded: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  checkInHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkInTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  checkInClose: {
    fontSize: 24,
    color: '#52525b',
    lineHeight: 24,
  },
  checkInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  checkInLabel: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  checkInInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkInInput: {
    backgroundColor: '#09090b',
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    width: 80,
    textAlign: 'center',
  },
  checkInUnit: {
    fontSize: 14,
    color: '#52525b',
    marginLeft: 8,
  },
  proteinToggle: {
    flexDirection: 'row',
    gap: 8,
  },
  proteinBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#27272a',
  },
  proteinBtnActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  proteinBtnActiveYes: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  proteinBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#71717a',
  },
  proteinBtnTextActive: {
    color: '#fff',
  },
  checkInSubmit: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  checkInSubmitDisabled: {
    backgroundColor: '#27272a',
  },
  checkInSubmitText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  
  // Stats section
  statsSection: {
    flexDirection: 'row',
    backgroundColor: '#18181b',
    marginHorizontal: 24,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#71717a',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#27272a',
    marginVertical: 4,
  },
  
  bottomPadding: { height: 100 },
});

export default HomeScreen;
