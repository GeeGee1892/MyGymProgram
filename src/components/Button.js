import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ 
  children, 
  onPress, 
  variant = 'primary', 
  disabled = false, 
  size = 'default',
  style 
}) => {
  const getButtonStyle = () => {
    const base = [styles.base, styles[size]];
    
    switch (variant) {
      case 'secondary':
        base.push(styles.secondary);
        break;
      case 'ghost':
        base.push(styles.ghost);
        break;
      case 'accent':
        base.push(styles.accent);
        break;
      default:
        base.push(styles.primary);
    }
    
    if (disabled) base.push(styles.disabled);
    if (style) base.push(style);
    
    return base;
  };
  
  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.textSecondary;
      case 'ghost':
        return styles.textGhost;
      case 'accent':
        return styles.textAccent;
      default:
        return styles.textPrimary;
    }
  };
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={getButtonStyle()}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, styles[`text_${size}`], getTextStyle()]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  default: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  primary: {
    backgroundColor: '#fff',
  },
  secondary: {
    backgroundColor: '#27272a',
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  accent: {
    backgroundColor: '#10b981',
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    fontWeight: '600',
  },
  text_default: {
    fontSize: 16,
  },
  text_small: {
    fontSize: 14,
  },
  textPrimary: {
    color: '#000',
  },
  textSecondary: {
    color: '#fff',
  },
  textGhost: {
    color: '#a1a1aa',
  },
  textAccent: {
    color: '#000',
  },
});

export default Button;
