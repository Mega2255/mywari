import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, get, push, set, update } from 'firebase/database';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Common/Navbar';
import Footer from '../components/Common/Footer';
import StarRating from '../components/Common/StarRating';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { generateReceipt } from '../utils/receipt';
import toast from 'react-hot-toast';
import {
  MapPin, Bed, Bath, Square, Wifi, Car, Tv, Wind, ChevronLeft,
  ChevronRight, Heart, Share2, Star, Calendar, Phone, MessageSquare,
  CheckCircle, Shield, Download, X, Play
} from 'lucide-react';

const DEMO_PROPERTY = {
  id: '1',
  title: 'Luxury 3-Bedroom Apartment in Lekki Phase 1',
  type: 'shortlet',
  price: '45000',
  city: 'Lagos',
  location: 'Lekki Phase 1',
  address: '14 Admiralty Way, Lekki Phase 1, Lagos',
  bedrooms: 3,
  bathrooms: 3,
  size: 250,
  lat: 6.4434,
  lng: 3.5234,
  description: `Experience luxury living at its finest in this stunning 3-bedroom apartment located in the heart of Lekki Phase 1. This beautifully furnished apartment features contemporary interiors, panoramic city views, and premium amenities.\n\nThe open-plan living area flows seamlessly to a private balcony. The master bedroom boasts a en-suite bathroom and walk-in wardrobe. Two additional bedrooms are perfect for families or groups.\n\nLocated minutes from the best restaurants, shopping malls, and beaches Lagos has to offer.`,
  amenities: ['WiFi', 'Air Conditioning', 'Parking', 'Swimming Pool', 'Smart TV', 'Security', 'Gym', 'Generator', 'Water Supply', 'DSTV'],
  images: [
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80',
  ],
  videoUrl: '',
  agentName: 'Chidi Okafor',
  agentPhone: '+234 801 234 5678',
  agentId: 'agent1',
  avgRating: 4.8,
  reviewCount: 24,
};

const AMENITY_ICONS = {
  WiFi: '📶', 'Air Conditioning': '❄️', Parking: '🚗', 'Swimming Pool': '🏊',
  'Smart TV': '📺', Security: '🔒', Gym: '💪', Generator: '⚡', 'Water Supply': '💧', DSTV: '📡',
};

// Returns the 11-char YouTube video ID from a variety of YouTube URL formats, or null if not YouTube
function getYouTubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  return m ? m[1] : null;
}

