import logo from '../../assets/logo.jpeg';

export default function Preloader() {
  return (
    <div className="preloader">
      <div className="preloader-logo flex flex-col items-center gap-3">
        <img src={logo} alt="My Wari" className="w-28 h-auto object-contain" style={{borderRadius:'12px'}} />
        <div className="flex flex-col items-center">
          <span className="font-display text-3xl font-bold text-primary-700">My Wari</span>
          <span className="text-sm text-gray-500 font-body tracking-widest uppercase">Find Your Perfect Home</span>
        </div>
      </div>
      <div className="preloader-bar">
        <div className="preloader-bar-fill"></div>
      </div>
      <p className="text-sm text-gray-400 animate-pulse">Loading your experience...</p>
    </div>
  );
}
