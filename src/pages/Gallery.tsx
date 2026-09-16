import { useState } from 'react';
import { Search, Filter, Grid3x3, List, LayoutGrid, Heart, Download, Trash2, FolderOpen, SlidersHorizontal, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import ImageCard from '@/components/ui/ImageCard';
import ImageDetailModal from '@/components/ui/ImageDetailModal';

const FILTER_MODELS = ['All Models', 'PixelForge Flux Pro', 'PixelForge Pro', 'PixelForge Fast', 'Flux Pro', 'Realistic Vision', 'Cinematic XL'];
const FILTER_STYLES = ['All Styles', 'Cinematic', 'Photorealistic', 'Fashion', 'Architecture', 'Sci-Fi', 'Fantasy', 'Illustration', 'Product Photography'];

export default function Gallery() {
  const { images, showToast } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'masonry' | 'list'>('masonry');
  const [search, setSearch] = useState('');
  const [selectedModel, setSelectedModel] = useState('All Models');
  const [selectedStyle, setSelectedStyle] = useState('All Styles');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = images.filter(img => {
    if (showFavoritesOnly && !img.isFavorite) return false;
    if (selectedModel !== 'All Models' && img.model !== selectedModel) return false;
    if (selectedStyle !== 'All Styles' && img.style !== selectedStyle) return false;
    if (search && !img.prompt.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectedImage = images.find(i => i.id === selectedImageId) ?? null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gallery</h1>
          <p className="text-gray-500 text-sm mt-1">{images.length.toLocaleString()} images in your library</p>
        </div>
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">{selectedIds.size} selected</span>
            <button onClick={() => showToast(`${selectedIds.size} images downloaded!`)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white transition-all">
              <Download size={14} />Download
            </button>
            <button onClick={() => showToast(`${selectedIds.size} images moved to project`)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white transition-all">
              <FolderOpen size={14} />Move
            </button>
            <button onClick={() => { setSelectedIds(new Set()); showToast('Images deleted'); }} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/15 border border-red-500/30 text-sm text-red-400 hover:bg-red-500/25 transition-all">
              <Trash2 size={14} />Delete
            </button>
            <button onClick={() => setSelectedIds(new Set())} className="p-2 rounded-xl text-gray-500 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by prompt..."
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/8 rounded-xl text-sm text-white placeholder:text-gray-700 outline-none focus:border-violet-500/50 transition-all"
          />
        </div>

        <button
          onClick={() => setShowFavoritesOnly(v => !v)}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${showFavoritesOnly ? 'bg-rose-500/20 border-rose-500/40 text-rose-400' : 'bg-white/5 border-white/8 text-gray-500 hover:text-gray-300'}`}
        >
          <Heart size={14} fill={showFavoritesOnly ? 'currentColor' : 'none'} />
          Favorites
        </button>

        <button
          onClick={() => setShowFilters(v => !v)}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${showFilters ? 'bg-violet-500/20 border-violet-500/40 text-violet-400' : 'bg-white/5 border-white/8 text-gray-500 hover:text-gray-300'}`}
        >
          <SlidersHorizontal size={14} />
          Filters
        </button>

        <div className="flex gap-1 bg-white/5 border border-white/8 p-1 rounded-xl ml-auto">
          {[{ mode: 'masonry', icon: LayoutGrid }, { mode: 'grid', icon: Grid3x3 }, { mode: 'list', icon: List }].map(({ mode, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode as typeof viewMode)}
              className={`p-1.5 rounded-lg transition-all ${viewMode === mode ? 'bg-white/15 text-white' : 'text-gray-600 hover:text-gray-400'}`}
            >
              <Icon size={15} />
            </button>
          ))}
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-gray-900/60 border border-white/8 rounded-2xl p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">Model</label>
              <div className="flex flex-wrap gap-1.5">
                {FILTER_MODELS.map(m => (
                  <button key={m} onClick={() => setSelectedModel(m)} className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${selectedModel === m ? 'bg-violet-500/20 border border-violet-500/40 text-violet-400' : 'bg-white/5 border border-white/8 text-gray-500 hover:text-gray-300'}`}>{m}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">Style</label>
              <div className="flex flex-wrap gap-1.5">
                {FILTER_STYLES.map(s => (
                  <button key={s} onClick={() => setSelectedStyle(s)} className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${selectedStyle === s ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-400' : 'bg-white/5 border border-white/8 text-gray-500 hover:text-gray-300'}`}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Images */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <LayoutGrid size={48} className="text-gray-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 mb-2">No images found</h3>
          <p className="text-gray-700 text-sm">Try adjusting your filters or search query</p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="space-y-2">
          {filtered.map(img => (
            <div key={img.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-900/60 border border-white/5 hover:border-white/15 transition-colors cursor-pointer" onClick={() => setSelectedImageId(img.id)}>
              <input type="checkbox" checked={selectedIds.has(img.id)} onChange={() => toggleSelect(img.id)} onClick={e => e.stopPropagation()} className="accent-violet-500" />
              <img src={img.url} alt="" className="w-14 h-10 object-cover rounded-lg" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-300 truncate">{img.prompt}</p>
                <p className="text-xs text-gray-600 mt-0.5">{img.model} · {img.resolution}</p>
              </div>
              <div className="text-xs text-gray-600">{new Date(img.createdAt).toLocaleDateString()}</div>
              {img.isFavorite && <Heart size={14} fill="currentColor" className="text-rose-400 shrink-0" />}
            </div>
          ))}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map(img => (
            <ImageCard key={img.id} image={img} onOpen={setSelectedImageId} />
          ))}
        </div>
      ) : (
        <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4">
          {filtered.map(img => (
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
