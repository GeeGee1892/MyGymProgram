# Migration Guide: Integrating Your Existing Screens

This guide helps you integrate your existing screens from the uploaded `index.js` with the new refactored architecture.

## 🎯 Overview

You have a working app with screens that need to be:
1. Separated into individual files
2. Updated to use new components and store
3. Enhanced with new features

---

## 📋 Screen Migration Checklist

### Onboarding Screens
- [ ] WelcomeScreen → `src/screens/Onboarding/WelcomeScreen.js`
- [ ] NameScreen → `src/screens/Onboarding/NameScreen.js`
- [ ] StatsScreen → `src/screens/Onboarding/StatsScreen.js`
- [ ] GoalScreen → `src/screens/Onboarding/GoalScreen.js`
- [ ] TrainingDaysScreen → `src/screens/Onboarding/TrainingDaysScreen.js`
- [ ] PlanReadyScreen → `src/screens/Onboarding/PlanReadyScreen.js`

### Main App Screens
- [ ] HomeScreen → `src/screens/Home/HomeScreen.js`
- [ ] WorkoutScreen → `src/screens/Workout/WorkoutScreen.js`
- [ ] ActiveWorkoutScreen → `src/screens/Workout/ActiveWorkoutScreen.js`
- [ ] WorkoutCompleteScreen → `src/screens/Workout/WorkoutCompleteScreen.js`
- [ ] ProgressScreen → `src/screens/Progress/ProgressScreen.js`

---

## 🔧 Step-by-Step Migration

### Step 1: Extract Each Screen

**Before (in single index.js):**
```javascript
export const WelcomeScreen = ({ navigation }) => {
  // ... component code
};

export const NameScreen = ({ navigation }) => {
  // ... component code
};
```

**After (separate files):**

`src/screens/Onboarding/WelcomeScreen.js`:
```javascript
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Button } from '../../components';

export const WelcomeScreen = ({ navigation }) => {
  // ... component code with Button instead of Btn
};

const styles = StyleSheet.create({
  // ... styles
});
```

### Step 2: Update Imports in Each Screen

**Old imports:**
```javascript
// Nothing - everything was in one file
```

**New imports:**
```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Button, ExerciseCard, PRModal } from '../../components';
import { useStore } from '../../store';
import { fmtNum, fmtDate, calcVolume } from '../../utils';
import { exerciseDB, alternatives } from '../../data';
```

### Step 3: Replace Inline Components

#### Button Component

**Old:**
```javascript
const Btn = ({ children, onPress, v = 'primary', sz = 'default', disabled, style }) => {
  // ... inline button logic
};

<Btn onPress={handleNext}>Continue</Btn>
```

**New:**
```javascript
import { Button } from '../../components';

<Button onPress={handleNext}>Continue</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost" size="sm">Small Ghost</Button>
```

#### Exercise Cards

**Old:**
```javascript
{currentExercises.map((ex, i) => (
  <TouchableOpacity key={i} style={styles.card}>
    <Text>{exerciseDB[ex.id]?.name}</Text>
    {/* ... */}
  </TouchableOpacity>
))}
```

**New:**
```javascript
import { ExerciseCard } from '../../components';

{currentExercises.map((ex, i) => (
  <ExerciseCard
    key={i}
    exercise={ex}
    index={i}
    onPress={() => handleExercisePress(ex)}
    onSwap={(idx) => setSwapIdx(idx)}
    showSwap={true}
    suggestion={getProgressiveSuggestions(ex.id)}
  />
))}
```

### Step 4: Add New Features to Existing Screens

#### HomeScreen Enhancements

