import { useState } from 'react';
import { Upload, Wand2, X, Shuffle, Sparkles, Zap, Clock } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import Slider from '@/components/ui/Slider';

const REFERENCE_TYPES = ['Composition', 'Style', 'Character', 'Color', 'Face', 'Product'];

const SAMPLE_REFS = [
  'https://images.pexels.com/photos/8107821/pexels-photo-8107821.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/34921744/pexels-photo-34921744.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/2058172/pexels-photo-2058172.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/23191211/pexels-photo-23191211.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
];

export default function ImageToImage() {
  const { showToast } = useApp();
  const [prompt, setPrompt] = useState('Transform into a cinematic sci-fi scene with neon lighting and dramatic atmosphere');
  const [refs, setRefs] = useState<string[]>([SAMPLE_REFS[0]]);
  const [refType, setRefType] = useState('Style');
  const [strength, setStrength] = useState(65);
  const [creativity, setCreativity] = useState(40);
  const [count, setCount] = useState(4);
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const addRef = (url: string) => {
    if (refs.length >= 4) { showToast('Maximum 4 reference images', 'warning'); return; }
    setRefs(prev => [...prev, url]);
  };
  const removeRef = (idx: number) => setRefs(prev => prev.filter((_, i) => i !== idx));

  const handleGenerate = () => {
    if (refs.length === 0) { showToast('Add at least one reference image', 'warning'); return; }
    setGenerating(true);
    setResults([]);
    setTimeout(() => {
      setGenerating(false);
      setResults(SAMPLE_REFS.slice(0, count));
      showToast(`${count} images generated!`);
    }, 3000);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Image to Image</h1>
        <p className="text-gray-500 text-sm mt-1">Transform existing images with AI-powered style transfer and remixing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Reference images */}
          <div className="bg-gray-900/60 border border-white/8 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Reference Images</h3>
              <span className="text-xs text-gray-500">{refs.length}/4</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {refs.map((url, idx) => (
                <div key={idx} className="group relative aspect-square rounded-xl overflow-hidden border-2 border-violet-500/30">
                  <img src={url} alt={`ref ${idx}`} className="w-full h-full object-cover" />
                  <button onClick={() => removeRef(idx)} className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={12} />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-gradient-to-t from-black/80 to-transparent">
                    <span className="text-xs text-white font-medium">{refType}</span>
                  </div>
                </div>
              ))}
              {refs.length < 4 && (
                <button onClick={() => addRef(SAMPLE_REFS[refs.length % SAMPLE_REFS.length])} className="aspect-square rounded-xl border-2 border-dashed border-white/10 hover:border-violet-500/40 hover:bg-violet-500/5 transition-all flex items-center justify-center text-gray-600 hover:text-violet-400">
                  <Upload size={20} />
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">Reference Type</label>
              <div className="flex flex-wrap gap-1.5">
                {REFERENCE_TYPES.map(t => (
                  <button key={t} onClick={() => setRefType(t)} className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${refType === t ? 'bg-violet-500/20 border border-violet-500/40 text-violet-400' : 'bg-white/5 border border-white/8 text-gray-500 hover:text-gray-300'}`}>{t}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Prompt */}
          <div className="bg-gray-900/60 border border-white/8 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Transformation Prompt</h3>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              rows={3}
              className="w-full bg-white/3 border border-white/5 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-700 outline-none focus:border-white/15 resize-none transition-all"
              placeholder="Describe how to transform the reference image..."
            />
            <div className="flex items-center gap-2 mt-3">
              <button onClick={() => setPrompt(p => p + ', cinematic, ultra detailed, 8K')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/15 border border-violet-500/30 text-violet-400 text-xs font-medium hover:bg-violet-500/25 transition-colors">
                <Wand2 size={13} />Enhance
              </button>
              <button onClick={() => setPrompt('Transform into a dreamy fantasy landscape with magical lighting and ethereal atmosphere')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-xs font-medium hover:text-white transition-colors">
                <Shuffle size={13} />Random
              </button>
            </div>
          </div>

          {/* Results */}
          {(generating || results.length > 0) && (
            <div className="bg-gray-900/60 border border-white/8 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Results</h3>
              {generating ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="aspect-square rounded-xl bg-white/3 border border-white/5 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {results.map((url, i) => (
                    <div key={i} className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-violet-500/50 transition-all">
                      <img src={url} alt={`Result ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="bg-gray-900/60 border border-white/8 rounded-2xl p-5 space-y-5 h-fit">
          <h3 className="text-sm font-semibold text-white">Settings</h3>
          <Slider label="Image Strength" value={strength} min={0} max={100} onChange={setStrength} hint="How closely to follow the reference" />
          <Slider label="Creativity" value={creativity} min={0} max={100} onChange={setCreativity} hint="How much freedom the AI has" />
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Outputs — <span className="text-white">{count}</span>
            </label>
            <Slider label="" value={count} min={1} max={8} onChange={setCount} showValue={false} />
          </div>
          <div className="h-px bg-white/5" />
          <div className="bg-white/3 border border-white/8 rounded-xl p-3 text-xs text-gray-500 space-y-1">
            <div className="flex justify-between"><span>Model</span><span className="text-gray-300">PixelForge Flux Pro</span></div>
            <div className="flex justify-between"><span>Est. Credits</span><span className="text-violet-400 font-semibold">{8 * count}</span></div>
            <div className="flex justify-between"><span>Est. Time</span><span className="text-gray-300 flex items-center gap-1"><Clock size={10} />~15s</span></div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating || refs.length === 0}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-sm hover:from-violet-500 hover:to-cyan-400 transition-all shadow-lg shadow-violet-500/20 disabled:opacity-50"
          >
            {generating ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating...</>
              : <><Sparkles size={15} />Transform Image</>}
          </button>
        </div>
      </div>
    </div>
  );
}
