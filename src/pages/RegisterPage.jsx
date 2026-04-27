import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, UserPlus, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (!agreed) { toast.error('Please agree to Terms of Service'); return; }
    setLoading(true);
    try {
      await register(form.email, form.password, form.name, form.phone);
      toast.success('Account created successfully! Welcome to My Wari!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message.includes('email-already-in-use') ? 'Email already registered' : 'Registration failed. Try again.');
    }
    setLoading(false);
  };

  const strength = form.password.length > 8 && /[A-Z]/.test(form.password) && /[0-9]/.test(form.password) ? 'Strong' : form.password.length >= 6 ? 'Medium' : form.password.length > 0 ? 'Weak' : '';
  const strengthColor = { Strong: 'text-green-600', Medium: 'text-amber-600', Weak: 'text-red-500' }[strength] || '';

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col w-[420px] bg-gradient-to-br from-primary-800 to-primary-600 p-12 relative overflow-hidden">
        <Link to="/" className="flex items-center gap-2 mb-auto">
          <svg width="40" height="30" viewBox="0 0 80 60" fill="none">
            <path d="M0 60 L20 10 L40 45 L60 10 L80 60Z" fill="#fff" opacity="0.9"/>
            <path d="M20 10 L40 45 L60 10 L50 10 L40 30 L30 10Z" fill="#ccc" opacity="0.8"/>
          </svg>
          <span className="font-display text-2xl font-bold text-white">My Wari</span>
        </Link>

        <div className="space-y-6">
          <h2 className="font-display text-3xl font-bold text-white">Join the My Wari Family</h2>
          <p className="text-primary-200">Nigeria's most trusted real estate marketplace</p>
          {[
            'Access 12,000+ verified properties',
            'Book and pay securely online',
            'Download PDF receipts instantly',
            'Save properties to your wishlist',
            'Direct contact with agents',
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-3 text-white/90 text-sm">
              <CheckCircle size={18} className="text-primary-300 flex-shrink-0" />
              {t}
            </div>
          ))}
        </div>

        {/* Decorative circles */}
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-[#FAFAF8] overflow-y-auto">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm transition-colors lg:hidden">
            <ArrowLeft size={16} /> Back to Home
          </Link>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-500">Join thousands finding homes on My Wari</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Adaeze Okonkwo" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
              <input type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+234 800 000 0000" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="At least 6 characters" className="input-field pr-12" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {strength && <p className={`text-xs mt-1 ${strengthColor}`}>Password strength: {strength}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <input type={show ? 'text' : 'password'} required value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} placeholder="Repeat password" className="input-field" />
              {form.confirm && form.password !== form.confirm && <p className="text-xs text-red-500 mt-1">Passwords don't match</p>}
            </div>

            <div className="flex items-start gap-3">
              <input type="checkbox" id="agree" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-1 accent-primary-600" />
              <label htmlFor="agree" className="text-sm text-gray-600">
                I agree to the <a href="#" className="text-primary-600 hover:underline">Terms of Service</a> and <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <UserPlus size={18} />}
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
