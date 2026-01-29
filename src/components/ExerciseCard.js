import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { exerciseDB } from '../data/exercises';

export const ExerciseCard = ({ 
  exercise, 
  index, 
  onPress, 
  onSwap, 
  showSwap = true,
  completed = false,
  suggestion = null, 
}) => {
  const data = exerciseDB[exercise.id] || { name: exercise.id, muscles: 'Unknown' };
  
  return (
    <TouchableOpacity 
      style={[styles.card, completed && styles.cardCompleted]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {/* Exercise number/checkmark */}
        <View style={[styles.badge, completed && styles.badgeCompleted]}>
          <Text style={[styles.badgeText, completed && styles.badgeTextCompleted]}>
            {completed ? '✓' : index + 1}
          </Text>
        </View>
        
        {/* Exercise info */}
        <View style={styles.info}>
          <Text style={[styles.name, completed && styles.nameCompleted]}>
            {data.name}
          </Text>
          <Text style={styles.meta}>
            {exercise.sets} × {exercise.reps} • {data.muscles}
          </Text>
          
          {/* Progressive suggestion */}
          {suggestion && !completed && (
            <View style={styles.suggestionBadge}>
              <Text style={styles.suggestionText}>
                💪 {suggestion.suggestion}
              </Text>
            </View>
          )}
        </View>
        
        {/* Swap button */}
        {showSwap && !completed && (
          <TouchableOpacity 
            style={styles.swapButton} 
            onPress={(e) => {
              e.stopPropagation();
              onSwap && onSwap(index);
            }}
          >
            <Text style={styles.swapIcon}>↻</Text>
            <Text style={styles.swapText}>Swap</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#27272a',
    // Subtle shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardCompleted: {
    opacity: 0.5,
    backgroundColor: '#09090b',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#27272a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  badgeCompleted: {
    backgroundColor: '#10b981',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#a1a1aa',
  },
  badgeTextCompleted: {
    color: '#000',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  nameCompleted: {
    color: '#71717a',
    textDecorationLine: 'line-through',
  },
  meta: {
    fontSize: 13,
    color: '#71717a',
    lineHeight: 18,
  },
  suggestionBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  suggestionText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
  },
  swapButton: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingLeft: 12,
    gap: 4,
  },
  swapIcon: {
    fontSize: 20,
    color: '#a1a1aa',
  },
  swapText: {
    fontSize: 11,
    color: '#71717a',
    fontWeight: '500',
  },
});
