import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChangeText, placeholder = 'Search transactions...' }: SearchBarProps) {
  const { state } = useApp();

  const clearSearch = () => {
    onChangeText('');
  };

  return (
    <View style={[styles.container, { backgroundColor: state.theme.card, borderColor: state.theme.border }]}>
      <Search size={20} color={state.theme.textSecondary} strokeWidth={2} />
      <TextInput
        style={[styles.input, { color: state.theme.text }]}
        placeholder={placeholder}
        placeholderTextColor={state.theme.textSecondary}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
          <X size={20} color={state.theme.textSecondary} strokeWidth={2} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginLeft: 12,
    marginRight: 8,
  },
  clearButton: {
    padding: 4,
  },
});