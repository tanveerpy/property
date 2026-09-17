import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  Trash2, 
  Eye, 
  CheckCircle, 
  Filter, 
  LayoutGrid, 
  List, 
  MapPin, 
  BedDouble,
  DollarSign
} from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { formatCurrency } from '../api';

export default function PropertiesManager({
  properties = [],
  onSelectProperty,
  onOpenAddModal,
  onOpenCloseDeal,
  onDeleteProperty,
  onUpdateStatus
}) {
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = properties.filter((p) => {
    if (cityFilter !== 'all' && p.city.toLowerCase() !== cityFilter.toLowerCase()) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (search.trim()) {
      const term = search.toLowerCase();
      const matchTitle = (p.title || '').toLowerCase().includes(term);
      const matchCity = (p.city || '').toLowerCase().includes(term);
      const matchStreet = (p.street || '').toLowerCase().includes(term);
      if (!matchTitle && !matchCity && !matchStreet) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-slate-900">
            Properties Inventory Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Administer all residential and commercial inventory across all agency branches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Property</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by title, street, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Cities</option>
            <option value="Karachi">Karachi</option>
            <option value="Lahore">Lahore</option>
            <option value="Islamabad">Islamabad</option>
            <option value="Rawalpindi">Rawalpindi</option>
            <option value="Faisalabad">Faisalabad</option>
            <option value="Peshawar">Peshawar</option>
            <option value="Multan">Multan</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Statuses</option>
            <option value="sell">For Sale</option>
            <option value="rent">For Rent</option>
            <option value="sold">Sold</option>
          </select>
        </div>
      </div>

      {/* Content: Table or Grid */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">PID</th>
                  <th className="py-3 px-4">Property</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Type / BHK</th>
                  <th className="py-3 px-4">Price / Rent</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Agent</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => (
                  <tr key={p.pid} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      #{p.pid}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=100&q=80'}
                          alt={p.title}
                          className="w-10 h-10 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <p 
                            onClick={() => onSelectProperty(p)}
                            className="font-bold text-slate-900 cursor-pointer hover:text-emerald-700 transition-colors max-w-xs truncate"
                          >
                            {p.title}
                          </p>
                          <p className="text-[11px] text-slate-400">Built: {p.yoc || '2020'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-800">{p.city}</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{p.street}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-700">{p.number_of_bedroom} BHK</span>
                      <span className="text-[10px] text-slate-400 block">{p.property_type || 'Apartment'}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {formatCurrency(p.price)}
                      {p.status === 'rent' && <span className="text-[10px] font-normal text-slate-400 ml-0.5">/mo</span>}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        p.status === 'sold'
                          ? 'bg-rose-100 text-rose-800'
                          : p.status === 'rent'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-800">{p.agent_name || 'Agent ID ' + p.agent_id}</p>
                      <p className="text-[10px] text-slate-400">{p.agent_phone || ''}</p>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectProperty(p)}
                          className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {p.status !== 'sold' && onOpenCloseDeal && (
                          <button
                            onClick={() => onOpenCloseDeal(p)}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-lg text-[11px] border border-emerald-200 transition-colors"
                            title="Close Deal"
                          >
                            Deal
                          </button>
                        )}

                        {onDeleteProperty && (
                          <button
                            onClick={() => onDeleteProperty(p.pid)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <PropertyCard
              key={p.pid}
              property={p}
              onSelect={onSelectProperty}
              onRecordDeal={onOpenCloseDeal}
            />
          ))}
        </div>
      )}

    </div>
  );
}
