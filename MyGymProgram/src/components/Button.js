import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

// Button with improved visual hierarchy
export const Button = ({ 
  children, 
  onPress, 
  variant = 'primary', 
  size = 'default', 
  disabled = false,
  style,
  ...props 
}) => {
  const getStyles = () => {
    const baseStyle = [styles.button];
    
    if (size === 'sm') baseStyle.push(styles.buttonSm);
    if (size === 'lg') baseStyle.push(styles.buttonLg);
    
    if (disabled) baseStyle.push(styles.buttonDisabled);
    
    if (style) baseStyle.push(style);
    
    return baseStyle;
  };
  
  const getTextStyles = () => {
    const textStyle = [styles.buttonText];
    
    if (variant === 'secondary') textStyle.push(styles.textSecondary);
    if (variant === 'ghost') textStyle.push(styles.textGhost);
    if (variant === 'danger') textStyle.push(styles.textDanger);
    
    if (size === 'sm') textStyle.push(styles.textSm);
    if (size === 'lg') textStyle.push(styles.textLg);
    
    if (disabled) textStyle.push(styles.textDisabled);
    
    return textStyle;
  };
  
  // Primary button
  if (variant === 'primary' && !disabled) {
    return (
      <TouchableOpacity 
        onPress={onPress} 
        disabled={disabled} 
        style={[...getStyles(), styles.buttonPrimary]}
        activeOpacity={0.8}
        {...props}
      >
        <Text style={getTextStyles()}>{children}</Text>
      </TouchableOpacity>
    );
  }
  
  // Other variants
  const containerStyle = [
    ...getStyles(),
    variant === 'secondary' && styles.buttonSecondary,
    variant === 'ghost' && styles.buttonGhost,
    variant === 'danger' && styles.buttonDanger,
  ];
  
  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled} 
      style={containerStyle}
      activeOpacity={0.7}
      {...props}
    >
      <Text style={getTextStyles()}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonPrimary: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    // Add subtle shadow for depth
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    letterSpacing: 0.3,
  },
  
  // Sizes
  buttonSm: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  buttonLg: {
    paddingVertical: 20,
    paddingHorizontal: 32,
  },
  textSm: {
    fontSize: 14,
  },
  textLg: {
    fontSize: 18,
  },
  
  // Variants
  buttonSecondary: {
    backgroundColor: '#18181b',
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27272a',
  },
  buttonGhost: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  buttonDanger: {
    backgroundColor: '#ef4444',
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  
  textSecondary: {
    color: '#fff',
  },
  textGhost: {
    color: '#a1a1aa',
  },
  textDanger: {
    color: '#fff',
  },
  
  // Disabled
  buttonDisabled: {
    opacity: 0.4,
    backgroundColor: '#27272a',
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  textDisabled: {
    color: '#52525b',
  },
});
