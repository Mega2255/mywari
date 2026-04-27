# My Wari 🏠
**Nigeria's Premier Real Estate Marketplace**

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Firebase
Edit `src/firebase.js` and replace the placeholder values with your Firebase project config:
```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Set Firebase Database Rules
Copy `database.rules.json` content into your Firebase Realtime Database rules.

### 4. Create Admin Account
In Firebase Console → Authentication → Add user:
- Email: `admin@mywari.ng`
- Password: `admin123`

Then in Realtime Database, add:
```json
{
  "users": {
    "YOUR_ADMIN_UID": {
      "uid": "YOUR_ADMIN_UID",
      "email": "admin@mywari.ng",
      "name": "Admin",
      "role": "admin",
      "avatar": "https://ui-avatars.com/api/?name=Admin&background=6b8e23&color=fff",
      "createdAt": 1700000000000
    }
  }
}
```

### 5. Run the app
```bash
npm run dev
```

---

## 💳 Paystack Integration

### Enable Paystack Split Payments
1. Login to [Paystack Dashboard](https://dashboard.paystack.com)
2. Go to **Settings → Subaccounts**
3. Create a subaccount for each agent
4. Copy the subaccount code (e.g., `ACCT_xxxxxxxxxx`)
5. When creating an agent in Admin Dashboard, paste their subaccount code

### Add Paystack Script
In `index.html`, before `</body>`, add:
```html
<script src="https://js.paystack.co/v1/inline.js"></script>
```

### Update Public Key
In `src/pages/PropertyDetailPage.jsx`, replace:
```js
key: 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
```
with your actual Paystack public key.

---

## 📁 Project Structure
```
src/
├── components/
│   └── Common/
│       ├── Navbar.jsx          # Top navigation
│       ├── Footer.jsx          # Site footer
│       ├── Preloader.jsx       # Loading screen
│       ├── PropertyCard.jsx    # Property listing card
│       ├── SearchBar.jsx       # Search input component
│       └── StarRating.jsx      # Star rating display
├── contexts/
│   └── AuthContext.jsx         # Firebase Auth + roles
├── pages/
│   ├── HomePage.jsx            # Landing page
│   ├── LoginPage.jsx           # Sign in
│   ├── RegisterPage.jsx        # Sign up
│   ├── SearchPage.jsx          # Property search/filter
│   ├── PropertyDetailPage.jsx  # Single property + booking
│   ├── UserDashboard.jsx       # User: bookings, wishlist
│   ├── AgentDashboard.jsx      # Agent: properties, earnings
│   ├── AdminDashboard.jsx      # Admin: full control panel
│   └── NotFound.jsx            # 404 page
├── utils/
│   └── receipt.js              # PDF receipt generator
├── firebase.js                 # Firebase config
├── App.jsx                     # Router + auth
├── main.jsx                    # Entry point
└── index.css                   # Global styles
```

---

## 🎯 Features

### Homepage
- Hero with search bar
- Featured properties (shortlet / rent / sale)
- Browse by category
- Browse by city
- How it works
- Testimonials & reviews
- Stats counter
- Newsletter signup

### Authentication
- Email/Password registration
- Login with role-based redirect
- Protected routes (user / agent / admin)

### Search & Filtering
- Search by keyword, city, type
- Filter by price range, bedrooms
- Sort by price, rating, newest

### Property Detail
- Image gallery with thumbnails
- Google Maps (via Leaflet + OpenStreetMap)
- Amenities list
- Booking widget with date picker
- Price breakdown (base + service fee)
- Paystack payment integration
- PDF receipt auto-download after booking
- Reviews & star ratings

### User Dashboard
- Booking history
- Download receipts (PDF)
- Wishlist
- Profile management

### Agent Dashboard
- Add / Edit / Delete properties
- View all bookings for their properties
- Earnings tracker (40% split)
- See all users

### Admin Dashboard
- Platform stats overview
- Create agent accounts (email + password + Paystack subaccount)
- Update agent email/password
- Delete agent accounts
- Manage all properties
- View all bookings
- Full financial reports (60/40 split breakdown)
- View all users

---

## 💰 Revenue Split (Paystack)
- **Admin**: 60% of each booking
- **Agent**: 40% of each booking (via Paystack subaccount)

The split is handled automatically by Paystack when:
1. The agent has a Paystack subaccount set
2. The property has the `agentSubaccount` field populated

---

## 🗺️ Maps
Uses **Leaflet + OpenStreetMap** (free, no API key needed).
Properties need `lat` and `lng` fields for map pins.

---

## 🧾 PDF Receipts
Generated client-side using **jsPDF**.
Auto-downloaded after successful booking.

---

## 🛠️ Tech Stack
- **React 18** + Vite
- **Tailwind CSS** 
- **Firebase** (Realtime Database + Auth)
- **React Router v6**
- **Leaflet** (Maps)
- **jsPDF** (Receipts)
- **Lucide React** (Icons)
- **React Hot Toast** (Notifications)
- **Paystack** (Payments + Split)

---

## 📞 Support
Built for My Wari | hello@mywari.ng
