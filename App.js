import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from './src/components';
import { useStore } from './src/store';

// Import screens
import { DailyCheckInScreen } from './src/screens/Home/DailyCheckInScreen';
import { ActiveWorkoutScreen } from './src/screens/Workout/ActiveWorkoutScreen';
import { CustomWorkoutBuilder } from './src/screens/Workout/CustomWorkoutBuilder';

// Import onboarding screens
import {
  WelcomeScreen,
  NameScreen,
  StatsScreen,
  GoalScreen,
  TrainingDaysScreen,
  PlanReadyScreen,
} from './src/screens/Onboarding/OnboardingScreens';

const Stack = createNativeStackNavigator();

function AppContent() {
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
          initialRouteName={isOnboarded ? 'DailyCheckIn' : 'Welcome'}
        >
          {/* Onboarding Flow */}
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="OnboardingName" component={NameScreen} />
          <Stack.Screen name="OnboardingStats" component={StatsScreen} />
          <Stack.Screen name="OnboardingGoal" component={GoalScreen} />
          <Stack.Screen name="OnboardingTrainingDays" component={TrainingDaysScreen} />
          <Stack.Screen name="OnboardingPlanReady" component={PlanReadyScreen} />

          {/* Main App Screens */}
          <Stack.Screen name="DailyCheckIn" component={DailyCheckInScreen} />
          <Stack.Screen name="ActiveWorkout" component={ActiveWorkoutScreen} />
          <Stack.Screen name="CustomWorkout" component={CustomWorkoutBuilder} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
