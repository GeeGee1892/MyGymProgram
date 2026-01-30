import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useStore } from './src/store';

// Import onboarding screens
import {
  WelcomeScreen,
  NameScreen,
  StatsScreen,
  GoalScreen,
  TrainingDaysScreen,
  PlanReadyScreen,
} from './src/screens/Onboarding/OnboardingScreens';

// Import main screens
import { HomeScreen } from './src/screens/Home/HomeScreen';
import { WorkoutPreviewScreen } from './src/screens/Workout/WorkoutPreviewScreen';
import { ActiveWorkoutScreen } from './src/screens/Workout/ActiveWorkoutScreen';
import { WorkoutCompleteScreen } from './src/screens/Workout/WorkoutCompleteScreen';
import { CustomWorkoutBuilder } from './src/screens/Workout/CustomWorkoutBuilder';

const Stack = createNativeStackNavigator();

export default function App() {
  const { loadData, isOnboarded } = useStore();

  useEffect(() => {
    loadData();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#000' },
            animation: 'slide_from_right',
          }}
          initialRouteName={isOnboarded ? 'Home' : 'Welcome'}
        >
          {/* Onboarding Flow */}
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="OnboardingName" component={NameScreen} />
          <Stack.Screen name="OnboardingStats" component={StatsScreen} />
          <Stack.Screen name="OnboardingGoal" component={GoalScreen} />
          <Stack.Screen name="OnboardingTrainingDays" component={TrainingDaysScreen} />
          <Stack.Screen name="OnboardingPlanReady" component={PlanReadyScreen} />

          {/* Main App */}
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="WorkoutPreview" component={WorkoutPreviewScreen} />
          <Stack.Screen name="ActiveWorkout" component={ActiveWorkoutScreen} />
          <Stack.Screen name="WorkoutComplete" component={WorkoutCompleteScreen} />
          <Stack.Screen name="CustomWorkout" component={CustomWorkoutBuilder} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
