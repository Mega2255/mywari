import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Common/Navbar';
import { generateReceipt } from '../utils/receipt';
import {
  LayoutDashboard, BookOpen, Heart, User, LogOut, Bell, Download,
  Star, MapPin, Calendar, ChevronRight, Package, Settings
} from 'lucide-react';
import toast from 'react-hot-toast';

function DashOverview({ bookings }) {
  const { userData } = useAuth();
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 text-white">
        <p className="text-primary-200 mb-1">Welcome back,</p>
        <h2 className="font-display text-2xl font-bold mb-4">{userData?.name} 👋</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Bookings', val: bookings.length },
            { label: 'Active Stays', val: bookings.filter(b => b.status === 'confirmed').length },
            { label: 'Completed', val: bookings.filter(b => b.status === 'completed').length },
          ].map(s => (
            <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{s.val}</p>
              <p className="text-xs text-primary-200">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-display text-lg font-bold text-gray-800 mb-3">Recent Bookings</h3>
        {bookings.slice(0, 3).map(b => (
          <div key={b.id} className="bg-white rounded-xl border border-gray-100 p-4 mb-3 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <img src={b.propertyImage || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200'} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm truncate">{b.propertyTitle}</p>
              <p className="text-xs text-gray-500">{b.checkIn} → {b.checkOut}</p>
              <span className={`badge text-xs ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{b.status}</span>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary-700">₦{parseInt(b.total).toLocaleString()}</p>
              <button onClick={() => generateReceipt(b)} className="text-xs text-gray-500 hover:text-primary-600 flex items-center gap-1 mt-1">
                <Download size={12} /> Receipt
              </button>
            </div>
          </div>
        ))}
        {bookings.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <Package size={48} className="mx-auto mb-3 opacity-30" />
            <p>No bookings yet. <Link to="/search" className="text-primary-600 underline">Find a property</Link></p>
          </div>
        )}
      </div>
    </div>
  );
}

function MyBookings({ bookings }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-gray-800 mb-6">My Bookings</h2>
      <div className="space-y-4">
        {bookings.map(b => (
          <div key={b.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4">
              <img src={b.propertyImage || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200'} alt="" className="w-full md:w-32 h-32 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <h3 className="font-display font-bold text-gray-900">{b.propertyTitle}</h3>
                  <span className={`badge ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'} capitalize`}>{b.status}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-sm text-gray-600">
                  <div><p className="text-xs text-gray-400">Check-in</p><p className="font-medium">{b.checkIn}</p></div>
                  <div><p className="text-xs text-gray-400">Check-out</p><p className="font-medium">{b.checkOut}</p></div>
                  <div><p className="text-xs text-gray-400">Duration</p><p className="font-medium">{b.nights} night(s)</p></div>
                  <div><p className="text-xs text-gray-400">Total Paid</p><p className="font-bold text-primary-700">₦{parseInt(b.total).toLocaleString()}</p></div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                  <span>Ref: {b.paymentRef}</span>
                  <span>•</span>
                  <span>Agent: {b.agentName}</span>
                </div>
              </div>
              <div className="flex md:flex-col gap-2 items-start">
                <button onClick={() => generateReceipt(b)} className="flex items-center gap-2 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-xl px-3 py-2 text-sm font-medium transition-colors">
                  <Download size={14} /> Receipt
                </button>
                <Link to={`/property/${b.propertyId}`} className="flex items-center gap-2 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-xl px-3 py-2 text-sm font-medium transition-colors">
                  View Property
                </Link>
              </div>
            </div>
          </div>
        ))}
        {bookings.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <Calendar size={48} className="mx-auto mb-3 text-gray-300" />
            <h3 className="font-display text-xl font-bold text-gray-600 mb-2">No Bookings Yet</h3>
            <p className="text-gray-400 mb-4">Start exploring and book your first property</p>
            <Link to="/search" className="btn-primary">Browse Properties</Link>
          </div>
        )}
      </div>
    </div>
  );
}

function Profile() {
  const { userData, currentUser } = useAuth();
  const [form, setForm] = useState({ name: userData?.name || '', phone: userData?.phone || '' });
  
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-gray-800 mb-6">My Profile</h2>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <img src={userData?.avatar} alt="" className="w-20 h-20 rounded-full object-cover border-4 border-primary-100" />
          <div>
            <h3 className="font-display text-xl font-bold text-gray-800">{userData?.name}</h3>
            <p className="text-gray-500">{userData?.email}</p>
            <span className="badge bg-primary-100 text-primary-700 capitalize mt-1">{userData?.role}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Full Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Phone</label>
            <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input-field" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email</label>
            <input value={userData?.email} disabled className="input-field bg-gray-50 text-gray-500" />
          </div>
        </div>
        <button className="btn-primary mt-6">Save Changes</button>
      </div>
    </div>
  );
}

const NAV = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
  { icon: BookOpen, label: 'My Bookings', path: '/dashboard/bookings' },
  { icon: Heart, label: 'Wishlist', path: '/dashboard/wishlist' },
  { icon: User, label: 'Profile', path: '/dashboard/profile' },
];

export default function UserDashboard() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    get(ref(db, 'bookings')).then(snap => {
      if (snap.exists()) {
        const all = Object.values(snap.val());
        setBookings(all.filter(b => b.userId === currentUser.uid));
      }
    }).catch(() => {});
  }, [currentUser]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16 flex">
        {/* Sidebar */}
        <aside className={`fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-100 shadow-sm z-30 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="p-6 flex flex-col h-full">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Navigation</p>
            <nav className="flex-1 space-y-1">
              {NAV.map(item => (
                <Link key={item.path} to={item.path} className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
                  <item.icon size={18} /> {item.label}
                </Link>
              ))}
            </nav>
            <button onClick={handleLogout} className="sidebar-link text-red-500 hover:bg-red-50 hover:text-red-600 mt-4">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 md:ml-64 p-6 min-h-screen">
          <div className="max-w-4xl mx-auto">
            <Routes>
              <Route index element={<DashOverview bookings={bookings} />} />
              <Route path="bookings" element={<MyBookings bookings={bookings} />} />
              <Route path="profile" element={<Profile />} />
              <Route path="wishlist" element={
                <div className="text-center py-20">
                  <Heart size={48} className="mx-auto mb-3 text-gray-300" />
                  <h3 className="font-display text-xl font-bold text-gray-600 mb-2">Your Wishlist</h3>
                  <p className="text-gray-400">Save properties you love to view them here</p>
                  <Link to="/search" className="btn-primary mt-4 inline-block">Explore Properties</Link>
                </div>
              } />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
