import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import { Button, Card, ProgressBar } from '../components';
import { useStore } from '../store';
import { calculateCalories, calculateProtein } from '../utils';

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  footer: { paddingHorizontal: 24, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#71717a', marginBottom: 24 },
  label: { fontSize: 14, color: '#71717a', marginBottom: 8 },
  input: { backgroundColor: '#18181b', borderWidth: 1, borderColor: '#27272a', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 18, color: '#fff', fontWeight: '500' },
  row: { flexDirection: 'row', gap: 12 },
  flexBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#27272a', alignItems: 'center' },
  flexBtnActive: { backgroundColor: '#fff', borderColor: '#fff' },
  flexBtnText: { color: '#a1a1aa', fontWeight: '500', fontSize: 16 },
  flexBtnTextActive: { color: '#000' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10b981' },
});

export const WelcomeScreen = ({ navigation }) => (
  <SafeAreaView style={s.container}>
    <View style={[s.content, { paddingTop: 60 }]}>
      <View style={[s.row, { alignItems: 'center', marginBottom: 48 }]}>
        <View style={{ width: 48, height: 48, backgroundColor: '#fff', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#000', fontSize: 20, fontWeight: '900' }}>K</Text>
        </View>
        <View><Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>KEYSTONE</Text><Text style={{ color: '#71717a', fontSize: 10, letterSpacing: 4 }}>FITNESS</Text></View>
      </View>
      <Text style={{ fontSize: 36, fontWeight: '700', color: '#fff', lineHeight: 44, marginBottom: 16 }}>Track your lifts.{'\n'}<Text style={{ color: '#71717a' }}>See your progress.</Text></Text>
      <Text style={{ fontSize: 18, color: '#71717a', marginBottom: 48 }}>Simple workout tracking with smart suggestions.</Text>
      {['Log sets, reps & weight', 'Swap exercises on the fly', 'Track PRs & progress'].map((t, i) => (
        <View key={i} style={[s.row, { alignItems: 'center', marginBottom: 16 }]}><View style={s.dot} /><Text style={{ color: '#fff', fontSize: 16 }}>{t}</Text></View>
      ))}
    </View>
    <View style={s.footer}><Button onPress={() => navigation.navigate('Name')}>Get Started</Button></View>
  </SafeAreaView>
);

export const NameScreen = ({ navigation }) => {
  const { userData, setUserData } = useStore();
  return (
    <SafeAreaView style={s.container}>
      <View style={s.content}>
        <View style={{ marginBottom: 32 }}><ProgressBar current={1} total={5} /></View>
        <Text style={s.title}>What's your name?</Text>
        <Text style={s.subtitle}>We'll use this to personalize your experience.</Text>
        <TextInput style={s.input} value={userData.name} onChangeText={(t) => setUserData({ name: t })} placeholder="Enter your name" placeholderTextColor="#52525b" autoFocus />
      </View>
      <View style={s.footer}><Button onPress={() => navigation.navigate('Stats')} disabled={!userData.name.trim()}>Continue</Button></View>
    </SafeAreaView>
  );
};

export const StatsScreen = ({ navigation }) => {
  const { userData, setUserData } = useStore();
  const valid = userData.sex && userData.age && userData.height && userData.weight && userData.targetWeight;
  const fields = [{ k: 'age', l: 'Age', u: 'years' }, { k: 'height', l: 'Height', u: 'cm' }, { k: 'weight', l: 'Current weight', u: 'kg' }, { k: 'targetWeight', l: 'Target weight', u: 'kg' }];
  return (
    <SafeAreaView style={s.container}>
      <ScrollView style={s.content} showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: 32 }}><ProgressBar current={2} total={5} /></View>
        <Text style={s.title}>Your stats</Text>
        <Text style={s.subtitle}>Used to calculate your targets.</Text>
        <Text style={s.label}>Sex</Text>
        <View style={[s.row, { marginBottom: 20 }]}>
          {['male', 'female'].map((x) => (
            <TouchableOpacity key={x} style={[s.flexBtn, userData.sex === x && s.flexBtnActive]} onPress={() => setUserData({ sex: x })}>
              <Text style={[s.flexBtnText, userData.sex === x && s.flexBtnTextActive]}>{x.charAt(0).toUpperCase() + x.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {fields.map((f) => (
          <View key={f.k} style={{ marginBottom: 20 }}>
            <Text style={s.label}>{f.l}</Text>
            <View style={{ position: 'relative' }}>
              <TextInput style={s.input} value={userData[f.k]} onChangeText={(t) => setUserData({ [f.k]: t })} keyboardType="numeric" />
              <Text style={{ position: 'absolute', right: 16, top: '50%', transform: [{ translateY: -8 }], color: '#52525b' }}>{f.u}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={[s.footer, { paddingTop: 16 }]}><Button onPress={() => navigation.navigate('Goal')} disabled={!valid}>Continue</Button></View>
    </SafeAreaView>
  );
};

export const GoalScreen = ({ navigation }) => {
  const { userData, setUserData } = useStore();
  const goals = [{ id: 'cut', l: 'Lose fat', d: 'Calorie deficit, preserve muscle' }, { id: 'bulk', l: 'Build muscle', d: 'Calorie surplus for growth' }, { id: 'maintain', l: 'Maintain', d: 'Stay at current weight' }];
  return (
    <SafeAreaView style={s.container}>
      <View style={s.content}>
        <View style={{ marginBottom: 32 }}><ProgressBar current={3} total={5} /></View>
        <Text style={s.title}>Your goal</Text>
        <Text style={s.subtitle}>What are you working towards?</Text>
        {goals.map((g) => (
          <TouchableOpacity key={g.id} style={[s.row, { padding: 16, borderRadius: 12, borderWidth: 1, borderColor: userData.goal === g.id ? '#fff' : '#27272a', backgroundColor: userData.goal === g.id ? '#fff' : 'transparent', marginBottom: 12, justifyContent: 'space-between', alignItems: 'center' }]} onPress={() => setUserData({ goal: g.id })}>
            <View><Text style={{ fontWeight: '600', fontSize: 16, color: userData.goal === g.id ? '#000' : '#fff' }}>{g.l}</Text><Text style={{ fontSize: 14, color: userData.goal === g.id ? '#52525b' : '#71717a' }}>{g.d}</Text></View>
            {userData.goal === g.id && <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#fff', fontSize: 12 }}>✓</Text></View>}
          </TouchableOpacity>
        ))}
      </View>
      <View style={s.footer}><Button onPress={() => navigation.navigate('TrainingDays')} disabled={!userData.goal}>Continue</Button></View>
    </SafeAreaView>
  );
};

export const TrainingDaysScreen = ({ navigation }) => {
  const { userData, setUserData } = useStore();
  return (
    <SafeAreaView style={s.container}>
      <View style={s.content}>
        <View style={{ marginBottom: 32 }}><ProgressBar current={4} total={5} /></View>
        <Text style={s.title}>Training days</Text>
        <Text style={s.subtitle}>How many days per week?</Text>
        <View style={[s.row, { marginBottom: 24 }]}>
          {[3, 4, 5, 6].map((d) => (
            <TouchableOpacity key={d} style={[s.flexBtn, { aspectRatio: 1 }, userData.trainingDays === d && s.flexBtnActive]} onPress={() => setUserData({ trainingDays: d })}>
              <Text style={[{ fontSize: 20, fontWeight: '700' }, userData.trainingDays === d ? { color: '#000' } : { color: '#a1a1aa' }]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Card><Text style={{ color: '#a1a1aa', fontSize: 14 }}><Text style={{ color: '#10b981' }}>Tip: </Text>3-4 days is optimal. Recovery matters.</Text></Card>
      </View>
      <View style={s.footer}><Button onPress={() => navigation.navigate('PlanReady')} disabled={!userData.trainingDays}>Continue</Button></View>
    </SafeAreaView>
  );
};

export const PlanReadyScreen = ({ navigation }) => {
  const { userData, completeOnboarding } = useStore();
  const cals = calculateCalories(userData);
  const prot = calculateProtein(userData.weight, userData.goal);
  const features = ['Smart workout rotation', 'Swap exercises anytime', 'Log in any order', 'Automatic PR tracking'];
  const handleStart = () => { completeOnboarding(); navigation.reset({ index: 0, routes: [{ name: 'Home' }] }); };
  return (
    <SafeAreaView style={s.container}>
      <ScrollView style={s.content} showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: 32 }}><ProgressBar current={5} total={5} /></View>
        <Text style={s.title}>You're all set, {userData.name}!</Text>
        <Text style={s.subtitle}>Here's your plan.</Text>
        <View style={[s.row, { marginBottom: 12 }]}>
          <Card style={{ flex: 1 }}><Text style={{ color: '#71717a', fontSize: 14 }}>Calories</Text><Text style={{ color: '#fff', fontSize: 24, fontWeight: '700' }}>{cals}</Text></Card>
          <Card style={{ flex: 1 }}><Text style={{ color: '#71717a', fontSize: 14 }}>Protein</Text><Text style={{ color: '#fff', fontSize: 24, fontWeight: '700' }}>{prot}g</Text></Card>
        </View>
        <Card style={{ marginBottom: 12 }}><Text style={{ color: '#71717a', fontSize: 14 }}>Current → Target</Text><Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>{userData.weight}kg → {userData.targetWeight}kg</Text></Card>
        <Card>
          <Text style={{ color: '#71717a', fontSize: 14, marginBottom: 12 }}>Features</Text>
          {features.map((f, i) => <View key={i} style={[s.row, { alignItems: 'center', marginBottom: 8 }]}><View style={s.dot} /><Text style={{ color: '#fff', fontSize: 14 }}>{f}</Text></View>)}
        </Card>
      </ScrollView>
      <View style={[s.footer, { paddingTop: 16 }]}><Button variant="accent" onPress={handleStart}>Start Training</Button></View>
    </SafeAreaView>
  );
};
