import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useStore } from './src/store';

// Onboarding screens
import {
  WelcomeScreen,
  NameScreen,
  StatsScreen,
  GoalScreen,
  TrainingDaysScreen,
  PlanReadyScreen,
} from './src/screens/Onboarding/OnboardingScreens';

// Main screens
import { HomeScreen } from './src/screens/Home/HomeScreen';
import { AnalyticsScreen } from './src/screens/Home/AnalyticsScreen';
import { ActiveWorkoutScreen } from './src/screens/Workout/ActiveWorkoutScreen';
import { WorkoutCompleteScreen } from './src/screens/Workout/WorkoutCompleteScreen';
import { CustomWorkoutBuilder } from './src/screens/Workout/CustomWorkoutBuilder';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Minimal tab icon component - no emojis, just text
const TabIcon = ({ label, focused }) => {
  return (
    <View style={styles.tabIcon}>
      <View style={[styles.tabDot, focused && styles.tabDotActive]} />
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </View>
  );
};

// Main tabs navigator - only 2 tabs now
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Home" focused={focused} /> }}
      />
      <Tab.Screen 
        name="AnalyticsTab" 
        component={AnalyticsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Analytics" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}

// Splash/Loading screen shown during hydration
const SplashScreen = () => (
  <View style={styles.splashContainer}>
    <Text style={styles.splashTitle}>MyGymProgram</Text>
    <Text style={styles.splashSlogan}>Every rep counts.</Text>
    <ActivityIndicator color="#10b981" style={styles.splashLoader} />
  </View>
);

export default function App() {
  const { loadData, isOnboarded } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for loadData to complete before rendering navigation
  useEffect(() => {
    const hydrate = async () => {
      try {
        await loadData();
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsHydrated(true);
        // Small delay for smooth transition
        setTimeout(() => setIsLoading(false), 300);
      }
    };
    hydrate();
  }, []);

  // Show splash screen while loading
  if (isLoading || !isHydrated) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <SplashScreen />
      </SafeAreaProvider>
    );
  }

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
          initialRouteName={isOnboarded ? 'Main' : 'Welcome'}
        >
          {/* Onboarding Flow */}
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="OnboardingName" component={NameScreen} />
          <Stack.Screen name="OnboardingStats" component={StatsScreen} />
          <Stack.Screen name="OnboardingGoal" component={GoalScreen} />
          <Stack.Screen name="OnboardingTrainingDays" component={TrainingDaysScreen} />
          <Stack.Screen name="OnboardingPlanReady" component={PlanReadyScreen} />

          {/* Main App */}
          <Stack.Screen name="Main" component={MainTabs} />
          
          {/* Workout Screens */}
          <Stack.Screen name="ActiveWorkout" component={ActiveWorkoutScreen} />
          <Stack.Screen 
            name="WorkoutComplete" 
            component={WorkoutCompleteScreen}
            options={{ gestureEnabled: false }}
          />
          
          {/* Custom Workout - now a stack screen, not a tab */}
          <Stack.Screen 
            name="CustomWorkout" 
            component={CustomWorkoutBuilder}
            options={{
              animation: 'slide_from_bottom',
              presentation: 'modal',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#18181b',
    borderTopColor: '#27272a',
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 84 : 64,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  tabDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  tabDotActive: {
    backgroundColor: '#10b981',
  },
  tabLabel: {
    fontSize: 12,
    color: '#71717a',
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#fff',
  },
  // Splash screen styles
  splashContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  splashSlogan: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: '500',
    marginBottom: 32,
  },
  splashLoader: {
    marginTop: 16,
  },
});
