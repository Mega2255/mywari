import { Link } from 'react-router-dom';
import Navbar from '../components/Common/Navbar';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <div className="text-8xl mb-6">🏠</div>
        <h1 className="font-display text-6xl font-bold text-primary-700 mb-4">404</h1>
        <h2 className="font-display text-2xl font-bold text-gray-800 mb-3">Page Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md">Looks like this property doesn't exist. Let's get you back home.</p>
        <div className="flex gap-4">
          <Link to="/" className="btn-primary">Go Home</Link>
          <Link to="/search" className="btn-secondary">Browse Properties</Link>
        </div>
      </div>
    </div>
  );
}
