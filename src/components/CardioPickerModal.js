import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  StyleSheet,
  ScrollView,
} from 'react-native';
import { exerciseDB } from '../data/exercises';

const cardioOptions = [
  { id: 'cardio_treadmill_walk', name: 'Treadmill Walk', intensity: 'Low' },
  { id: 'cardio_elliptical', name: 'Elliptical', intensity: 'Low' },
  { id: 'cardio_cycle', name: 'Cycling', intensity: 'Moderate' },
  { id: 'cardio_stairmaster', name: 'Stairmaster', intensity: 'Moderate' },
  { id: 'cardio_jog', name: 'Jogging', intensity: 'Moderate' },
  { id: 'cardio_rowing', name: 'Rowing', intensity: 'Moderate' },
];

const durationOptions = [10, 15, 20, 25, 30, 35, 40, 45, 50, 60];

export const CardioPickerModal = ({ visible, onClose, onSelect }) => {
  const [selectedType, setSelectedType] = useState(cardioOptions[0].id);
  const [duration, setDuration] = useState(30); // minutes
  
  const handleConfirm = () => {
    onSelect({
      id: selectedType,
      duration,
      sets: 1,
      reps: duration.toString(), // Store duration as reps for consistency
    });
    onClose();
  };
  
  const selectedOption = cardioOptions.find((o) => o.id === selectedType);
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <TouchableOpacity 
          style={styles.content} 
          activeOpacity={1}
        >
          {/* Handle bar */}
          <View style={styles.handle} />
          
          <Text style={styles.title}>Select Cardio</Text>
          
          {/* Activity selection */}
          <ScrollView style={styles.optionsScroll}>
            {cardioOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionCard,
                  selectedType === option.id && styles.optionCardSelected,
                ]}
                onPress={() => setSelectedType(option.id)}
              >
                <View style={styles.optionInfo}>
                  <Text style={styles.optionName}>{option.name}</Text>
                  <Text style={styles.optionIntensity}>{option.intensity} Intensity</Text>
                </View>
                {selectedType === option.id && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {/* Duration picker */}
          <View style={styles.durationSection}>
            <Text style={styles.durationLabel}>Duration</Text>
            <Text style={styles.durationValue}>{duration} minutes</Text>
            
            <View style={styles.durationGrid}>
              {durationOptions.map((mins) => (
                <TouchableOpacity
                  key={mins}
                  style={[
                    styles.durationButton,
                    duration === mins && styles.durationButtonSelected,
                  ]}
                  onPress={() => setDuration(mins)}
                >
                  <Text style={[
                    styles.durationButtonText,
                    duration === mins && styles.durationButtonTextSelected,
                  ]}>
                    {mins}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={onClose}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.confirmButton} 
              onPress={handleConfirm}
            >
              <Text style={styles.confirmText}>Add to Workout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#18181b',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '85%',
  },
  handle: {
    width: 48,
    height: 4,
    backgroundColor: '#3f3f46',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
  },
  optionsScroll: {
    maxHeight: 300,
    marginBottom: 24,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#27272a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    borderColor: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  optionInfo: {
    flex: 1,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  optionIntensity: {
    fontSize: 13,
    color: '#a1a1aa',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
  },
  durationSection: {
    marginBottom: 24,
  },
  durationLabel: {
    fontSize: 14,
    color: '#a1a1aa',
    marginBottom: 8,
  },
  durationValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  durationButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#27272a',
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 60,
    alignItems: 'center',
  },
  durationButtonSelected: {
    borderColor: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  durationButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#a1a1aa',
  },
  durationButtonTextSelected: {
    color: '#10b981',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#27272a',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#a1a1aa',
  },
  confirmButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#10b981',
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});
