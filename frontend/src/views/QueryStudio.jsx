import React, { useState, useEffect } from 'react';
import { Sparkles, Terminal, Play, Database, CheckCircle, Clock } from 'lucide-react';
import { formatCurrency } from '../api';

const PRESET_QUERIES = [
  {
    id: 'top_earners',
    title: 'Top Performing Agents Leaderboard',
    description: 'Ranks agents by total sales revenue and deal counts with office branch locations.',
    sql: `SELECT a.agent_id, a.fname || ' ' || a.lname as name, a.city, a.NOP_sale as deals, a.total_saleAmount as revenue, o.city as office
FROM agent a
JOIN office o ON a.office_id = o.office_id
ORDER BY a.total_saleAmount DESC, a.NOP_sale DESC;`
  },
  {
    id: 'recently_built',
    title: 'Modern Properties Built 2018 or Later',
    description: 'Filters residential developments constructed from 2018 onwards.',
    sql: `SELECT p.pid, p.title, p.city, p.price, p.status, p.yoc as year_built, p.number_of_bedroom as bedrooms, a.fname as agent
FROM properties p
LEFT JOIN agent a ON p.agent_id = a.agent_id
WHERE p.yoc >= 2018
ORDER BY p.yoc DESC, p.price DESC;`
  },
  {
    id: 'city_pricing',
    title: 'Metropolitan Price & Inventory Analysis',
    description: 'Calculates average, minimum, and maximum property price grouped by metropolitan city.',
    sql: `SELECT city, COUNT(*) as total_units, ROUND(AVG(price), 2) as average_price, MIN(price) as min_price, MAX(price) as max_price
FROM properties
GROUP BY city
ORDER BY total_units DESC;`
  },
  {
    id: 'high_value_listings',
    title: 'Prime Luxury Estates (Price >= PKR 5,000,000)',
    description: 'Premium investment listings valued at PKR 50 Lakhs and above.',
    sql: `SELECT p.pid, p.title, p.city, p.street, p.price, p.number_of_bedroom as bedrooms, p.status, a.fname as agent_name
FROM properties p
LEFT JOIN agent a ON p.agent_id = a.agent_id
WHERE p.price >= 5000000
ORDER BY p.price DESC;`
  },
  {
    id: 'rental_deals',
    title: 'Verified Active Rental Inventory',
    description: 'Available apartments and homes for lease with monthly rent and agent direct contact.',
    sql: `SELECT p.pid, p.title, p.city, p.street, p.price as monthly_rent, p.number_of_bedroom as bedrooms, a.fname as agent_name, a.phoneno
FROM properties p
LEFT JOIN agent a ON p.agent_id = a.agent_id
WHERE p.status = 'rent'
ORDER BY p.price ASC;`
  }
];

export default function QueryStudio() {
  const [activeQuery, setActiveQuery] = useState(PRESET_QUERIES[0]);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);

  const runSelectedQuery = async (queryObj) => {
    setIsLoading(true);
    const start = performance.now();
    try {
      const res = await fetch(`/api/queries?type=${queryObj.id}`);
      const data = await res.json();
      const end = performance.now();
      setExecutionTime((end - start).toFixed(1));
      if (data.success) {
        setResults(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runSelectedQuery(activeQuery);
  }, [activeQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-md">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif-luxury text-2xl font-bold text-slate-900">
              Interactive SQL Query Studio
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Execute live relational database queries and analytical insights against the SQLite datastore.
            </p>
          </div>
        </div>

        {executionTime && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Executed in {executionTime}ms</span>
          </div>
        )}
      </div>

      {/* Query Selector Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {PRESET_QUERIES.map((q) => {
          const isSelected = activeQuery.id === q.id;
          return (
            <button
              key={q.id}
              onClick={() => setActiveQuery(q)}
              className={`p-4 rounded-2xl text-left border transition-all duration-200 ${
                isSelected
                  ? 'bg-slate-900 border-slate-800 text-white shadow-lg shadow-slate-900/10'
                  : 'bg-white border-slate-200/80 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Sparkles className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
              </div>
              <p className="font-bold text-xs line-clamp-1">{q.title}</p>
              <p className={`text-[10px] mt-1 line-clamp-2 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                {q.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* SQL Terminal Display */}
      <div className="rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl">
        <div className="px-5 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>sql_query.sql</span>
          </div>
          <button
            onClick={() => runSelectedQuery(activeQuery)}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{isLoading ? 'Running...' : 'Re-Run Query'}</span>
          </button>
        </div>
        <div className="p-5 font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto whitespace-pre">
          {activeQuery.sql}
        </div>
      </div>

      {/* Query Result Dataset */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">{results?.title || activeQuery.title}</h3>
            <p className="text-xs text-slate-500">{results?.description || activeQuery.description}</p>
          </div>
          <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
            {results?.count || 0} Records Returned
          </span>
        </div>

        <div className="overflow-x-auto">
          {results?.data && results.data.length > 0 ? (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  {Object.keys(results.data[0]).map((key) => (
                    <th key={key} className="py-3 px-4 capitalize">
                      {key.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    {Object.entries(row).map(([k, val], valIdx) => (
                      <td key={valIdx} className="py-3 px-4 text-slate-700">
                        {k.includes('price') || k.includes('revenue') || k.includes('monthly_rent')
                          ? formatCurrency(val)
                          : typeof val === 'number'
                          ? val
                          : String(val || '—')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs">
              {isLoading ? 'Executing database query...' : 'No records returned.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
