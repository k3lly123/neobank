import React, { useState } from 'react';
import { US_TREASURY_FLAG } from '../data/mockData';

interface InstantTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDispatch: (data: {
    destination: string;
    amount: number;
    memo: string;
    rail: string;
  }) => void;
}

export const InstantTransferModal: React.FC<InstantTransferModalProps> = ({
  isOpen,
  onClose,
  onDispatch,
}) => {
  const [amountStr, setAmountStr] = useState('250,000.00');
  const [destination, setDestination] = useState('JPMorgan Escrow FedNow');
  const [memo, setMemo] = useState('Instant Liquidity Settlement');
  const [rail, setRail] = useState('FedNow Instant');

  if (!isOpen) return null;

  const handleQuickPercent = (pct: number) => {
    const total = 2420100;
    const val = (total * pct) / 100;
    setAmountStr(
      val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    );
  };

  const handleConfirm = () => {
    const numericAmount = parseFloat(amountStr.replace(/,/g, '')) || 0;
    onDispatch({
      destination,
      amount: numericAmount,
      memo,
      rail,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-surface-container-lowest/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-surface-container-low max-w-lg w-full rounded-2xl p-6 md:p-8 flex flex-col gap-6 shadow-2xl border border-primary/20 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top */}
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-[0_0_16px_rgba(6,182,212,0.3)]">
            <span className="material-symbols-outlined text-2xl">bolt</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Modal Heading */}
        <div className="flex flex-col gap-1">
          <span className="font-headline-md text-headline-md text-on-surface">
            FedNow Instant Settlement
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Direct real-time gross settlement through the Federal Reserve payment rails.
          </span>
        </div>

        {/* Form Inputs */}
        <div className="flex flex-col gap-4">
          {/* Destination */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Beneficiary Destination
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="bg-surface-container-lowest border border-surface-container-highest text-on-surface font-body-md text-body-md px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-primary transition-colors"
            >
              <option value="JPMorgan Escrow FedNow">JPMorgan Escrow FedNow (Linked Clearing · 1042)</option>
              <option value="Cold Vault Alpha">Cold Vault Alpha (Yield Escrow · $12.4M)</option>
              <option value="Stripe Treasury Pool">Stripe Treasury Pool (Corporate Outflows · *3391)</option>
              <option value="Sequoia Capital Direct">Sequoia Capital Direct Wire (*8902)</option>
            </select>
          </div>

          {/* Amount input */}
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-surface-container-lowest border border-surface-container-high/60">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                Settlement Amount
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleQuickPercent(10)}
                  className="px-2 py-0.5 rounded bg-surface-container text-xs hover:text-primary transition-colors"
                >
                  10%
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPercent(25)}
                  className="px-2 py-0.5 rounded bg-surface-container text-xs hover:text-primary transition-colors"
                >
                  25%
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPercent(50)}
                  className="px-2 py-0.5 rounded bg-surface-container text-xs hover:text-primary transition-colors"
                >
                  50%
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPercent(100)}
                  className="px-2 py-0.5 rounded bg-surface-container text-xs text-primary font-bold transition-colors"
                >
                  Max
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 py-1">
              <span className="font-num-metric-lg text-2xl text-primary font-bold">$</span>
              <input
                type="text"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                className="bg-transparent font-num-metric-lg text-2xl text-on-surface outline-none w-full tracking-tight"
              />
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container shrink-0">
                <img src={US_TREASURY_FLAG} alt="USD Flag" className="w-4 h-4 rounded-full object-cover" />
                <span className="font-label-md text-xs font-bold text-on-surface">USD</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-on-surface-variant pt-2 border-t border-surface-container-high/40">
              <span>Execution Fee: <strong className="text-tertiary font-semibold">$0.00 (Tier-1)</strong></span>
              <span>Latency: <strong className="text-primary font-semibold">&lt; 4s via FedNow</strong></span>
            </div>
          </div>

          {/* Memo & Tag */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Settlement Memo
            </label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Enter transfer reference memo"
              className="bg-surface-container-lowest border border-surface-container-highest text-on-surface font-body-sm text-body-sm px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 rounded-lg bg-primary-container hover:bg-primary text-on-primary-container font-headline-sm text-headline-sm transition-all shadow-[0_0_16px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">send</span>
            <span>Authorize &amp; Dispatch</span>
          </button>
        </div>
      </div>
    </div>
  );
};
