import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useApp } from '@/context/AppContext';

export default function Index() {
  const router = useRouter();
  const { state } = useApp();

  useEffect(() => {
    // Only navigate after loading is complete
    if (!state.isLoading) {
      const timer = setTimeout(() => {
        if (state.isOnboarded) {
          router.replace('/(tabs)');
        } else {
          router.replace('/(onboarding)');
        }
      }, 1500); // Show splash for 1.5 seconds

      return () => clearTimeout(timer);
    }
  }, [state.isLoading, state.isOnboarded, router]);

  return (
    <View style={[styles.container, { backgroundColor: state.theme.primary }]}>
      <View style={styles.content}>
        <Text style={styles.title}>ExpenseTracker</Text>
        <Text style={styles.subtitle}>Loading your data...</Text>
        <ActivityIndicator 
          size="large" 
          color="white" 
          style={styles.loader}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 32,
  },
  loader: {
    marginTop: 16,
  },
});