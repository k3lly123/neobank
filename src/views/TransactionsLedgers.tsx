import React, { useState, useMemo } from 'react';
import { Transaction } from '../types';

interface TransactionsLedgersProps {
  transactions: Transaction[];
  onTriggerToast: (msg: string, title?: string, icon?: string) => void;
}

export const TransactionsLedgers: React.FC<TransactionsLedgersProps> = ({
  transactions,
  onTriggerToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTrayOpen, setFilterTrayOpen] = useState(false);
  const [selectedMechanism, setSelectedMechanism] = useState('All Rails');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedAccount, setSelectedAccount] = useState('All Accounts');
  const [maxAmount, setMaxAmount] = useState(2500000);
  const [exportOpen, setExportOpen] = useState(false);

  // Selected Transaction for Slide-Over Drawer
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Inquiry Modal
  const [inquiryModalTx, setInquiryModalTx] = useState<Transaction | null>(null);
  const [inquiryReason, setInquiryReason] = useState('Discrepancy in Settlement Batch');

  // Filtered transactions
  const filteredList = useMemo(() => {
    return transactions.filter((tx) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        tx.counterparty.toLowerCase().includes(q) ||
        tx.description.toLowerCase().includes(q) ||
        tx.traceId.toLowerCase().includes(q) ||
        tx.ledgerHash.toLowerCase().includes(q) ||
        tx.amount.toString().includes(q);

      const matchMechanism =
        selectedMechanism === 'All Rails' ||
        (selectedMechanism === 'FedWire' && tx.channel.includes('FedWire')) ||
        (selectedMechanism === 'FedACH' && tx.channel.includes('ACH')) ||
        (selectedMechanism === 'Card' && tx.channel.includes('Card')) ||
        (selectedMechanism === 'Internal' && tx.channel.includes('Internal'));

      const matchStatus =
        selectedStatus === 'All Statuses' || tx.status === selectedStatus;

      const matchAccount =
        selectedAccount === 'All Accounts' || tx.account.includes(selectedAccount.split(' ')[0]);

      const matchAmount = Math.abs(tx.amount) <= maxAmount;

      return matchSearch && matchMechanism && matchStatus && matchAccount && matchAmount;
    });
  }, [transactions, searchQuery, selectedMechanism, selectedStatus, selectedAccount, maxAmount]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedMechanism('All Rails');
    setSelectedStatus('All Statuses');
    setSelectedAccount('All Accounts');
    setMaxAmount(2500000);
    onTriggerToast('Cleared all ledger query filters.', 'Filters Reset');
  };

  const handleExport = (format: string) => {
    setExportOpen(false);
    onTriggerToast(`Exporting ${filteredList.length} records in ${format} format...`, 'Export Started', 'download');
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryModalTx) return;
    onTriggerToast(
      `Compliance inquiry ticket #INQ-${Math.floor(1000 + Math.random() * 9000)} opened with Federal Reserve routing desk for ${inquiryModalTx.traceId}.`,
      'Inquiry Submitted',
      'support_agent'
    );
    setInquiryModalTx(null);
  };

  return (
    <div className="flex flex-col w-full relative">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col gap-6 sm:gap-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="font-headline-lg text-headline-lg text-on-surface">
                Institutional Ledger &amp; Audits
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-mono text-label-sm border border-primary/20">
                Block #19,842,109
              </span>
            </div>
            <span className="font-body-md text-body-md text-on-surface-variant">
              Cryptographically verified double-entry settlement records with FedNow and SWIFT GPI trace hashing.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low border border-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
              <span>FedACH &amp; FedNow Live Sync</span>
            </div>
          </div>
        </div>

        {/* Sovereign Vault Balance Stats Strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Stat 1 */}
          <div className="p-5 rounded-xl bg-surface-container-low border border-surface-container-high/40 shadow-sm flex flex-col justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
              Sovereign Vault Balance
            </span>
            <div className="flex flex-col mt-2">
              <span className="font-headline-md text-headline-md text-on-surface font-bold">
                $42,918,240.85
              </span>
              <span className="font-label-sm text-xs text-tertiary flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-xs">trending_up</span> +18.4% MoM FedWire
              </span>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="p-5 rounded-xl bg-surface-container-low border border-surface-container-high/40 shadow-sm flex flex-col justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
              30-Day Total Inflows
            </span>
            <div className="flex flex-col mt-2">
              <span className="font-headline-md text-headline-md text-tertiary font-bold">
                +$3,640,842.20
              </span>
              <span className="font-label-sm text-xs text-on-surface-variant mt-0.5">
                184 Cleared Credits
              </span>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="p-5 rounded-xl bg-surface-container-low border border-surface-container-high/40 shadow-sm flex flex-col justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
              30-Day Operational Burn
            </span>
            <div className="flex flex-col mt-2">
              <span className="font-headline-md text-headline-md text-error font-bold">
                -$626,010.20
              </span>
              <span className="font-label-sm text-xs text-on-surface-variant mt-0.5">
                74 Disbursed Debits
              </span>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="p-5 rounded-xl bg-surface-container-low border border-surface-container-high/40 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                Ledger Sync Engine
              </span>
              <span className="w-2 h-2 rounded-full bg-tertiary"></span>
            </div>
            <div className="flex flex-col mt-2">
              <span className="font-headline-md text-headline-md text-primary font-bold">
                100% In Sync
              </span>
              <div className="flex items-center gap-1 mt-1.5">
                <div className="flex-1 bg-surface-container rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
                <span className="text-[10px] font-mono text-on-surface-variant">0 lag</span>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Parameter Filter & Query Control Console */}
        <div className="bg-surface-container-low rounded-xl p-5 shadow-xl border border-surface-container-high/40 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search counterparty, memo, hash, or trace ID..."
                className="w-full bg-surface-container text-on-surface font-body-sm text-body-sm pl-10 pr-10 py-2.5 rounded-lg border border-surface-container-highest outline-none focus:border-primary transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFilterTrayOpen(!filterTrayOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-label-md text-label-md border transition-all ${
                  filterTrayOpen
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'bg-surface-container border-surface-container-highest text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-lg">filter_alt</span>
                <span>Advanced Filters</span>
              </button>

              {/* Export Popover */}
              <div className="relative">
                <button
                  onClick={() => setExportOpen(!exportOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container border border-surface-container-highest text-on-surface hover:bg-surface-container-high font-label-md text-label-md transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">file_download</span>
                  <span>Export</span>
                  <span className="material-symbols-outlined text-sm">expand_more</span>
                </button>

                {exportOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-surface-container-high border border-surface-container-highest shadow-2xl p-2 z-30">
                    <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
                      Select Format
                    </div>
                    {['CSV (Institutional)', 'QuickBooks IIF', 'OFX Direct', 'JSON Ledger'].map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => handleExport(fmt)}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs text-on-surface hover:bg-surface-container-highest transition-colors flex items-center justify-between"
                      >
                        <span>{fmt}</span>
                        <span className="material-symbols-outlined text-sm text-primary">download</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Advanced Filter Tray */}
          {filterTrayOpen && (
            <div className="p-4 rounded-xl bg-surface-container border border-surface-container-highest flex flex-col gap-4 animate-in fade-in duration-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {/* Mechanism */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-on-surface-variant uppercase">Rail Mechanism</label>
                  <select
                    value={selectedMechanism}
                    onChange={(e) => setSelectedMechanism(e.target.value)}
                    className="bg-surface-container-low border border-surface-container-highest px-3 py-2 rounded-lg text-xs text-on-surface outline-none"
                  >
                    <option value="All Rails">All Rails</option>
                    <option value="FedWire">FedWire Real-Time</option>
                    <option value="FedACH">FedACH Batch</option>
                    <option value="Card">Direct Card Settlement</option>
                    <option value="Internal">Internal Vault Sweep</option>
                  </select>
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-on-surface-variant uppercase">Settlement Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="bg-surface-container-low border border-surface-container-highest px-3 py-2 rounded-lg text-xs text-on-surface outline-none"
                  >
                    <option value="All Statuses">All Statuses</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending Settlement">Pending Settlement</option>
                    <option value="Processing">Processing</option>
                  </select>
                </div>

                {/* Account */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-on-surface-variant uppercase">Holding Account</label>
                  <select
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className="bg-surface-container-low border border-surface-container-highest px-3 py-2 rounded-lg text-xs text-on-surface outline-none"
                  >
                    <option value="All Accounts">All Accounts</option>
                    <option value="Apex Master">Apex Master (*8902)</option>
                    <option value="DevOps">DevOps Exec (*3391)</option>
                    <option value="Vault">Yield Vault (*4110)</option>
                  </select>
                </div>

                {/* Amount Slider */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-on-surface-variant uppercase">Max Amount</span>
                    <span className="font-mono text-primary">${(maxAmount / 1000).toFixed(0)}k</span>
                  </div>
                  <input
                    type="range"
                    min={10000}
                    max={2500000}
                    step={10000}
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(Number(e.target.value))}
                    className="accent-primary cursor-pointer mt-1.5"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-surface-container-high/40 text-xs">
                <span className="text-on-surface-variant">
                  Matching {filteredList.length} of {transactions.length} total entries
                </span>
                <button
                  onClick={handleResetFilters}
                  className="text-primary hover:underline font-semibold"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Institutional Ledger Data Table */}
        <div className="bg-surface-container-low rounded-xl p-6 shadow-xl border border-surface-container-high/40 flex flex-col gap-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider border-b border-surface-container-highest pb-3">
                  <th className="pb-3 pl-3">Status</th>
                  <th className="pb-3">Date &amp; Time</th>
                  <th className="pb-3">Counterparty / Description</th>
                  <th className="pb-3">Channel / Account</th>
                  <th className="pb-3">Reference ID</th>
                  <th className="pb-3 text-right">Amount (USD)</th>
                  <th className="pb-3 text-right pr-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container/60 font-body-sm text-body-sm">
                {filteredList.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    className="hover:bg-surface-container/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 pl-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-sm text-[11px] ${
                          tx.status === 'Completed'
                            ? 'bg-tertiary/15 text-tertiary'
                            : 'bg-secondary-container/20 text-secondary'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            tx.status === 'Completed' ? 'bg-tertiary' : 'bg-secondary animate-pulse'
                          }`}
                        ></span>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-on-surface font-mono text-xs whitespace-nowrap">
                      {tx.date} <span className="text-on-surface-variant/70">{tx.time}</span>
                    </td>
                    <td className="py-3.5">
                      <div className="flex flex-col">
                        <span className="font-label-md text-label-md text-on-surface font-semibold group-hover:text-primary transition-colors">
                          {tx.counterparty}
                        </span>
                        <span className="font-body-sm text-xs text-on-surface-variant">
                          {tx.description}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <div className="flex flex-col text-xs">
                        <span className="text-on-surface">{tx.channel}</span>
                        <span className="text-on-surface-variant font-mono">{tx.account}</span>
                      </div>
                    </td>
                    <td className="py-3.5 font-mono text-xs text-primary">
                      {tx.referenceId}
                    </td>
                    <td className="py-3.5 text-right font-num-metric-sm text-num-metric-sm whitespace-nowrap">
                      <span className={tx.isPositive ? 'text-tertiary font-bold' : 'text-on-surface'}>
                        {tx.isPositive ? '+' : ''}$
                        {Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="py-3.5 text-right pr-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTx(tx);
                        }}
                        className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-label-md transition-colors border border-surface-container-highest"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table footer / pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-surface-container-highest text-xs text-on-surface-variant">
            <span>Showing 1 to {filteredList.length} of {filteredList.length} entries</span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 rounded bg-surface-container border border-surface-container-highest text-on-surface opacity-50 cursor-not-allowed">
                Previous
              </button>
              <button className="px-3 py-1 rounded bg-primary-container text-on-primary-container font-bold">
                1
              </button>
              <button className="px-3 py-1 rounded bg-surface-container border border-surface-container-highest text-on-surface opacity-50 cursor-not-allowed">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-Over Transaction Detail Inspection Drawer */}
      {selectedTx && (
        <div
          className="fixed inset-0 bg-surface-container-lowest/70 backdrop-blur-sm z-50 flex justify-end"
          onClick={() => setSelectedTx(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-surface-container-low border-l border-surface-container-highest h-full p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-200"
          >
            <div className="flex flex-col gap-6">
              {/* Drawer Top */}
              <div className="flex items-center justify-between pb-4 border-b border-surface-container-highest">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">account_tree</span>
                  <span className="font-headline-sm text-sm text-on-surface uppercase tracking-wider font-semibold">
                    Audit Preview (Immutable Node)
                  </span>
                </div>
                <button
                  onClick={() => setSelectedTx(null)}
                  className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>

              {/* Big amount header */}
              <div className="flex flex-col items-center text-center p-4 rounded-xl bg-surface-container border border-surface-container-high/60">
                <span className="px-2.5 py-0.5 rounded-full bg-tertiary/15 text-tertiary font-label-sm text-xs font-semibold mb-2">
                  {selectedTx.status} &amp; Verified
                </span>
                <span
                  className={`font-display-xl-mobile font-bold tracking-tight ${
                    selectedTx.isPositive ? 'text-tertiary' : 'text-on-surface'
                  }`}
                >
                  {selectedTx.isPositive ? '+' : ''}$
                  {Math.abs(selectedTx.amount).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{' '}
                  USD
                </span>
                <span className="font-label-md text-sm text-on-surface font-semibold mt-1">
                  {selectedTx.counterparty}
                </span>
                <span className="font-mono text-xs text-on-surface-variant mt-0.5">
                  {selectedTx.date} · {selectedTx.time}
                </span>
              </div>

              {/* Detail fields */}
              <div className="flex flex-col gap-3 font-body-sm text-xs">
                <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider">
                  Transaction Verification Details
                </span>

                <div className="p-3.5 rounded-xl bg-surface-container flex flex-col gap-2.5 border border-surface-container-high/40">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Network Trace ID:</span>
                    <span className="font-mono text-on-surface font-semibold select-all">
                      {selectedTx.traceId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Ledger Hash:</span>
                    <span className="font-mono text-primary truncate max-w-[200px] select-all">
                      {selectedTx.ledgerHash}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Origin Counterparty:</span>
                    <span className="text-on-surface font-medium">{selectedTx.originParty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Clearing Protocol:</span>
                    <span className="text-on-surface">{selectedTx.clearingProtocol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Interchange Fee:</span>
                    <span className="text-on-surface font-mono">{selectedTx.networkFee}</span>
                  </div>
                </div>

                {/* Compliance Audit Log */}
                <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider mt-2">
                  Compliance Audit Log
                </span>
                <div className="p-3.5 rounded-xl bg-surface-container flex flex-col gap-2 border border-surface-container-high/40">
                  <div className="flex items-center gap-2 text-tertiary">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    <span className="font-semibold">Cryptographic Signature Validated</span>
                  </div>
                  <p className="text-on-surface-variant text-[11px] leading-relaxed">
                    Signed by Federal Reserve PKI Gateway and committed to Apex Sovereign Multi-Cloud Storage Node.
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-1 border-t border-surface-container-high/30">
                    <span>OFAC Sanction Scan:</span>
                    <span className="text-tertiary font-bold">CLEAN (14ms)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-2 pt-6 border-t border-surface-container-highest">
              <button
                onClick={() => {
                  onTriggerToast('Cryptographic PDF audit certificate generated.', 'Certificate Downloaded');
                }}
                className="w-full py-2.5 rounded-lg bg-primary-container text-on-primary-container font-label-md text-xs font-semibold hover:bg-primary transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <span className="material-symbols-outlined text-base">download</span>
                <span>Download PDF Certificate</span>
              </button>

              <button
                onClick={() => setInquiryModalTx(selectedTx)}
                className="w-full py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-xs transition-colors border border-surface-container-highest"
              >
                Initiate Inquiry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inquiry Modal */}
      {inquiryModalTx && (
        <div className="fixed inset-0 bg-surface-container-lowest/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmitInquiry}
            className="bg-surface-container-low max-w-md w-full rounded-2xl p-6 shadow-2xl border border-primary/20 flex flex-col gap-4 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Initiate Compliance Inquiry
              </h3>
              <button
                type="button"
                onClick={() => setInquiryModalTx(null)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="text-xs text-on-surface-variant">
              Submit an official transaction trace inquiry for {inquiryModalTx.traceId} ($
              {Math.abs(inquiryModalTx.amount).toLocaleString()}) to Federal Reserve and SWIFT routing centers.
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-on-surface-variant uppercase">Inquiry Reason</label>
              <select
                value={inquiryReason}
                onChange={(e) => setInquiryReason(e.target.value)}
                className="bg-surface-container border border-surface-container-highest px-3 py-2 rounded-lg text-xs text-on-surface outline-none"
              >
                <option value="Discrepancy in Settlement Batch">Discrepancy in Settlement Batch</option>
                <option value="Counterparty Name Verification">Counterparty Name Verification</option>
                <option value="OFAC / AML Clearance Request">OFAC / AML Clearance Request</option>
                <option value="Tax Withholding Verification">Tax Withholding Verification</option>
              </select>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setInquiryModalTx(null)}
                className="flex-1 py-2 rounded-lg bg-surface-container text-on-surface text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-lg bg-primary-container text-on-primary-container text-xs font-semibold hover:bg-primary transition-all"
              >
                Submit Inquiry
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
