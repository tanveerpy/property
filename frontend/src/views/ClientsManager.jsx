import React, { useState } from 'react';
import { Users, UserPlus, Phone, Mail, CreditCard, Trash2, Search, X } from 'lucide-react';

export default function ClientsManager({
  buyers = [],
  sellers = [],
  agents = [],
  onRefreshClients
}) {
  const [activeTab, setActiveTab] = useState('buyers'); // 'buyers' or 'sellers'
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [clientForm, setClientForm] = useState({
    fname: '',
    lname: '',
    phoneno: '',
    email: '',
    agent_id: agents[0]?.agent_id || 1,
    UPI_ID: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  const currentList = activeTab === 'buyers' ? buyers : sellers;
  const filtered = currentList.filter((item) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    const fullName = `${item.fname} ${item.lname || ''}`.toLowerCase();
    const matchEmail = (item.email || '').toLowerCase().includes(term);
    const matchPhone = (item.phoneno || '').toLowerCase().includes(term);
    return fullName.includes(term) || matchEmail || matchPhone;
  });

  const handleDelete = async (id) => {
    if (!confirm(`Are you sure you want to delete this ${activeTab === 'buyers' ? 'buyer' : 'seller'}?`)) return;
    try {
      const endpoint = activeTab === 'buyers' ? `/api/buyers/${id}` : `/api/sellers/${id}`;
      await fetch(endpoint, { method: 'DELETE' });
      if (onRefreshClients) onRefreshClients();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!clientForm.fname || !clientForm.phoneno) {
      setMsg('Name and phone are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      const endpoint = activeTab === 'buyers' ? '/api/buyers' : '/api/sellers';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientForm)
      });
      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        setClientForm({
          fname: '',
          lname: '',
          phoneno: '',
          email: '',
          agent_id: agents[0]?.agent_id || 1,
          UPI_ID: ''
        });
        if (onRefreshClients) onRefreshClients();
      } else {
        setMsg(data.error || 'Failed to add client.');
      }
    } catch (err) {
      setMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-slate-900">
            Clientele Management (Buyers & Sellers)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Maintain accounts, direct contact points, UPI payment handles, and assigned agents.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/20"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New {activeTab === 'buyers' ? 'Buyer' : 'Seller'}</span>
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        
        {/* Toggle Pills */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-full md:w-auto">
          <button
            onClick={() => setActiveTab('buyers')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'buyers'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Verified Buyers ({buyers.length})
          </button>
          <button
            onClick={() => setActiveTab('sellers')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'sellers'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Property Owners & Sellers ({sellers.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search ${activeTab} by name, email, or phone...`}
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
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Email Address</th>
                {activeTab === 'sellers' && <th className="py-3 px-4">UPI Settlement ID</th>}
                <th className="py-3 px-4">Assigned Agent</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((client) => {
                const id = activeTab === 'buyers' ? client.buyer_id : client.seller_id;
                return (
                  <tr key={id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                      #{id}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {client.fname} {client.lname}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {client.phoneno}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 truncate max-w-xs">
                      {client.email || 'N/A'}
                    </td>
                    {activeTab === 'sellers' && (
                      <td className="py-3.5 px-4">
                        {client.UPI_ID ? (
                          <span className="font-mono text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2 py-0.5 rounded">
                            {client.UPI_ID}
                          </span>
                        ) : (
                          <span className="text-slate-300 text-[10px]">—</span>
                        )}
                      </td>
                    )}
                    <td className="py-3.5 px-4 text-slate-700">
                      {client.agent_name || (client.agent_id ? `Agent #${client.agent_id}` : 'Unassigned')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <h3 className="font-serif-luxury text-lg font-bold">
                Register New {activeTab === 'buyers' ? 'Buyer' : 'Seller'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs">
              {msg && <p className="text-rose-600 bg-rose-50 p-2.5 rounded-xl">{msg}</p>}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={clientForm.fname}
                    onChange={(e) => setClientForm({ ...clientForm, fname: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={clientForm.lname}
                    onChange={(e) => setClientForm({ ...clientForm, lname: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="+91-9876543210"
                  value={clientForm.phoneno}
                  onChange={(e) => setClientForm({ ...clientForm, phoneno: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="client@example.com"
                  value={clientForm.email}
                  onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                />
              </div>

              {activeTab === 'sellers' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">UPI ID (Settlement)</label>
                  <input
                    type="text"
                    placeholder="name@okhdfcbank"
                    value={clientForm.UPI_ID}
                    onChange={(e) => setClientForm({ ...clientForm, UPI_ID: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assign Consulting Agent</label>
                <select
                  value={clientForm.agent_id}
                  onChange={(e) => setClientForm({ ...clientForm, agent_id: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                >
                  {agents.map((a) => (
                    <option key={a.agent_id} value={a.agent_id}>
                      {a.fname} {a.lname} ({a.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  {isSubmitting ? 'Saving...' : 'Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
