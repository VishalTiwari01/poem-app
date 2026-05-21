import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../theme/theme';

const { width, height } = Dimensions.get('window');

const GlassBackground = ({ children }) => {
  return (
    <View style={styles.container}>
      {/* Background base */}
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: COLORS.background }]} />
      
      {/* Fake Mesh Gradient Circles */}
      <View style={[styles.circle, styles.circle1]} />
      <View style={[styles.circle, styles.circle2]} />
      <View style={[styles.circle, styles.circle3]} />

      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.2, // Softer for light theme
  },

  circle1: {
    width: width * 1.4,
    height: width * 1.4,
    backgroundColor: COLORS.tertiary,
    top: -width * 0.5,
    left: -width * 0.3,
  },
  circle2: {
    width: width * 1.1,
    height: width * 1.1,
    backgroundColor: COLORS.primary,
    bottom: -width * 0.3,
    right: -width * 0.4,
  },
  circle3: {
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: COLORS.quaternary,
    top: height * 0.4,
    left: width * 0.2,
    opacity: 0.3,
  },
  content: {
    flex: 1,
    zIndex: 1,
  }
});

export default GlassBackground;
