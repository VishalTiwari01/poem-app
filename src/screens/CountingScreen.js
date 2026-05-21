import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import Tts from 'react-native-tts';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme/theme';
import GlassBackground from '../components/GlassBackground';
import MascotGreeting from '../components/MascotGreeting';
import { NUMBERS } from '../data/numbers';

const CountingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentNumber = NUMBERS[currentIndex];
  const insets = useSafeAreaInsets();

  const handleSpeak = async (num, word) => {
    try {
      await Tts.getInitStatus();
      await Tts.stop();
      Tts.speak(`${num}, is, ${word}`);
    } catch (err) {
      console.log('TTS Speak Error:', err);
    }
  };

  const goToNext = () => {
    if (currentIndex < NUMBERS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <GlassBackground>
      <SafeAreaView style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + SPACING.sm : SPACING.md }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>1234 COUNTING</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          <MascotGreeting message={`Can you count to ${NUMBERS.length}?`} />

          <View style={[styles.card, { backgroundColor: currentNumber.color }]}>
            <Text style={styles.numberText}>{currentNumber.number}</Text>
            <Text style={styles.imageText}>{currentNumber.image}</Text>
            <Text style={styles.wordText}>{currentNumber.word}</Text>
          </View>

          <TouchableOpacity 
            style={styles.listenButton}
            onPress={() => handleSpeak(currentNumber.number, currentNumber.word)}
          >
            <Text style={styles.listenButtonText}>🔊 LISTEN</Text>
          </TouchableOpacity>

          <View style={styles.navigation}>
            <TouchableOpacity 
              style={[styles.navButton, currentIndex === 0 && styles.disabledButton]} 
              onPress={goToPrev}
              disabled={currentIndex === 0}
            >
              <Text style={styles.navButtonText}>PREV</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.navButton, currentIndex === NUMBERS.length - 1 && styles.disabledButton]} 
              onPress={goToNext}
              disabled={currentIndex === NUMBERS.length - 1}
            >
              <Text style={styles.navButtonText}>NEXT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </GlassBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.text,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: { color: COLORS.white, fontSize: 24, fontWeight: 'bold' },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: RADIUS.xl,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.glassMedium,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.05)',
    marginBottom: SPACING.lg,
  },
  numberText: {
    fontSize: 120,
    fontWeight: '900',
    color: COLORS.text,
  },


  imageText: {
    fontSize: 40,
    marginVertical: SPACING.sm,
  },
  wordText: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 4,
  },

  listenButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: RADIUS.full,
    ...SHADOWS.glassSmall,
    marginBottom: SPACING.xl,
  },
  listenButtonText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  navButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
  },
  navButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: { opacity: 0.3 },
});

export default CountingScreen;
