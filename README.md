# Keystone Fitness

Simple workout tracking app built with React Native (Expo).

## Features
- PPL workout rotation (Push/Pull/Legs/Cardio)
- 60+ exercises with alternatives
- Flexible logging order
- Exercise swapping
- Automatic PR tracking
- Volume & weight analytics
- Dark mode UI

## Setup
```bash
npm install
npm start
```

Scan QR with Expo Go.

## Structure (12 files)
```
├── App.js              # Navigation
├── app.json            # Expo config
├── package.json        # Dependencies
├── babel.config.js
├── README.md
└── src/
    ├── data.js         # Exercises + workouts
    ├── utils.js        # Calculations
    ├── store.js        # Zustand state
    ├── components.js   # UI components
    └── screens/
        ├── Onboarding.js  # 6 screens
        ├── Main.js        # Home + Progress
        └── Workout.js     # Workout flow
```

## Workouts
- **Push** (22 sets): Chest, shoulders, triceps, abs
- **Pull** (20 sets): Back, biceps, forearms
- **Legs** (19 sets): Quads, hamstrings, glutes, calves
- **Cardio**: Warmup, steady state, cooldown
