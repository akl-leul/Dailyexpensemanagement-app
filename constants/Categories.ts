import { TransactionCategory } from '@/types/Transaction';

export const EXPENSE_CATEGORIES: TransactionCategory[] = [
  { id: '1', name: 'Food & Dining', icon: '🍽️', color: '#EF4444', type: 'expense' },
  { id: '2', name: 'Transportation', icon: '🚗', color: '#F97316', type: 'expense' },
  { id: '3', name: 'Shopping', icon: '🛍️', color: '#EC4899', type: 'expense' },
  { id: '4', name: 'Entertainment', icon: '🎬', color: '#8B5CF6', type: 'expense' },
  { id: '5', name: 'Bills & Utilities', icon: '💡', color: '#06B6D4', type: 'expense' },
  { id: '6', name: 'Healthcare', icon: '🏥', color: '#10B981', type: 'expense' },
  { id: '7', name: 'Education', icon: '📚', color: '#3B82F6', type: 'expense' },
  { id: '8', name: 'Other', icon: '📦', color: '#6B7280', type: 'expense' },
];

export const INCOME_CATEGORIES: TransactionCategory[] = [
  { id: '9', name: 'Salary', icon: '💼', color: '#10B981', type: 'income' },
  { id: '10', name: 'Business', icon: '🏢', color: '#059669', type: 'income' },
  { id: '11', name: 'Investment', icon: '📈', color: '#0D9488', type: 'income' },
  { id: '12', name: 'Freelance', icon: '💻', color: '#0891B2', type: 'income' },
  { id: '13', name: 'Gift', icon: '🎁', color: '#7C3AED', type: 'income' },
  { id: '14', name: 'Other', icon: '💰', color: '#059669', type: 'income' },
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];