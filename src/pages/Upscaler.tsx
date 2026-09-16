import { useState } from 'react';
import { Upload, Maximize2, Zap, ArrowLeftRight } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const SCALES = ['2×', '4×', '8×'];
const ENHANCEMENTS = ['Face Enhancement', 'Detail Recovery', 'Noise Reduction', 'Sharpening'];

export default function Upscaler() {
  const { showToast } = useApp();
  const [uploaded, setUploaded] = useState(false);
  const [scale, setScale] = useState('4×');
  const [selected, setSelected] = useState<Set<string>>(new Set(['Face Enhancement', 'Noise Reduction']));
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);

  const SAMPLE = 'https://images.pexels.com/photos/5611592/pexels-photo-5611592.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

  const handleProcess = () => {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setDone(true); showToast('Image upscaled to 4K successfully!'); }, 3000);
  };

  const toggleEnhance = (e: string) => setSelected(prev => { const n = new Set(prev); n.has(e) ? n.delete(e) : n.add(e); return n; });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Image Upscaler</h1>
        <p className="text-gray-500 text-sm mt-1">Enhance resolution up to 8× with AI-powered upscaling</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload / Preview */}
        <div className="lg:col-span-2 space-y-4">
          {!uploaded ? (
            <div
              onClick={() => setUploaded(true)}
              className="border-2 border-dashed border-white/10 rounded-2xl p-16 text-center hover:border-violet-500/40 hover:bg-violet-500/3 transition-all cursor-pointer group"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload size={28} className="text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Drop your image here</h3>
              <p className="text-sm text-gray-600 mb-4">or click to browse your files</p>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-700">
                {['PNG', 'JPG', 'WebP', 'TIFF'].map(f => <span key={f} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/8">{f}</span>)}
              </div>
            </div>
          ) : (
            <div className="bg-gray-900/60 border border-white/8 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/8">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <ArrowLeftRight size={15} className="text-violet-400" />
                  Before / After Comparison
                </div>
                <div className="text-xs text-gray-500">Drag slider to compare</div>
              </div>
              <div className="relative aspect-video overflow-hidden select-none">
                <img src={SAMPLE} alt="original" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
                  <img src={SAMPLE} alt="upscaled" className="absolute inset-0 w-full h-full object-cover brightness-110 saturate-110" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-semibold">AI Upscaled</div>
                </div>
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-semibold" style={{ left: '8px' }}>
                  Original
                </div>
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-xl cursor-col-resize"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-xl flex items-center justify-center">
                    <ArrowLeftRight size={14} className="text-gray-800" />
                  </div>
                </div>
                <input
                  type="range" min={0} max={100} value={sliderPos}
                  onChange={e => setSliderPos(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-col-resize"
                />
              </div>
              <div className="flex items-center justify-between px-5 py-3 bg-white/3">
                <div className="text-xs text-gray-500">Original: 1024 × 768 · 2.4 MB</div>
                {done && <div className="text-xs text-emerald-400 font-medium">→ Upscaled: 4096 × 3072 · 38.2 MB</div>}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-5">
          <div className="bg-gray-900/60 border border-white/8 rounded-2xl p-5 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Scale Factor</label>
              <div className="grid grid-cols-3 gap-2">
                {SCALES.map(s => (
                  <button key={s} onClick={() => setScale(s)} className={`py-3 rounded-xl border text-sm font-bold transition-all ${scale === s ? 'bg-gradient-to-r from-violet-600/30 to-cyan-500/20 border-violet-500/50 text-white' : 'border-white/8 bg-white/3 text-gray-500 hover:text-gray-300 hover:border-white/15'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Enhancements</label>
              <div className="space-y-2">
                {ENHANCEMENTS.map(e => (
                  <label key={e} className="flex items-center gap-3 cursor-pointer p-2.5 rounded-xl hover:bg-white/3 transition-colors">
                    <div
                      onClick={() => toggleEnhance(e)}
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selected.has(e) ? 'bg-violet-600 border-violet-500' : 'border-white/20 hover:border-white/40'}`}
                    >
                      {selected.has(e) && <div className="w-2 h-1 border-b-2 border-l-2 border-white rotate-[-45deg] translate-y-[-1px]" />}
                    </div>
                    <span className="text-sm text-gray-300">{e}</span>
                  </label>
                ))}
              </div>
            </div>

            {uploaded && (
              <div className="bg-white/3 border border-white/8 rounded-xl p-3 text-xs text-gray-500 space-y-1">
                <div className="flex justify-between"><span>Output Size</span><span className="text-gray-300">4096 × 3072</span></div>
                <div className="flex justify-between"><span>Est. Credits</span><span className="text-violet-400 font-semibold">12</span></div>
                <div className="flex justify-between"><span>Processing Time</span><span className="text-gray-300">~30s</span></div>
              </div>
            )}

            <button
              onClick={uploaded ? handleProcess : () => setUploaded(true)}
              disabled={processing}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-sm hover:from-violet-500 hover:to-cyan-400 transition-all shadow-lg shadow-violet-500/20 disabled:opacity-70"
            >
              {processing ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing...</>
              ) : done ? (
                <><Zap size={15} />Download Result</>
              ) : (
                <><Maximize2 size={15} />Upscale Image</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
