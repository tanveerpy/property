import React, { useState, useEffect } from 'react';
import {
  Building2, MapPin, Search, Star, TrendingUp, Users, Home,
  ArrowRight, ChevronRight, Phone, Mail, Shield, Award, Zap
} from 'lucide-react';

const FEATURED = [
  {
    title: '4 BHK Luxury Villa in DHA Phase 6',
    city: 'Lahore', price: 'PKR 9.00 Crore', type: 'Luxury Villa', beds: 4,
    img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    badge: 'Featured',
  },
  {
    title: '3 BHK Apartment in Sector F-7',
    city: 'Islamabad', price: 'PKR 7.50 Crore', type: 'Apartment', beds: 3,
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    badge: 'Hot Deal',
  },
  {
    title: '2 BHK Modern Studio in Clifton',
    city: 'Karachi', price: 'PKR 5.00 Crore', type: 'Penthouse', beds: 2,
    img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    badge: 'New',
  },
];

const STATS = [
  { icon: Home,      label: 'Properties Listed', value: '58+' },
  { icon: Users,     label: 'Expert Agents',     value: '20'  },
  { icon: Building2, label: 'Branch Offices',    value: '4'   },
  { icon: Award,     label: 'Deals Closed',      value: '200+'},
];

const CITIES = ['Karachi','Lahore','Islamabad','Rawalpindi','Peshawar','Quetta','Faisalabad','Multan'];

