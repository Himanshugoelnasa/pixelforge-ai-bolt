import { useState } from 'react';
import { Heart, Search } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import ImageCard from '@/components/ui/ImageCard';
import ImageDetailModal from '@/components/ui/ImageDetailModal';

export default function Favorites() {
  const { images } = useApp();
  const [search, setSearch] = useState('');
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const favorites = images.filter(img => {
    if (!img.isFavorite) return false;
    if (search && !img.prompt.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selectedImage = images.find(i => i.id === selectedImageId) ?? null;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Favorites</h1>
        <p className="text-gray-500 text-sm mt-1">{favorites.length} favorited images</p>
      </div>

      <div className="relative max-w-md">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search favorites..."
          className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/8 rounded-xl text-sm text-white placeholder:text-gray-700 outline-none focus:border-violet-500/50 transition-all"
        />
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <Heart size={28} className="text-rose-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-400 mb-2">No favorites yet</h3>
          <p className="text-gray-600 text-sm">Tap the heart icon on any image to save it here</p>
        </div>
      ) : (
        <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4">
          {favorites.map(img => (
            <div key={img.id} className="break-inside-avoid">
              <ImageCard image={img} onOpen={setSelectedImageId} />
            </div>
          ))}
        </div>
      )}

      <ImageDetailModal image={selectedImage} onClose={() => setSelectedImageId(null)} />
    </div>
  );
}
