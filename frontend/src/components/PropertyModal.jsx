import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  BedDouble, 
  Calendar, 
  Phone, 
  Mail, 
  Building, 
  CheckCircle2, 
  Calculator, 
  UserCheck, 
  ArrowRight
} from 'lucide-react';
import { formatCurrency } from '../api';

export default function PropertyModal({ property, onClose, onRecordDeal }) {
  const [loanTenureYears, setLoanTenureYears] = useState(20);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);

  if (!property) return null;

  // EMI calculation: P * r * (1+r)^n / ((1+r)^n - 1)
  const isRent = property.status === 'rent';
  const isSold = property.status === 'sold';
  const principal = property.price * (1 - downPaymentPercent / 100);
  const monthlyRate = (interestRate / 12) / 100;
  const numMonths = loanTenureYears * 12;
  const emi = !isRent && principal > 0
    ? (principal * monthlyRate * Math.pow(1 + monthlyRate, numMonths)) / (Math.pow(1 + monthlyRate, numMonths) - 1)
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/60 text-white hover:bg-slate-900 transition-colors backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative aspect-[21/9] bg-slate-900 overflow-hidden">
          <img
            src={property.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
          
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between text-white">
            <div>
              <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
                isSold ? 'bg-rose-600 text-white' : isRent ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
              }`}>
                {isSold ? 'Sold' : isRent ? 'For Rent' : 'For Sale'}
              </span>
              <h2 className="text-2xl font-bold font-serif-luxury drop-shadow-md text-white">
                {property.title}
              </h2>
              <div className="flex items-center text-xs text-slate-300 gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{property.street}, {property.city} — {property.postalcode}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold text-emerald-300 drop-shadow">
                {formatCurrency(property.price)}
                {isRent && <span className="text-xs font-normal text-slate-300 ml-1">/ mo</span>}
              </div>
              <p className="text-[11px] text-slate-400">PID #{property.pid} • Listed in {property.year_of_listing || '2024'}</p>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          
          {/* Quick Specifications */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
              <p className="text-xs text-slate-500 font-medium">Bedrooms</p>
              <p className="text-lg font-bold text-slate-900 mt-0.5 flex items-center justify-center gap-1">
                <BedDouble className="w-4 h-4 text-emerald-600" />
                {property.number_of_bedroom} BHK
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
              <p className="text-xs text-slate-500 font-medium">Year Built</p>
              <p className="text-lg font-bold text-slate-900 mt-0.5 flex items-center justify-center gap-1">
                <Calendar className="w-4 h-4 text-emerald-600" />
                {property.yoc || '2019'}
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
              <p className="text-xs text-slate-500 font-medium">Property Type</p>
              <p className="text-base font-bold text-slate-900 mt-0.5 truncate">
                {property.property_type || 'Apartment'}
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
              <p className="text-xs text-slate-500 font-medium">Availability</p>
              <p className={`text-base font-bold mt-0.5 capitalize ${isSold ? 'text-rose-600' : 'text-emerald-700'}`}>
                {property.status}
              </p>
            </div>
          </div>

          {/* Assigned Agent & Seller Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Agent Info Box */}
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <UserCheck className="w-5 h-5 text-emerald-700" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                  Assigned Listing Agent
                </h4>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold text-base flex items-center justify-center shrink-0">
                  {property.agent_name ? property.agent_name[0] : 'A'}
                </div>
                <div className="text-xs space-y-1">
                  <p className="font-bold text-slate-900 text-sm">{property.agent_name || 'Listing Agent'}</p>
                  <p className="text-slate-600 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    {property.agent_phone || '+91 98765 43210'}
                  </p>
                  <p className="text-slate-600 flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-emerald-600" />
                    {property.agent_email || 'agent@propertylele.com'}
                  </p>
                  <p className="text-slate-500 flex items-center gap-1.5 pt-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    Office Branch: {property.city}
                  </p>
                </div>
              </div>
            </div>

            {/* Seller Info Box */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-slate-700" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Property Ownership / Seller
                </h4>
              </div>
              <div className="text-xs space-y-1.5">
                <p className="font-bold text-slate-900 text-sm">
                  {property.seller_name || `Seller #ID ${property.seller_id || 1}`}
                </p>
                <p className="text-slate-600 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  {property.seller_phone || '+91 98200 11223'}
                </p>
                <p className="text-slate-600 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  {property.seller_email || 'owner@domain.com'}
                </p>
                {property.seller_upi && (
                  <p className="text-slate-600 bg-white px-2 py-1 rounded border border-slate-200 inline-block font-mono text-[11px] mt-1">
                    UPI: {property.seller_upi}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* EMI Estimator (For Purchase Properties) */}
          {!isRent && (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-sm font-bold tracking-wide">Home Loan & EMI Estimator</h4>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Estimated EMI:</span>
                  <p className="text-lg font-extrabold text-emerald-400">
                    PKR {Math.round(emi).toLocaleString('en-PK')}<span className="text-xs text-slate-300 font-normal">/mo</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">Down Payment ({downPaymentPercent}%)</label>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    step="5"
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-slate-400">{formatCurrency(property.price * downPaymentPercent / 100)}</span>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Tenure ({loanTenureYears} Years)</label>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="5"
                    value={loanTenureYears}
                    onChange={(e) => setLoanTenureYears(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-slate-400">{numMonths} monthly installments</span>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Interest Rate ({interestRate}%)</label>
                  <input
                    type="range"
                    min="6.5"
                    max="12.0"
                    step="0.25"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-slate-400">Fixed rate benchmark</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Close Details
          </button>

          <div className="flex items-center gap-3">
            {!isSold && onRecordDeal && (
              <button
                onClick={() => {
                  onClose();
                  onRecordDeal(property);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold tracking-wide shadow-md transition-all"
              >
                <span>Record Deal for this Property</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
