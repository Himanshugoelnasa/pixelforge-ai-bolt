import { useState } from 'react';
import { Search, Bell, HelpCircle, Zap, ChevronRight, X, Command } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import type { Page } from '@/lib/types';

const PAGE_LABELS: Record<Page, string> = {
  login: 'Login', signup: 'Sign Up', 'forgot-password': 'Forgot Password',
  onboarding: 'Onboarding', dashboard: 'Dashboard', generator: 'Generate',
  batch: 'Batch Studio', editor: 'Image Editor', upscaler: 'AI Upscaler',
  'background-remover': 'Background Remover', variations: 'Variations',
  'image-to-image': 'Image to Image', projects: 'Projects', gallery: 'Gallery',
  favorites: 'Favorites', history: 'History', templates: 'Templates',
  models: 'Models', collections: 'Collections', profile: 'Profile',
  settings: 'Settings', billing: 'Billing', usage: 'Usage', 'api-keys': 'API Keys',
  team: 'Team', notifications: 'Notifications', help: 'Help Center',
  changelog: 'Changelog',
};

export default function Header() {
  const { currentPage, navigate, credits } = useApp();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const SEARCH_RESULTS = [
    { label: 'Dashboard', page: 'dashboard' as Page, type: 'Page' },
    { label: 'Generate Image', page: 'generator' as Page, type: 'Page' },
    { label: 'Batch Studio', page: 'batch' as Page, type: 'Page' },
    { label: 'Gallery', page: 'gallery' as Page, type: 'Page' },
    { label: 'Templates', page: 'templates' as Page, type: 'Page' },
    { label: 'Models', page: 'models' as Page, type: 'Page' },
    { label: 'Billing', page: 'billing' as Page, type: 'Settings' },
    { label: 'API Keys', page: 'api-keys' as Page, type: 'Settings' },
    { label: 'Team', page: 'team' as Page, type: 'Settings' },
  ].filter(r => !searchQuery || r.label.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-gray-950/80 backdrop-blur-xl shrink-0">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">PixelForge AI</span>
          <ChevronRight size={14} className="text-gray-700" />
          <span className="font-medium text-gray-300">{PAGE_LABELS[currentPage] ?? currentPage}</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Search trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/8 text-gray-500 hover:text-gray-300 hover:bg-white/10 transition-all text-sm"
          >
            <Search size={14} />
            <span className="hidden sm:block text-xs">Search...</span>
            <kbd className="hidden sm:flex items-center gap-1 text-xs bg-white/10 px-1.5 py-0.5 rounded-md font-mono">
              <Command size={10} />K
            </kbd>
          </button>

          {/* Credits */}
          <button
            onClick={() => navigate('billing')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600/20 to-cyan-500/20 border border-violet-500/30 text-sm font-medium text-white hover:from-violet-600/30 hover:to-cyan-500/30 transition-all"
          >
            <Zap size={13} className="text-violet-400" />
            <span>{credits.toLocaleString()}</span>
            <span className="text-gray-500 text-xs">credits</span>
          </button>

          {/* Notifications */}
          <button
            onClick={() => navigate('notifications')}
            className="relative p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full" />
          </button>

          {/* Help */}
          <button
            onClick={() => navigate('help')}
            className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
          >
            <HelpCircle size={18} />
          </button>

          {/* Avatar */}
          <button
            onClick={() => navigate('settings')}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white hover:ring-2 hover:ring-violet-500/50 transition-all"
          >
            HS
          </button>
        </div>
      </header>

      {/* Search modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-[2000] flex items-start justify-center pt-24 px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
          <div className="relative w-full max-w-xl bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
              <Search size={16} className="text-gray-500 shrink-0" />
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search pages, images, templates..."
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-gray-600"
              />
              <button onClick={() => setSearchOpen(false)} className="text-gray-600 hover:text-gray-400">
                <X size={16} />
              </button>
            </div>
            <div className="p-2 max-h-80 overflow-y-auto">
              {SEARCH_RESULTS.length === 0 && (
                <p className="text-center text-sm text-gray-600 py-8">No results found</p>
              )}
              {SEARCH_RESULTS.map(r => (
                <button
                  key={r.page}
                  onClick={() => { navigate(r.page); setSearchOpen(false); setSearchQuery(''); }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <span className="text-sm text-gray-300">{r.label}</span>
                  <span className="text-xs text-gray-600 bg-white/5 px-2 py-0.5 rounded-md">{r.type}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
