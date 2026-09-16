import { useState } from 'react';
import { Plus, Layers, TrendingUp, TrendingDown, Images, Zap, HardDrive, CheckCircle, BarChart3, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import ImageCard from '@/components/ui/ImageCard';
import ImageDetailModal from '@/components/ui/ImageDetailModal';
import { USAGE_STATS, MOCK_BATCH_JOBS } from '@/lib/mockData';

const STAT_CARDS = [
  { label: 'Images Generated', value: '12,842', change: '+18.4%', up: true, icon: Images, color: 'violet' },
  { label: 'This Month', value: '2,418', change: '+12.1%', up: true, icon: TrendingUp, color: 'cyan' },
  { label: 'Batch Jobs', value: '86', change: '+34.5%', up: true, icon: Layers, color: 'blue' },
  { label: 'Credits Remaining', value: '8,420', change: '-2.1%', up: false, icon: Zap, color: 'amber' },
  { label: 'Storage Used', value: '38.4 GB', change: '+8.7%', up: false, icon: HardDrive, color: 'pink' },
  { label: 'Success Rate', value: '98.7%', change: '+0.3%', up: true, icon: CheckCircle, color: 'emerald' },
];

const COLOR_MAP: Record<string, string> = {
  violet: 'from-violet-500/20 to-violet-500/5 border-violet-500/20 text-violet-400',
  cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400',
  blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/20 text-blue-400',
  amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400',
  pink: 'from-pink-500/20 to-pink-500/5 border-pink-500/20 text-pink-400',
  emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400',
};

const SimpleBarChart = ({ data }: { data: { day: string; images: number }[] }) => {
  const max = Math.max(...data.map(d => d.images));
  return (
    <div className="flex items-end gap-2 h-24">
      {data.map(d => (
        <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full bg-gradient-to-t from-violet-500 to-violet-400 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
            style={{ height: `${(d.images / max) * 80}px` }}
            title={`${d.images} images`}
          />
          <span className="text-xs text-gray-600">{d.day}</span>
        </div>
      ))}
    </div>
  );
};

const SimpleLineChart = ({ data }: { data: { month: string; images: number; credits: number }[] }) => {
  const max = Math.max(...data.map(d => d.images));
  return (
    <div className="flex items-end gap-3 h-24">
      {data.map(d => (
        <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-sm opacity-70 hover:opacity-100 transition-opacity"
            style={{ height: `${(d.images / max) * 80}px` }}
            title={`${d.images} images`}
          />
          <span className="text-xs text-gray-600">{d.month}</span>
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { navigate, images, showToast } = useApp();
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('Futuristic cyberpunk city at night, cinematic lighting, ultra detailed');
  const [generating, setGenerating] = useState(false);

  const selectedImage = images.find(i => i.id === selectedImageId) ?? null;

  const handleQuickGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      showToast('Image generated successfully! Check the gallery.');
      navigate('generator');
    }, 1500);
  };

  const activeJobs = MOCK_BATCH_JOBS.filter(j => j.status === 'processing');

  return (
    <div className="p-6 space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-950/60 via-gray-900/80 to-cyan-950/40 border border-white/10 p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Good evening</p>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Himanshu</span> 👋
            </h1>
            <p className="text-gray-400">Ready to turn your ideas into images?</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('generator')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold text-sm hover:from-violet-500 hover:to-cyan-400 transition-all shadow-lg shadow-violet-500/25"
            >
              <Plus size={16} />
              Create Image
            </button>
            <button
              onClick={() => navigate('batch')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white text-sm font-medium hover:bg-white/15 transition-all"
            >
              <Layers size={16} />
              Batch Generate
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {STAT_CARDS.map(({ label, value, change, up, icon: Icon, color }) => (
          <div key={label} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${COLOR_MAP[color]} border p-4 hover:scale-[1.01] transition-transform`}>
            <div className="flex items-start justify-between mb-3">
              <Icon size={18} className={COLOR_MAP[color].split(' ')[3]} />
              <div className={`flex items-center gap-1 text-xs font-medium ${up ? 'text-emerald-400' : 'text-red-400'}`}>
                {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {change}
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick generate */}
        <div className="lg:col-span-2 bg-gray-900/60 border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-violet-400" />
            <h2 className="text-base font-semibold text-white">Quick Generate</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">Prompt</label>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-700 outline-none focus:border-violet-500/50 resize-none transition-all"
                rows={3}
                placeholder="Describe the image you want to create..."
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[['Model', 'PixelForge Flux Pro'], ['Aspect Ratio', '16:9'], ['Quality', 'High']].map(([label, val]) => (
                <div key={label}>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
                  <div className="px-3 py-2 bg-white/5 border border-white/8 rounded-xl text-xs text-gray-300 cursor-pointer hover:border-white/20 transition-colors">{val}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleQuickGenerate}
                disabled={generating}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold text-sm hover:from-violet-500 hover:to-cyan-400 transition-all shadow-lg shadow-violet-500/20 disabled:opacity-70"
              >
                {generating ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating...</>
                ) : (
                  <><Sparkles size={15} />Generate</>
                )}
              </button>
              <button onClick={() => navigate('generator')} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                Advanced
              </button>
            </div>
          </div>
        </div>

        {/* Active batch jobs */}
        <div className="bg-gray-900/60 border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-cyan-400" />
              <h2 className="text-base font-semibold text-white">Active Jobs</h2>
            </div>
            <button onClick={() => navigate('batch')} className="text-xs text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {activeJobs.length === 0 && (
              <div className="text-center py-8">
                <Layers size={32} className="text-gray-700 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No active jobs</p>
              </div>
            )}
            {activeJobs.slice(0, 3).map(job => (
              <div key={job.id} className="bg-white/3 border border-white/5 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-gray-300 truncate">{job.name}</p>
                  <span className="text-xs text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">Processing</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-1.5">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full transition-all"
                    style={{ width: `${(job.completed / job.total) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{job.completed}/{job.total} images</span>
                  <span className="text-xs text-gray-600 flex items-center gap-1"><Clock size={10} />{job.eta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900/60 border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 size={16} className="text-violet-400" />
              <h2 className="text-base font-semibold text-white">Daily Generations</h2>
            </div>
            <span className="text-xs text-gray-500">This week</span>
          </div>
          <SimpleBarChart data={USAGE_STATS.dailyData} />
        </div>
        <div className="bg-gray-900/60 border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-cyan-400" />
              <h2 className="text-base font-semibold text-white">Monthly Trend</h2>
            </div>
            <span className="text-xs text-gray-500">Last 6 months</span>
          </div>
          <SimpleLineChart data={USAGE_STATS.monthlyData} />
        </div>
      </div>

      {/* Recent generations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Generations</h2>
          <button onClick={() => navigate('gallery')} className="text-sm text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1">
            View all <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {images.slice(0, 10).map(img => (
            <ImageCard key={img.id} image={img} onOpen={setSelectedImageId} />
          ))}
        </div>
      </div>

      <ImageDetailModal image={selectedImage} onClose={() => setSelectedImageId(null)} />
    </div>
  );
}
