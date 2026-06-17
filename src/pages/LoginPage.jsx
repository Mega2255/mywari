import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ref, get } from 'firebase/database';
import { db } from '../firebase';
import { Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cred = await login(form.email, form.password);
      const snap = await get(ref(db, `users/${cred.user.uid}`));
      const role = snap.val()?.role;

      toast.success('Welcome back!');

      if (role === 'admin') navigate('/admin');
      else if (role === 'agent') navigate('/agent');
      else navigate('/dashboard');
    } catch (err) {
      toast.error(
        err.message.includes('user-not-found') ? 'Account not found' :
        err.message.includes('wrong-password') ? 'Wrong password' :
        'Login failed. Try again.'
      );
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left image */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&q=80" alt="Home" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 to-earth-900/60 flex flex-col justify-end p-12">
          <Link to="/" className="flex items-center gap-2 mb-auto mt-8">
            <svg width="40" height="30" viewBox="0 0 80 60" fill="none">
              <path d="M0 60 L20 10 L40 45 L60 10 L80 60Z" fill="#fff" opacity="0.9"/>
              <path d="M20 10 L40 45 L60 10 L50 10 L40 30 L30 10Z" fill="#ccc" opacity="0.8"/>
            </svg>
            <span className="font-display text-2xl font-bold text-white">My Wari</span>
          </Link>
          <div>
            <h2 className="font-display text-4xl font-bold text-white mb-3">Find Your Dream<br />Nigerian Home</h2>
            <p className="text-white/70 text-lg">Thousands of verified properties waiting for you.</p>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-[#FAFAF8]">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8 text-sm transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-500">Sign in to your My Wari account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="input-field"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-xs text-primary-600 hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="input-field pr-12"
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <LogIn size={18} />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative text-center"><span className="bg-[#FAFAF8] px-4 text-sm text-gray-500">or</span></div>
          </div>

          <p className="text-center text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">Create one free</Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-8 bg-primary-50 border border-primary-100 rounded-xl p-4 text-sm">
            <p className="font-semibold text-primary-800 mb-2">Demo Credentials:</p>
            <p className="text-primary-700">Admin: admin@mywari.ng / admin123</p>
            <p className="text-primary-700">Agent: agent@mywari.ng / agent123</p>
          </div>
        </div>
      </div>
    </div>
  );
}