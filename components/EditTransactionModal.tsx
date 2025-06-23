import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { Transaction } from '@/types';
import { useApp } from '@/context/AppContext';
import { X, Save } from 'lucide-react-native';
import * as Icons from 'lucide-react-native';

interface EditTransactionModalProps {
  visible: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
}

export default function EditTransactionModal({
  visible,
  transaction,
  onClose,
  onSave,
}: EditTransactionModalProps) {
  const { state } = useApp();
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAmount(transaction.amount.toString());
      setDescription(transaction.description);
      setSelectedCategory(transaction.category);
    }
  }, [transaction]);

  const categories = state.categories.filter(c => c.type === type);

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleSave = () => {
    if (!amount || !description || !selectedCategory) {
      showAlert('Error', 'Please fill in all fields');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      showAlert('Error', 'Please enter a valid amount');
      return;
    }

    if (!transaction) return;

    const updatedTransaction: Transaction = {
      ...transaction,
      type,
      amount: numAmount,
      category: selectedCategory,
      description,
    };

    onSave(updatedTransaction);
    onClose();
  };

  const handleTypeChange = (newType: 'income' | 'expense') => {
    setType(newType);
    setSelectedCategory('');
  };

  if (!transaction) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: state.theme.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={state.theme.text} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: state.theme.text }]}>
            Edit Transaction
          </Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Save size={24} color={state.theme.primary} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
              onPress={() => handleTypeChange('income')}
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
              onPress={() => handleTypeChange('expense')}
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
                        size={20}
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
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
  },
  saveButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  typeSelector: {
    flexDirection: 'row',
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
    paddingBottom: 40,
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
});