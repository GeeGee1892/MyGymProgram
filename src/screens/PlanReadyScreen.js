import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Button, Card, ProgressBar } from '../components';
import { useStore } from '../hooks/useStore';
import { calculateCalories, calculateProtein } from '../utils/calculations';

const PlanReadyScreen = ({ navigation }) => {
  const { userData, completeOnboarding } = useStore();
  
  const calories = calculateCalories(userData);
  const protein = calculateProtein(userData.weight, userData.goal);

  const features = [
    'Smart workout rotation',
    'Swap exercises anytime',
    'Log in any order',
    'Automatic PR tracking',
  ];

  const handleStart = () => {
    completeOnboarding();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ProgressBar current={5} total={5} />
        </View>

        <Text style={styles.title}>You're all set, {userData.name}!</Text>
        <Text style={styles.subtitle}>Here's your plan.</Text>

        {/* Calorie & Protein */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Calories</Text>
            <Text style={styles.statValue}>{calories}</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Protein</Text>
            <Text style={styles.statValue}>{protein}g</Text>
          </Card>
        </View>

        {/* Weight Goal */}
        <Card style={styles.weightCard}>
          <Text style={styles.statLabel}>Current → Target</Text>
          <Text style={styles.weightText}>
            {userData.weight}kg → {userData.targetWeight}kg
          </Text>
        </Card>

        {/* Features */}
        <Card>
          <Text style={styles.featuresLabel}>Features</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <View style={styles.dot} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button variant="accent" onPress={handleStart}>
          Start Training
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
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: '#71717a',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  weightCard: {
    marginBottom: 12,
  },
  weightText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  featuresLabel: {
    fontSize: 14,
    color: '#71717a',
    marginBottom: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  featureText: {
    fontSize: 14,
    color: '#fff',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
  },
});

export default PlanReadyScreen;
