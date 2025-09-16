import { Tabs } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { Home, Plus, ChartBar as BarChart3, Settings } from 'lucide-react-native';

export default function TabLayout() {
  const { state } = useApp();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: state.theme.card,
          borderTopColor: state.theme.border,
          height: 88,
          paddingBottom: 24,
          paddingTop: 12,
        },
        tabBarActiveTintColor: state.theme.primary,
        tabBarInactiveTintColor: state.theme.textSecondary,
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarIcon: ({ size, color }) => (
            <Plus size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ size, color }) => (
            <BarChart3 size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}