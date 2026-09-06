import React, { useState } from 'react';
import { NavigationPath, Transaction, VirtualCard, TreasurySweep, SubAccount, ToastMessage } from './types';
import { INITIAL_TRANSACTIONS, INITIAL_CARDS, INITIAL_SWEEPS, SUB_ACCOUNTS } from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { InstantTransferModal } from './components/InstantTransferModal';

// Views
import { OverviewDashboard } from './views/OverviewDashboard';
import { TransfersPayments } from './views/TransfersPayments';
import { CardsVirtualIssuance } from './views/CardsVirtualIssuance';
import { TransactionsLedgers } from './views/TransactionsLedgers';
import { AnalyticsYield } from './views/AnalyticsYield';
import { SettingsApiKeys } from './views/SettingsApiKeys';

export default function App() {
  const [currentPath, setCurrentPath] = useState<NavigationPath>('overview-and-dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [instantTransferModalOpen, setInstantTransferModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Core Financial State
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [cards, setCards] = useState<VirtualCard[]>(INITIAL_CARDS);
  const [sweeps, setSweeps] = useState<TreasurySweep[]>(INITIAL_SWEEPS);
  const [subAccounts, setSubAccounts] = useState<SubAccount[]>(SUB_ACCOUNTS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const triggerToast = (message: string, title?: string, icon?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, title, message, icon };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToggleFreezeCard = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId
          ? { ...c, status: c.status === 'Frozen' ? 'Active' : 'Frozen' }
          : c
      )
    );
  };

  const handleUpdateCardLimit = (cardId: string, newLimit: number) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, monthlyCap: newLimit } : c))
    );
  };

  const handleCreateCard = (newCard: VirtualCard) => {
    setCards((prev) => [newCard, ...prev]);
  };

  const handleToggleSweepStatus = (sweepId: string) => {
    setSweeps((prev) =>
      prev.map((s) =>
        s.id === sweepId
          ? { ...s, status: s.status === 'Active' ? 'Paused' : 'Active' }
          : s
      )
    );
  };

  const handleAddSweep = (newSweep: TreasurySweep) => {
    setSweeps((prev) => [newSweep, ...prev]);
  };

  const handleAddTransaction = (tx: Transaction) => {
    setTransactions((prev) => [tx, ...prev]);
    // Also adjust Primary Operating balance
    setSubAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === 'acc-1') {
          const updated = acc.balanceNumeric + tx.amount;
          return {
            ...acc,
            balanceNumeric: updated,
            balanceFormatted: `$${updated.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          };
        }
        return acc;
      })
    );
  };

  const handleDispatchInstantTransfer = ({
    destination,
    amount,
    memo,
    rail,
  }: {
    destination: string;
    amount: number;
    memo: string;
    rail: string;
  }) => {
    const newTx: Transaction = {
      id: `tx-instant-${Date.now()}`,
      counterparty: destination,
      description: memo || 'Instant Treasury Settlement',
      amount: -amount,
      isPositive: false,
      channel: rail,
      account: 'Apex Master (*8902)',
      date: 'Today',
      time: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' UTC',
      status: 'Completed',
      traceId: `FEDNOW-${Math.floor(100000 + Math.random() * 900000)}`,
      ledgerHash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
      originParty: 'Apex Operating Master (*8841)',
      clearingProtocol: 'Direct Sovereign RTGS',
      networkFee: '$0.00 (Tier-1 Waived)',
      category: 'Disbursements',
      referenceId: `0x${Math.random().toString(16).substring(2, 6)}…${Math.random().toString(16).substring(2, 6)}`,
    };

    handleAddTransaction(newTx);
    triggerToast(
      `Dispatched $${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} to ${destination} via ${rail}. Sub-300ms finality confirmed.`,
      'Instant Transfer Cleared',
      'bolt'
    );
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-body-md antialiased selection:bg-primary-container selection:text-on-primary-container">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={setCurrentPath}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Top Header */}
      <Header
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        onOpenInstantTransfer={() => setInstantTransferModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q.trim() && currentPath !== 'transactions-and-ledgers') {
            setCurrentPath('transactions-and-ledgers');
          }
        }}
      />

      {/* Main Content Area */}
      <main className="pt-16 lg:pl-72 flex-1 flex flex-col transition-all">
        {currentPath === 'overview-and-dashboard' && (
          <OverviewDashboard
            transactions={transactions}
            subAccounts={subAccounts}
            onNavigate={setCurrentPath}
            onOpenTransfer={() => setInstantTransferModalOpen(true)}
            onTriggerToast={triggerToast}
          />
        )}

        {currentPath === 'transfers-and-payments' && (
          <TransfersPayments
            sweeps={sweeps}
            onToggleSweepStatus={handleToggleSweepStatus}
            onAddSweep={handleAddSweep}
            onAddTransaction={handleAddTransaction}
            onTriggerToast={triggerToast}
          />
        )}

        {currentPath === 'cards-and-virtual-issuance' && (
          <CardsVirtualIssuance
            cards={cards}
            onToggleFreeze={handleToggleFreezeCard}
            onUpdateCardLimit={handleUpdateCardLimit}
            onCreateCard={handleCreateCard}
            onTriggerToast={triggerToast}
          />
        )}

        {currentPath === 'transactions-and-ledgers' && (
          <TransactionsLedgers
            transactions={transactions}
            onTriggerToast={triggerToast}
          />
        )}

        {currentPath === 'analytics-and-yield' && (
          <AnalyticsYield onTriggerToast={triggerToast} />
        )}

        {currentPath === 'settings-and-api-keys' && (
          <SettingsApiKeys onTriggerToast={triggerToast} />
        )}
      </main>

      {/* Global Instant Transfer Modal */}
      <InstantTransferModal
        isOpen={instantTransferModalOpen}
        onClose={() => setInstantTransferModalOpen(false)}
        onDispatch={handleDispatchInstantTransfer}
      />

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
