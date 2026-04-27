import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, maxStars = 5, size = 16, interactive = false, onChange }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxStars }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={`transition-colors ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 fill-gray-300'} ${interactive ? 'cursor-pointer hover:text-amber-300' : ''}`}
          onClick={() => interactive && onChange && onChange(i + 1)}
        />
      ))}
    </div>
  );
}
