import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Tts from 'react-native-tts';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme/theme';

const MascotGreeting = ({ message }) => {
  // Voice removed from auto-play as per user request
  useEffect(() => {
    const setupTts = async () => {
      try {
        await Tts.getInitStatus();
        Tts.setDefaultRate(0.35); // Slow rate for kids
      } catch (err) {
        console.log('MascotGreeting TTS Setup Error:', err);
      }
    };
    setupTts();
  }, []);



  const handlePress = async () => {
    try {
      await Tts.getInitStatus();
      Tts.stop();
      Tts.speak(message);
    } catch (err) {
      console.log('Mascot press TTS not ready:', err);
    }
  };


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.mascotContainer} onPress={handlePress}>
        <Image 
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3069/3069172.png' }} 
          style={styles.mascot} 
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.speechBubble} onPress={handlePress}>
        <Text style={styles.message}>{message}</Text>
      </TouchableOpacity>

    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    marginBottom: SPACING.lg,
  },
  mascotContainer: {
    width: 85,
    height: 85,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.03)',
    padding: 12,
    ...SHADOWS.medium,
  },

  mascot: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  speechBubble: {
    flex: 1,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginLeft: SPACING.md,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.03)',
    ...SHADOWS.medium,
  },

  message: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 24,
  },
});


export default MascotGreeting;
