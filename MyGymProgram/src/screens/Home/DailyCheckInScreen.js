import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useStore } from '../../store';
import { Button } from '../../components';
import { fmtDate, getGreeting } from '../../utils';

export const DailyCheckInScreen = ({ navigation }) => {
  const { userData, addDailyCheckIn, dailyCheckIns } = useStore();
  const [weight, setWeight] = useState(userData.weight?.toString() || '');
  const [sleep, setSleep] = useState(7);
  const [hitProtein, setHitProtein] = useState(false);
  
  // Check if already checked in today
  const today = new Date().toDateString();
  const hasCheckedInToday = dailyCheckIns.some(
    (c) => new Date(c.date).toDateString() === today
  );
  
  useEffect(() => {
    if (hasCheckedInToday) {
      // Already checked in, go to home
      navigation.replace('Home');
    }
  }, []);
  
  const handleSubmit = () => {
    if (!weight) {
      alert('Please enter your weight');
      return;
    }
    
    addDailyCheckIn({
      weight: parseFloat(weight),
      sleep,
      hitProtein,
    });
    
    navigation.replace('Home');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()}, {userData.name}</Text>
          <Text style={styles.subtitle}>Let's start the day right</Text>
        </View>
        
        {/* Weight input */}
        <View style={styles.section}>
          <Text style={styles.label}>Today's Weight (kg)</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            placeholder={userData.weight?.toString() || '85.0'}
            placeholderTextColor="#52525b"
            keyboardType="decimal-pad"
          />
          
          {/* 7-day average if available */}
          {dailyCheckIns.length >= 7 && (
            <Text style={styles.hint}>
              7-day avg: {
                (dailyCheckIns.slice(-7).reduce((sum, c) => sum + c.weight, 0) / 7).toFixed(1)
              }kg
            </Text>
          )}
        </View>
        
        {/* Sleep rating */}
        <View style={styles.section}>
          <Text style={styles.label}>How did you sleep? (1-10)</Text>
          <View style={styles.sleepScale}>
            {[...Array(10)].map((_, i) => {
              const value = i + 1;
              return (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.sleepButton,
                    sleep === value && styles.sleepButtonSelected,
                  ]}
                  onPress={() => setSleep(value)}
                >
                  <Text style={[
                    styles.sleepButtonText,
                    sleep === value && styles.sleepButtonTextSelected,
                  ]}>
                    {value}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={styles.hint}>
            {sleep <= 4 ? '😴 Poor sleep - take it easy today' : 
             sleep <= 7 ? '😊 Decent rest' :
             '✨ Great sleep! You\'re ready to crush it'}
          </Text>
        </View>
        
        {/* Protein hit */}
        <View style={styles.section}>
          <Text style={styles.label}>Did you hit your protein target yesterday?</Text>
          <Text style={styles.proteinTarget}>Target: {userData.protein}g</Text>
          
          <View style={styles.proteinButtons}>
            <TouchableOpacity
              style={[
                styles.proteinButton,
                !hitProtein && styles.proteinButtonSelected,
              ]}
              onPress={() => setHitProtein(false)}
            >
              <Text style={[
                styles.proteinButtonText,
                !hitProtein && styles.proteinButtonTextSelected,
              ]}>
                No
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.proteinButton,
                hitProtein && styles.proteinButtonSelected,
              ]}
              onPress={() => setHitProtein(true)}
            >
              <Text style={[
                styles.proteinButtonText,
                hitProtein && styles.proteinButtonTextSelected,
              ]}>
                Yes 💪
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  header: {
    marginBottom: 40,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 16,
    color: '#a1a1aa',
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#a1a1aa',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  hint: {
    fontSize: 13,
    color: '#71717a',
    marginTop: 8,
    lineHeight: 18,
  },
  sleepScale: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sleepButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#27272a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  sleepButtonSelected: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: '#10b981',
  },
  sleepButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#71717a',
  },
  sleepButtonTextSelected: {
    color: '#10b981',
  },
  proteinTarget: {
    fontSize: 14,
    color: '#10b981',
    marginBottom: 16,
  },
  proteinButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  proteinButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#27272a',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  proteinButtonSelected: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: '#10b981',
  },
  proteinButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#a1a1aa',
  },
  proteinButtonTextSelected: {
    color: '#10b981',
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#18181b',
  },
});
