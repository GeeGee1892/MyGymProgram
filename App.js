import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useStore, WelcomeScreen, NameScreen, StatsScreen, GoalScreen, TrainingDaysScreen, PlanReadyScreen, HomeScreen, ProgressScreen, WorkoutScreen, ActiveWorkoutScreen, WorkoutCompleteScreen } from './src';

const Stack = createNativeStackNavigator();

export default function App() {
  const { loadData, isOnboarded } = useStore();
  useEffect(() => { loadData(); }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#000' }, animation: 'slide_from_right' }} initialRouteName={isOnboarded ? 'Home' : 'Welcome'}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Name" component={NameScreen} />
          <Stack.Screen name="Stats" component={StatsScreen} />
          <Stack.Screen name="Goal" component={GoalScreen} />
          <Stack.Screen name="TrainingDays" component={TrainingDaysScreen} />
          <Stack.Screen name="PlanReady" component={PlanReadyScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Workout" component={WorkoutScreen} />
          <Stack.Screen name="ActiveWorkout" component={ActiveWorkoutScreen} />
          <Stack.Screen name="WorkoutComplete" component={WorkoutCompleteScreen} />
          <Stack.Screen name="Progress" component={ProgressScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