export default function PropertyDetailPage() {
  const { id } = useParams();
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const [property, setProperty] = useState(DEMO_PROPERTY);
  const [currentImg, setCurrentImg] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [nights, setNights] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const snap = await get(ref(db, `properties/${id}`));
        if (snap.exists()) setProperty({ id, ...snap.val() });
      } catch {}
    };
    const fetchReviews = async () => {
      try {
        const snap = await get(ref(db, `reviews/${id}`));
        if (snap.exists()) {
          setReviews(Object.values(snap.val()));
        }
      } catch {}
    };
    fetchProperty();
    fetchReviews();
  }, [id]);

  useEffect(() => {
    if (checkIn && checkOut) {
      const d1 = new Date(checkIn), d2 = new Date(checkOut);
      const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
      setNights(diff > 0 ? diff : 1);
    }
  }, [checkIn, checkOut]);

  const total = property.type === 'shortlet' ? parseInt(property.price) * nights : parseInt(property.price);
  const serviceFee = Math.round(total * 0.05);
  const grandTotal = total + serviceFee;

  // Combined gallery media: images first, then the property video (if any) as the last slide
  const media = [
    ...(property.images || []).map(src => ({ type: 'image', src })),
    ...(property.videoUrl ? [{ type: 'video', src: property.videoUrl }] : []),
  ];

  // ─── Flutterwave public key ───────────────────────────────────────────────────
  // Get this from https://dashboard.flutterwave.com/dashboard/settings/apis
  const FLW_PUBLIC_KEY = 'FLWPUBK-e8058a967d7fd3f4b820b092eb057f0f-X';
  // ─────────────────────────────────────────────────────────────────────────────

  const loadFlutterwaveScript = () =>
    new Promise((resolve, reject) => {
      if (window.FlutterwaveCheckout) { resolve(); return; }
      const script = document.createElement('script');
      script.src = 'https://checkout.flutterwave.com/v3.js';
      script.onload = resolve;
      script.onerror = () => reject(new Error('Failed to load Flutterwave. Check your internet connection.'));
      document.body.appendChild(script);
    });

  const handleBook = async () => {
    if (!currentUser) { navigate('/login'); return; }
    if (property.type === 'shortlet' && (!checkIn || !checkOut)) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    // Guard: block if Flutterwave key is still the placeholder
    if (FLW_PUBLIC_KEY.includes('xxxxxxxxxxxx')) {
      toast.error('Payment not configured. Add your Flutterwave public key in PropertyDetailPage.jsx');
      return;
    }

    setBookingLoading(true);
    try {
      await loadFlutterwaveScript();

      // Build subaccount split if agent has a Flutterwave subaccount ID
      // Agent gets 96%, the remaining 4% stays in your main Flutterwave account
      const subaccounts = property.agentFlwSubaccount
  ? [
      {
        id: property.agentFlwSubaccount,
        transaction_split_ratio: 96,  // was 97
      },
    ]
  : undefined;

      window.FlutterwaveCheckout({
        public_key: FLW_PUBLIC_KEY,
        tx_ref: 'MWR_' + Date.now(),
        amount: grandTotal,        // Flutterwave uses naira directly — NOT kobo
        currency: 'NGN',
        payment_options: 'card, banktransfer, ussd',
        customer: {
          email: userData?.email || currentUser.email,
          name: userData?.name || 'Guest',
          phone_number: userData?.phone || '',
        },
        meta: {
          property: property.title,
          checkin: checkIn || 'N/A',
          checkout: checkOut || 'N/A',
        },
        ...(subaccounts && { subaccounts }),
        customizations: {
          title: 'My Wari',
          description: `Booking: ${property.title}`,
          logo: '/favicon.svg',
        },
        callback: (response) => {
          if (response.status === 'successful' || response.status === 'completed') {
            createBooking(response.transaction_id?.toString() || response.tx_ref);
          } else {
            toast.error('Payment was not completed.');
            setBookingLoading(false);
          }
        },
        onclose: () => {
          toast('Payment window closed. No charge was made.', { icon: '⚠️' });
          setBookingLoading(false);
        },
      });
    } catch (err) {
      toast.error(err.message || 'Booking failed. Please try again.');
      setBookingLoading(false);
    }
  };

  const createBooking = async (reference) => {
    const bookingData = {
      propertyId: id,
      propertyTitle: property.title,
      propertyImage: property.images?.[0],
      userId: currentUser.uid,
      userName: userData?.name,
      userEmail: userData?.email || currentUser.email,
      agentId: property.agentId,
      agentName: property.agentName,
      checkIn: checkIn || new Date().toISOString().split('T')[0],
      checkOut: checkOut || new Date().toISOString().split('T')[0],
      nights,
      price: property.price,
      total: grandTotal,
      serviceFee,
      status: 'confirmed',
      paymentRef: reference,
      createdAt: Date.now(),
      type: property.type,
    };
    const bookingRef = push(ref(db, 'bookings'));
    await set(bookingRef, { ...bookingData, id: bookingRef.key });
    // Update agent earnings
    const agentEarningsSnap = await get(ref(db, `agentEarnings/${property.agentId}`));
    const prevTotal = agentEarningsSnap.exists() ? (agentEarningsSnap.val().total || 0) : 0;
    await update(ref(db, `agentEarnings/${property.agentId}`), {
  total: prevTotal + Math.round(grandTotal * 0.96),  // was 0.97
  lastBooking: Date.now(),
});
    toast.success('🎉 Booking confirmed! Receipt downloading...');
    generateReceipt({ ...bookingData, id: bookingRef.key });
    navigate('/dashboard/bookings');
    setBookingLoading(false);
  };

  const submitReview = async () => {
    if (!currentUser) { navigate('/login'); return; }
    const reviewData = {
      userId: currentUser.uid,
      userName: userData?.name,
      avatar: userData?.avatar,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      createdAt: Date.now(),
    };
    await push(ref(db, `reviews/${id}`), reviewData);
    setReviews(prev => [...prev, reviewData]);
    setShowReviewModal(false);
    toast.success('Review submitted!');
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`badge capitalize font-semibold ${property.type === 'shortlet' ? 'bg-blue-100 text-blue-700' : property.type === 'rent' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                {property.type}
              </span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900">{property.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1"><Star size={14} className="fill-amber-400 text-amber-400" />{property.avgRating} ({property.reviewCount} reviews)</span>
              <span className="flex items-center gap-1"><MapPin size={14} className="text-primary-500" />{property.address}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setWishlisted(!wishlisted)} className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${wishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-200 text-gray-600 hover:border-red-300'}`}>
              <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} /> Save
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-primary-300 transition-all">
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>

        {/* Gallery */}
        <div className="relative rounded-2xl overflow-hidden mb-8 h-[400px] md:h-[500px] group bg-black">
          {media[currentImg]?.type === 'video' ? (
            getYouTubeId(media[currentImg].src) ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${getYouTubeId(media[currentImg].src)}`}
                title="Property video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video src={media[currentImg].src} controls className="w-full h-full object-cover bg-black" />
            )
          ) : (
            <img src={media[currentImg]?.src} alt="" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          {media.length > 1 && (
            <>
              <button onClick={() => setCurrentImg(i => (i - 1 + media.length) % media.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors z-10">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => setCurrentImg(i => (i + 1) % media.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors z-10">
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {media.map((_, i) => (
                  <button key={i} onClick={() => setCurrentImg(i)} className={`w-2 h-2 rounded-full transition-all ${i === currentImg ? 'bg-white w-6' : 'bg-white/50'}`} />
                ))}
              </div>
            </>
          )}
          {/* Thumbnail strip */}
          <div className="absolute bottom-4 right-4 flex gap-2 z-10">
            {media.slice(0, 4).map((m, i) => (
              <button key={i} onClick={() => setCurrentImg(i)} className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all flex items-center justify-center bg-black ${i === currentImg ? 'border-white' : 'border-transparent opacity-70'}`}>
                {m.type === 'video' ? (
                  <Play size={16} className="text-white fill-white" />
                ) : (
                  <img src={m.src} alt="" className="w-full h-full object-cover" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Key stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Bed, label: 'Bedrooms', val: property.bedrooms || 'N/A' },
                { icon: Bath, label: 'Bathrooms', val: property.bathrooms || 'N/A' },
                { icon: Square, label: 'Size', val: property.size ? `${property.size} sqm` : 'N/A' },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
                  <s.icon size={24} className="text-primary-600 mx-auto mb-2" />
                  <p className="font-bold text-gray-900">{s.val}</p>
                  <p className="text-gray-500 text-xs">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-display text-xl font-bold text-gray-900 mb-4">About this property</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.amenities?.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                    <span className="text-lg">{AMENITY_ICONS[a] || '✓'}</span>
                    {a}
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Location</h2>
              <p className="text-gray-500 text-sm mb-4 flex items-center gap-1"><MapPin size={14} />{property.address}</p>
              <div className="h-64 rounded-xl overflow-hidden">
                <MapContainer center={[property.lat || 6.5244, property.lng || 3.3792]} zoom={14} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='© OpenStreetMap' />
                  <Marker position={[property.lat || 6.5244, property.lng || 3.3792]}>
                    <Popup>{property.title}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-gray-900">Reviews</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={Math.round(property.avgRating)} />
                    <span className="font-bold text-gray-900">{property.avgRating}</span>
                    <span className="text-gray-500 text-sm">({property.reviewCount || reviews.length} reviews)</span>
                  </div>
                </div>
                {currentUser && (
                  <button onClick={() => setShowReviewModal(true)} className="btn-primary py-2 px-4 text-sm">Write Review</button>
                )}
              </div>
              <div className="space-y-4">
                {reviews.slice(0, 5).map((r, i) => (
                  <div key={i} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-center gap-3 mb-2">
                      <img src={r.avatar || `https://ui-avatars.com/api/?name=${r.userName}&background=6b8e23&color=fff`} alt="" className="w-9 h-9 rounded-full" />
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{r.userName}</p>
                        <StarRating rating={r.rating} size={12} />
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{r.comment}</p>
                  </div>
                ))}
                {reviews.length === 0 && <p className="text-gray-400 text-sm">No reviews yet. Be the first to review!</p>}
              </div>
            </div>
          </div>

          {/* Booking sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
              <div className="mb-4">
                <span className="font-display text-3xl font-bold text-primary-700">
                  ₦{parseInt(property.price).toLocaleString()}
                </span>
                <span className="text-gray-500 text-sm">
                  {property.type === 'shortlet' ? '/night' : property.type === 'rent' ? '/year' : ''}
                </span>
              </div>

              {property.type === 'shortlet' && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Check-in</label>
                    <input type="date" value={checkIn} min={new Date().toISOString().split('T')[0]} onChange={e => setCheckIn(e.target.value)} className="input-field text-sm py-2" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Check-out</label>
                    <input type="date" value={checkOut} min={checkIn || new Date().toISOString().split('T')[0]} onChange={e => setCheckOut(e.target.value)} className="input-field text-sm py-2" />
                  </div>
                </div>
              )}

              <div className="border-t border-gray-100 pt-4 mb-4 space-y-2 text-sm">
                {property.type === 'shortlet' && (
                  <div className="flex justify-between text-gray-600">
                    <span>₦{parseInt(property.price).toLocaleString()} × {nights} nights</span>
                    <span>₦{(parseInt(property.price) * nights).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Service fee (5%)</span>
                  <span>₦{serviceFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-100 pt-2">
                  <span>Total</span>
                  <span>₦{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button onClick={handleBook} disabled={bookingLoading} className="btn-primary w-full flex items-center justify-center gap-2">
                {bookingLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                {bookingLoading ? 'Processing...' : 'Book Now'}
              </button>

              <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                <Shield size={12} /> Secure payment via Flutterwave
              </p>
            </div>

            {/* Agent card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Listed by</h3>
              <div className="flex items-center gap-3 mb-4">
                <img src={`https://ui-avatars.com/api/?name=${property.agentName}&background=5C3D2E&color=fff&size=100`} alt="" className="w-12 h-12 rounded-full" />
                <div>
                  <p className="font-semibold text-gray-800">{property.agentName}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1"><CheckCircle size={12} className="text-green-500" /> Verified Agent</p>
                </div>
              </div>
              <a href={`tel:${property.agentPhone}`} className="flex items-center gap-2 w-full btn-secondary py-2.5 text-sm justify-center">
                <Phone size={16} /> Call Agent
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowReviewModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-bold">Write a Review</h3>
              <button onClick={() => setShowReviewModal(false)}><X size={20} /></button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Your rating</p>
              <StarRating rating={reviewForm.rating} size={28} interactive onChange={r => setReviewForm(f => ({ ...f, rating: r }))} />
            </div>
            <textarea
              value={reviewForm.comment}
              onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
              placeholder="Share your experience..."
              rows={4}
              className="input-field resize-none mb-4"
            />
            <button onClick={submitReview} className="btn-primary w-full">Submit Review</button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}