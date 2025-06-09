import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { ArrowLeft, Shield, Eye, Database, Lock, UserCheck, FileText } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';

function PrivacySection({ icon, title, content }: {
  icon: React.ReactNode;
  title: string;
  content: string;
}) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIcon}>
          {icon}
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <Text style={styles.sectionContent}>{content}</Text>
    </View>
  );
}

export default function PrivacyScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={theme.colors.text === '#111827' ? 'dark-content' : 'light-content'} backgroundColor={theme.colors.surface} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <Shield size={48} color={theme.colors.primary} />
          <Text style={styles.introTitle}>Your Privacy Matters</Text>
          <Text style={styles.introText}>
            We are committed to protecting your privacy and ensuring the security of your financial data. 
            This policy explains how we collect, use, and protect your information.
          </Text>
          <Text style={styles.lastUpdated}>Last updated: December 2024</Text>
        </View>

        <PrivacySection
          icon={<Database size={20} color={theme.colors.primary} />}
          title="Data Collection"
          content="We collect only the financial transaction data you choose to input into the app, including transaction amounts, categories, descriptions, and dates. We do not access your bank accounts, credit cards, or other financial institutions directly."
        />

        <PrivacySection
          icon={<Lock size={20} color={theme.colors.primary} />}
          title="Data Storage & Security"
          content="Your financial data is stored locally on your device and is encrypted using industry-standard security measures. We do not store your personal financial information on external servers unless you explicitly choose to backup your data to cloud services."
        />

        <PrivacySection
          icon={<Eye size={20} color={theme.colors.primary} />}
          title="Data Usage"
          content="Your transaction data is used solely to provide you with expense tracking, budgeting insights, and financial analytics within the app. We do not sell, share, or monetize your personal financial information with third parties."
        />

        <PrivacySection
          icon={<UserCheck size={20} color={theme.colors.primary} />}
          title="Your Rights"
          content="You have complete control over your data. You can export your transaction history, delete individual transactions, or clear all data at any time through the app settings. You can also request data deletion by contacting our support team."
        />

        <PrivacySection
          icon={<FileText size={20} color={theme.colors.primary} />}
          title="Data Sharing"
          content="We do not share your personal financial data with advertisers, marketers, or data brokers. Any analytics data we collect is anonymized and aggregated to improve app performance and user experience."
        />

        <View style={styles.contact}>
          <Text style={styles.contactTitle}>Questions About Privacy?</Text>
          <Text style={styles.contactText}>
            If you have any questions about this privacy policy or how we handle your data, 
            please contact our developer:
          </Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>Leul Ayfokru</Text>
            <Text style={styles.contactPhone}>+251963889227</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By using this app, you agree to this privacy policy. We may update this policy 
            from time to time, and we will notify you of any significant changes.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      padding: 8,
    },
    headerTitle: {
      fontSize: 20,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
    },
    placeholder: {
      width: 40,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    intro: {
      alignItems: 'center',
      marginBottom: 32,
      padding: 24,
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
    },
    introTitle: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
      marginTop: 16,
      marginBottom: 12,
    },
    introText: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 16,
    },
    lastUpdated: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: theme.colors.textTertiary,
    },
    section: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
    },
    sectionContent: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    contact: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 20,
      marginTop: 16,
      marginBottom: 16,
      alignItems: 'center',
    },
    contactTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: 8,
    },
    contactText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 16,
    },
    contactInfo: {
      alignItems: 'center',
    },
    contactName: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.primary,
      marginBottom: 4,
    },
    contactPhone: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.colors.text,
    },
    footer: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 20,
      marginBottom: 32,
    },
    footerText: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textTertiary,
      textAlign: 'center',
      lineHeight: 18,
    },
  });
}