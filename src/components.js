import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

// BUTTON
export const Button = ({ children, onPress, variant = 'primary', disabled, size = 'default', style }) => {
  const variants = {
    primary: { bg: '#fff', text: '#000' },
    secondary: { bg: '#27272a', text: '#fff', border: '#3f3f46' },
    ghost: { bg: 'transparent', text: '#a1a1aa' },
    accent: { bg: '#10b981', text: '#000' },
  };
  const v = variants[variant];
  const py = size === 'small' ? 8 : 16;
  const px = size === 'small' ? 16 : 24;
  const fs = size === 'small' ? 14 : 16;

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.8}
      style={[{ backgroundColor: v.bg, paddingVertical: py, paddingHorizontal: px, borderRadius: 12, alignItems: 'center', borderWidth: v.border ? 1 : 0, borderColor: v.border }, disabled && { opacity: 0.4 }, style]}>
      <Text style={{ color: v.text, fontWeight: '600', fontSize: fs }}>{children}</Text>
    </TouchableOpacity>
  );
};

// CARD
export const Card = ({ children, onPress, style }) => {
  const Comp = onPress ? TouchableOpacity : View;
  return (
    <Comp onPress={onPress} activeOpacity={0.8} style={[{ backgroundColor: '#18181b', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#27272a' }, style]}>
      {children}
    </Comp>
  );
};

// PROGRESS BAR
export const ProgressBar = ({ current, total, showLabel = true }) => {
  const progress = total > 0 ? (current / total) * 100 : 0;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <View style={{ flex: 1, height: 4, backgroundColor: '#27272a', borderRadius: 2, overflow: 'hidden' }}>
        <View style={{ height: '100%', width: `${progress}%`, backgroundColor: '#fff', borderRadius: 2 }} />
      </View>
      {showLabel && <Text style={{ color: '#52525b', fontSize: 12 }}>{current} of {total}</Text>}
    </View>
  );
};

// MINI CHART (bar chart)
export const MiniChart = ({ data, height = 40, color = '#10b981' }) => {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  return (
    <View style={{ height, flexDirection: 'row', alignItems: 'flex-end', gap: 2 }}>
      {data.slice(-10).map((v, i, arr) => (
        <View key={i} style={{ flex: 1, borderRadius: 2, minHeight: 4, height: `${((v - min) / range) * 80 + 20}%`, backgroundColor: i === arr.length - 1 ? color : '#3f3f46' }} />
      ))}
    </View>
  );
};

// LINE CHART (simple SVG-free version using Views)
export const LineChart = ({ data, height = 100, color = '#10b981' }) => {
  if (!data || data.length < 2) return <View style={{ height, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: '#52525b', fontSize: 14 }}>Need more data</Text></View>;
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  return (
    <View style={{ height, flexDirection: 'row', alignItems: 'flex-end', gap: 4, paddingVertical: 8 }}>
      {data.map((v, i) => {
        const h = ((v - min) / range) * (height - 24) + 12;
        return (
          <View key={i} style={{ flex: 1, alignItems: 'center' }}>
            <View style={{ width: 8, height: h, borderRadius: 4, backgroundColor: i === data.length - 1 ? color : '#3f3f46' }} />
          </View>
        );
      })}
    </View>
  );
};
