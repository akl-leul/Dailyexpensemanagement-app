import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { ArrowLeft, Phone, Mail, MessageCircle, CircleHelp as HelpCircle, Book, Bug, Star, ExternalLink } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';

function SupportOption({ icon, title, description, onPress, showExternal = false }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onPress: () => void;
  showExternal?: boolean;
}) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity style={styles.supportOption} onPress={onPress}>
      <View style={styles.optionIcon}>
        {icon}
      </View>
      <View style={styles.optionContent}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionDescription}>{description}</Text>
      </View>
      {showExternal && (
        <ExternalLink size={20} color={theme.colors.textTertiary} />
      )}
    </TouchableOpacity>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const { theme } = useTheme();
  const [expanded, setExpanded] = React.useState(false);
  const styles = createStyles(theme);

  return (
    <TouchableOpacity 
      style={styles.faqItem} 
      onPress={() => setExpanded(!expanded)}
    >
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{question}</Text>
        <Text style={[styles.faqToggle, { transform: [{ rotate: expanded ? '45deg' : '0deg' }] }]}>
          +
        </Text>
      </View>
      {expanded && (
        <Text style={styles.faqAnswer}>{answer}</Text>
      )}
    </TouchableOpacity>
  );
}

export default function SupportScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handlePhoneCall = () => {
    Linking.openURL('tel:+251963889227').catch(() => {
      Alert.alert('Error', 'Unable to make phone call');
    });
  };

  const handleEmail = () => {
    Linking.openURL('mailto:leul.ayfokru@example.com?subject=Expense Tracker Support').catch(() => {
      Alert.alert('Error', 'Unable to open email client');
    });
  };

  const handleReportBug = () => {
    Alert.alert(
      'Report a Bug',
      'Please describe the issue you encountered and we will investigate it promptly.',
      [{ text: 'OK' }]
    );
  };

  const handleRateApp = () => {
    Alert.alert(
      'Rate Our App',
      'Thank you for considering rating our app! Your feedback helps us improve.',
      [{ text: 'OK' }]
    );
  };

  const faqData = [
    {
      question: "How do I add a new transaction?",
      answer: "Tap the 'Add' tab at the bottom of the screen, select whether it's an income or expense, enter the amount, description, category, and date, then tap 'Add Transaction'."
    },
    {
      question: "Can I edit or delete transactions?",
      answer: "Yes! In the transactions list, tap the edit icon to modify a transaction or the trash icon to delete it. You'll be asked to confirm before deleting."
    },
    {
      question: "How do I export my data?",
      answer: "Go to Settings > Data Management > Export Data. This will create a file with all your transaction history that you can save or share."
    },
    {
      question: "Is my financial data secure?",
      answer: "Absolutely! Your data is stored locally on your device and encrypted. We don't store your financial information on external servers unless you choose to backup to cloud services."
    },
    {
      question: "How do I enable dark mode?",
      answer: "Go to Settings and toggle the 'Dark Mode' switch. The app will automatically switch between light and dark themes."
    },
    {
      question: "Can I set budget limits?",
      answer: "Budget setting features are coming in a future update. Currently, you can track your spending patterns through the Analytics tab."
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={theme.colors.text === '#111827' ? 'dark-content' : 'light-content'} backgroundColor={theme.colors.surface} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <HelpCircle size={48} color={theme.colors.primary} />
          <Text style={styles.introTitle}>How can we help?</Text>
          <Text style={styles.introText}>
            Get quick answers to common questions or contact our developer directly for personalized support.
          </Text>
        </View>

        {/* Contact Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Developer</Text>
          
          <SupportOption
            icon={<Phone size={20} color={theme.colors.primary} />}
            title="Phone Support"
            description="Call for immediate assistance"
            onPress={handlePhoneCall}
            showExternal
          />
          
          <SupportOption
            icon={<Mail size={20} color={theme.colors.primary} />}
            title="Email Support"
            description="Send us a detailed message"
            onPress={handleEmail}
            showExternal
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <SupportOption
            icon={<Bug size={20} color={theme.colors.error} />}
            title="Report a Bug"
            description="Found an issue? Let us know"
            onPress={handleReportBug}
          />
          
          <SupportOption
            icon={<Star size={20} color={theme.colors.warning} />}
            title="Rate the App"
            description="Share your experience"
            onPress={handleRateApp}
          />
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqData.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </View>

        {/* Developer Info */}
        <View style={styles.developerCard}>
          <Text style={styles.developerTitle}>About the Developer</Text>
          <Text style={styles.developerName}>Leul Ayfokru</Text>
          <Text style={styles.developerRole}>Fullstack Developer</Text>
          <Text style={styles.developerExperience}>3+ Years Experience in Web & Mobile Development</Text>
          
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Phone size={16} color={theme.colors.primary} />
              <Text style={styles.contactText}>+251963889227</Text>
            </View>
          </View>
          
          <Text style={styles.developerNote}>
            Dedicated to creating intuitive financial tools that help users take control of their money. 
            Available for custom development projects and app enhancements.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Response time: Usually within 24 hours
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
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: 16,
    },
    supportOption: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    optionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    optionContent: {
      flex: 1,
    },
    optionTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: 2,
    },
    optionDescription: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
    },
    faqItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 8,
    },
    faqHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    faqQuestion: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      flex: 1,
      marginRight: 12,
    },
    faqToggle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: theme.colors.primary,
      width: 24,
      textAlign: 'center',
    },
    faqAnswer: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      lineHeight: 20,
      marginTop: 12,
    },
    developerCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      alignItems: 'center',
    },
    developerTitle: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.colors.textTertiary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 8,
    },
    developerName: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
      marginBottom: 4,
    },
    developerRole: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: theme.colors.primary,
      marginBottom: 4,
    },
    developerExperience: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      marginBottom: 16,
      textAlign: 'center',
    },
    contactInfo: {
      alignItems: 'center',
      marginBottom: 16,
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    contactText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.colors.text,
    },
    developerNote: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 18,
    },
    footer: {
      alignItems: 'center',
      marginBottom: 32,
    },
    footerText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: theme.colors.textTertiary,
    },
  });
}