Add weekly review widget:
```javascript
import { useStore } from '../../store';
import { fmtDate } from '../../utils';

export const HomeScreen = ({ navigation }) => {
  const { userData, weeklyReviews, generateWeeklyReview, lastReviewDate } = useStore();
  
  useEffect(() => {
    // Check if weekly review is due
    if (!lastReviewDate) {
      generateWeeklyReview();
      return;
    }
    
    const daysSince = (Date.now() - new Date(lastReviewDate)) / (1000 * 60 * 60 * 24);
    if (daysSince >= 7) {
      generateWeeklyReview();
      // Optionally show modal with review
    }
  }, []);
  
  const latestReview = weeklyReviews[weeklyReviews.length - 1];
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Existing content */}
      
      {/* NEW: Weekly review widget */}
      {latestReview && (
        <View style={styles.reviewWidget}>
          <Text style={styles.reviewTitle}>This Week</Text>
          <View style={styles.reviewStats}>
            <View style={styles.reviewStat}>
              <Text style={styles.reviewValue}>{latestReview.workoutsCompleted}</Text>
              <Text style={styles.reviewLabel}>Workouts</Text>
            </View>
            <View style={styles.reviewStat}>
              <Text style={styles.reviewValue}>
                {latestReview.weightChange > 0 ? '+' : ''}
                {latestReview.weightChange.toFixed(1)}kg
              </Text>
              <Text style={styles.reviewLabel}>Weight Change</Text>
            </View>
            {latestReview.calorieAdjustment.adjustment !== 0 && (
              <View style={styles.reviewStat}>
                <Text style={styles.reviewValue}>
                  {latestReview.calorieAdjustment.adjustment > 0 ? '+' : ''}
                  {latestReview.calorieAdjustment.adjustment}
                </Text>
                <Text style={styles.reviewLabel}>Cal Adjustment</Text>
              </View>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};
```

#### WorkoutScreen Enhancements

Add cardio button and progressive suggestions:
```javascript
import { ExerciseCard, CardioPickerModal } from '../../components';
import { useStore } from '../../store';

export const WorkoutScreen = ({ navigation, route }) => {
  const { currentExercises, swapExercise, addExercise, getProgressiveSuggestions } = useStore();
  const [showCardio, setShowCardio] = useState(false);
  
  const handleAddCardio = (cardioData) => {
    addExercise(cardioData);
    setShowCardio(false);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Existing content */}
      
      <ScrollView>
        {currentExercises.map((ex, i) => (
          <ExerciseCard
            key={i}
            exercise={ex}
            index={i}
            onPress={() => setSelectedEx(exerciseDB[ex.id])}
            onSwap={(idx) => setSwapIdx(idx)}
            suggestion={getProgressiveSuggestions(ex.id)}
          />
        ))}
        
        {/* NEW: Add cardio button */}
        <TouchableOpacity 
          style={styles.addCardioButton}
          onPress={() => setShowCardio(true)}
        >
          <Text style={styles.addCardioText}>+ Add Cardio</Text>
        </TouchableOpacity>
      </ScrollView>
      
      {/* NEW: Cardio picker modal */}
      <CardioPickerModal
        visible={showCardio}
        onClose={() => setShowCardio(false)}
        onSelect={handleAddCardio}
      />
    </SafeAreaView>
  );
};
```

#### ActiveWorkoutScreen Enhancements

Add draft saving:
```javascript
import { useStore } from '../../store';

export const ActiveWorkoutScreen = ({ navigation }) => {
  const { currentSets, saveDraftWorkout, completeWorkout } = useStore();
  
  useEffect(() => {
    // Auto-save draft every 30 seconds
    const interval = setInterval(() => {
      if (currentSets.length > 0) {
        saveDraftWorkout();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [currentSets]);
  
  const handleEndWorkout = () => {
    if (currentSets.length > 0) {
      Alert.alert(
        'Save Draft?',
        'You have incomplete sets. Save as draft?',
        [
          { text: 'Discard', onPress: () => navigation.goBack() },
          { text: 'Save Draft', onPress: () => {
            saveDraftWorkout();
            navigation.goBack();
          }},
        ]
      );
    } else {
      navigation.goBack();
    }
  };
  
  // ... rest of component
};
```

#### WorkoutCompleteScreen Enhancements

Add PR modal:
```javascript
import { PRModal } from '../../components';
import { useStore } from '../../store';

export const WorkoutCompleteScreen = ({ navigation }) => {
  const { lastWorkoutPRs } = useStore();
  const [showPR, setShowPR] = useState(false);
  const [currentPR, setCurrentPR] = useState(null);
  
  useEffect(() => {
    if (lastWorkoutPRs && Object.keys(lastWorkoutPRs).length > 0) {
      // Show PR modal for first PR
      const firstPRKey = Object.keys(lastWorkoutPRs)[0];
      setCurrentPR({
        exerciseId: firstPRKey,
        ...lastWorkoutPRs[firstPRKey],
      });
      setShowPR(true);
    }
  }, []);
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Existing completion UI */}
      
      {/* NEW: PR Modal */}
      <PRModal
        visible={showPR}
        onClose={() => {
          setShowPR(false);
          setCurrentPR(null);
        }}
        prData={currentPR}
      />
    </SafeAreaView>
  );
};
```

#### ProgressScreen Enhancements

