import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/utils/formatters';
import { Transaction } from '@/types';
import StatsCard from '@/components/StatsCard';
import TransactionCard from '@/components/TransactionCard';
import SearchBar from '@/components/SearchBar';
import EditTransactionModal from '@/components/EditTransactionModal';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react-native';

export default function Dashboard() {
  const { state, dispatch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const stats = useMemo(() => {
    const totalIncome = state.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = state.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    return { totalIncome, totalExpenses, balance };
  }, [state.transactions]);

  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) {
      return state.transactions.slice(0, 100000); // Show only first 10 for performance
    }

    const query = searchQuery.toLowerCase();
    return state.transactions.filter(transaction => {
      const category = state.categories.find(c => c.id === transaction.category);
      return (
        transaction.description.toLowerCase().includes(query) ||
        category?.name.toLowerCase().includes(query) ||
        transaction.amount.toString().includes(query)
      );
    });
  }, [state.transactions, state.categories, searchQuery]);

  const showAlert = (title: string, message: string, onConfirm?: () => void) => {
    if (Platform.OS === 'web') {
      if (window.confirm(`${title}: ${message}`)) {
        onConfirm?.();
      }
    } else {
      Alert.alert(
        title,
        message,
        onConfirm ? [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: onConfirm }
        ] : [{ text: 'OK' }]
      );
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsEditModalVisible(true);
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    showAlert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      () => {
        dispatch({ type: 'DELETE_TRANSACTION', payload: transaction.id });
        showAlert('Success', 'Transaction deleted successfully');
      }
    );
  };

  const handleSaveTransaction = (updatedTransaction: Transaction) => {
    dispatch({ type: 'UPDATE_TRANSACTION', payload: updatedTransaction });
    showAlert('Success', 'Transaction updated successfully');
  };

  const handleTransactionPress = (transaction: Transaction) => {
    // Show action sheet or context menu for edit/delete
    if (Platform.OS === 'web') {
      const action = window.prompt(
        `Transaction: ${transaction.description}\nAmount: ${formatCurrency(transaction.amount)}\n\nChoose action:`,
        'Type "edit" to edit or "delete" to delete'
      );
      
      if (action === 'edit') {
        handleEditTransaction(transaction);
      } else if (action === 'delete') {
        handleDeleteTransaction(transaction);
      }
    } else {
      Alert.alert(
        'Transaction Options',
        `${transaction.description}\n${formatCurrency(transaction.amount)}`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Edit', onPress: () => handleEditTransaction(transaction) },
          { 
            text: 'Delete', 
            style: 'destructive', 
            onPress: () => handleDeleteTransaction(transaction) 
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: state.theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: state.theme.text }]}>
            Good morning!
          </Text>
          <Text style={[styles.title, { color: state.theme.text }]}>
            Financial Overview
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <StatsCard
            title="Balance"
            amount={stats.balance}
            type="balance"
            icon={<Wallet size={20} color={state.theme.primary} strokeWidth={2} />}
          />
        </View>

        <View style={styles.statsRow}>
          <StatsCard
            title="Income"
            amount={stats.totalIncome}
            type="income"
            icon={<TrendingUp size={20} color={state.theme.income} strokeWidth={2} />}
          />
          <StatsCard
            title="Expenses"
            amount={stats.totalExpenses}
            type="expense"
            icon={<TrendingDown size={20} color={state.theme.expense} strokeWidth={2} />}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: state.theme.text }]}>
            Transactions
          </Text>
          
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search..."
          />
          
          {filteredTransactions.length > 0 ? (
            <>
              {filteredTransactions.map(transaction => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  onPress={() => handleTransactionPress(transaction)}
                />
              ))}
              {!searchQuery && state.transactions.length > 10 && (
                <View style={[styles.moreIndicator, { backgroundColor: state.theme.card, borderColor: state.theme.border }]}>
                  <Text style={[styles.moreText, { color: state.theme.textSecondary }]}>
                    Showing {state.transactions.length} transactions
                  </Text>
                  <Text style={[styles.moreSubtext, { color: state.theme.textSecondary }]}>
                    Use search to find specific transactions
                  </Text>
                </View>
              )}
            </>
          ) : searchQuery ? (
            <View style={[styles.emptyState, { backgroundColor: state.theme.card, borderColor: state.theme.border }]}>
              <Text style={[styles.emptyText, { color: state.theme.textSecondary }]}>
                No transactions found
              </Text>
              <Text style={[styles.emptySubtext, { color: state.theme.textSecondary }]}>
                Try adjusting your search terms
              </Text>
            </View>
          ) : (
            <View style={[styles.emptyState, { backgroundColor: state.theme.card, borderColor: state.theme.border }]}>
              <Text style={[styles.emptyText, { color: state.theme.textSecondary }]}>
                No transactions yet
              </Text>
              <Text style={[styles.emptySubtext, { color: state.theme.textSecondary }]}>
                Add your first transaction to get started
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <EditTransactionModal
        visible={isEditModalVisible}
        transaction={editingTransaction}
        onClose={() => {
          setIsEditModalVisible(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
      />
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
  greeting: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
  },
  statsContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 32,
  },
  section: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  emptyState: {
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  moreIndicator: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 8,
  },
  moreText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  moreSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});