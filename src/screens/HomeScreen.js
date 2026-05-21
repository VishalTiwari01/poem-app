import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, SHADOWS, RADIUS } from '../theme/theme';
import MascotGreeting from '../components/MascotGreeting';
import FeatureCard from '../components/FeatureCard';
import GlassBackground from '../components/GlassBackground';

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <GlassBackground>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + SPACING.xs : SPACING.md }]}>
          <View style={styles.headerContent}>
            <Text style={styles.headerEmoji}>🌈</Text>
            <Text style={styles.headerTitle}>ABC PLAYROOM</Text>
            <Text style={styles.headerEmoji}>⭐</Text>
          </View>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <MascotGreeting message="Hi! Let's learn today 😊" />

          <View style={styles.featuresSection}>
            <FeatureCard 
              title="LEARN ABC" 
              subtitle="Find the Zebra!" 
              icon="ABC" 
              color={COLORS.vibrantOrange} 
              onPress={() => navigation.navigate('LetterDetail')} 
            />
            
            <FeatureCard 
              title="1234 COUNTING" 
              subtitle="Learn numbers!" 
              icon="123" 
              color={COLORS.vibrantPurple} 
              onPress={() => navigation.navigate('Counting')} 
            />

            
            <FeatureCard 
              title="POEMS & RHYMES" 
              subtitle="Twinkle Twinkle Stars" 
              icon="🎵" 
              color={COLORS.primary} 
              onPress={() => navigation.navigate('PoemList')} 
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </GlassBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: SPACING.md,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: RADIUS.xxl,
    borderBottomRightRadius: RADIUS.xxl,
    marginBottom: SPACING.lg,
    ...SHADOWS.strong,
    zIndex: 10,
  },

  headerContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  headerEmoji: {
    fontSize: 24,
    marginHorizontal: SPACING.sm,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },


  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 120,
  },
  featuresSection: {
    marginTop: SPACING.sm,
  },
});


export default HomeScreen;
