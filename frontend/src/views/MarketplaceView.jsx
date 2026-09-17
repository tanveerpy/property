import React, { useState } from 'react';
import PropertyCard from '../components/PropertyCard';
import { Search, SlidersHorizontal, MapPin, Building, RotateCcw, Sparkles } from 'lucide-react';

export default function MarketplaceView({ properties, onSelectProperty, onRecordDeal }) {
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all'); // all, sell, rent, sold
  const [bedroomFilter, setBedroomFilter] = useState('all');
  const [maxPriceFilter, setMaxPriceFilter] = useState('');

  const cities = ['All', 'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Peshawar', 'Multan'];

  const filteredProperties = properties.filter((p) => {
    // City filter
    if (selectedCity !== 'All' && p.city.toLowerCase() !== selectedCity.toLowerCase()) {
      return false;
    }
    // Status filter
    if (statusFilter !== 'all' && p.status !== statusFilter) {
      return false;
    }
    // Bedroom filter
    if (bedroomFilter !== 'all' && String(p.number_of_bedroom) !== String(bedroomFilter)) {
      return false;
    }
    // Max price filter
    if (maxPriceFilter && Number(p.price) > Number(maxPriceFilter)) {
      return false;
    }
    // Search keyword
    if (search.trim()) {
      const term = search.toLowerCase();
      const matchTitle = (p.title || '').toLowerCase().includes(term);
      const matchStreet = (p.street || '').toLowerCase().includes(term);
      const matchCity = (p.city || '').toLowerCase().includes(term);
      if (!matchTitle && !matchStreet && !matchCity) return false;
    }
    return true;
  });

  const resetFilters = () => {
    setSearch('');
    setSelectedCity('All');
    setStatusFilter('all');
    setBedroomFilter('all');
    setMaxPriceFilter('');
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white shadow-2xl p-8 sm:p-12 border border-slate-800">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover Premium Realty Across Pakistan</span>
          </div>

          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Find Your Dream Home With Confidence.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Browse verified luxury apartments, penthouses, villas, and modern rentals managed by certified real estate agents across premier locations.
          </p>

          {/* Quick Metrics in Hero */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700/60 max-w-md">
            <div>
              <p className="text-2xl font-black text-emerald-400">{properties.length}+</p>
              <p className="text-xs text-slate-400">Total Listings</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">7</p>
              <p className="text-xs text-slate-400">Metro Hubs</p>
            </div>
            <div>
              <p className="text-2xl font-black text-amber-400">100%</p>
              <p className="text-xs text-slate-400">Verified Agents</p>
            </div>
          </div>
        </div>

        {/* Decorative Background Accents */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-emerald-600/10 to-transparent pointer-events-none" />
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 space-y-4">
        
        {/* Top Search Bar & Status Pills */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by city, street, or landmark..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>

          {/* Status Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full md:w-auto overflow-x-auto">
            {[
              { id: 'all', label: 'All Listings' },
              { id: 'sell', label: 'For Sale' },
              { id: 'rent', label: 'For Rent' },
              { id: 'sold', label: 'Sold Archive' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  statusFilter === st.id
                    ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          
          {/* City Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Select City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c} {c !== 'All' ? 'City' : 'Pakistan'}
                </option>
              ))}
            </select>
          </div>

          {/* Bedrooms Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Bedrooms (BHK)
            </label>
            <select
              value={bedroomFilter}
              onChange={(e) => setBedroomFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Any BHK</option>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4 BHK</option>
              <option value="5">5+ BHK</option>
            </select>
          </div>

          {/* Max Price Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Max Price Budget
            </label>
            <select
              value={maxPriceFilter}
              onChange={(e) => setMaxPriceFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Any Budget</option>
              <option value="25000">Under PKR 25,000 / mo</option>
              <option value="50000">Under PKR 50,000 / mo</option>
              <option value="1000000">Under PKR 10 Lakhs</option>
              <option value="5000000">Under PKR 50 Lakhs</option>
              <option value="10000000">Under PKR 1 Crore</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>

        </div>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-800">
          Showing <span className="text-emerald-600 font-bold">{filteredProperties.length}</span> Verified Properties
        </p>
        <span className="text-xs text-slate-400">Updated in real-time</span>
      </div>

      {/* Property Cards Grid */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((prop) => (
            <PropertyCard
              key={prop.pid}
              property={prop}
              onSelect={onSelectProperty}
              onRecordDeal={onRecordDeal}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 max-w-md mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Building className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No matching properties found</h3>
          <p className="text-xs text-slate-500">
            We couldn't find any listings matching your active filters. Try broadening your criteria.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-500 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
