import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { Search, Filter, TrendingUp, TrendingDown, CreditCard as Edit, Trash2, X, Plus, Check } from 'lucide-react-native';
import { TransactionProvider, useTransactions } from '@/contexts/TransactionContext';
import { Transaction } from '@/types/Transaction';
import { ALL_CATEGORIES } from '@/constants/Categories';
import { useTheme } from '@/contexts/ThemeContext';
import { saveTransactions, loadTransactions } from '../utils/storage';

function FilterModal({ 
  visible, 
  onClose, 
  selectedCategory, 
  onCategorySelect,
  selectedType,
  onTypeSelect 
}: {
  visible: boolean;
  onClose: () => void;
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  selectedType: 'all' | 'income' | 'expense';
  onTypeSelect: (type: 'all' | 'income' | 'expense') => void;
}) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Transactions</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Transaction Type</Text>
            <View style={styles.typeFilters}>
              {['all', 'income', 'expense'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeFilterButton,
                    selectedType === type && styles.activeTypeFilter
                  ]}
                  onPress={() => onTypeSelect(type as any)}
                >
                  <Text style={[
                    styles.typeFilterText,
                    selectedType === type && styles.activeTypeFilterText
                  ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Category</Text>
            <TouchableOpacity
              style={[
                styles.categoryFilterButton,
                selectedCategory === 'all' && styles.activeCategoryFilter
              ]}
              onPress={() => onCategorySelect('all')}
            >
              <Text style={[
                styles.categoryFilterText,
                selectedCategory === 'all' && styles.activeCategoryFilterText
              ]}>
                All Categories
              </Text>
            </TouchableOpacity>
            {ALL_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryFilterButton,
                  selectedCategory === category.name && styles.activeCategoryFilter
                ]}
                onPress={() => onCategorySelect(category.name)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryFilterText,
                  selectedCategory === category.name && styles.activeCategoryFilterText
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.clearFiltersButton} onPress={() => {
            onTypeSelect('all');
            onCategorySelect('all');
          }}>
            <Text style={styles.clearFiltersText}>Clear All Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function TransactionItem({ transaction, onEdit, onDelete }: {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}) {
  const { theme } = useTheme();
  const category = ALL_CATEGORIES.find(cat => cat.name === transaction.category);
  const isExpense = transaction.type === 'expense';
  const styles = createStyles(theme);

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(transaction.id) },
      ]
    );
  };

  return (
    <View style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View style={[styles.categoryIcon, { backgroundColor: category?.color + '20' }]}>
          <Text style={styles.categoryEmoji}>{category?.icon}</Text>
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionDescription}>{transaction.description}</Text>
          <Text style={styles.transactionCategory}>{transaction.category}</Text>
          <Text style={styles.transactionDate}>{new Date(transaction.date).toLocaleDateString()}</Text>
        </View>
      </View>
      <View style={styles.transactionRight}>
        <Text style={[
          styles.transactionAmount,
          { color: isExpense ? theme.colors.expense : theme.colors.income }
        ]}>
          {isExpense ? '-' : '+'}${transaction.amount.toFixed(2)}
        </Text>
        <View style={styles.transactionActions}>
          <TouchableOpacity onPress={() => onEdit(transaction)} style={styles.actionButton}>
            <Edit size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
            <Trash2 size={16} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function TransactionsScreen() {
  const { theme } = useTheme();
  const { transactions, getTotalBalance, getTotalIncome, getTotalExpenses, deleteTransaction, addTransaction, updateTransaction, setTransactions } = useTransactions();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');

  // Add/Edit Transaction Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [category, setCategory] = useState(ALL_CATEGORIES[0]?.name || '');

  // Load transactions from storage on mount
  useEffect(() => {
    loadTransactions().then((loaded) => {
      if (setTransactions) setTransactions(loaded);
    });
    // eslint-disable-next-line
  }, []);

  // Save transactions to storage whenever they change
  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  const balance = getTotalBalance();
  const income = getTotalIncome();
  const expenses = getTotalExpenses();

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || transaction.type === selectedType;
      const matchesCategory = selectedCategory === 'all' || transaction.category === selectedCategory;
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [transactions, searchQuery, selectedType, selectedCategory]);

  const styles = createStyles(theme);

  const handleEdit = (transaction: Transaction) => {
    setIsEditing(true);
    setEditId(transaction.id);
    setDescription(transaction.description);
    setAmount(transaction.amount.toString());
    setType(transaction.type);
    setCategory(transaction.category);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    deleteTransaction(id);
  };

  const handleAddOrEditTransaction = () => {
    if (!description || !amount || isNaN(Number(amount))) {
      Alert.alert('Error', 'Please enter valid description and amount.');
      return;
    }
    if (isEditing && editId) {
      updateTransaction(editId, {
        description,
        amount: Number(amount),
        type,
        category,
        date: new Date().toISOString(),
      });
    } else {
      addTransaction({
        description,
        amount: Number(amount),
        type,
        category,
        date: new Date().toISOString(),
      });
    }
    setModalVisible(false);
    setIsEditing(false);
    setEditId(null);
    setDescription('');
    setAmount('');
    setType('income');
    setCategory(ALL_CATEGORIES[0]?.name || '');
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setEditId(null);
    setDescription('');
    setAmount('');
    setType('income');
    setCategory(ALL_CATEGORIES[0]?.name || '');
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={theme.colors.text === '#111827' ? 'dark-content' : 'light-content'} backgroundColor={theme.colors.surface} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Finances</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Search size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => setFilterModalVisible(true)}>
            <Filter size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search transactions..."
            placeholderTextColor={theme.colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Balance Cards */}
      <View style={styles.balanceContainer}>
        <View style={[styles.balanceCard, styles.primaryCard]}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={[
            styles.balanceAmount,
            { color: balance >= 0 ? theme.colors.income : theme.colors.expense }
          ]}>
            ${balance.toFixed(2)}
          </Text>
        </View>
        
        <View style={styles.summaryCards}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <TrendingUp size={20} color={theme.colors.income} />
            </View>
            <View>
              <Text style={styles.summaryLabel}>Income</Text>
              <Text style={[styles.summaryAmount, { color: theme.colors.income }]}>
                +${income.toFixed(2)}
              </Text>
            </View>
          </View>
          
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <TrendingDown size={20} color={theme.colors.expense} />
            </View>
            <View>
              <Text style={styles.summaryLabel}>Expenses</Text>
              <Text style={[styles.summaryAmount, { color: theme.colors.expense }]}>
                -${expenses.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Active Filters */}
      {(selectedType !== 'all' || selectedCategory !== 'all') && (
        <View style={styles.activeFilters}>
          <Text style={styles.activeFiltersLabel}>Active filters:</Text>
          {selectedType !== 'all' && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>{selectedType}</Text>
              <TouchableOpacity onPress={() => setSelectedType('all')}>
                <X size={16} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
          {selectedCategory !== 'all' && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>{selectedCategory}</Text>
              <TouchableOpacity onPress={() => setSelectedCategory('all')}>
                <X size={16} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Transactions List */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionItem
            transaction={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        style={styles.transactionsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No transactions found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery || selectedType !== 'all' || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start by adding your first transaction'
              }
            </Text>
          </View>
        }
      />

      {/* Add/Edit Transaction Button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 32,
          right: 32,
          backgroundColor: theme.colors.primary,
          borderRadius: 32,
          width: 56,
          height: 56,
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 6,
        }}
        onPress={handleOpenAddModal}
      >
        <Plus size={28} color="#fff" />
      </TouchableOpacity>

      {/* Add/Edit Transaction Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: theme.colors.surface, borderRadius: 16, padding: 24, width: '90%' }}>
            <Text style={{ fontSize: 18, fontFamily: 'Inter-Bold', marginBottom: 16, color: theme.colors.text }}>
              {isEditing ? 'Edit Transaction' : 'Add Transaction'}
            </Text>
            <TextInput
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              style={[styles.searchInput, { marginBottom: 12 }]}
              placeholderTextColor={theme.colors.textTertiary}
            />
            <TextInput
              placeholder="Amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              style={[styles.searchInput, { marginBottom: 12 }]}
              placeholderTextColor={theme.colors.textTertiary}
            />
            <View style={{ flexDirection: 'row', marginBottom: 12 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: type === 'income' ? theme.colors.primary : theme.colors.background,
                  borderRadius: 8,
                  padding: 12,
                  marginRight: 6,
                  alignItems: 'center',
                }}
                onPress={() => setType('income')}
              >
                <Text style={{ color: type === 'income' ? '#fff' : theme.colors.text }}>Income</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: type === 'expense' ? theme.colors.primary : theme.colors.background,
                  borderRadius: 8,
                  padding: 12,
                  marginLeft: 6,
                  alignItems: 'center',
                }}
                onPress={() => setType('expense')}
              >
                <Text style={{ color: type === 'expense' ? '#fff' : theme.colors.text }}>Expense</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: theme.colors.textSecondary, marginBottom: 4 }}>Category</Text>
              <FlatList
                data={ALL_CATEGORIES}
                horizontal
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
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
                )}
                showsHorizontalScrollIndicator={false}
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
              <TouchableOpacity onPress={() => {
                setModalVisible(false);
                setIsEditing(false);
                setEditId(null);
                setDescription('');
                setAmount('');
                setType('income');
                setCategory(ALL_CATEGORIES[0]?.name || '');
              }}>
                <Text style={{ color: theme.colors.error, fontFamily: 'Inter-Medium', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddOrEditTransaction}>
                <Text style={{ color: theme.colors.primary, fontFamily: 'Inter-Bold', fontSize: 16 }}>
                  {isEditing ? 'Save' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        selectedType={selectedType}
        onTypeSelect={setSelectedType}
      />
    </SafeAreaView>
  );
}

export default function TransactionsTab() {
  return (
    <TransactionProvider>
      <TransactionsScreen />
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
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
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
    headerActions: {
      flexDirection: 'row',
      gap: 12,
    },
    iconButton: {
      padding: 8,
    },
    searchContainer: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: theme.colors.surface,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: theme.colors.text,
    },
    balanceContainer: {
      padding: 20,
      gap: 16,
    },
    balanceCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 24,
      alignItems: 'center',
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    primaryCard: {
      backgroundColor: theme.colors.primary,
    },
    balanceLabel: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: '#FFFFFF',
      opacity: 0.9,
      marginBottom: 8,
    },
    balanceAmount: {
      fontSize: 32,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
    },
    summaryCards: {
      flexDirection: 'row',
      gap: 12,
    },
    summaryCard: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    summaryIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    summaryLabel: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.colors.primary,
    },
    summaryAmount: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
       color: theme.colors.primary,
    },
    activeFilters: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 8,
      gap: 8,
      flexWrap: 'wrap',
    },
    activeFiltersLabel: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.colors.textSecondary,
    },
    filterChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.primary + '20',
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 6,
      gap: 6,
    },
    filterChipText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: theme.colors.primary,
    },
    transactionsList: {
      flex: 1,
      paddingHorizontal: 20,
    },
    transactionItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    transactionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    categoryIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    categoryEmoji: {
      fontSize: 20,
    },
    transactionInfo: {
      flex: 1,
    },
    transactionDescription: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: 2,
    },
    transactionCategory: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.colors.textSecondary,
      marginBottom: 2,
    },
    transactionDate: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textTertiary,
    },
    transactionRight: {
      alignItems: 'flex-end',
    },
    transactionAmount: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      marginBottom: 8,
    },
    transactionActions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      padding: 4,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 48,
    },
    emptyStateText: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    emptyStateSubtext: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textTertiary,
      textAlign: 'center',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    modalTitle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
    },
    filterSection: {
      marginBottom: 24,
    },
    filterSectionTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: 12,
    },
    typeFilters: {
      flexDirection: 'row',
      gap: 8,
    },
    typeFilterButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: theme.colors.background,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    activeTypeFilter: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    typeFilterText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.colors.textSecondary,
    },
    activeTypeFilterText: {
      color: '#FFFFFF',
    },
    categoryFilterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: theme.colors.background,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    activeCategoryFilter: {
      backgroundColor: theme.colors.primary + '20',
      borderColor: theme.colors.primary,
    },
    categoryFilterText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.colors.textSecondary,
      marginLeft: 8,
    },
    activeCategoryFilterText: {
      color: theme.colors.primary,
    },
    clearFiltersButton: {
      backgroundColor: theme.colors.error,
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: 'center',
      marginTop: 16,
    },
    clearFiltersText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
  });
}