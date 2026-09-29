import React, { useState } from 'react';
import { Plus, X, ArrowDownLeft, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Account, Transaction } from '../types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  onAddTransaction: (tx: Omit<Transaction, 'id'>, newAccountName?: string) => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  accounts,
  onAddTransaction
}) => {
  const [description, setDescription] = useState('');
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState('Operating Income');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [customAccountName, setCustomAccountName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'inflow' | 'outflow'>('inflow');
  const [source, setSource] = useState<'Plaid' | 'Stripe' | 'Manual' | 'Invoice Sync' | 'Wire'>('Manual');
  const [referenceId, setReferenceId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) return;

    const selectedAcc = accounts.find(a => a.id === accountId);
    const resolvedAccountName = selectedAcc?.name || customAccountName.trim() || 'Primary Checking';

    onAddTransaction({
      date: new Date().toISOString().slice(0, 10),
      description: description.trim(),
      merchant: merchant.trim() || 'Internal Transfer',
      category,
      accountId: selectedAcc ? selectedAcc.id : '',
      accountName: resolvedAccountName,
      amount: parsedAmount,
      type,
      status: 'reconciled',
      source,
      referenceId: referenceId.trim() || `TXN-${Date.now().toString().slice(-6)}`,
      tags: [type === 'inflow' ? 'Inflow' : 'Outflow', 'User-Added']
    }, !selectedAcc ? resolvedAccountName : undefined);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in duration-200">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <div>
            <h3 className="font-young-serif text-xl text-[#1E293B]">
              Record Journal Entry
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Direct ingestion into the immutable double-entry ledger
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8F9FA] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Type selector */}
          <div>
            <label className="block font-semibold text-[#1E293B] mb-1.5">Flow Direction</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('inflow')}
                className={`py-2 px-3 rounded-lg border flex items-center justify-center gap-1.5 font-semibold transition-all ${
                  type === 'inflow'
                    ? 'bg-[#DCFCE7] text-[#22C55E] border-[#22C55E]'
                    : 'bg-[#F8F9FA] text-[#64748B] border-[#E2E8F0] hover:bg-white'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Cash Inflow (+)</span>
              </button>

              <button
                type="button"
                onClick={() => setType('outflow')}
                className={`py-2 px-3 rounded-lg border flex items-center justify-center gap-1.5 font-semibold transition-all ${
                  type === 'outflow'
                    ? 'bg-[#FEE2E2] text-[#EF4444] border-[#EF4444]'
                    : 'bg-[#F8F9FA] text-[#64748B] border-[#E2E8F0] hover:bg-white'
                }`}
              >
                <ArrowDownLeft className="w-4 h-4" />
                <span>Cash Outflow (-)</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-[#1E293B] mb-1">Description / Memo</label>
            <input
              type="text"
              required
              placeholder="e.g. Monthly Subscription, Hardware Purchase, Consulting"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#659B5E]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Merchant */}
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Merchant / Customer</label>
              <input
                type="text"
                placeholder="e.g. Merchant or Service Provider"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] focus:bg-white focus:outline-hidden"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Amount ($ USD)</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] focus:bg-white focus:outline-hidden font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Category */}
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] focus:bg-white text-[#1E293B]"
              >
                <option value="Operating Income">Operating Income</option>
                <option value="SaaS Revenue">SaaS Revenue</option>
                <option value="Infrastructure & Cloud">Infrastructure & Cloud</option>
                <option value="Payroll & Salaries">Payroll & Salaries</option>
                <option value="Legal & Compliance">Legal & Compliance</option>
                <option value="Treasury Yield">Treasury Yield</option>
                <option value="Software & Tools">Software & Tools</option>
                <option value="Tax & Regulatory">Tax & Regulatory</option>
                <option value="General OpEx">General OpEx</option>
              </select>
            </div>

            {/* Account */}
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Target Account</label>
              {accounts.length > 0 ? (
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] focus:bg-white text-[#1E293B]"
                >
                  {accounts.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="e.g. Primary Checking"
                  value={customAccountName}
                  onChange={(e) => setCustomAccountName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] focus:bg-white text-[#1E293B]"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Ingestion Source */}
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Ingress Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] focus:bg-white text-[#1E293B]"
              >
                <option value="Manual">Manual Ledger Entry</option>
                <option value="Plaid">Plaid Open Banking API</option>
                <option value="Stripe">Stripe Merchant Webhook</option>
                <option value="Invoice Sync">Invoice Sync / OCR</option>
                <option value="Wire">Federal Fedwire / SWIFT</option>
              </select>
            </div>

            {/* Reference ID */}
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Reference ID</label>
              <input
                type="text"
                placeholder="e.g. INV-2026-99"
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] focus:bg-white font-mono"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F8F9FA] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#659B5E] hover:bg-[#41603B] rounded-lg shadow-xs transition-colors active:scale-95"
            >
              Post to Ledger
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
