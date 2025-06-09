export interface Transaction {
  id: string;
  amount: number;
  type: 'expense' | 'income';
  category: string;
  description: string;
  date: string;
  createdAt: Date;
}

export interface TransactionCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'expense' | 'income' | 'both';
}