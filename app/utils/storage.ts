import AsyncStorage from '@react-native-async-storage/async-storage';

const TRANSACTIONS_KEY = 'transactions';

export async function saveTransactions(transactions: any[]) {
  try {
    await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  } catch (e) {
    console.error('Failed to save transactions', e);
  }
}

export async function loadTransactions(): Promise<any[]> {
  try {
    const json = await AsyncStorage.getItem(TRANSACTIONS_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('Failed to load transactions', e);
    return [];
  }
}