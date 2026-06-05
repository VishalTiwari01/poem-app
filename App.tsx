import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Tts from 'react-native-tts';
import HomeScreen from './src/screens/HomeScreen';
import LetterDetailScreen from './src/screens/LetterDetailScreen';
import PoemDetailScreen from './src/screens/PoemDetailScreen';
import PoemListScreen from './src/screens/PoemListScreen';
import CountingScreen from './src/screens/CountingScreen';

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    const initTts = async () => {
      try {
        await Tts.getInitStatus();
      } catch (err) {
        console.log('TTS GetInitStatus Error:', err);
        return;
      }

      try {
        await Tts.setDefaultEngine('com.google.android.tts');
      } catch (err) {
        console.log('TTS SetDefaultEngine Error:', err);
      }

      try {
        await Tts.setDefaultLanguage('en-US');
      } catch (err) {
        console.log('TTS SetDefaultLanguage Error:', err);
      }

      try {
        const voices = await Tts.voices();
        
        // Find local/offline English voices to prevent network timeouts on emulators
        const localEnglishVoices = voices.filter(v => 
          v.language.startsWith('en') && 
          v.local === true && 
          v.networkConnectionRequired === false
        );

        // Find high-quality voices (tpf, sfg, neural, wavenet local variants)
        const premiumVoices = localEnglishVoices.filter(v => 
          v.id.includes('tpf') || v.id.includes('sfg') || v.id.includes('neural') || v.id.includes('wavenet')
        );

        const selectedVoice = premiumVoices[0] || localEnglishVoices[0] || voices.find(v => v.language.startsWith('en-US'));

        if (selectedVoice) {
          console.log('Using Local Voice:', selectedVoice.id);
          await Tts.setDefaultVoice(selectedVoice.id);
        }
      } catch (err) {
        console.log('TTS Voice Setup Error:', err);
      }

      try {
        await Tts.setDucking(true);
        Tts.setDefaultPitch(1.15);      
        Tts.setDefaultRate(0.5, true); 
      } catch (err) {
        console.log('TTS Settings Error:', err);
      }
    };

    initTts();

    const startListener = Tts.addEventListener('tts-start', (event) => console.log('TTS Started:', event));
    const finishListener = Tts.addEventListener('tts-finish', (event) => console.log('TTS Finished:', event));
    const cancelListener = Tts.addEventListener('tts-cancel', (event) => console.log('TTS Cancelled:', event));

    return () => {
      startListener.remove();
      finishListener.remove();
      cancelListener.remove();
    };
  }, []);


  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="LetterDetail" component={LetterDetailScreen} />
        <Stack.Screen name="PoemList" component={PoemListScreen} />
        <Stack.Screen name="PoemDetail" component={PoemDetailScreen} />
        <Stack.Screen name="Counting" component={CountingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;
