import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Linking,
  Platform,
} from 'react-native';
import { useApp } from '@/context/AppContext';
import { Moon, Sun, User, Github, Mail, Info, Bug } from 'lucide-react-native';

export default function Settings() {
  const { state, dispatch, debugStorage } = useApp() as any;

  const handleToggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const handleEmailPress = () => {
    if (Platform.OS === 'web') {
      window.open('mailto:layfokru@gmail.com', '_blank');
    } else {
      Linking.openURL('mailto:layfokru@gmail.com');
    }
  };

  const handleGithubPress = () => {
    if (Platform.OS === 'web') {
      window.open('https://github.com/akl-leul', '_blank');
    } else {
      Linking.openURL('https://github.com/akl-leul');
    }
  };

  const handleDebugStorage = () => {
    if (debugStorage) {
      debugStorage();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: state.theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: state.theme.text }]}>
            Settings
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: state.theme.text }]}>
            Appearance
          </Text>
          
          <View style={[styles.settingItem, { backgroundColor: state.theme.card, borderColor: state.theme.border }]}>
            <View style={styles.settingLeft}>
              {state.isDarkMode ? (
                <Moon size={24} color={state.theme.text} strokeWidth={2} />
              ) : (
                <Sun size={24} color={state.theme.text} strokeWidth={2} />
              )}
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: state.theme.text }]}>
                  Dark Mode
                </Text>
                <Text style={[styles.settingSubtitle, { color: state.theme.textSecondary }]}>
                  Switch between light and dark themes
                </Text>
              </View>
            </View>
            <Switch
              value={state.isDarkMode}
              onValueChange={handleToggleTheme}
              trackColor={{ false: state.theme.border, true: state.theme.primary }}
              thumbColor={state.isDarkMode ? 'white' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Debug Section - Remove in production */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: state.theme.text }]}>
            Debug (Development Only)
          </Text>
          
          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: state.theme.card, borderColor: state.theme.border }]}
            onPress={handleDebugStorage}
          >
            <View style={styles.settingLeft}>
              <Bug size={24} color={state.theme.text} strokeWidth={2} />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: state.theme.text }]}>
                  Debug Storage
                </Text>
                <Text style={[styles.settingSubtitle, { color: state.theme.textSecondary }]}>
                  Check console for storage data
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={[styles.settingItem, { backgroundColor: state.theme.card, borderColor: state.theme.border }]}>
            <View style={styles.settingLeft}>
              <Info size={24} color={state.theme.text} strokeWidth={2} />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: state.theme.text }]}>
                  Data Status
                </Text>
                <Text style={[styles.settingSubtitle, { color: state.theme.textSecondary }]}>
                  Transactions: {state.transactions.length}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: state.theme.text }]}>
            About Developer
          </Text>
          
          <View style={[styles.developerCard, { backgroundColor: state.theme.card, borderColor: state.theme.border }]}>
            <View style={styles.developerHeader}>
              <View style={[styles.avatarContainer, { backgroundColor: state.theme.primary + '20' }]}>
                <User size={32} color={state.theme.primary} strokeWidth={2} />
              </View>
              <View style={styles.developerInfo}>
                <Text style={[styles.developerName, { color: state.theme.text }]}>
                  Leul Ayfokru
                </Text>
                <Text style={[styles.developerTitle, { color: state.theme.textSecondary }]}>
                  Full Stack Developer
                </Text>
              </View>
            </View>
            
            <Text style={[styles.developerBio, { color: state.theme.textSecondary }]}>
              Full stack website and application developer with more than 3 years of experience 
              in creating beautiful and functional digital experiences.
            </Text>
            
            <View style={styles.contactButtons}>
              <TouchableOpacity
                style={[styles.contactButton, { backgroundColor: state.theme.primary }]}
                onPress={handleEmailPress}
              >
                <Mail size={20} color="white" strokeWidth={2} />
                <Text style={styles.contactButtonText}>Email</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.contactButton, { backgroundColor: state.theme.text }]}
                onPress={handleGithubPress}
              >
                <Github size={20} color="white" strokeWidth={2} />
                <Text style={styles.contactButtonText}>GitHub</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: state.theme.text }]}>
            App Information
          </Text>
          
          <View style={[styles.settingItem, { backgroundColor: state.theme.card, borderColor: state.theme.border }]}>
            <View style={styles.settingLeft}>
              <Info size={24} color={state.theme.text} strokeWidth={2} />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: state.theme.text }]}>
                  Version
                </Text>
                <Text style={[styles.settingSubtitle, { color: state.theme.textSecondary }]}>
                  ExpenseTracker v1.0.0
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  developerCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  developerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  developerInfo: {
    flex: 1,
  },
  developerName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  developerTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  developerBio: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginBottom: 20,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  contactButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    marginLeft: 8,
  },
});