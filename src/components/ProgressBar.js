import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProgressBar = ({ current, total, showLabel = true }) => {
  const progress = total > 0 ? (current / total) * 100 : 0;
  
  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress}%` }]} />
        </View>
      </View>
      {showLabel && (
        <Text style={styles.label}>{current} of {total}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barContainer: {
    flex: 1,
  },
  track: {
    height: 4,
    backgroundColor: '#27272a',
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  label: {
    color: '#52525b',
    fontSize: 12,
  },
});

export default ProgressBar;
