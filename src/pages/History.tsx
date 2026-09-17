import { useState } from 'react';
import { Clock, Search, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import ImageDetailModal from '@/components/ui/ImageDetailModal';

interface HistoryEntry {
  id: string;
  prompt: string;
  model: string;
  status: 'completed' | 'failed' | 'processing';
  time: string;
  credits: number;
  imageId?: string;
}

const HISTORY: HistoryEntry[] = [
  { id: 'h1', prompt: 'Futuristic cyberpunk city at night, cinematic lighting', model: 'PixelForge Flux Pro', status: 'completed', time: '2 min ago', credits: 8, imageId: 'img-1' },
  { id: 'h2', prompt: 'Surreal abstract landscape with vibrant colors', model: 'PixelForge Pro', status: 'completed', time: '15 min ago', credits: 6, imageId: 'img-2' },
  { id: 'h3', prompt: 'High fashion editorial, woman in black dress', model: 'Realistic Vision', status: 'completed', time: '1 hr ago', credits: 10, imageId: 'img-3' },
  { id: 'h4', prompt: 'Elegant face cream container, product photography', model: 'PixelForge Fast', status: 'completed', time: '2 hrs ago', credits: 4, imageId: 'img-4' },
  { id: 'h5', prompt: '3D abstract purple mountainous terrain', model: 'Flux Pro', status: 'failed', time: '3 hrs ago', credits: 0 },
  { id: 'h6', prompt: 'Minimalist cylindrical building, architectural', model: 'Cinematic XL', status: 'completed', time: '5 hrs ago', credits: 10, imageId: 'img-7' },
  { id: 'h7', prompt: 'Futuristic man in neon-lit environment', model: 'PixelForge Flux Pro', status: 'completed', time: '6 hrs ago', credits: 9, imageId: 'img-8' },
  { id: 'h8', prompt: 'Dynamic abstract painting with neon colors', model: 'Illustration Pro', status: 'completed', time: '8 hrs ago', credits: 14, imageId: 'img-9' },
  { id: 'h9', prompt: 'Astronauts exploring Mars desert landscape', model: 'Cinematic XL', status: 'completed', time: '12 hrs ago', credits: 16, imageId: 'img-10' },
  { id: 'h10', prompt: 'Beautiful serene portrait, white outfit', model: 'Realistic Vision', status: 'completed', time: '1 day ago', credits: 11, imageId: 'img-11' },
  { id: 'h11', prompt: 'Futuristic digital grid with glowing red elements', model: 'Flux Dev', status: 'processing', time: '1 day ago', credits: 18 },
  { id: 'h12', prompt: 'Dynamic abstract painting, bold brushstrokes', model: 'Illustration Pro', status: 'completed', time: '2 days ago', credits: 6, imageId: 'img-13' },
  { id: 'h13', prompt: 'Woman interacting with robotic hands, cyberpunk', model: 'PixelForge Flux Pro', status: 'completed', time: '2 days ago', credits: 12, imageId: 'img-14' },
  { id: 'h14', prompt: 'Modern building with glass and steel design', model: 'Cinematic XL', status: 'completed', time: '3 days ago', credits: 9, imageId: 'img-15' },
  { id: 'h15', prompt: 'Luxury perfume bottle on soft white fabric', model: 'PixelForge Pro', status: 'completed', time: '3 days ago', credits: 7, imageId: 'img-16' },
];

const STATUS_CONFIG = {
  completed: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30' },
  failed: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/15 border-red-500/30' },
  processing: { icon: Loader2, color: 'text-cyan-400', bg: 'bg-cyan-500/15 border-cyan-500/30' },
};

export default function History() {
  const { images, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const filtered = HISTORY.filter(h => {
    if (statusFilter !== 'all' && h.status !== statusFilter) return false;
    if (search && !h.prompt.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selectedImage = images.find(i => i.id === selectedImageId) ?? null;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">History</h1>
        <p className="text-gray-500 text-sm mt-1">{HISTORY.length} generation activities</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search history..." className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/8 rounded-xl text-sm text-white placeholder:text-gray-700 outline-none focus:border-violet-500/50 transition-all" />
        </div>
        <div className="flex gap-1.5">
          {['all', 'completed', 'failed', 'processing'].map(f => (
            <button key={f} onClick={() => setStatusFilter(f)} className={`px-3 py-2 rounded-xl text-xs font-medium transition-all capitalize ${statusFilter === f ? 'bg-violet-500/20 border border-violet-500/40 text-violet-400' : 'bg-white/5 border border-white/8 text-gray-500 hover:text-gray-300'}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map(entry => {
          const status = STATUS_CONFIG[entry.status];
          const StatusIcon = status.icon;
          const image = entry.imageId ? images.find(i => i.id === entry.imageId) : null;
          return (
            <div
              key={entry.id}
              onClick={() => image ? setSelectedImageId(entry.imageId!) : showToast('No image available')}
              className="flex items-center gap-4 p-4 rounded-xl bg-gray-900/60 border border-white/5 hover:border-white/15 transition-all cursor-pointer"
            >
              {image ? (
                <img src={image.url} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <Clock size={18} className="text-gray-700" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-300 truncate">{entry.prompt}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-600">{entry.model}</span>
                  <span className="text-gray-800">·</span>
                  <span className="text-xs text-gray-600">{entry.time}</span>
                  {entry.credits > 0 && <><span className="text-gray-800">·</span><span className="text-xs text-violet-400">{entry.credits} credits</span></>}
                </div>
              </div>
              <span className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${status.bg} ${status.color}`}>
                <StatusIcon size={11} className={entry.status === 'processing' ? 'animate-spin' : ''} />
                {entry.status}
              </span>
            </div>
          );
        })}
      </div>

      <ImageDetailModal image={selectedImage} onClose={() => setSelectedImageId(null)} />
    </div>
  );
}
