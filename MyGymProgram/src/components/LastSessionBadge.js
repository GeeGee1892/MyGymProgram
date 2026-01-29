import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fmtDate } from '../utils';

export const LastSessionBadge = ({ lastSession }) => {
  if (!lastSession) return null;
  
  const { commonWeight, commonReps, date, sets } = lastSession;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>LAST TIME</Text>
        <Text style={styles.date}>{fmtDate(date)}</Text>
      </View>
      
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{commonReps}</Text>
          <Text style={styles.statLabel}>reps</Text>
        </View>
        
        <Text style={styles.separator}>×</Text>
        
        <View style={styles.stat}>
          <Text style={styles.statValue}>{commonWeight}</Text>
          <Text style={styles.statLabel}>kg</Text>
        </View>
        
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{sets.length} sets</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: '#10b981',
  },
  date: {
    fontSize: 11,
    color: '#71717a',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 28,
  },
  statLabel: {
    fontSize: 11,
    color: '#a1a1aa',
  },
  separator: {
    fontSize: 20,
    color: '#52525b',
    fontWeight: '300',
  },
  badge: {
    backgroundColor: '#27272a',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#a1a1aa',
  },
});
