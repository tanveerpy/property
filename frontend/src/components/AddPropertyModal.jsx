import React, { useState } from 'react';
import { X, Plus, Image, Building, MapPin } from 'lucide-react';

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'
];

export default function AddPropertyModal({ isOpen, onClose, agents = [], sellers = [], onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    status: 'sell',
    number_of_bedroom: '3',
    property_type: 'Apartment',
    city: 'Karachi',
    street: '',
    postalcode: '',
    yoc: new Date().getFullYear(),
    agent_id: agents[0]?.agent_id || '1',
    seller_id: sellers[0]?.seller_id || '1',
    image_url: PRESET_IMAGES[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!formData.price || !formData.street || !formData.city) {
      setErrorMsg('Please enter price, street, and city.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        if (onSubmitSuccess) onSubmitSuccess(data.data);
        onClose();
      } else {
        setErrorMsg(data.error || 'Failed to create listing.');
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-400">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-xl font-bold">List New Property</h3>
              <p className="text-xs text-slate-400">Publish a verified residential or commercial listing</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Listing Type</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full text-xs rounded-xl border-slate-200 bg-slate-50 p-2.5 font-medium border focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="sell">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {formData.status === 'rent' ? 'Monthly Rent (PKR)' : 'Sale Price (PKR)'}
              </label>
              <input
                type="number"
                name="price"
                required
                placeholder={formData.status === 'rent' ? 'e.g. 25000' : 'e.g. 7500000'}
                value={formData.price}
                onChange={handleChange}
                className="w-full text-xs rounded-xl border-slate-200 bg-slate-50 p-2.5 font-medium border focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bedrooms (BHK)</label>
              <select
                name="number_of_bedroom"
                value={formData.number_of_bedroom}
                onChange={handleChange}
                className="w-full text-xs rounded-xl border-slate-200 bg-slate-50 p-2.5 font-medium border focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4 BHK</option>
                <option value="5">5+ BHK</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Property Type</label>
              <select
                name="property_type"
                value={formData.property_type}
                onChange={handleChange}
                className="w-full text-xs rounded-xl border-slate-200 bg-slate-50 p-2.5 font-medium border focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Apartment">Apartment</option>
                <option value="Luxury Villa">Luxury Villa</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Duplex">Duplex</option>
                <option value="Modern Studio">Modern Studio</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Metropolitan City</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full text-xs rounded-xl border-slate-200 bg-slate-50 p-2.5 font-medium border focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Karachi">Karachi</option>
                <option value="Lahore">Lahore</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Rawalpindi">Rawalpindi</option>
                <option value="Faisalabad">Faisalabad</option>
                <option value="Peshawar">Peshawar</option>
                <option value="Multan">Multan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Year of Construction</label>
              <input
                type="number"
                name="yoc"
                value={formData.yoc}
                onChange={handleChange}
                className="w-full text-xs rounded-xl border-slate-200 bg-slate-50 p-2.5 font-medium border focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address & Landmark</label>
            <input
              type="text"
              name="street"
              required
              placeholder="e.g. Linking Road, Bandra West"
              value={formData.street}
              onChange={handleChange}
              className="w-full text-xs rounded-xl border-slate-200 bg-slate-50 p-2.5 font-medium border focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Postal Code</label>
              <input
                type="text"
                name="postalcode"
                placeholder="e.g. 400050"
                value={formData.postalcode}
                onChange={handleChange}
                className="w-full text-xs rounded-xl border-slate-200 bg-slate-50 p-2.5 font-medium border focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Agent</label>
              <select
                name="agent_id"
                value={formData.agent_id}
                onChange={handleChange}
                className="w-full text-xs rounded-xl border-slate-200 bg-slate-50 p-2.5 font-medium border focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {agents.map((ag) => (
                  <option key={ag.agent_id} value={ag.agent_id}>
                    {ag.fname} {ag.lname} ({ag.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Property Owner / Seller</label>
              <select
                name="seller_id"
                value={formData.seller_id}
                onChange={handleChange}
                className="w-full text-xs rounded-xl border-slate-200 bg-slate-50 p-2.5 font-medium border focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {sellers.map((s) => (
                  <option key={s.seller_id} value={s.seller_id}>
                    {s.fname} {s.lname}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Architectural Photo</label>
            <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
              {PRESET_IMAGES.map((img, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setFormData(prev => ({ ...prev, image_url: img }))}
                  className={`w-14 h-10 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    formData.image_url === img ? 'border-emerald-600 scale-105' : 'border-slate-200 opacity-70'
                  }`}
                >
                  <img src={img} alt="Preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <input
              type="url"
              name="image_url"
              placeholder="Or enter custom image URL"
              value={formData.image_url}
              onChange={handleChange}
              className="w-full text-xs rounded-xl border-slate-200 bg-slate-50 p-2 font-medium border focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Publish Listing'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
