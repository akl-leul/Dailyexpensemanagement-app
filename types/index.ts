export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  type: 'income' | 'expense';
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
}

export interface Theme {
  primary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  income: string;
  expense: string;
  border: string;
  card: string;
  git: string;
}