import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { DollarSign, Calendar, FileText } from 'lucide-react-native';
import { TransactionProvider, useTransactions } from '@/contexts/TransactionContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/constants/Categories';
import { useTheme } from '@/contexts/ThemeContext';

function AddTransactionScreen() {
  const { theme } = useTheme();
  const { addTransaction } = useTransactions();
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const styles = createStyles(theme);

  const handleSubmit = () => {
    if (!amount || !description || !selectedCategory) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    addTransaction({
      amount: numAmount,
      type,
      category: selectedCategory,
      description,
      date,
    });

    // Reset form
    setAmount('');
    setDescription('');
    setSelectedCategory('');
    
    Alert.alert('Success', 'Transaction added successfully!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={theme.colors.text === '#111827' ? 'dark-content' : 'light-content'} backgroundColor={theme.colors.surface} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Transaction</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Type Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction Type</Text>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'expense' && styles.activeExpenseButton
              ]}
              onPress={() => {
                setType('expense');
                setSelectedCategory('');
              }}
            >
              <Text style={[
                styles.typeButtonText,
                type === 'expense' && styles.activeExpenseButtonText
              ]}>
                Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'income' && styles.activeIncomeButton
              ]}
              onPress={() => {
                setType('income');
                setSelectedCategory('');
              }}
            >
              <Text style={[
                styles.typeButtonText,
                type === 'income' && styles.activeIncomeButtonText
              ]}>
                Income
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Amount Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amount</Text>
          <View style={styles.inputContainer}>
            <DollarSign size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholderTextColor={theme.colors.textTertiary}
            />
          </View>
        </View>

        {/* Description Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <View style={styles.inputContainer}>
            <FileText size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="What's this for?"
              value={description}
              onChangeText={setDescription}
              placeholderTextColor={theme.colors.textTertiary}
            />
          </View>
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.categoryGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.name && {
                    backgroundColor: category.color + '20',
                    borderColor: category.color,
                  }
                ]}
                onPress={() => setSelectedCategory(category.name)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.name && { color: category.color }
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date</Text>
          <View style={styles.inputContainer}>
            <Calendar size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={date}
              onChangeText={setDate}
              placeholderTextColor={theme.colors.textTertiary}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Add Transaction</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function AddTransactionTab() {
  return (
    <TransactionProvider>
      <AddTransactionScreen />
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
      padding: 20,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: 12,
    },
    typeSelector: {
      flexDirection: 'row',
      gap: 12,
    },
    typeButton: {
      flex: 1,
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 12,
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: theme.colors.border,
      alignItems: 'center',
    },
    activeExpenseButton: {
      backgroundColor: '#FEF2F2',
      borderColor: theme.colors.error,
    },
    activeIncomeButton: {
      backgroundColor: '#F0FDF4',
      borderColor: theme.colors.success,
    },
    typeButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.textSecondary,
    },
    activeExpenseButtonText: {
      color: theme.colors.error,
    },
    activeIncomeButtonText: {
      color: theme.colors.success,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    inputIcon: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: theme.colors.text,
    },
    categoryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    categoryButton: {
      width: '48%',
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.colors.border,
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 80,
    },
    categoryIcon: {
      fontSize: 24,
      marginBottom: 8,
    },
    categoryText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    submitButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 32,
      marginBottom: 32,
    },
    submitButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
  });
}