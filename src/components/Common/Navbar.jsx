import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, X, Search, User, LogOut, LayoutDashboard, Heart, Bell } from 'lucide-react';
import toast from 'react-hot-toast';
import logo from '../../assets/logo.jpeg';

export default function Navbar() {
  const { currentUser, userData, userRole, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/');
    setProfileOpen(false);
  };

  const getDashboardPath = () => {
    if (userRole === 'admin') return '/admin';
    if (userRole === 'agent') return '/agent';
    return '/dashboard';
  };

  const navBg = isHome && !scrolled ? 'bg-transparent' : 'bg-white shadow-md';
  const textColor = isHome && !scrolled ? 'text-white' : 'text-gray-800';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="My Wari" className="h-9 w-auto object-contain rounded-lg" />
            <span className={`font-display text-xl font-bold ${isHome && !scrolled ? 'text-white' : 'text-primary-700'}`}>My Wari</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/search" className={`${textColor} hover:text-primary-500 transition-colors font-medium`}>Explore</Link>
            <Link to="/search?type=shortlet" className={`${textColor} hover:text-primary-500 transition-colors font-medium`}>Shortlets</Link>
            <Link to="/search?type=sale" className={`${textColor} hover:text-primary-500 transition-colors font-medium`}>For Sale</Link>
            <Link to="/search?type=rent" className={`${textColor} hover:text-primary-500 transition-colors font-medium`}>For Rent</Link>
            <Link to="/about" className={`${textColor} hover:text-primary-500 transition-colors font-medium`}>About</Link>
            <Link to="/contact" className={`${textColor} hover:text-primary-500 transition-colors font-medium`}>Contact</Link>
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-2 hover:bg-white/20 transition-all"
                >
                  <img src={userData?.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                  <span className={`font-medium text-sm ${isHome && !scrolled ? 'text-white' : 'text-gray-700'}`}>{userData?.name?.split(' ')[0]}</span>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-800">{userData?.name}</p>
                      <p className="text-xs text-gray-500">{userData?.email}</p>
                      <span className="badge bg-primary-100 text-primary-700 mt-1 capitalize">{userRole}</span>
                    </div>
                    <Link to={getDashboardPath()} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50" onClick={() => setProfileOpen(false)}>
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <Link to="/dashboard/wishlist" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50" onClick={() => setProfileOpen(false)}>
                      <Heart size={16} /> Wishlist
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 w-full text-left">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className={`font-medium ${textColor} hover:opacity-80 transition-opacity`}>Sign in</Link>
                <Link to="/register" className="btn-primary py-2 px-5 text-sm">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className={`md:hidden ${textColor}`}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-xl border-t border-gray-100">
          <div className="px-4 py-4 flex flex-col gap-3">
            <Link to="/search" className="text-gray-700 py-2 font-medium" onClick={() => setMenuOpen(false)}>Explore</Link>
            <Link to="/search?type=shortlet" className="text-gray-700 py-2 font-medium" onClick={() => setMenuOpen(false)}>Shortlets</Link>
            <Link to="/search?type=sale" className="text-gray-700 py-2 font-medium" onClick={() => setMenuOpen(false)}>For Sale</Link>
            <Link to="/search?type=rent" className="text-gray-700 py-2 font-medium" onClick={() => setMenuOpen(false)}>For Rent</Link>
            <Link to="/about" className="text-gray-700 py-2 font-medium" onClick={() => setMenuOpen(false)}>About</Link>
            <Link to="/contact" className="text-gray-700 py-2 font-medium" onClick={() => setMenuOpen(false)}>Contact</Link>
            <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
              {currentUser ? (
                <>
                  <Link to={getDashboardPath()} className="btn-primary text-center" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                  <button onClick={handleLogout} className="text-red-500 font-medium py-2">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary text-center" onClick={() => setMenuOpen(false)}>Sign in</Link>
                  <Link to="/register" className="btn-primary text-center" onClick={() => setMenuOpen(false)}>Get Started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
