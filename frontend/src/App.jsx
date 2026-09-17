import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import MarketplaceView from './views/MarketplaceView';
import DashboardOverview from './views/DashboardOverview';
import PropertiesManager from './views/PropertiesManager';
import AgentsManager from './views/AgentsManager';
import ClientsManager from './views/ClientsManager';
import TransactionsManager from './views/TransactionsManager';
import QueryStudio from './views/QueryStudio';

import PropertyModal from './components/PropertyModal';
import AddPropertyModal from './components/AddPropertyModal';
import CloseDealModal from './components/CloseDealModal';

import { api } from './api';

export default function App() {
  const [currentTab, setCurrentTab] = useState('marketplace');
  const [user, setUser] = useState(null); // null = not logged in
  const [userRole, setUserRole] = useState('admin');

  const handleLogin = (userData) => {
    setUser(userData);
    setUserRole(userData.role);
  };

  const handleLogout = () => {
    setUser(null);
    setUserRole('admin');
    setCurrentTab('marketplace');
  };

  // Show login page if not authenticated
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Datasets
  const [properties, setProperties] = useState([]);
  const [agents, setAgents] = useState([]);
  const [offices, setOffices] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  // Modals
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);
  const [isCloseDealOpen, setIsCloseDealOpen] = useState(false);
  const [dealTargetProperty, setDealTargetProperty] = useState(null);

  // Toast / Alert notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch all core datasets
  const loadData = async () => {
    try {
      const [pRes, aRes, oRes, bRes, sRes, tRes, statRes] = await Promise.all([
        api.getProperties(),
        api.getAgents(),
        api.getOffices(),
        api.getBuyers(),
        api.getSellers(),
        api.getTransactions(),
        api.getAnalytics()
      ]);

      if (pRes.success) setProperties(pRes.data);
      if (aRes.success) setAgents(aRes.data);
      if (oRes.success) setOffices(oRes.data);
      if (bRes.success) setBuyers(bRes.data);
      if (sRes.success) setSellers(sRes.data);
      if (tRes.success) setTransactions(tRes.data);
      if (statRes.success) setAnalytics(statRes.data);
    } catch (err) {
      console.error('Failed to load application data:', err);
      showToast('Error loading database records', 'error');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRecordDeal = (property) => {
    setDealTargetProperty(property || null);
    setIsCloseDealOpen(true);
  };

  const handlePropertyCreated = () => {
    loadData();
    showToast('New property listing published successfully!');
  };

  const handleDealClosed = () => {
    loadData();
    showToast('Deal finalized! Property marked as SOLD and agent sales updated.');
  };

  const handleDeleteProperty = async (pid) => {
    if (!confirm('Are you sure you want to remove this property listing?')) return;
    try {
      const res = await api.deleteProperty(pid);
      if (res.success) {
        showToast('Property deleted successfully');
        loadData();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-600 selection:text-white">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className={`px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center gap-2 ${
            toast.type === 'error'
              ? 'bg-rose-900 text-rose-100 border-rose-700'
              : 'bg-emerald-950 text-emerald-100 border-emerald-700'
          }`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userRole={userRole}
        setUserRole={setUserRole}
        onOpenAddProperty={() => setIsAddPropertyOpen(true)}
        onOpenCloseDeal={() => handleRecordDeal(null)}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'marketplace' && (
          <MarketplaceView
            properties={properties}
            onSelectProperty={setSelectedProperty}
            onRecordDeal={handleRecordDeal}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardOverview
            analytics={analytics}
            onNavigateTab={setCurrentTab}
            onOpenAddProperty={() => setIsAddPropertyOpen(true)}
            onOpenCloseDeal={() => handleRecordDeal(null)}
          />
        )}

        {currentTab === 'properties' && (
          <PropertiesManager
            properties={properties}
            onSelectProperty={setSelectedProperty}
            onOpenAddModal={() => setIsAddPropertyOpen(true)}
            onOpenCloseDeal={handleRecordDeal}
            onDeleteProperty={handleDeleteProperty}
          />
        )}

        {currentTab === 'agents' && (
          <AgentsManager
            agents={agents}
            offices={offices}
            onAgentAdded={loadData}
          />
        )}

        {currentTab === 'clients' && (
          <ClientsManager
            buyers={buyers}
            sellers={sellers}
            agents={agents}
            onRefreshClients={loadData}
          />
        )}

        {currentTab === 'transactions' && (
          <TransactionsManager
            transactions={transactions}
            onOpenCloseDealModal={() => handleRecordDeal(null)}
          />
        )}

        {currentTab === 'queries' && (
          <QueryStudio />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-300">MyDreamHome Management System</p>
            <p className="text-[11px] text-slate-500">
              Modernized full-stack architecture powered by Express REST API, SQLite, and React.
            </p>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Branch Offices: Karachi • Lahore • Islamabad • Rawalpindi</span>
            <span>•</span>
            <button 
              onClick={() => setCurrentTab('queries')}
              className="hover:text-emerald-400 transition-colors"
            >
              SQL Analytics
            </button>
          </div>
        </div>
      </footer>

      {/* Property Details Modal */}
      <PropertyModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onRecordDeal={handleRecordDeal}
      />

      {/* Add Property Listing Modal */}
      <AddPropertyModal
        isOpen={isAddPropertyOpen}
        onClose={() => setIsAddPropertyOpen(false)}
        agents={agents}
        sellers={sellers}
        onSubmitSuccess={handlePropertyCreated}
      />

      {/* Close Deal / Record Transaction Modal */}
      <CloseDealModal
        isOpen={isCloseDealOpen}
        onClose={() => setIsCloseDealOpen(false)}
        preselectedProperty={dealTargetProperty}
        properties={properties}
        buyers={buyers}
        sellers={sellers}
        agents={agents}
        onDealClosed={handleDealClosed}
      />

    </div>
  );
}
