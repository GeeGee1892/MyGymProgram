import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from './src/components';
import { useStore } from './src/store';

// Import available screens
import { DailyCheckInScreen } from './src/screens/Home/DailyCheckInScreen';
import { ActiveWorkoutScreen } from './src/screens/Workout/ActiveWorkoutScreen';
import { CustomWorkoutBuilder } from './src/screens/Workout/CustomWorkoutBuilder';

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
            animation: 'slide_from_right'
          }}
          initialRouteName="DailyCheckIn"
        >
          {/* Daily Check-In - Home Screen */}
          <Stack.Screen name="DailyCheckIn" component={DailyCheckInScreen} />
          
          {/* Workout Screens */}
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
