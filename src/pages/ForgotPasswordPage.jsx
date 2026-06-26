import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
      toast.success('Reset link sent! Check your inbox.');
    } catch (err) {
      toast.error(
        err.message.includes('user-not-found') ? 'No account found with that email' :
        err.message.includes('invalid-email') ? 'Enter a valid email address' :
        'Failed to send reset email. Try again.'
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
          <Link to="/login" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8 text-sm transition-colors">
            <ArrowLeft size={16} /> Back to Login
          </Link>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Reset your password</h1>
            <p className="text-gray-500">
              {sent
                ? "We've sent a password reset link to your email."
                : "Enter your account email and we'll send you a link to reset your password."}
            </p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field"
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send size={18} />
                )}
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700 flex items-start gap-2">
                <Mail size={16} className="flex-shrink-0 mt-0.5" />
                <span>Check <strong>{email}</strong> for a link to reset your password. Didn't get it? Check your spam folder, or try again below.</span>
              </div>
              <button onClick={() => setSent(false)} className="text-primary-600 text-sm font-medium hover:underline">
                Use a different email
              </button>
            </div>
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative text-center"><span className="bg-[#FAFAF8] px-4 text-sm text-gray-500">or</span></div>
          </div>

          <p className="text-center text-gray-600 text-sm">
            Remembered your password?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}