import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useApp } from '@/context/AppContext';
import { formatCurrency, getMonthYear } from '@/utils/formatters';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { MonthlyData } from '@/types';

const { width } = Dimensions.get('window');

export default function Analytics() {
  const { state } = useApp();

  const chartData = useMemo(() => {
    // Get last 6 months of data
    const monthlyData: { [key: string]: MonthlyData } = {};
    const now = new Date();
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = getMonthYear(date.toISOString());
      monthlyData[monthKey] = {
        month: monthKey,
        income: 0,
        expenses: 0,
      };
    }

    // Populate with actual data
    state.transactions.forEach(transaction => {
      const monthKey = getMonthYear(transaction.date);
      if (monthlyData[monthKey]) {
        if (transaction.type === 'income') {
          monthlyData[monthKey].income += transaction.amount;
        } else {
          monthlyData[monthKey].expenses += transaction.amount;
        }
      }
    });

    const months = Object.values(monthlyData);
    
    return {
      labels: months.map(m => m.month.split(' ')[0].substr(0, 3)),
      datasets: [
        {
          data: months.map(m => m.income),
          color: () => state.theme.income,
          strokeWidth: 3,
        },
        {
          data: months.map(m => m.expenses),
          color: () => state.theme.expense,
          strokeWidth: 3,
        },
      ],
    };
  }, [state.transactions, state.theme]);

  const categoryData = useMemo(() => {
    const categoryTotals: { [key: string]: number } = {};
    
    state.transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const category = state.categories.find(c => c.id === transaction.category);
        const categoryName = category?.name || 'Other';
        categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + transaction.amount;
      });

    const colors = ['#FF4C4C', '#FF6B6B', '#FF8E8E', '#FFB1B1', '#FFD4D4', '#FFF0F0'];
    
    return Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6)
      .map(([name, amount], index) => ({
        name,
        amount,
        color: colors[index] || '#FF4C4C',
        legendFontColor: state.theme.text,
        legendFontSize: 12,
      }));
  }, [state.transactions, state.categories, state.theme]);

  const totalExpenses = categoryData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: state.theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: state.theme.text }]}>
            Analytics
          </Text>
        </View>

        {state.transactions.length > 0 ? (
          <>
            <View style={styles.chartSection}>
              <Text style={[styles.sectionTitle, { color: state.theme.text }]}>
                Income vs Expenses (6 Months)
              </Text>
              <View style={[styles.chartContainer, { backgroundColor: state.theme.card }]}>
                <LineChart
                  data={chartData}
                  width={width - 80}
                  height={220}
                  chartConfig={{
                    backgroundColor: state.theme.card,
                    backgroundGradientFrom: state.theme.card,
                    backgroundGradientTo: state.theme.card,
                    decimalPlaces: 0,
                    color: (opacity = 1) => state.theme.textSecondary,
                    labelColor: (opacity = 1) => state.theme.text,
                    style: {
                      borderRadius: 16,
                    },
                    propsForDots: {
                      r: '4',
                      strokeWidth: '2',
                    },
                  }}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                />
                <View style={styles.legend}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: state.theme.income }]} />
                    <Text style={[styles.legendText, { color: state.theme.text }]}>Income</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: state.theme.expense }]} />
                    <Text style={[styles.legendText, { color: state.theme.text }]}>Expenses</Text>
                  </View>
                </View>
              </View>
            </View>

            {categoryData.length > 0 && (
              <View style={styles.chartSection}>
                <Text style={[styles.sectionTitle, { color: state.theme.text }]}>
                  Expenses by Category
                </Text>
                <View style={[styles.chartContainer, { backgroundColor: state.theme.card }]}>
                  <PieChart
                    data={categoryData}
                    width={width - 80}
                    height={220}
                    chartConfig={{
                      color: (opacity = 1) => state.theme.text,
                    }}
                    accessor="amount"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    center={[10, 10]}
                    absolute
                  />
                </View>
              </View>
            )}

            <View style={styles.statsSection}>
              <Text style={[styles.sectionTitle, { color: state.theme.text }]}>
                Summary
              </Text>
              <View style={styles.statsList}>
                <View style={[styles.statItem, { backgroundColor: state.theme.card, borderColor: state.theme.border }]}>
                  <Text style={[styles.statLabel, { color: state.theme.textSecondary }]}>
                    Total Transactions
                  </Text>
                  <Text style={[styles.statValue, { color: state.theme.text }]}>
                    {state.transactions.length}
                  </Text>
                </View>
                <View style={[styles.statItem, { backgroundColor: state.theme.card, borderColor: state.theme.border }]}>
                  <Text style={[styles.statLabel, { color: state.theme.textSecondary }]}>
                    Avg Transaction
                  </Text>
                  <Text style={[styles.statValue, { color: state.theme.text }]}>
                    {formatCurrency(
                      state.transactions.reduce((sum, t) => sum + t.amount, 0) / state.transactions.length
                    )}
                  </Text>
                </View>
                <View style={[styles.statItem, { backgroundColor: state.theme.card, borderColor: state.theme.border }]}>
                  <Text style={[styles.statLabel, { color: state.theme.textSecondary }]}>
                    Top Category
                  </Text>
                  <Text style={[styles.statValue, { color: state.theme.text }]}>
                    {categoryData[0]?.name || 'N/A'}
                  </Text>
                </View>
              </View>
            </View>
          </>
        ) : (
          <View style={[styles.emptyState, { backgroundColor: state.theme.card, borderColor: state.theme.border }]}>
            <Text style={[styles.emptyText, { color: state.theme.textSecondary }]}>
              No data to analyze yet
            </Text>
            <Text style={[styles.emptySubtext, { color: state.theme.textSecondary }]}>
              Add some transactions to see your financial analytics
            </Text>
          </View>
        )}
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
    paddingTop: 52,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
  },
  chartSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  chartContainer: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  statsSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  statsList: {
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  statLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  emptyState: {
    margin: 24,
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
});