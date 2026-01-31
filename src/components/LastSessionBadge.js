import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, fontSize, fontWeight } from '../utils/theme';
import { fmtDate, fmtRelativeTime } from '../utils/formatting';

export const LastSessionBadge = ({ lastSession }) => {
  if (!lastSession) return null;
  
  const { date, maxWeight, avgReps, sets } = lastSession;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>📋</Text>
        <Text style={styles.title}>Last Session</Text>
        <Text style={styles.date}>{fmtRelativeTime(date)}</Text>
      </View>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{maxWeight}kg</Text>
          <Text style={styles.statLabel}>max</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{avgReps}</Text>
          <Text style={styles.statLabel}>avg reps</Text>
        </View>
        {sets && (
          <>
            <View style={styles.divider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{sets.length}</Text>
              <Text style={styles.statLabel}>sets</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    alignSelf: 'stretch',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  icon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: '#3b82f6',
    letterSpacing: 0.5,
    flex: 1,
  },
  date: {
    fontSize: fontSize.xs,
    color: colors.textDisabled,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stat: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  statValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textDisabled,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
});

export default LastSessionBadge;
