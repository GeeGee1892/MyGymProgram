import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Button, ProgressBar } from '../components';
import { useStore } from '../hooks/useStore';

const GoalScreen = ({ navigation }) => {
  const { userData, setUserData } = useStore();

  const goals = [
    { id: 'cut', label: 'Lose fat', desc: 'Calorie deficit, preserve muscle' },
    { id: 'bulk', label: 'Build muscle', desc: 'Calorie surplus for growth' },
    { id: 'maintain', label: 'Maintain', desc: 'Stay at current weight' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <ProgressBar current={3} total={5} />
        </View>

        <Text style={styles.title}>Your goal</Text>
        <Text style={styles.subtitle}>What are you working towards?</Text>

        <View style={styles.goals}>
          {goals.map((goal) => (
            <TouchableOpacity
              key={goal.id}
              style={[styles.goalButton, userData.goal === goal.id && styles.goalButtonActive]}
              onPress={() => setUserData({ goal: goal.id })}
            >
              <View style={styles.goalContent}>
                <Text style={[styles.goalLabel, userData.goal === goal.id && styles.goalLabelActive]}>
                  {goal.label}
                </Text>
                <Text style={[styles.goalDesc, userData.goal === goal.id && styles.goalDescActive]}>
                  {goal.desc}
                </Text>
              </View>
              {userData.goal === goal.id && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Button onPress={() => navigation.navigate('TrainingDays')} disabled={!userData.goal}>
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
  goals: {
    gap: 12,
  },
  goalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  goalButtonActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  goalContent: {
    flex: 1,
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  goalLabelActive: {
    color: '#000',
  },
  goalDesc: {
    fontSize: 14,
    color: '#71717a',
  },
  goalDescActive: {
    color: '#52525b',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 12,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
});

export default GoalScreen;
