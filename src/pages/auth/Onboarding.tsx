import { useState } from 'react';
import { Image, Check, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const USE_CASES = [
  { id: 'marketing', label: 'Marketing', emoji: '📣', desc: 'Ads, banners, social posts' },
  { id: 'ecommerce', label: 'E-commerce', emoji: '🛍️', desc: 'Product photography, listings' },
  { id: 'social', label: 'Social Media', emoji: '📱', desc: 'Instagram, TikTok, YouTube' },
  { id: 'youtube', label: 'YouTube', emoji: '▶️', desc: 'Thumbnails and channel art' },
  { id: 'design', label: 'Design', emoji: '🎨', desc: 'UI/UX, illustrations, branding' },
  { id: 'photography', label: 'Photography', emoji: '📷', desc: 'Portraits, landscapes, editorial' },
  { id: 'gaming', label: 'Gaming', emoji: '🎮', desc: 'Characters, environments, concepts' },
  { id: 'personal', label: 'Personal', emoji: '✨', desc: 'Just exploring and creating' },
];

const STYLES = [
  { id: 'photorealistic', label: 'Photorealistic', image: 'https://images.pexels.com/photos/5611592/pexels-photo-5611592.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'cinematic', label: 'Cinematic', image: 'https://images.pexels.com/photos/8107821/pexels-photo-8107821.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'illustration', label: 'Illustration', image: 'https://images.pexels.com/photos/23191211/pexels-photo-23191211.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'scifi', label: 'Sci-Fi', image: 'https://images.pexels.com/photos/13568045/pexels-photo-13568045.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'fantasy', label: 'Fantasy', image: 'https://images.pexels.com/photos/207130/pexels-photo-207130.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'abstract', label: 'Abstract', image: 'https://images.pexels.com/photos/8882645/pexels-photo-8882645.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
];

export default function Onboarding() {
  const { navigate, setOnboardingDone, showToast } = useApp();
  const [step, setStep] = useState(1);
  const [selectedUses, setSelectedUses] = useState<string[]>(['marketing', 'social']);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['cinematic', 'photorealistic']);
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  const toggleUse = (id: string) => setSelectedUses(v => v.includes(id) ? v.filter(x => x !== id) : [...v, id]);
  const toggleStyle = (id: string) => setSelectedStyles(v => v.includes(id) ? v.filter(x => x !== id) : [...v, id]);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setDone(true);
      setTimeout(() => {
        setOnboardingDone(true);
        navigate('dashboard');
        showToast('Welcome to PixelForge AI! 1,000 free credits added.');
      }, 1500);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-transparent to-cyan-950/20 pointer-events-none" />

      <div className="relative w-full max-w-2xl">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${s <= step ? 'bg-gradient-to-r from-violet-500 to-cyan-500' : 'bg-white/10'} ${s === step ? 'w-16' : 'w-8'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-violet-500/30">
                <Sparkles size={28} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">What will you create?</h1>
              <p className="text-gray-500">Help us personalize your experience</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {USE_CASES.map(uc => (
                <button
                  key={uc.id}
                  onClick={() => toggleUse(uc.id)}
                  className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 ${selectedUses.includes(uc.id) ? 'border-violet-500/50 bg-violet-500/15 shadow-lg shadow-violet-500/10' : 'border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5'}`}
                >
                  {selectedUses.includes(uc.id) && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center">
                      <Check size={10} className="text-white" />
                    </div>
                  )}
                  <span className="text-2xl">{uc.emoji}</span>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white">{uc.label}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{uc.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={selectedUses.length === 0}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold hover:from-violet-500 hover:to-cyan-400 transition-all shadow-lg shadow-violet-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Choose your styles</h1>
              <p className="text-gray-500">We'll optimize your experience based on your preferences</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {STYLES.map(style => (
                <button
                  key={style.id}
                  onClick={() => toggleStyle(style.id)}
                  className={`relative rounded-xl overflow-hidden border-2 transition-all duration-200 aspect-video ${selectedStyles.includes(style.id) ? 'border-violet-500 shadow-lg shadow-violet-500/30' : 'border-transparent hover:border-white/20'}`}
                >
                  <img src={style.image} alt={style.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <p className="absolute bottom-2 left-2 text-sm font-semibold text-white">{style.label}</p>
                  {selectedStyles.includes(style.id) && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <button onClick={() => setStep(3)} className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold hover:from-violet-500 hover:to-cyan-400 transition-all shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2">
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in text-center">
            {!done ? (
              <>
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-violet-500/40">
                  <Image size={36} className="text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Generate your first image</h1>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">Let's create something amazing to get you started. This uses 8 of your free credits.</p>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-left">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Your first prompt</p>
                  <p className="text-white text-sm leading-relaxed">"Futuristic cyberpunk city at night, neon lights reflecting on rain-slicked streets, cinematic composition, ultra detailed, 8K resolution"</p>
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
                    <div><p className="text-xs text-gray-600">Model</p><p className="text-xs font-medium text-gray-300">PixelForge Flux Pro</p></div>
                    <div><p className="text-xs text-gray-600">Quality</p><p className="text-xs font-medium text-gray-300">Ultra</p></div>
                    <div><p className="text-xs text-gray-600">Credits</p><p className="text-xs font-medium text-gray-300">8</p></div>
                  </div>
                </div>

                {generating ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                      <span className="text-sm text-gray-400">Generating your image...</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden w-64 mx-auto">
                      <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full animate-pulse" style={{ width: '70%' }} />
                    </div>
                  </div>
                ) : (
                  <button onClick={handleGenerate} className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold hover:from-violet-500 hover:to-cyan-400 transition-all shadow-lg shadow-violet-500/20 flex items-center gap-2 mx-auto">
                    <Sparkles size={16} />
                    Generate First Image
                  </button>
                )}
              </>
            ) : (
              <div className="animate-fade-in">
                <div className="w-24 h-24 mx-auto mb-6 relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 animate-ping opacity-30" />
                  <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-2xl">
                    <Check size={40} className="text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">You're all set!</h2>
                <p className="text-gray-400 text-lg">Taking you to your studio...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
