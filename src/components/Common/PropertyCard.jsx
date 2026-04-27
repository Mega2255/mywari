import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, Bed, Bath, Square } from 'lucide-react';
import { useState } from 'react';
import { ref, update, get } from 'firebase/database';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function PropertyCard({ property }) {
  const { currentUser } = useAuth();
  const [wishlisted, setWishlisted] = useState(false);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    if (!currentUser) { toast.error('Please login to save properties'); return; }
    const path = `wishlists/${currentUser.uid}/${property.id}`;
    const snap = await get(ref(db, path));
    if (snap.exists()) {
      await update(ref(db, `wishlists/${currentUser.uid}`), { [property.id]: null });
      setWishlisted(false);
      toast.success('Removed from wishlist');
    } else {
      await update(ref(db, `wishlists/${currentUser.uid}`), { [property.id]: true });
      setWishlisted(true);
      toast.success('Added to wishlist');
    }
  };

  const formatPrice = (price, type) => {
    const num = parseInt(price).toLocaleString('en-NG');
    if (type === 'shortlet') return `₦${num}/night`;
    if (type === 'rent') return `₦${num}/year`;
    return `₦${num}`;
  };

  const typeColors = {
    shortlet: 'bg-blue-100 text-blue-700',
    rent: 'bg-amber-100 text-amber-700',
    sale: 'bg-green-100 text-green-700',
  };

  return (
    <Link to={`/property/${property.id}`} className="property-card card block group">
      {/* Image */}
      <div className="relative overflow-hidden h-56">
        <img
          src={property.images?.[0] || `https://source.unsplash.com/800x600/?house,nigeria&sig=${property.id}`}
          alt={property.title}
          className="property-image w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        
        {/* Type badge */}
        <span className={`absolute top-3 left-3 badge ${typeColors[property.type] || 'bg-gray-100 text-gray-700'} capitalize font-semibold`}>
          {property.type}
        </span>

        {/* Wishlist btn */}
        <button
          onClick={toggleWishlist}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${wishlisted ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500'}`}
        >
          <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Rating */}
        {property.avgRating && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
            <Star size={12} className="star-filled fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-gray-800">{property.avgRating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display font-semibold text-gray-900 text-lg leading-tight line-clamp-1 group-hover:text-primary-700 transition-colors">{property.title}</h3>
        </div>

        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <MapPin size={13} className="text-primary-500 flex-shrink-0" />
          <span className="line-clamp-1">{property.location}, {property.city}</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          {property.bedrooms && (
            <span className="flex items-center gap-1"><Bed size={14} className="text-gray-400" />{property.bedrooms} Bed</span>
          )}
          {property.bathrooms && (
            <span className="flex items-center gap-1"><Bath size={14} className="text-gray-400" />{property.bathrooms} Bath</span>
          )}
          {property.size && (
            <span className="flex items-center gap-1"><Square size={14} className="text-gray-400" />{property.size}sqm</span>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <p className="font-display font-bold text-primary-700 text-xl">
            {formatPrice(property.price, property.type)}
          </p>
          <span className="text-xs text-gray-400">by {property.agentName || 'Agent'}</span>
        </div>
      </div>
    </Link>
  );
}