Replace tabs with dropdown:
```javascript
import { useState } from 'react';

export const ProgressScreen = () => {
  const [filterType, setFilterType] = useState('All');
  const { workoutHistory } = useStore();
  
  const filterOptions = ['All', 'Push', 'Pull', 'Legs'];
  const [showDropdown, setShowDropdown] = useState(false);
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Replace tab bar with dropdown */}
      <TouchableOpacity 
        style={styles.dropdown}
        onPress={() => setShowDropdown(!showDropdown)}
      >
        <Text style={styles.dropdownText}>{filterType} Workouts</Text>
        <Text style={styles.dropdownIcon}>▼</Text>
      </TouchableOpacity>
      
      {showDropdown && (
        <View style={styles.dropdownMenu}>
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.dropdownOption}
              onPress={() => {
                setFilterType(option);
                setShowDropdown(false);
              }}
            >
              <Text style={styles.dropdownOptionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      {/* Rest of analytics */}
    </SafeAreaView>
  );
};
```

---

## 🎨 Style Updates

### Color Palette
Update your existing styles to use the new color system:

```javascript
const colors = {
  background: '#000',          // Pure black background
  card: '#18181b',             // Card background
  cardHover: '#27272a',        // Hover/pressed state
  border: '#27272a',           // Borders
  
  textPrimary: '#fff',         // Primary text
  textSecondary: '#a1a1aa',    // Secondary text
  textTertiary: '#71717a',     // Tertiary text
  textMuted: '#52525b',        // Muted text
  
  success: '#10b981',          // Success/PRs
  warning: '#f59e0b',          // Warnings
  danger: '#ef4444',           // Danger/delete
  info: '#3b82f6',             // Info/links
  
  // Workout colors
  push: '#3b82f6',
  pull: '#8b5cf6',
  legs: '#f97316',
  cardio: '#10b981',
};
```

### Typography
Use consistent font weights:

```javascript
const typography = {
  heading: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: colors.textPrimary,
  },
  subheading: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.2,
    color: colors.textPrimary,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: colors.textSecondary,
  },
  caption: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textTertiary,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
};
```

---

## ✅ Testing Checklist

After migrating each screen:

- [ ] Screen renders without errors
- [ ] Navigation works correctly
- [ ] Store actions function properly
- [ ] Components display correctly
- [ ] Styles look polished
- [ ] New features work (PRs, suggestions, etc.)

---

## 🚀 Quick Migration Example

Here's a complete before/after for `WelcomeScreen`:

### BEFORE (in single index.js):
```javascript
export const WelcomeScreen = ({ navigation }) => {
  const Btn = ({ children, onPress }) => (
    <TouchableOpacity style={{ backgroundColor: '#10b981', padding: 16, borderRadius: 12 }} onPress={onPress}>
      <Text style={{ color: '#000', fontWeight: '600', textAlign: 'center' }}>{children}</Text>
    </TouchableOpacity>
  );
  
  return (
    <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 32, fontWeight: '700', color: '#fff', marginBottom: 16 }}>Welcome to MyGymProgram</Text>
      <Btn onPress={() => navigation.navigate('Name')}>Get Started</Btn>
    </View>
  );
};
```

### AFTER (src/screens/Onboarding/WelcomeScreen.js):
```javascript
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Button } from '../../components';

export const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.icon}>
          <Text style={styles.iconText}>💪</Text>
        </View>
        
        <Text style={styles.title}>Welcome to MyGymProgram</Text>
        <Text style={styles.subtitle}>
          Your AI-powered fitness coach. Build muscle, track progress, crush goals.
        </Text>
        
        <Button onPress={() => navigation.navigate('Name')}>
          Get Started
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  icon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#18181b',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 32,
  },
  iconText: {
    fontSize: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 16,
    color: '#a1a1aa',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 24,
  },
});
```

---

## 📚 Resources

- **Store docs**: See `src/store/index.js` for all available actions
- **Component props**: Each component file has clear prop definitions
- **Utils**: Check `src/utils/` for helper functions
- **Data**: Exercise database in `src/data/exercises.js`

---

## 💡 Pro Tips

1. **Migrate one screen at a time** - Test thoroughly before moving on
2. **Start with simplest screens** - Onboarding screens are easiest
3. **Use existing styles as reference** - Your current styles are good, just enhance them
4. **Test on device** - Some features (confetti, animations) look better on real devices

---

## Need Help?

If you get stuck on any screen migration, you can:
1. Reference the new `DailyCheckInScreen` as a template
2. Check component files for usage examples
3. Look at store actions in `src/store/index.js`

**You've got this! 🚀**
