import { useState } from 'react';
import {
  Wand2, Shuffle, RefreshCw, Upload, ChevronDown, ChevronUp, Lock, Unlock,
  Sparkles, Image, Sliders, Camera, Palette, Clock, Zap, X, Plus, AlertCircle
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import Slider from '@/components/ui/Slider';
import ImageDetailModal from '@/components/ui/ImageDetailModal';
import type { GeneratedImage } from '@/lib/types';

const MODELS = [
  { id: 'pf-flux-pro', name: 'PixelForge Flux Pro', speed: 'Slow', quality: 'Ultra', cost: 8, recommended: true, badge: 'Best Quality' },
  { id: 'pf-pro', name: 'PixelForge Pro', speed: 'Medium', quality: 'High', cost: 6, badge: 'Balanced' },
  { id: 'pf-fast', name: 'PixelForge Fast', speed: 'Fast', quality: 'Standard', cost: 2, badge: 'Speed' },
  { id: 'flux-pro', name: 'Flux Pro', speed: 'Slow', quality: 'Ultra', cost: 10, badge: 'Creative' },
  { id: 'flux-dev', name: 'Flux Dev', speed: 'Slow', quality: 'Ultra', cost: 12, badge: 'Research' },
  { id: 'realistic', name: 'Realistic Vision', speed: 'Medium', quality: 'High', cost: 7, badge: 'Portraits' },
  { id: 'cinematic', name: 'Cinematic XL', speed: 'Slow', quality: 'Ultra', cost: 9, badge: 'Cinematic' },
  { id: 'illustration', name: 'Illustration Pro', speed: 'Medium', quality: 'High', cost: 5, badge: 'Art' },
];

const MODES = ['Text to Image', 'Image to Image', 'Sketch to Image', 'Pose to Image', 'Inpainting', 'Outpainting', 'ControlNet'];

const ASPECT_RATIOS = [
  { ratio: '1:1', w: 1, h: 1 },
  { ratio: '4:3', w: 4, h: 3 },
  { ratio: '3:4', w: 3, h: 4 },
  { ratio: '16:9', w: 16, h: 9 },
  { ratio: '9:16', w: 9, h: 16 },
  { ratio: '3:2', w: 3, h: 2 },
  { ratio: '2:3', w: 2, h: 3 },
];

const RESOLUTIONS = [
  { label: '512 × 512', credits: 2 },
  { label: '768 × 768', credits: 3 },
  { label: '1024 × 1024', credits: 4 },
  { label: '1536 × 1024', credits: 6 },
  { label: '2048 × 2048', credits: 10 },
  { label: '4K', credits: 16 },
];

const QUALITIES = [
  { label: 'Draft', time: '~3s', credits: 1 },
  { label: 'Standard', time: '~8s', credits: 4 },
  { label: 'High', time: '~15s', credits: 8 },
  { label: 'Ultra', time: '~25s', credits: 16 },
];

const STYLES = [
  'Photorealistic', 'Cinematic', 'Anime', 'Illustration', '3D Render',
  'Concept Art', 'Fashion', 'Product Photography', 'Architecture',
  'Fantasy', 'Sci-Fi', 'Minimalist', 'Watercolor', 'Oil Painting', 'Pixel Art'
];

const LIGHTING_OPTIONS = ['Studio', 'Golden Hour', 'Neon', 'Dramatic', 'Soft', 'Rim Light', 'Volumetric', 'Natural'];

const RESULT_IMAGES = [
  'https://images.pexels.com/photos/8107821/pexels-photo-8107821.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/7688749/pexels-photo-7688749.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/8108483/pexels-photo-8108483.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/8108412/pexels-photo-8108412.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
];

const PROMPTS = [
  'Futuristic cyberpunk city at night, cinematic lighting, ultra detailed, rain-slicked streets, neon signs',
  'Serene mountain landscape at golden hour, misty valleys, dramatic sky, photorealistic',
  'Professional portrait of a woman in modern office, soft studio lighting, shallow depth of field',
  'Abstract geometric patterns with vibrant neon colors on dark background, 3D render',
];

export default function Generator() {
  const { showToast, credits, setCredits } = useApp();
  const [mode, setMode] = useState('Text to Image');
  const [prompt, setPrompt] = useState('Futuristic cyberpunk city at night, cinematic lighting, ultra detailed, rain-slicked streets, neon signs reflecting on puddles');
  const [negativePrompt, setNegativePrompt] = useState('blurry, low quality, distorted, artifacts, noise, overexposed');
  const [selectedModel, setSelectedModel] = useState('pf-flux-pro');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [resolution, setResolution] = useState('1536 × 1024');
  const [quality, setQuality] = useState('High');
  const [count, setCount] = useState(4);
  const [seed, setSeed] = useState(4829301);
  const [lockSeed, setLockSeed] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('Cinematic');
  const [lighting, setLighting] = useState('Dramatic');
  const [cfg, setCfg] = useState(7.5);
  const [steps, setSteps] = useState(40);
  const [imageStrength, setImageStrength] = useState(0.75);
  const [showNeg, setShowNeg] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<string[]>([]);
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
  const { images } = useApp();
  const selectedImage = selectedResultId ? images.find(i => i.url === selectedResultId) ?? null : null;

  const model = MODELS.find(m => m.id === selectedModel)!;
  const qualityData = QUALITIES.find(q => q.label === quality)!;
  const totalCredits = model.cost + qualityData.credits * count;

  const handleGenerate = () => {
    setGenerating(true);
    setProgress(0);
    setResults([]);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + (100 / 25);
      });
    }, 300);
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setGenerating(false);
      setResults(RESULT_IMAGES.slice(0, count));
      setCredits(credits - totalCredits);
      showToast(`${count} images generated successfully!`);
    }, 8000);
  };

  const enhancePrompt = () => {
    setPrompt(p => p + ', masterpiece, highly detailed, professional photography, award-winning');
    showToast('Prompt enhanced!', 'info');
  };

  return (
    <div className="h-full flex flex-col lg:flex-row overflow-hidden">
      {/* Main workspace */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Mode tabs */}
        <div className="flex gap-1 bg-white/5 border border-white/8 p-1 rounded-xl overflow-x-auto">
          {MODES.map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === m ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-500/20' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Prompt area */}
        <div className="bg-gray-900/60 border border-white/8 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white">Prompt</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">{prompt.length} chars</span>
              <button onClick={() => setPrompt('')} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Clear</button>
            </div>
          </div>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            className="w-full bg-transparent text-white text-sm placeholder:text-gray-700 outline-none resize-none leading-relaxed min-h-[120px]"
            placeholder="Describe your image in detail... The more specific you are, the better your results will be."
          />
          <div className="flex items-center gap-2 pt-3 mt-3 border-t border-white/8">
            <button onClick={enhancePrompt} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/15 border border-violet-500/30 text-violet-400 text-xs font-medium hover:bg-violet-500/25 transition-colors">
              <Wand2 size={13} />
              Enhance Prompt
            </button>
            <button onClick={() => setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)])} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-xs font-medium hover:text-white hover:bg-white/10 transition-colors">
              <Shuffle size={13} />
              Random
            </button>
          </div>
        </div>

        {/* Negative prompt */}
        <div className="bg-gray-900/60 border border-white/8 rounded-2xl overflow-hidden">
          <button onClick={() => setShowNeg(v => !v)} className="w-full flex items-center justify-between px-5 py-3.5">
            <span className="text-sm font-medium text-gray-400">Negative Prompt</span>
            {showNeg ? <ChevronUp size={15} className="text-gray-600" /> : <ChevronDown size={15} className="text-gray-600" />}
          </button>
          {showNeg && (
            <div className="px-5 pb-5 border-t border-white/5">
              <textarea
                value={negativePrompt}
                onChange={e => setNegativePrompt(e.target.value)}
                className="w-full mt-3 bg-white/3 border border-white/5 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-700 outline-none resize-none focus:border-white/15 transition-all"
                rows={3}
                placeholder="What to exclude from the image..."
              />
            </div>
          )}
        </div>

        {/* Style selector */}
        <div className="bg-gray-900/60 border border-white/8 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Palette size={15} className="text-violet-400" />
            <h2 className="text-sm font-semibold text-white">Style</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {STYLES.map(s => (
              <button
                key={s}
                onClick={() => setSelectedStyle(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedStyle === s ? 'bg-gradient-to-r from-violet-600/80 to-cyan-500/60 text-white border border-violet-500/40' : 'bg-white/5 border border-white/8 text-gray-500 hover:text-gray-300 hover:border-white/20'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Camera */}
        <div className="bg-gray-900/60 border border-white/8 rounded-2xl overflow-hidden">
          <button onClick={() => setShowCamera(v => !v)} className="w-full flex items-center justify-between px-5 py-3.5">
            <div className="flex items-center gap-2">
              <Camera size={15} className="text-cyan-400" />
              <span className="text-sm font-semibold text-white">Camera Controls</span>
            </div>
            {showCamera ? <ChevronUp size={15} className="text-gray-600" /> : <ChevronDown size={15} className="text-gray-600" />}
          </button>
          {showCamera && (
            <div className="px-5 pb-5 border-t border-white/5 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Lens</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['24mm', '35mm', '50mm', '85mm', '135mm'].map(l => (
                      <button key={l} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/8 text-xs text-gray-400 hover:text-white hover:border-white/20 transition-colors">{l}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Lighting</label>
                  <div className="flex flex-wrap gap-1.5">
                    {LIGHTING_OPTIONS.map(l => (
                      <button key={l} onClick={() => setLighting(l)} className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${lighting === l ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-400' : 'bg-white/5 border border-white/8 text-gray-500 hover:text-gray-300'}`}>{l}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Advanced settings */}
        <div className="bg-gray-900/60 border border-white/8 rounded-2xl overflow-hidden">
          <button onClick={() => setShowAdvanced(v => !v)} className="w-full flex items-center justify-between px-5 py-3.5">
            <div className="flex items-center gap-2">
              <Sliders size={15} className="text-gray-400" />
              <span className="text-sm font-semibold text-white">Advanced Settings</span>
            </div>
            {showAdvanced ? <ChevronUp size={15} className="text-gray-600" /> : <ChevronDown size={15} className="text-gray-600" />}
          </button>
          {showAdvanced && (
            <div className="px-5 pb-5 border-t border-white/5 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Slider label="CFG Scale" value={cfg} min={1} max={20} step={0.5} onChange={setCfg} />
              <Slider label="Steps" value={steps} min={10} max={80} onChange={setSteps} />
              <Slider label="Image Strength" value={Math.round(imageStrength * 100)} min={0} max={100} onChange={v => setImageStrength(v / 100)} />
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-500">Sampler</label>
                <select className="w-full bg-white/5 border border-white/8 rounded-xl px-3 py-2 text-sm text-gray-300 outline-none">
                  {['DPM++ 2M Karras', 'Euler a', 'DDIM', 'LMS', 'UniPC'].map(s => <option key={s} className="bg-gray-900">{s}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-500">Output Format</label>
                <div className="flex gap-2">
                  {['PNG', 'JPG', 'WebP'].map(f => (
                    <button key={f} className="flex-1 py-1.5 rounded-lg bg-white/5 border border-white/8 text-xs text-gray-400 hover:text-white hover:border-white/20 transition-colors">{f}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Generation results */}
        {(generating || results.length > 0) && (
          <div className="bg-gray-900/60 border border-white/8 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Image size={15} className="text-violet-400" />
                <h2 className="text-sm font-semibold text-white">Generated Images</h2>
              </div>
              {results.length > 0 && (
                <button onClick={() => showToast('All images downloaded!')} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">Download all</button>
              )}
            </div>

            {generating && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                    <span className="text-sm text-gray-400">Generating {count} images...</span>
                  </div>
                  <span className="text-sm font-medium text-violet-400">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="aspect-video rounded-xl bg-white/3 border border-white/5 animate-pulse flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white/10 border-t-violet-500/50 rounded-full animate-spin" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!generating && results.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {results.map((url, i) => (
                  <div key={i} className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer" onClick={() => setSelectedResultId(url)}>
                    <img src={url} alt={`Result ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button onClick={e => { e.stopPropagation(); showToast('Downloading...'); }} className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
                        <Zap size={14} className="text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Settings panel */}
      <div className="w-full lg:w-80 xl:w-88 border-t lg:border-t-0 lg:border-l border-white/8 bg-gray-950/60 overflow-y-auto p-5 space-y-5">
        {/* Model */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Model</label>
          <div className="space-y-2">
            {MODELS.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedModel(m.id)}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-xl border transition-all text-left ${selectedModel === m.id ? 'border-violet-500/50 bg-violet-500/10' : 'border-white/5 bg-white/3 hover:border-white/15 hover:bg-white/5'}`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-gray-200">{m.name}</p>
                    {m.recommended && <span className="text-xs px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30">Recommended</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-gray-600">{m.speed}</span>
                    <span className="text-xs text-gray-600">·</span>
                    <span className="text-xs text-gray-600">{m.quality}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-white">{m.cost}</p>
                  <p className="text-xs text-gray-600">credits</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-white/5" />

        {/* Aspect ratio */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Aspect Ratio</label>
          <div className="grid grid-cols-4 gap-1.5">
            {ASPECT_RATIOS.map(({ ratio, w, h }) => (
              <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all ${aspectRatio === ratio ? 'border-violet-500/50 bg-violet-500/10 text-violet-400' : 'border-white/5 bg-white/3 text-gray-500 hover:text-gray-300 hover:border-white/15'}`}
              >
                <div
                  className="border-2 border-current rounded-sm"
                  style={{ width: `${(w / Math.max(w, h)) * 20}px`, height: `${(h / Math.max(w, h)) * 20}px`, minWidth: '8px', minHeight: '8px' }}
                />
                <span className="text-xs font-medium">{ratio}</span>
              </button>
            ))}
            <button className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border border-white/5 bg-white/3 text-gray-600 hover:text-gray-300 hover:border-white/15 transition-all`}>
              <Plus size={14} />
              <span className="text-xs">Custom</span>
            </button>
          </div>
        </div>

        <div className="h-px bg-white/5" />

        {/* Resolution */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Resolution</label>
          <div className="space-y-1.5">
            {RESOLUTIONS.map(r => (
              <button
                key={r.label}
                onClick={() => setResolution(r.label)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border transition-all ${resolution === r.label ? 'border-violet-500/50 bg-violet-500/10 text-violet-400' : 'border-white/5 bg-white/3 text-gray-500 hover:text-gray-300 hover:border-white/15'}`}
              >
                <span className="text-xs font-medium">{r.label}</span>
                <span className="text-xs text-gray-600">{r.credits} cr</span>
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-white/5" />

        {/* Quality */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quality</label>
          <div className="grid grid-cols-2 gap-2">
            {QUALITIES.map(q => (
              <button
                key={q.label}
                onClick={() => setQuality(q.label)}
                className={`flex flex-col p-3 rounded-xl border transition-all text-left ${quality === q.label ? 'border-violet-500/50 bg-violet-500/10' : 'border-white/5 bg-white/3 hover:border-white/15'}`}
              >
                <p className={`text-xs font-semibold ${quality === q.label ? 'text-violet-400' : 'text-gray-300'}`}>{q.label}</p>
                <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5"><Clock size={10} />{q.time}</p>
                <p className="text-xs text-gray-600">{q.credits} credits</p>
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-white/5" />

        {/* Count */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Number of Images — <span className="text-white font-bold">{count}</span>
          </label>
          <Slider label="" value={count} min={1} max={16} onChange={setCount} showValue={false} />
          <p className="text-xs text-gray-600 mt-2 text-center">Generate {count} image{count > 1 ? 's' : ''}</p>
        </div>

        <div className="h-px bg-white/5" />

        {/* Seed */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Seed</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={seed}
              onChange={e => setSeed(Number(e.target.value))}
              disabled={!lockSeed}
              className="flex-1 bg-white/5 border border-white/8 rounded-xl px-3 py-2 text-sm text-white outline-none disabled:opacity-50 focus:border-violet-500/50 transition-all"
            />
            <button onClick={() => setSeed(Math.floor(Math.random() * 9999999))} className="p-2 rounded-xl bg-white/5 border border-white/8 text-gray-500 hover:text-white hover:bg-white/10 transition-colors">
              <Shuffle size={15} />
            </button>
            <button onClick={() => setLockSeed(v => !v)} className={`p-2 rounded-xl border transition-all ${lockSeed ? 'bg-violet-500/20 border-violet-500/40 text-violet-400' : 'bg-white/5 border-white/8 text-gray-500 hover:text-white hover:bg-white/10'}`}>
              {lockSeed ? <Lock size={15} /> : <Unlock size={15} />}
            </button>
          </div>
        </div>

        <div className="h-px bg-white/5" />

        {/* Generate button */}
        <div className="sticky bottom-0 bg-gray-950/90 backdrop-blur-sm pb-2">
          <div className="bg-white/5 border border-white/8 rounded-xl p-3 mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">Estimated credits</span>
              <div className="flex items-center gap-1 text-white font-bold">
                <Zap size={12} className="text-violet-400" />
                {totalCredits}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Estimated time</span>
              <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={11} />{qualityData.time}</span>
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating || !prompt.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-sm hover:from-violet-500 hover:to-cyan-400 transition-all shadow-lg shadow-violet-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {generating ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating...</>
            ) : (
              <><Sparkles size={15} />Generate {count} Image{count > 1 ? 's' : ''}</>
            )}
          </button>
          {credits < totalCredits && (
            <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <AlertCircle size={13} className="text-amber-400 shrink-0" />
              <p className="text-xs text-amber-400">Not enough credits. <button className="underline" onClick={() => {}}>Upgrade plan</button></p>
            </div>
          )}
        </div>
      </div>

      {selectedImage && <ImageDetailModal image={selectedImage} onClose={() => setSelectedResultId(null)} />}
    </div>
  );
}