export default function HomePage({ onSignIn, onSignUp, onBrowse, onListProperty }) {
  const [searchCity, setSearchCity] = useState('');
  const [scrolled, setScrolled]     = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">

      {/* ── Navbar ──────────────────────────────────────────── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={onBrowse}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight">MyDream<span className="text-emerald-400">Home</span></span>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest -mt-0.5">Pakistan Real Estate</p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <button onClick={onBrowse} className="hover:text-emerald-400 transition-colors">Browse</button>
            <button onClick={onListProperty} className="hover:text-emerald-400 transition-colors">List Property</button>
            <a href="#cities" className="hover:text-emerald-400 transition-colors">Cities</a>
            <a href="#about" className="hover:text-emerald-400 transition-colors">About</a>
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onSignIn}
              className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 rounded-xl transition-all"
            >
              Sign In
            </button>
            <button
              onClick={onSignUp}
              className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl shadow-lg shadow-emerald-900/40 transition-all"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80"
            alt="Luxury home"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/80 to-slate-950" />
        </div>
        {/* Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 pt-24">
          <div className="inline-flex items-center gap-2 bg-emerald-900/40 border border-emerald-700/40 text-emerald-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            <Zap className="w-3.5 h-3.5" /> Pakistan's Premier Real Estate Platform
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Find Your
            <span className="block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Dream Home
            </span>
            in Pakistan
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
            Browse thousands of premium properties across Karachi, Lahore, Islamabad and beyond.
            Expert agents. Transparent pricing. All in PKR.
          </p>

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8">
            <div className="relative flex-1">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <select
                value={searchCity}
                onChange={e => setSearchCity(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 text-slate-200 rounded-xl pl-10 pr-4 py-3.5 text-sm outline-none focus:border-emerald-500 appearance-none"
              >
                <option value="">Select a city...</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button
              onClick={onBrowse}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-900/40 transition-all text-sm"
            >
              <Search className="w-4 h-4" /> Search Properties
            </button>
          </div>

          {/* CTA row */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onBrowse}
              className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 text-sm font-medium transition-colors group"
            >
              Browse all listings <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={onListProperty}
              className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 text-sm font-medium transition-colors group"
            >
              List your property <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────────── */}
      <section className="py-16 border-y border-slate-800/60 bg-slate-900/40">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map(({ icon: Icon, label, value }) => (
            <div key={label} className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900/40 border border-emerald-700/30 flex items-center justify-center mx-auto">
                <Icon className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-3xl font-bold text-white">{value}</div>
              <div className="text-xs text-slate-400 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Properties ──────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-emerald-400 text-sm font-semibold uppercase tracking-wider mb-2">Hand-picked listings</p>
            <h2 className="text-3xl font-bold">Featured Properties</h2>
          </div>
          <button
            onClick={onBrowse}
            className="hidden sm:flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 font-medium transition-colors group"
          >
            View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {FEATURED.map((p) => (
            <div
              key={p.title}
              onClick={onBrowse}
              className="group cursor-pointer bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-700/60 hover:shadow-2xl hover:shadow-emerald-900/20 transition-all duration-300"
            >
              <div className="relative h-52 overflow-hidden">
                <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3">
                  <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">{p.badge}</span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="bg-slate-900/80 text-slate-300 text-[10px] font-medium px-2.5 py-1 rounded-full border border-slate-700/50">{p.type}</span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1 text-slate-500 text-xs mb-2">
                  <MapPin className="w-3 h-3" /> {p.city}
                </div>
                <h3 className="text-sm font-semibold text-white leading-snug mb-3 group-hover:text-emerald-300 transition-colors">{p.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold text-base">{p.price}</span>
                  <span className="text-xs text-slate-500">{p.beds} Beds</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Cities ──────────────────────────────────────────── */}
      <section id="cities" className="py-16 bg-slate-900/40 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-emerald-400 text-sm font-semibold uppercase tracking-wider mb-2">We cover all major cities</p>
            <h2 className="text-3xl font-bold">Browse by City</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {CITIES.map(city => (
              <button
                key={city}
                onClick={onBrowse}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-emerald-900/40 border border-slate-700 hover:border-emerald-600/60 rounded-xl text-sm font-medium text-slate-300 hover:text-emerald-300 transition-all"
              >
                <MapPin className="w-3.5 h-3.5" /> {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── About / Trust ───────────────────────────────────── */}
      <section id="about" className="py-20 max-w-5xl mx-auto px-4 text-center">
        <p className="text-emerald-400 text-sm font-semibold uppercase tracking-wider mb-3">Why MyDreamHome?</p>
        <h2 className="text-3xl font-bold mb-12">Built for Pakistan's Property Market</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Shield, title: 'Verified Listings', desc: 'Every property is vetted by our local agents before going live.' },
            { icon: TrendingUp, title: 'PKR Pricing', desc: 'All prices in Pakistani Rupees with Lakh & Crore formatting.' },
            { icon: Phone, title: '24/7 Agent Support', desc: 'Dedicated agents in Karachi, Lahore, Islamabad & Rawalpindi.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-emerald-700/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900/40 border border-emerald-700/30 flex items-center justify-center mx-auto mb-4">
                <Icon className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-bold text-white mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────── */}
      <section className="py-16 mx-4 mb-16 rounded-3xl bg-gradient-to-r from-emerald-900/60 to-teal-900/60 border border-emerald-700/30 max-w-7xl lg:mx-auto">
        <div className="text-center px-4">
          <h2 className="text-3xl font-bold mb-3">Ready to Find Your Home?</h2>
          <p className="text-slate-400 mb-8">Join thousands of buyers and sellers on Pakistan's trusted platform.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={onSignUp}
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-900/40 transition-all flex items-center gap-2"
            >
              Create Free Account <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onBrowse}
              className="px-8 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold rounded-xl transition-all"
            >
              Browse as Guest
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-slate-800 py-8 text-center text-slate-500 text-xs">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Building2 className="w-4 h-4 text-emerald-500" />
          <span className="text-slate-300 font-semibold">MyDreamHome</span>
        </div>
        <p>Pakistan Real Estate Management System · Karachi · Lahore · Islamabad · Rawalpindi</p>
        <p className="mt-1">Full-stack · Express REST API · SQLite · React · Vite</p>
      </footer>

    </div>
  );
}
