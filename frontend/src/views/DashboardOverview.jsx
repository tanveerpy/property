import React from 'react';
import { 
  Building, 
  DollarSign, 
  TrendingUp, 
  Users, 
  FileCheck, 
  MapPin, 
  Award, 
  ArrowUpRight, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { formatCurrency } from '../api';

export default function DashboardOverview({ 
  analytics, 
  onNavigateTab, 
  onOpenAddProperty, 
  onOpenCloseDeal 
}) {
  if (!analytics) {
    return (
      <div className="p-12 text-center text-slate-500 text-xs">
        Loading executive dashboard data...
      </div>
    );
  }

  const {
    totalProperties = 0,
    forSaleCount = 0,
    forRentCount = 0,
    soldCount = 0,
    totalDealsCount = 0,
    totalVolume = 0,
    totalCommission = 0,
    totalAgents = 0,
    totalBuyers = 0,
    totalSellers = 0,
    cityBreakdown = [],
    topAgents = [],
    recentTransactions = []
  } = analytics;

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-slate-900">
            Executive Real Estate Intelligence
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            System performance, revenue metrics, agent benchmarks, and regional stock.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddProperty}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/20"
          >
            + Add Listing
          </button>
          <button
            onClick={onOpenCloseDeal}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all"
          >
            Record Deal
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Volume */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Sales Volume</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900">{formatCurrency(totalVolume)}</h3>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              Across {totalDealsCount} closed transactions
            </p>
          </div>
        </div>

        {/* Commission Pool */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Agent Commissions</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900">{formatCurrency(totalCommission)}</h3>
            <p className="text-xs text-amber-600 font-medium mt-1">
              Distributed to {totalAgents} active agents
            </p>
          </div>
        </div>

        {/* Inventory Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Portfolio</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900">{totalProperties} Units</h3>
            <p className="text-xs text-slate-500 mt-1">
              <span className="text-emerald-700 font-bold">{forSaleCount} sale</span> • <span className="text-blue-700 font-bold">{forRentCount} rent</span> • <span className="text-rose-700 font-bold">{soldCount} sold</span>
            </p>
          </div>
        </div>

        {/* Client Roster */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Client Base</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900">{totalBuyers + totalSellers} Clients</h3>
            <p className="text-xs text-slate-500 mt-1">
              {totalBuyers} verified buyers, {totalSellers} sellers
            </p>
          </div>
        </div>

      </div>

      {/* Main Grid: Agent Leaderboard & Regional Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Performing Agents */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Top Performing Agents Leaderboard</h3>
                <p className="text-xs text-slate-500">Ranked by closed gross transaction value & deal count</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('agents')}
              className="text-xs text-emerald-600 font-semibold hover:underline inline-flex items-center gap-1"
            >
              <span>View All 20 Agents</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Agent</th>
                  <th className="py-2.5 px-3">City</th>
                  <th className="py-2.5 px-3 text-center">Deals Closed</th>
                  <th className="py-2.5 px-3 text-right">Total Closed Volume</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topAgents.map((ag, idx) => (
                  <tr key={ag.agent_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          idx === 0 ? 'bg-amber-400 text-amber-950' : idx === 1 ? 'bg-slate-300 text-slate-800' : 'bg-amber-700/20 text-amber-900'
                        }`}>
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-bold text-slate-900">{ag.name}</p>
                          <p className="text-[10px] text-slate-400">{ag.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{ag.city}</td>
                    <td className="py-3 px-3 text-center font-bold text-slate-800">
                      {ag.NOP_sale}
                    </td>
                    <td className="py-3 px-3 text-right font-extrabold text-emerald-700">
                      {formatCurrency(ag.total_saleAmount)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={onOpenCloseDeal}
                        className="px-2 py-1 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 text-[11px] font-medium transition-colors"
                      >
                        Assign Deal
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* City Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Regional Inventory</h3>
              <p className="text-xs text-slate-500">Distribution across key metros</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {cityBreakdown.map((item) => {
              const pct = Math.round((item.total_properties / (totalProperties || 1)) * 100);
              return (
                <div key={item.city} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{item.city}</span>
                    <span className="font-semibold text-slate-500">{item.total_properties} units ({pct}%)</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${(item.for_sale / item.total_properties) * 100}%` }}
                      className="bg-emerald-600 h-full"
                      title={`${item.for_sale} For Sale`}
                    />
                    <div
                      style={{ width: `${(item.for_rent / item.total_properties) * 100}%` }}
                      className="bg-blue-600 h-full"
                      title={`${item.for_rent} For Rent`}
                    />
                    <div
                      style={{ width: `${(item.sold / item.total_properties) * 100}%` }}
                      className="bg-rose-500 h-full"
                      title={`${item.sold} Sold`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                    <span>Avg: {formatCurrency(item.avg_price)}</span>
                    <div className="flex gap-2">
                      <span className="text-emerald-700">{item.for_sale} sale</span>
                      <span className="text-blue-700">{item.for_rent} rent</span>
                      <span className="text-rose-700">{item.sold} sold</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Recent Transactions Feed */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <FileCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Recent Closed Deals</h3>
              <p className="text-xs text-slate-500">Live feed of finalized sales and commissions</p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('transactions')}
            className="text-xs text-emerald-600 font-semibold hover:underline inline-flex items-center gap-1"
          >
            <span>View Full Audit Log</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentTransactions.map((t) => (
            <div key={t.transaction_id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold text-slate-700">Deal #{t.transaction_id}</span>
                <span>{t.transaction_date}</span>
              </div>
              <p className="font-bold text-slate-900 text-xs truncate">{t.property_title}</p>
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Buyer</span>
                  <span className="font-medium text-slate-700">{t.buyer_name}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Closing Value</span>
                  <span className="font-bold text-emerald-700">{formatCurrency(t.transaction_amount)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
