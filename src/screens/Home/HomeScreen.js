import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Image,
} from 'react-native';
import { useStore } from '../../store';
import { Button } from '../../components';

// Import logo
const logo = require('../../../assets/icon.png');

export const HomeScreen = ({ navigation }) => {
  const { 
    userData, 
    addDailyCheckIn, 
    dailyCheckIns,
    workoutHistory,
    startWorkout,
    getNextWorkoutType,
    streak,
    prs,
  } = useStore();

  // Check-in state
  const [weight, setWeight] = useState('');
  const [hitProtein, setHitProtein] = useState(null);
  const [showCheckIn, setShowCheckIn] = useState(true);

  // Check if already checked in today
  useEffect(() => {
    const today = new Date().toDateString();
    const todayCheckIn = dailyCheckIns.find(c => 
      new Date(c.date).toDateString() === today
    );
    if (todayCheckIn) {
      setShowCheckIn(false);
    }
  }, [dailyCheckIns]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleCheckIn = () => {
    if (!weight) return;
    
    addDailyCheckIn({
      weight: parseFloat(weight),
      hitProtein: hitProtein || false,
      calories: null,
    });
    setShowCheckIn(false);
  };

  const handleStartWorkout = (type) => {
    startWorkout(type);
    navigation.navigate('WorkoutPreview', { type });
  };

  const suggestedType = getNextWorkoutType();
  const proteinTarget = userData.protein || 180;
  const calorieTarget = userData.calories || 2200;

  // Workout type info
  const workoutTypes = {
    Push: { subtitle: 'Chest · Shoulders · Triceps', color: '#3b82f6', emoji: '💪' },
    Pull: { subtitle: 'Back · Biceps · Forearms', color: '#8b5cf6', emoji: '🏋️' },
    Legs: { subtitle: 'Quads · Hamstrings · Glutes', color: '#f97316', emoji: '🦵' },
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with logo */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Image source={logo} style={styles.logo} />
            <View>
              <Text style={styles.greeting}>{getGreeting()}, {userData.name}</Text>
              <Text style={styles.subtitle}>
                {streak > 0 ? `🔥 ${streak} day streak` : "Let's get started"}
              </Text>
            </View>
          </View>
        </View>

        {/* Daily Check-in Card */}
        {showCheckIn && (
          <View style={styles.checkInCard}>
            <Text style={styles.checkInTitle}>Daily Check-in</Text>
            
            {/* Weight */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Weight</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={weight}
                  onChangeText={setWeight}
                  placeholder={userData.weight?.toString() || '85'}
                  placeholderTextColor="#52525b"
                  keyboardType="decimal-pad"
                />
                <Text style={styles.unit}>kg</Text>
              </View>
            </View>

            {/* Protein */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Hit {proteinTarget}g protein yesterday?</Text>
              <View style={styles.toggleRow}>
                <TouchableOpacity
                  style={[styles.toggleBtn, hitProtein === false && styles.toggleBtnActive]}
                  onPress={() => setHitProtein(false)}
                >
                  <Text style={[styles.toggleText, hitProtein === false && styles.toggleTextActive]}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleBtn, hitProtein === true && styles.toggleBtnActive]}
                  onPress={() => setHitProtein(true)}
                >
                  <Text style={[styles.toggleText, hitProtein === true && styles.toggleTextActive]}>Yes 💪</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Button onPress={handleCheckIn} disabled={!weight}>
              Log Check-in
            </Button>
          </View>
        )}

        {/* Suggested Workout */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Workout</Text>
          <TouchableOpacity
            style={[styles.suggestedCard, { borderColor: workoutTypes[suggestedType]?.color || '#10b981' }]}
            onPress={() => handleStartWorkout(suggestedType?.toLowerCase() || 'push')}
          >
            <View style={styles.suggestedContent}>
              <Text style={styles.suggestedEmoji}>{workoutTypes[suggestedType]?.emoji || '💪'}</Text>
              <View>
                <Text style={styles.suggestedTitle}>{suggestedType || 'Push'}</Text>
                <Text style={styles.suggestedSubtitle}>{workoutTypes[suggestedType]?.subtitle || 'Chest · Shoulders · Triceps'}</Text>
              </View>
            </View>
            <View style={[styles.startBadge, { backgroundColor: workoutTypes[suggestedType]?.color || '#10b981' }]}>
              <Text style={styles.startText}>Start →</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Other Workouts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Or choose another</Text>
          <View style={styles.workoutGrid}>
            {Object.entries(workoutTypes)
              .filter(([type]) => type !== suggestedType)
              .map(([type, info]) => (
                <TouchableOpacity
                  key={type}
                  style={styles.workoutCard}
                  onPress={() => handleStartWorkout(type.toLowerCase())}
                >
                  <Text style={styles.workoutEmoji}>{info.emoji}</Text>
                  <Text style={styles.workoutName}>{type}</Text>
                  <Text style={styles.workoutSubtitle}>{info.subtitle}</Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{workoutHistory.filter(w => {
                const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
                return new Date(w.date).getTime() > weekAgo;
              }).length}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{dailyCheckIns.filter(c => c.hitProtein).length}</Text>
              <Text style={styles.statLabel}>Protein hits</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{Object.keys(prs).length}</Text>
              <Text style={styles.statLabel}>PRs</Text>
            </View>
          </View>
        </View>

        {/* Targets reminder */}
        <View style={styles.targetsCard}>
          <Text style={styles.targetsTitle}>Daily Targets</Text>
          <View style={styles.targetsRow}>
            <View style={styles.targetItem}>
              <Text style={styles.targetValue}>{calorieTarget}</Text>
              <Text style={styles.targetLabel}>calories</Text>
            </View>
            <View style={styles.targetDivider} />
            <View style={styles.targetItem}>
              <Text style={styles.targetValue}>{proteinTarget}g</Text>
              <Text style={styles.targetLabel}>protein</Text>
            </View>
            <View style={styles.targetDivider} />
            <View style={styles.targetItem}>
              <Text style={styles.targetValue}>{userData.targetWeight}kg</Text>
              <Text style={styles.targetLabel}>goal weight</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#71717a',
    marginTop: 2,
  },
  
  // Check-in card
  checkInCard: {
    backgroundColor: '#18181b',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#27272a',
    marginBottom: 24,
  },
  checkInTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#a1a1aa',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#09090b',
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  unit: {
    fontSize: 16,
    color: '#71717a',
    marginLeft: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#27272a',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  toggleBtnActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10b981',
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#71717a',
  },
  toggleTextActive: {
    color: '#10b981',
  },

  // Sections
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#71717a',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Suggested workout
  suggestedCard: {
    backgroundColor: '#18181b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  suggestedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  suggestedEmoji: {
    fontSize: 32,
  },
  suggestedTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  suggestedSubtitle: {
    fontSize: 14,
    color: '#71717a',
    marginTop: 2,
  },
  startBadge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  startText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  // Workout grid
  workoutGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  workoutCard: {
    flex: 1,
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27272a',
  },
  workoutEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  workoutSubtitle: {
    fontSize: 11,
    color: '#71717a',
    textAlign: 'center',
    marginTop: 4,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27272a',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10b981',
  },
  statLabel: {
    fontSize: 12,
    color: '#71717a',
    marginTop: 4,
  },

  // Targets
  targetsCard: {
    backgroundColor: '#18181b',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  targetsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#71717a',
    marginBottom: 16,
    textAlign: 'center',
  },
  targetsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  targetItem: {
    alignItems: 'center',
  },
  targetValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  targetLabel: {
    fontSize: 12,
    color: '#71717a',
    marginTop: 4,
  },
  targetDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#27272a',
  },

  bottomPadding: {
    height: 40,
  },
});
