import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, radius } from '../utils/theme';

// Simple emoji-based icons as fallback
export const Icons = {
  home: '🏠',
  analytics: '📊',
  builder: '⚙️',
  workout: '💪',
  push: '💪',
  pull: '🏋️',
  legs: '🦵',
  cardio: '🏃',
  pr: '🏆',
  streak: '🔥',
  check: '✓',
  close: '✕',
  add: '+',
  remove: '−',
  swap: '↔',
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
  edit: '✏️',
  delete: '🗑️',
  settings: '⚙️',
  info: 'ℹ️',
  warning: '⚠️',
  error: '❌',
  success: '✅',
  loading: '⏳',
  rest: '😴',
  target: '🎯',
  calendar: '📅',
  clock: '⏰',
  weight: '⚖️',
  food: '🍽️',
  water: '💧',
  sleep: '😴',
  heart: '❤️',
  star: '⭐',
  medal: '🥇',
  trophy: '🏆',
  muscle: '💪',
  fire: '🔥',
  bolt: '⚡',
  chart: '📈',
  list: '📋',
  save: '💾',
  share: '📤',
  copy: '📋',
  link: '🔗',
  lock: '🔒',
  unlock: '🔓',
  user: '👤',
  users: '👥',
  notification: '🔔',
  search: '🔍',
  filter: '🔽',
  sort: '↕️',
  more: '•••',
  menu: '☰',
  back: '←',
  forward: '→',
  refresh: '🔄',
  play: '▶️',
  pause: '⏸️',
  stop: '⏹️',
  skip: '⏭️',
};

// App logo component
export const AppLogo = ({ size = 48, style }) => {
  // Try to use the actual logo image
  try {
    const logo = require('../../assets/icon.png');
    return (
      <Image 
        source={logo} 
        style={[{ width: size, height: size, borderRadius: radius.md }, style]} 
      />
    );
  } catch {
    // Fallback to emoji
    return (
      <View style={[styles.logoFallback, { width: size, height: size }, style]}>
        <Text style={[styles.logoText, { fontSize: size * 0.5 }]}>💪</Text>
      </View>
    );
  }
};

// Icon component for rendering single icons
export const Icon = ({ name, size = 24, color, style }) => {
  const emoji = Icons[name] || '❓';
  return (
    <Text style={[{ fontSize: size, color }, style]}>
      {emoji}
    </Text>
  );
};

const styles = StyleSheet.create({
  logoFallback: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  logoText: {
    textAlign: 'center',
  },
});

export default { Icons, AppLogo, Icon };
