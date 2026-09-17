import { useState } from 'react';
import { Crop, RotateCcw, FlipHorizontal, Brush, Eraser, Wand2, Type, Sliders, Layers, History, ChevronDown, Upload, Download, Undo2, Redo2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const TOOLS = [
  { id: 'crop', icon: Crop, label: 'Crop' },
  { id: 'rotate', icon: RotateCcw, label: 'Rotate' },
  { id: 'flip', icon: FlipHorizontal, label: 'Flip' },
  { id: 'brush', icon: Brush, label: 'Brush' },
  { id: 'eraser', icon: Eraser, label: 'Eraser' },
  { id: 'inpaint', icon: Wand2, label: 'Inpaint' },
  { id: 'text', icon: Type, label: 'Text' },
];

const SAMPLE_IMAGES = [
  'https://images.pexels.com/photos/8107821/pexels-photo-8107821.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/10109585/pexels-photo-10109585.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/34921744/pexels-photo-34921744.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
];

export default function Editor() {
  const { showToast } = useApp();
  const [activeTool, setActiveTool] = useState('crop');
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);

  const filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

  return (
    <div className="flex h-full overflow-hidden">
      {/* Tool bar */}
      <div className="w-16 bg-gray-950/80 border-r border-white/5 flex flex-col items-center py-4 gap-2">
        {TOOLS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTool(id)}
            title={label}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeTool === id ? 'bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-500/30' : 'text-gray-600 hover:text-gray-300 hover:bg-white/10'}`}
          >
            <Icon size={18} />
          </button>
        ))}
        <div className="h-px bg-white/5 w-8 my-2" />
        <button onClick={() => showToast('Undo')} className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 hover:text-gray-300 hover:bg-white/10 transition-all"><Undo2 size={18} /></button>
        <button onClick={() => showToast('Redo')} className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 hover:text-gray-300 hover:bg-white/10 transition-all"><Redo2 size={18} /></button>
      </div>

      {/* Canvas area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-white/5 bg-gray-950/60">
          <span className="text-sm font-medium text-gray-400">Image Editor</span>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => showToast('Changes saved!')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white transition-all">Save</button>
            <button onClick={() => showToast('Downloading...')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-semibold hover:from-violet-500 hover:to-cyan-400 transition-all">
              <Download size={13} />Export
            </button>
          </div>
        </div>

        {!activeImage ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Upload size={28} className="text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-400 mb-2">No image loaded</h3>
              <p className="text-sm text-gray-600 mb-5">Choose from your gallery or upload</p>
              <div className="flex gap-2 justify-center flex-wrap">
                {SAMPLE_IMAGES.map((url, i) => (
                  <button key={i} onClick={() => setActiveImage(url)} className="w-20 h-14 rounded-lg overflow-hidden border-2 border-transparent hover:border-violet-500 transition-all">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-950/40 p-8 overflow-hidden">
            <div className="relative max-w-full max-h-full">
              <img
                src={activeImage}
                alt="editing"
                className="max-w-full max-h-full rounded-xl shadow-2xl"
                style={{ filter }}
              />
              <div className="absolute inset-0 border-2 border-dashed border-violet-500/30 rounded-xl pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      {/* Right panel */}
      <div className="w-64 bg-gray-950/80 border-l border-white/5 overflow-y-auto">
        {/* Layers */}
        <div className="border-b border-white/5">
          <button className="w-full flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <Layers size={13} />Layers
            </div>
            <ChevronDown size={13} className="text-gray-600" />
          </button>
          <div className="px-3 pb-3 space-y-1.5">
            {['Background', 'Adjustments', 'Mask'].map((layer, i) => (
              <div key={layer} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${i === 0 ? 'bg-violet-500/15 border border-violet-500/30' : 'hover:bg-white/5'} cursor-pointer transition-colors`}>
                <div className="w-4 h-4 rounded bg-white/10 text-gray-600 flex items-center justify-center text-xs">{i + 1}</div>
                <span className={`text-xs ${i === 0 ? 'text-violet-300' : 'text-gray-400'}`}>{layer}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Adjustments */}
        <div className="p-4 space-y-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Sliders size={13} />Adjustments
          </p>
          {[
            { label: 'Brightness', value: brightness, set: setBrightness, min: 0, max: 200 },
            { label: 'Contrast', value: contrast, set: setContrast, min: 0, max: 200 },
            { label: 'Saturation', value: saturation, set: setSaturation, min: 0, max: 200 },
          ].map(({ label, value, set, min, max }) => (
            <div key={label} className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">{label}</span>
                <span className="text-xs font-mono text-violet-400">{value}</span>
              </div>
              <input type="range" min={min} max={max} value={value} onChange={e => set(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, rgb(124 58 237) 0%, rgb(6 182 212) ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) ${((value - min) / (max - min)) * 100}%)` }}
              />
            </div>
          ))}
          <button onClick={() => { setBrightness(100); setContrast(100); setSaturation(100); showToast('Adjustments reset!'); }} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Reset all</button>
        </div>

        {/* History */}
        <div className="border-t border-white/5 p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-3">
            <History size={13} />History
          </p>
          <div className="space-y-1">
            {['Open image', 'Crop applied', 'Brightness +20', 'Contrast +15'].map((step, i) => (
              <div key={step} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${i === 3 ? 'bg-white/5 text-gray-300' : 'text-gray-600 hover:text-gray-400'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${i === 3 ? 'bg-violet-500' : 'bg-white/10'}`} />
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
