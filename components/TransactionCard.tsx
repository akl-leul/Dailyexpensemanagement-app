import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Transaction } from '@/types';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { EllipsisVertical } from 'lucide-react-native';
import * as Icons from 'lucide-react-native';

interface TransactionCardProps {
  transaction: Transaction;
  onPress?: () => void;
}

export default function TransactionCard({ transaction, onPress }: TransactionCardProps) {
  const { state } = useApp();
  const category = state.categories.find(c => c.id === transaction.category);
  
  // Get the icon component dynamically
  const IconComponent = (Icons as any)[category?.icon || 'Circle'];

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: state.theme.card, borderColor: state.theme.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        <View style={[
          styles.iconContainer,
          { backgroundColor: transaction.type === 'income' ? state.theme.income + '20' : state.theme.expense + '20' }
        ]}>
          <IconComponent
            size={20}
            color={transaction.type === 'income' ? state.theme.income : state.theme.expense}
            strokeWidth={2}
          />
        </View>
        
        <View style={styles.details}>
          <Text style={[styles.description, { color: state.theme.text }]} numberOfLines={1}>
            {transaction.description}
          </Text>
          <Text style={[styles.category, { color: state.theme.textSecondary }]}>
            {category?.name} • {formatDate(transaction.date)}
          </Text>
        </View>
      </View>
      
      <View style={styles.rightSection}>
        <Text style={[
          styles.amount,
          { color: transaction.type === 'income' ? state.theme.income : state.theme.expense }
        ]}>
          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
        </Text>
        <View style={styles.actionIndicator}>
          <EllipsisVertical size={16} color={state.theme.textSecondary} strokeWidth={2} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  category: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  actionIndicator: {
    opacity: 0.6,
  },
});