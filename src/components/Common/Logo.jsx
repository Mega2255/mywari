import logoImg from '../../assets/logo.jpeg';

export default function Logo({ size = 40, className = '' }) {
  return (
    <img
      src={logoImg}
      alt="My Wari"
      style={{ height: size, width: 'auto' }}
      className={`object-contain ${className}`}
    />
  );
}
