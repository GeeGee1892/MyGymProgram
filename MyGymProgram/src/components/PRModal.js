import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  Animated,
  Easing,
  Share,
} from 'react-native';
import { exerciseDB } from '../data/exercises';
import { fmtWeight } from '../utils/formatting';

const { width, height } = Dimensions.get('window');

// Confetti piece component
const ConfettiPiece = ({ delay, color }) => {
  const translateY = useRef(new Animated.Value(-50)).current;
  const translateX = useRef(new Animated.Value(Math.random() * width)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    const startAnimation = () => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: height + 100,
          duration: 3000 + Math.random() * 2000,
          delay,
          easing: Easing.cubic,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: 1,
          duration: 2000 + Math.random() * 1000,
          delay,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Reset and loop
        translateY.setValue(-50);
        rotate.setValue(0);
        startAnimation();
      });
    };
    
    startAnimation();
  }, []);
  
  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  return (
    <Animated.View
      style={[
        styles.confettiPiece,
        {
          backgroundColor: color,
          transform: [
            { translateX },
            { translateY },
            { rotate: rotateInterpolate },
          ],
        },
      ]}
    />
  );
};

export const PRModal = ({ visible, onClose, prData }) => {
  if (!prData) return null;
  
  const { exerciseId, weight, oldWeight, reps } = prData;
  const exercise = exerciseDB[exerciseId] || { name: exerciseId };
  const improvement = weight - (oldWeight || 0);
  
  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];
  
  const handleShare = async () => {
    try {
      await Share.share({
        message: `💪 New PR! ${exercise.name}: ${fmtWeight(weight)}kg × ${reps}\n+${fmtWeight(improvement)}kg improvement!\n\n#MyGymProgram #Gains`,
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Confetti pieces */}
        {visible && Array.from({ length: 30 }).map((_, i) => (
          <ConfettiPiece
            key={i}
            delay={i * 100}
            color={colors[i % colors.length]}
          />
        ))}
        
        {/* Main content */}
        <View style={styles.content}>
          {/* Trophy icon */}
          <View style={styles.trophy}>
            <Text style={styles.trophyIcon}>🏆</Text>
          </View>
          
          {/* PR announcement */}
          <Text style={styles.title}>New Personal Record!</Text>
          
          <View style={styles.details}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            
            <View style={styles.stats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{fmtWeight(weight)}kg</Text>
                <Text style={styles.statLabel}>× {reps} reps</Text>
              </View>
              
              {oldWeight && (
                <View style={styles.improvement}>
                  <Text style={styles.improvementText}>
                    +{fmtWeight(improvement)}kg
                  </Text>
                  <Text style={styles.improvementLabel}>improvement</Text>
                </View>
              )}
            </View>
          </View>
          
          {/* Action buttons */}
          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.shareButton} 
              onPress={handleShare}
            >
              <Text style={styles.shareButtonText}>📤 Share</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  confettiPiece: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  content: {
    backgroundColor: '#18181b',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27272a',
  },
  trophy: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  trophyIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  details: {
    width: '100%',
    marginBottom: 32,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10b981',
    textAlign: 'center',
    marginBottom: 16,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  improvement: {
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  improvementText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10b981',
    marginBottom: 2,
  },
  improvementLabel: {
    fontSize: 12,
    color: '#71717a',
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  shareButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  closeButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});
