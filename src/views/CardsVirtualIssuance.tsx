import React, { useState } from 'react';
import { VirtualCard } from '../types';

interface CardsVirtualIssuanceProps {
  cards: VirtualCard[];
  onToggleFreeze: (cardId: string) => void;
  onUpdateCardLimit: (cardId: string, newLimit: number) => void;
  onCreateCard: (card: VirtualCard) => void;
  onTriggerToast: (msg: string, title?: string, icon?: string) => void;
}

export const CardsVirtualIssuance: React.FC<CardsVirtualIssuanceProps> = ({
  cards,
  onToggleFreeze,
  onUpdateCardLimit,
  onCreateCard,
  onTriggerToast,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'SaaS & Ops' | 'Marketing' | 'Single-use'>('All');
  const [revealedCvvs, setRevealedCvvs] = useState<Record<string, boolean>>({});

  // Card Generator Form State
  const [genNickname, setGenNickname] = useState('OpenAI API & Anthropic Cluster');
  const [genNetwork, setGenNetwork] = useState<'visa' | 'mastercard'>('visa');
  const [genSpendType, setGenSpendType] = useState<'monthly' | 'daily' | 'single'>('monthly');
  const [genLimit, setGenLimit] = useState(25000);
  const [genCustodian, setGenCustodian] = useState('DevOps / SRE Core');
  const [genAutoFreeze, setGenAutoFreeze] = useState(false);
  const [genMccCloud, setGenMccCloud] = useState(true);
  const [genMccAds, setGenMccAds] = useState(false);
  const [genMccTravel, setGenMccTravel] = useState(false);

  // Limit Adjustment Modal
  const [limitModalCard, setLimitModalCard] = useState<VirtualCard | null>(null);
  const [limitModalValue, setLimitModalValue] = useState<number>(0);

  const toggleCvv = (id: string) => {
    setRevealedCvvs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    onTriggerToast(`Copied ${label} to clipboard.`, 'Copied', 'content_copy');
  };

  const handleIssueCard = (e: React.FormEvent) => {
    e.preventDefault();
    const lastFour = Math.floor(1000 + Math.random() * 9000).toString();
    const prefix = genNetwork === 'visa' ? '4111' : '5421';
    const fullNumber = `${prefix} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${lastFour}`;
    const expiry = '12/28';
    const cvv = Math.floor(100 + Math.random() * 900).toString();

    const newCard: VirtualCard = {
      id: `card-${Date.now()}`,
      name: genNickname || 'Enterprise Virtual Node',
      lastFour,
      fullNumber,
      expiry,
      cvv,
      tier: genSpendType === 'single' ? 'Burn Token' : genNetwork === 'visa' ? 'Infinite' : 'World Elite',
      network: genNetwork,
      monthlyCap: genLimit,
      spent: 0,
      lead: genCustodian,
      status: genSpendType === 'single' ? 'Burn Token' : 'Active',
      colorScheme: genNetwork === 'visa' ? 'primary' : 'secondary',
      singleUse: genSpendType === 'single',
      validHours: genSpendType === 'single' ? 48 : undefined,
      autoFreezeOnSwipe: genAutoFreeze,
      mccAllowed: [
        ...(genMccCloud ? ['Cloud Software & SaaS'] : []),
        ...(genMccAds ? ['Advertising & Media'] : []),
        ...(genMccTravel ? ['Airlines & Lodging'] : []),
      ],
    };

    onCreateCard(newCard);
    onTriggerToast(
      `Tokenized ${genNetwork.toUpperCase()} card •••• ${lastFour} issued for $${genLimit.toLocaleString()} limit.`,
      'Card Minted & Ready',
      'credit_card'
    );
  };

  const filteredCards = cards.filter((c) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'SaaS & Ops') return c.name.toLowerCase().includes('aws') || c.name.toLowerCase().includes('openai') || c.name.toLowerCase().includes('datadog');
    if (selectedFilter === 'Marketing') return c.name.toLowerCase().includes('market') || c.name.toLowerCase().includes('ad');
    if (selectedFilter === 'Single-use') return c.singleUse || c.status === 'Burn Token';
    return true;
  });

  return (
    <div className="flex flex-col w-full">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col gap-6 sm:gap-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="font-headline-lg text-headline-lg text-on-surface">
                Virtual Issuance &amp; Fleet Studio
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-mono text-label-sm border border-primary/20">
                Core #VCS-8890
              </span>
            </div>
            <span className="font-body-md text-body-md text-on-surface-variant">
              Provision merchant-locked corporate cards, ephemeral burn tokens, and multi-currency credit nodes.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low border border-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
              <span className="w-2 h-2 rounded-full bg-tertiary"></span>
              <span>14 Active Fleet Nodes</span>
            </div>
            <span className="font-num-metric-sm text-num-metric-sm text-primary">
              Monthly Deployed: $142,500.00
            </span>
          </div>
        </div>

        {/* Metric Telemetry Micro-Bento */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high/40 shadow-sm flex flex-col">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
              Settled (30d)
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-headline-md text-headline-md text-on-surface">$108,340</span>
              <span className="font-label-sm text-xs text-tertiary">+8.4%</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high/40 shadow-sm flex flex-col">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
              Active Safeguards
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-headline-md text-headline-md text-primary">99.98%</span>
              <span className="font-label-sm text-xs text-on-surface-variant">No breaches</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high/40 shadow-sm flex flex-col">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
              Ephemeral Burn Tokens
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-headline-md text-headline-md text-tertiary">6 Deployed</span>
              <span className="font-label-sm text-xs text-on-surface-variant">48h TTL</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high/40 shadow-sm flex flex-col">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
              Total Credit Capacity
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-headline-md text-headline-md text-on-surface">$500,000</span>
              <span className="font-label-sm text-xs text-primary">Sovereign Tier</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Fleet Ledger (7 cols) and Real-Time Generator (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Portfolio Fleet Ledgers (Left 7 Columns) */}
          <div className="lg:col-span-7 bg-surface-container-low rounded-xl p-6 shadow-xl flex flex-col gap-6 border border-surface-container-high/40">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-container-highest pb-3">
              <div className="flex items-center gap-1.5 p-1 bg-surface-container rounded-lg">
                {(['All', 'SaaS & Ops', 'Marketing', 'Single-use'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedFilter(tab)}
                    className={`px-3 py-1 rounded font-label-sm text-label-sm transition-colors ${
                      selectedFilter === tab
                        ? 'bg-surface-container-highest text-on-surface font-semibold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <span className="font-body-sm text-xs text-on-surface-variant">
                Showing {filteredCards.length} of {cards.length} cards
              </span>
            </div>

            {/* Cards List */}
            <div className="flex flex-col gap-4">
              {filteredCards.map((card) => {
                const percentUsed = Math.min(100, Math.round((card.spent / card.monthlyCap) * 100));
                const isFrozen = card.status === 'Frozen';
                const showCvv = revealedCvvs[card.id];

                return (
                  <div
                    key={card.id}
                    className={`p-5 rounded-xl border transition-all flex flex-col gap-4 shadow-sm ${
                      isFrozen
                        ? 'bg-surface-container/30 border-error/30 opacity-70'
                        : 'bg-surface-container border-surface-container-high/60 hover:border-primary/40'
                    }`}
                  >
                    {/* Top row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs uppercase ${
                            card.network === 'visa'
                              ? 'bg-primary-container/30 text-primary'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {card.network}
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-headline-sm text-sm text-on-surface font-semibold">
                              {card.name}
                            </span>
                            <span className="font-mono text-xs text-primary font-semibold">
                              •••• {card.lastFour}
                            </span>
                          </div>
                          <span className="font-body-sm text-xs text-on-surface-variant">
                            Lead: {card.lead} · Tier: {card.tier}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {card.warningMessage && (
                          <span className="px-2 py-0.5 rounded bg-error/20 text-error font-label-sm text-[10px] font-bold">
                            {card.warningMessage}
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isFrozen
                              ? 'bg-error/20 text-error'
                              : card.singleUse
                              ? 'bg-secondary/20 text-secondary'
                              : 'bg-tertiary/20 text-tertiary'
                          }`}
                        >
                          {card.status}
                        </span>
                      </div>
                    </div>

                    {/* Spend cap progress bar */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-on-surface-variant">
                          Monthly Spend: ${card.spent.toLocaleString()} / ${card.monthlyCap.toLocaleString()}
                        </span>
                        <span
                          className={`font-mono font-semibold ${
                            percentUsed >= 90 ? 'text-error' : 'text-primary'
                          }`}
                        >
                          {percentUsed}% Used
                        </span>
                      </div>
                      <div className="w-full bg-surface-container-lowest rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            percentUsed >= 90 ? 'bg-error' : 'bg-primary'
                          }`}
                          style={{ width: `${percentUsed}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Interactive controls */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-surface-container-high/40 text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(card.fullNumber, 'Card Number')}
                          className="px-2.5 py-1 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center gap-1 transition-colors"
                        >
                          <span className="material-symbols-outlined text-xs">content_copy</span>
                          <span>Copy #</span>
                        </button>
                        <button
                          onClick={() => toggleCvv(card.id)}
                          className="px-2.5 py-1 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center gap-1 transition-colors"
                        >
                          <span className="material-symbols-outlined text-xs">
                            {showCvv ? 'visibility_off' : 'visibility'}
                          </span>
                          <span>{showCvv ? `CVV: ${card.cvv}` : 'Show CVV'}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setLimitModalCard(card);
                            setLimitModalValue(card.monthlyCap);
                          }}
                          className="px-2.5 py-1 rounded bg-surface-container-high hover:bg-surface-container-highest text-primary flex items-center gap-1 transition-colors"
                        >
                          <span className="material-symbols-outlined text-xs">tune</span>
                          <span>Limit</span>
                        </button>
                        <button
                          onClick={() => {
                            onToggleFreeze(card.id);
                            onTriggerToast(
                              isFrozen ? `Card •••• ${card.lastFour} activated` : `Card •••• ${card.lastFour} frozen`,
                              isFrozen ? 'Card Unfrozen' : 'Card Frozen'
                            );
                          }}
                          className={`px-3 py-1 rounded font-medium transition-colors ${
                            isFrozen
                              ? 'bg-primary text-on-primary font-bold'
                              : 'bg-surface-container-high hover:bg-error/20 hover:text-error text-on-surface'
                          }`}
                        >
                          {isFrozen ? 'Unfreeze' : 'Freeze'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Instant Programmatic Card Generator (Right 5 Columns) */}
          <div className="lg:col-span-5 bg-surface-container-low rounded-xl p-6 shadow-xl flex flex-col gap-6 border border-surface-container-high/40">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                  Card Minting Studio
                </h2>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Configure real-time spend limits &amp; merchant whitelists
                </span>
              </div>
              <span className="material-symbols-outlined text-primary text-2xl">magic_button</span>
            </div>

            {/* Live Real-time Morphing Card Preview */}
            <div className="relative w-full rounded-2xl p-6 text-on-surface overflow-hidden shadow-2xl bg-gradient-to-br from-[#1c2738] via-[#121927] to-[#0a0e18] flex flex-col justify-between h-56 border border-primary/30">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/20 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-2xl">contactless</span>
                  <span className="font-headline-sm text-headline-sm tracking-widest uppercase font-bold text-white">
                    APEX
                  </span>
                </div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                  {genSpendType === 'single' ? 'Ephemeral Burn' : `${genNetwork.toUpperCase()} Infinite`}
                </span>
              </div>

              <div className="relative z-10 flex items-center gap-3">
                <div className="w-10 h-7 rounded bg-amber-400/80 shadow-inner flex items-center justify-center">
                  <div className="w-7 h-4 border border-black/40 rounded-sm"></div>
                </div>
                <span className="font-mono text-base text-white tracking-widest truncate">
                  4111 •••• •••• 8892
                </span>
              </div>

              <div className="flex items-end justify-between relative z-10">
                <div className="flex flex-col truncate max-w-[180px]">
                  <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">
                    Allocation
                  </span>
                  <span className="font-label-md text-xs text-white font-semibold truncate">
                    {genNickname || 'Enterprise Card'}
                  </span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">
                    Limit Cap
                  </span>
                  <span className="font-num-metric-sm text-sm text-primary font-bold">
                    ${genLimit.toLocaleString()} USD
                  </span>
                </div>
              </div>
            </div>

            {/* Generator Form Controls */}
            <form onSubmit={handleIssueCard} className="flex flex-col gap-4">
              {/* Nickname */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider">
                  Card Nickname / Allocation Purpose
                </label>
                <input
                  type="text"
                  required
                  value={genNickname}
                  onChange={(e) => setGenNickname(e.target.value)}
                  placeholder="e.g. Stripe Tax Reserves"
                  className="bg-surface-container border border-surface-container-highest px-3.5 py-2 rounded-lg text-sm text-on-surface outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Payment Rail Network */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider">
                  Payment Rail Network
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGenNetwork('visa')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                      genNetwork === 'visa'
                        ? 'bg-primary-container/20 border-primary text-primary'
                        : 'bg-surface-container border-surface-container-highest text-on-surface-variant'
                    }`}
                  >
                    Visa Infinite
                  </button>
                  <button
                    type="button"
                    onClick={() => setGenNetwork('mastercard')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                      genNetwork === 'mastercard'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'bg-surface-container border-surface-container-highest text-on-surface-variant'
                    }`}
                  >
                    Mastercard World Elite
                  </button>
                </div>
              </div>

              {/* Spend Frequency */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider">
                  Spend Frequency &amp; Reset
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setGenSpendType('monthly')}
                    className={`py-2 rounded-lg border text-center transition-all ${
                      genSpendType === 'monthly'
                        ? 'bg-surface-container-highest border-primary text-on-surface font-semibold'
                        : 'bg-surface-container border-surface-container-highest text-on-surface-variant'
                    }`}
                  >
                    Monthly Cap
                  </button>
                  <button
                    type="button"
                    onClick={() => setGenSpendType('daily')}
                    className={`py-2 rounded-lg border text-center transition-all ${
                      genSpendType === 'daily'
                        ? 'bg-surface-container-highest border-primary text-on-surface font-semibold'
                        : 'bg-surface-container border-surface-container-highest text-on-surface-variant'
                    }`}
                  >
                    Daily Cap
                  </button>
                  <button
                    type="button"
                    onClick={() => setGenSpendType('single')}
                    className={`py-2 rounded-lg border text-center transition-all ${
                      genSpendType === 'single'
                        ? 'bg-secondary/20 border-secondary text-secondary font-semibold'
                        : 'bg-surface-container border-surface-container-highest text-on-surface-variant'
                    }`}
                  >
                    Single-Use Burn
                  </button>
                </div>
              </div>

              {/* Limit Slider */}
              <div className="flex flex-col gap-2 p-3.5 bg-surface-container rounded-xl border border-surface-container-highest">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant uppercase">Authorized Limit Cap</span>
                  <span className="font-num-metric-sm text-sm text-primary font-bold">
                    ${genLimit.toLocaleString()} USD
                  </span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={100000}
                  step={500}
                  value={genLimit}
                  onChange={(e) => setGenLimit(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-on-surface-variant">
                  <span>$500</span>
                  <span>$25,000</span>
                  <span>$50,000</span>
                  <span>$100,000</span>
                </div>
              </div>

              {/* Allowed MCC categories */}
              <div className="flex flex-col gap-2">
                <span className="text-xs text-on-surface-variant uppercase">Allowed Merchant Categories (MCC)</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setGenMccCloud(!genMccCloud)}
                    className={`px-3 py-1 rounded-full text-xs transition-colors border ${
                      genMccCloud
                        ? 'bg-primary/20 border-primary text-primary'
                        : 'bg-surface-container border-surface-container-highest text-on-surface-variant'
                    }`}
                  >
                    Cloud &amp; SaaS
                  </button>
                  <button
                    type="button"
                    onClick={() => setGenMccAds(!genMccAds)}
                    className={`px-3 py-1 rounded-full text-xs transition-colors border ${
                      genMccAds
                        ? 'bg-primary/20 border-primary text-primary'
                        : 'bg-surface-container border-surface-container-highest text-on-surface-variant'
                    }`}
                  >
                    Advertising &amp; Media
                  </button>
                  <button
                    type="button"
                    onClick={() => setGenMccTravel(!genMccTravel)}
                    className={`px-3 py-1 rounded-full text-xs transition-colors border ${
                      genMccTravel
                        ? 'bg-primary/20 border-primary text-primary'
                        : 'bg-surface-container border-surface-container-highest text-on-surface-variant'
                    }`}
                  >
                    Airlines &amp; Lodging
                  </button>
                </div>
              </div>

              {/* Custodian assignment & Auto-freeze switch */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-on-surface-variant uppercase">Cardholder / Custodian</label>
                  <select
                    value={genCustodian}
                    onChange={(e) => setGenCustodian(e.target.value)}
                    className="bg-surface-container border border-surface-container-highest text-xs text-on-surface px-2.5 py-1.5 rounded-lg outline-none"
                  >
                    <option value="Marcus Vance (Managing Partner)">Marcus Vance (Managing Partner)</option>
                    <option value="Elena Vance (Partner, CFO)">Elena Vance (Partner, CFO)</option>
                    <option value="DevOps / SRE Core">DevOps / SRE Core</option>
                    <option value="Sarah Lin (VP Growth)">Sarah Lin (VP Growth)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-xs text-on-surface">Auto-freeze after first swipe</span>
                  <input
                    type="checkbox"
                    checked={genAutoFreeze}
                    onChange={(e) => setGenAutoFreeze(e.target.checked)}
                    className="w-4 h-4 accent-primary rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-primary-container hover:bg-primary text-on-primary-container font-headline-sm text-headline-sm transition-all shadow-[0_0_16px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 mt-2"
              >
                <span className="material-symbols-outlined text-xl">token</span>
                <span>Issue &amp; Tokenize Card</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Adjust Limit Modal */}
      {limitModalCard && (
        <div className="fixed inset-0 bg-surface-container-lowest/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-low max-w-sm w-full rounded-2xl p-6 shadow-2xl border border-primary/20 flex flex-col gap-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Adjust Spend Limit
              </h3>
              <button
                onClick={() => setLimitModalCard(null)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <span className="text-xs text-on-surface-variant">
              Update monthly authorization threshold for {limitModalCard.name} (•••• {limitModalCard.lastFour})
            </span>

            <div className="flex flex-col gap-2">
              <input
                type="number"
                value={limitModalValue}
                onChange={(e) => setLimitModalValue(Number(e.target.value))}
                className="bg-surface-container border border-surface-container-highest px-3 py-2 rounded-lg text-lg font-mono font-bold text-primary outline-none focus:border-primary"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setLimitModalCard(null)}
                className="flex-1 py-2 rounded-lg bg-surface-container text-on-surface text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onUpdateCardLimit(limitModalCard.id, limitModalValue);
                  setLimitModalCard(null);
                  onTriggerToast(`Spend limit updated to $${limitModalValue.toLocaleString()}`, 'Limit Adjusted');
                }}
                className="flex-1 py-2 rounded-lg bg-primary-container text-on-primary-container text-sm font-semibold hover:bg-primary transition-all"
              >
                Update Limit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
