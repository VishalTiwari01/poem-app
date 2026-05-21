import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme/theme';

const FeatureCard = ({ title, subtitle, icon, color, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconWrapper, { backgroundColor: color || COLORS.vibrantBlue }]}>
        <View style={styles.iconInner}>
          <Text style={styles.iconText}>{icon}</Text>
        </View>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      
      <View style={[styles.arrowContainer, { backgroundColor: color ? color + '10' : '#F1F5F9' }]}>
        <Text style={[styles.arrow, { color: color || COLORS.text }]}>〉</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.xxl,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.03)',
    ...SHADOWS.medium,
  },
  iconWrapper: {
    width: 70,
    height: 70,
    borderRadius: RADIUS.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    ...SHADOWS.soft,
  },
  iconInner: {
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.xl,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconText: {
    fontSize: 32,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '700',
    marginTop: 2,
  },
  arrowContainer: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 18,
    fontWeight: '900',
  },
});



export default FeatureCard;
