import React, { useState } from 'react';
import { NavigationPath } from '../types';

interface SidebarProps {
  currentPath: NavigationPath;
  onNavigate: (path: NavigationPath) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  mobileOpen,
  onCloseMobile,
}) => {
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState('Apex Treasury (Enterprise Ops)');

  const navItems: { path: NavigationPath; label: string; icon: string; badge?: string }[] = [
    { path: 'overview-and-dashboard', label: 'Overview & Dashboard', icon: 'grid_view' },
    { path: 'transfers-and-payments', label: 'Transfers & Payments', icon: 'swap_horiz' },
    { path: 'cards-and-virtual-issuance', label: 'Cards & Virtual Issuance', icon: 'credit_card', badge: '14' },
    { path: 'transactions-and-ledgers', label: 'Transactions & Ledgers', icon: 'receipt_long' },
    { path: 'analytics-and-yield', label: 'Analytics & Yield', icon: 'monitoring' },
    { path: 'settings-and-api-keys', label: 'Settings & API Keys', icon: 'terminal' },
  ];

  const accounts = [
    { name: 'Apex Treasury (Enterprise Ops)', sub: 'Primary Sovereign Vault', id: '*8902' },
    { name: 'Apex High-Yield Sovereign', sub: 'Treasury Yield Sweeps', id: '*4110' },
    { name: 'Apex Commercial Escrow', sub: 'FedNow Clearing Pool', id: '*1042' },
  ];

  const handleNav = (path: NavigationPath) => {
    onNavigate(path);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-surface-container-lowest z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.4)] border-r border-surface-container-high/40 transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col">
          {/* Logo Brand Header */}
          <div className="h-16 px-6 flex items-center justify-between gap-3 border-b border-surface-container-high/30">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container shadow-[0_0_12px_rgba(6,182,212,0.35)]">
                <span className="material-symbols-outlined text-xl">account_balance</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight leading-none">
                  APEX
                </span>
                <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest mt-0-5">
                  Digital Bank
                </span>
              </div>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Account Entity Selector */}
          <div className="px-4 py-3 relative">
            <div
              onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
              className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between cursor-pointer hover:bg-surface-container transition-colors border border-surface-container-high/40"
            >
              <div className="flex items-center gap-2-5 overflow-hidden">
                <div className="w-7 h-7 rounded-md bg-surface-container-highest flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-sm">corporate_fare</span>
                </div>
                <div className="flex flex-col truncate">
                  <span className="font-label-md text-label-md text-on-surface truncate">
                    {selectedEntity}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
                    Enterprise Ops
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-lg">
                unfold_more
              </span>
            </div>

            {/* Dropdown Menu */}
            {accountDropdownOpen && (
              <div className="absolute top-full left-4 right-4 mt-1 bg-surface-container-high rounded-xl shadow-2xl border border-surface-container-highest p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2 py-1 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                  Select Legal Entity
                </div>
                {accounts.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => {
                      setSelectedEntity(acc.name);
                      setAccountDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-surface-container-highest transition-colors group"
                  >
                    <div className="flex flex-col truncate">
                      <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors truncate">
                        {acc.name}
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                        {acc.sub}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-primary font-semibold">
                      {acc.id}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="px-4 mt-2">
            <div className="px-3 py-1-5 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
              Main Navigation
            </div>
            <nav className="flex flex-col gap-1 mt-1">
              {navItems.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNav(item.path)}
                    className={`flex items-center justify-between w-full px-3 py-2-5 rounded-lg font-label-md text-label-md transition-all text-left ${
                      isActive
                        ? 'bg-primary-container text-on-primary-container font-semibold shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                        : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`material-symbols-outlined text-xl ${
                          isActive ? 'text-on-primary-container' : 'text-on-surface-variant'
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          isActive
                            ? 'bg-on-primary-container text-primary-container'
                            : 'bg-surface-container-highest text-primary'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer info & SLA */}
        <div className="p-4 flex flex-col gap-3 border-t border-surface-container-high/30">
          <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between border border-surface-container-high/40">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                SLA Liquidity
              </span>
              <span className="font-num-metric-sm text-num-metric-sm text-primary">
                Tier-1 Sovereign
              </span>
            </div>
            <span className="material-symbols-outlined text-tertiary text-xl">verified_user</span>
          </div>
          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tertiary"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">v4.2.0-core</span>
            </div>
            <button
              onClick={() => onNavigate('settings-and-api-keys')}
              className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              Docs &amp; Specs
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
