import React from 'react';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';

// Home Icon
export const HomeIcon = ({ size = 24, color = '#fff', focused = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
      stroke={color}
      strokeWidth={focused ? 2.5 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={focused ? color : 'none'}
      fillOpacity={focused ? 0.2 : 0}
    />
    <Path
      d="M9 22V12h6v10"
      stroke={color}
      strokeWidth={focused ? 2.5 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Workout/Dumbbell Icon
export const WorkoutIcon = ({ size = 24, color = '#fff', focused = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"
      fill={color}
      fillOpacity={focused ? 1 : 0.8}
    />
  </Svg>
);

// Progress/Chart Icon
export const ProgressIcon = ({ size = 24, color = '#fff', focused = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 3v18h18"
      stroke={color}
      strokeWidth={focused ? 2.5 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7 16l4-6 4 2 5-8"
      stroke={focused ? '#10b981' : color}
      strokeWidth={focused ? 2.5 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {focused && (
      <G>
        <Circle cx="7" cy="16" r="2" fill="#10b981" />
        <Circle cx="11" cy="10" r="2" fill="#10b981" />
        <Circle cx="15" cy="12" r="2" fill="#10b981" />
        <Circle cx="20" cy="4" r="2" fill="#10b981" />
      </G>
    )}
  </Svg>
);

// Profile/User Icon
export const ProfileIcon = ({ size = 24, color = '#fff', focused = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle
      cx="12"
      cy="8"
      r="4"
      stroke={color}
      strokeWidth={focused ? 2.5 : 2}
      fill={focused ? color : 'none'}
      fillOpacity={focused ? 0.2 : 0}
    />
    <Path
      d="M4 21c0-3.87 3.13-7 7-1s7 3.13 7 7"
      stroke={color}
      strokeWidth={focused ? 2.5 : 2}
      strokeLinecap="round"
      fill={focused ? color : 'none'}
      fillOpacity={focused ? 0.2 : 0}
    />
  </Svg>
);

// Plus/Add Icon
export const PlusIcon = ({ size = 24, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 5v14M5 12h14"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
    />
  </Svg>
);

// Check Icon
export const CheckIcon = ({ size = 24, color = '#10b981' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 6L9 17l-5-5"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Arrow Right Icon
export const ArrowRightIcon = ({ size = 24, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 12h14M12 5l7 7-7 7"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Fire/Streak Icon
export const FireIcon = ({ size = 24, color = '#f59e0b' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2s-4 4-4 8c0 2.21 1.79 4 4 4s4-1.79 4-4c0-4-4-8-4-8z"
      fill={color}
      fillOpacity={0.8}
    />
    <Path
      d="M12 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
      fill={color}
      fillOpacity={0.6}
    />
  </Svg>
);

// Trophy/PR Icon
export const TrophyIcon = ({ size = 24, color = '#f59e0b' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 9H4a2 2 0 01-2-2V5a2 2 0 012-2h2M18 9h2a2 2 0 002-2V5a2 2 0 00-2-2h-2M12 22a6 6 0 006-6v-3H6v3a6 6 0 006 6z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={color}
      fillOpacity={0.2}
    />
    <Path
      d="M6 9V3h12v6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Swap/Rotate Icon
export const SwapIcon = ({ size = 20, color = '#a1a1aa' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 10H7.83l3.58-3.59L10 5l-6 6 6 6 1.41-1.41L7.83 12H21v-2z"
      fill={color}
    />
    <Path
      d="M3 14h13.17l-3.58 3.59L14 19l6-6-6-6-1.41 1.41L16.17 12H3v2z"
      fill={color}
    />
  </Svg>
);

export default {
  HomeIcon,
  WorkoutIcon,
  ProgressIcon,
  ProfileIcon,
  PlusIcon,
  CheckIcon,
  ArrowRightIcon,
  FireIcon,
  TrophyIcon,
  SwapIcon,
};
