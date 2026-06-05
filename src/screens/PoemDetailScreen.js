import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  useSafeAreaInsets,
  SafeAreaView,
} from 'react-native-safe-area-context';
import Tts from 'react-native-tts';
import {
  COLORS,
  SPACING,
  RADIUS,
  SHADOWS,
} from '../theme/theme';
import MascotGreeting from '../components/MascotGreeting';
import GlassBackground from '../components/GlassBackground';

const PoemDetailScreen = ({ navigation, route }) => {
  // 1. ALL HOOKS AT THE TOP
  const insets = useSafeAreaInsets();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [activeWordIndex, setActiveWordIndex] = useState(-1);

  const isPlayingRef = useRef(false);
  const poemRef = useRef(null);
  const lineRangesRef = useRef([]);

  // 2. DATA CALCULATION
  const poem = useMemo(() => route?.params?.poem || {
    title: 'Twinkle Twinkle Little Star',
    lyrics: [
      'Twinkle, twinkle, little star,',
      'How I wonder what you are!',
      'Up above the world so high,',
      'Like a diamond in the sky.',
    ],
    color: '#FFD93D',
  }, [route?.params?.poem]);

  const fullPoemText = useMemo(() => poem.lyrics.join('\n'), [poem]);

  // 3. SYNC REFS AND CALCULATE RANGES
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    poemRef.current = poem;
    
    // Calculate line ranges once when poem changes
    let start = 0;
    lineRangesRef.current = poem.lyrics.map((line) => {
      const end = start + line.length;
      const range = { start, end };
      start = end + 1; // +1 for the \n
      return range;
    });
  }, [poem]);

  // 4. TTS SETUP
  useEffect(() => {
    const setupTts = async () => {
      try {
        await Tts.getInitStatus();
        Tts.setDefaultRate(0.22);
        Tts.setDefaultPitch(1.0);
      } catch (err) {
        console.log('PoemDetailScreen TTS Setup Error:', err);
      }
    };
    setupTts();

    const progressListener = Tts.addEventListener('tts-progress', (event) => {
      if (!isPlayingRef.current) return;

      const currentPosition = event.location;
      setActiveWordIndex(currentPosition);

      // Find current line based on character position
      const activeLine = lineRangesRef.current.findIndex(
        (range) => currentPosition >= range.start && currentPosition <= range.end
      );
      
      if (activeLine !== -1) {
        setCurrentLineIndex(activeLine);
      }
    });

    const finishListener = Tts.addEventListener('tts-finish', () => {
      setIsPlaying(false);
      setCurrentLineIndex(-1);
      setActiveWordIndex(-1);
    });

    const errorListener = Tts.addEventListener('tts-error', (event) => {
      console.log('TTS Error:', event);
      setIsPlaying(false);
      setCurrentLineIndex(-1);
      setActiveWordIndex(-1);
    });

    // Auto play on entry
    const startAutoPlay = async () => {
      try {
        await Tts.getInitStatus();
        setTimeout(() => {
          setIsPlaying(true);
          Tts.speak(poemRef.current.lyrics.join('\n'), { utteranceId: 'full_poem' });
        }, 1000);
      } catch (err) {
        console.log('Auto-play failed:', err);
      }
    };

    startAutoPlay();

    return () => {
      Tts.stop();
      progressListener.remove();
      finishListener.remove();
      errorListener.remove();
    };
  }, []);

  // 5. HANDLERS
  const togglePlayback = async () => {
    try {
      await Tts.getInitStatus();
      if (isPlaying) {
        Tts.stop();
        setIsPlaying(false);
        setCurrentLineIndex(-1);
        setActiveWordIndex(-1);
      } else {
        setIsPlaying(true);
        Tts.speak(fullPoemText, { utteranceId: 'full_poem' });
      }
    } catch (err) {
      console.log('TTS Playback Error:', err);
    }
  };

  const speakLine = async (line, index) => {
    try {
      await Tts.getInitStatus();
      Tts.stop();
      setCurrentLineIndex(index);
      setIsPlaying(false);
      Tts.speak(line, { utteranceId: 'single_line' });
    } catch (err) {
      console.log('TTS Speak Line Error:', err);
    }
  };

  // 6. RENDER HELPERS
  const renderLyricLine = (line, lineIndex) => {
    const words = [];
    const lineRange = lineRangesRef.current[lineIndex];
    let currentPos = lineRange ? lineRange.start : 0;

    const splitWords = line.split(/(\s+)/);
    splitWords.forEach((part) => {
      if (part.trim().length > 0) {
        words.push({
          text: part,
          start: currentPos,
          end: currentPos + part.length,
        });
      }
      currentPos += part.length;
    });

    const isCurrentLine = currentLineIndex === lineIndex;

    return (
      <View style={styles.wordsRow}>
        {words.map((word, wIdx) => {
          const isWordActive = isCurrentLine && 
                               activeWordIndex >= word.start && 
                               activeWordIndex < word.end;
          return (
            <Text
              key={wIdx}
              style={[
                styles.lyricLine,
                isCurrentLine && { color: poem.color || COLORS.primary },
                isWordActive && styles.activeWord,
              ]}
            >
              {word.text}{' '}
            </Text>
          );
        })}
      </View>
    );
  };

  return (
    <GlassBackground>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + SPACING.sm : SPACING.md + SPACING.sm }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <View style={styles.backButtonCircle}>
              <Text style={styles.backIcon}>←</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>STORY TIME</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            <MascotGreeting message="Let's read this together! 📖" />
            <Text style={styles.poemTitle}>{poem.title}</Text>

            <ScrollView
              style={styles.lyricsScrollView}
              contentContainerStyle={styles.lyricsContainer}
              showsVerticalScrollIndicator={false}
            >
              {poem.lyrics.map((line, index) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.7}
                  onPress={() => speakLine(line, index)}
                  style={[
                    styles.lineWrapper,
                    currentLineIndex === index && {
                      backgroundColor: (poem.color || COLORS.primary) + '15',
                      borderWidth: 2,
                      borderColor: (poem.color || COLORS.primary) + '40',
                    },
                  ]}
                >
                  {renderLyricLine(line, index)}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.controls}>
              <TouchableOpacity
                style={[styles.playButton, { backgroundColor: poem.color || COLORS.primary }]}
                onPress={togglePlayback}
                activeOpacity={0.8}
              >
                <View style={styles.playButtonInner}>
                  <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.tapToPause}>{isPlaying ? 'TAP TO PAUSE' : 'TAP TO PLAY'}</Text>
            </View>

            <View style={styles.progressWrapper}>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: currentLineIndex >= 0 ? `${((currentLineIndex + 1) / poem.lyrics.length) * 100}%` : '0%',
                      backgroundColor: poem.color || COLORS.primary,
                    },
                  ]}
                />
              </View>
            </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: RADIUS.xxl,
    borderBottomRightRadius: RADIUS.xxl,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
    zIndex: 10,
  },
  backButton: { position: 'absolute', left: SPACING.md, zIndex: 10 },
  backButtonCircle: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#F1F2F6', justifyContent: 'center', alignItems: 'center',
  },
  backIcon: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  headerTitle: {
    fontSize: 28, fontWeight: '900', color: COLORS.text,
    letterSpacing: 2, textTransform: 'uppercase',
  },
  content: { padding: SPACING.md, flex: 1, justifyContent: 'center' },
  card: {
    flex: 1, borderRadius: RADIUS.xxl, padding: SPACING.lg,
    backgroundColor: COLORS.white, borderWidth: 2, borderColor: 'rgba(0,0,0,0.03)',
    ...SHADOWS.strong, overflow: 'hidden',
  },
  poemTitle: {
    fontSize: 28, fontWeight: '900', color: COLORS.text, textAlign: 'center',
    marginBottom: SPACING.xl, textTransform: 'uppercase', letterSpacing: 1,
  },
  lyricsScrollView: { flex: 1, width: '100%', marginBottom: SPACING.xl },
  lyricsContainer: { alignItems: 'center', paddingBottom: SPACING.md },
  lineWrapper: {
    paddingVertical: 12, paddingHorizontal: 20, borderRadius: RADIUS.lg,
    marginBottom: 8, width: '100%',
  },
  lyricLine: {
    fontSize: 24, fontWeight: '800', color: COLORS.text,
    textAlign: 'center', lineHeight: 38,
  },
  wordsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  activeWord: {
    backgroundColor: '#FFE66D', color: '#000', borderRadius: 8,
    overflow: 'hidden', paddingHorizontal: 4, transform: [{ scale: 1.15 }],
  },
  controls: { alignItems: 'center', marginBottom: SPACING.lg },
  playButton: {
    width: 80, height: 80, borderRadius: 40,
    justifyContent: 'center', alignItems: 'center',
    ...SHADOWS.medium, marginBottom: SPACING.sm, overflow: 'hidden',
  },
  playButtonInner: {
    width: '100%', height: '100%', justifyContent: 'center',
    alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)',
  },
  playIcon: { fontSize: 36, color: COLORS.white },
  tapToPause: {
    fontSize: 14, fontWeight: '900', color: COLORS.textSecondary,
    textTransform: 'uppercase', letterSpacing: 1,
  },
  progressWrapper: { marginTop: SPACING.sm },
  progressTrack: {
    height: 12, backgroundColor: '#F1F2F6', borderRadius: RADIUS.full, overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: RADIUS.full },
});

export default PoemDetailScreen;