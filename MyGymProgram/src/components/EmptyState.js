import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from './Button';

export const EmptyState = ({ 
  icon = '💪',
  title,
  message,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      
      {onAction && (
        <Button onPress={onAction} style={styles.button}>
          {actionLabel}
        </Button>
      )}
      
      {onSecondaryAction && (
        <Button variant="ghost" onPress={onSecondaryAction} style={styles.secondaryButton}>
          {secondaryActionLabel}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#18181b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  message: {
    fontSize: 16,
    color: '#a1a1aa',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    width: '100%',
    maxWidth: 280,
  },
  secondaryButton: {
    marginTop: 12,
  },
});
