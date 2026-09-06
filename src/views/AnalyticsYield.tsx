import React, { useState } from 'react';

interface AnalyticsYieldProps {
  onTriggerToast: (msg: string, title?: string, icon?: string) => void;
}

export const AnalyticsYield: React.FC<AnalyticsYieldProps> = ({ onTriggerToast }) => {
  const [simulatorBalance, setSimulatorBalance] = useState(1850000);
  const [simulatorTerm, setSimulatorTerm] = useState<'30D' | '90D' | '1Y'>('1Y');

  // Calculation for yield
  const apy = 0.0485;
  const days = simulatorTerm === '30D' ? 30 : simulatorTerm === '90D' ? 90 : 365;
  const projectedYield = (simulatorBalance * apy * (days / 365));
  const monthlyYield = (simulatorBalance * apy) / 12;

  const yieldInstruments = [
    {
      name: 'US Treasury 3-Month Bills',
      ticker: 'TBILL-3M-SOV',
      apy: '5.18%',
      allocation: '$1,200,000.00',
      backed: '100% Full Faith of US Govt',
      status: 'Active · Auto-Rollover',
    },
    {
      name: 'Overnight Tri-Party Repo Sweeps',
      ticker: 'REPO-FED-ON',
      apy: '4.85%',
      allocation: '$650,000.00',
      backed: 'Sovereign Collateralized',
      status: 'Daily Liquidity 09:00 UTC',
    },
    {
      name: 'Euro Dollar Yield Node',
      ticker: 'EUR-LIBOR-FIX',
      apy: '3.72%',
      allocation: '€560,400.00',
      backed: 'ECB Clearing House',
      status: 'Multi-Currency Buffer',
    },
  ];

  return (
    <div className="flex flex-col w-full">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col gap-6 sm:gap-8">
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="font-headline-lg text-headline-lg text-on-surface">
                Sovereign Yield Engine &amp; Analytics
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-tertiary font-mono text-label-sm border border-tertiary/20">
                4.85% Composite APY
              </span>
            </div>
            <span className="font-body-md text-body-md text-on-surface-variant">
              Automated institutional yield optimization with US T-Bills and Fed Overnight Repos.
            </span>
          </div>

          <button
            onClick={() => onTriggerToast('Allocated $250,000 from operating checking into 4.85% Yield Vault.', 'Yield Rebalanced')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-tertiary-container hover:bg-tertiary text-on-tertiary-container font-headline-sm text-sm transition-all shadow-[0_0_16px_rgba(27,189,133,0.3)]"
          >
            <span className="material-symbols-outlined text-lg">auto_graph</span>
            <span>Sweep Excess Liquidity</span>
          </button>
        </div>

        {/* Top Bento Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-surface-container-low border border-surface-container-high/40 shadow-sm flex flex-col justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
              Current Yield Balance
            </span>
            <div className="flex flex-col mt-2">
              <span className="font-headline-md text-headline-md text-on-surface font-bold">
                $1,850,000.00
              </span>
              <span className="font-label-sm text-xs text-tertiary mt-0.5">
                Yield Sweeps Active
              </span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-surface-container-low border border-surface-container-high/40 shadow-sm flex flex-col justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
              Yield Earned (MTD)
            </span>
            <div className="flex flex-col mt-2">
              <span className="font-headline-md text-headline-md text-tertiary font-bold">
                +$18,942.30
              </span>
              <span className="font-label-sm text-xs text-on-surface-variant mt-0.5">
                +2.4% vs previous month
              </span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-surface-container-low border border-surface-container-high/40 shadow-sm flex flex-col justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
              Projected Annual Earnings
            </span>
            <div className="flex flex-col mt-2">
              <span className="font-headline-md text-headline-md text-primary font-bold">
                +$89,725.00
              </span>
              <span className="font-label-sm text-xs text-on-surface-variant mt-0.5">
                At continuous 4.85% APY
              </span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-surface-container-low border border-surface-container-high/40 shadow-sm flex flex-col justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
              Liquidity Runway
            </span>
            <div className="flex flex-col mt-2">
              <span className="font-headline-md text-headline-md text-on-surface font-bold">
                36.4 Months
              </span>
              <span className="font-label-sm text-xs text-primary mt-0.5">
                Low burn rate ratio
              </span>
            </div>
          </div>
        </div>

        {/* Main Grid: Simulator & Laddering */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Yield Compounding Projection Simulator (7 Cols) */}
          <div className="lg:col-span-7 bg-surface-container-low rounded-xl p-6 sm:p-8 shadow-xl border border-surface-container-high/40 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                  Yield Compounding Simulator
                </h2>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Model principal earnings across custom horizons and compounding frequency
                </span>
              </div>
              <span className="material-symbols-outlined text-tertiary text-2xl">calculate</span>
            </div>

            {/* Slider */}
            <div className="p-5 rounded-xl bg-surface-container flex flex-col gap-3 border border-surface-container-high/60">
              <div className="flex items-center justify-between">
                <span className="text-xs text-on-surface-variant uppercase font-semibold">
                  Principal Allocation
                </span>
                <span className="font-num-metric-sm text-xl text-primary font-bold">
                  ${simulatorBalance.toLocaleString()} USD
                </span>
              </div>
              <input
                type="range"
                min={250000}
                max={10000000}
                step={50000}
                value={simulatorBalance}
                onChange={(e) => setSimulatorBalance(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-on-surface-variant">
                <span>$250k</span>
                <span>$2.5M</span>
                <span>$5.0M</span>
                <span>$10.0M</span>
              </div>
            </div>

            {/* Term selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-on-surface-variant uppercase">Horizon:</span>
              <div className="flex items-center gap-1.5 p-1 bg-surface-container rounded-lg">
                {(['30D', '90D', '1Y'] as const).map((term) => (
                  <button
                    key={term}
                    onClick={() => setSimulatorTerm(term)}
                    className={`px-3 py-1 rounded text-xs transition-colors ${
                      simulatorTerm === term
                        ? 'bg-surface-container-highest text-on-surface font-semibold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {term === '30D' ? '30 Days' : term === '90D' ? '90 Days' : '1 Full Year'}
                  </button>
                ))}
              </div>
            </div>

            {/* Projected Outputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-surface-container border border-surface-container-high/40 flex flex-col">
                <span className="text-xs text-on-surface-variant uppercase">Estimated Monthly Yield</span>
                <span className="font-headline-md text-2xl text-tertiary font-bold mt-1">
                  +${Math.round(monthlyYield).toLocaleString()} USD
                </span>
                <span className="text-[11px] text-on-surface-variant mt-0.5">
                  Deposited directly on 1st of month
                </span>
              </div>
              <div className="p-4 rounded-xl bg-surface-container border border-surface-container-high/40 flex flex-col">
                <span className="text-xs text-on-surface-variant uppercase">Term Total Accrual</span>
                <span className="font-headline-md text-2xl text-primary font-bold mt-1">
                  +${Math.round(projectedYield).toLocaleString()} USD
                </span>
                <span className="text-[11px] text-on-surface-variant mt-0.5">
                  Exempt from state/local franchise taxes
                </span>
              </div>
            </div>
          </div>

          {/* Active Treasury Instruments Ladder (5 Cols) */}
          <div className="lg:col-span-5 bg-surface-container-low rounded-xl p-6 shadow-xl border border-surface-container-high/40 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  Treasury Ladder Portfolio
                </h3>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Sovereign fixed-income vehicles
                </span>
              </div>
              <span className="material-symbols-outlined text-primary text-xl">account_balance</span>
            </div>

            <div className="flex flex-col gap-3">
              {yieldInstruments.map((item) => (
                <div
                  key={item.ticker}
                  className="p-4 rounded-xl bg-surface-container border border-surface-container-high/40 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-label-md text-sm text-on-surface font-semibold">
                        {item.name}
                      </span>
                      <span className="font-mono text-[11px] text-primary font-semibold">
                        {item.ticker}
                      </span>
                    </div>
                    <span className="font-num-metric-sm text-base text-tertiary font-bold">
                      {item.apy} APY
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-on-surface-variant border-t border-surface-container-high/30 pt-2">
                    <span>{item.backed}</span>
                    <span className="font-mono text-on-surface font-semibold">{item.allocation}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                    <span>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Currency Distribution Breakdown */}
            <div className="p-4 rounded-xl bg-surface-container border border-surface-container-high/40 flex flex-col gap-2.5">
              <span className="text-xs text-on-surface-variant uppercase font-semibold">
                Multi-Currency Reserves
              </span>
              <div className="w-full bg-surface-container-lowest rounded-full h-2.5 flex overflow-hidden">
                <div className="bg-primary h-full" style={{ width: '49.4%' }} title="USD Operating (49.4%)"></div>
                <div className="bg-tertiary h-full" style={{ width: '37.8%' }} title="USD Yield Vault (37.8%)"></div>
                <div className="bg-secondary h-full" style={{ width: '12.4%' }} title="EUR Treasury (12.4%)"></div>
                <div className="bg-amber-400 h-full" style={{ width: '0.4%' }} title="GBP Buffer (0.4%)"></div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-on-surface-variant pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span>USD Operating (49.4%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                  <span>USD Yield Vault (37.8%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span>EUR Treasury (12.4%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>GBP Reserves (0.4%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
