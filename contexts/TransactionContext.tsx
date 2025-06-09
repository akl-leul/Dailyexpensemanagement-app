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
  clearAllTransactions: () => void; // <-- Add this line
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load transactions from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('transactions');
    if (stored) {
      setTransactions(JSON.parse(stored));
    }
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

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

  const clearAllTransactions = () => setTransactions([]); // <-- Add this function

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
        clearAllTransactions, // <-- Add this to the context value
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