import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useStore } from '../store';

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
    backgroundColor: '#000',
  },
  card: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  mainStat: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mainStatValue: {
    fontSize: 40,
    fontWeight: '700',
    color: '#10b981',
    marginBottom: 4,
  },
  mainStatLabel: {
    fontSize: 12,
    color: '#a1a1aa',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  statOver: {
    color: '#f59e0b',
  },
  statUnder: {
    color: '#3b82f6',
  },
  statLabel: {
    fontSize: 11,
    color: '#71717a',
  },
  adherenceSection: {
    marginTop: 12,
  },
  adherenceLabel: {
    fontSize: 12,
    color: '#a1a1aa',
    marginBottom: 8,
  },
  adherenceBar: {
    height: 8,
    backgroundColor: '#27272a',
    borderRadius: 8,
    overflow: 'hidden',
  },
  adherenceFill: {
    height: '100%',
    backgroundColor: '#71717a',
    borderRadius: 8,
  },
  adherenceGood: {
    backgroundColor: '#10b981',
  },
  adherenceUnder: {
    backgroundColor: '#3b82f6',
  },
  adherenceOver: {
    backgroundColor: '#f59e0b',
  },
  adherenceText: {
    fontSize: 12,
    color: '#a1a1aa',
    marginTop: 8,
  },
  trendChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 180,
    marginTop: 16,
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
    backgroundColor: '#71717a',
    opacity: 0.3,
  },
  trendBarFill: {
    width: '100%',
    backgroundColor: '#71717a',
    borderRadius: 8,
  },
  barGood: {
    backgroundColor: '#10b981',
  },
  barUnder: {
    backgroundColor: '#3b82f6',
  },
  barOver: {
    backgroundColor: '#f59e0b',
  },
  trendLabel: {
    fontSize: 11,
    color: '#71717a',
    marginTop: 8,
  },
  trendValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  trendDays: {
    fontSize: 11,
    color: '#52525b',
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
  },
  dayDate: {
    fontSize: 14,
    color: '#d4d4d8',
  },
  dayCalories: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dayValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  dayDiff: {
    fontSize: 12,
    fontWeight: '500',
  },
  diffOver: {
    color: '#f59e0b',
  },
  diffUnder: {
    color: '#3b82f6',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#a1a1aa',
    textAlign: 'center',
    lineHeight: 24,
  },
});
