import React, { useState } from 'react';
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
  Modal,
} from 'react-native';
import { useApp } from '@/context/AppContext';
import { Moon, Sun, User, Github, Mail, Info, HelpCircle } from 'lucide-react-native';

export default function Settings() {
  const { state, dispatch, debugStorage } = useApp() as any;
  const [showDeveloperModal, setShowDeveloperModal] = useState(false);
  const [showAppInfoModal, setShowAppInfoModal] = useState(false);
  const [showHowToUseModal, setShowHowToUseModal] = useState(false);

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: state.theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: state.theme.text }]}>Settings</Text>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: state.theme.text }]}>Appearance</Text>

          <View style={[styles.settingItem, { backgroundColor: state.theme.card, borderColor: state.theme.border }]}>
            <View style={styles.settingLeft}>
              {state.isDarkMode ? (
                <Moon size={24} color={state.theme.text} strokeWidth={2} />
              ) : (
                <Sun size={24} color={state.theme.text} strokeWidth={2} />
              )}
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: state.theme.text }]}>Dark Mode</Text>
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

        {/* About Developer */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: state.theme.text }]}>About Developer</Text>
          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: state.theme.card, borderColor: state.theme.border }]}
            onPress={() => setShowDeveloperModal(true)}
          >
            <View style={styles.settingLeft}>
              <User size={24} color={state.theme.text} strokeWidth={2} />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: state.theme.text }]}>View Developer Info</Text>
                <Text style={[styles.settingSubtitle, { color: state.theme.textSecondary }]}>
                  Learn more about the creator
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: state.theme.text }]}>App Information</Text>

          {/* App Info Button */}
          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: state.theme.card, borderColor: state.theme.border }]}
            onPress={() => setShowAppInfoModal(true)}
          >
            <View style={styles.settingLeft}>
              <Info size={24} color={state.theme.text} strokeWidth={2} />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: state.theme.text }]}>View App Info</Text>
                <Text style={[styles.settingSubtitle, { color: state.theme.textSecondary }]}>
                  App name, version, and more
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* How to Use */}
          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: state.theme.card, borderColor: state.theme.border }]}
            onPress={() => setShowHowToUseModal(true)}
          >
            <View style={styles.settingLeft}>
              <HelpCircle size={24} color={state.theme.text} strokeWidth={2} />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: state.theme.text }]}>How to Use</Text>
                <Text style={[styles.settingSubtitle, { color: state.theme.textSecondary }]}>
                  Step-by-step usage guide
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Developer Modal */}
      <Modal
        visible={showDeveloperModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDeveloperModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: state.isDarkMode ? '#000000aa' : '#00000066' }]}>
          <View style={[styles.developerCard, { backgroundColor: state.theme.card, borderColor: state.theme.border }]}>
            <View style={styles.developerHeader}>
              <View style={[styles.avatarContainer, { backgroundColor: state.theme.primary + '20' }]}>
                <User size={32} color={state.theme.primary} strokeWidth={2} />
              </View>
              <View style={styles.developerInfo}>
                <Text style={[styles.developerName, { color: state.theme.text }]}>Leul Ayfokru</Text>
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
                <Mail size={20} color="#fff" strokeWidth={2} />
                <Text style={styles.contactButtonText}>Email</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.contactButton, { backgroundColor: '#6e40c9' }]}
                onPress={handleGithubPress}
              >
                <Github size={20} color="#fff" strokeWidth={2} />
                <Text style={styles.contactButtonText}>GitHub</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => setShowDeveloperModal(false)}
              style={{ marginTop: 20, alignSelf: 'center', paddingVertical: 10 }}
            >
              <Text style={{ color: state.theme.primary, fontSize: 16, fontFamily: 'Inter-Medium' }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* App Info Modal */}
      <Modal
        visible={showAppInfoModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAppInfoModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: state.isDarkMode ? '#000000aa' : '#00000066' }]}>
          <View style={[styles.developerCard, { backgroundColor: state.theme.card, borderColor: state.theme.border }]}>
            <View style={styles.developerHeader}>
              <View style={[styles.avatarContainer, { backgroundColor: state.theme.primary + '20' }]}>
                <Info size={32} color={state.theme.primary} strokeWidth={2} />
              </View>
              <View style={styles.developerInfo}>
                <Text style={[styles.developerName, { color: state.theme.text }]}>Expense Tracker</Text>
                <Text style={[styles.developerTitle, { color: state.theme.textSecondary }]}>App Version</Text>
              </View>
            </View>

            <Text style={[styles.developerBio, { color: state.theme.textSecondary }]}>
              Version: <Text style={{ color: state.theme.text }}>v1.0.12</Text>{'\n'}
              Platform: <Text style={{ color: state.theme.text }}>{Platform.OS}</Text>{'\n\n'}
              Key Features:
            </Text>

            <View style={{ marginLeft: 12 }}>
              {[
                '💰 Track expenses in real-time',
                '📊 View categorized spending',
                '🌓 Dark and Light mode support',
                '🔒 Secure local data storage',
                '📅 Weekly and monthly summaries',
                '📤 Export transactions (coming soon)',
              ].map((item, index) => (
                <Text
                  key={index}
                  style={{
                    color: state.theme.textSecondary,
                    fontSize: 14,
                    fontFamily: 'Inter-Regular',
                    marginBottom: 6,
                  }}
                >
                  • {item}
                </Text>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => setShowAppInfoModal(false)}
              style={{ marginTop: 20, alignSelf: 'center', paddingVertical: 10 }}
            >
              <Text style={{ color: state.theme.primary, fontSize: 16, fontFamily: 'Inter-Medium' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

     
     {/* How to Use Modal */}
<Modal
  visible={showHowToUseModal}
  transparent={true}
  animationType="slide"
  onRequestClose={() => setShowHowToUseModal(false)}
>
  <View style={[styles.modalOverlay, { backgroundColor: state.isDarkMode ? '#000000aa' : '#00000066' }]}>
    <View style={[styles.developerCard, { backgroundColor: state.theme.card, borderColor: state.theme.border }]}>
      <Text style={[styles.developerName, { color: state.theme.text, marginBottom: 12 }]}>
        How to Use Expense Tracker
      </Text>
      <Text style={[styles.developerBio, { color: state.theme.textSecondary }]}>
        Here's how to get started:
      </Text>

      <View style={{ marginLeft: 12 }}>
        {[
          '💸 Add a transaction with amount, category, and note.',
          '🔄 Swipe down on dashboard to refresh data.',
          '📊 Use tabs to view analytics and recent expenses.',
          '🌙 Enable dark mode in Settings.',
          '🔐 Your data is stored securely on your device.',
        ].map((step, index) => (
          <Text
            key={index}
            style={{
              color: state.theme.textSecondary,
              fontSize: 14,
              fontFamily: 'Inter-Regular',
              marginBottom: 8,
            }}
          >
            {step}
          </Text>
        ))}
      </View>

      <TouchableOpacity
        onPress={() => setShowHowToUseModal(false)}
        style={{ marginTop: 20, alignSelf: 'center', paddingVertical: 10 }}
      >
        <Text style={{ color: state.theme.primary, fontSize: 16, fontFamily: 'Inter-Medium' }}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... (keep your existing styles here as-is)
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 52, paddingBottom: 24 },
  title: { fontSize: 28, fontFamily: 'Inter-Bold' },
  section: { paddingHorizontal: 24, marginBottom: 32 },
  sectionTitle: { fontSize: 20, fontFamily: 'Inter-SemiBold', marginBottom: 16 },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  settingText: { marginLeft: 16, flex: 1 },
  settingTitle: { fontSize: 16, fontFamily: 'Inter-Medium', marginBottom: 2 },
  settingSubtitle: { fontSize: 14, fontFamily: 'Inter-Regular' },
  developerCard: { padding: 20, borderRadius: 16, borderWidth: 1, margin: 24 },
  developerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  developerInfo: { flex: 1 },
  developerName: { fontSize: 20, fontFamily: 'Inter-Bold', marginBottom: 4 },
  developerTitle: { fontSize: 16, fontFamily: 'Inter-Medium' },
  developerBio: { fontSize: 14, fontFamily: 'Inter-Regular', lineHeight: 20, marginBottom: 20 },
  contactButtons: { flexDirection: 'row', gap: 12 },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  contactButtonText: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: '#fff', marginLeft: 8 },
  modalOverlay: { flex: 1, justifyContent: 'center' },
});
