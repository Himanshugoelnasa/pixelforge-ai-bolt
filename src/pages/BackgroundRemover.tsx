import { useState } from 'react';
import { Upload, Eraser, Check, Download } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const BG_OPTIONS = [
  { id: 'transparent', label: 'Transparent', preview: 'bg-[url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAADklEQVQ4jWNgGAWkAgABKAABVHxscQAAAABJRU5ErkJggg==)] bg-repeat' },
  { id: 'white', label: 'White', preview: 'bg-white' },
  { id: 'black', label: 'Black', preview: 'bg-gray-950' },
  { id: 'gradient', label: 'Gradient', preview: 'bg-gradient-to-br from-violet-500 to-cyan-500' },
  { id: 'blur', label: 'Blur BG', preview: 'bg-gradient-to-br from-gray-700 to-gray-500' },
  { id: 'custom', label: 'Custom Color', preview: 'bg-emerald-500' },
];

export default function BackgroundRemover() {
  const { showToast } = useApp();
  const [uploaded, setUploaded] = useState(false);
  const [selectedBg, setSelectedBg] = useState('transparent');
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const SAMPLE = 'https://images.pexels.com/photos/34921744/pexels-photo-34921744.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

  const handleProcess = () => {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setDone(true); showToast('Background removed successfully!'); }, 2500);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Background Remover</h1>
        <p className="text-gray-500 text-sm mt-1">Remove or replace backgrounds with AI precision</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {!uploaded ? (
            <div onClick={() => setUploaded(true)} className="border-2 border-dashed border-white/10 rounded-2xl p-16 text-center hover:border-violet-500/40 hover:bg-violet-500/3 transition-all cursor-pointer group">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Eraser size={28} className="text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Drop your image here</h3>
              <p className="text-sm text-gray-600">Works best with people, products, and objects</p>
            </div>
          ) : (
            <div className="bg-gray-900/60 border border-white/8 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-2 gap-0">
                <div>
                  <div className="px-4 py-2.5 bg-white/3 border-b border-white/8 text-xs font-medium text-gray-400">Original</div>
                  <div className="aspect-square">
                    <img src={SAMPLE} alt="original" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div>
                  <div className="px-4 py-2.5 bg-white/3 border-b border-r-0 border-white/8 text-xs font-medium text-gray-400">Result</div>
                  <div className={`aspect-square relative overflow-hidden ${BG_OPTIONS.find(b => b.id === selectedBg)?.preview || ''}`}>
                    {done ? (
                      <img
                        src={SAMPLE}
                        alt="result"
                        className="w-full h-full object-cover"
                        style={{ mixBlendMode: selectedBg === 'transparent' ? 'multiply' : 'normal' }}
                      />
                    ) : processing ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-10 h-10 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-3" />
                          <p className="text-xs text-gray-400">Removing background...</p>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-xs text-gray-600">Process to see result</p>
                      </div>
                    )}
                    {done && (
                      <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/80 text-white text-xs font-medium">
                        <Check size={11} />Done
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="bg-gray-900/60 border border-white/8 rounded-2xl p-5 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Background</label>
              <div className="grid grid-cols-3 gap-2">
                {BG_OPTIONS.map(opt => (
                  <button key={opt.id} onClick={() => setSelectedBg(opt.id)} className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${selectedBg === opt.id ? 'border-violet-500/50 bg-violet-500/10' : 'border-white/8 hover:border-white/15'}`}>
                    <div className={`w-8 h-6 rounded-lg border border-white/10 ${opt.preview}`} />
                    <span className="text-xs text-gray-500 text-center leading-tight">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {uploaded && (
              <div className="bg-white/3 border border-white/8 rounded-xl p-3 text-xs text-gray-500 space-y-1">
                <div className="flex justify-between"><span>Input Format</span><span className="text-gray-300">JPEG</span></div>
                <div className="flex justify-between"><span>Output Format</span><span className="text-gray-300">PNG (Alpha)</span></div>
                <div className="flex justify-between"><span>Credits</span><span className="text-violet-400 font-semibold">4</span></div>
              </div>
            )}

            <button
              onClick={uploaded ? (done ? () => showToast('Image downloaded!') : handleProcess) : () => setUploaded(true)}
              disabled={processing}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-sm hover:from-violet-500 hover:to-cyan-400 transition-all shadow-lg shadow-violet-500/20 disabled:opacity-70"
            >
              {processing ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing...</>
                : done ? <><Download size={15} />Download PNG</>
                : <><Eraser size={15} />Remove Background</>}
            </button>

            {done && (
              <button onClick={() => { setUploaded(false); setDone(false); showToast('Reset!'); }} className="w-full py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white transition-all">
                Process Another
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
