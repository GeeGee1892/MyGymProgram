import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';

const LineChart = ({ data, height = 100, color = '#10b981' }) => {
  if (!data || data.length < 2) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.placeholder}>Need more data</Text>
      </View>
    );
  }
  
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 260;
  const chartHeight = height - 20;
  const padding = 20;
  
  const points = data.map((value, index) => ({
    x: padding + (index / (data.length - 1)) * (width - padding * 2),
    y: 10 + chartHeight - ((value - min) / range) * chartHeight,
  }));
  
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  
  return (
    <View style={[styles.container, { height }]}>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Grid lines */}
        {[0, 0.5, 1].map((ratio, i) => (
          <Line
            key={i}
            x1={padding}
            y1={10 + chartHeight * ratio}
            x2={width - padding}
            y2={10 + chartHeight * ratio}
            stroke="#27272a"
            strokeWidth={1}
          />
        ))}
        
        {/* Line */}
        <Path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Points */}
        {points.map((p, i) => (
          <Circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={i === points.length - 1 ? 5 : 3}
            fill={i === points.length - 1 ? color : '#27272a'}
            stroke={color}
            strokeWidth={2}
          />
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    color: '#52525b',
    fontSize: 14,
  },
});

export default LineChart;
