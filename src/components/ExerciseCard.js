import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { spacing, colors, radius, fontSize, fontWeight } from '../utils/theme';

// Default placeholder for missing images
const PLACEHOLDER_COLOR = '#2a2a2a';

export const ExerciseCard = ({ 
  exercise, 
  onPress, 
  selected = false,
  showImage = true,
  compact = false 
}) => {
  const [imageError, setImageError] = useState(false);
  const { name, muscles, cues, media } = exercise;

  const handleImageError = () => {
    setImageError(true);
  };

  const renderImage = () => {
    if (!showImage) return null;
    
    const imageSize = compact ? styles.imageCompact : styles.image;
    
    // If no media or image failed to load, show placeholder
    if (!media || imageError) {
      return (
        <View style={[imageSize, styles.placeholder]}>
          <Text style={styles.placeholderIcon}>🏋️</Text>
        </View>
      );
    }

    return (
      <Image
        source={media}
        style={imageSize}
        resizeMode="cover"
        onError={handleImageError}
      />
    );
  };

  const content = (
    <View style={[
      styles.container, 
      selected && styles.containerSelected,
      compact && styles.containerCompact
    ]}>
      {renderImage()}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={compact ? 1 : 2}>
          {name}
        </Text>
        {!compact && (
          <>
            <Text style={styles.muscles} numberOfLines={1}>
              {muscles}
            </Text>
            {cues && cues.length > 0 && (
              <Text style={styles.cue} numberOfLines={1}>
                💡 {cues[0]}
              </Text>
            )}
          </>
        )}
      </View>
      {selected && (
        <View style={styles.checkmark}>
          <Text style={styles.checkmarkText}>✓</Text>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.card || '#1a1a1a',
    borderRadius: radius.md || 12,
    padding: spacing.sm || 12,
    marginBottom: spacing.sm || 12,
    alignItems: 'center',
  },
  containerSelected: {
    borderWidth: 2,
    borderColor: colors.primary || '#FF6B35',
  },
  containerCompact: {
    padding: spacing.xs || 8,
    marginBottom: spacing.xs || 8,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: radius.sm || 8,
    marginRight: spacing.sm || 12,
  },
  imageCompact: {
    width: 50,
    height: 50,
    borderRadius: radius.xs || 6,
    marginRight: spacing.xs || 8,
  },
  placeholder: {
    backgroundColor: PLACEHOLDER_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    color: '#fff',
    fontSize: fontSize.md || 16,
    fontWeight: fontWeight.semibold || '600',
    marginBottom: 4,
  },
  muscles: {
    color: colors.textSecondary || '#888',
    fontSize: fontSize.sm || 14,
    marginBottom: 4,
  },
  cue: {
    color: colors.primary || '#FF6B35',
    fontSize: fontSize.xs || 12,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary || '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm || 12,
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ExerciseCard;
