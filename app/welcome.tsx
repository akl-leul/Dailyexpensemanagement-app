import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { TrendingUp, TrendingDown, PiggyBank, Wallet, BarChart3, CalendarDays, BadgeDollarSign, Sparkles } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Futuristic Gradient Background Circles */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      {/* Centerpiece Icon with Glow */}
      <View style={styles.centerpiece}>
        <PiggyBank size={72} color={theme.colors.primary} style={styles.centerIcon} />
        <View style={[styles.glow, { backgroundColor: theme.colors.primary + '33' }]} />
      </View>

      {/* Animated Icon Row */}
      <View style={styles.iconRow}>
        <TrendingUp size={36} color={theme.colors.income || theme.colors.primary} style={styles.icon} />
        <TrendingDown size={36} color={theme.colors.expense || theme.colors.error} style={styles.icon} />
        <Wallet size={36} color={theme.colors.textSecondary} style={styles.icon} />
        <BarChart3 size={36} color={theme.colors.primary} style={styles.icon} />
      </View>

      {/* Features Section */}
      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <BadgeDollarSign size={24} color={theme.colors.primary} />
          <Text style={styles.featureText}>Expense & Income Tracking</Text>
        </View>
        <View style={styles.featureItem}>
          <CalendarDays size={24} color={theme.colors.primary} />
          <Text style={styles.featureText}>Monthly Reports</Text>
        </View>
        <View style={styles.featureItem}>
          <BarChart3 size={24} color={theme.colors.primary} />
          <Text style={styles.featureText}>Analytics & Insights</Text>
        </View>
        <View style={styles.featureItem}>
          <Sparkles size={24} color={theme.colors.primary} />
          <Text style={styles.featureText}>Futuristic UI</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.primary }]}>Welcome!</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          The future of finance is here. Track, analyze, and optimize your daily expenses and income with futuristic insights and a beautiful interface.
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary, shadowColor: theme.colors.primary }]}
          onPress={() => router.replace('/(tabs)')}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.footer, { color: theme.colors.textTertiary }]}>
        © {new Date().getFullYear()} Build by Leul Ayfokru
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 32,
    overflow: 'hidden',
  },
  // Futuristic background circles
  bgCircle1: {
    position: 'absolute',
    top: -width * 0.3,
    left: -width * 0.2,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: '#7F5FFF33',
    zIndex: -2,
    opacity: 0.5,
  },
  bgCircle2: {
    position: 'absolute',
    bottom: -width * 0.25,
    right: -width * 0.2,
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: '#00D1FF33',
    zIndex: -2,
    opacity: 0.4,
  },
  centerpiece: {
    marginTop: 40,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerIcon: {
    zIndex: 2,
  },
  glow: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    top: -19,
    left: -19,
    zIndex: 1,
    shadowColor: '#7F5FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    opacity: 0.7,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
    gap: 24,
  },
  icon: {
    marginHorizontal: 8,
    opacity: 0.92,
    transform: [{ scale: 1.08 }],
  },
  featuresContainer: {
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff2',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 4,
    marginHorizontal: 2,
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#444',
    fontFamily: 'Inter-Medium',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 38,
    fontFamily: 'Inter-Bold',
    marginBottom: 14,
    letterSpacing: 1.2,
    textShadowColor: '#7F5FFF44',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 17,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: 340,
    lineHeight: 24,
    opacity: 0.92,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    letterSpacing: 1,
    textShadowColor: '#00000022',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  footer: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    marginBottom: 10,
    textAlign: 'center',
    opacity: 0.7,
  },
});