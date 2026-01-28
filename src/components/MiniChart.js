import React from 'react';
import { View, StyleSheet } from 'react-native';

const MiniChart = ({ data, height = 40, color = '#10b981' }) => {
  if (!data || data.length < 2) return null;
  
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const displayData = data.slice(-10);
  
  return (
    <View style={[styles.container, { height }]}>
      {displayData.map((value, index) => {
        const barHeight = ((value - min) / range) * 80 + 20;
        const isLast = index === displayData.length - 1;
        
        return (
          <View
            key={index}
            style={[
              styles.bar,
              {
                height: `${barHeight}%`,
                backgroundColor: isLast ? color : '#3f3f46',
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  bar: {
    flex: 1,
    borderRadius: 2,
    minHeight: 4,
  },
});

export default MiniChart;
