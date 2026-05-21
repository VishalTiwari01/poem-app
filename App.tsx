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
        await Tts.setDefaultEngine('com.google.android.tts');
        const voices = await Tts.voices();
        
        // Find high-quality smooth female voices (Neural/WaveNet are best)
        const smoothFemaleVoices = voices.filter(v => 
          v.language.startsWith('en') && 
          (v.id.includes('neural') || v.id.includes('wavenet') || v.id.includes('sfg') || v.id.includes('tpf'))
        );

        const selectedVoice = smoothFemaleVoices[0] || voices.find(v => v.id.includes('network')) || voices.find(v => v.language.startsWith('en-US'));

        if (selectedVoice) {
          console.log('Using Humanized Voice:', selectedVoice.id);
          await Tts.setDefaultVoice(selectedVoice.id);
        }

        await Tts.setDefaultLanguage('en-US');
        await Tts.setDucking(true);
        // Pitch 1.1 - 1.2 sounds more friendly/human for children
        Tts.setDefaultPitch(1.15);      
        // Rate 0.5 is standard human conversational speed
        Tts.setDefaultRate(0.5, true); 



      } catch (err) {
        console.log('TTS Global Init Error:', err);
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
