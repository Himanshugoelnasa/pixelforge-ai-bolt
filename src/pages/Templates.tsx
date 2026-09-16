import { useState } from 'react';
import { Search, Star, Play, Bookmark, TrendingUp, Filter } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { MOCK_TEMPLATES } from '@/lib/mockData';

const CATEGORIES = ['All', 'E-commerce', 'Content', 'Photography', 'Art', 'Fashion', 'Architecture', 'Marketing', 'Publishing', 'Gaming', 'Social Media'];

export default function Templates() {
  const { navigate, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const filtered = MOCK_TEMPLATES.filter(t => {
    if (category !== 'All' && t.category !== category) return false;
    if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleSave = (id: string) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    showToast(savedIds.has(id) ? 'Template removed from saved' : 'Template saved!');
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Templates</h1>
        <p className="text-gray-500 text-sm mt-1">Ready-made generation templates for common use cases</p>
      </div>

      {/* Featured */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-950/80 to-cyan-950/50 border border-violet-500/20 p-6">
        <div className="absolute inset-0 opacity-20">
          <img src={MOCK_TEMPLATES[0].previewImage} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 to-transparent" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={14} className="text-violet-400" />
              <span className="text-xs font-medium text-violet-400 uppercase tracking-wider">Most Popular</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{MOCK_TEMPLATES[0].name}</h2>
            <p className="text-gray-400 text-sm mb-4">{MOCK_TEMPLATES[0].description}</p>
            <div className="flex items-center gap-4">
              <button onClick={() => { navigate('generator'); showToast('Template loaded!'); }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold text-sm hover:from-violet-500 hover:to-cyan-400 transition-all">
                <Play size={14} />Use Template
              </button>
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <Star size={13} className="text-amber-400 fill-amber-400" />
                {MOCK_TEMPLATES[0].rating} · {MOCK_TEMPLATES[0].usageCount.toLocaleString()} uses
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/8 rounded-xl text-sm text-white placeholder:text-gray-700 outline-none focus:border-violet-500/50 transition-all"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${category === c ? 'bg-violet-500/20 border border-violet-500/40 text-violet-400' : 'bg-white/5 border border-white/8 text-gray-500 hover:text-gray-300'}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map(tmpl => (
          <div key={tmpl.id} className="group bg-gray-900/60 border border-white/5 rounded-2xl overflow-hidden hover:border-white/15 transition-all hover:shadow-xl hover:-translate-y-0.5">
            <div className="relative aspect-video overflow-hidden">
              <img src={tmpl.previewImage} alt={tmpl.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => toggleSave(tmpl.id)} className={`p-1.5 rounded-lg backdrop-blur-sm transition-colors ${savedIds.has(tmpl.id) ? 'bg-violet-500 text-white' : 'bg-black/50 text-gray-300 hover:text-white'}`}>
                  <Bookmark size={13} fill={savedIds.has(tmpl.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
              <span className="absolute bottom-2 left-2 text-xs bg-black/50 backdrop-blur-sm text-gray-300 px-2 py-0.5 rounded-full">{tmpl.category}</span>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-white mb-1">{tmpl.name}</h3>
              <p className="text-xs text-gray-500 line-clamp-2 mb-3">{tmpl.description}</p>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs bg-white/5 border border-white/8 px-2 py-0.5 rounded-full text-gray-400">{tmpl.model}</span>
                <span className="text-xs bg-white/5 border border-white/8 px-2 py-0.5 rounded-full text-gray-400">{tmpl.aspectRatio}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Star size={11} className="text-amber-400 fill-amber-400" />
                  {tmpl.rating} · {tmpl.usageCount.toLocaleString()}
                </div>
                <button
                  onClick={() => { navigate('generator'); showToast(`"${tmpl.name}" template loaded!`); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600/60 to-cyan-500/40 text-white text-xs font-medium hover:from-violet-600 hover:to-cyan-500 transition-all"
                >
                  <Play size={12} />
                  Use
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
