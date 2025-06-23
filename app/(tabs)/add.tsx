import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useApp } from '@/context/AppContext';
import { generateId } from '@/utils/formatters';
import * as Icons from 'lucide-react-native';

export default function AddTransaction() {
  const { state, dispatch } = useApp();
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = state.categories.filter(c => c.type === type);

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleSubmit = () => {
    if (!amount || !description || !selectedCategory) {
      showAlert('Error', 'Please fill in all fields');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      showAlert('Error', 'Please enter a valid amount');
      return;
    }

    const transaction = {
      id: generateId(),
      type,
      amount: numAmount,
      category: selectedCategory,
      description,
      date: new Date().toISOString(),
    };

    console.log('Adding transaction:', transaction);
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
    
    // Reset form
    setAmount('');
    setDescription('');
    setSelectedCategory('');
    
    showAlert('Success', 'Transaction added successfully');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: state.theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: state.theme.text }]}>
            Add Transaction
          </Text>
        </View>

        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'income' && styles.typeButtonActive,
              { 
                backgroundColor: type === 'income' ? state.theme.income : state.theme.card,
                borderColor: state.theme.border,
              }
            ]}
            onPress={() => {
              setType('income');
              setSelectedCategory('');
            }}
          >
            <Text style={[
              styles.typeButtonText,
              { color: type === 'income' ? 'white' : state.theme.text }
            ]}>
              Income
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'expense' && styles.typeButtonActive,
              { 
                backgroundColor: type === 'expense' ? state.theme.expense : state.theme.card,
                borderColor: state.theme.border,
              }
            ]}
            onPress={() => {
              setType('expense');
              setSelectedCategory('');
            }}
          >
            <Text style={[
              styles.typeButtonText,
              { color: type === 'expense' ? 'white' : state.theme.text }
            ]}>
              Expense
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: state.theme.text }]}>
              Amount
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: state.theme.card,
                  borderColor: state.theme.border,
                  color: state.theme.text,
                }
              ]}
              placeholder="0.00"
              placeholderTextColor={state.theme.textSecondary}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: state.theme.text }]}>
              Description
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: state.theme.card,
                  borderColor: state.theme.border,
                  color: state.theme.text,
                }
              ]}
              placeholder="Enter description"
              placeholderTextColor={state.theme.textSecondary}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: state.theme.text }]}>
              Category
            </Text>
            <View style={styles.categoryGrid}>
              {categories.map(category => {
                const IconComponent = (Icons as any)[category.icon] || Icons.Circle;
                const isSelected = selectedCategory === category.id;
                
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryItem,
                      {
                        backgroundColor: isSelected ? state.theme.primary : state.theme.card,
                        borderColor: state.theme.border,
                      }
                    ]}
                    onPress={() => setSelectedCategory(category.id)}
                  >
                    <IconComponent
                      size={24}
                      color={isSelected ? 'white' : state.theme.text}
                      strokeWidth={2}
                    />
                    <Text style={[
                      styles.categoryText,
                      { color: isSelected ? 'white' : state.theme.text }
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: type === 'income' ? state.theme.income : state.theme.expense }
            ]}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>
              Add {type === 'income' ? 'Income' : 'Expense'}
            </Text>
          </TouchableOpacity>
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
  typeSelector: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 16,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  typeButtonActive: {
    borderWidth: 0,
  },
  typeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  form: {
    paddingHorizontal: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: '45%',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
});