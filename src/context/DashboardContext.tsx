import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { DashboardState, SQPRData, Opportunity } from '../types';

interface DashboardContextType {
  state: DashboardState;
  actions: {
    setData: (data: SQPRData[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    resetData: () => void;
  };
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

type DashboardAction =
  | { type: 'SET_DATA'; payload: SQPRData[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_DATA' };

const initialState: DashboardState = {
  data: [],
  filteredData: [],
  opportunities: [],
  isLoading: false,
  error: null,
};

const dashboardReducer = (state: DashboardState, action: DashboardAction): DashboardState => {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        data: action.payload,
        filteredData: action.payload, // No filtering - just use all data
        opportunities: detectOpportunities(action.payload),
        error: null,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'RESET_DATA':
      return initialState;
    default:
      return state;
  }
};


const detectOpportunities = (data: SQPRData[]): Opportunity[] => {
  const opportunities: Opportunity[] = [];
  
  const safeDivide = (numerator: any, denominator: any): number => {
    const num = typeof numerator === 'number' ? numerator : parseFloat(numerator) || 0;
    const denom = typeof denominator === 'number' ? denominator : parseFloat(denominator) || 0;
    if (denom === 0 || !isFinite(denom) || !isFinite(num)) return 0;
    const result = (num / denom) * 100;
    return isFinite(result) ? result : 0;
  };
  
  data.forEach((row, index) => {
    const impressionShare = typeof row['Impressions: ASIN Share %'] === 'number' 
      ? row['Impressions: ASIN Share %'] 
      : parseFloat(row['Impressions: ASIN Share %']) || 0;
    
    const purchaseRate = row['Purchases: Purchase Rate %'] 
      ? (typeof row['Purchases: Purchase Rate %'] === 'number' 
          ? row['Purchases: Purchase Rate %'] 
          : parseFloat(row['Purchases: Purchase Rate %']) || 0)
      : safeDivide(row['Purchases: Total Count'], row['Impressions: Total Count']);
    
    if (isFinite(impressionShare) && isFinite(purchaseRate) && impressionShare < 10 && purchaseRate > 20) {
      opportunities.push({
        id: `hidden-gem-${index}`,
        rule: {
          id: 'hidden-gem-1',
          name: 'Hidden Gem',
          description: 'Low market share but high conversion rate',
          condition: () => true,
          action: 'Increase PPC spend and improve SEO',
          category: 'hidden-gem',
        },
        data: row,
        impact: 'high',
      });
    }
  });
  
  return opportunities;
};

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  const actions = {
    setData: (data: SQPRData[]) => dispatch({ type: 'SET_DATA', payload: data }),
    setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error }),
    resetData: () => dispatch({ type: 'RESET_DATA' }),
  };

  return (
    <DashboardContext.Provider value={{ state, actions }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};