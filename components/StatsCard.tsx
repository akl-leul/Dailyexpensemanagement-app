import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/utils/formatters';

interface StatsCardProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'balance';
  icon?: React.ReactNode;
}

export default function StatsCard({ title, amount, type, icon }: StatsCardProps) {
  const { state } = useApp();

  const getColor = () => {
    switch (type) {
      case 'income':
        return state.theme.income;
      case 'expense':
        return state.theme.expense;
      case 'balance':
        return amount >= 0 ? state.theme.income : state.theme.expense;
      default:
        return state.theme.text;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: state.theme.card, borderColor: state.theme.border }]}>
      <View style={styles.header}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={[styles.title, { color: state.theme.textSecondary }]}>
          {title}
        </Text>
      </View>
      <Text style={[styles.amount, { color: getColor() }]}>
        {type === 'balance' && amount > 0 && '+'}
        {formatCurrency(amount)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  amount: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
});