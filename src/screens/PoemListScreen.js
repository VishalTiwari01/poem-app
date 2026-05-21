import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme/theme';
import { POEMS } from '../data/poems';
import GlassBackground from '../components/GlassBackground';

const PoemListScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('PoemDetail', { poem: item })}
      activeOpacity={0.8}
    >
      <View style={[styles.iconWrapper, { backgroundColor: item.color || COLORS.vibrantBlue }]}>
        <View style={styles.iconInner}>
           <Image source={{ uri: item.image }} style={styles.icon} />
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.preview} numberOfLines={2}>{item.preview}</Text>
      </View>
      <View style={styles.chevron}>
         <Text style={styles.chevronText}>〉</Text>
      </View>
    </TouchableOpacity>
  );


  return (
    <GlassBackground>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + SPACING.sm : SPACING.md + SPACING.sm }]}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <View style={styles.backButtonCircle}>
               <Text style={styles.backIcon}>←</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>POEMS</Text>
          <Text style={styles.headerIcon}>🎵</Text>
        </View>

        <FlatList
          data={POEMS}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </GlassBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  headerIcon: {
    position: 'absolute',
    right: SPACING.md,
    fontSize: 24,
  },
  listContent: {
    padding: SPACING.md,
    paddingBottom: 120,
  },
  card: {
    flexDirection: 'row',
    borderRadius: RADIUS.xxl,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.03)',
    ...SHADOWS.medium,
  },
  iconWrapper: {
    width: 75,
    height: 75,
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
  icon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },

  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 2,
  },

  preview: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  chevron: {
    marginLeft: SPACING.sm,
  },
  chevronText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
  },
});


export default PoemListScreen;
