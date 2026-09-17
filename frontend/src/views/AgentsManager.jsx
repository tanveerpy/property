import React, { useState } from 'react';
import { Briefcase, Search, Plus, Phone, Mail, MapPin, Award, Building, DollarSign, X } from 'lucide-react';
import { formatCurrency } from '../api';

export default function AgentsManager({ agents = [], offices = [], onAgentAdded }) {
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAgent, setNewAgent] = useState({
    fname: '',
    lname: '',
    email: '',
    phoneno: '',
    city: 'Karachi',
    street: '',
    postalcode: '',
    commision: 0.50,
    office_id: offices[0]?.office_id || 125
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  const filtered = agents.filter((a) => {
    if (cityFilter !== 'all' && a.city.toLowerCase() !== cityFilter.toLowerCase()) return false;
    if (search.trim()) {
      const term = search.toLowerCase();
      const fullName = `${a.fname} ${a.lname || ''}`.toLowerCase();
      const matchCity = (a.city || '').toLowerCase().includes(term);
      const matchEmail = (a.email || '').toLowerCase().includes(term);
      if (!fullName.includes(term) && !matchCity && !matchEmail) return false;
    }
    return true;
  });

  const handleCreateAgent = async (e) => {
    e.preventDefault();
    if (!newAgent.fname || !newAgent.phoneno) {
      setMsg('Name and phone number are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAgent)
      });
      const data = await res.json();
      if (data.success) {
        if (onAgentAdded) onAgentAdded();
        setIsAddModalOpen(false);
        setNewAgent({
          fname: '',
          lname: '',
          email: '',
          phoneno: '',
          city: 'Karachi',
          street: '',
          postalcode: '',
          commision: 0.50,
          office_id: offices[0]?.office_id || 125
        });
      } else {
        setMsg(data.error || 'Failed to add agent.');
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
            Real Estate Agents Directory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Licensed agency partners managing buyer & seller portfolios across key regions.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/20"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Agent</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search agent by name, email, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Cities ({agents.length} Agents)</option>
            <option value="Karachi">Karachi</option>
            <option value="Lahore">Lahore</option>
            <option value="Islamabad">Islamabad</option>
            <option value="Rawalpindi">Rawalpindi</option>
            <option value="Faisalabad">Faisalabad</option>
            <option value="Peshawar">Peshawar</option>
            <option value="Multan">Multan</option>
          </select>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((agent) => (
          <div
            key={agent.agent_id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-black text-lg flex items-center justify-center shadow-md">
                    {agent.fname[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {agent.fname} {agent.lname}
                    </h4>
                    <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                      ID #{agent.agent_id} • Licensed Agent
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">
                  {agent.city}
                </span>
              </div>

              {/* Contact Information */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{agent.phoneno}</span>
                </p>
                <p className="flex items-center gap-2 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{agent.email}</span>
                </p>
                <p className="flex items-center gap-2 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{agent.street}, {agent.city}</span>
                </p>
              </div>

              {/* Performance Stats */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
                <div className="bg-slate-50 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Deals</span>
                  <span className="text-sm font-black text-slate-900">{agent.NOP_sale || 0}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Commission</span>
                  <span className="text-sm font-black text-emerald-700">{agent.commision}%</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Listings</span>
                  <span className="text-sm font-black text-slate-900">{agent.active_listings || 0}</span>
                </div>
              </div>
            </div>

            {/* Total Sale Closed Box */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">Total Closed Value:</span>
              <span className="font-extrabold text-emerald-700 text-sm">
                {formatCurrency(agent.total_saleAmount)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Agent Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <h3 className="font-serif-luxury text-lg font-bold">Register Real Estate Agent</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAgent} className="p-6 space-y-4 text-xs">
              {msg && <p className="text-rose-600 bg-rose-50 p-2.5 rounded-xl">{msg}</p>}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={newAgent.fname}
                    onChange={(e) => setNewAgent({ ...newAgent, fname: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={newAgent.lname}
                    onChange={(e) => setNewAgent({ ...newAgent, lname: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={newAgent.phoneno}
                    onChange={(e) => setNewAgent({ ...newAgent, phoneno: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newAgent.email}
                    onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City Location</label>
                  <input
                    type="text"
                    value={newAgent.city}
                    onChange={(e) => setNewAgent({ ...newAgent, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    value={newAgent.street}
                    onChange={(e) => setNewAgent({ ...newAgent, street: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Commission Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newAgent.commision}
                    onChange={(e) => setNewAgent({ ...newAgent, commision: parseFloat(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Branch Office</label>
                  <select
                    value={newAgent.office_id}
                    onChange={(e) => setNewAgent({ ...newAgent, office_id: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                  >
                    {offices.map((o) => (
                      <option key={o.office_id} value={o.office_id}>
                        {o.city} Office (#{o.office_id})
                      </option>
                    ))}
                  </select>
                </div>
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
                  {isSubmitting ? 'Registering...' : 'Save Agent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
