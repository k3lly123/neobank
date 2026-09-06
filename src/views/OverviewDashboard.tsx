import React, { useState } from 'react';
import { Transaction, SubAccount, NavigationPath } from '../types';

interface OverviewDashboardProps {
  transactions: Transaction[];
  subAccounts: SubAccount[];
  onNavigate: (path: NavigationPath) => void;
  onOpenTransfer: () => void;
  onTriggerToast: (msg: string, title?: string, icon?: string) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  transactions,
  subAccounts,
  onNavigate,
  onOpenTransfer,
  onTriggerToast,
}) => {
  const [activeTimeframe, setActiveTimeframe] = useState<'30D' | '90D' | 'YTD'>('30D');
  const [card1Frozen, setCard1Frozen] = useState(false);
  const [inspectTx, setInspectTx] = useState<Transaction | null>(null);

  // Timeframe values
  const timeframeMetrics = {
    '30D': { inbound: '+$842,100.00', outflow: '-$289,340.20', retention: '+$552,759.80', peak: '$42,900' },
    '90D': { inbound: '+$2,640,300.00', outflow: '-$910,240.50', retention: '+$1,730,059.50', peak: '$68,400' },
    'YTD': { inbound: '+$9,850,200.00', outflow: '-$3,420,100.00', retention: '+$6,430,100.00', peak: '$112,000' },
  };

  const currentMetrics = timeframeMetrics[activeTimeframe];

  return (
    <div className="flex flex-col w-full">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col gap-6 sm:gap-8">
        {/* Compliance & Security Status Ticker */}
        <div className="w-full bg-surface-container-low rounded-xl px-4 sm:px-5 py-3 shadow-md flex flex-wrap items-center justify-between gap-4 border border-surface-container-high/40">
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-ping"></span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                Sovereign Protocol:
              </span>
              <span className="font-label-md text-label-md text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-base fill">
                  verified_user
                </span>
                FDIC Insured to $5.0M via Partner Network
              </span>
            </div>
            <div className="hidden md:block w-px h-4 bg-surface-container-highest"></div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary text-base">bolt</span>
              <span className="font-label-md text-label-md text-on-surface">
                FedNow Instant Settlement Active (Sub-300ms)
              </span>
            </div>
            <div className="hidden lg:block w-px h-4 bg-surface-container-highest"></div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-base">key</span>
              <span className="font-label-md text-label-md text-on-surface-variant">
                2FA FIDO2/Hardware Keys Enforced
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
              Global Node
            </span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-num-metric-sm text-num-metric-sm border border-primary/20">
              US-EAST-VA
            </span>
          </div>
        </div>

        {/* Executive Balance Hero & Multi-Currency Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Balance Core (8 Columns) */}
          <div className="lg:col-span-8 bg-surface-container-low rounded-xl p-6 sm:p-8 relative overflow-hidden shadow-xl flex flex-col justify-between border border-surface-container-high/40">
            <div className="absolute -right-16 -top-16 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -left-20 bottom-0 w-80 h-80 bg-tertiary/5 rounded-full blur-3xl pointer-events-none"></div>

            <div>
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Consolidated Sovereign Liquidity
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-primary font-label-sm text-label-sm border border-primary/20">
                    Live Automated Sweep
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary/15 text-tertiary border border-tertiary/20">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  <span className="font-label-sm text-label-sm font-semibold">+14.2% MoM</span>
                </div>
              </div>

              <div className="flex flex-wrap items-baseline gap-4 mb-4">
                <h1 className="font-display-xl text-on-surface tracking-tight leading-none">
                  $4,892,410.50
                </h1>
                <span className="font-headline-sm text-headline-sm text-on-surface-variant">
                  USD
                </span>
              </div>

              {/* Yield & Treasury Breakdown Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-lg bg-surface-container border border-surface-container-high/40 shadow-inner">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                    Current Yield APY
                  </span>
                  <span className="font-headline-sm text-headline-sm text-tertiary flex items-center gap-1 mt-0.5">
                    4.85% <span className="material-symbols-outlined text-sm">auto_graph</span>
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Treasury sweeps daily
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                    Yield Generated (MTD)
                  </span>
                  <span className="font-headline-sm text-headline-sm text-on-surface mt-0.5">
                    +$18,942.30
                  </span>
                  <span className="font-body-sm text-body-sm text-tertiary">
                    +2.4% vs last mo
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                    Collateralization Tier
                  </span>
                  <span className="font-headline-sm text-headline-sm text-primary mt-0.5">
                    Sovereign 1-A
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    100% US T-Bills Backed
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Bar */}
            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-surface-container-high/30">
              <button
                onClick={onOpenTransfer}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-container text-on-primary-container font-label-md text-label-md hover:bg-primary transition-all shadow-md active:scale-95"
              >
                <span className="material-symbols-outlined text-lg">payments</span>
                <span>Send Wire / ACH</span>
              </button>
              <button
                onClick={() => onTriggerToast('Deposit routing: Wire routing #021000021, Account #884100912', 'Deposit Information')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-all shadow-sm border border-surface-container-highest"
              >
                <span className="material-symbols-outlined text-lg">add_circle</span>
                <span>Deposit Funds</span>
              </button>
              <button
                onClick={() => onNavigate('cards-and-virtual-issuance')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-all shadow-sm border border-surface-container-highest"
              >
                <span className="material-symbols-outlined text-lg">add_card</span>
                <span>Issue New Virtual Card</span>
              </button>
              <button
                onClick={() => onTriggerToast('Generating official monthly sovereign audited statement PDF...', 'Export Statement')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all shadow-sm border border-surface-container-highest sm:ml-auto"
              >
                <span className="material-symbols-outlined text-lg">download</span>
                <span>Export Monthly Statement</span>
              </button>
            </div>
          </div>

          {/* Sub-Accounts Split List (4 Columns) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {subAccounts.map((acc) => (
              <div
                key={acc.id}
                onClick={() => onNavigate('transactions-and-ledgers')}
                className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all shadow-sm flex items-center justify-between cursor-pointer border border-surface-container-high/40 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-xl">{acc.icon}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">
                      {acc.name}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                      {acc.accountNumber}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col text-right">
                  <span className="font-num-metric-sm text-num-metric-sm text-on-surface">
                    {acc.balanceFormatted}
                  </span>
                  <span className="font-label-sm text-label-sm text-tertiary">{acc.subtext}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics & Live Virtual Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Cashflow Velocity & Net Inflow (7 Columns) */}
          <div className="lg:col-span-7 bg-surface-container-low rounded-xl p-6 shadow-xl flex flex-col gap-6 border border-surface-container-high/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-col">
                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                  Cashflow Velocity &amp; Net Inflow
                </h2>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Weekly intervals with 30-day trailing settlement data
                </span>
              </div>
              <div className="flex items-center gap-1 p-1 bg-surface-container rounded-lg border border-surface-container-high/40 self-start sm:self-auto">
                {(['30D', '90D', 'YTD'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setActiveTimeframe(period)}
                    className={`px-2.5 py-1 rounded font-label-sm text-label-sm transition-colors ${
                      activeTimeframe === period
                        ? 'bg-surface-container-highest text-on-surface font-semibold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Metric micro-strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-surface-container rounded-lg border border-surface-container-high/30">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  Total Inbound
                </span>
                <p className="font-num-metric-sm text-num-metric-sm text-tertiary mt-1">
                  {currentMetrics.inbound}
                </p>
              </div>
              <div className="p-3 bg-surface-container rounded-lg border border-surface-container-high/30">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  Total Outflow
                </span>
                <p className="font-num-metric-sm text-num-metric-sm text-error mt-1">
                  {currentMetrics.outflow}
                </p>
              </div>
              <div className="p-3 bg-surface-container rounded-lg border border-surface-container-high/30">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  Net Retention
                </span>
                <p className="font-num-metric-sm text-num-metric-sm text-primary mt-1">
                  {currentMetrics.retention}
                </p>
              </div>
            </div>

            {/* Cashflow SVG Data Chart */}
            <div className="w-full relative">
              <div className="flex flex-wrap justify-between items-center text-on-surface-variant font-label-sm text-label-sm mb-2 gap-2">
                <span>Peak Day Burn: {currentMetrics.peak}</span>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-tertiary"></span> Inflow
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-error/70"></span> Outflow
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-0.5 bg-primary"></span> Net Trajectory
                  </span>
                </div>
              </div>

              <div className="w-full overflow-hidden">
                <svg
                  className="w-full h-56 overflow-visible"
                  fill="none"
                  viewBox="0 0 600 200"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="chartGradOverview" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#4cd7f6" stopOpacity="0.25"></stop>
                      <stop offset="100%" stopColor="#4cd7f6" stopOpacity="0.0"></stop>
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  <line stroke="#262a35" strokeDasharray="3 3" x1="0" x2="600" y1="30" y2="30"></line>
                  <line stroke="#262a35" strokeDasharray="3 3" x1="0" x2="600" y1="80" y2="80"></line>
                  <line stroke="#262a35" strokeDasharray="3 3" x1="0" x2="600" y1="130" y2="130"></line>
                  <line stroke="#313540" x1="0" x2="600" y1="180" y2="180"></line>

                  {/* Weekly Inflow / Outflow Bar Pairs */}
                  {/* Week 1 */}
                  <rect fill="#1bbd85" height="110" opacity="0.8" rx="3" width="16" x="40" y="70"></rect>
                  <rect fill="#ffb4ab" height="60" opacity="0.45" rx="3" width="16" x="60" y="120"></rect>
                  {/* Week 2 */}
                  <rect fill="#1bbd85" height="130" opacity="0.8" rx="3" width="16" x="160" y="50"></rect>
                  <rect fill="#ffb4ab" height="70" opacity="0.45" rx="3" width="16" x="180" y="110"></rect>
                  {/* Week 3 */}
                  <rect fill="#1bbd85" height="145" opacity="0.8" rx="3" width="16" x="280" y="35"></rect>
                  <rect fill="#ffb4ab" height="85" opacity="0.45" rx="3" width="16" x="300" y="95"></rect>
                  {/* Week 4 */}
                  <rect fill="#1bbd85" height="120" opacity="0.8" rx="3" width="16" x="400" y="60"></rect>
                  <rect fill="#ffb4ab" height="50" opacity="0.45" rx="3" width="16" x="420" y="130"></rect>
                  {/* Week 5 (Current) */}
                  <rect fill="#1bbd85" height="155" rx="3" width="16" x="520" y="25"></rect>
                  <rect fill="#ffb4ab" height="75" opacity="0.45" rx="3" width="16" x="540" y="105"></rect>

                  {/* Smooth Net Liquidity Curve */}
                  <path
                    d="M 48 100 Q 170 80, 290 60 T 530 40"
                    fill="none"
                    stroke="#4cd7f6"
                    strokeLinecap="round"
                    strokeWidth="3"
                  ></path>
                  <path
                    d="M 48 100 Q 170 80, 290 60 T 530 40 L 530 180 L 48 180 Z"
                    fill="url(#chartGradOverview)"
                  ></path>

                  {/* Data anchor markers */}
                  <circle cx="290" cy="60" fill="#0f131d" r="4" stroke="#4cd7f6" strokeWidth="2"></circle>
                  <circle cx="530" cy="40" fill="#4cd7f6" r="5"></circle>
                </svg>
              </div>

              <div className="flex justify-between items-center text-on-surface-variant font-label-sm text-label-sm mt-2 px-2 sm:px-6">
                <span>May 01 - 07</span>
                <span>May 08 - 14</span>
                <span>May 15 - 21</span>
                <span>May 22 - 28</span>
                <span className="text-primary font-semibold">May 29 - Jun 04 (Current)</span>
              </div>
            </div>
          </div>

          {/* Live Commercial Cards Preview Widget (5 Columns) */}
          <div className="lg:col-span-5 bg-surface-container-low rounded-xl p-6 shadow-xl flex flex-col gap-6 border border-surface-container-high/40">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                  Live Commercial Cards
                </h2>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Instant freeze, limit adjustments &amp; tokenization
                </span>
              </div>
              <button
                onClick={() => onNavigate('cards-and-virtual-issuance')}
                className="p-2 rounded-lg bg-surface-container text-primary hover:bg-surface-container-high transition-colors border border-surface-container-highest"
                title="Manage Fleet Studio"
              >
                <span className="material-symbols-outlined text-xl">tune</span>
              </button>
            </div>

            {/* Virtual Card 1: Platinum Master Tier */}
            <div className="relative w-full rounded-2xl p-6 text-on-surface overflow-hidden shadow-2xl bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-lowest flex flex-col justify-between h-52 border border-surface-container-highest">
              {/* Card Decorative Ambient Light */}
              <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-primary/20 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-2xl">contactless</span>
                  <span className="font-headline-sm text-headline-sm tracking-widest uppercase font-bold">
                    APEX
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-surface-container-lowest/70 backdrop-blur px-2.5 py-1 rounded-full border border-surface-container-high">
                  <span className={`w-2 h-2 rounded-full ${card1Frozen ? 'bg-error' : 'bg-tertiary'}`}></span>
                  <span className="font-label-sm text-label-sm text-on-surface">
                    {card1Frozen ? 'Suspended · Frozen' : 'Active · Cloud Infra'}
                  </span>
                </div>
              </div>

              <div className="relative z-10 flex items-center gap-3">
                <div className="w-9 h-7 rounded bg-amber-400/80 shadow-inner flex items-center justify-center">
                  <div className="w-6 h-4 border border-black/40 rounded-sm"></div>
                </div>
                <span className="font-mono text-body-lg text-on-surface tracking-widest">
                  •••• •••• •••• 9012
                </span>
              </div>

              <div className="flex items-end justify-between relative z-10">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Cardholder
                  </span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">
                    MARCUS VANCE · EXEC
                  </span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Daily Remaining
                  </span>
                  <span className="font-num-metric-sm text-num-metric-sm text-primary font-bold">
                    $18,450 / $25,000
                  </span>
                </div>
              </div>
            </div>

            {/* Card 1 Controls and Quick Progress */}
            <div className="flex flex-col gap-2 -mt-2">
              <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden border border-surface-container-high">
                <div className="bg-primary h-2 rounded-full" style={{ width: '73.8%' }}></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Used: $6,550.00 today
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const next = !card1Frozen;
                      setCard1Frozen(next);
                      onTriggerToast(
                        next ? 'Apex Fleet card •••• 9012 suspended' : 'Apex Fleet card •••• 9012 restored',
                        next ? 'Card Frozen' : 'Card Active',
                        next ? 'ac_unit' : 'check_circle'
                      );
                    }}
                    className={`px-3 py-1 rounded font-label-sm text-label-sm transition-colors border ${
                      card1Frozen
                        ? 'bg-error/20 text-error border-error/40'
                        : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest border-surface-container-highest'
                    }`}
                  >
                    {card1Frozen ? 'Unfreeze' : 'Freeze'}
                  </button>
                  <button
                    onClick={() => onNavigate('cards-and-virtual-issuance')}
                    className="px-3 py-1 rounded bg-surface-container-high text-primary font-label-sm text-label-sm hover:bg-surface-container-highest transition-colors border border-surface-container-highest"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>

            {/* Virtual Card 2: Micro Secondary Stack */}
            <div className="p-4 rounded-xl bg-surface-container flex items-center justify-between shadow-sm border border-surface-container-high/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-xl">credit_card</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                      Growth Marketing Pool
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-surface-container-lowest text-on-surface-variant font-label-sm text-label-sm font-mono">
                      •••• 3481
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Limit: $10,000 / day · Google &amp; Meta Ads
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-num-metric-sm text-num-metric-sm text-tertiary">
                  $4,120 left
                </span>
                <button
                  onClick={() => onNavigate('cards-and-virtual-issuance')}
                  className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">more_vert</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Stream with Drawer Trigger */}
        <div className="w-full bg-surface-container-low rounded-xl p-6 shadow-xl flex flex-col gap-5 border border-surface-container-high/40">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">
                Institutional Transaction Ledger
              </h2>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Real-time synchronized across SWIFT, FedNow, and ACH pipelines
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('transactions-and-ledgers')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-sm text-label-sm border border-surface-container-highest"
              >
                <span className="material-symbols-outlined text-on-surface-variant text-base">filter_list</span>
                <span>All Ledgers</span>
              </button>
              <button
                onClick={() => onTriggerToast('Exporting encrypted institutional CSV transaction log...', 'Ledger Export')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high text-primary font-label-sm text-label-sm hover:bg-surface-container-highest transition-colors border border-surface-container-highest"
              >
                <span className="material-symbols-outlined text-base">receipt</span>
                <span>Download Audit CSV</span>
              </button>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider border-b border-surface-container-highest pb-3">
                  <th className="pb-3 pl-2">Counterparty / Description</th>
                  <th className="pb-3">Type &amp; Channel</th>
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Amount (USD)</th>
                  <th className="pb-3 text-right pr-2">Receipt &amp; Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container/60 font-body-sm text-body-sm">
                {transactions.slice(0, 5).map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => setInspectTx(tx)}
                    className="hover:bg-surface-container/40 transition-colors group cursor-pointer"
                  >
                    <td className="py-4 pl-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-container/20 text-primary flex items-center justify-center font-bold font-headline-sm">
                          {tx.counterparty.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-md text-label-md text-on-surface font-semibold group-hover:text-primary transition-colors">
                            {tx.counterparty}
                          </span>
                          <span className="font-label-sm text-label-sm text-on-surface-variant">
                            {tx.description}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm border border-surface-container-high">
                        {tx.channel}
                      </span>
                    </td>
                    <td className="py-4 text-on-surface-variant font-mono text-label-sm">
                      {tx.date}, {tx.time}
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm ${
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
                    <td className="py-4 text-right font-num-metric-sm text-num-metric-sm">
                      <span className={tx.isPositive ? 'text-tertiary font-bold' : 'text-on-surface'}>
                        {tx.isPositive ? '+' : ''}
                        ${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="py-4 text-right pr-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectTx(tx);
                        }}
                        className="px-3 py-1 rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface font-label-sm text-label-sm transition-all inline-flex items-center gap-1 border border-surface-container-highest"
                      >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Editorial Trust & Visual Polish Bar */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 pb-6">
          <div className="p-6 rounded-xl bg-surface-container-low shadow-md flex items-center gap-4 border border-surface-container-high/40">
            <div className="w-12 h-12 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">shield_locked</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-surface font-semibold">
                Enterprise Grade Security
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Multi-sig authorizations with dynamic transaction signing thresholds.
              </span>
            </div>
          </div>
          <div className="p-6 rounded-xl bg-surface-container-low shadow-md flex items-center gap-4 border border-surface-container-high/40">
            <div className="w-12 h-12 rounded-xl bg-tertiary/15 text-tertiary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">sync_saved_locally</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-surface font-semibold">
                ERP Ledger Integration
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Automatic mapping to NetSuite, QuickBooks, and Workday Financials.
              </span>
            </div>
          </div>
          <div className="p-6 rounded-xl bg-surface-container-low shadow-md flex items-center gap-4 border border-surface-container-high/40">
            <div className="w-12 h-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">support_agent</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-surface font-semibold">
                Dedicated Sovereign Banker
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Direct line to Marcus Eldridge (London Desk) for cross-border wires.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Receipt Inspection Modal */}
      {inspectTx && (
        <div
          className="fixed inset-0 bg-surface-container-lowest/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setInspectTx(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-surface-container-low border border-surface-container-highest rounded-2xl w-full max-w-lg p-6 shadow-2xl flex flex-col gap-6 relative animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-4 border-b border-surface-container">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">receipt_long</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">
                    Cryptographic Proof of Settlement
                  </h3>
                  <span className="font-mono text-label-sm text-on-surface-variant">
                    TX-ID: {inspectTx.traceId}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setInspectTx(null)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <div className="flex flex-col items-center py-2 text-center">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                Settled Amount
              </span>
              <span
                className={`font-display-xl-mobile font-bold tracking-tight ${
                  inspectTx.isPositive ? 'text-tertiary' : 'text-on-surface'
                }`}
              >
                {inspectTx.isPositive ? '+' : ''}$
                {Math.abs(inspectTx.amount).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2.5 py-0.5 rounded-full bg-tertiary/15 text-tertiary font-label-sm text-label-sm">
                  {inspectTx.status}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  {inspectTx.category}
                </span>
              </div>
            </div>

            <div className="bg-surface-container rounded-xl p-4 flex flex-col gap-3 font-body-sm text-body-sm border border-surface-container-high/40">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Counterparty</span>
                <span className="text-on-surface font-semibold">{inspectTx.counterparty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Ledger Hash</span>
                <span className="font-mono text-primary truncate max-w-[200px] select-all">
                  {inspectTx.ledgerHash}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Origin Counterparty</span>
                <span className="text-on-surface font-medium">{inspectTx.originParty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Clearing Protocol</span>
                <span className="text-on-surface">{inspectTx.clearingProtocol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Network Fee</span>
                <span className="text-on-surface font-mono">{inspectTx.networkFee}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setInspectTx(null)}
                className="flex-1 py-2.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high font-label-md text-label-md transition-all border border-surface-container-highest"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  onTriggerToast('Cryptographic PDF receipt downloaded with SHA-256 seal.', 'Download Complete');
                  setInspectTx(null);
                }}
                className="flex-1 py-2.5 rounded-lg bg-primary-container text-on-primary-container font-label-md text-label-md hover:bg-primary transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <span className="material-symbols-outlined text-lg">download</span>
                <span>Download Proof</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
