import { useState } from 'react';
import { Eye, EyeOff, Github, Chrome, Image, Check } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export default function SignUp() {
  const { navigate, setAuthenticated } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = () => {
    setLoading(true);
    setTimeout(() => { setAuthenticated(true); navigate('onboarding'); }, 1200);
  };

  return (
    <div className="min-h-screen flex bg-gray-950">
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden">
        <img
          src="https://images.pexels.com/photos/13568045/pexels-photo-13568045.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
          alt="AI art"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/90 via-cyan-950/50 to-gray-950/80" />
        <div className="relative z-10 flex flex-col h-full p-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <Image size={20} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white">PixelForge <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">AI</span></span>
          </div>
          <div className="mt-auto mb-24">
            <h1 className="text-5xl font-bold text-white leading-tight mb-4">
              Create more.<br />
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Generate faster.</span>
            </h1>
            <p className="text-gray-400 max-w-md mb-8">Join 50,000+ creators using PixelForge AI to generate stunning images at scale.</p>
            {['1,000 free credits to start', 'No credit card required', 'Access to 8+ AI models', 'Unlimited projects'].map(f => (
              <div key={f} className="flex items-center gap-2.5 mb-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <Check size={11} className="text-emerald-400" />
                </div>
                <span className="text-sm text-gray-300">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[440px] flex flex-col justify-center px-8 lg:px-12 bg-gray-950 overflow-y-auto">
        <div className="w-full max-w-sm mx-auto py-12">
          <h2 className="text-2xl font-bold text-white mb-1">Create your account</h2>
          <p className="text-gray-500 text-sm mb-8">Start generating for free. No credit card needed.</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all font-medium">
              <Chrome size={16} />Google
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all font-medium">
              <Github size={16} />GitHub
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-600">or continue with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">First name</label>
                <input defaultValue="Himanshu" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Last name</label>
                <input defaultValue="Sharma" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Email address</label>
              <input type="email" defaultValue="himanshu@pixelforge.ai" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} defaultValue="StrongPass123!" className="w-full px-4 py-2.5 pr-10 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 transition-all" />
                <button onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button onClick={handleSignUp} disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold text-sm hover:from-violet-500 hover:to-cyan-400 transition-all shadow-lg shadow-violet-500/25 disabled:opacity-70 flex items-center justify-center gap-2">
              {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</> : 'Create free account'}
            </button>

            <p className="text-center text-xs text-gray-600">
              By creating an account, you agree to our{' '}
              <span className="text-gray-500 hover:text-gray-400 cursor-pointer">Terms of Service</span> and{' '}
              <span className="text-gray-500 hover:text-gray-400 cursor-pointer">Privacy Policy</span>.
            </p>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <button onClick={() => navigate('login')} className="text-violet-400 hover:text-violet-300 font-medium transition-colors">Sign in</button>
          </p>
        </div>
      </div>
    </div>
  );
}
