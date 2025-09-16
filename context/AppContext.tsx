import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, Category, Theme } from '@/types';

interface AppState {
  transactions: Transaction[];
  categories: Category[];
  isDarkMode: boolean;
  isOnboarded: boolean;
  theme: Theme;
  isLoading: boolean;
}

type AppAction =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_ONBOARDED'; payload: boolean }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> }
  | { type: 'SET_LOADING'; payload: boolean };

const lightTheme: Theme = {
  primary: '#3A86FF',
  background: '#F0F0F0',
  surface: '#FFFFFF',
  text: '#333333',
  textSecondary: '#666666',
  income: '#06D6A0',
  expense: '#FF4C4C',
  border: '#E0E0E0',
  card: '#FFFFFF',
  git: '#6e40c9',

};

const darkTheme: Theme = {
  primary: '#3A86FF',
  background: '#121212',
  surface: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#CCCCCC',
  income: '#06D6A0',
  expense: '#FF4C4C',
  border: '#333333',
  card: '#1E1E1E',
  git: '#6e40c9',
};

const defaultCategories: Category[] = [
  // Income categories
  { id: '1', name: 'Salary', icon: 'Briefcase', type: 'income' },
  { id: '2', name: 'Freelance', icon: 'Laptop', type: 'income' },
  { id: '3', name: 'Investment', icon: 'TrendingUp', type: 'income' },
  { id: '4', name: 'Other Income', icon: 'PlusCircle', type: 'income' },
  
  // Expense categories
  { id: '5', name: 'Food & Dining', icon: 'Utensils', type: 'expense' },
  { id: '6', name: 'Transportation', icon: 'Car', type: 'expense' },
  { id: '7', name: 'Shopping', icon: 'ShoppingBag', type: 'expense' },
  { id: '8', name: 'Entertainment', icon: 'Music', type: 'expense' },
  { id: '9', name: 'Bills & Utilities', icon: 'Zap', type: 'expense' },
  { id: '10', name: 'Healthcare', icon: 'Heart', type: 'expense' },
  { id: '11', name: 'Education', icon: 'Book', type: 'expense' },
  { id: '12', name: 'Other Expenses', icon: 'MoreHorizontal', type: 'expense' },
];

const initialState: AppState = {
  transactions: [],
  categories: defaultCategories,
  isDarkMode: false,
  isOnboarded: false,
  theme: lightTheme,
  isLoading: true,
};

// Storage keys
const STORAGE_KEYS = {
  TRANSACTIONS: '@ExpenseTracker:transactions',
  THEME: '@ExpenseTracker:isDarkMode',
  ONBOARDED: '@ExpenseTracker:isOnboarded',
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t => 
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload,
      };
    case 'TOGGLE_THEME':
      return {
        ...state,
        isDarkMode: !state.isDarkMode,
        theme: !state.isDarkMode ? darkTheme : lightTheme,
      };
    case 'SET_ONBOARDED':
      return {
        ...state,
        isOnboarded: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'LOAD_STATE':
      return {
        ...state,
        ...action.payload,
        theme: action.payload.isDarkMode ? darkTheme : lightTheme,
        isLoading: false,
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data on app start
  useEffect(() => {
    loadStoredData();
  }, []);

  // Save data whenever state changes (except loading state)
  useEffect(() => {
    if (!state.isLoading) {
      saveDataToStorage();
    }
  }, [state.transactions, state.isDarkMode, state.isOnboarded, state.isLoading]);

  const loadStoredData = async () => {
    try {
      console.log('Loading stored data...');
      
      const [transactionsData, themeData, onboardedData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS),
        AsyncStorage.getItem(STORAGE_KEYS.THEME),
        AsyncStorage.getItem(STORAGE_KEYS.ONBOARDED),
      ]);

      console.log('Raw stored data:', {
        transactions: transactionsData,
        theme: themeData,
        onboarded: onboardedData,
      });

      const storedState: Partial<AppState> = {};

      if (transactionsData) {
        try {
          const parsedTransactions = JSON.parse(transactionsData);
          if (Array.isArray(parsedTransactions)) {
            storedState.transactions = parsedTransactions;
            console.log('Loaded transactions:', parsedTransactions.length);
          }
        } catch (error) {
          console.error('Error parsing transactions:', error);
        }
      }

      if (themeData) {
        try {
          storedState.isDarkMode = JSON.parse(themeData);
          console.log('Loaded theme:', storedState.isDarkMode);
        } catch (error) {
          console.error('Error parsing theme:', error);
        }
      }

      if (onboardedData) {
        try {
          storedState.isOnboarded = JSON.parse(onboardedData);
          console.log('Loaded onboarded status:', storedState.isOnboarded);
        } catch (error) {
          console.error('Error parsing onboarded status:', error);
        }
      }

      // Always dispatch LOAD_STATE to set loading to false
      dispatch({ type: 'LOAD_STATE', payload: storedState });
      
    } catch (error) {
      console.error('Error loading stored data:', error);
      // Still set loading to false even if there's an error
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const saveDataToStorage = async () => {
    try {
      console.log('Saving data to storage...', {
        transactionsCount: state.transactions.length,
        isDarkMode: state.isDarkMode,
        isOnboarded: state.isOnboarded,
      });

      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(state.transactions)),
        AsyncStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(state.isDarkMode)),
        AsyncStorage.setItem(STORAGE_KEYS.ONBOARDED, JSON.stringify(state.isOnboarded)),
      ]);

      console.log('Data saved successfully');
    } catch (error) {
      console.error('Error saving data to storage:', error);
    }
  };

  // Debug function to check storage
  const debugStorage = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const stores = await AsyncStorage.multiGet(keys);
      console.log('All stored data:', stores);
    } catch (error) {
      console.error('Error debugging storage:', error);
    }
  };

  // Add debug function to context for testing
  const contextValue = {
    state,
    dispatch,
    debugStorage, // Remove this in production
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}