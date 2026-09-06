export type NavigationPath = 
  | 'overview-and-dashboard'
  | 'transfers-and-payments'
  | 'cards-and-virtual-issuance'
  | 'transactions-and-ledgers'
  | 'analytics-and-yield'
  | 'settings-and-api-keys';

export type TransactionStatus = 'Completed' | 'Pending Settlement' | 'Processing' | 'Failed' | 'Under Review';

export interface Transaction {
  id: string;
  counterparty: string;
  description: string;
  amount: number;
  isPositive: boolean;
  channel: string;
  account: string;
  date: string;
  time: string;
  status: TransactionStatus;
  traceId: string;
  ledgerHash: string;
  originParty: string;
  clearingProtocol: string;
  networkFee: string;
  category: string;
  referenceId: string;
}

export interface VirtualCard {
  id: string;
  name: string;
  lastFour: string;
  fullNumber: string;
  expiry: string;
  cvv: string;
  tier: string;
  network: 'visa' | 'mastercard';
  monthlyCap: number;
  spent: number;
  lead: string;
  status: 'Active' | 'Warning' | 'Frozen' | 'Burn Token';
  warningMessage?: string;
  singleUse?: boolean;
  validHours?: number;
  colorScheme?: 'primary' | 'error' | 'secondary';
  mccAllowed?: string[];
  autoFreezeOnSwipe?: boolean;
}

export interface TreasurySweep {
  id: string;
  code: string;
  name: string;
  targetCounterparty: string;
  targetAccount: string;
  frequency: string;
  nextRun: string;
  volume: string;
  volumeNum: number;
  rails: string;
  status: 'Active' | 'Paused';
}

export interface SubAccount {
  id: string;
  name: string;
  accountNumber: string;
  balanceFormatted: string;
  balanceNumeric: number;
  currency: string;
  type: string;
  subtext: string;
  icon: string;
}

export interface ToastMessage {
  id: string;
  title?: string;
  message: string;
  icon?: string;
}
