import { Link } from 'react-router-dom';
import { Instagram, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import logo from '../../assets/logo.jpeg';

// UPDATE THESE LINKS WHEN APPS ARE LIVE:
const APP_STORE_URL = null; // e.g. 'https://apps.apple.com/app/my-wari/id123456789'
const PLAY_STORE_URL = null; // e.g. 'https://play.google.com/store/apps/details?id=com.mywari'

export default function Footer() {
  const handleAppStore = (e) => {
    if (!APP_STORE_URL) {
      e.preventDefault();
      alert('🍎 My Wari is coming soon to the App Store! Stay tuned.');
    }
  };
  const handlePlayStore = (e) => {
    if (!PLAY_STORE_URL) {
      e.preventDefault();
      alert('🤖 My Wari is coming soon to Google Play! Stay tuned.');
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logo} alt="My Wari" className="h-10 w-auto object-contain rounded-lg" />
              <span className="font-display text-2xl font-bold text-white">My Wari</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 mb-6">
              Nigeria's premier real estate marketplace. Find shortlets, rentals, and homes for sale across every city. Inspired by the Ijaw word "Wari" — meaning Home.
            </p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/mywariltd?igsh=cGJmNDZzZzNsY24y&utm_source=qr" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary-600 transition-colors" title="Instagram">
                <Instagram size={16} />
              </a>
              <a href="https://wa.me/2348162983569" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-600 transition-colors" title="WhatsApp">
                <MessageCircle size={16} />
              </a>
              <a href="mailto:hello.mywari@gmail.com"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary-600 transition-colors" title="Email">
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display text-white text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm hover:text-primary-400 transition-colors">About Us</Link></li>
              <li><a href="#how-it-works" className="text-sm hover:text-primary-400 transition-colors">How it Works</a></li>
              <li><Link to="/contact" className="text-sm hover:text-primary-400 transition-colors">Contact Us</Link></li>
              <li><a href="#" className="text-sm hover:text-primary-400 transition-colors">Careers</a></li>
              <li><a href="#" className="text-sm hover:text-primary-400 transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-white text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-3">
              {['Shortlet Booking', 'Long-term Rentals', 'Property Sales', 'Agent Services', 'Property Management', 'Support'].map(item => (
                <li key={item}><a href="#" className="text-sm hover:text-primary-400 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact + App */}
          <div>
            <h4 className="font-display text-white text-lg font-semibold mb-4">Get in Touch</h4>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start gap-3 text-sm">
                <MapPin size={16} className="text-primary-400 mt-0.5 flex-shrink-0" />
                <span>Victoria Island, Lagos, Nigeria</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-primary-400 flex-shrink-0" />
                <a href="https://wa.me/2348162983569" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">+234 816 298 3569</a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-primary-400 flex-shrink-0" />
                <a href="mailto:hello.mywari@gmail.com" className="hover:text-primary-400 transition-colors">hello.mywari@gmail.com</a>
              </li>
            </ul>

            {/* App Store Badges */}
            <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-semibold">Download the App</p>
            <div className="flex flex-col gap-2">
              {/* App Store */}
              <a href={APP_STORE_URL || '#'} onClick={handleAppStore} target={APP_STORE_URL ? '_blank' : '_self'} rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-3 py-2.5 transition-all group">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white flex-shrink-0" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div>
                  <p className="text-[10px] text-gray-400 leading-none">Download on the</p>
                  <p className="text-sm font-semibold text-white leading-tight">App Store</p>
                </div>
              </a>

              {/* Play Store */}
              <a href={PLAY_STORE_URL || '#'} onClick={handlePlayStore} target={PLAY_STORE_URL ? '_blank' : '_self'} rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-3 py-2.5 transition-all group">
                <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none">
                  <path d="M3.18 23.76a2 2 0 001.64-.08l12.23-7.1-2.83-2.83-11.04 10z" fill="#EA4335"/>
                  <path d="M20.53 9.22L16.88 7.1 13.8 10l3.1 3.1 3.63-2.13a1.5 1.5 0 000-1.75z" fill="#FBBC04"/>
                  <path d="M3.18.24A2 2 0 001 2.29v19.42l11.05-10-8.87-8.87-.73-.6z" fill="#34A853"/>
                  <path d="M16.88 16.9l-12.06 7.01a2 2 0 01-1.64.08L14.22 13l2.66 3.9z" fill="#4285F4"/>
                </svg>
                <div>
                  <p className="text-[10px] text-gray-400 leading-none">Get it on</p>
                  <p className="text-sm font-semibold text-white leading-tight">Google Play</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} My Wari. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300">Terms of Service</a>
            <a href="#" className="hover:text-gray-300">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}