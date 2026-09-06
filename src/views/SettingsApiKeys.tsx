import React, { useState } from 'react';
import { ELENA_VANCE_PORTRAIT, MARCUS_REID_PORTRAIT, PROFILE_AVATAR } from '../data/mockData';

interface SettingsApiKeysProps {
  onTriggerToast: (msg: string, title?: string, icon?: string) => void;
}

export const SettingsApiKeys: React.FC<SettingsApiKeysProps> = ({ onTriggerToast }) => {
  const [liveKeyRevealed, setLiveKeyRevealed] = useState(false);
  const [dualSignThreshold, setDualSignThreshold] = useState(100000);
  const [webhookUrl, setWebhookUrl] = useState('https://api.internal.enterprise/v1/fednow-events');
  const [ipList, setIpList] = useState(['198.51.100.0/24', '203.0.113.45/32']);
  const [newIp, setNewIp] = useState('');
  const [showAddIp, setShowAddIp] = useState(false);

  const copyText = (val: string, label: string) => {
    navigator.clipboard?.writeText(val);
    onTriggerToast(`Copied ${label} to clipboard.`, 'Copied', 'content_copy');
  };

  const handleRotateKey = () => {
    onTriggerToast(
      'Rotated Live API Key. Prior key granted 24-hour grace rollover window.',
      'API Key Rotated',
      'key'
    );
  };

  const handleTestWebhook = () => {
    onTriggerToast(
      'Dispatched test event `transfer.settled` → 200 OK received in 18ms.',
      'Webhook Test Succeeded',
      'verified'
    );
  };

  const handleAddIp = () => {
    if (!newIp.trim()) return;
    setIpList([...ipList, newIp.trim()]);
    setNewIp('');
    setShowAddIp(false);
    onTriggerToast(`Added ${newIp.trim()} to authorized CIDR whitelist.`, 'IP Whitelisted');
  };

  const teamMembers = [
    {
      name: 'Marcus Vance',
      email: 'kellyking.omoregie@agric.uniben.edu',
      role: 'Managing Partner',
      badge: 'Super Admin',
      avatar: PROFILE_AVATAR,
      fido: 'YubiKey 5C NFC',
    },
    {
      name: 'Elena Vance',
      email: 'e.vance@apex.bank.internal',
      role: 'Partner, CFO',
      badge: 'Tier-1 Signer',
      avatar: ELENA_VANCE_PORTRAIT,
      fido: 'YubiKey 5Ci',
    },
    {
      name: 'Marcus Reid',
      email: 'm.reid@apex.bank.internal',
      role: 'Managing Director, Treasury',
      badge: 'Tier-1 Signer',
      avatar: MARCUS_REID_PORTRAIT,
      fido: 'YubiKey 5 Nano',
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
                Settings &amp; Security Enclaves
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-mono text-label-sm border border-primary/20">
                FIPS 140-2 Level 4
              </span>
            </div>
            <span className="font-body-md text-body-md text-on-surface-variant">
              Manage cryptographic API credentials, dual-signature quorum policies, and enterprise WebAuthn keys.
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low border border-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
            <span className="w-2 h-2 rounded-full bg-tertiary"></span>
            <span>HSM-2 Hardware Enclave Enforced</span>
          </div>
        </div>

        {/* Top Grid: API Credentials & Dual-Sign Policy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* API Keys & Webhooks (7 Cols) */}
          <div className="lg:col-span-7 bg-surface-container-low rounded-xl p-6 sm:p-8 shadow-xl border border-surface-container-high/40 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                  Developer Credentials &amp; API Keys
                </h2>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Authenticate programmatic FedNow wires and virtual card provisioning
                </span>
              </div>
              <button
                onClick={handleRotateKey}
                className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-sm text-xs border border-surface-container-highest transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">refresh</span>
                <span>Rotate Secret</span>
              </button>
            </div>

            {/* Live Production API Key */}
            <div className="flex flex-col gap-2 p-4 rounded-xl bg-surface-container border border-surface-container-highest">
              <div className="flex items-center justify-between">
                <span className="text-xs text-on-surface-variant uppercase font-semibold">
                  Live Production API Key
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-tertiary/20 text-tertiary uppercase">
                  Full Access
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type={liveKeyRevealed ? 'text' : 'password'}
                  readOnly
                  value="apex_live_sk_891040819921_f9c2e01a88b7"
                  className="bg-surface-container-lowest font-mono text-xs text-primary px-3 py-2 rounded-lg w-full border border-surface-container-high select-all"
                />
                <button
                  onClick={() => setLiveKeyRevealed(!liveKeyRevealed)}
                  className="p-2 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                  title="Toggle Reveal"
                >
                  <span className="material-symbols-outlined text-sm">
                    {liveKeyRevealed ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
                <button
                  onClick={() => copyText('apex_live_sk_891040819921_f9c2e01a88b7', 'Live API Key')}
                  className="p-2 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                  title="Copy Key"
                >
                  <span className="material-symbols-outlined text-sm">content_copy</span>
                </button>
              </div>
            </div>

            {/* Webhook Endpoint */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-on-surface-variant uppercase font-semibold">
                  Live Webhook Receiver Endpoint
                </span>
                <button
                  onClick={handleTestWebhook}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs">send</span>
                  <span>Send Test Ping</span>
                </button>
              </div>
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="bg-surface-container border border-surface-container-highest px-3.5 py-2 rounded-lg text-xs font-mono text-on-surface outline-none focus:border-primary"
              />
              <span className="text-[11px] text-on-surface-variant">
                Subscribed events: <code>transfer.settled</code>, <code>card.swipe_authorized</code>, <code>sweep.rebalanced</code>
              </span>
            </div>

            {/* IP Whitelist */}
            <div className="flex flex-col gap-2 pt-2 border-t border-surface-container-high/40">
              <div className="flex items-center justify-between">
                <span className="text-xs text-on-surface-variant uppercase font-semibold">
                  Inbound IP CIDR Whitelist
                </span>
                <button
                  onClick={() => setShowAddIp(true)}
                  className="text-xs text-primary hover:underline flex items-center gap-0.5"
                >
                  <span className="material-symbols-outlined text-xs">add</span>
                  <span>Add CIDR</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {ipList.map((ip) => (
                  <span
                    key={ip}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-container text-xs font-mono text-on-surface border border-surface-container-highest"
                  >
                    <span>{ip}</span>
                    <button
                      onClick={() => setIpList(ipList.filter((i) => i !== ip))}
                      className="hover:text-error"
                    >
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </span>
                ))}
              </div>

              {showAddIp && (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={newIp}
                    onChange={(e) => setNewIp(e.target.value)}
                    placeholder="e.g. 192.0.2.1/32"
                    className="bg-surface-container text-xs font-mono px-3 py-1.5 rounded-lg border border-primary outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleAddIp}
                    className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container text-xs font-semibold"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quorum & Dual-Sign Configuration (5 Cols) */}
          <div className="lg:col-span-5 bg-surface-container-low rounded-xl p-6 shadow-xl border border-surface-container-high/40 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  Dual-Sign Quorum Policy
                </h3>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Mandate multiple hardware approvals
                </span>
              </div>
              <span className="material-symbols-outlined text-primary text-2xl">security</span>
            </div>

            {/* Threshold slider */}
            <div className="p-4 rounded-xl bg-surface-container flex flex-col gap-2.5 border border-surface-container-high/60">
              <div className="flex items-center justify-between">
                <span className="text-xs text-on-surface-variant uppercase">
                  Threshold for Quorum
                </span>
                <span className="font-num-metric-sm text-sm text-primary font-bold">
                  ${dualSignThreshold.toLocaleString()} USD
                </span>
              </div>
              <input
                type="range"
                min={25000}
                max={500000}
                step={25000}
                value={dualSignThreshold}
                onChange={(e) => setDualSignThreshold(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <p className="text-[11px] text-on-surface-variant">
                Disbursements equal to or exceeding ${dualSignThreshold.toLocaleString()} will lock pending secondary FIDO2 hardware token assertion.
              </p>
            </div>

            {/* Team Signers */}
            <div className="flex flex-col gap-3">
              <span className="text-xs text-on-surface-variant uppercase font-semibold">
                Authorized Signer Nodes
              </span>
              {teamMembers.map((member) => (
                <div
                  key={member.email}
                  className="p-3 rounded-xl bg-surface-container border border-surface-container-high/40 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="font-label-md text-xs text-on-surface font-semibold">
                        {member.name}
                      </span>
                      <span className="text-[11px] text-on-surface-variant">
                        {member.role}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-container-highest text-primary font-mono">
                      {member.badge}
                    </span>
                    <span className="text-[10px] text-tertiary flex items-center gap-0.5 mt-0.5">
                      <span className="material-symbols-outlined text-[10px]">key</span> {member.fido}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Register WebAuthn Key */}
            <button
              onClick={() => onTriggerToast('Hardware security key enrollment wizard initiated.', 'FIDO2 Setup')}
              className="w-full py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-xs transition-colors border border-surface-container-highest flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">add_moderator</span>
              <span>Enroll New YubiKey Hardware Token</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
