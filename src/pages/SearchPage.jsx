import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { db } from '../firebase';
import Navbar from '../components/Common/Navbar';
import Footer from '../components/Common/Footer';
import PropertyCard from '../components/Common/PropertyCard';
import SearchBar from '../components/Common/SearchBar';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';

const DEFAULT_CITIES = ['Lagos', 'Abuja', 'Port Harcourt', 'Yenagoa', 'Enugu', 'Benin City', 'Uyo'];

const DEMO_PROPERTIES = [
  { id: '1', title: 'Luxury 3BR Apartment Lekki', type: 'shortlet', price: '45000', city: 'Lagos', location: 'Lekki Phase 1', bedrooms: 3, bathrooms: 3, images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'], avgRating: 4.8, agentName: 'Chidi Okafor' },
  { id: '2', title: 'Modern Studio Victoria Island', type: 'shortlet', price: '25000', city: 'Lagos', location: 'Victoria Island', bedrooms: 1, bathrooms: 1, images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'], avgRating: 4.6, agentName: 'Amaka Eze' },
  { id: '3', title: 'Spacious 4BR Duplex Ikeja GRA', type: 'rent', price: '4500000', city: 'Lagos', location: 'Ikeja GRA', bedrooms: 4, bathrooms: 4, size: 320, images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'], avgRating: 4.9, agentName: 'Emeka Nwosu' },
  { id: '4', title: 'Executive 2BR Flat Maitama', type: 'rent', price: '2800000', city: 'Abuja', location: 'Maitama', bedrooms: 2, bathrooms: 2, size: 150, images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'], avgRating: 4.7, agentName: 'Ngozi Adeyemi' },
  { id: '5', title: 'New Build 5BR Smart Home Banana Island', type: 'sale', price: '120000000', city: 'Lagos', location: 'Banana Island', bedrooms: 5, bathrooms: 6, size: 650, images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'], avgRating: 5.0, agentName: 'Tunde Bakare' },
  { id: '6', title: 'Cozy 3BR Bungalow GRA Enugu', type: 'sale', price: '35000000', city: 'Enugu', location: 'GRA', bedrooms: 3, bathrooms: 2, size: 200, images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'], avgRating: 4.5, agentName: 'Ifeoma Obi' },
  { id: '7', title: 'Penthouse in Ikoyi', type: 'shortlet', price: '80000', city: 'Lagos', location: 'Ikoyi', bedrooms: 4, bathrooms: 4, size: 450, images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'], avgRating: 4.9, agentName: 'Bola Adesanya' },
  { id: '8', title: 'Affordable 2BR Flat Surulere', type: 'rent', price: '900000', city: 'Lagos', location: 'Surulere', bedrooms: 2, bathrooms: 1, size: 100, images: ['https://images.unsplash.com/photo-1486304873000-235643847519?w=800'], avgRating: 4.2, agentName: 'Kehinde Lawal' },
];

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    city: searchParams.get('city') || '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    sortBy: 'newest',
  });

  useEffect(() => {
    const fetchProps = async () => {
      setLoading(true);
      try {
        const snap = await get(ref(db, 'properties'));
        if (snap.exists()) {
          const data = Object.entries(snap.val())
            .map(([id, p]) => ({ id, ...p }))
            .filter(p => p.status === 'active' || !p.status);
          setProperties(data.length > 0 ? data : DEMO_PROPERTIES);
        } else {
          setProperties(DEMO_PROPERTIES);
        }
      } catch {
        setProperties(DEMO_PROPERTIES);
      }
      setLoading(false);
    };
    fetchProps();
  }, []);

  useEffect(() => {
    let result = [...properties];
    const q = searchParams.get('q')?.toLowerCase();
    if (q) result = result.filter(p => p.title?.toLowerCase().includes(q) || p.location?.toLowerCase().includes(q) || p.city?.toLowerCase().includes(q));
    if (filters.type) result = result.filter(p => p.type === filters.type);
    if (filters.city) result = result.filter(p => p.city?.toLowerCase() === filters.city.toLowerCase());
    if (filters.minPrice) result = result.filter(p => parseInt(p.price) >= parseInt(filters.minPrice));
    if (filters.maxPrice) result = result.filter(p => parseInt(p.price) <= parseInt(filters.maxPrice));
    if (filters.bedrooms) result = result.filter(p => parseInt(p.bedrooms) >= parseInt(filters.bedrooms));
    if (filters.sortBy === 'price-asc') result.sort((a, b) => parseInt(a.price) - parseInt(b.price));
    if (filters.sortBy === 'price-desc') result.sort((a, b) => parseInt(b.price) - parseInt(a.price));
    if (filters.sortBy === 'rating') result.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
    setFiltered(result);
  }, [filters, properties, searchParams]);

  const clearFilters = () => setFilters({ type: '', city: '', minPrice: '', maxPrice: '', bedrooms: '', sortBy: 'newest' });

  // Merge default cities with any city an agent has typed in while listing a property,
  // so newly-added cities automatically show up as a filter option.
  const ALL_CITIES = Array.from(new Set([
    ...DEFAULT_CITIES,
    ...properties.map(p => p.city).filter(Boolean),
  ])).sort();

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navbar />
      <div className="pt-20">
        {/* Search header */}
        <div className="bg-primary-700 py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-primary-200 text-sm mb-4">{filtered.length} properties found</p>
            <SearchBar compact />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-primary-500 transition-colors shadow-sm">
              <SlidersHorizontal size={16} /> Filters
            </button>

            {['shortlet', 'rent', 'sale'].map(t => (
              <button key={t} onClick={() => setFilters(f => ({ ...f, type: f.type === t ? '' : t }))} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize border transition-all ${filters.type === t ? 'bg-primary-600 text-white border-primary-600' : 'bg-white border-gray-200 text-gray-700 hover:border-primary-400'}`}>
                {t}
              </button>
            ))}

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select value={filters.sortBy} onChange={e => setFilters(f => ({ ...f, sortBy: e.target.value }))} className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white outline-none focus:border-primary-500">
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Advanced Filters</h3>
                <button onClick={clearFilters} className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                  <X size={14} /> Clear all
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">City</label>
                  <select value={filters.city} onChange={e => setFilters(f => ({ ...f, city: e.target.value }))} className="input-field text-sm py-2">
                    <option value="">All Cities</option>
                    {ALL_CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Min Price (₦)</label>
                  <input type="number" value={filters.minPrice} onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))} placeholder="0" className="input-field text-sm py-2" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Max Price (₦)</label>
                  <input type="number" value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))} placeholder="Any" className="input-field text-sm py-2" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Min Bedrooms</label>
                  <select value={filters.bedrooms} onChange={e => setFilters(f => ({ ...f, bedrooms: e.target.value }))} className="input-field text-sm py-2">
                    <option value="">Any</option>
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}+</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <div className="skeleton h-56 w-full" />
                  <div className="p-4 space-y-3">
                    <div className="skeleton h-4 w-3/4 rounded" />
                    <div className="skeleton h-3 w-1/2 rounded" />
                    <div className="skeleton h-5 w-1/3 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="font-display text-2xl font-bold text-gray-800 mb-2">No properties found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms</p>
              <button onClick={clearFilters} className="btn-primary mt-6">Clear Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}