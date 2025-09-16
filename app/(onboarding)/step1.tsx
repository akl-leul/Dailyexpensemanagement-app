import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { TrendingUp } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { height, width } = Dimensions.get('window');

export default function Step1() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../../assets/images/img-1.jpg')}
      style={{ width, height }}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['transparent', 'rgba(0, 0, 0, 0.8)', '#ff5e00ff']}
        style={[StyleSheet.absoluteFill]}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <TrendingUp size={64} color="#ff5e00ff" strokeWidth={1.5} />
          </View>

          <Text style={styles.title}>Track Your Income</Text>
          <Text style={styles.description}>
            Easily add and categorize all your income sources. From salary to
            freelance work, keep track of every dollar that comes in.
          </Text>
        </View>

        <View style={styles.navigation}>
          <View style={styles.indicators}>
            <View style={[styles.indicator, styles.indicatorActive]} />
            <View style={styles.indicator} />
            <View style={styles.indicator} />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/(onboarding)/step2')}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'space-between', 
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ff5e0028',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#EEEEEE',
    textAlign: 'center',
    lineHeight: 24,
  },
  navigation: {
    paddingHorizontal: 32,
    paddingBottom: 48,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CCCCCC',
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: '#3A86FF',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 21,
    fontFamily: 'Inter-SemiBold',
    color: '#ff5e00ff',
  },
});
