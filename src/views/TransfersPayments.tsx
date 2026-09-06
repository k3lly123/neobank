import React, { useState } from 'react';
import { TreasurySweep, Transaction } from '../types';
import { US_TREASURY_FLAG, ELENA_VANCE_PORTRAIT, MARCUS_REID_PORTRAIT } from '../data/mockData';

interface TransfersPaymentsProps {
  sweeps: TreasurySweep[];
  onToggleSweepStatus: (id: string) => void;
  onAddSweep: (sweep: TreasurySweep) => void;
  onAddTransaction: (tx: Transaction) => void;
  onTriggerToast: (msg: string, title?: string, icon?: string) => void;
}

export const TransfersPayments: React.FC<TransfersPaymentsProps> = ({
  sweeps,
  onToggleSweepStatus,
  onAddSweep,
  onAddTransaction,
  onTriggerToast,
}) => {
  const [activeRail, setActiveRail] = useState<'internal' | 'domestic' | 'international'>('domestic');
  const [selectedDestination, setSelectedDestination] = useState('JPMorgan Escrow FedNow');
  const [amountStr, setAmountStr] = useState('250,000.00');
  const [memo, setMemo] = useState('Q4 Critical Infrastructure Deployment Batch #881');
  const [tags, setTags] = useState(['#AWS-Core-Infra', '#CapEx-H2']);
  const [tagInput, setTagInput] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  // Dual-sign state
  const [marcusReidSigned, setMarcusReidSigned] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  // New Beneficiary Modal
  const [beneficiaryModalOpen, setBeneficiaryModalOpen] = useState(false);
  const [newBenName, setNewBenName] = useState('');
  const [newBenRouting, setNewBenRouting] = useState('');
  const [newBenAccount, setNewBenAccount] = useState('');

  // New Sweep Modal
  const [sweepModalOpen, setSweepModalOpen] = useState(false);
  const [sweepRuleName, setSweepRuleName] = useState('');
  const [sweepTarget, setSweepTarget] = useState('');
  const [sweepFreq, setSweepFreq] = useState('Weekly');
  const [sweepAmount, setSweepAmount] = useState('500,000.00');

  const handleQuickPercent = (pct: number) => {
    const total = 2420100;
    const val = (total * pct) / 100;
    setAmountStr(
      val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    );
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const cleanTag = tagInput.startsWith('#') ? tagInput.trim() : `#${tagInput.trim()}`;
    if (!tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
    }
    setTagInput('');
    setShowTagInput(false);
  };

  const handleExecuteWire = () => {
    const numericAmount = parseFloat(amountStr.replace(/,/g, '')) || 250000;

    // Check if amount > 100,000 and requires dual sign
    if (numericAmount >= 100000 && !marcusReidSigned) {
      onTriggerToast(
        'Dual-sign threshold exceeded ($100,000+). Quorum requires Marcus Reid sign-off before dispatch.',
        'Quorum Required',
        'gavel'
      );
      return;
    }

    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      const newTx: Transaction = {
        id: `wire-${Date.now()}`,
        counterparty: selectedDestination,
        description: memo || 'FedNow RTGS Instant Wire',
        amount: -numericAmount,
        isPositive: false,
        channel: 'FedNow Instant RTGS',
        account: 'Primary Operating Master (*8841)',
        date: 'Today',
        time: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' UTC',
        status: 'Completed',
        traceId: `FEDNOW-${Math.floor(100000 + Math.random() * 900000)}`,
        ledgerHash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
        originParty: 'Apex Sovereign Master (*8841)',
        clearingProtocol: 'Federal Reserve PKI FedNow Real-Time',
        networkFee: '$0.00 (Tier-1 Sponsored)',
        category: 'Capital Disbursements',
        referenceId: `0x${Math.random().toString(16).substring(2, 6)}…${Math.random().toString(16).substring(2, 6)}`,
      };
      onAddTransaction(newTx);
      onTriggerToast(
        `FedNow wire of $${numericAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} successfully dispatched with sub-300ms finality.`,
        'Settlement Dispatched',
        'verified'
      );
    }, 800);
  };

  const handleSignMarcusReid = () => {
    setMarcusReidSigned(true);
    onTriggerToast(
      'FIDO2 WebAuthn cryptographic assertion verified. Quorum achieved (2 of 2).',
      'Dual-Sign Approved',
      'key'
    );
  };

  const handleSaveBeneficiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBenName) return;
    setBeneficiaryModalOpen(false);
    onTriggerToast(`Added beneficiary "${newBenName}" to authorized corporate clearing pool.`, 'Beneficiary Added');
    setNewBenName('');
    setNewBenRouting('');
    setNewBenAccount('');
  };

  const handleCreateSweep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sweepRuleName) return;
    const num = parseFloat(sweepAmount.replace(/,/g, '')) || 500000;
    const newRule: TreasurySweep = {
      id: `swp-${Date.now()}`,
      code: `RULE-${Math.floor(100 + Math.random() * 900)}`,
      name: sweepRuleName,
      targetCounterparty: sweepTarget || 'Apex High-Yield Sovereign Vault',
      targetAccount: 'Internal Sub-Account',
      frequency: sweepFreq,
      nextRun: 'Daily · 21:00 UTC',
      volume: `$${num.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      volumeNum: num,
      rails: 'Instant Book',
      status: 'Active',
    };
    onAddSweep(newRule);
    setSweepModalOpen(false);
    setSweepRuleName('');
    onTriggerToast(`Treasury sweep rule "${newRule.name}" is now live and scheduled.`, 'Rule Created');
  };

  return (
    <div className="flex flex-col w-full">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col gap-6 sm:gap-8">
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="font-headline-lg text-headline-lg text-on-surface">
                Treasury Rails &amp; Settlements
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-mono text-label-sm border border-primary/20">
                Node #049
              </span>
            </div>
            <span className="font-body-md text-body-md text-on-surface-variant">
              Instant Gross Settlement via FedNow, Automated Clearing House (ACH), and SWIFT GPI.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low border border-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
              <span className="w-2 h-2 rounded-full bg-tertiary"></span>
              <span>Hardware Enclave HSM-2 Active</span>
            </div>
            <button
              onClick={() => onTriggerToast('Exporting encrypted immutable cryptographic audit trail...', 'Audit Log')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-colors border border-surface-container-highest"
            >
              <span className="material-symbols-outlined text-base">history</span>
              <span>Execution Audit Log</span>
            </button>
          </div>
        </div>

        {/* Dual-Sign Security Quorum Banner */}
        <div className="p-4 sm:p-5 rounded-xl bg-surface-container-low border border-primary/20 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-primary-container/20 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">gavel</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-label-md text-label-md text-on-surface font-semibold">
                  Dual-Sign Policy Enforced (Threshold: $100,000.00 USD)
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    marcusReidSigned ? 'bg-tertiary/20 text-tertiary' : 'bg-primary/15 text-primary'
                  }`}
                >
                  Quorum Progress: {marcusReidSigned ? '2 of 2 Complete' : '1 of 2 Complete'}
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                High-value treasury disbursements require secondary hardware token assertion before clearance.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Signer 1: Elena Vance */}
            <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-lg border border-surface-container-high">
              <img
                src={ELENA_VANCE_PORTRAIT}
                alt="Elena Vance"
                className="w-6 h-6 rounded-full object-cover"
              />
              <div className="flex flex-col text-xs">
                <span className="text-on-surface font-medium">Elena Vance</span>
                <span className="text-tertiary flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[10px]">check</span> Signed
                </span>
              </div>
            </div>

            {/* Signer 2: Marcus Reid */}
            <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-lg border border-surface-container-high">
              <img
                src={MARCUS_REID_PORTRAIT}
                alt="Marcus Reid"
                className="w-6 h-6 rounded-full object-cover"
              />
              <div className="flex flex-col text-xs">
                <span className="text-on-surface font-medium">Marcus Reid</span>
                {marcusReidSigned ? (
                  <span className="text-tertiary flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[10px]">check</span> Signed
                  </span>
                ) : (
                  <span className="text-secondary flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[10px] animate-spin">sync</span> Pending
                  </span>
                )}
              </div>
            </div>

            {!marcusReidSigned && (
              <button
                onClick={handleSignMarcusReid}
                className="px-3 py-1.5 rounded-lg bg-secondary-container hover:bg-secondary text-on-secondary-container font-label-sm text-xs font-semibold transition-all shadow-sm flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">key</span>
                <span>Sign as Reid</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Grid: Transfer Form (Left 7 Cols) and Rules/Limits (Right 5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Transfer Execution Form Container */}
          <div className="lg:col-span-7 bg-surface-container-low rounded-xl p-6 sm:p-8 shadow-xl flex flex-col gap-6 border border-surface-container-high/40">
            {/* Tab Rail Selector */}
            <div className="flex border-b border-surface-container-highest pb-2 gap-4">
              <button
                onClick={() => setActiveRail('domestic')}
                className={`flex items-center gap-2 pb-2 font-label-md text-label-md border-b-2 transition-all ${
                  activeRail === 'domestic'
                    ? 'border-primary text-primary font-semibold'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-lg">bolt</span>
                <span>Domestic Wire (FedNow / ACH)</span>
              </button>
              <button
                onClick={() => setActiveRail('internal')}
                className={`flex items-center gap-2 pb-2 font-label-md text-label-md border-b-2 transition-all ${
                  activeRail === 'internal'
                    ? 'border-primary text-primary font-semibold'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-lg">sync_alt</span>
                <span>Internal Book Transfer</span>
              </button>
              <button
                onClick={() => setActiveRail('international')}
                className={`flex items-center gap-2 pb-2 font-label-md text-label-md border-b-2 transition-all ${
                  activeRail === 'international'
                    ? 'border-primary text-primary font-semibold'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-lg">public</span>
                <span>International SWIFT / SEPA</span>
              </button>
            </div>

            {/* Source Account Picker */}
            <div className="flex flex-col gap-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                Source Treasury Account
              </label>
              <div className="p-4 rounded-xl bg-surface-container border border-surface-container-highest flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">account_balance</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                      Primary Operating Master USD · 8841
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant font-mono">
                      $2,420,100.00 Available
                    </span>
                  </div>
                </div>
                <span className="px-2 py-1 rounded bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold">
                  Primary Inflow Node
                </span>
              </div>
            </div>

            {/* Destination Selection */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Destination Beneficiary
                </label>
                <button
                  onClick={() => setBeneficiaryModalOpen(true)}
                  className="text-primary hover:underline font-label-sm text-label-sm flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  <span>Add Wire Beneficiary</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'JPMorgan Escrow FedNow', name: 'JPMorgan Escrow', sub: 'FedNow · 1042' },
                  { id: 'Cold Vault Alpha', name: 'Cold Vault Alpha', sub: 'Yield Escrow · $12.4M' },
                  { id: 'Stripe Treasury Pool', name: 'Stripe Treasury', sub: 'Corporate Outflows · 3391' },
                ].map((dest) => (
                  <div
                    key={dest.id}
                    onClick={() => setSelectedDestination(dest.id)}
                    className={`p-3 rounded-xl cursor-pointer border transition-all flex flex-col justify-between ${
                      selectedDestination === dest.id
                        ? 'bg-surface-container border-primary shadow-[0_0_12px_rgba(76,215,246,0.15)]'
                        : 'bg-surface-container-low border-surface-container-high hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-label-md text-label-md text-on-surface font-semibold truncate">
                        {dest.name}
                      </span>
                      <span
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          selectedDestination === dest.id
                            ? 'border-primary bg-primary'
                            : 'border-surface-container-highest'
                        }`}
                      >
                        {selectedDestination === dest.id && (
                          <span className="w-1.5 h-1.5 rounded-full bg-surface-container-lowest"></span>
                        )}
                      </span>
                    </div>
                    <span className="font-body-sm text-xs text-on-surface-variant mt-1 truncate">
                      {dest.sub}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Settlement Transfer Amount */}
            <div className="flex flex-col gap-2 p-5 rounded-xl bg-surface-container-lowest border border-surface-container-high">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Settlement Transfer Amount
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleQuickPercent(10)}
                    className="px-2.5 py-1 rounded bg-surface-container text-xs hover:text-primary transition-colors"
                  >
                    10%
                  </button>
                  <button
                    onClick={() => handleQuickPercent(25)}
                    className="px-2.5 py-1 rounded bg-surface-container text-xs hover:text-primary transition-colors"
                  >
                    25%
                  </button>
                  <button
                    onClick={() => handleQuickPercent(50)}
                    className="px-2.5 py-1 rounded bg-surface-container text-xs hover:text-primary transition-colors"
                  >
                    50%
                  </button>
                  <button
                    onClick={() => handleQuickPercent(100)}
                    className="px-2.5 py-1 rounded bg-surface-container text-xs text-primary font-bold transition-colors"
                  >
                    Max
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 py-2">
                <span className="font-num-metric-lg text-3xl text-primary font-bold">$</span>
                <input
                  type="text"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  className="bg-transparent font-num-metric-lg text-3xl text-on-surface outline-none w-full tracking-tight"
                />
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container border border-surface-container-high shrink-0">
                  <img src={US_TREASURY_FLAG} alt="USD" className="w-5 h-5 rounded-full object-cover" />
                  <span className="font-label-md text-sm font-bold text-on-surface">USD</span>
                </div>
              </div>

              {/* Execution Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3 border-t border-surface-container-high/40 text-xs">
                <div>
                  <span className="text-on-surface-variant">Execution Fee: </span>
                  <span className="text-tertiary font-semibold">$0.00 (Sponsored)</span>
                </div>
                <div>
                  <span className="text-on-surface-variant">Estimated Arrival: </span>
                  <span className="text-primary font-semibold">&lt; 4s via FedNow</span>
                </div>
                <div>
                  <span className="text-on-surface-variant">FX Rate Spread: </span>
                  <span className="text-on-surface font-semibold">0.000% (Direct Fed)</span>
                </div>
              </div>
            </div>

            {/* Memo & Tagging */}
            <div className="flex flex-col gap-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                Settlement Memo &amp; Reference
              </label>
              <input
                type="text"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="Enter internal ledger note or invoice reference"
                className="w-full bg-surface-container text-on-surface font-body-sm text-body-sm px-4 py-2.5 rounded-lg border border-surface-container-highest focus:outline-none focus:border-primary transition-colors"
              />

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-xs border border-surface-container-highest"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => setTags(tags.filter((t) => t !== tag))}
                      className="hover:text-error"
                    >
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </span>
                ))}
                {showTagInput ? (
                  <div className="inline-flex items-center gap-1">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                      placeholder="tag"
                      className="bg-surface-container text-xs px-2 py-0.5 rounded border border-primary outline-none w-24"
                      autoFocus
                    />
                    <button
                      onClick={handleAddTag}
                      className="text-xs text-primary hover:underline"
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowTagInput(true)}
                    className="text-xs text-primary hover:underline flex items-center gap-0.5"
                  >
                    <span className="material-symbols-outlined text-xs">add</span>
                    <span>Tag</span>
                  </button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-surface-container-high/40">
              <button
                onClick={() => onTriggerToast('Wire scheduled for designated calendar release.', 'Scheduled')}
                className="px-5 py-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors border border-surface-container-highest"
              >
                Schedule for Later
              </button>
              <button
                onClick={handleExecuteWire}
                disabled={isExecuting}
                className="flex-1 py-3 rounded-lg bg-primary-container hover:bg-primary text-on-primary-container font-headline-sm text-headline-sm transition-all shadow-[0_0_16px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2"
              >
                {isExecuting ? (
                  <>
                    <span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>
                    <span>Broadcasting to FedNow RTGS...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-xl">send</span>
                    <span>Execute FedNow Wire (${amountStr})</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Counterparty Limits & Scheduled Sweeps */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Counterparty Velocity Limits */}
            <div className="p-6 rounded-xl bg-surface-container-low shadow-xl flex flex-col gap-5 border border-surface-container-high/40">
              <div className="flex items-center justify-between">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  Counterparty Velocity Limits
                </h3>
                <span className="font-label-sm text-label-sm text-primary">Live Quota</span>
              </div>

              {/* Progress 1 */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-on-surface font-medium">FedNow Instant Limit ($10.0M Daily)</span>
                  <span className="text-tertiary font-mono font-semibold">$3,450,000 / $10.0M (34.5%)</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '34.5%' }}></div>
                </div>
              </div>

              {/* Progress 2 */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-on-surface font-medium">SEPA Instant Euro Clearing (€5.0M Daily)</span>
                  <span className="text-secondary font-mono font-semibold">€820,000 / €5.0M (16.4%)</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                  <div className="bg-secondary h-2 rounded-full" style={{ width: '16.4%' }}></div>
                </div>
              </div>
            </div>

            {/* Scheduled & Recurring Treasury Sweeps */}
            <div className="p-6 rounded-xl bg-surface-container-low shadow-xl flex flex-col gap-5 border border-surface-container-high/40">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">
                    Scheduled Treasury Sweeps
                  </h3>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Autonomous rule-based rebalancing
                  </span>
                </div>
                <button
                  onClick={() => setSweepModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-sm text-label-sm border border-surface-container-highest flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  <span>New Rule</span>
                </button>
              </div>

              {/* Sweeps list */}
              <div className="flex flex-col gap-3">
                {sweeps.map((swp) => (
                  <div
                    key={swp.id}
                    className="p-3.5 rounded-xl bg-surface-container border border-surface-container-high/40 flex flex-col gap-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-primary font-semibold">
                          {swp.code}
                        </span>
                        <span className="font-label-md text-label-md text-on-surface font-semibold">
                          {swp.name}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          onToggleSweepStatus(swp.id);
                          onTriggerToast(
                            `Sweep rule ${swp.code} is now ${swp.status === 'Active' ? 'Paused' : 'Active'}`,
                            swp.status === 'Active' ? 'Rule Paused' : 'Rule Resumed'
                          );
                        }}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                          swp.status === 'Active'
                            ? 'bg-tertiary/20 text-tertiary hover:bg-tertiary/30'
                            : 'bg-surface-container-highest text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        {swp.status}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs text-on-surface-variant">
                      <span className="truncate max-w-[200px]">{swp.targetCounterparty}</span>
                      <span className="font-mono font-semibold text-on-surface">{swp.volume}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-on-surface-variant/80 border-t border-surface-container-high/30 pt-1.5">
                      <span>{swp.frequency}</span>
                      <span className="font-mono text-primary">{swp.rails}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add Beneficiary */}
      {beneficiaryModalOpen && (
        <div className="fixed inset-0 bg-surface-container-lowest/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveBeneficiary}
            className="bg-surface-container-low max-w-md w-full rounded-2xl p-6 shadow-2xl border border-primary/20 flex flex-col gap-4 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Add Wire Beneficiary
              </h3>
              <button
                type="button"
                onClick={() => setBeneficiaryModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-on-surface-variant uppercase">Legal Entity Name</label>
              <input
                type="text"
                required
                value={newBenName}
                onChange={(e) => setNewBenName(e.target.value)}
                placeholder="e.g. Goldman Sachs Asset Custody"
                className="bg-surface-container border border-surface-container-highest px-3 py-2 rounded-lg text-sm text-on-surface outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-on-surface-variant uppercase">ABA Routing / Fedwire Transit</label>
              <input
                type="text"
                value={newBenRouting}
                onChange={(e) => setNewBenRouting(e.target.value)}
                placeholder="9-digit routing transit"
                className="bg-surface-container border border-surface-container-highest px-3 py-2 rounded-lg text-sm text-on-surface outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-on-surface-variant uppercase">Account Number / IBAN</label>
              <input
                type="text"
                value={newBenAccount}
                onChange={(e) => setNewBenAccount(e.target.value)}
                placeholder="Beneficiary Account Number"
                className="bg-surface-container border border-surface-container-highest px-3 py-2 rounded-lg text-sm text-on-surface outline-none focus:border-primary"
              />
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setBeneficiaryModalOpen(false)}
                className="flex-1 py-2.5 rounded-lg bg-surface-container text-on-surface text-sm hover:bg-surface-container-high transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-lg bg-primary-container text-on-primary-container text-sm font-semibold hover:bg-primary transition-all shadow-md"
              >
                Save &amp; Whitelist
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: New Sweep Rule */}
      {sweepModalOpen && (
        <div className="fixed inset-0 bg-surface-container-lowest/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateSweep}
            className="bg-surface-container-low max-w-md w-full rounded-2xl p-6 shadow-2xl border border-primary/20 flex flex-col gap-4 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Create Treasury Sweep Rule
              </h3>
              <button
                type="button"
                onClick={() => setSweepModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-on-surface-variant uppercase">Rule Description</label>
              <input
                type="text"
                required
                value={sweepRuleName}
                onChange={(e) => setSweepRuleName(e.target.value)}
                placeholder="e.g. End of Month Profit Sweep"
                className="bg-surface-container border border-surface-container-highest px-3 py-2 rounded-lg text-sm text-on-surface outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-on-surface-variant uppercase">Target Vault / Account</label>
              <input
                type="text"
                value={sweepTarget}
                onChange={(e) => setSweepTarget(e.target.value)}
                placeholder="e.g. High-Yield Sovereign Vault"
                className="bg-surface-container border border-surface-container-highest px-3 py-2 rounded-lg text-sm text-on-surface outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-on-surface-variant uppercase">Frequency</label>
                <select
                  value={sweepFreq}
                  onChange={(e) => setSweepFreq(e.target.value)}
                  className="bg-surface-container border border-surface-container-highest px-3 py-2 rounded-lg text-sm text-on-surface outline-none"
                >
                  <option value="Daily (21:00 UTC)">Daily (21:00 UTC)</option>
                  <option value="Weekly (Fridays)">Weekly (Fridays)</option>
                  <option value="Bi-Weekly">Bi-Weekly</option>
                  <option value="Monthly (1st of month)">Monthly (1st)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-on-surface-variant uppercase">Sweep Amount ($)</label>
                <input
                  type="text"
                  value={sweepAmount}
                  onChange={(e) => setSweepAmount(e.target.value)}
                  className="bg-surface-container border border-surface-container-highest px-3 py-2 rounded-lg text-sm text-on-surface outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setSweepModalOpen(false)}
                className="flex-1 py-2.5 rounded-lg bg-surface-container text-on-surface text-sm hover:bg-surface-container-high transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-lg bg-primary-container text-on-primary-container text-sm font-semibold hover:bg-primary transition-all shadow-md"
              >
                Schedule Rule
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
