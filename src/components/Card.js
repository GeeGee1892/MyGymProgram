import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

const Card = ({ children, onPress, style }) => {
  const Component = onPress ? TouchableOpacity : View;
  
  return (
    <Component
      onPress={onPress}
      style={[styles.card, style]}
      activeOpacity={onPress ? 0.8 : 1}
    >
      {children}
    </Component>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#18181b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#27272a',
  },
});

export default Card;
