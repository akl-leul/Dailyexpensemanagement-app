import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { User, Bell, Shield, Download, Upload, Trash2, CircleHelp as HelpCircle, ChevronRight, Moon, Phone, Mail } from 'lucide-react-native';
import { TransactionProvider, useTransactions } from '@/contexts/TransactionContext';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';

function SettingItem({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  rightElement, 
  showChevron = true 
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showChevron?: boolean;
}) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          {icon}
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightElement}
        {showChevron && <ChevronRight size={20} color={theme.colors.textTertiary} />}
      </View>
    </TouchableOpacity>
  );
}

function SettingsScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { transactions } = useTransactions();
  const [notifications, setNotifications] = React.useState(true);

  const styles = createStyles(theme);

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'This feature would export your transaction data as CSV or JSON file.',
      [{ text: 'OK' }]
    );
  };

  const handleImportData = () => {
    Alert.alert(
      'Import Data',
      'This feature would allow you to import transaction data from a file.',
      [{ text: 'OK' }]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your transactions. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete All', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Demo Mode', 'Data clearing is disabled in demo mode.');
          }
        },
      ]
    );
  };

  const handlePrivacy = () => {
    router.push('/privacy');
  };

  const handleSupport = () => {
    router.push('/support');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={theme.colors.text === '#111827' ? 'dark-content' : 'light-content'} backgroundColor={theme.colors.surface} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          <SettingItem
            icon={<Bell size={20} color={theme.colors.textSecondary} />}
            title="Notifications"
            subtitle="Budget alerts and reminders"
            rightElement={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={notifications ? '#FFFFFF' : '#FFFFFF'}
              />
            }
            showChevron={false}
          />
          <SettingItem
            icon={<Moon size={20} color={theme.colors.textSecondary} />}
            title="Dark Mode"
            subtitle={isDark ? "Switch to light theme" : "Switch to dark theme"}
            rightElement={
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={isDark ? '#FFFFFF' : '#FFFFFF'}
              />
            }
            showChevron={false}
          />
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          <SettingItem
            icon={<Download size={20} color={theme.colors.textSecondary} />}
            title="Export Data"
            subtitle="Download your transaction history"
            onPress={handleExportData}
          />
          <SettingItem
            icon={<Upload size={20} color={theme.colors.textSecondary} />}
            title="Import Data"
            subtitle="Import transactions from file"
            onPress={handleImportData}
          />
          <SettingItem
            icon={<Trash2 size={20} color={theme.colors.error} />}
            title="Clear All Data"
            subtitle="Permanently delete all transactions"
            onPress={handleClearData}
          />
        </View>

        {/* Security & Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security & Privacy</Text>
          <SettingItem
            icon={<Shield size={20} color={theme.colors.textSecondary} />}
            title="Privacy Policy"
            subtitle="Data usage and privacy controls"
            onPress={handlePrivacy}
          />
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <SettingItem
            icon={<HelpCircle size={20} color={theme.colors.textSecondary} />}
            title="Help & Support"
            subtitle="FAQ, contact support"
            onPress={handleSupport}
          />
        </View>

        {/* Developer Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoTitle}>Expense Tracker</Text>
          <Text style={styles.appInfoVersion}>Version 1.0.0</Text>
          <Text style={styles.appInfoText}>
            Manage your daily expenses and income with ease. Track spending, set budgets, and achieve your financial goals.
          </Text>
          <Text style={styles.appInfoStats}>
            {transactions.length} transactions recorded
          </Text>
          
          <View style={styles.developerInfo}>
            <Text style={styles.developerTitle}>Developed by</Text>
            <Text style={styles.developerName}>Leul Ayfokru</Text>
            <Text style={styles.developerRole}>Fullstack Developer</Text>
            <Text style={styles.developerExperience}>3+ Years Experience</Text>
            
            <View style={styles.contactInfo}>
              <View style={styles.contactItem}>
                <Phone size={16} color={theme.colors.primary} />
                <Text style={styles.contactText}>+251963889227</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function SettingsTab() {
  return (
    <TransactionProvider>
      <SettingsScreen />
    </TransactionProvider>
  );
}

function createStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
    },
    content: {
      flex: 1,
    },
    section: {
      marginTop: 24,
    },
    sectionTitle: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      paddingHorizontal: 20,
      marginBottom: 12,
    },
    settingItem: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 20,
      paddingVertical: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    settingContent: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: theme.colors.text,
      marginBottom: 2,
    },
    settingSubtitle: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
    },
    settingRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    appInfo: {
      backgroundColor: theme.colors.surface,
      margin: 20,
      padding: 20,
      borderRadius: 16,
      alignItems: 'center',
      marginTop: 32,
    },
    appInfoTitle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
      marginBottom: 4,
    },
    appInfoVersion: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.colors.textSecondary,
      marginBottom: 12,
    },
    appInfoText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 12,
    },
    appInfoStats: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: theme.colors.primary,
      marginBottom: 20,
    },
    developerInfo: {
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingTop: 20,
      width: '100%',
    },
    developerTitle: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: theme.colors.textTertiary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 8,
    },
    developerName: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
      marginBottom: 4,
    },
    developerRole: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.colors.primary,
      marginBottom: 2,
    },
    developerExperience: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      marginBottom: 16,
    },
    contactInfo: {
      alignItems: 'center',
      gap: 8,
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
  });
}