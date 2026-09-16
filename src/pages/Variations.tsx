import { useState } from 'react';
import { Shuffle, Upload } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import Slider from '@/components/ui/Slider';

const VARIATION_IMAGES = [
  'https://images.pexels.com/photos/8107821/pexels-photo-8107821.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/8107816/pexels-photo-8107816.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/8108412/pexels-photo-8108412.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/8108483/pexels-photo-8108483.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
];

export default function Variations() {
  const { showToast } = useApp();
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [similarity, setSimilarity] = useState(70);
  const [creativity, setCreativity] = useState(40);
  const [styleStrength, setStyleStrength] = useState(60);
  const [count, setCount] = useState(4);
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const SAMPLE_IMAGES = [
    'https://images.pexels.com/photos/8107821/pexels-photo-8107821.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'https://images.pexels.com/photos/34921744/pexels-photo-34921744.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'https://images.pexels.com/photos/5611592/pexels-photo-5611592.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'https://images.pexels.com/photos/8108412/pexels-photo-8108412.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  ];

  const handleGenerate = () => {
    if (!sourceImage) return;
    setGenerating(true);
    setResults([]);
    setTimeout(() => {
      setGenerating(false);
      setResults(VARIATION_IMAGES.slice(0, count));
      showToast(`${count} variations generated!`);
    }, 3000);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Image Variations</h1>
        <p className="text-gray-500 text-sm mt-1">Create multiple variations of any image with controlled creativity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Source image */}
          <div className="bg-gray-900/60 border border-white/8 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Source Image</h3>
            {!sourceImage ? (
              <>
                <p className="text-xs text-gray-500 mb-3">Choose from your gallery or upload a new image</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {SAMPLE_IMAGES.map((url, i) => (
                    <button key={i} onClick={() => setSourceImage(url)} className="relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-violet-500 transition-all group">
                      <img src={url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </button>
                  ))}
                </div>
                <button onClick={() => setSourceImage(SAMPLE_IMAGES[0])} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white transition-all">
                  <Upload size={14} />Upload Image
                </button>
              </>
            ) : (
              <div className="flex items-start gap-4">
                <div className="relative">
                  <img src={sourceImage} alt="source" className="w-32 h-32 object-cover rounded-xl border-2 border-violet-500/50" />
                  <button onClick={() => { setSourceImage(null); setResults([]); }} className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gray-900 border border-white/20 text-gray-400 hover:text-white flex items-center justify-center text-xs">×</button>
                </div>
                <div>
                  <p className="text-sm font-medium text-white mb-1">Selected Image</p>
                  <p className="text-xs text-gray-500">1024 × 1024 · 2.4 MB</p>
                  <button onClick={() => setSourceImage(null)} className="text-xs text-violet-400 hover:text-violet-300 mt-2 transition-colors">Change image</button>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          {(generating || results.length > 0) && (
            <div className="bg-gray-900/60 border border-white/8 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Generated Variations</h3>
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
                      <img src={url} alt={`Variation ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-full bg-black/60 text-xs text-white font-medium">Var {i + 1}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="bg-gray-900/60 border border-white/8 rounded-2xl p-5 space-y-5 h-fit">
          <h3 className="text-sm font-semibold text-white">Variation Controls</h3>

          <Slider label="Similarity to Original" value={similarity} min={0} max={100} onChange={setSimilarity} hint="Higher = closer to source image" />
          <Slider label="Creativity" value={creativity} min={0} max={100} onChange={setCreativity} hint="Higher = more varied outputs" />
          <Slider label="Style Strength" value={styleStrength} min={0} max={100} onChange={setStyleStrength} />

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Number of Variations — <span className="text-white">{count}</span>
            </label>
            <Slider label="" value={count} min={1} max={8} onChange={setCount} showValue={false} />
          </div>

          <div className="h-px bg-white/5" />

          <button
            onClick={handleGenerate}
            disabled={!sourceImage || generating}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-sm hover:from-violet-500 hover:to-cyan-400 transition-all shadow-lg shadow-violet-500/20 disabled:opacity-50"
          >
            {generating ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating...</>
              : <><Shuffle size={15} />Generate {count} Variations</>}
          </button>

          {!sourceImage && <p className="text-xs text-center text-gray-600">Select a source image to begin</p>}
        </div>
      </div>
    </div>
  );
}
