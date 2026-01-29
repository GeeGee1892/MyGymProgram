import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Simple text-based logo - no SVG dependency needed
export const AppLogo = ({ size = 'medium', style }) => {
    const sizes = {
          small: { container: 40, text: 16, icon: 20 },
          medium: { container: 60, text: 24, icon: 30 },
          large: { container: 100, text: 40, icon: 50 },
    };

    const s = sizes[size] || sizes.medium;

    return (
          <View style={[styles.container, { width: s.container, height: s.container }, style]}>
            <Text style={[styles.icon, { fontSize: s.icon }]}>🏋️</Text>
      </View>
    );
};

export const AppLogoWithText = ({ size = 'medium', style }) => {
    const sizes = {
          small: { logo: 40, title: 16, subtitle: 10 },
          medium: { logo: 60, title: 24, subtitle: 12 },
          large: { logo: 100, title: 36, subtitle: 16 },
    };

    const s = sizes[size] || sizes.medium;

    return (
          <View style={[styles.wrapper, style]}>
            <AppLogo size={size} />
            <View style={styles.textContainer}>
          <Text style={[styles.title, { fontSize: s.title }]}>MyGymProgram</Text>
        <Text style={[styles.subtitle, { fontSize: s.subtitle }]}>Track • Train • Transform</Text>
  </View>
  </View>
  );
};

// Minimal version for headers
export const AppLogo_Minimal = ({ size = 24, color = '#FF6B35' }) => (
    <Text style={{ fontSize: size }}>🏋️</Text>
);

// Clean version (same as minimal for compatibility)
export const AppLogo_Clean = AppLogo_Minimal;

const styles = StyleSheet.create({
    container: {
          backgroundColor: '#FF6B35',
          borderRadius: 12,
          justifyContent: 'center',
          alignItems: 'center',
    },
    icon: {
          color: '#fff',
    },
    wrapper: {
          flexDirection: 'row',
          alignItems: 'center',
    },
    textContainer: {
          marginLeft: 12,
    },
    title: {
          color: '#fff',
          fontWeight: 'bold',
    },
    subtitle: {
          color: '#888',
          marginTop: 2,
    },
});

export default AppLogo;
