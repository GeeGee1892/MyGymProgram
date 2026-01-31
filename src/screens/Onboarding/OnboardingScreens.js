import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, 
  SafeAreaView, StyleSheet, Image, Alert, Platform
} from 'react-native';
import { useStore } from '../../store';
import { Button } from '../../components';
import { calcBMR, calcCalories, calcProtein } from '../../utils/calculations';

const logo = require('../../../assets/icon.png');

// Progress indicator component - minimal
const Progress = ({ current, total }) => (
  <View style={styles.progressContainer}>
    <View style={styles.progressBar}>
      <View style={[styles.progressFill, { width: `${(current / total) * 100}%` }]} />
    </View>
    <Text style={styles.progressText}>{current}/{total}</Text>
  </View>
);

// Input validation helper
const validateNumeric = (value, min = 0, max = Infinity) => {
  const num = parseFloat(value);
  if (isNaN(num)) return null;
  if (num < min || num > max) return null;
  return num;
};

// Custom dropdown component for Expo compatibility
const Dropdown = ({ value, options, onChange, placeholder }) => {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value);
  
  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity 
        style={styles.dropdownTrigger} 
        onPress={() => setOpen(!open)}
        activeOpacity={0.7}
      >
        <Text style={[styles.dropdownText, !selected && styles.dropdownPlaceholder]}>
          {selected ? selected.label : placeholder}
        </Text>
        <Text style={styles.dropdownArrow}>{open ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      
      {open && (
        <View style={styles.dropdownList}>
          <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.dropdownOption,
                  value === option.value && styles.dropdownOptionActive
                ]}
                onPress={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                <Text style={[
                  styles.dropdownOptionText,
                  value === option.value && styles.dropdownOptionTextActive
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export const WelcomeScreen = ({ navigation }) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.content}>
      <View style={styles.logoSection}>
        <Image source={logo} style={styles.logoImage} />
        <Text style={styles.logoTitle}>MyGymProgram</Text>
        <Text style={styles.logoSlogan}>Every rep counts.</Text>
      </View>
      
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>
          Track your lifts.{'\n'}
          <Text style={styles.heroSubtle}>See your progress.</Text>
        </Text>
      </View>
      
      <View style={styles.featureList}>
        {[
          'Log sets, reps & weight',
          'Swap exercises on the fly',
          'Track PRs automatically'
        ].map((text, i) => (
          <View key={i} style={styles.featureRow}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>{text}</Text>
          </View>
        ))}
      </View>
    </View>
    
    <View style={styles.footer}>
      <Button onPress={() => navigation.navigate('OnboardingName')}>
        Begin Journey
      </Button>
    </View>
  </SafeAreaView>
);

export const NameScreen = ({ navigation }) => {
  const { userData, setUserData } = useStore();
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Progress current={1} total={5} />
        <Text style={styles.title}>What's your name?</Text>
        <Text style={styles.subtitle}>We'll personalize your experience.</Text>
        <TextInput 
          style={styles.textInput} 
          value={userData.name || ''} 
          onChangeText={(text) => setUserData({ name: text })} 
          placeholder="Your name" 
          placeholderTextColor="#52525b" 
          autoFocus
          maxLength={50}
          autoCorrect={false}
        />
      </View>
      <View style={styles.footer}>
        <Button 
          onPress={() => navigation.navigate('OnboardingStats')} 
          disabled={!userData.name?.trim()}
        >
          Continue
        </Button>
      </View>
    </SafeAreaView>
  );
};

export const StatsScreen = ({ navigation }) => {
  const { userData, setUserData } = useStore();
  const [errors, setErrors] = useState({});
  
  const validateFields = () => {
    const newErrors = {};
    
    if (!userData.gender) newErrors.gender = 'Select your sex';
    
    const age = validateNumeric(userData.age, 13, 120);
    if (!age) newErrors.age = 'Valid age required';
    
    const height = validateNumeric(userData.height, 100, 250);
    if (!height) newErrors.height = 'Valid height required';
    
    const weight = validateNumeric(userData.weight, 30, 300);
    if (!weight) newErrors.weight = 'Valid weight required';
    
    const targetWeight = validateNumeric(userData.targetWeight, 30, 300);
    if (!targetWeight) newErrors.targetWeight = 'Valid target required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleContinue = () => {
    if (validateFields()) {
      navigation.navigate('OnboardingGoal');
    }
  };
  
  const isValid = userData.gender && userData.age && userData.height && userData.weight && userData.targetWeight;
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Progress current={2} total={5} />
        <Text style={styles.title}>Your stats</Text>
        <Text style={styles.subtitle}>Used to calculate your targets.</Text>
        
        {/* Sex selector */}
        <Text style={styles.label}>Sex</Text>
        <View style={styles.toggleRow}>
          {['male', 'female'].map((sex) => (
            <TouchableOpacity 
              key={sex} 
              style={[styles.toggleButton, userData.gender === sex && styles.toggleButtonActive]} 
              onPress={() => {
                setUserData({ gender: sex });
                setErrors({ ...errors, gender: null });
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.toggleText, userData.gender === sex && styles.toggleTextActive]}>
                {sex.charAt(0).toUpperCase() + sex.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
        
        {/* Age */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Age</Text>
          <View style={styles.inputRow}>
            <TextInput 
              style={[styles.numericInput, errors.age && styles.inputError]} 
              value={userData.age?.toString() || ''} 
              onChangeText={(text) => {
                setUserData({ age: text });
                setErrors({ ...errors, age: null });
              }} 
              keyboardType="numeric" 
              placeholder="25" 
              placeholderTextColor="#52525b"
              maxLength={3}
            />
            <Text style={styles.unitText}>years</Text>
          </View>
          {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
        </View>
        
        {/* Height */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Height</Text>
          <View style={styles.inputRow}>
            <TextInput 
              style={[styles.numericInput, errors.height && styles.inputError]} 
              value={userData.height?.toString() || ''} 
              onChangeText={(text) => {
                setUserData({ height: text });
                setErrors({ ...errors, height: null });
              }} 
              keyboardType="numeric" 
              placeholder="180" 
              placeholderTextColor="#52525b"
              maxLength={3}
            />
            <Text style={styles.unitText}>cm</Text>
          </View>
          {errors.height && <Text style={styles.errorText}>{errors.height}</Text>}
        </View>
        
        {/* Current weight */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Current weight</Text>
          <View style={styles.inputRow}>
            <TextInput 
              style={[styles.numericInput, errors.weight && styles.inputError]} 
              value={userData.weight?.toString() || ''} 
              onChangeText={(text) => {
                setUserData({ weight: text });
                setErrors({ ...errors, weight: null });
              }} 
              keyboardType="decimal-pad" 
              placeholder="85" 
              placeholderTextColor="#52525b"
              maxLength={5}
            />
            <Text style={styles.unitText}>kg</Text>
          </View>
          {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
        </View>
        
        {/* Target weight */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Target weight</Text>
          <View style={styles.inputRow}>
            <TextInput 
              style={[styles.numericInput, errors.targetWeight && styles.inputError]} 
              value={userData.targetWeight?.toString() || ''} 
              onChangeText={(text) => {
                setUserData({ targetWeight: text });
                setErrors({ ...errors, targetWeight: null });
              }} 
              keyboardType="decimal-pad" 
              placeholder="82" 
              placeholderTextColor="#52525b"
              maxLength={5}
            />
            <Text style={styles.unitText}>kg</Text>
          </View>
          {errors.targetWeight && <Text style={styles.errorText}>{errors.targetWeight}</Text>}
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
      <View style={styles.footer}>
        <Button onPress={handleContinue} disabled={!isValid}>
          Continue
        </Button>
      </View>
    </SafeAreaView>
  );
};

export const GoalScreen = ({ navigation }) => {
  const { userData, setUserData } = useStore();
  
  const goals = [
    { id: 'cut', label: 'Lose fat', description: 'Calorie deficit, preserve muscle' },
    { id: 'bulk', label: 'Build muscle', description: 'Calorie surplus for growth' },
    { id: 'maintain', label: 'Maintain', description: 'Stay at current weight' },
  ];
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Progress current={3} total={5} />
        <Text style={styles.title}>Your goal</Text>
        <Text style={styles.subtitle}>What are you working towards?</Text>
        
        {goals.map((goal) => (
          <TouchableOpacity 
            key={goal.id} 
            style={[styles.goalCard, userData.goal === goal.id && styles.goalCardActive]} 
            onPress={() => setUserData({ goal: goal.id })}
            activeOpacity={0.7}
          >
            <View style={styles.goalContent}>
              <Text style={[styles.goalLabel, userData.goal === goal.id && styles.goalLabelActive]}>
                {goal.label}
              </Text>
              <Text style={[styles.goalDescription, userData.goal === goal.id && styles.goalDescriptionActive]}>
                {goal.description}
              </Text>
            </View>
            {userData.goal === goal.id && (
              <View style={styles.checkCircle}>
                <Text style={styles.checkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.footer}>
        <Button 
          onPress={() => navigation.navigate('OnboardingTrainingDays')} 
          disabled={!userData.goal}
        >
          Continue
        </Button>
      </View>
    </SafeAreaView>
  );
};

export const TrainingDaysScreen = ({ navigation }) => {
  const { userData, setUserData } = useStore();
  
  // Time goal options (6-20 weeks)
  const timeOptions = [];
  for (let i = 6; i <= 20; i++) {
    timeOptions.push({ value: i, label: `${i} weeks` });
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Progress current={4} total={5} />
        <Text style={styles.title}>Training schedule</Text>
        <Text style={styles.subtitle}>How often will you lift?</Text>
        
        {/* Days per week */}
        <Text style={styles.label}>Days per week</Text>
        <View style={styles.daysRow}>
          {[3, 4, 5, 6].map((num) => (
            <TouchableOpacity 
              key={num} 
              style={[styles.dayButton, userData.trainingDays === num && styles.dayButtonActive]} 
              onPress={() => setUserData({ trainingDays: num })}
              activeOpacity={0.7}
            >
              <Text style={[styles.dayText, userData.trainingDays === num && styles.dayTextActive]}>
                {num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Time goal dropdown */}
        <Text style={[styles.label, { marginTop: 24 }]}>Goal timeline</Text>
        <Dropdown
          value={userData.timeGoal}
          options={timeOptions}
          onChange={(val) => setUserData({ timeGoal: val })}
          placeholder="Select duration"
        />
        
        {userData.timeGoal && (
          <View style={styles.timelineCard}>
            <Text style={styles.timelineLabel}>Target completion</Text>
            <Text style={styles.timelineValue}>
              {(() => {
                const targetDate = new Date();
                targetDate.setDate(targetDate.getDate() + (userData.timeGoal * 7));
                return targetDate.toLocaleDateString('en-GB', { 
                  day: 'numeric', 
                  month: 'short', 
                  year: 'numeric' 
                });
              })()}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.footer}>
        <Button 
          onPress={() => navigation.navigate('OnboardingPlanReady')} 
          disabled={!userData.trainingDays || !userData.timeGoal}
        >
          Continue
        </Button>
      </View>
    </SafeAreaView>
  );
};

export const PlanReadyScreen = ({ navigation }) => {
  const { userData, setUserData, completeOnboarding, saveData } = useStore();
  
  // Calculate targets
  const bmr = calcBMR(userData);
  const calories = calcCalories(bmr, userData.goal);
  const protein = calcProtein(userData.weight, userData.goal);
  
  const validCalories = !isNaN(calories) && calories > 0 ? calories : 2200;
  const validProtein = !isNaN(protein) && protein > 0 ? protein : 160;
  
  // Calculate weekly weight change needed
  const weightDiff = parseFloat(userData.weight) - parseFloat(userData.targetWeight);
  const weeklyChange = userData.timeGoal ? (weightDiff / userData.timeGoal).toFixed(2) : 0;
  
  const handleStart = async () => {
    try {
      setUserData({ calories: validCalories, protein: validProtein });
      completeOnboarding();
      if (saveData) await saveData();
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (error) {
      console.error('Onboarding completion error:', error);
      Alert.alert('Error', 'There was a problem saving your data. Please try again.');
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Progress current={5} total={5} />
        <Text style={styles.title}>You're set, {userData.name}</Text>
        <Text style={styles.subtitle}>Here's your personalized plan.</Text>
        
        {/* Macro targets */}
        <View style={styles.macroRow}>
          <View style={styles.macroCard}>
            <Text style={styles.macroValue}>{validCalories}</Text>
            <Text style={styles.macroLabel}>calories/day</Text>
          </View>
          <View style={styles.macroCard}>
            <Text style={styles.macroValue}>{validProtein}g</Text>
            <Text style={styles.macroLabel}>protein/day</Text>
          </View>
        </View>
        
        {/* Weight goal card */}
        <View style={styles.goalSummaryCard}>
          <View style={styles.goalSummaryRow}>
            <View style={styles.goalSummaryItem}>
              <Text style={styles.goalSummaryValue}>{userData.weight}</Text>
              <Text style={styles.goalSummaryUnit}>kg now</Text>
            </View>
            <Text style={styles.goalArrow}>→</Text>
            <View style={styles.goalSummaryItem}>
              <Text style={styles.goalSummaryValue}>{userData.targetWeight}</Text>
              <Text style={styles.goalSummaryUnit}>kg goal</Text>
            </View>
          </View>
          <View style={styles.goalSummaryDivider} />
          <View style={styles.goalSummaryFooter}>
            <Text style={styles.goalSummaryFooterText}>
              {userData.timeGoal} weeks • {Math.abs(weeklyChange)} kg/week
            </Text>
          </View>
        </View>
        
        {/* What's included */}
        <View style={styles.includedCard}>
          <Text style={styles.includedTitle}>What's included</Text>
          {[
            'PPL workout rotation',
            'Exercise swap system',
            'Flexible set logging',
            'Automatic PR tracking',
            'Progress analytics',
          ].map((feature, i) => (
            <View key={i} style={styles.includedRow}>
              <View style={styles.includedCheck}>
                <Text style={styles.includedCheckText}>✓</Text>
              </View>
              <Text style={styles.includedText}>{feature}</Text>
            </View>
          ))}
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
      <View style={styles.footer}>
        <Button onPress={handleStart}>Begin Journey</Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  scrollContent: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  footer: { padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24 },
  
  // Progress
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 32 },
  progressBar: { flex: 1, height: 3, backgroundColor: '#27272a', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#fff', borderRadius: 2 },
  progressText: { color: '#52525b', fontSize: 12, fontVariant: ['tabular-nums'] },
  
  // Welcome screen
  logoSection: { alignItems: 'center', marginTop: 40, marginBottom: 48 },
  logoImage: { width: 72, height: 72, borderRadius: 18, marginBottom: 16 },
  logoTitle: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 4 },
  logoSlogan: { color: '#10b981', fontSize: 16, fontWeight: '500' },
  heroSection: { marginBottom: 48 },
  heroTitle: { fontSize: 32, fontWeight: '700', color: '#fff', lineHeight: 40 },
  heroSubtle: { color: '#52525b' },
  featureList: { gap: 12 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  featureDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10b981' },
  featureText: { color: '#a1a1aa', fontSize: 15 },
  
  // Typography
  title: { fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#71717a', marginBottom: 32 },
  label: { fontSize: 13, color: '#71717a', marginBottom: 8, fontWeight: '500' },
  
  // Inputs
  textInput: { 
    backgroundColor: '#18181b', 
    borderWidth: 1, 
    borderColor: '#27272a', 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    paddingVertical: 14, 
    fontSize: 17, 
    color: '#fff', 
    fontWeight: '500' 
  },
  fieldContainer: { marginBottom: 20 },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  numericInput: { 
    flex: 1, 
    backgroundColor: '#18181b', 
    borderWidth: 1, 
    borderColor: '#27272a', 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    paddingVertical: 14, 
    fontSize: 17, 
    color: '#fff',
    fontWeight: '500',
  },
  inputError: { borderColor: '#ef4444' },
  errorText: { color: '#ef4444', fontSize: 12, marginTop: 4 },
  unitText: { color: '#52525b', fontSize: 14, marginLeft: 12, width: 50 },
  
  // Toggle buttons
  toggleRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  toggleButton: { 
    flex: 1, 
    paddingVertical: 14, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#27272a', 
    backgroundColor: 'transparent', 
    alignItems: 'center' 
  },
  toggleButtonActive: { borderColor: '#fff', backgroundColor: '#fff' },
  toggleText: { color: '#71717a', fontWeight: '600', fontSize: 15 },
  toggleTextActive: { color: '#000' },
  
  // Goal cards
  goalCard: { 
    flexDirection: 'row', 
    padding: 16, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#27272a', 
    backgroundColor: 'transparent', 
    marginBottom: 12, 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  goalCardActive: { borderColor: '#fff', backgroundColor: '#fff' },
  goalContent: { flex: 1 },
  goalLabel: { fontWeight: '600', fontSize: 16, color: '#fff', marginBottom: 2 },
  goalLabelActive: { color: '#000' },
  goalDescription: { fontSize: 13, color: '#71717a' },
  goalDescriptionActive: { color: '#52525b' },
  checkCircle: { 
    width: 24, 
    height: 24, 
    borderRadius: 12, 
    backgroundColor: '#000', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  checkText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  
  // Days selection
  daysRow: { flexDirection: 'row', gap: 12 },
  dayButton: { 
    flex: 1, 
    aspectRatio: 1, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#27272a', 
    backgroundColor: 'transparent', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  dayButtonActive: { borderColor: '#fff', backgroundColor: '#fff' },
  dayText: { fontSize: 24, fontWeight: '700', color: '#71717a' },
  dayTextActive: { color: '#000' },
  
  // Dropdown
  dropdownContainer: { position: 'relative', zIndex: 100 },
  dropdownTrigger: {
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: { fontSize: 17, color: '#fff', fontWeight: '500' },
  dropdownPlaceholder: { color: '#52525b' },
  dropdownArrow: { fontSize: 10, color: '#71717a' },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 12,
    marginTop: 4,
    maxHeight: 200,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  dropdownScroll: { maxHeight: 200 },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
  },
  dropdownOptionActive: { backgroundColor: '#27272a' },
  dropdownOptionText: { fontSize: 15, color: '#a1a1aa' },
  dropdownOptionTextActive: { color: '#fff', fontWeight: '600' },
  
  // Timeline card
  timelineCard: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#27272a',
    alignItems: 'center',
  },
  timelineLabel: { fontSize: 12, color: '#71717a', marginBottom: 4 },
  timelineValue: { fontSize: 18, color: '#10b981', fontWeight: '600' },
  
  // Plan ready - macros
  macroRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  macroCard: { 
    flex: 1, 
    backgroundColor: '#18181b', 
    borderRadius: 14, 
    padding: 16, 
    alignItems: 'center',
    borderWidth: 1, 
    borderColor: '#27272a' 
  },
  macroValue: { color: '#10b981', fontSize: 28, fontWeight: '700', marginBottom: 2 },
  macroLabel: { color: '#71717a', fontSize: 13 },
  
  // Goal summary card
  goalSummaryCard: {
    backgroundColor: '#18181b',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#27272a',
    marginBottom: 12,
  },
  goalSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  goalSummaryItem: { alignItems: 'center' },
  goalSummaryValue: { fontSize: 24, fontWeight: '700', color: '#fff' },
  goalSummaryUnit: { fontSize: 13, color: '#71717a', marginTop: 2 },
  goalArrow: { fontSize: 20, color: '#52525b' },
  goalSummaryDivider: { height: 1, backgroundColor: '#27272a', marginVertical: 12 },
  goalSummaryFooter: { alignItems: 'center' },
  goalSummaryFooterText: { fontSize: 14, color: '#a1a1aa' },
  
  // Included features
  includedCard: {
    backgroundColor: '#18181b',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  includedTitle: { fontSize: 14, color: '#71717a', marginBottom: 12, fontWeight: '500' },
  includedRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  includedCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  includedCheckText: { color: '#10b981', fontSize: 11, fontWeight: '700' },
  includedText: { color: '#e4e4e7', fontSize: 14 },
});
