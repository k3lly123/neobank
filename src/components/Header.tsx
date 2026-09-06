import React, { useState } from 'react';
import { PROFILE_AVATAR } from '../data/mockData';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onOpenInstantTransfer: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  onOpenInstantTransfer,
  searchQuery,
  onSearchChange,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifications = [
    {
      id: '1',
      title: 'FedNow Instant Wire Confirmed',
      desc: '$2,000,000.00 from Sequoia Capital settled in sovereign vault.',
      time: '12m ago',
      unread: true,
      icon: 'verified',
    },
    {
      id: '2',
      title: 'Dual-Sign Signature Required',
      desc: 'Elena Vance initiated $250,000 wire to JPMorgan Escrow.',
      time: '34m ago',
      unread: true,
      icon: 'gavel',
    },
    {
      id: '3',
      title: 'Card Limit Warning (92%)',
      desc: 'Marketing & Meta Ad Spend ($18,450 / $20,000) near cap.',
      time: '2h ago',
      unread: false,
      icon: 'warning',
    },
  ];

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-surface-container-lowest/80 backdrop-blur-xl z-40 flex items-center justify-between px-4 sm:px-8 border-b border-surface-container-high/40 shadow-[0_1px_8px_rgba(0,0,0,0.2)]">
      {/* Left: Mobile hamburger & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          title="Open Navigation Menu"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>

        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search accounts, ledgers, transfers, or counterparty..."
            className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm pl-10 pr-12 py-2 rounded-lg placeholder:text-on-surface-variant/60 focus:outline-none focus:bg-surface-container border border-surface-container-high/40 transition-colors"
          />
          <div className="hidden sm:flex absolute right-2.5 top-1/2 -translate-y-1/2 items-center gap-1 pointer-events-none">
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-surface-container-high text-on-surface-variant rounded border border-surface-container-highest">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right: Network Status, Instant Transfer CTA, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-4 pl-3">
        {/* Status Pill */}
        <div className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low border border-surface-container-high/50">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
          <span className="font-label-sm text-label-sm text-tertiary tracking-wide whitespace-nowrap">
            ACH &amp; FedNow Online
          </span>
        </div>

        {/* Instant Transfer Action Button */}
        <button
          onClick={onOpenInstantTransfer}
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-lg bg-primary-container text-on-primary-container font-label-md text-label-md hover:bg-primary transition-all shadow-[0_0_16px_rgba(6,182,212,0.25)] active:scale-95 whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-lg">bolt</span>
          <span className="hidden sm:inline">Instant Transfer</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileOpen(false);
            }}
            className="relative p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-surface-container-lowest"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-surface-container-high border border-surface-container-highest shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between px-2 py-1.5 border-b border-surface-container-highest">
                <span className="font-headline-sm text-sm text-on-surface font-semibold">
                  Sovereign Audit Alerts
                </span>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-[10px]">
                  2 Unread
                </span>
              </div>
              <div className="flex flex-col gap-1.5 mt-2 max-h-72 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-2.5 rounded-lg flex items-start gap-2.5 transition-colors cursor-pointer ${
                      notif.unread ? 'bg-surface-container' : 'hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-primary text-lg mt-0.5">
                      {notif.icon}
                    </span>
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-label-md text-xs text-on-surface font-medium truncate">
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-on-surface-variant ml-1 whitespace-nowrap">
                          {notif.time}
                        </span>
                      </div>
                      <p className="font-body-sm text-xs text-on-surface-variant line-clamp-2 mt-0.5">
                        {notif.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-surface-container-highest flex justify-end">
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="text-primary hover:underline font-label-sm text-xs"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-surface-container-high hidden sm:block"></div>

        {/* User Profile */}
        <div className="relative">
          <div
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2.5 pl-1 cursor-pointer select-none group"
          >
            <div className="hidden sm:flex flex-col text-right">
              <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">
                Marcus Vance
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Managing Partner
              </span>
            </div>
            <div className="relative">
              <img
                src={PROFILE_AVATAR}
                alt="Profile Marcus Vance"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-primary/40 group-hover:ring-primary transition-all"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-tertiary ring-1 ring-surface-container-lowest"></span>
            </div>
          </div>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-surface-container-high border border-surface-container-highest shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center gap-3 p-2 border-b border-surface-container-highest">
                <img
                  src={PROFILE_AVATAR}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span className="font-label-md text-on-surface font-semibold">Marcus Vance</span>
                  <span className="font-label-sm text-on-surface-variant">kellyking.omoregie@agric.uniben.edu</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 py-2">
                <div className="flex items-center justify-between px-2 py-1.5 text-xs text-on-surface-variant">
                  <span>Signer Quorum:</span>
                  <span className="font-mono text-primary font-semibold">Tier-1 Principal</span>
                </div>
                <div className="flex items-center justify-between px-2 py-1.5 text-xs text-on-surface-variant">
                  <span>Hardware Key:</span>
                  <span className="font-mono text-tertiary">YubiKey 5C NFC</span>
                </div>
                <div className="flex items-center justify-between px-2 py-1.5 text-xs text-on-surface-variant">
                  <span>Node:</span>
                  <span className="font-mono text-on-surface">US-EAST-VA</span>
                </div>
              </div>
              <button
                onClick={() => setProfileOpen(false)}
                className="w-full text-center py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-highest text-primary font-label-sm text-xs transition-colors"
              >
                Close Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
