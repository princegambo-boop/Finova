import React, { useState } from 'react';
import { Building2, X, Plus, CheckCircle2 } from 'lucide-react';
import { Account } from '../types';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: (account: Omit<Account, 'id'>) => void;
}

const ACCOUNT_TYPES: { value: Account['type']; label: string }[] = [
  { value: 'checking', label: 'Checking Account' },
  { value: 'savings', label: 'Savings Account' },
  { value: 'treasury', label: 'Treasury / Brokerage' },
  { value: 'settlement', label: 'Merchant / Settlement Gateway' },
  { value: 'escrow', label: 'Escrow & Reserves' },
  { value: 'credit', label: 'Credit Card / Revolving Facility' },
];

const COLOR_OPTIONS = [
  '#659B5E',
  '#41603B',
  '#3B82F6',
  '#8B5CF6',
  '#F59E0B',
  '#0EA5E9',
];

export const AddAccountModal: React.FC<AddAccountModalProps> = ({
  isOpen,
  onClose,
  onAddAccount,
}) => {
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [type, setType] = useState<Account['type']>('checking');
  const [balance, setBalance] = useState('');
  const [accountMask, setAccountMask] = useState('');
  const [color, setColor] = useState('#659B5E');
  const [currency, setCurrency] = useState('USD');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !institution.trim()) return;

    const parsedBalance = parseFloat(balance) || 0;
    const finalBalance = type === 'credit' && parsedBalance > 0 ? -parsedBalance : parsedBalance;

    onAddAccount({
      name: name.trim(),
      institution: institution.trim(),
      type,
      accountNumberMask: accountMask.trim() ? `•••• ${accountMask.trim().slice(-4)}` : `•••• ${Math.floor(1000 + Math.random() * 9000)}`,
      balance: finalBalance,
      availableBalance: finalBalance,
      currency,
      lastSynced: 'Just now',
      status: 'connected',
      color,
    });

    // Reset and close
    setName('');
    setInstitution('');
    setBalance('');
    setAccountMask('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#E8F0EA] flex items-center justify-center text-[#659B5E]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-young-serif text-lg text-[#1E293B]">Connect Account</h3>
              <p className="text-xs text-[#64748B]">Add a depository bank, credit facility, or liquidity account</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8F9FA] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block font-semibold text-[#1E293B] mb-1">
              Account Label / Purpose <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Primary Operating, High-Yield Savings"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] focus:bg-white text-[#1E293B] placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-[#659B5E]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">
                Financial Institution <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Chase, Bank of America, Fidelity"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] focus:bg-white text-[#1E293B] placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-[#659B5E]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">
                Account Type <span className="text-red-500">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as Account['type'])}
                className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] focus:bg-white text-[#1E293B] focus:outline-hidden"
              >
                {ACCOUNT_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">
                Initial Balance
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] focus:bg-white text-[#1E293B] placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-[#659B5E]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">
                Last 4 Digits
              </label>
              <input
                type="text"
                maxLength={4}
                placeholder="4 digits"
                value={accountMask}
                onChange={(e) => setAccountMask(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] focus:bg-white text-[#1E293B] placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-[#659B5E]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] focus:bg-white text-[#1E293B] focus:outline-hidden"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#1E293B] mb-1.5">
              Accent Badge Color
            </label>
            <div className="flex items-center gap-3">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center"
                  style={{ 
                    backgroundColor: c, 
                    borderColor: color === c ? '#1E293B' : 'transparent' 
                  }}
                >
                  {color === c && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F8F9FA] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#659B5E] hover:bg-[#41603B] rounded-lg shadow-xs transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Connect Account</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
