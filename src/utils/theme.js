// Design system: spacing scale
// Base unit: 4px
// Use multiples of 4 for all spacing

export const spacing = {
  xs: 4,   // 4px  - Tight spacing (icon padding, small gaps)
  sm: 8,   // 8px  - Small spacing (between related elements)
  md: 12,  // 12px - Medium spacing (default gap)
  lg: 16,  // 16px - Large spacing (card padding, section gaps)
  xl: 20,  // 20px - Extra large spacing (between sections)
  xxl: 24, // 24px - Screen padding, major sections
  xxxl: 32, // 32px - Major section breaks
  huge: 40, // 40px - Hero spacing
};

// Shorthand helper
export const s = spacing;

// Common padding presets
export const padding = {
  screen: spacing.xxl,           // 24px - Default screen padding
  card: spacing.lg,              // 16px - Default card padding
  cardLarge: spacing.xl,         // 20px - Large card padding
  button: spacing.lg,            // 16px - Button padding
  section: spacing.xxxl,         // 32px - Between major sections
};

// Common margin presets
export const margin = {
  element: spacing.md,           // 12px - Between elements
  section: spacing.xl,           // 16px - Between sections
  sectionLarge: spacing.xxl,     // 24px - Between large sections
};

// Border radius scale
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

// Typography scale
export const fontSize = {
  xs: 11,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  huge: 32,
  massive: 40,
};

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.6,
};

// Color palette
export const colors = {
  // Backgrounds
  background: '#000',
  card: '#18181b',
  cardHover: '#1f1f23',
  elevated: '#27272a',
  
  // Borders
  border: '#27272a',
  borderLight: '#3f3f46',
  
  // Text
  textPrimary: '#ffffff',
  textSecondary: '#d4d4d8',
  textTertiary: '#a1a1aa',
  textMuted: '#71717a',
  textDisabled: '#52525b',
  
  // Brand
  primary: '#10b981',
  primaryHover: '#059669',
  primaryLight: 'rgba(16, 185, 129, 0.1)',
  
  // Semantic
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  
  // Workout types
  push: '#3b82f6',
  pull: '#8b5cf6',
  legs: '#f97316',
  cardio: '#10b981',
};

// Shadow presets
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  glow: (color) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  }),
};

// Example usage:
// import { spacing, colors, radius } from '../utils/theme';
// 
// const styles = StyleSheet.create({
//   container: {
//     padding: spacing.xxl,      // 24px
//     backgroundColor: colors.background,
//   },
//   card: {
//     padding: spacing.lg,        // 16px
//     marginBottom: spacing.md,   // 12px
//     borderRadius: radius.md,    // 12px
//     backgroundColor: colors.card,
//   },
// });
