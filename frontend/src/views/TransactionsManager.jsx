import React, { useState } from 'react';
import { FileText, Plus, Search, Calendar, DollarSign, CheckCircle2, User, Building } from 'lucide-react';
import { formatCurrency } from '../api';

export default function TransactionsManager({
  transactions = [],
  onOpenCloseDealModal
}) {
  const [search, setSearch] = useState('');

  const filtered = transactions.filter((t) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    const matchProp = (t.property_title || '').toLowerCase().includes(term);
    const matchBuyer = (t.buyer_name || '').toLowerCase().includes(term);
    const matchAgent = (t.agent_name || '').toLowerCase().includes(term);
    return matchProp || matchBuyer || matchAgent;
  });

  const totalClosedVolume = transactions.reduce((acc, curr) => acc + Number(curr.transaction_amount || 0), 0);
  const totalCommissionPool = transactions.reduce((acc, curr) => acc + Number(curr.commission || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-slate-900">
            Transactions & Deals Audit Log
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete transaction history with buyer-seller settlements, agent commissions, and dates.
          </p>
        </div>

        <button
          onClick={onOpenCloseDealModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/20"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Deal</span>
        </button>
      </div>

      {/* Summary KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Deals Finalized</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{transactions.length} Transactions</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Closed Turnover</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">{formatCurrency(totalClosedVolume)}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Agency Commission Earned</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{formatCurrency(totalCommissionPool)}</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between text-xs">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search deals by property, buyer, or agent name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-3.5 px-4">Deal #</th>
                <th className="py-3.5 px-4">Property</th>
                <th className="py-3.5 px-4">Buyer (Purchaser)</th>
                <th className="py-3.5 px-4">Seller (Owner)</th>
                <th className="py-3.5 px-4">Closing Agent</th>
                <th className="py-3.5 px-4">Closing Date</th>
                <th className="py-3.5 px-4 text-right">Deal Value</th>
                <th className="py-3.5 px-4 text-right">Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((t) => (
                <tr key={t.transaction_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-slate-700 text-[11px]">
                    #{t.transaction_id}
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-bold text-slate-900 truncate max-w-xs">{t.property_title || 'Property #' + t.pid}</p>
                    <p className="text-[10px] text-slate-400">{t.property_city || ''}</p>
                  </td>
                  <td className="py-4 px-4 font-medium text-slate-800">
                    {t.buyer_name || 'Buyer #' + t.buyer_id}
                  </td>
                  <td className="py-4 px-4 text-slate-600">
                    <p>{t.seller_name || 'Seller #' + t.seller_id}</p>
                    {t.seller_upi && <p className="text-[10px] text-slate-400 font-mono">UPI: {t.seller_upi}</p>}
                  </td>
                  <td className="py-4 px-4 text-slate-700">
                    <span className="font-semibold">{t.agent_name || 'Agent #' + t.agent_id}</span>
                  </td>
                  <td className="py-4 px-4 text-slate-500 font-mono text-[11px]">
                    {t.transaction_date}
                  </td>
                  <td className="py-4 px-4 text-right font-black text-slate-900 text-sm">
                    {formatCurrency(t.transaction_amount)}
                  </td>
                  <td className="py-4 px-4 text-right font-bold text-emerald-700 text-xs">
                    {formatCurrency(t.commission)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
