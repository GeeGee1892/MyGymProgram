import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Button } from '../components';
import { useStore } from '../hooks/useStore';
import { calculateVolume, formatNumber } from '../utils/calculations';

const WorkoutCompleteScreen = ({ navigation }) => {
  const { userData, currentSets } = useStore();

  const totalSets = currentSets.length;
  const totalVolume = calculateVolume(currentSets);

  const handleDone = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.checkmark}>✓</Text>
        </View>

        {/* Message */}
        <Text style={styles.title}>Great work, {userData.name}!</Text>
        <Text style={styles.subtitle}>Workout complete.</Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalSets}</Text>
            <Text style={styles.statLabel}>sets</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatNumber(totalVolume)}</Text>
            <Text style={styles.statLabel}>kg</Text>
          </View>
        </View>

        {/* Done Button */}
        <Button onPress={handleDone} style={styles.button}>
          Done
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  checkmark: {
    fontSize: 36,
    color: '#000',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#71717a',
    marginBottom: 32,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 48,
    marginBottom: 40,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  statLabel: {
    fontSize: 14,
    color: '#71717a',
  },
  button: {
    width: '100%',
    maxWidth: 280,
  },
});

export default WorkoutCompleteScreen;
