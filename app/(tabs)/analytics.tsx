import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { TrendingUp, TrendingDown, Target, Calendar } from 'lucide-react-native';
import { TransactionProvider, useTransactions } from '@/contexts/TransactionContext';
import { ALL_CATEGORIES } from '@/constants/Categories';
import { useTheme } from '@/contexts/ThemeContext';

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
    .sort(([,a], [,b]) => b - a)
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
                    backgroundColor: category?.color || theme.colors.textSecondary
                  }
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
  const { transactions } = useTransactions();
  const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'year'>('month');

  const styles = createStyles(theme);

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
          <TouchableOpacity style={styles.budgetButton}>
            <Text style={styles.budgetButtonText}>Set Budget Goals</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
      marginBottom: 24,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    budgetHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      gap: 12,
    },
    budgetTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
    },
    budgetSubtitle: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      marginBottom: 16,
    },
    budgetButton: {
      backgroundColor: theme.colors.info,
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: 'center',
    },
    budgetButtonText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
  });
}