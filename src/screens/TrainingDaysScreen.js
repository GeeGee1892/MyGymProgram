import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Button, Card, ProgressBar } from '../components';
import { useStore } from '../hooks/useStore';

const TrainingDaysScreen = ({ navigation }) => {
  const { userData, setUserData } = useStore();

  const days = [3, 4, 5, 6];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <ProgressBar current={4} total={5} />
        </View>

        <Text style={styles.title}>Training days</Text>
        <Text style={styles.subtitle}>How many days per week?</Text>

        <View style={styles.daysContainer}>
          {days.map((day) => (
            <TouchableOpacity
              key={day}
              style={[styles.dayButton, userData.trainingDays === day && styles.dayButtonActive]}
              onPress={() => setUserData({ trainingDays: day })}
            >
              <Text style={[styles.dayText, userData.trainingDays === day && styles.dayTextActive]}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Card>
          <Text style={styles.tipText}>
            <Text style={styles.tipLabel}>Tip: </Text>
            3-4 days is optimal for most people. Recovery matters.
          </Text>
        </Card>
      </View>

      <View style={styles.footer}>
        <Button onPress={() => navigation.navigate('PlanReady')} disabled={!userData.trainingDays}>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#71717a',
    marginBottom: 24,
  },
  daysContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  dayButton: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27272a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButtonActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  dayText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#a1a1aa',
  },
  dayTextActive: {
    color: '#000',
  },
  tipText: {
    color: '#a1a1aa',
    fontSize: 14,
  },
  tipLabel: {
    color: '#10b981',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
});

export default TrainingDaysScreen;
