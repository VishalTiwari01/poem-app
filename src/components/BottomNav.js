import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme/theme';
import { useNavigation } from '@react-navigation/native';

const BottomNav = ({ activeTab }) => {
  const navigation = useNavigation();

  const tabs = [
    { name: 'HOME', icon: '🏠', route: 'Home' },
    { name: 'BUILD', icon: '🪄', route: 'LetterDetail' },
    { name: 'STORIES', icon: '📖', route: 'Quiz' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;
        return (
          <TouchableOpacity 
            key={tab.name} 
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => navigation.navigate(tab.route)}
          >
            <Text style={[styles.icon, isActive && styles.activeText]}>{tab.icon}</Text>
            <Text style={[styles.label, isActive && styles.activeText]}>{tab.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    justifyContent: 'space-around',
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    ...SHADOWS.medium,
  },
  tab: {
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: RADIUS.lg,
    minWidth: 80,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.light,
  },
  icon: {
    fontSize: 20,
    color: COLORS.textSecondary,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  activeText: {
    color: COLORS.text,
  },
});

export default BottomNav;
