import React, { useState } from 'react';
import { 
  DollarSign, 
  Building2, 
  ArrowRightLeft, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  ExternalLink,
  Plus
} from 'lucide-react';
import { Account } from '../types';

interface AccountsViewProps {
  accounts: Account[];
  onTransferFunds: (fromId: string, toId: string, amount: number) => void;
  onOpenAddAccountModal?: () => void;
}

export const AccountsView: React.FC<AccountsViewProps> = ({
  accounts,
  onTransferFunds,
  onOpenAddAccountModal,
}) => {
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [fromAccount, setFromAccount] = useState(accounts[0]?.id || '');
  const [toAccount, setToAccount] = useState(accounts[1]?.id || '');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferSuccess, setTransferSuccess] = useState(false);

  const totalAssets = accounts
    .filter(a => a.type !== 'credit')
    .reduce((acc, a) => acc + a.balance, 0);

  const totalLiabilities = Math.abs(
    accounts
      .filter(a => a.type === 'credit')
      .reduce((acc, a) => acc + a.balance, 0)
  );

  const liquidityRatio = totalAssets > 0 
    ? Math.max(0, Math.round(((totalAssets - totalLiabilities) / totalAssets) * 100))
    : 100;

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(transferAmount);
    if (!amt || amt <= 0) return;
    if (fromAccount === toAccount) return;

    onTransferFunds(fromAccount, toAccount, amt);
    setTransferSuccess(true);
    setTimeout(() => {
      setTransferSuccess(false);
      setShowTransferModal(false);
      setTransferAmount('');
    }, 1200);
  };

  return (
    <div id="accounts-view-container" className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-young-serif text-2xl sm:text-3xl text-[#1E293B]">
            Connected Accounts & Liquidity Pools
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Real-time balance synchronization across depository checking, yield treasury, and merchant gateways.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {onOpenAddAccountModal && (
            <button
              onClick={onOpenAddAccountModal}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-[#659B5E] hover:bg-[#41603B] rounded-lg shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Connect Account</span>
            </button>
          )}
          {accounts.length >= 2 && (
            <button
              onClick={() => {
                setFromAccount(accounts[0]?.id || '');
                setToAccount(accounts[1]?.id || '');
                setShowTransferModal(true);
              }}
              className="px-4 py-2.5 text-xs font-semibold text-[#1E293B] bg-[#F8F9FA] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg shadow-2xs transition-all flex items-center gap-1.5 active:scale-95"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-[#659B5E]" />
              <span>Internal Sweep & Transfer</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
            Total Depository Assets
          </div>
          <div className="font-young-serif text-2xl sm:text-3xl text-[#1E293B] mt-2">
            ${totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-[#22C55E] mt-1 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{accounts.length > 0 ? 'Fully insured & segregated' : 'Ready to link depository'}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
            Credit & Revolving Liabilities
          </div>
          <div className="font-young-serif text-2xl sm:text-3xl text-[#EF4444] mt-2">
            -${totalLiabilities.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-[#64748B] mt-1">
            {totalLiabilities > 0 ? '30-day auto-settle active' : 'Zero outstanding liabilities'}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
            Net Working Capital
          </div>
          <div className="font-young-serif text-2xl sm:text-3xl text-[#22C55E] mt-2">
            ${(totalAssets - totalLiabilities).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-[#41603B] mt-1 font-medium">
            Available liquidity ratio: {liquidityRatio}%
          </div>
        </div>
      </div>

      {/* Connected Accounts Grid */}
      {accounts.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-[#CBD5E1] p-12 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-[#E8F0EA] flex items-center justify-center text-[#659B5E] mx-auto">
            <Building2 className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="font-young-serif text-lg text-[#1E293B]">
              No Depository or Credit Accounts Connected
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Add your corporate checking, yield savings, treasury accounts, or credit cards to monitor balances and execute double-entry transfers.
            </p>
          </div>
          {onOpenAddAccountModal && (
            <button
              onClick={onOpenAddAccountModal}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#659B5E] hover:bg-[#41603B] rounded-lg shadow-xs transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Connect First Account</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <div 
              key={account.id} 
              className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs hover:border-[#659B5E]/50 transition-colors space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: account.color }}
                  >
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-young-serif text-base text-[#1E293B]">
                      {account.name}
                    </h3>
                    <div className="text-xs text-[#64748B]">{account.institution}</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F1F5F9] text-[#64748B]">
                  {account.accountNumberMask}
                </span>
              </div>

              <div className="pt-2 border-t border-[#E2E8F0] space-y-1">
                <div className="text-[10px] uppercase font-bold text-[#64748B]">
                  {account.type === 'credit' ? 'Outstanding Balance' : 'Current Ledger Balance'}
                </div>
                <div className={`font-young-serif text-2xl ${account.balance < 0 ? 'text-[#EF4444]' : 'text-[#1E293B]'}`}>
                  {account.balance < 0 ? '-' : ''}${Math.abs(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-[#64748B] flex justify-between">
                  <span>Available:</span>
                  <span className="font-mono font-medium text-[#1E293B]">
                    ${account.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
                <span className="flex items-center gap-1.5 text-[#22C55E] font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                  Connected ({account.lastSynced})
                </span>

                <button
                  onClick={() => {
                    setFromAccount(account.id);
                    setShowTransferModal(true);
                  }}
                  className="text-xs font-semibold text-[#659B5E] hover:text-[#41603B]"
                >
                  Transfer &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Internal Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 max-w-md w-full shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-[#659B5E]" />
                <h3 className="font-young-serif text-xl text-[#1E293B]">Internal Liquidity Sweep</h3>
              </div>
              <button 
                onClick={() => setShowTransferModal(false)}
                className="text-[#64748B] hover:text-[#1E293B] text-sm"
              >
                ✕
              </button>
            </div>

            {transferSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-[#22C55E] mx-auto" />
                <div className="font-young-serif text-lg text-[#1E293B]">Transfer Executed Successfully</div>
                <p className="text-xs text-[#64748B]">Double-entry ledger journal updated in real time.</p>
              </div>
            ) : accounts.length < 2 ? (
              <div className="py-6 text-center space-y-4">
                <p className="text-xs text-[#64748B]">
                  At least 2 active accounts are required to execute an internal liquidity transfer.
                </p>
                {onOpenAddAccountModal && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowTransferModal(false);
                      onOpenAddAccountModal();
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#659B5E] hover:bg-[#41603B] rounded-lg transition-colors inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Connect An Account</span>
                  </button>
                )}
              </div>
            ) : (
              <form onSubmit={handleExecuteTransfer} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1">Source Account (Debit)</label>
                  <select
                    value={fromAccount}
                    onChange={(e) => setFromAccount(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] focus:bg-white text-[#1E293B]"
                  >
                    {accounts.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.name} (${a.balance.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1">Destination Account (Credit)</label>
                  <select
                    value={toAccount}
                    onChange={(e) => setToAccount(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] focus:bg-white text-[#1E293B]"
                  >
                    {accounts.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.name} (${a.balance.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1">Transfer Amount ($ USD)</label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="e.g. 25000"
                    required
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] focus:bg-white text-[#1E293B]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowTransferModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F8F9FA] rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#659B5E] hover:bg-[#41603B] rounded-lg shadow-xs"
                  >
                    Execute Sweep
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
