import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, StyleSheet, Image } from 'react-native';
import { useStore } from '../../store';
import { Button } from '../../components';

const logo = require('../../../assets/icon.png');

const Progress = ({ current, total }) => (
  <View style={styles.progressContainer}>
    <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${(current / total) * 100}%` }]} /></View>
    <Text style={styles.progressText}>{current} of {total}</Text>
  </View>
);

const calcCalories = (data) => {
  const bmr = Math.round((10 * parseFloat(data.weight)) + (6.25 * parseFloat(data.height)) - (5 * parseFloat(data.age)) + (data.gender === 'female' ? -161 : 5));
  return Math.round(bmr * 1.55) + ({ cut: -500, bulk: 300, maintain: 0 }[data.goal] || 0);
};

const calcProtein = (weight, goal) => Math.round(parseFloat(weight) * (goal === 'cut' ? 2.2 : 1.8));

export const WelcomeScreen = ({ navigation }) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.content}>
      <View style={styles.logoRow}>
        <Image source={logo} style={styles.logoImage} />
        <View><Text style={styles.logoTitle}>MyGymProgram</Text><Text style={styles.logoSubtitle}>TRACK • PROGRESS • RESULTS</Text></View>
      </View>
      <Text style={styles.heroTitle}>Track your lifts.{'\n'}<Text style={styles.heroSubtle}>See your progress.</Text></Text>
      <Text style={styles.heroDescription}>Simple workout tracking with smart suggestions.</Text>
      <View style={styles.featureList}>
        {['Log sets, reps & weight', 'Swap exercises on the fly', 'Track PRs & progress'].map((text, i) => (
          <View key={i} style={styles.featureRow}><View style={styles.dot} /><Text style={styles.featureText}>{text}</Text></View>
        ))}
      </View>
    </View>
    <View style={styles.footer}><Button onPress={() => navigation.navigate('OnboardingName')}>Get Started</Button></View>
  </SafeAreaView>
);

export const NameScreen = ({ navigation }) => {
  const { userData, setUserData } = useStore();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Progress current={1} total={5} />
        <Text style={styles.title}>What's your name?</Text>
        <Text style={styles.subtitle}>We'll use this to personalize your experience.</Text>
        <TextInput style={styles.textInput} value={userData.name || ''} onChangeText={(text) => setUserData({ name: text })} placeholder="Enter your name" placeholderTextColor="#52525b" autoFocus />
      </View>
      <View style={styles.footer}><Button onPress={() => navigation.navigate('OnboardingStats')} disabled={!userData.name?.trim()}>Continue</Button></View>
    </SafeAreaView>
  );
};

export const StatsScreen = ({ navigation }) => {
  const { userData, setUserData } = useStore();
  const isValid = userData.gender && userData.age && userData.height && userData.weight && userData.targetWeight;
  const fields = [
    { key: 'age', label: 'Age', unit: 'years', placeholder: '25' },
    { key: 'height', label: 'Height', unit: 'cm', placeholder: '180' },
    { key: 'weight', label: 'Current weight', unit: 'kg', placeholder: '85' },
    { key: 'targetWeight', label: 'Target weight', unit: 'kg', placeholder: '82' },
  ];
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Progress current={2} total={5} />
        <Text style={styles.title}>Your stats</Text>
        <Text style={styles.subtitle}>Used to calculate your targets.</Text>
        <Text style={styles.label}>Sex</Text>
        <View style={styles.toggleRow}>
          {['male', 'female'].map((sex) => (
            <TouchableOpacity key={sex} style={[styles.toggleButton, userData.gender === sex && styles.toggleButtonActive]} onPress={() => setUserData({ gender: sex })}>
              <Text style={[styles.toggleText, userData.gender === sex && styles.toggleTextActive]}>{sex.charAt(0).toUpperCase() + sex.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {fields.map((field) => (
          <View key={field.key} style={styles.fieldContainer}>
            <Text style={styles.label}>{field.label}</Text>
            <View style={styles.inputRow}>
              <TextInput style={styles.numericInput} value={userData[field.key]?.toString() || ''} onChangeText={(text) => setUserData({ [field.key]: text })} keyboardType="numeric" placeholder={field.placeholder} placeholderTextColor="#52525b" />
              <Text style={styles.unitText}>{field.unit}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}><Button onPress={() => navigation.navigate('OnboardingGoal')} disabled={!isValid}>Continue</Button></View>
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
          <TouchableOpacity key={goal.id} style={[styles.goalCard, userData.goal === goal.id && styles.goalCardActive]} onPress={() => setUserData({ goal: goal.id })}>
            <View style={styles.goalContent}>
              <Text style={[styles.goalLabel, userData.goal === goal.id && styles.goalLabelActive]}>{goal.label}</Text>
              <Text style={[styles.goalDescription, userData.goal === goal.id && styles.goalDescriptionActive]}>{goal.description}</Text>
            </View>
            {userData.goal === goal.id && <View style={styles.checkCircle}><Text style={styles.checkText}>✓</Text></View>}
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.footer}><Button onPress={() => navigation.navigate('OnboardingTrainingDays')} disabled={!userData.goal}>Continue</Button></View>
    </SafeAreaView>
  );
};

export const TrainingDaysScreen = ({ navigation }) => {
  const { userData, setUserData } = useStore();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Progress current={4} total={5} />
        <Text style={styles.title}>Training days</Text>
        <Text style={styles.subtitle}>How many days per week?</Text>
        <View style={styles.daysRow}>
          {[3, 4, 5, 6].map((days) => (
            <TouchableOpacity key={days} style={[styles.dayButton, userData.trainingDaysPerWeek === days && styles.dayButtonActive]} onPress={() => setUserData({ trainingDaysPerWeek: days })}>
              <Text style={[styles.dayText, userData.trainingDaysPerWeek === days && styles.dayTextActive]}>{days}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.tipCard}><Text style={styles.tipText}><Text style={styles.tipHighlight}>Tip: </Text>3-4 days is optimal. Recovery matters.</Text></View>
      </View>
      <View style={styles.footer}><Button onPress={() => navigation.navigate('OnboardingPlanReady')} disabled={!userData.trainingDaysPerWeek}>Continue</Button></View>
    </SafeAreaView>
  );
};

export const PlanReadyScreen = ({ navigation }) => {
  const { userData, setUserData, completeOnboarding } = useStore();
  const calories = calcCalories(userData);
  const protein = calcProtein(userData.weight, userData.goal);
  const handleStart = () => {
    setUserData({ calories, protein });
    completeOnboarding();
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Progress current={5} total={5} />
        <Text style={styles.title}>You're all set, {userData.name}!</Text>
        <Text style={styles.subtitle}>Here's your personalized plan.</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}><Text style={styles.statLabel}>Daily Calories</Text><Text style={styles.statValue}>{calories}</Text></View>
          <View style={styles.statCard}><Text style={styles.statLabel}>Daily Protein</Text><Text style={styles.statValue}>{protein}g</Text></View>
        </View>
        <View style={styles.weightCard}><Text style={styles.weightLabel}>Weight Goal</Text><Text style={styles.weightValue}>{userData.weight}kg → {userData.targetWeight}kg</Text></View>
        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>What you get</Text>
          {['Smart PPL workout rotation', 'Swap exercises anytime', 'Log sets in any order', 'Automatic PR tracking', 'Weekly progress reviews'].map((feature, i) => (
            <View key={i} style={styles.featureRow}><View style={styles.dot} /><Text style={styles.featureItemText}>{feature}</Text></View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.footer}><Button onPress={handleStart}>Start Training</Button></View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  scrollContent: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  footer: { padding: 24, paddingBottom: 40 },
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 32 },
  progressBar: { flex: 1, height: 4, backgroundColor: '#27272a', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#fff', borderRadius: 2 },
  progressText: { color: '#52525b', fontSize: 12 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 48 },
  logoImage: { width: 56, height: 56, borderRadius: 14 },
  logoTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  logoSubtitle: { color: '#71717a', fontSize: 10, letterSpacing: 2, marginTop: 2 },
  heroTitle: { fontSize: 36, fontWeight: '700', color: '#fff', lineHeight: 44, marginBottom: 16 },
  heroSubtle: { color: '#71717a' },
  heroDescription: { fontSize: 18, color: '#71717a', marginBottom: 48 },
  featureList: { gap: 16 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10b981' },
  featureText: { color: '#fff', fontSize: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#71717a', marginBottom: 32 },
  label: { fontSize: 14, color: '#71717a', marginBottom: 8 },
  textInput: { backgroundColor: '#18181b', borderWidth: 1, borderColor: '#27272a', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 18, color: '#fff', fontWeight: '500' },
  toggleRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  toggleButton: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#27272a', backgroundColor: 'transparent', alignItems: 'center' },
  toggleButtonActive: { borderColor: '#fff', backgroundColor: '#fff' },
  toggleText: { color: '#a1a1aa', fontWeight: '500', fontSize: 16 },
  toggleTextActive: { color: '#000' },
  fieldContainer: { marginBottom: 20 },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  numericInput: { flex: 1, backgroundColor: '#18181b', borderWidth: 1, borderColor: '#27272a', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 18, color: '#fff' },
  unitText: { color: '#52525b', fontSize: 14, marginLeft: 12, width: 50 },
  goalCard: { flexDirection: 'row', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#27272a', backgroundColor: 'transparent', marginBottom: 12, justifyContent: 'space-between', alignItems: 'center' },
  goalCardActive: { borderColor: '#fff', backgroundColor: '#fff' },
  goalContent: { flex: 1 },
  goalLabel: { fontWeight: '600', fontSize: 16, color: '#fff', marginBottom: 4 },
  goalLabelActive: { color: '#000' },
  goalDescription: { fontSize: 14, color: '#71717a' },
  goalDescriptionActive: { color: '#52525b' },
  checkCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  checkText: { color: '#fff', fontSize: 12 },
  daysRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  dayButton: { flex: 1, aspectRatio: 1, borderRadius: 12, borderWidth: 1, borderColor: '#27272a', backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
  dayButtonActive: { borderColor: '#fff', backgroundColor: '#fff' },
  dayText: { fontSize: 24, fontWeight: '700', color: '#a1a1aa' },
  dayTextActive: { color: '#000' },
  tipCard: { backgroundColor: '#18181b', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#27272a' },
  tipText: { color: '#a1a1aa', fontSize: 14, lineHeight: 20 },
  tipHighlight: { color: '#10b981' },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  statCard: { flex: 1, backgroundColor: '#18181b', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#27272a' },
  statLabel: { color: '#71717a', fontSize: 14, marginBottom: 4 },
  statValue: { color: '#10b981', fontSize: 28, fontWeight: '700' },
  weightCard: { backgroundColor: '#18181b', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#27272a', marginBottom: 12 },
  weightLabel: { color: '#71717a', fontSize: 14, marginBottom: 4 },
  weightValue: { color: '#fff', fontSize: 20, fontWeight: '700' },
  featuresCard: { backgroundColor: '#18181b', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#27272a', marginBottom: 24 },
  featuresTitle: { color: '#71717a', fontSize: 14, marginBottom: 16 },
  featureItemText: { color: '#fff', fontSize: 14 },
});
