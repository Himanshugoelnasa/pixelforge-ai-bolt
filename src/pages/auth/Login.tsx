import { useState } from 'react';
import { Eye, EyeOff, Github, Chrome, Image, Sparkles, Zap, Shield } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export default function Login() {
  const { navigate, setAuthenticated } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('himanshu@pixelforge.ai');
  const [password, setPassword] = useState('••••••••••');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setAuthenticated(true);
      navigate('onboarding');
    }, 1200);
  };

  return (
    <div className="min-h-screen flex bg-gray-950">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden">
        <img
          src="https://images.pexels.com/photos/8107821/pexels-photo-8107821.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
          alt="AI generated art"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/90 via-violet-950/60 to-gray-950/80" />

        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <Image size={20} className="text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white">PixelForge</span>
              <span className="text-lg font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"> AI</span>
            </div>
          </div>

          {/* Hero text */}
          <div className="mt-auto mb-24">
            <h1 className="text-5xl font-bold text-white leading-tight mb-4">
              Turn imagination<br />
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">into pixels.</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-md">The professional AI image studio for creators, marketers, and enterprises. Generate, edit, and export at scale.</p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { icon: Sparkles, label: '12M+ images generated' },
              { icon: Zap, label: 'Sub-10s generation' },
              { icon: Shield, label: 'Enterprise ready' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <Icon size={16} className="text-violet-400 shrink-0" />
                <span className="text-xs text-gray-300 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-[440px] flex flex-col justify-center px-8 lg:px-12 bg-gray-950 relative overflow-y-auto">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 to-transparent pointer-events-none" />

        <div className="relative z-10 w-full max-w-sm mx-auto">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <Image size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white">PixelForge <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">AI</span></span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
          <p className="text-gray-500 text-sm mb-8">Sign in to your account to continue creating</p>

          {/* OAuth */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all font-medium">
              <Chrome size={16} />
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all font-medium">
              <Github size={16} />
              GitHub
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-600">or continue with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 focus:bg-white/8 transition-all placeholder:text-gray-700"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-gray-400">Password</label>
                <button onClick={() => navigate('forgot-password')} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">Forgot password?</button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 focus:bg-white/8 transition-all placeholder:text-gray-700"
                  placeholder="••••••••••"
                />
                <button onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <div className="w-4 h-4 rounded bg-violet-600 flex items-center justify-center">
                <div className="w-2 h-1 border-b-2 border-l-2 border-white rotate-[-45deg] translate-y-[-1px]" />
              </div>
              <span className="text-xs text-gray-400">Remember me for 30 days</span>
            </label>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold text-sm hover:from-violet-500 hover:to-cyan-400 transition-all shadow-lg shadow-violet-500/25 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : 'Sign in'}
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <button onClick={() => navigate('signup')} className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Create one free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
