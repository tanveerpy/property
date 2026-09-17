import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, DollarSign, Calendar, User, Building, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../api';

export default function CloseDealModal({
  isOpen,
  onClose,
  preselectedProperty,
  properties = [],
  buyers = [],
  sellers = [],
  agents = [],
  onDealClosed
}) {
  const [selectedPid, setSelectedPid] = useState('');
  const [buyerId, setBuyerId] = useState('');
  const [sellerId, setSellerId] = useState('');
  const [agentId, setAgentId] = useState('');
  const [amount, setAmount] = useState('');
  const [commission, setCommission] = useState('');
  const [dealDate, setDealDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-sync when preselectedProperty changes
  useEffect(() => {
    if (preselectedProperty) {
      setSelectedPid(preselectedProperty.pid);
      setSellerId(preselectedProperty.seller_id || (sellers[0]?.seller_id || ''));
      setAgentId(preselectedProperty.agent_id || (agents[0]?.agent_id || ''));
      setAmount(preselectedProperty.price);
      setCommission(Math.round(preselectedProperty.price * 0.05));
    } else if (properties.length > 0) {
      const p = properties.find(item => item.status !== 'sold') || properties[0];
      setSelectedPid(p.pid);
      setSellerId(p.seller_id || (sellers[0]?.seller_id || ''));
      setAgentId(p.agent_id || (agents[0]?.agent_id || ''));
      setAmount(p.price);
      setCommission(Math.round(p.price * 0.05));
    }
    if (buyers.length > 0 && !buyerId) {
      setBuyerId(buyers[0].buyer_id);
    }
  }, [preselectedProperty, properties, buyers, sellers, agents]);

  if (!isOpen) return null;

  const handlePropertyChange = (e) => {
    const pid = e.target.value;
    setSelectedPid(pid);
    const p = properties.find(item => String(item.pid) === String(pid));
    if (p) {
      setSellerId(p.seller_id || '');
      setAgentId(p.agent_id || '');
      setAmount(p.price);
      setCommission(Math.round(p.price * 0.05));
    }
  };

  const handleAmountChange = (e) => {
    const val = Number(e.target.value);
    setAmount(val);
    setCommission(Math.round(val * 0.05));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedPid || !buyerId || !agentId || !amount) {
      setErrorMsg('Please select property, buyer, agent, and closing amount.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        pid: Number(selectedPid),
        buyer_id: Number(buyerId),
        seller_id: sellerId ? Number(sellerId) : null,
        agent_id: Number(agentId),
        transaction_date: dealDate,
        transaction_amount: Number(amount),
        commission: Number(commission)
      };

      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        if (onDealClosed) onDealClosed(data.data);
        onClose();
      } else {
        setErrorMsg(data.error || 'Failed to close deal.');
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-xl font-bold">Record Closed Deal</h3>
              <p className="text-xs text-slate-400">Finalize property transaction & update agent sales</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Property</label>
            <select
              value={selectedPid}
              onChange={handlePropertyChange}
              className="w-full text-xs rounded-xl border-slate-200 bg-slate-50 p-2.5 font-medium border focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {properties.map((p) => (
                <option key={p.pid} value={p.pid}>
                  PID #{p.pid} - {p.title} ({p.status.toUpperCase()}) — {formatCurrency(p.price)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Buyer (Client)</label>
              <select
                value={buyerId}
                onChange={(e) => setBuyerId(e.target.value)}
                className="w-full text-xs rounded-xl border-slate-200 bg-slate-50 p-2.5 font-medium border focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {buyers.map((b) => (
                  <option key={b.buyer_id} value={b.buyer_id}>
                    #{b.buyer_id} - {b.fname} {b.lname}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Seller (Owner)</label>
              <select
                value={sellerId}
                onChange={(e) => setSellerId(e.target.value)}
                className="w-full text-xs rounded-xl border-slate-200 bg-slate-50 p-2.5 font-medium border focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {sellers.map((s) => (
                  <option key={s.seller_id} value={s.seller_id}>
                    #{s.seller_id} - {s.fname} {s.lname}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Closing Agent</label>
              <select
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                className="w-full text-xs rounded-xl border-slate-200 bg-slate-50 p-2.5 font-medium border focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {agents.map((a) => (
                  <option key={a.agent_id} value={a.agent_id}>
                    {a.fname} {a.lname} ({a.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Transaction Date</label>
              <input
                type="date"
                value={dealDate}
                onChange={(e) => setDealDate(e.target.value)}
                className="w-full text-xs rounded-xl border-slate-200 bg-slate-50 p-2.5 font-medium border focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Final Transaction Amount (PKR)</label>
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                required
                className="w-full text-xs rounded-xl border-slate-200 bg-slate-50 p-2.5 font-medium border focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Commission Earned (5% standard)</label>
              <input
                type="number"
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
                required
                className="w-full text-xs rounded-xl border-slate-200 bg-slate-50 p-2.5 font-medium border focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50/60 border border-emerald-100 rounded-xl text-xs text-emerald-800 space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Automated Trigger Action:
            </p>
            <p>
              Closing this deal will update the property status to <span className="font-semibold text-rose-700">SOLD</span>, increment the agent's sales count by +1, and add PKR {Number(amount).toLocaleString('en-PK')} to the agent's sales record.
            </p>
          </div>

          {/* Submit Actions */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Recording Deal...' : 'Confirm & Close Deal'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
