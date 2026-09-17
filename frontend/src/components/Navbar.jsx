import React from 'react';
import { 
  Building2, 
  Home, 
  LayoutDashboard, 
  Users, 
  FileText, 
  ShieldCheck, 
  PlusCircle, 
  Sparkles,
  Briefcase,
  LogOut,
  UserCircle2
} from 'lucide-react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  user,
  onOpenAddProperty, 
  onOpenCloseDeal,
  onLogout,
  onGoHome
}) {
  const tabs = [
    { id: 'marketplace', label: 'Explore Homes', icon: Home },
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'properties', label: 'Properties', icon: Building2 },
    { id: 'agents', label: 'Agents Roster', icon: Briefcase },
    { id: 'clients', label: 'Clients (Buyers & Sellers)', icon: Users },
    { id: 'transactions', label: 'Deals & Sales', icon: FileText },
    { id: 'queries', label: 'SQL Query Studio', icon: Sparkles },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={onGoHome || (() => setCurrentTab('marketplace'))} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-900/40 group-hover:scale-105 transition-transform duration-200">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-serif-luxury text-2xl font-bold tracking-tight text-white flex items-center gap-1.5">
                MyDream<span className="text-emerald-400">Home</span>
              </span>
              <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">
                Real Estate Management System
              </p>
            </div>
          </div>

          {/* Role Indicator & Actions */}
          <div className="flex items-center space-x-3">
            {/* User badge */}
            {user && (
              <div className="hidden md:flex items-center gap-2 bg-slate-800/90 rounded-lg px-3 py-1.5 border border-slate-700/70 text-xs">
                <UserCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300 font-medium">{user.username}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                  user.role === 'admin'  ? 'bg-emerald-900/60 text-emerald-300' :
                  user.role === 'agent'  ? 'bg-blue-900/60 text-blue-300' :
                  user.role === 'office' ? 'bg-violet-900/60 text-violet-300' :
                  'bg-slate-700 text-slate-400'
                }`}>{user.role}</span>
              </div>
            )}

            {/* Action Buttons */}
            <button
              onClick={onOpenAddProperty}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold tracking-wide transition-colors shadow-md shadow-emerald-950/40"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Listing</span>
            </button>

            <button
              onClick={onOpenCloseDeal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 text-xs font-semibold tracking-wide transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Record Deal</span>
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              title="Sign out"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-rose-900/50 border border-slate-700 hover:border-rose-700 text-slate-400 hover:text-rose-400 text-xs font-semibold transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Bar Tabs */}
        <nav className="flex space-x-1 overflow-x-auto py-2 border-t border-slate-800/80 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
