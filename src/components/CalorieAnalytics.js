import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useStore } from '../store';
import { spacing, colors, radius, fontSize, fontWeight } from '../utils/theme';

export const CalorieAnalytics = () => {
  const { dailyCheckIns, userData } = useStore();
  
  // Get last 7 days of calorie data
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const weekData = dailyCheckIns
    .filter(c => c.calories && new Date(c.date) >= sevenDaysAgo)
    .map(c => ({
      date: new Date(c.date),
      calories: c.calories,
    }))
    .sort((a, b) => a.date - b.date);
  
  // Calculate weekly average
  const weeklyAvg = weekData.length > 0
    ? Math.round(weekData.reduce((sum, d) => sum + d.calories, 0) / weekData.length)
    : 0;
  
  // Calculate adherence
  const target = userData.calories || 2000;
  const difference = weeklyAvg - target;
  const adherencePercent = target > 0 ? Math.round((weeklyAvg / target) * 100) : 0;
  
  // Get last 4 weeks for trend
  const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);
  const allWeeks = [];
  
  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
    const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    
    const weekLogs = dailyCheckIns.filter(c => {
      const date = new Date(c.date);
      return c.calories && date >= weekStart && date < weekEnd;
    });
    
    const avg = weekLogs.length > 0
      ? Math.round(weekLogs.reduce((sum, c) => sum + c.calories, 0) / weekLogs.length)
      : 0;
    
    allWeeks.push({
      label: `Week ${4 - i}`,
      avg,
      days: weekLogs.length,
    });
  }
  
  if (weekData.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyTitle}>No Calorie Data Yet</Text>
          <Text style={styles.emptyMessage}>
            Start logging your daily calories in the check-in screen to see analytics here
          </Text>
        </View>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      {/* Current Week Summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>This Week</Text>
        
        <View style={styles.mainStat}>
          <Text style={styles.mainStatValue}>{weeklyAvg}</Text>
          <Text style={styles.mainStatLabel}>avg calories/day</Text>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{target}</Text>
            <Text style={styles.statLabel}>target</Text>
          </View>
          
          <View style={styles.stat}>
            <Text style={[
              styles.statValue,
              difference > 0 ? styles.statOver : styles.statUnder
            ]}>
              {difference > 0 ? '+' : ''}{difference}
            </Text>
            <Text style={styles.statLabel}>variance</Text>
          </View>
          
          <View style={styles.stat}>
            <Text style={styles.statValue}>{weekData.length}/7</Text>
            <Text style={styles.statLabel}>days logged</Text>
          </View>
        </View>
        
        {/* Adherence bar */}
        <View style={styles.adherenceSection}>
          <Text style={styles.adherenceLabel}>Adherence to Target</Text>
          <View style={styles.adherenceBar}>
            <View 
              style={[
                styles.adherenceFill, 
                { width: `${Math.min(adherencePercent, 100)}%` },
                adherencePercent >= 95 && adherencePercent <= 105 ? styles.adherenceGood : null,
                adherencePercent < 95 ? styles.adherenceUnder : null,
                adherencePercent > 105 ? styles.adherenceOver : null,
              ]} 
            />
          </View>
          <Text style={styles.adherenceText}>{adherencePercent}% of target</Text>
        </View>
      </View>
      
      {/* 4-Week Trend */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>4-Week Trend</Text>
        
        <View style={styles.trendChart}>
          {allWeeks.map((week, i) => {
            const barHeight = week.avg > 0 ? (week.avg / target) * 100 : 0;
            const maxHeight = 120;
            const actualHeight = Math.min((barHeight / 100) * maxHeight, maxHeight);
            
            return (
              <View key={i} style={styles.trendBar}>
                <View style={styles.trendBarContainer}>
                  {/* Target line */}
                  <View style={styles.targetLine} />
                  
                  {/* Actual bar */}
                  <View 
                    style={[
                      styles.trendBarFill,
                      { height: actualHeight },
                      week.avg >= target * 0.95 && week.avg <= target * 1.05 ? styles.barGood : null,
                      week.avg < target * 0.95 ? styles.barUnder : null,
                      week.avg > target * 1.05 ? styles.barOver : null,
                    ]}
                  />
                </View>
                
                <Text style={styles.trendLabel}>{week.label}</Text>
                <Text style={styles.trendValue}>{week.avg || '-'}</Text>
                <Text style={styles.trendDays}>{week.days} days</Text>
              </View>
            );
          })}
        </View>
      </View>
      
      {/* Daily Breakdown */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Last 7 Days</Text>
        
        {weekData.map((day, i) => {
          const diff = day.calories - target;
          const date = day.date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          });
          
          return (
            <View key={i} style={styles.dayRow}>
              <Text style={styles.dayDate}>{date}</Text>
              <View style={styles.dayCalories}>
                <Text style={styles.dayValue}>{day.calories}</Text>
                <Text style={[
                  styles.dayDiff,
                  diff > 0 ? styles.diffOver : styles.diffUnder
                ]}>
                  {diff > 0 ? '+' : ''}{diff}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginHorizontal: spacing.xxl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  mainStat: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  mainStatValue: {
    fontSize: fontSize.massive,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  mainStatLabel: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  statOver: {
    color: colors.warning,
  },
  statUnder: {
    color: colors.info,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  adherenceSection: {
    marginTop: spacing.md,
  },
  adherenceLabel: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
  },
  adherenceBar: {
    height: 8,
    backgroundColor: colors.elevated,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  adherenceFill: {
    height: '100%',
    backgroundColor: colors.textMuted,
    borderRadius: radius.sm,
  },
  adherenceGood: {
    backgroundColor: colors.success,
  },
  adherenceUnder: {
    backgroundColor: colors.info,
  },
  adherenceOver: {
    backgroundColor: colors.warning,
  },
  adherenceText: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    marginTop: spacing.sm,
  },
  trendChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 180,
    marginTop: spacing.lg,
  },
  trendBar: {
    alignItems: 'center',
    flex: 1,
  },
  trendBarContainer: {
    height: 120,
    width: 40,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  targetLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.textMuted,
    opacity: 0.3,
  },
  trendBarFill: {
    width: '100%',
    backgroundColor: colors.textMuted,
    borderRadius: radius.sm,
  },
  barGood: {
    backgroundColor: colors.success,
  },
  barUnder: {
    backgroundColor: colors.info,
  },
  barOver: {
    backgroundColor: colors.warning,
  },
  trendLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  trendValue: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  trendDays: {
    fontSize: fontSize.xs,
    color: colors.textDisabled,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dayDate: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
  },
  dayCalories: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  dayValue: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  dayDiff: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  diffOver: {
    color: colors.warning,
  },
  diffUnder: {
    color: colors.info,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.huge,
    paddingVertical: spacing.huge,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.xxl,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  emptyMessage: {
    fontSize: fontSize.base,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
