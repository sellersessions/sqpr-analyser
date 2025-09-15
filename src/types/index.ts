export interface SQPRData {
  'Search Query': string;
  'Search Query Score': number;
  'Impressions: Total Count': number;
  'Impressions: ASIN Share %': number;
  'Clicks: Total Count': number;
  'Clicks: Click Rate %'?: number;
  'Clicks: ASIN Share %': number;
  'Basket Adds: Total Count': number;
  'Basket Adds: Basket Add Rate %'?: number;
  'Basket Adds: ASIN Share %': number;
  'Purchases: Total Count': number;
  'Purchases: Purchase Rate %'?: number;
  'Purchases: ASIN Share %': number;
  'Clicks: Price (Median)'?: number;
  [key: string]: string | number | undefined;
}

export interface OpportunityRule {
  id: string;
  name: string;
  description: string;
  condition: (data: SQPRData) => boolean;
  action: string;
  category: 'hidden-gem' | 'funnel-bottleneck' | 'price-optimization' | 'share-opportunity';
}

export interface Opportunity {
  id: string;
  rule: OpportunityRule;
  data: SQPRData;
  impact: 'high' | 'medium' | 'low';
}

export interface FunnelStage {
  name: string;
  count: number;
  share: number;
  conversionRate?: number;
}

export interface DashboardState {
  data: SQPRData[];
  filteredData: SQPRData[];
  opportunities: Opportunity[];
  isLoading: boolean;
  error: string | null;
}