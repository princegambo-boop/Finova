import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';
import { Transaction, Account } from '../types';

interface TransactionsViewProps {
  transactions: Transaction[];
  accounts: Account[];
  onOpenAddModal: () => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  accounts,
  onOpenAddModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [selectedType, setSelectedType] = useState<'all' | 'inflow' | 'outflow'>('all');

  const categories = useMemo(() => {
    const cats = new Set(transactions.map(t => t.category));
    return Array.from(cats);
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.referenceId && t.referenceId.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
      const matchesAccount = selectedAccount === 'all' || t.accountId === selectedAccount;
      const matchesType = selectedType === 'all' || t.type === selectedType;

      return matchesSearch && matchesCategory && matchesAccount && matchesType;
    });
  }, [transactions, searchTerm, selectedCategory, selectedAccount, selectedType]);

  const totalInflows = filteredTransactions
    .filter(t => t.type === 'inflow')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalOutflows = filteredTransactions
    .filter(t => t.type === 'outflow')
    .reduce((acc, t) => acc + t.amount, 0);

  const exportCSV = () => {
    const headers = ['ID', 'Date', 'Description', 'Merchant', 'Category', 'Account', 'Amount', 'Type', 'Status', 'Reference'];
    const rows = filteredTransactions.map(t => [
      t.id,
      t.date,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.merchant.replace(/"/g, '""')}"`,
      `"${t.category}"`,
      `"${t.accountName}"`,
      t.amount,
      t.type,
      t.status,
      t.referenceId || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `finova_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="transactions-view-container" className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-young-serif text-2xl sm:text-3xl text-[#1E293B]">
            Double-Entry Ledger & Transactions
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Auditable transaction records continuously reconciled against external banking and merchant webhooks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 text-xs font-semibold text-[#1E293B] bg-[#F8F9FA] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#659B5E] hover:bg-[#41603B] rounded-lg shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Transaction</span>
          </button>
        </div>
      </div>

      {/* Filter and Summary Strip */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search merchant, desc, reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#659B5E]"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] focus:bg-white text-[#1E293B] focus:outline-hidden"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Account Dropdown */}
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] focus:bg-white text-[#1E293B] focus:outline-hidden"
          >
            <option value="all">All Connected Accounts</option>
            {accounts.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>

          {/* Type Selector */}
          <div className="flex bg-[#F8F9FA] p-1 rounded-lg border border-[#E2E8F0] text-xs">
            <button
              onClick={() => setSelectedType('all')}
              className={`flex-1 py-1 rounded text-center font-medium transition-colors ${
                selectedType === 'all' ? 'bg-white shadow-xs text-[#1E293B] font-semibold' : 'text-[#64748B]'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setSelectedType('inflow')}
              className={`flex-1 py-1 rounded text-center font-medium transition-colors ${
                selectedType === 'inflow' ? 'bg-[#DCFCE7] text-[#22C55E] font-semibold' : 'text-[#64748B]'
              }`}
            >
              Inflow
            </button>
            <button
              onClick={() => setSelectedType('outflow')}
              className={`flex-1 py-1 rounded text-center font-medium transition-colors ${
                selectedType === 'outflow' ? 'bg-[#FEE2E2] text-[#EF4444] font-semibold' : 'text-[#64748B]'
              }`}
            >
              Outflow
            </button>
          </div>
        </div>

        {/* Filtered Total Metrics */}
        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-[#E2E8F0] text-xs text-[#64748B]">
          <div className="flex items-center gap-4">
            <span>Showing <strong>{filteredTransactions.length}</strong> of {transactions.length} records</span>
            <span>•</span>
            <span className="text-[#22C55E] font-semibold">
              +${totalInflows.toLocaleString('en-US', { minimumFractionDigits: 2 })} Inflows
            </span>
            <span>•</span>
            <span className="text-[#EF4444] font-semibold">
              -${totalOutflows.toLocaleString('en-US', { minimumFractionDigits: 2 })} Outflows
            </span>
          </div>

          <span className="font-mono text-[11px] text-[#41603B]">
            Net: {totalInflows >= totalOutflows ? '+' : '-'}${Math.abs(totalInflows - totalOutflows).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8F9FA] text-[#64748B] font-semibold">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Transaction / Reference</th>
                <th className="py-3 px-4">Merchant</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Account</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#64748B]">
                    {transactions.length === 0 ? (
                      <div className="space-y-2">
                        <p className="font-semibold text-[#1E293B]">No Transactions Recorded Yet</p>
                        <p className="text-xs">Click &quot;Record Transaction&quot; above to log your first income or disbursement entry.</p>
                      </div>
                    ) : (
                      <p>No transactions match the selected filters.</p>
                    )}
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#F8F9FA] transition-colors">
                    <td className="py-3 px-4 font-mono text-[#64748B] whitespace-nowrap">
                      {tx.date}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#1E293B]">{tx.description}</div>
                      {tx.referenceId && (
                        <div className="text-[10px] font-mono text-[#64748B]">{tx.referenceId}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[#1E293B] whitespace-nowrap">
                      {tx.merchant}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-[#F1F5F9] text-[#1E293B] font-medium text-[11px]">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#64748B] whitespace-nowrap">
                      {tx.accountName}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-[11px] font-mono font-medium text-[#659B5E]">
                        {tx.source}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold whitespace-nowrap">
                      {tx.type === 'inflow' ? (
                        <span className="text-[#22C55E]">
                          +${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      ) : (
                        <span className="text-[#1E293B]">
                          -${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        tx.status === 'reconciled' 
                          ? 'bg-[#DCFCE7] text-[#22C55E]' 
                          : tx.status === 'pending'
                          ? 'bg-[#F1F5F9] text-[#64748B]'
                          : 'bg-[#FEE2E2] text-[#EF4444]'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
