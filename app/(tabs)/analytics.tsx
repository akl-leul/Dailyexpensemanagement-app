import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { TrendingUp, TrendingDown, Target, Calendar, X, Plus } from 'lucide-react-native';
import { TransactionProvider, useTransactions } from '@/contexts/TransactionContext';
import { ALL_CATEGORIES } from '@/constants/Categories';
import { useTheme } from '@/contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

function CategoryChart({ transactions, type }: { transactions: any[], type: 'income' | 'expense' }) {
  const { theme } = useTheme();
  const filteredTransactions = transactions.filter(t => t.type === type);
  const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

  const categoryTotals = filteredTransactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const styles = createStyles(theme);

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>
        Top {type === 'expense' ? 'Expenses' : 'Income'} by Category
      </Text>
      {sortedCategories.map(([categoryName, amount]) => {
        const category = ALL_CATEGORIES.find(cat => cat.name === categoryName);
        const percentage = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;

        return (
          <View key={categoryName} style={styles.categoryRow}>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryEmoji}>{category?.icon}</Text>
              <View style={styles.categoryDetails}>
                <Text style={styles.categoryName}>{categoryName}</Text>
                <Text style={styles.categoryAmount}>
                  ${amount.toFixed(2)} ({percentage.toFixed(1)}%)
                </Text>
              </View>
            </View>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${percentage}%`,
                    backgroundColor: category?.color || theme.colors.textSecondary,
                  },
                ]}
              />
            </View>
          </View>
        );
      })}
      {sortedCategories.length === 0 && (
        <Text style={styles.noDataText}>No {type} transactions found</Text>
      )}
    </View>
  );
}

function MonthlyOverview({ transactions }: { transactions: any[] }) {
  const { theme } = useTheme();
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthlyTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear;
  });

  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyBalance = monthlyIncome - monthlyExpenses;
  const savingsRate = monthlyIncome > 0 ? (monthlyBalance / monthlyIncome) * 100 : 0;

  const styles = createStyles(theme);

  return (
    <View style={styles.monthlyOverview}>
      <Text style={styles.overviewTitle}>
        {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Overview
      </Text>

      <View style={styles.overviewStats}>
        <View style={styles.overviewStat}>
          <View style={[styles.statIcon, { backgroundColor: theme.colors.income + '20' }]}>
            <TrendingUp size={20} color={theme.colors.income} />
          </View>
          <View>
            <Text style={styles.statLabel}>Income</Text>
            <Text style={[styles.statValue, { color: theme.colors.income }]}>
              ${monthlyIncome.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.overviewStat}>
          <View style={[styles.statIcon, { backgroundColor: theme.colors.expense + '20' }]}>
            <TrendingDown size={20} color={theme.colors.expense} />
          </View>
          <View>
            <Text style={styles.statLabel}>Expenses</Text>
            <Text style={[styles.statValue, { color: theme.colors.expense }]}>
              ${monthlyExpenses.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Net Balance</Text>
        <Text style={[
          styles.balanceValue,
          { color: monthlyBalance >= 0 ? theme.colors.income : theme.colors.expense }
        ]}>
          {monthlyBalance >= 0 ? '+' : ''}${monthlyBalance.toFixed(2)}
        </Text>
        <Text style={styles.savingsRate}>
          Savings Rate: {savingsRate.toFixed(1)}%
        </Text>
      </View>
    </View>
  );
}

function AnalyticsScreen() {
  const { theme } = useTheme();
  const { transactions, addTransaction } = useTransactions();
  const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'year'>('month');

  // Budget state
  const [budgetGoal, setBudgetGoal] = useState<number>(0);
  const [budgetInput, setBudgetInput] = useState('');
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);

  // Add Transaction Modal State
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState(ALL_CATEGORIES[0]?.name || '');

  // Calculate current month expenses
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const monthlyExpenses = transactions
    .filter(t => {
      const d = new Date(t.date);
      return t.type === 'expense' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  // Load budget from storage on mount
  useEffect(() => {
    AsyncStorage.getItem('budgetGoal').then(goal => {
      if (goal) setBudgetGoal(Number(goal));
    });
  }, []);

  // Save budget goal to storage whenever it changes
  useEffect(() => {
    AsyncStorage.setItem('budgetGoal', budgetGoal.toString());
  }, [budgetGoal]);

  const styles = createStyles(theme);

  // Budget progress calculation
  const budgetProgress = budgetGoal > 0 ? Math.min(monthlyExpenses / budgetGoal, 1) : 0;

  // Add transaction handler
  const handleAddTransaction = () => {
    if (!description || !amount || isNaN(Number(amount))) {
      Alert.alert('Error', 'Please enter valid description and amount.');
      return;
    }
    addTransaction({
      description,
      amount: Number(amount),
      type,
      category,
      date: new Date().toISOString(),
    });
    setAddModalVisible(false);
    setDescription('');
    setAmount('');
    setType('expense');
    setCategory(ALL_CATEGORIES[0]?.name || '');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={theme.colors.text === '#111827' ? 'dark-content' : 'light-content'} backgroundColor={theme.colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Time Frame Selector */}
        <View style={styles.timeFrameSelector}>
          {['week', 'month', 'year'].map((frame) => (
            <TouchableOpacity
              key={frame}
              style={[
                styles.timeFrameButton,
                timeFrame === frame && styles.activeTimeFrameButton
              ]}
              onPress={() => setTimeFrame(frame as any)}
            >
              <Text style={[
                styles.timeFrameButtonText,
                timeFrame === frame && styles.activeTimeFrameButtonText
              ]}>
                {frame.charAt(0).toUpperCase() + frame.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Monthly Overview */}
        <MonthlyOverview transactions={transactions} />

        {/* Expense Categories Chart */}
        <CategoryChart transactions={transactions} type="expense" />

        {/* Income Categories Chart */}
        <CategoryChart transactions={transactions} type="income" />

        {/* Budget Target Card */}
        <View style={styles.budgetCard}>
          <View style={styles.budgetHeader}>
            <Target size={24} color={theme.colors.info} />
            <Text style={styles.budgetTitle}>Monthly Budget</Text>
          </View>
          <Text style={styles.budgetSubtitle}>Set spending goals and track progress</Text>
          <Text style={styles.budgetGoalDisplay}>
            {budgetGoal > 0 ? `Goal: $${budgetGoal.toFixed(2)} | Spent: $${monthlyExpenses.toFixed(2)}` : 'No goal set'}
          </Text>
          {budgetGoal > 0 && (
            <View style={styles.budgetProgressBarBackground}>
              <View
                style={[
                  styles.budgetProgressBarFill,
                  { width: `${budgetProgress * 100}%`, backgroundColor: theme.colors.primary },
                ]}
              />
            </View>
          )}
          {budgetGoal > 0 && monthlyExpenses >= budgetGoal && (
            <Text style={styles.budgetWarning}>You have reached your budget limit!</Text>
          )}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity style={styles.budgetButton} onPress={() => setBudgetModalVisible(true)}>
              <Text style={styles.budgetButtonText}>Set Budget Goals</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.budgetButton} onPress={() => setAddModalVisible(true)}>
              <Plus size={18} color="#fff" style={{ marginRight: 4 }} />
              <Text style={styles.budgetButtonText}>Add Expense</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Budget Goal Modal */}
      <Modal visible={budgetModalVisible} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: theme.colors.surface, borderRadius: 16, padding: 24, width: '90%' }}>
            <Text style={{ fontSize: 18, fontFamily: 'Inter-Bold', marginBottom: 16, color: theme.colors.text }}>
              Set Budget Goal
            </Text>
            <TextInput
              placeholder="Enter your budget goal"
              value={budgetInput}
              onChangeText={setBudgetInput}
              keyboardType="numeric"
              style={[styles.budgetInput, { marginBottom: 16 }]}
              placeholderTextColor={theme.colors.textTertiary}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
              <TouchableOpacity onPress={() => {
                setBudgetModalVisible(false);
                setBudgetInput('');
              }}>
                <Text style={{ color: theme.colors.error, fontFamily: 'Inter-Medium', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                const goal = Number(budgetInput);
                if (isNaN(goal) || goal <= 0) {
                  Alert.alert('Error', 'Please enter a valid budget goal.');
                  return;
                }
                setBudgetGoal(goal);
                setBudgetModalVisible(false);
                setBudgetInput('');
              }}>
                <Text style={{ color: theme.colors.primary, fontFamily: 'Inter-Bold', fontSize: 16 }}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Expense Modal */}
      <Modal visible={addModalVisible} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: theme.colors.surface, borderRadius: 16, padding: 24, width: '90%' }}>
            <Text style={{ fontSize: 18, fontFamily: 'Inter-Bold', marginBottom: 16, color: theme.colors.text }}>
              Add Expense
            </Text>
            <TextInput
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              style={[styles.budgetInput, { marginBottom: 12 }]}
              placeholderTextColor={theme.colors.textTertiary}
            />
            <TextInput
              placeholder="Amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              style={[styles.budgetInput, { marginBottom: 12 }]}
              placeholderTextColor={theme.colors.textTertiary}
            />
            <View style={{ marginBottom: 12 }}>
              <Text style={{ color: theme.colors.textSecondary, marginBottom: 4 }}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {ALL_CATEGORIES.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={{
                      backgroundColor: category === item.name ? theme.colors.primary : theme.colors.background,
                      borderRadius: 8,
                      padding: 8,
                      marginRight: 8,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                    onPress={() => setCategory(item.name)}
                  >
                    <Text style={{ fontSize: 16 }}>{item.icon}</Text>
                    <Text style={{
                      color: category === item.name ? '#fff' : theme.colors.text,
                      marginLeft: 4,
                    }}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
              <TouchableOpacity onPress={() => {
                setAddModalVisible(false);
                setDescription('');
                setAmount('');
                setType('expense');
                setCategory(ALL_CATEGORIES[0]?.name || '');
              }}>
                <Text style={{ color: theme.colors.error, fontFamily: 'Inter-Medium', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddTransaction}>
                <Text style={{ color: theme.colors.primary, fontFamily: 'Inter-Bold', fontSize: 16 }}>
                  Add
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default function AnalyticsTab() {
  return (
    <TransactionProvider>
      <AnalyticsScreen />
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
    timeFrameSelector: {
      flexDirection: 'row',
      marginBottom: 24,
      gap: 8,
    },
    timeFrameButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    activeTimeFrameButton: {
      backgroundColor: theme.colors.info,
      borderColor: theme.colors.info,
    },
    timeFrameButtonText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.colors.textSecondary,
    },
    activeTimeFrameButtonText: {
      color: '#FFFFFF',
    },
    monthlyOverview: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    overviewTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: 16,
    },
    overviewStats: {
      flexDirection: 'row',
      gap: 16,
      marginBottom: 20,
    },
    overviewStat: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    statIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    statLabel: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.colors.textSecondary,
    },
    statValue: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
    },
    balanceCard: {
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
    },
    balanceLabel: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    balanceValue: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      marginBottom: 4,
    },
    savingsRate: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textTertiary,
    },
    chartContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    chartTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: 16,
    },
    categoryRow: {
      marginBottom: 16,
    },
    categoryInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    categoryEmoji: {
      fontSize: 20,
      marginRight: 12,
    },
    categoryDetails: {
      flex: 1,
    },
    categoryName: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.colors.text,
    },
    categoryAmount: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
    },
    progressBarContainer: {
      height: 6,
      backgroundColor: theme.colors.border,
      borderRadius: 3,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      borderRadius: 3,
    },
    noDataText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textTertiary,
      textAlign: 'center',
      paddingVertical: 20,
    },
    budgetCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 0,
      marginBottom: 24,
      alignItems: 'center',
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    budgetHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      gap: 8,
    },
    budgetTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: theme.colors.info,
      marginLeft: 8,
    },
    budgetSubtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
      textAlign: 'center',
    },
    budgetGoalDisplay: {
      fontSize: 15,
      color: theme.colors.text,
      marginBottom: 8,
    },
    budgetProgressBarBackground: {
      width: '100%',
      height: 8,
      backgroundColor: theme.colors.background,
      borderRadius: 4,
      marginBottom: 8,
      overflow: 'hidden',
    },
    budgetProgressBarFill: {
      height: 8,
      borderRadius: 4,
    },
    budgetWarning: {
      color: theme.colors.error,
      fontFamily: 'Inter-Bold',
      marginBottom: 8,
      marginTop: -4,
    },
    budgetButton: {
      marginTop: 8,
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    budgetButtonText: {
      color: '#fff',
      fontFamily: 'Inter-Bold',
      fontSize: 16,
    },
    budgetInput: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
  });
}