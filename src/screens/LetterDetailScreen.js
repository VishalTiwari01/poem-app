import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import Tts from 'react-native-tts';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme/theme';
import { ALPHABETS } from '../data/alphabets';

const { width } = Dimensions.get('window');

const LetterDetailScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    Tts.setDefaultRate(0.35); // Slow rate for kids
    return () => {
      Tts.stop();
    };
  }, []);


  const handleSpeak = async (letter, word) => {
    try {
      await Tts.getInitStatus();
      console.log(`TTS Request: ${letter} for ${word}`);
      await Tts.stop();
      Tts.speak(`${letter}, for, ${word}`);
    } catch (err) {
      console.log('TTS Speak Error:', err);
    }
  };


  const goToNext = () => {
    if (currentIndex < ALPHABETS.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      flatListRef.current.scrollToIndex({ index: prevIndex, animated: true });
      setCurrentIndex(prevIndex);
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;



  const renderItem = ({ item }) => (
    <View style={[styles.content, { width }]}>
      <View style={styles.card}>
        <View style={[styles.letterSection, { backgroundColor: item.color + '20' }]}>
           <View style={[styles.letterBox, { backgroundColor: item.color }]}>
             <Text style={styles.letter}>{item.letter}</Text>
           </View>
        </View>

        <View style={styles.detailsSection}>
          <View style={styles.imageWrapper}>
            <View style={styles.dashedBorder}>
              <Image source={{ uri: item.image }} style={styles.image} />
            </View>
          </View>

          <Text style={styles.wordText}>
            <Text style={styles.highlight}>{item.letter}</Text> is for <Text style={styles.wordHighlight}>{item.word}</Text>
          </Text>

          <TouchableOpacity 
            style={[styles.listenButton, { backgroundColor: item.color }]}
            onPress={() => handleSpeak(item.letter, item.word)}
            activeOpacity={0.8}
          >
            <View style={styles.listenButtonInner}>
              <Text style={styles.listenIcon}>🔊</Text>
              <Text style={styles.listenText}>LISTEN</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top : SPACING.md }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <View style={styles.backButtonCircle}>
             <Text style={styles.backIcon}>←</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>STORY BUILDER</Text>
      </View>

      <View style={styles.listContainer}>
        <FlatList
          ref={flatListRef}
          data={ALPHABETS}
          keyExtractor={item => item.letter}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        />

        {currentIndex > 0 && (
          <TouchableOpacity style={[styles.navButton, styles.leftNav]} onPress={goToPrev}>
            <Text style={styles.navIcon}>◀</Text>
          </TouchableOpacity>
        )}

        {currentIndex < ALPHABETS.length - 1 && (
          <TouchableOpacity style={[styles.navButton, styles.rightNav]} onPress={goToNext}>
            <Text style={styles.navIcon}>▶</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: 'transparent',
    ...SHADOWS.soft,
  },

  backButton: {
    position: 'absolute',
    left: SPACING.md,
    zIndex: 10,
  },
  backButtonCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F2F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xxl,
    overflow: 'hidden',
    ...SHADOWS.strong,
    marginHorizontal: SPACING.sm,
  },
  letterSection: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  letterBox: {
    width: 140,
    height: 140,
    borderRadius: RADIUS.xl,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  letter: {
    fontSize: 90,
    fontWeight: '900',
    color: COLORS.white,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  detailsSection: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  imageWrapper: {
    width: 220,
    height: 220,
    marginBottom: SPACING.lg,
  },
  dashedBorder: {
    flex: 1,
    borderWidth: 3,
    borderColor: '#DCDDE1',
    borderStyle: 'dashed',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    backgroundColor: '#FAFAFA',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  wordText: {
    fontSize: 34,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  highlight: {
    fontSize: 42,
    fontWeight: '900',
    color: COLORS.primary,
  },
  wordHighlight: {
    color: COLORS.secondary,
    textDecorationLine: 'underline',
  },
  listenButton: {
    width: '100%',
    borderRadius: RADIUS.full,
    ...SHADOWS.medium,
    overflow: 'hidden',
  },
  listenButtonInner: {
    flexDirection: 'row',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  listenIcon: {
    fontSize: 24,
    color: COLORS.white,
    marginRight: SPACING.md,
  },
  listenText: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 2,
  },
  listContainer: {
    flex: 1,
    position: 'relative',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    ...SHADOWS.medium,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  leftNav: {
    left: SPACING.sm,
  },
  rightNav: {
    right: SPACING.sm,
  },
  navIcon: {
    fontSize: 28,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default LetterDetailScreen;


