import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from './src/components';
import { useStore } from './src/store';

// Import screens
// TODO: Import all your screens here
// For now, importing only what we've built
import { DailyCheckInScreen } from './src/screens/Home/DailyCheckInScreen';

// You'll need to migrate these from your existing index.js:
// import { WelcomeScreen, NameScreen, StatsScreen, GoalScreen, ... } from './src/screens/Onboarding';
// import { HomeScreen } from './src/screens/Home';
// import { WorkoutScreen, ActiveWorkoutScreen, WorkoutCompleteScreen } from './src/screens/Workout';
// import { ProgressScreen } from './src/screens/Progress';

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
          initialRouteName={isOnboarded ? 'DailyCheckIn' : 'Welcome'}
        >
          {/* Daily Check-In - NEW! */}
          <Stack.Screen name="DailyCheckIn" component={DailyCheckInScreen} />
          
          {/* TODO: Add all your other screens here */}
          {/* Onboarding flow */}
          {/* <Stack.Screen name="Welcome" component={WelcomeScreen} /> */}
          {/* <Stack.Screen name="Name" component={NameScreen} /> */}
          {/* ... etc */}
          
          {/* Main app */}
          {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
          {/* <Stack.Screen name="Workout" component={WorkoutScreen} /> */}
          {/* ... etc */}
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
