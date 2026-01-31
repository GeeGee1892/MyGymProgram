import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
import { CustomWorkoutBuilder } from './src/screens/Workout/CustomWorkoutBuilder';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab icon
const TabIcon = ({ label, focused }) => {
  const icons = { Home: '🏠', Analytics: '📊', Builder: '⚙️' };
  return (
    <View style={styles.tabIcon}>
      <Text style={styles.tabEmoji}>{icons[label]}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </View>
  );
};

// Main tabs
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
      <Tab.Screen 
        name="BuilderTab" 
        component={CustomWorkoutBuilder}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Builder" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}

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
          initialRouteName={isOnboarded ? 'Main' : 'Welcome'}
        >
          {/* Onboarding */}
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="OnboardingName" component={NameScreen} />
          <Stack.Screen name="OnboardingStats" component={StatsScreen} />
          <Stack.Screen name="OnboardingGoal" component={GoalScreen} />
          <Stack.Screen name="OnboardingTrainingDays" component={TrainingDaysScreen} />
          <Stack.Screen name="OnboardingPlanReady" component={PlanReadyScreen} />

          {/* Main App with Tabs */}
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="Home" component={MainTabs} />
          
          {/* Workout screens */}
          <Stack.Screen name="ActiveWorkout" component={ActiveWorkoutScreen} />
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
    height: 80,
    paddingTop: 8,
    paddingBottom: 20,
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 11,
    color: '#71717a',
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#fff',
  },
});
