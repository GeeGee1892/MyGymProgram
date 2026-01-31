import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useStore } from '../../store';

const { width } = Dimensions.get('window');

export const AnalyticsScreen = () => {
  const { userData, dailyCheckIns, workoutHistory, prs } = useStore();
  const [timeRange, setTimeRange] = useState('7d');

  const checkIns = dailyCheckIns || [];
  const workouts = workoutHistory || [];
  const allPRs = prs || {};

  const getRangeMs = () => ({ '7d': 7, '30d': 30, '90d': 90 }[timeRange] || 7) * 24 * 60 * 60 * 1000;

  const rangeCheckIns = checkIns.filter(c => Date.now() - new Date(c.date).getTime() < getRangeMs()).sort((a, b) => new Date(a.date) - new Date(b.date));
  const rangeWorkouts = workouts.filter(w => Date.now() - new Date(w.date).getTime() < getRangeMs());

  const weights = rangeCheckIns.map(c => c.weight).filter(Boolean);
  const currentWeight = weights[weights.length - 1] || userData?.weight || 0;
  const startWeight = weights[0] || userData?.weight || 0;
  const weightChange = currentWeight - startWeight;
  const avgWeight = weights.length ? (weights.reduce((a, b) => a + b, 0) / weights.length).toFixed(1) : 0;

  const proteinHits = rangeCheckIns.filter(c => c.hitProtein).length;
  const proteinRate = rangeCheckIns.length ? Math.round((proteinHits / rangeCheckIns.length) * 100) : 0;

  const workoutCount = rangeWorkouts.length;
  const workoutsByType = rangeWorkouts.reduce((acc, w) => { acc[w.type] = (acc[w.type] || 0) + 1; return acc; }, {});

  const renderWeightChart = () => {
    if (weights.length < 2) return <View style={styles.emptyChart}><Text style={styles.emptyText}>Need more check-ins to show trend</Text></View>;
    const min = Math.min(...weights) - 1;
    const max = Math.max(...weights) + 1;
    const range = max - min || 1;
    const chartHeight = 120;
    return (
      <View style={styles.chart}>
        <View style={styles.chartLabels}>
          <Text style={styles.chartLabel}>{max.toFixed(0)}kg</Text>
          <Text style={styles.chartLabel}>{min.toFixed(0)}kg</Text>
        </View>
        <View style={styles.chartArea}>
          <View style={styles.chartBars}>
            {weights.slice(-10).map((w, i, arr) => (
              <View key={i} style={[styles.chartBar, { height: ((w - min) / range) * chartHeight, backgroundColor: i === arr.length - 1 ? '#10b981' : '#3f3f46' }]} />
            ))}
          </View>
          {userData?.targetWeight && (
            <View style={[styles.targetLine, { bottom: ((userData.targetWeight - min) / range) * chartHeight }]}>
              <Text style={styles.targetLabel}>Goal: {userData.targetWeight}kg</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.subtitle}>Track your progress</Text>
        </View>

        <View style={styles.rangePicker}>
          {['7d', '30d', '90d'].map((range) => (
            <TouchableOpacity key={range} style={[styles.rangeBtn, timeRange === range && styles.rangeBtnActive]} onPress={() => setTimeRange(range)}>
              <Text style={[styles.rangeText, timeRange === range && styles.rangeTextActive]}>
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>WEIGHT</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}><Text style={styles.statValue}>{currentWeight}</Text><Text style={styles.statLabel}>Current (kg)</Text></View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, weightChange < 0 ? styles.positive : weightChange > 0 ? styles.negative : null]}>
                {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)}
              </Text>
              <Text style={styles.statLabel}>Change</Text>
            </View>
            <View style={styles.statCard}><Text style={styles.statValue}>{avgWeight}</Text><Text style={styles.statLabel}>Average</Text></View>
          </View>
          {renderWeightChart()}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NUTRITION</Text>
          <View style={styles.adherenceCard}>
            <View style={styles.adherenceHeader}>
              <Text style={styles.adherenceTitle}>Protein Adherence</Text>
              <Text style={styles.adherenceValue}>{proteinRate}%</Text>
            </View>
            <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${proteinRate}%` }]} /></View>
            <Text style={styles.adherenceSubtext}>Hit target {proteinHits} of {rangeCheckIns.length} days</Text>
          </View>
          <View style={styles.targetCard}>
            <View style={styles.targetRow}><Text style={styles.targetText}>Daily Calories</Text><Text style={styles.targetNumber}>{userData?.calories || 2200}</Text></View>
            <View style={styles.targetRow}><Text style={styles.targetText}>Daily Protein</Text><Text style={styles.targetNumber}>{userData?.protein || 180}g</Text></View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>WORKOUTS</Text>
          <View style={styles.workoutStats}>
            <View style={styles.workoutTotal}>
              <Text style={styles.workoutNumber}>{workoutCount}</Text>
              <Text style={styles.workoutLabel}>Total workouts</Text>
            </View>
            <View style={styles.workoutBreakdown}>
              {['Push', 'Pull', 'Legs'].map((type) => (
                <View key={type} style={styles.workoutType}>
                  <Text style={styles.workoutTypeCount}>{workoutsByType[type] || workoutsByType[type.toLowerCase()] || 0}</Text>
                  <Text style={styles.workoutTypeName}>{type}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PERSONAL RECORDS</Text>
          {Object.keys(allPRs).length > 0 ? (
            <View style={styles.prList}>
              {Object.entries(allPRs).slice(0, 5).map(([exerciseId, pr]) => (
                <View key={exerciseId} style={styles.prCard}>
                  <Text style={styles.prExercise}>{exerciseId.replace(/_/g, ' ')}</Text>
                  <Text style={styles.prWeight}>{typeof pr === 'object' ? pr.weight : pr}kg</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🏆</Text>
              <Text style={styles.emptyTitle}>No PRs yet</Text>
              <Text style={styles.emptySubtext}>Complete workouts to track your records</Text>
            </View>
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scrollView: { flex: 1 },
  header: { padding: 24, paddingBottom: 8 },
  title: { fontSize: 28, fontWeight: '700', color: '#fff' },
  subtitle: { fontSize: 14, color: '#71717a', marginTop: 4 },
  rangePicker: { flexDirection: 'row', paddingHorizontal: 24, gap: 8, marginBottom: 24 },
  rangeBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: '#18181b', alignItems: 'center', borderWidth: 1, borderColor: '#27272a' },
  rangeBtnActive: { backgroundColor: '#fff', borderColor: '#fff' },
  rangeText: { fontSize: 14, fontWeight: '500', color: '#71717a' },
  rangeTextActive: { color: '#000' },
  section: { paddingHorizontal: 24, marginBottom: 32 },
  sectionTitle: { fontSize: 12, fontWeight: '600', color: '#52525b', letterSpacing: 1, marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#18181b', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#27272a' },
  statValue: { fontSize: 24, fontWeight: '700', color: '#fff' },
  statLabel: { fontSize: 12, color: '#71717a', marginTop: 4 },
  positive: { color: '#10b981' },
  negative: { color: '#ef4444' },
  chart: { flexDirection: 'row', backgroundColor: '#18181b', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#27272a' },
  chartLabels: { width: 45, justifyContent: 'space-between', paddingVertical: 4 },
  chartLabel: { fontSize: 10, color: '#52525b' },
  chartArea: { flex: 1, height: 120, position: 'relative' },
  chartBars: { flexDirection: 'row', alignItems: 'flex-end', height: '100%', gap: 4 },
  chartBar: { flex: 1, borderRadius: 4, minHeight: 4 },
  targetLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: '#3b82f6' },
  targetLabel: { position: 'absolute', right: 0, top: -16, fontSize: 10, color: '#3b82f6' },
  emptyChart: { flex: 1, height: 120, backgroundColor: '#18181b', borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#27272a' },
  emptyText: { color: '#52525b', fontSize: 14 },
  adherenceCard: { backgroundColor: '#18181b', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#27272a', marginBottom: 12 },
  adherenceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  adherenceTitle: { fontSize: 16, fontWeight: '600', color: '#fff' },
  adherenceValue: { fontSize: 24, fontWeight: '700', color: '#10b981' },
  progressBar: { height: 8, backgroundColor: '#27272a', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#10b981', borderRadius: 4 },
  adherenceSubtext: { fontSize: 13, color: '#71717a', marginTop: 12 },
  targetCard: { backgroundColor: '#18181b', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#27272a' },
  targetRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  targetText: { fontSize: 14, color: '#a1a1aa' },
  targetNumber: { fontSize: 14, fontWeight: '600', color: '#fff' },
  workoutStats: { backgroundColor: '#18181b', borderRadius: 12, padding: 20, borderWidth: 1, borderColor: '#27272a' },
  workoutTotal: { alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#27272a' },
  workoutNumber: { fontSize: 48, fontWeight: '700', color: '#10b981' },
  workoutLabel: { fontSize: 14, color: '#71717a', marginTop: 4 },
  workoutBreakdown: { flexDirection: 'row', justifyContent: 'space-around' },
  workoutType: { alignItems: 'center' },
  workoutTypeCount: { fontSize: 24, fontWeight: '700', color: '#fff' },
  workoutTypeName: { fontSize: 12, color: '#71717a', marginTop: 4 },
  prList: { gap: 8 },
  prCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#18181b', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#27272a' },
  prExercise: { fontSize: 14, fontWeight: '500', color: '#fff', textTransform: 'capitalize' },
  prWeight: { fontSize: 14, fontWeight: '600', color: '#eab308' },
  emptyState: { alignItems: 'center', padding: 32, backgroundColor: '#18181b', borderRadius: 12, borderWidth: 1, borderColor: '#27272a' },
  emptyEmoji: { fontSize: 32, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 4 },
  emptySubtext: { fontSize: 14, color: '#71717a' },
  bottomPadding: { height: 100 },
});
