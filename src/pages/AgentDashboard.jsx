import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { ref, get, push, set, update, remove, onValue } from 'firebase/database';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Common/Navbar';
import { generateReceipt } from '../utils/receipt';
import {
  LayoutDashboard, Building, BookOpen, Users, LogOut, Plus, Edit,
  Trash2, Eye, TrendingUp, Upload, X, Save, DollarSign, Star, MapPin
} from 'lucide-react';
import toast from 'react-hot-toast';

const AMENITY_OPTIONS = ['WiFi', 'Air Conditioning', 'Parking', 'Swimming Pool', 'Smart TV', 'Security', 'Gym', 'Generator', 'Water Supply', 'DSTV', 'Kitchen', 'Balcony'];
const CITIES = ['Lagos', 'Abuja', 'Port Harcourt', 'Yenagoa', 'Enugu', 'Benin City', 'Uyo'];

function PropertyForm({ property = null, onSave, onCancel }) {
  const { currentUser, userData } = useAuth();
  const [form, setForm] = useState({
    title: property?.title || '',
    description: property?.description || '',
    type: property?.type || 'shortlet',
    price: property?.price || '',
    city: property?.city || '',
    location: property?.location || '',
    address: property?.address || '',
    bedrooms: property?.bedrooms || '',
    bathrooms: property?.bathrooms || '',
    size: property?.size || '',
    lat: property?.lat || '6.5244',
    lng: property?.lng || '3.3792',
    amenities: property?.amenities || [],
    images: property?.images || [''],
  });
  const [saving, setSaving] = useState(false);

  const toggleAmenity = (a) => setForm(f => ({
    ...f,
    amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a],
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = {
      ...form,
      agentId: currentUser.uid,
      agentName: userData?.name,
      agentSubaccount: userData?.paystackSubaccount || '',
      images: form.images.filter(Boolean),
      createdAt: property?.createdAt || Date.now(),
      updatedAt: Date.now(),
      status: 'active',
    };
    try {
      if (property?.id) {
        await update(ref(db, `properties/${property.id}`), data);
        toast.success('Property updated!');
      } else {
        const newRef = push(ref(db, 'properties'));
        await set(newRef, { ...data, id: newRef.key });
        toast.success('Property listed successfully!');
      }
      onSave();
    } catch (err) {
      toast.error('Failed to save property');
    }
    setSaving(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold text-gray-800">{property ? 'Edit Property' : 'Add New Property'}</h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Property Title *</label>
            <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Luxury 3BR Apartment in Lekki" className="input-field" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Type *</label>
            <select required value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="input-field">
              <option value="shortlet">Shortlet</option>
              <option value="rent">For Rent</option>
              <option value="sale">For Sale</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Price (₦) {form.type === 'shortlet' ? 'per night' : form.type === 'rent' ? 'per year' : ''} *
            </label>
            <input required type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="e.g. 45000" className="input-field" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">City *</label>
            <select required value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="input-field">
              <option value="">Select city</option>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Area/Neighborhood *</label>
            <input required value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Lekki Phase 1" className="input-field" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Full Address</label>
            <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="e.g. 14 Admiralty Way, Lekki Phase 1, Lagos" className="input-field" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Bedrooms</label>
            <input type="number" min="0" value={form.bedrooms} onChange={e => setForm(f => ({ ...f, bedrooms: e.target.value }))} className="input-field" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Bathrooms</label>
            <input type="number" min="0" value={form.bathrooms} onChange={e => setForm(f => ({ ...f, bathrooms: e.target.value }))} className="input-field" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Size (sqm)</label>
            <input type="number" min="0" value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))} className="input-field" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Latitude (for map)</label>
            <input value={form.lat} onChange={e => setForm(f => ({ ...f, lat: e.target.value }))} className="input-field" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Description</label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} placeholder="Describe the property..." className="input-field resize-none" />
        </div>

        {/* Image URLs */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Image URLs (one per line)</label>
          {form.images.map((img, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input value={img} onChange={e => setForm(f => ({ ...f, images: f.images.map((im, j) => j === i ? e.target.value : im) }))} placeholder="https://..." className="input-field flex-1" />
              {form.images.length > 1 && (
                <button type="button" onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }))} className="text-red-400 hover:text-red-600"><X size={18} /></button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => setForm(f => ({ ...f, images: [...f.images, ''] }))} className="text-primary-600 text-sm hover:underline">+ Add another image URL</button>
        </div>

        {/* Amenities */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Amenities</label>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {AMENITY_OPTIONS.map(a => (
              <label key={a} className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer text-sm transition-all ${form.amenities.includes(a) ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-primary-300'}`}>
                <input type="checkbox" checked={form.amenities.includes(a)} onChange={() => toggleAmenity(a)} className="hidden" />
                {a}
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
            {saving ? 'Saving...' : property ? 'Update Property' : 'List Property'}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function AgentProperties() {
  const { currentUser } = useAuth();
  const [properties, setProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProps = async () => {
    setLoading(true);
    try {
      const snap = await get(ref(db, 'properties'));
      if (snap.exists()) {
        const all = Object.entries(snap.val()).map(([id, p]) => ({ id, ...p }));
        setProperties(all.filter(p => p.agentId === currentUser.uid));
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchProps(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this property?')) return;
    await remove(ref(db, `properties/${id}`));
    toast.success('Property deleted');
    fetchProps();
  };

  if (showForm || editing) {
    return <PropertyForm property={editing} onSave={() => { setShowForm(false); setEditing(null); fetchProps(); }} onCancel={() => { setShowForm(false); setEditing(null); }} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-gray-800">My Properties</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Property
        </button>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3].map(i => <div key={i} className="skeleton h-40 rounded-2xl" />)}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <Building size={48} className="mx-auto mb-3 text-gray-300" />
          <h3 className="font-display text-xl font-bold text-gray-600 mb-2">No Properties Yet</h3>
          <p className="text-gray-400 mb-4">Start listing properties to earn commissions</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">Add Your First Property</button>
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-start">
              <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200'} alt="" className="w-full md:w-32 h-28 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <h3 className="font-display font-bold text-gray-800">{p.title}</h3>
                  <span className={`badge capitalize ${p.type === 'shortlet' ? 'bg-blue-100 text-blue-700' : p.type === 'rent' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{p.type}</span>
                </div>
                <p className="text-gray-500 text-sm mt-1 flex items-center gap-1"><MapPin size={12} />{p.location}, {p.city}</p>
                <p className="font-bold text-primary-700 mt-1">₦{parseInt(p.price).toLocaleString()}{p.type === 'shortlet' ? '/night' : p.type === 'rent' ? '/yr' : ''}</p>
              </div>
              <div className="flex gap-2">
                <Link to={`/property/${p.id}`} className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"><Eye size={16} /></Link>
                <button onClick={() => setEditing(p)} className="p-2 rounded-xl bg-primary-50 hover:bg-primary-100 text-primary-700 transition-colors"><Edit size={16} /></button>
                <button onClick={() => handleDelete(p.id)} className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AgentBookings() {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    get(ref(db, 'bookings')).then(snap => {
      if (snap.exists()) {
        const all = Object.values(snap.val());
        setBookings(all.filter(b => b.agentId === currentUser.uid));
      }
    }).catch(() => {});
  }, []);

  const earnings = bookings.reduce((sum, b) => sum + (b.total * 0.4), 0);

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-gray-800 mb-6">Bookings & Earnings</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-primary-700 text-white rounded-2xl p-5">
          <DollarSign size={24} className="mb-2 text-primary-300" />
          <p className="text-2xl font-bold">₦{earnings.toLocaleString()}</p>
          <p className="text-primary-200 text-sm">Total Earnings (40%)</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <BookOpen size={24} className="mb-2 text-primary-600" />
          <p className="text-2xl font-bold text-gray-800">{bookings.length}</p>
          <p className="text-gray-500 text-sm">Total Bookings</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <TrendingUp size={24} className="mb-2 text-green-600" />
          <p className="text-2xl font-bold text-gray-800">{bookings.filter(b => b.status === 'confirmed').length}</p>
          <p className="text-gray-500 text-sm">Active Bookings</p>
        </div>
      </div>
      <div className="space-y-3">
        {bookings.map(b => (
          <div key={b.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="font-semibold text-gray-800">{b.propertyTitle}</p>
                <p className="text-sm text-gray-500">{b.userName} · {b.checkIn} → {b.checkOut}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary-700">+₦{(b.total * 0.4).toLocaleString()}</p>
                <p className="text-xs text-gray-400">your 40% share</p>
              </div>
            </div>
          </div>
        ))}
        {bookings.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <BookOpen size={48} className="mx-auto mb-3 opacity-30" />
            <p>No bookings yet for your properties</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AgentUsers() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    get(ref(db, 'users')).then(snap => {
      if (snap.exists()) setUsers(Object.values(snap.val()).filter(u => u.role === 'user'));
    }).catch(() => {});
  }, []);

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-gray-800 mb-6">All Users ({users.length})</h2>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(u => (
              <tr key={u.uid} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <img src={u.avatar} alt="" className="w-8 h-8 rounded-full" />
                    <span className="font-medium text-gray-800 text-sm">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{u.phone}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p className="text-center py-10 text-gray-400">No users yet</p>}
      </div>
    </div>
  );
}

const AGENT_NAV = [
  { icon: LayoutDashboard, label: 'Overview', path: '/agent' },
  { icon: Building, label: 'Properties', path: '/agent/properties' },
  { icon: BookOpen, label: 'Bookings', path: '/agent/bookings' },
  { icon: Users, label: 'Users', path: '/agent/users' },
];

export default function AgentDashboard() {
  const { userData, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => { await logout(); navigate('/'); };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16 flex">
        <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-100 shadow-sm z-30 hidden md:block">
          <div className="p-6 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <img src={userData?.avatar} alt="" className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-semibold text-gray-800 text-sm">{userData?.name}</p>
                <span className="badge bg-earth-100 text-earth-700 text-xs">Agent</span>
              </div>
            </div>
            <nav className="flex-1 space-y-1">
              {AGENT_NAV.map(item => (
                <Link key={item.path} to={item.path} className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}>
                  <item.icon size={18} /> {item.label}
                </Link>
              ))}
            </nav>
            <button onClick={handleLogout} className="sidebar-link text-red-500 hover:bg-red-50">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </aside>
        <main className="flex-1 md:ml-64 p-6">
          <div className="max-w-5xl mx-auto">
            <Routes>
              <Route index element={
                <div>
                  <h2 className="font-display text-2xl font-bold text-gray-800 mb-2">Agent Dashboard</h2>
                  <p className="text-gray-500 mb-6">Welcome back, {userData?.name}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {AGENT_NAV.slice(1).map(n => (
                      <Link key={n.path} to={n.path} className="bg-white rounded-2xl border border-gray-100 p-5 text-center hover:shadow-md transition-all group">
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-200 transition-colors">
                          <n.icon size={22} className="text-primary-700" />
                        </div>
                        <p className="font-semibold text-gray-700 text-sm">{n.label}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              } />
              <Route path="properties" element={<AgentProperties />} />
              <Route path="bookings" element={<AgentBookings />} />
              <Route path="users" element={<AgentUsers />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
