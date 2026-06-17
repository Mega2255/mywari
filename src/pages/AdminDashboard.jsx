import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ref, get, push, set, update, remove } from 'firebase/database';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Common/Navbar';
import { generateReceipt } from '../utils/receipt';
import {
  LayoutDashboard, Building, BookOpen, Users, LogOut, Plus, Edit,
  Trash2, Eye, TrendingUp, DollarSign, UserPlus, Key, Mail,
  Shield, X, Save, CheckCircle, AlertCircle, Search, Filter,
  Download, BarChart2, Settings, ChevronRight, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Overview ───────────────────────────────────────────────────────────────
function AdminOverview({ stats }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-gray-800 mb-1">Admin Dashboard</h2>
        <p className="text-gray-500">Full platform overview and management</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', val: `₦${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-green-100 text-green-700', sub: 'admin 4% share' },
          { label: 'Total Bookings', val: stats.totalBookings, icon: BookOpen, color: 'bg-blue-100 text-blue-700', sub: 'all time' },
          { label: 'Total Properties', val: stats.totalProperties, icon: Building, color: 'bg-amber-100 text-amber-700', sub: 'listed' },
          { label: 'Total Users', val: stats.totalUsers, icon: Users, color: 'bg-purple-100 text-purple-700', sub: 'registered' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
              <s.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.val}</p>
            <p className="font-medium text-gray-700 text-sm">{s.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-display text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: 'Create Agent Account', path: '/admin/agents?new=1', icon: UserPlus },
              { label: 'Manage Properties', path: '/admin/properties', icon: Building },
              { label: 'View All Bookings', path: '/admin/bookings', icon: BookOpen },
              { label: 'Financial Reports', path: '/admin/finances', icon: BarChart2 },
            ].map(a => (
              <Link key={a.path} to={a.path} className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 text-gray-700 hover:text-primary-700 transition-all group">
                <a.icon size={18} className="text-primary-600" />
                <span className="font-medium text-sm">{a.label}</span>
                <ChevronRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary-700 to-primary-900 rounded-2xl p-5 text-white">
          <h3 className="font-display text-lg font-bold mb-4">Revenue Split</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-primary-200">Admin Share (4%)</span>
                <span className="font-bold">₦{stats.adminRevenue.toLocaleString()}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2" style={{ width: '4%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-primary-200">Agent Earnings (96%)</span>
                <span className="font-bold">₦{stats.agentRevenue.toLocaleString()}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-primary-300 rounded-full h-2" style={{ width: '96%' }} />
              </div>
            </div>
            <div className="border-t border-white/20 pt-3">
              <div className="flex justify-between">
                <span className="text-primary-200 text-sm">Total Processed</span>
                <span className="font-bold text-lg">₦{stats.totalRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Agent Management ────────────────────────────────────────────────────────
function AgentManagement() {
  const { createAgent } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [agents, setAgents] = useState([]);
  const [showForm, setShowForm] = useState(searchParams.get('new') === '1');
  const [editingAgent, setEditingAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', flwSubaccount: '' });
  const [changingCreds, setChangingCreds] = useState({ email: '', password: '' });
  const [saving, setSaving] = useState(false);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const snap = await get(ref(db, 'users'));
      if (snap.exists()) {
        setAgents(Object.values(snap.val()).filter(u => u.role === 'agent'));
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchAgents(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setSaving(true);
    try {
      await createAgent(form.email, form.password, form.name, form.phone, form.flwSubaccount);
      toast.success(`Agent account created for ${form.name}`);
      setShowForm(false);
      setSearchParams({});
      setForm({ name: '', email: '', phone: '', password: '', flwSubaccount: '' });
      fetchAgents();
    } catch (err) {
      toast.error(err.message.includes('email-already-in-use') ? 'Email already in use' : 'Failed to create agent');
    }
    setSaving(false);
  };

  const handleUpdateAgent = async (uid) => {
    setSaving(true);
    try {
      const updates = {};
      if (changingCreds.email) updates.email = changingCreds.email;
      await update(ref(db, `users/${uid}`), updates);
      toast.success('Agent credentials updated in database. Note: Firebase Auth email must be changed via Admin SDK.');
      setEditingAgent(null);
      fetchAgents();
    } catch (err) {
      toast.error('Update failed');
    }
    setSaving(false);
  };

  const handleDeleteAgent = async (uid, name) => {
    if (!confirm(`Delete agent ${name}? This cannot be undone.`)) return;
    try {
      await remove(ref(db, `users/${uid}`));
      toast.success('Agent account deleted from database');
      fetchAgents();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-gray-800">Agent Management</h2>
          <p className="text-gray-500 text-sm">{agents.length} agents registered</p>
        </div>
        <button onClick={() => { setShowForm(true); }} className="btn-primary flex items-center gap-2">
          <UserPlus size={18} /> Create Agent
        </button>
      </div>

      {/* Create Agent Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-bold text-gray-800">Create New Agent Account</h3>
            <button onClick={() => { setShowForm(false); setSearchParams({}); }}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
          </div>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Full Name *</label>
              <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Agent name" className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email *</label>
              <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="agent@email.com" className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Phone</label>
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+234 800 000 0000" className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Password *</label>
              <input required type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min 6 characters" className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Flutterwave Subaccount ID</label>
              <input value={form.flwSubaccount} onChange={e => setForm(f => ({ ...f, flwSubaccount: e.target.value }))} placeholder="RS_xxxxxxxxxxxx (from Flutterwave dashboard)" className="input-field" />
              <p className="text-xs text-gray-400 mt-1">Required for automatic 96% commission splits on bookings</p>
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <UserPlus size={16} />}
                {saving ? 'Creating...' : 'Create Agent'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setSearchParams({}); }} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Agent Credentials Modal */}
      {editingAgent && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setEditingAgent(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-bold">Update Credentials</h3>
              <button onClick={() => setEditingAgent(null)}><X size={20} /></button>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-sm text-amber-700 flex items-start gap-2">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>Email change is reflected in database. For Firebase Auth email update, use Admin SDK on your backend.</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">Updating: <strong>{editingAgent.name}</strong></p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">New Email</label>
                <input type="email" value={changingCreds.email} onChange={e => setChangingCreds(c => ({ ...c, email: e.target.value }))} placeholder={editingAgent.email} className="input-field" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">New Password (optional)</label>
                <input type="password" value={changingCreds.password} onChange={e => setChangingCreds(c => ({ ...c, password: e.target.value }))} placeholder="Leave blank to keep current" className="input-field" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => handleUpdateAgent(editingAgent.uid)} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
                Save Changes
              </button>
              <button onClick={() => setEditingAgent(null)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Agents Table */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="skeleton h-16 rounded-xl" />)}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {agents.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <UserPlus size={40} className="mx-auto mb-3 opacity-30" />
              <p>No agents yet. Create your first agent above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <tr>
                    <th className="px-4 py-3 text-left">Agent</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Phone</th>
                    <th className="px-4 py-3 text-left">Flutterwave</th>
                    <th className="px-4 py-3 text-left">Joined</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {agents.map(agent => (
                    <tr key={agent.uid} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img src={agent.avatar} alt="" className="w-9 h-9 rounded-full" />
                          <div>
                            <p className="font-medium text-gray-800 text-sm">{agent.name}</p>
                            <span className="badge bg-earth-100 text-earth-700 text-xs">Agent</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{agent.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{agent.phone}</td>
                      <td className="px-4 py-3 text-sm">
                        {agent.flwSubaccount ? (
                          <span className="flex items-center gap-1 text-green-600"><CheckCircle size={12} /> Set</span>
                        ) : (
                          <span className="text-amber-500 text-xs">Not set</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{new Date(agent.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => { setEditingAgent(agent); setChangingCreds({ email: '', password: '' }); }} className="p-1.5 rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-700 transition-colors" title="Edit credentials">
                            <Key size={14} />
                          </button>
                          <button onClick={() => handleDeleteAgent(agent.uid, agent.name)} className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors" title="Delete agent">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Admin Properties ─────────────────────────────────────────────────────────
function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    get(ref(db, 'properties')).then(snap => {
      if (snap.exists()) setProperties(Object.entries(snap.val()).map(([id, p]) => ({ id, ...p })));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this property?')) return;
    await remove(ref(db, `properties/${id}`));
    setProperties(prev => prev.filter(p => p.id !== id));
    toast.success('Property deleted');
  };

  const filtered = properties.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-gray-800">All Properties</h2>
          <p className="text-gray-500 text-sm">{properties.length} total listings</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
          <Search size={16} className="text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="outline-none text-sm text-gray-700 w-40" />
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Property</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">City</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Agent</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={p.images?.[0]} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      <p className="font-medium text-gray-800 text-sm line-clamp-1 max-w-[180px]">{p.title}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge capitalize text-xs ${p.type === 'shortlet' ? 'bg-blue-100 text-blue-700' : p.type === 'rent' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{p.type}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.city}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-primary-700">₦{parseInt(p.price).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.agentName}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link to={`/property/${p.id}`} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"><Eye size={14} /></Link>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-400">
              <Building size={40} className="mx-auto mb-2 opacity-30" />
              <p>No properties found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Admin Bookings ───────────────────────────────────────────────────────────
function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get(ref(db, 'bookings')).then(snap => {
      if (snap.exists()) setBookings(Object.values(snap.val()).sort((a, b) => b.createdAt - a.createdAt));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-gray-800">All Bookings</h2>
          <p className="text-gray-500 text-sm">{bookings.length} total bookings</p>
        </div>
      </div>
      <div className="space-y-3">
        {bookings.map(b => (
          <div key={b.id || b.paymentRef} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src={b.propertyImage || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=80'} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{b.propertyTitle}</p>
                  <p className="text-xs text-gray-500">{b.userName} · {b.checkIn} → {b.checkOut}</p>
                  <p className="text-xs text-gray-400">Agent: {b.agentName} · Ref: {b.paymentRef}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold text-gray-900">₦{parseInt(b.total || 0).toLocaleString()}</p>
                  <p className="text-xs text-green-600">Admin: ₦{Math.round(b.total * 0.04).toLocaleString()}</p>
                  <p className="text-xs text-amber-600">Agent: ₦{Math.round(b.total * 0.96).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`badge text-xs capitalize ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{b.status}</span>
                  <button onClick={() => generateReceipt(b)} className="p-1.5 rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-700 transition-colors" title="Download Receipt">
                    <Download size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {bookings.length === 0 && !loading && (
          <div className="text-center py-16 text-gray-400">
            <BookOpen size={40} className="mx-auto mb-2 opacity-30" />
            <p>No bookings yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── All Users ────────────────────────────────────────────────────────────────
function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get(ref(db, 'users')).then(snap => {
      if (snap.exists()) setUsers(Object.values(snap.val()));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (uid, name) => {
    if (!confirm(`Delete ${name}? This removes their database record.`)) return;
    await remove(ref(db, `users/${uid}`));
    setUsers(prev => prev.filter(u => u.uid !== uid));
    toast.success('User deleted from database');
  };

  const filtered = filter === 'all' ? users : users.filter(u => u.role === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-gray-800">All Users</h2>
          <p className="text-gray-500 text-sm">{users.length} total registered</p>
        </div>
        <div className="flex items-center gap-2">
          {['all', 'user', 'agent', 'admin'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filter === f ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-400'}`}>{f}</button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Joined</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(u => (
                <tr key={u.uid} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={u.avatar} alt="" className="w-8 h-8 rounded-full" />
                      <p className="font-medium text-gray-800 text-sm">{u.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge capitalize text-xs ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role === 'agent' ? 'bg-earth-100 text-earth-700' : 'bg-blue-100 text-blue-700'}`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{u.phone || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    {u.role !== 'admin' && (
                      <button onClick={() => handleDelete(u.uid, u.name)} className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"><Trash2 size={14} /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-400"><p>No {filter} users found</p></div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Finances ─────────────────────────────────────────────────────────────────
function AdminFinances() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get(ref(db, 'bookings')).then(snap => {
      if (snap.exists()) setBookings(Object.values(snap.val()).sort((a, b) => b.createdAt - a.createdAt));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const totalRevenue = bookings.reduce((sum, b) => sum + (parseInt(b.total) || 0), 0);
  const adminShare = Math.round(totalRevenue * 0.04);
  const agentShare = Math.round(totalRevenue * 0.96);

  // Group by month
  const byMonth = bookings.reduce((acc, b) => {
    const month = new Date(b.createdAt).toLocaleString('default', { month: 'short', year: '2-digit' });
    acc[month] = (acc[month] || 0) + parseInt(b.total || 0);
    return acc;
  }, {});

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-gray-800 mb-6">Financial Reports</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white rounded-2xl p-5">
          <TrendingUp size={24} className="mb-2 text-primary-300" />
          <p className="text-3xl font-bold">₦{totalRevenue.toLocaleString()}</p>
          <p className="text-primary-200 text-sm">Total Platform Revenue</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <DollarSign size={24} className="mb-2 text-green-600" />
          <p className="text-3xl font-bold text-gray-800">₦{adminShare.toLocaleString()}</p>
          <p className="text-gray-500 text-sm">Admin Revenue (4%)</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <Users size={24} className="mb-2 text-amber-600" />
          <p className="text-3xl font-bold text-gray-800">₦{agentShare.toLocaleString()}</p>
          <p className="text-gray-500 text-sm">Total Agent Payouts (96%)</p>
        </div>
      </div>

      {/* Monthly breakdown */}
      {Object.keys(byMonth).length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mb-6">
          <h3 className="font-display text-lg font-bold text-gray-800 mb-4">Monthly Revenue</h3>
          <div className="space-y-3">
            {Object.entries(byMonth).map(([month, amount]) => (
              <div key={month} className="flex items-center gap-3">
                <span className="text-sm text-gray-500 w-16">{month}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-primary-600 h-full rounded-full transition-all" style={{ width: `${Math.min((amount / totalRevenue) * 100 * 3, 100)}%` }} />
                </div>
                <span className="text-sm font-semibold text-gray-700 w-28 text-right">₦{amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">All Transactions</h3>
          <span className="text-sm text-gray-500">{bookings.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Property</th>
                <th className="px-4 py-3 text-left">Guest</th>
                <th className="px-4 py-3 text-left">Agent</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-right">Admin (4%)</th>
                <th className="px-4 py-3 text-right">Agent (96%)</th>
                <th className="px-4 py-3 text-left">Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {bookings.map(b => (
                <tr key={b.id || b.paymentRef} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-500">{new Date(b.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-gray-800 font-medium max-w-[150px] truncate">{b.propertyTitle}</td>
                  <td className="px-4 py-3 text-gray-600">{b.userName}</td>
                  <td className="px-4 py-3 text-gray-600">{b.agentName}</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">₦{parseInt(b.total || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-green-700 font-semibold">₦{Math.round((b.total || 0) * 0.04).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-amber-700 font-semibold">₦{Math.round((b.total || 0) * 0.96).toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{b.paymentRef?.slice(-10)}</td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400">No transactions yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Shell ──────────────────────────────────────────────────────────────
const ADMIN_NAV = [
  { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
  { icon: Users, label: 'All Users', path: '/admin/users' },
  { icon: UserPlus, label: 'Agents', path: '/admin/agents' },
  { icon: Building, label: 'Properties', path: '/admin/properties' },
  { icon: BookOpen, label: 'Bookings', path: '/admin/bookings' },
  { icon: BarChart2, label: 'Finances', path: '/admin/finances' },
];

export default function AdminDashboard() {
  const { userData, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalRevenue: 0, adminRevenue: 0, agentRevenue: 0, totalBookings: 0, totalProperties: 0, totalUsers: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [bSnap, pSnap, uSnap] = await Promise.all([
          get(ref(db, 'bookings')),
          get(ref(db, 'properties')),
          get(ref(db, 'users')),
        ]);
        const bookings = bSnap.exists() ? Object.values(bSnap.val()) : [];
        const totalRevenue = bookings.reduce((s, b) => s + parseInt(b.total || 0), 0);
        setStats({
          totalRevenue,
          adminRevenue: Math.round(totalRevenue * 0.04),
          agentRevenue: Math.round(totalRevenue * 0.96),
          totalBookings: bookings.length,
          totalProperties: pSnap.exists() ? Object.keys(pSnap.val()).length : 0,
          totalUsers: uSnap.exists() ? Object.keys(uSnap.val()).length : 0,
        });
      } catch {}
    };
    fetchStats();
  }, []);

  const handleLogout = async () => { await logout(); navigate('/'); };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16 flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-100 shadow-sm z-30 hidden md:flex flex-col">
          <div className="p-6 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <Shield size={20} className="text-primary-700" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{userData?.name}</p>
                <span className="badge bg-purple-100 text-purple-700 text-xs">Administrator</span>
              </div>
            </div>
            <nav className="flex-1 space-y-1">
              {ADMIN_NAV.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <item.icon size={18} /> {item.label}
                </Link>
              ))}
            </nav>
            <button onClick={handleLogout} className="sidebar-link text-red-500 hover:bg-red-50 hover:text-red-600 mt-4">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 md:ml-64 p-6 min-h-screen">
          <div className="max-w-6xl mx-auto">
            <Routes>
              <Route index element={<AdminOverview stats={stats} />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="agents" element={<AgentManagement />} />
              <Route path="properties" element={<AdminProperties />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="finances" element={<AdminFinances />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}