import { useState } from 'react';
import { Zap, Star, Play, Heart, Search, Sparkles, Shield } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { MOCK_MODELS } from '@/lib/mockData';

const SPEED_COLOR = { fast: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30', medium: 'text-amber-400 bg-amber-500/15 border-amber-500/30', slow: 'text-blue-400 bg-blue-500/15 border-blue-500/30' };
const QUALITY_COLOR = { standard: 'text-gray-400', high: 'text-violet-400', ultra: 'text-cyan-400' };

const QualityDots = ({ q }: { q: string }) => {
  const count = q === 'ultra' ? 4 : q === 'high' ? 3 : 2;
  return (
    <div className="flex gap-1">
      {[1,2,3,4].map(i => (
        <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= count ? (q === 'ultra' ? 'bg-cyan-400' : q === 'high' ? 'bg-violet-400' : 'bg-gray-400') : 'bg-white/10'}`} />
      ))}
    </div>
  );
};

export default function Models() {
  const { navigate, showToast } = useApp();
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['model-1']));
  const [search, setSearch] = useState('');

  const filtered = MOCK_MODELS.filter(m =>
    !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.description.toLowerCase().includes(search.toLowerCase())
  );

  const toggleFav = (id: string) => {
    setFavorites(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
    showToast(favorites.has(id) ? 'Removed from favorites' : 'Added to favorites');
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Models</h1>
        <p className="text-gray-500 text-sm mt-1">Choose the right model for your creative vision</p>
      </div>

      {/* Hero model */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-950/80 via-gray-900 to-cyan-950/50 border border-violet-500/20 p-6">
        <div className="absolute inset-0 opacity-20">
          <img src={MOCK_MODELS[0].previewImage} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 to-transparent" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-violet-400" />
            <span className="text-xs font-medium text-violet-400 uppercase tracking-wider">Recommended Model</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">{MOCK_MODELS[0].name}</h2>
          <p className="text-gray-400 text-sm max-w-xl mb-4">{MOCK_MODELS[0].description}</p>
          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center gap-1.5 text-sm text-gray-400"><Shield size={14} className="text-violet-400" />Ultra Quality</div>
            <div className="flex items-center gap-1.5 text-sm text-gray-400"><Zap size={14} className="text-amber-400" />{MOCK_MODELS[0].costPerImage} credits/image</div>
          </div>
          <button onClick={() => { navigate('generator'); showToast('PixelForge Flux Pro selected!'); }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold text-sm hover:from-violet-500 hover:to-cyan-400 transition-all">
            <Play size={14} />Try This Model
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search models..." className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/8 rounded-xl text-sm text-white placeholder:text-gray-700 outline-none focus:border-violet-500/50 max-w-md transition-all" />
      </div>

      {/* Model grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map(model => (
          <div key={model.id} className="group bg-gray-900/60 border border-white/5 rounded-2xl overflow-hidden hover:border-white/15 transition-all hover:shadow-xl hover:-translate-y-0.5">
            <div className="relative aspect-video overflow-hidden">
              <img src={model.previewImage} alt={model.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              {model.recommended && (
                <div className="absolute top-2 left-2">
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-violet-600 to-cyan-500 text-white">
                    <Star size={10} fill="white" />Recommended
                  </span>
                </div>
              )}
              {model.new && (
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500 text-white">New</span>
                </div>
              )}
              <button onClick={() => toggleFav(model.id)} className={`absolute top-2 right-2 p-1.5 rounded-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 ${favorites.has(model.id) ? 'bg-rose-500 text-white' : 'bg-black/50 text-gray-300 hover:text-white'}`}>
                <Heart size={13} fill={favorites.has(model.id) ? 'currentColor' : 'none'} />
              </button>
              <div className="absolute bottom-2 left-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${SPEED_COLOR[model.speed]}`}>
                  {model.speed.charAt(0).toUpperCase() + model.speed.slice(1)}
                </span>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-white leading-tight">{model.name}</h3>
                  <span className="text-xs text-gray-600 ml-2 shrink-0">v{model.version}</span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">{model.description}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-gray-600">Quality</p>
                  <QualityDots q={model.quality} />
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">Cost</p>
                  <p className={`text-sm font-bold ${QUALITY_COLOR[model.quality]}`}>{model.costPerImage} <span className="text-xs font-normal text-gray-600">credits</span></p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {model.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-xs bg-white/5 border border-white/8 px-2 py-0.5 rounded-full text-gray-500">{tag}</span>
                ))}
              </div>

              <button
                onClick={() => { navigate('generator'); showToast(`${model.name} selected!`); }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-gradient-to-r from-violet-600/60 to-cyan-500/40 text-white text-xs font-semibold hover:from-violet-600 hover:to-cyan-500 transition-all"
              >
                <Play size={12} />
                Try Model
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
