import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../utils/theme';

export const Card = ({ children, style, padded = true }) => (
  <View style={[styles.card, padded && styles.padded, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  padded: {
    padding: spacing.lg,
  },
});

export default Card;
