import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { db } from '../firebase';
import Navbar from '../components/Common/Navbar';
import Footer from '../components/Common/Footer';
import SearchBar from '../components/Common/SearchBar';
import PropertyCard from '../components/Common/PropertyCard';
import StarRating from '../components/Common/StarRating';
import {
  Shield, Clock, Award, TrendingUp, Home, Users, Key, ArrowRight,
  CheckCircle, MapPin, Phone, ChevronRight, Play, Star, Search,
  Instagram, MessageCircle, Mail, Smartphone, Building2, KeyRound, HomeIcon
} from 'lucide-react';

// App store links — update when ready
const APPSTORE_URL = null;
const PLAYSTORE_URL = null;

const DEMO_PROPERTIES = [
  { id: '1', title: 'Luxury 3BR Apartment in Lekki', type: 'shortlet', price: '45000', city: 'Lagos', location: 'Lekki Phase 1', bedrooms: 3, bathrooms: 3, images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'], avgRating: 4.8, agentName: 'Chidi Okafor' },
  { id: '2', title: 'Modern Studio in Victoria Island', type: 'shortlet', price: '25000', city: 'Lagos', location: 'Victoria Island', bedrooms: 1, bathrooms: 1, images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'], avgRating: 4.6, agentName: 'Amaka Eze' },
  { id: '3', title: 'Spacious 4BR Duplex', type: 'rent', price: '4500000', city: 'Lagos', location: 'Ikeja GRA', bedrooms: 4, bathrooms: 4, size: 320, images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'], avgRating: 4.9, agentName: 'Emeka Nwosu' },
  { id: '4', title: 'Executive 2BR Flat Maitama', type: 'rent', price: '2800000', city: 'Abuja', location: 'Maitama', bedrooms: 2, bathrooms: 2, size: 150, images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'], avgRating: 4.7, agentName: 'Ngozi Adeyemi' },
  { id: '5', title: 'New Build 5BR Smart Home', type: 'sale', price: '120000000', city: 'Lagos', location: 'Banana Island', bedrooms: 5, bathrooms: 6, size: 650, images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'], avgRating: 5.0, agentName: 'Tunde Bakare' },
  { id: '6', title: 'Cozy 3BR Bungalow Enugu', type: 'sale', price: '35000000', city: 'Enugu', location: 'GRA', bedrooms: 3, bathrooms: 2, size: 200, images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'], avgRating: 4.5, agentName: 'Ifeoma Obi' },
];

const TESTIMONIALS = [
  { name: 'Adaeze Okonkwo', role: 'Renter, Lagos', text: 'Found my dream apartment in just 2 days! My Wari made the whole process so smooth and the agent was professional.', rating: 5, avatar: 'https://ui-avatars.com/api/?name=Adaeze+Okonkwo&background=6b8e23&color=fff' },
  { name: 'Babatunde Adeleke', role: 'Property Buyer, Abuja', text: 'Bought my first home through My Wari. The transparency and support throughout the process was incredible.', rating: 5, avatar: 'https://ui-avatars.com/api/?name=Babatunde+Adeleke&background=5C3D2E&color=fff' },
  { name: 'Chioma Nwachukwu', role: 'Shortlet Guest, Port Harcourt', text: 'The shortlet I booked was exactly as described. Amazing photos, great location. Will definitely use My Wari again!', rating: 5, avatar: 'https://ui-avatars.com/api/?name=Chioma+Nwachukwu&background=6b8e23&color=fff' },
  { name: 'Emeka Okafor', role: 'Agent', text: 'As an agent, My Wari has tripled my bookings. The platform is easy to use and payments are always on time.', rating: 5, avatar: 'https://ui-avatars.com/api/?name=Emeka+Okafor&background=5C3D2E&color=fff' },
];

// Curated "hero" cities — always shown first, each with a hand-picked photo.
// These stay fixed regardless of what's in the database.
const CURATED_CITIES = [
  // Lagos — Victoria Island cityscape by Chuks Ugwuh (confirmed unsplash.com/photos/G0OqiEiHP1Y)
  { name: 'Lagos',         img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80' },
  // Abuja — aerial residential view by Ovinuchi Ejiohuo (confirmed unsplash.com/photos/q4U9Pyfz-vQ)
  { name: 'Abuja',         img: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800&q=80' },
  // Port Harcourt — clean Nigerian city/residential street
  { name: 'Port Harcourt', img: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&q=80' },
  // Yenagoa — waterfront Niger Delta style residential
  { name: 'Yenagoa',       img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80' },
];

// Generic fallback photo used for any city an agent adds that doesn't have a
// hand-picked image yet (e.g. a brand-new city typed in on the Add Property form).
const FALLBACK_CITY_IMG = 'https://images.unsplash.com/photo-1577415124269-fc1140a69e91?w=800&q=80';

// Minimum number of live listings a non-curated city needs before it earns its
// own tile on the homepage — keeps a single test listing from triggering a tile.
const MIN_LISTINGS_FOR_CITY_TILE = 1;

// Max number of extra (non-curated) city tiles to show alongside the curated ones.
const MAX_EXTRA_CITY_TILES = 4;

const FEATURES = [
  { icon: Shield, title: 'Verified Properties', desc: 'Every listing is verified by our team before going live' },
  { icon: Clock, title: 'Instant Booking', desc: 'Book and confirm your stay in minutes, 24/7' },
  { icon: Award, title: 'Best Price Guarantee', desc: 'Find a lower price? We\'ll match it, guaranteed' },
  { icon: TrendingUp, title: 'Secure Payments', desc: 'Pay with confidence via Paystack — Nigeria\'s most trusted gateway' },
];

const TYPES = [
  { label: 'Shortlets', icon: Building2, iconColor: 'text-blue-600', iconBg: 'bg-blue-100', desc: 'Daily/weekly stays', type: 'shortlet', color: 'from-blue-50 to-blue-100', border: 'border-blue-200' },
  { label: 'For Rent', icon: Home, iconColor: 'text-amber-600', iconBg: 'bg-amber-100', desc: 'Monthly/yearly rentals', type: 'rent', color: 'from-amber-50 to-amber-100', border: 'border-amber-200' },
  { label: 'For Sale', icon: KeyRound, iconColor: 'text-green-600', iconBg: 'bg-green-100', desc: 'Buy your dream home', type: 'sale', color: 'from-green-50 to-green-100', border: 'border-green-200' },
];

function AppStoreBadge({ store }) {
  const isApple = store === 'apple';
  const url = isApple ? APPSTORE_URL : PLAYSTORE_URL;
  const handleClick = (e) => {
    if (!url) {
      e.preventDefault();
      alert('🚀 Coming Soon! The My Wari app will be available ' + (isApple ? 'on the App Store' : 'on Google Play') + ' very soon. Stay tuned!');
    }
  };
  return (
    <a
      href={url || '#'}
      onClick={handleClick}
      target={url ? '_blank' : undefined}
      rel="noopener noreferrer"
      className="flex items-center gap-3 bg-gray-900 hover:bg-gray-700 text-white rounded-2xl px-5 py-3 transition-all duration-200 border border-gray-700 hover:border-gray-500 group"
    >
      {isApple ? (
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white flex-shrink-0">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white flex-shrink-0">
          <path d="M3.18 23.76c.3.17.64.24.99.2l12.6-7.27-2.77-2.77-10.82 9.84zM.53 1.09C.2 1.42 0 1.96 0 2.67v18.66c0 .71.2 1.25.53 1.58l.08.08 10.46-10.46v-.25L.61 1.01l-.08.08zM20.67 10.34l-2.99-1.72-3.09 3.09 3.09 3.09 3-1.73c.86-.5.86-1.3 0-1.73zM4.17.24L16.77 7.5l-2.77 2.77L3.18.23c.35-.04.69.03.99.01z"/>
        </svg>
      )}
      <div className="flex flex-col leading-tight">
        <span className="text-[10px] text-gray-400 group-hover:text-gray-300">{isApple ? 'Download on the' : 'Get it on'}</span>
        <span className="text-sm font-bold">{isApple ? 'App Store' : 'Google Play'}</span>
      </div>
    </a>
  );
}

export default function HomePage() {
  const [properties, setProperties] = useState([]);
  const [allProperties, setAllProperties] = useState([]); // unfiltered/uncapped, used for city counts
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const snap = await get(ref(db, 'properties'));
        if (snap.exists()) {
          const data = Object.entries(snap.val())
            .map(([id, p]) => ({ id, ...p }))
            .filter(p => p.status === 'active' || !p.status);
          setAllProperties(data.length > 0 ? data : DEMO_PROPERTIES);
          const featured = [...data]
            .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
            .slice(0, 12);
          setProperties(featured.length > 0 ? featured : DEMO_PROPERTIES);
        } else {
          setAllProperties(DEMO_PROPERTIES);
          setProperties(DEMO_PROPERTIES);
        }
      } catch (e) {
        setAllProperties(DEMO_PROPERTIES);
        setProperties(DEMO_PROPERTIES);
      }
      setLoading(false);
    };
    fetchProperties();
  }, []);

  const filtered = activeTab === 'all' ? properties : properties.filter(p => p.type === activeTab);

  // ── Popular Cities: curated cities first (real listing counts), then any
  // additional cities agents have added that have enough listings, using a
  // generic fallback photo since they don't have a hand-picked image.
  const cityCounts = allProperties.reduce((acc, p) => {
    if (!p.city) return acc;
    acc[p.city] = (acc[p.city] || 0) + 1;
    return acc;
  }, {});

  const curatedCityNames = new Set(CURATED_CITIES.map(c => c.name.toLowerCase()));

  const curatedTiles = CURATED_CITIES.map(c => ({
    name: c.name,
    img: c.img,
    count: cityCounts[c.name] || 0,
  }));

  const extraTiles = Object.entries(cityCounts)
    .filter(([name, count]) => !curatedCityNames.has(name.toLowerCase()) && count >= MIN_LISTINGS_FOR_CITY_TILE)
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_EXTRA_CITY_TILES)
    .map(([name, count]) => ({ name, img: FALLBACK_CITY_IMG, count }));

  const displayCities = [...curatedTiles, ...extraTiles];

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/40 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-24">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white/90 text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Trusted by 50,000+ Nigerians
          </div>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Find Your Perfect<br />
            <span className="text-primary-400">Nigerian Home</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Discover shortlets, rentals, and properties for sale across Nigeria. Verified listings, seamless booking, instant receipts.
          </p>

          <div className="mb-8">
            <SearchBar />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-white/70 text-sm">
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400" /> Verified Listings</span>
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400" /> Instant Booking</span>
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400" /> Secure Payments</span>
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400" /> 24/7 Support</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-primary-700 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: '50K+', label: 'Happy Customers' },
            { val: '12K+', label: 'Properties Listed' },
            { val: '500+', label: 'Verified Agents' },
            { val: '36', label: 'States Covered' },
          ].map(s => (
            <div key={s.label}>
              <p className="font-display text-4xl font-bold text-white mb-1">{s.val}</p>
              <p className="text-primary-200 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BROWSE BY TYPE */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary-600 font-semibold uppercase tracking-wider text-sm mb-2">What are you looking for?</p>
            <h2 className="section-title">Browse by Category</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TYPES.map(t => (
              <Link key={t.type} to={`/search?type=${t.type}`} className={`group bg-gradient-to-br ${t.color} border-2 ${t.border} rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                <div className={`w-16 h-16 ${t.iconBg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <t.icon size={32} className={t.iconColor} strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">{t.label}</h3>
                <p className="text-gray-600 mb-4">{t.desc}</p>
                <span className="flex items-center gap-1 text-primary-600 font-semibold text-sm group-hover:gap-2 transition-all">
                  Browse <ArrowRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-primary-600 font-semibold uppercase tracking-wider text-sm mb-2">Handpicked for you</p>
              <h2 className="section-title">Featured Properties</h2>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm border border-gray-200">
              {['all', 'shortlet', 'rent', 'sale'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${activeTab === tab ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {tab === 'all' ? 'All' : tab}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.slice(0, 6).map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
          <div className="text-center mt-10">
            <Link to="/search" className="btn-primary inline-flex items-center gap-2">
              View All Properties <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary-600 font-semibold uppercase tracking-wider text-sm mb-2">Simple Process</p>
            <h2 className="section-title">How My Wari Works</h2>
            <p className="text-gray-500 max-w-xl mx-auto">From search to keys in hand — we make finding and booking your next home effortless.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', icon: Search, title: 'Search', desc: 'Browse thousands of verified properties across Nigeria' },
              { step: '02', icon: Home, title: 'Choose', desc: 'Select the perfect property that matches your needs' },
              { step: '03', icon: Key, title: 'Book & Pay', desc: 'Securely book and pay via Paystack in seconds' },
              { step: '04', icon: CheckCircle, title: 'Move In', desc: 'Get your receipt and move into your new home' },
            ].map((s, i) => (
              <div key={i} className="text-center relative">
                {i < 3 && <div className="hidden md:block absolute top-8 left-[60%] w-[40%] h-0.5 bg-gradient-to-r from-primary-200 to-primary-100" />}
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 relative">
                  <s.icon size={28} className="text-primary-700" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">{i + 1}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BROWSE BY CITY */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary-600 font-semibold uppercase tracking-wider text-sm mb-2">Explore Nigeria</p>
            <h2 className="section-title">Popular Cities</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayCities.map(c => (
              <Link key={c.name} to={`/search?city=${c.name}`} className="group relative rounded-2xl overflow-hidden h-48 cursor-pointer">
                <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-display font-bold text-lg">{c.name}</p>
                  <p className="text-white/70 text-sm">{c.count > 0 ? `${c.count} listing${c.count === 1 ? '' : 's'}` : 'New on My Wari'}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-primary-600 font-semibold uppercase tracking-wider text-sm mb-3">Why My Wari</p>
              <h2 className="section-title mb-4">Your Trusted Real Estate Partner</h2>
              <p className="text-gray-500 mb-8">We've built the most trusted property platform in Nigeria. Every listing verified, every agent vetted, every payment secured.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {FEATURES.map((f, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <f.icon size={20} className="text-primary-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{f.title}</h4>
                      <p className="text-gray-500 text-sm">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex gap-4">
                <Link to="/register" className="btn-primary">Get Started Free</Link>
                <Link to="/search" className="btn-secondary">Explore Listings</Link>
              </div>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80" alt="Feature" className="rounded-2xl shadow-2xl w-full h-[500px] object-cover" />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 max-w-[220px]">
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm font-semibold text-gray-800">4.9 Average Rating</p>
                <p className="text-xs text-gray-500">From 12,000+ reviews</p>
              </div>
              <div className="absolute -top-6 -right-6 bg-primary-700 text-white rounded-2xl shadow-xl p-5">
                <p className="font-display text-3xl font-bold">50K+</p>
                <p className="text-primary-200 text-sm">Happy customers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT US TEASER */}
      <section className="py-20 px-4 bg-[#F5F0E8]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80" alt="About My Wari" className="rounded-2xl shadow-2xl w-full h-[460px] object-cover" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary-900/30 to-transparent" />
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur rounded-2xl p-5 shadow-lg">
                <p className="font-display text-2xl font-bold text-primary-700">Wari</p>
                <p className="text-sm text-gray-500 italic">Ijaw word meaning "Home"</p>
              </div>
            </div>
            <div>
              <p className="text-primary-600 font-semibold uppercase tracking-wider text-sm mb-3">Our Story</p>
              <h2 className="section-title mb-5">About My Wari</h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                My Wari is a digital platform that helps people easily find and book trusted shortlet apartments and Airbnb-style stays across different cities. Inspired by the Ijaw word <strong>"Wari,"</strong> meaning <em>Home</em>, our mission is to make every stay comfortable, secure, and affordable.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Through the My Wari mobile app, users can discover available apartments, book instantly, make secure payments, and get location directions with ease. We partner with apartment owners, property managers, and agents to connect guests with quality accommodations while helping properties reach more customers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/about" className="btn-primary inline-flex items-center gap-2">
                  Read Our Full Story <ArrowRight size={16} />
                </Link>
                <Link to="/contact" className="btn-secondary inline-flex items-center gap-2">
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary-700 to-primary-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary-300 font-semibold uppercase tracking-wider text-sm mb-2">Customer Stories</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">What Our Customers Say</h2>
            <p className="text-primary-200 max-w-xl mx-auto">Real stories from real Nigerians who found their homes through My Wari.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all">
                <StarRating rating={t.rating} size={14} />
                <p className="text-white/90 text-sm mt-3 mb-4 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-white text-sm">{t.name}</p>
                    <p className="text-primary-300 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOWNLOAD APP SECTION */}
      <section className="py-20 px-4 bg-gray-900 overflow-hidden relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-600 rounded-full translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary-600/20 border border-primary-500/30 rounded-full px-4 py-2 text-primary-400 text-sm mb-6">
                <Smartphone size={14} /> Mobile App
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                Find Your Home<br />
                <span className="text-primary-400">On the Go</span>
              </h2>
              <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                Book shortlets, browse properties, pay securely, and get directions — all from the My Wari app. Available soon on iOS & Android.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <AppStoreBadge store="apple" />
                <AppStoreBadge store="google" />
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-2"><CheckCircle size={14} className="text-primary-500" /> Free to download</span>
                <span className="flex items-center gap-2"><CheckCircle size={14} className="text-primary-500" /> No hidden fees</span>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-64 h-[500px] bg-gray-800 rounded-[3rem] border-4 border-gray-700 overflow-hidden shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400" alt="App preview" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-4 right-4">
                    <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20">
                      <p className="text-white font-semibold text-sm mb-1">Luxury Apt, Lekki</p>
                      <p className="text-primary-400 text-xs">₦45,000/night · Available now</p>
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => <Star key={i} size={10} className="fill-amber-400 text-amber-400" />)}
                        <span className="text-gray-400 text-xs ml-1">4.9</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center shadow-xl">
                  <span className="text-white text-xs font-bold text-center leading-tight">Coming<br/>Soon!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONNECT WITH US */}
      <section className="py-16 px-4 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-primary-600 font-semibold uppercase tracking-wider text-sm mb-3">Stay Connected</p>
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">Follow Us & Say Hello</h2>
          <p className="text-gray-500 mb-8">Join our community on social media, or reach out directly — we love hearing from you.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://www.instagram.com/mywariltd?igsh=cGJmNDZzZzNsY24y&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3 rounded-2xl border-2 border-pink-200 bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 transition-all text-gray-800 font-medium"
            >
              <Instagram size={20} className="text-pink-600" />
              @mywariltd
            </a>
            <a
              href="https://wa.me/2348162983569"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3 rounded-2xl border-2 border-green-200 bg-green-50 hover:bg-green-100 transition-all text-gray-800 font-medium"
            >
              <MessageCircle size={20} className="text-green-600" />
              WhatsApp Us
            </a>
            <a
              href="mailto:hello.mywari@gmail.com"
              className="flex items-center gap-3 px-6 py-3 rounded-2xl border-2 border-primary-200 bg-primary-50 hover:bg-primary-100 transition-all text-gray-800 font-medium"
            >
              <Mail size={20} className="text-primary-600" />
              hello.mywari@gmail.com
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-[#F5F0E8]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="section-title text-gray-900 mb-4">Ready to Find Your Wari?</h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of Nigerians who've found their perfect home through My Wari. It's free to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-lg px-10 py-4">Create Free Account</Link>
            <Link to="/search" className="btn-secondary text-lg px-10 py-4">Browse Properties</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}