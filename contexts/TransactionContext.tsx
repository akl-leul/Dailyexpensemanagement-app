import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction } from '@/types/Transaction';

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  getTotalBalance: () => number;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getTransactionsByMonth: (month: number, year: number) => Transaction[];
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Initialize with sample data
  useEffect(() => {
    const sampleTransactions: Transaction[] = [
      {
        id: '1',
        amount: 2500,
        type: 'income',
        category: 'Salary',
        description: 'Monthly salary',
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date(),
      },
      {
        id: '2',
        amount: 45,
        type: 'expense',
        category: 'Food & Dining',
        description: 'Lunch at restaurant',
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date(),
      },
      {
        id: '3',
        amount: 120,
        type: 'expense',
        category: 'Transportation',
        description: 'Gas for car',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        createdAt: new Date(Date.now() - 86400000),
      },
      {
        id: '4',
        amount: 500,
        type: 'income',
        category: 'Freelance',
        description: 'Web development project',
        date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
        createdAt: new Date(Date.now() - 172800000),
      },
      {
        id: '5',
        amount: 85,
        type: 'expense',
        category: 'Shopping',
        description: 'Groceries',
        date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
        createdAt: new Date(Date.now() - 259200000),
      },
    ];
    setTransactions(sampleTransactions);
  }, []);

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateTransaction = (id: string, updatedData: Partial<Transaction>) => {
    setTransactions(prev =>
      prev.map(transaction =>
        transaction.id === id ? { ...transaction, ...updatedData } : transaction
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  const getTotalBalance = () => {
    return transactions.reduce((total, transaction) => {
      return transaction.type === 'income' 
        ? total + transaction.amount 
        : total - transaction.amount;
    }, 0);
  };

  const getTotalIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((total, t) => total + t.amount, 0);
  };

  const getTotalExpenses = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((total, t) => total + t.amount, 0);
  };

  const getTransactionsByMonth = (month: number, year: number) => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === month && transactionDate.getFullYear() === year;
    });
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getTotalBalance,
        getTotalIncome,
        getTotalExpenses,
        getTransactionsByMonth,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}