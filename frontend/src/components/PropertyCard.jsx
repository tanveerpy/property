import React from 'react';
import { MapPin, BedDouble, Calendar, ArrowUpRight, User, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../api';

export default function PropertyCard({ property, onSelect, onRecordDeal }) {
  const isSold = property.status === 'sold';
  const isRent = property.status === 'rent';

  const statusBadge = () => {
    if (isSold) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-300 border border-rose-800">
          SOLD
        </span>
      );
    }
    if (isRent) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-300 border border-blue-800">
          FOR RENT
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800">
        FOR SALE
      </span>
    );
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      {/* Image & Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 cursor-pointer" onClick={() => onSelect(property)}>
        <img
          src={property.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {statusBadge()}
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-900/80 text-slate-200 backdrop-blur-sm border border-slate-700">
            {property.property_type || 'Apartment'}
          </span>
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between text-white">
          <div>
            <div className="text-xl font-bold tracking-tight text-white drop-shadow-md">
              {formatCurrency(property.price)}
              {isRent && <span className="text-xs font-normal text-slate-200 ml-1">/ month</span>}
            </div>
          </div>
          <span className="text-xs text-slate-300 drop-shadow">PID #{property.pid}</span>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 
            onClick={() => onSelect(property)} 
            className="font-semibold text-slate-900 text-base line-clamp-1 hover:text-emerald-700 cursor-pointer transition-colors"
          >
            {property.title}
          </h3>

          <div className="flex items-center text-xs text-slate-500 mt-1.5 gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{property.street}, {property.city} ({property.postalcode || 'N/A'})</span>
          </div>

          {/* Key Specs */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg">
              <BedDouble className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-800">{property.number_of_bedroom}</span>
              <span>Bedrooms</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Built:</span>
              <span className="font-semibold text-slate-800">{property.yoc || '2020'}</span>
            </div>
          </div>
        </div>

        {/* Agent and Action Bar */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
              {property.agent_name ? property.agent_name[0] : 'A'}
            </div>
            <div className="text-xs">
              <p className="font-medium text-slate-800 truncate max-w-[110px]">
                {property.agent_name || 'Agent Assigned'}
              </p>
              <p className="text-[10px] text-slate-400">Verified Agent</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {!isSold && onRecordDeal && (
              <button
                onClick={() => onRecordDeal(property)}
                title="Mark Deal as Closed"
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
              >
                Close Deal
              </button>
            )}
            <button
              onClick={() => onSelect(property)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 transition-colors"
              title="View Details"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
