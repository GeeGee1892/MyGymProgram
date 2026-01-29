import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useStore } from '../../store';
import { Button } from '../../components';

export const DailyCheckInScreen = ({ navigation }) => {
  const { userData, addDailyCheckIn, dailyCheckIns } = useStore();
  
  const [weight, setWeight] = useState(userData.weight?.toString() || '');
  const [hitProtein, setHitProtein] = useState(false);
  const [calories, setCalories] = useState('');

  // Get targets from onboarding (stored in userData)
  const proteinTarget = userData.protein || 180;
  const calorieTarget = userData.calories || 2200;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Calculate 7-day weight average
  const getWeightAverage = () => {
    if (dailyCheckIns.length < 7) return null;
    const last7 = dailyCheckIns.slice(-7);
    const avg = last7.reduce((sum, c) => sum + (c.weight || 0), 0) / 7;
    return avg.toFixed(1);
  };

  const handleSubmit = () => {
    if (!weight) {
      alert('Please enter your weight');
      return;
    }

    addDailyCheckIn({
      weight: parseFloat(weight),
      hitProtein,
      calories: calories ? parseInt(calories) : null,
    });

    // Navigate to home/workout selection
    navigation.replace('Home');
  };

  const weightAvg = getWeightAverage();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()}, {userData.name || 'there'}</Text>
          <Text style={styles.subtitle}>Daily check-in</Text>
        </View>

        {/* Weight input */}
        <View style={styles.card}>
          <Text style={styles.label}>Today's Weight</Text>
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
          {weightAvg && (
            <Text style={styles.hint}>7-day avg: {weightAvg}kg</Text>
          )}
        </View>

        {/* Protein check */}
        <View style={styles.card}>
          <Text style={styles.label}>Did you hit protein yesterday?</Text>
          <Text style={styles.target}>Target: {proteinTarget}g</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleButton, !hitProtein && styles.toggleButtonActive]}
              onPress={() => setHitProtein(false)}
            >
              <Text style={[styles.toggleText, !hitProtein && styles.toggleTextActive]}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, hitProtein && styles.toggleButtonActive]}
              onPress={() => setHitProtein(true)}
            >
              <Text style={[styles.toggleText, hitProtein && styles.toggleTextActive]}>Yes 💪</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Calories input */}
        <View style={styles.card}>
          <Text style={styles.label}>Calories yesterday (optional)</Text>
          <Text style={styles.target}>Target: {calorieTarget} cal</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={calories}
              onChangeText={setCalories}
              placeholder={calorieTarget.toString()}
              placeholderTextColor="#52525b"
              keyboardType="number-pad"
            />
            <Text style={styles.unit}>cal</Text>
          </View>
          {calories && (
            <Text style={[
              styles.hint,
              parseInt(calories) > calorieTarget ? styles.hintOver : styles.hintUnder
            ]}>
              {parseInt(calories) > calorieTarget 
                ? `+${parseInt(calories) - calorieTarget} over target`
                : `${calorieTarget - parseInt(calories)} under target`
              }
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Submit button */}
      <View style={styles.footer}>
        <Button onPress={handleSubmit}>
          Continue
        </Button>
      </View>
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
  content: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 32,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#71717a',
  },
  card: {
    backgroundColor: '#18181b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  target: {
    fontSize: 14,
    color: '#10b981',
    marginBottom: 16,
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
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  unit: {
    fontSize: 18,
    color: '#71717a',
    marginLeft: 12,
    fontWeight: '500',
  },
  hint: {
    fontSize: 13,
    color: '#71717a',
    marginTop: 12,
  },
  hintOver: {
    color: '#f59e0b',
  },
  hintUnder: {
    color: '#10b981',
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#27272a',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  toggleButtonActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10b981',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#71717a',
  },
  toggleTextActive: {
    color: '#10b981',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 40,
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#18181b',
  },
});
