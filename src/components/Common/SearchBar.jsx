import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home, Calendar } from 'lucide-react';

const PROPERTY_TYPES = ['All', 'Shortlet', 'Rent', 'Sale'];
const CITIES = ['Lagos', 'Abuja', 'Port Harcourt', 'Yenagoa', 'Enugu', 'Benin City', 'Uyo'];

export default function SearchBar({ compact = false }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All');
  const [city, setCity] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (type !== 'All') params.set('type', type.toLowerCase());
    if (city) params.set('city', city);
    navigate(`/search?${params.toString()}`);
  };

  if (compact) {
    return (
      <form onSubmit={handleSearch} className="flex items-center gap-2 bg-white rounded-xl shadow-md p-2 border border-gray-100">
        <Search size={18} className="text-gray-400 ml-2" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search properties..."
          className="flex-1 outline-none text-gray-800 text-sm bg-transparent"
        />
        <button type="submit" className="btn-primary py-2 px-4 text-sm">Search</button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-3 md:p-4 w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Location */}
        <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 transition-all">
          <MapPin size={18} className="text-primary-500 flex-shrink-0" />
          <div className="flex-1">
            <label className="text-xs text-gray-500 font-medium">Location</label>
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              className="block w-full text-sm text-gray-800 bg-transparent outline-none font-medium"
            >
              <option value="">Any City</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Type */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 transition-all min-w-[150px]">
          <Home size={18} className="text-primary-500 flex-shrink-0" />
          <div className="flex-1">
            <label className="text-xs text-gray-500 font-medium">Property Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="block w-full text-sm text-gray-800 bg-transparent outline-none font-medium"
            >
              {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Search term */}
        <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 transition-all">
          <Search size={18} className="text-primary-500 flex-shrink-0" />
          <div className="flex-1">
            <label className="text-xs text-gray-500 font-medium">Search</label>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Property name or area..."
              className="block w-full text-sm text-gray-800 bg-transparent outline-none font-medium placeholder-gray-400"
            />
          </div>
        </div>

        <button type="submit" className="btn-primary px-8 py-3 rounded-xl flex items-center gap-2">
          <Search size={18} />
          <span>Search</span>
        </button>
      </div>
    </form>
  );
}
