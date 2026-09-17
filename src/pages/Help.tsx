import { useState } from 'react';
import { Search, Book, Keyboard, MessageSquare, Star, ChevronRight, Zap } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const HELP_CATEGORIES = [
  { icon: Book, title: 'Getting Started', desc: 'Learn the basics of PixelForge AI', count: 12, color: 'violet' },
  { icon: Zap, title: 'Image Generation', desc: 'Master prompts, models, and settings', count: 24, color: 'cyan' },
  { icon: Star, title: 'Batch Processing', desc: 'Generate hundreds of images at scale', count: 18, color: 'blue' },
  { icon: Book, title: 'Image Editing', desc: 'Edit, upscale, and enhance images', count: 16, color: 'emerald' },
  { icon: Zap, title: 'API & Integration', desc: 'Build with the PixelForge API', count: 14, color: 'amber' },
  { icon: Book, title: 'Billing & Plans', desc: 'Manage your subscription and credits', count: 8, color: 'pink' },
];

const FAQS = [
  { q: 'How do I generate my first image?', a: 'Navigate to the Generate page, enter a prompt describing what you want, choose a model and settings, then click Generate. Your image will appear in a few seconds.' },
  { q: 'What are credits and how do they work?', a: 'Credits are consumed each time you generate an image. Different models and quality levels cost different amounts. You get 1,000 free credits on the Free plan, 10,000 on Pro.' },
  { q: 'How does batch processing work?', a: 'Upload a CSV or paste a list of prompts, configure your settings, map any variables, and start the batch. You can track progress and download all results as a ZIP.' },
  { q: 'Can I use generated images commercially?', a: 'Yes! All images you generate on paid plans come with full commercial usage rights. Free plan images are for personal use only.' },
  { q: 'How do I get better results?', a: 'Be specific and descriptive in your prompts. Use the Enhance Prompt button, try different models, and experiment with advanced settings like CFG scale and steps.' },
  { q: 'What resolution should I choose?', a: 'For social media, 1024×1024 is great. For print or high-quality work, use 2048×2048 or 4K. Higher resolutions cost more credits.' },
];

const SHORTCUTS = [
  { keys: ['⌘', 'K'], action: 'Open search' },
  { keys: ['⌘', 'G'], action: 'Quick generate' },
  { keys: ['⌘', 'B'], action: 'Toggle sidebar' },
  { keys: ['⌘', 'N'], action: 'New project' },
  { keys: ['Esc'], action: 'Close modal' },
  { keys: ['⌘', '/'], action: 'Keyboard shortcuts' },
];

export default function Help() {
  const { navigate, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const filteredFaqs = FAQS.filter(f => !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Help Center</h1>
        <p className="text-gray-500 text-sm mt-1">Find answers, learn features, and get support</p>
      </div>

      {/* Search */}
      <div className="relative max-w-xl">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search for help articles..."
          className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/8 rounded-xl text-sm text-white placeholder:text-gray-700 outline-none focus:border-violet-500/50 transition-all"
        />
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {HELP_CATEGORIES.map(({ icon: Icon, title, desc, count, color }) => (
          <button
            key={title}
            onClick={() => showToast(`Opening ${title}...`)}
            className="group flex items-start gap-4 p-5 bg-gray-900/60 border border-white/8 rounded-2xl hover:border-white/15 transition-all text-left hover:-translate-y-0.5"
          >
            <div className={`w-10 h-10 rounded-xl bg-${color}-500/15 border border-${color}-500/30 flex items-center justify-center shrink-0`}>
              <Icon size={18} className={`text-${color}-400`} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white text-sm group-hover:text-violet-400 transition-colors">{title}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              <p className="text-xs text-gray-700 mt-2">{count} articles</p>
            </div>
            <ChevronRight size={15} className="text-gray-700 group-hover:text-gray-500 transition-colors mt-1" />
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FAQ */}
        <div className="bg-gray-900/60 border border-white/8 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {filteredFaqs.map((faq, i) => (
              <div key={i} className="border border-white/5 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/3 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-300">{faq.q}</span>
                  <ChevronRight size={14} className={`text-gray-600 transition-transform shrink-0 ${openFaq === i ? 'rotate-90' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-3 text-sm text-gray-500 leading-relaxed">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Shortcuts + Contact */}
        <div className="space-y-6">
          <div className="bg-gray-900/60 border border-white/8 rounded-2xl p-6">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Keyboard size={16} className="text-violet-400" />
              Keyboard Shortcuts
            </h2>
            <div className="space-y-2">
              {SHORTCUTS.map(({ keys, action }) => (
                <div key={action} className="flex items-center justify-between py-2 border-b border-white/5 last:border-b-0">
                  <span className="text-sm text-gray-400">{action}</span>
                  <div className="flex gap-1">
                    {keys.map(k => (
                      <kbd key={k} className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-gray-300">{k}</kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-950/60 to-cyan-950/40 border border-violet-500/20 rounded-2xl p-6">
            <h2 className="text-base font-semibold text-white mb-2">Need more help?</h2>
            <p className="text-sm text-gray-400 mb-4">Our support team is available 24/7 to help you with any questions.</p>
            <div className="flex gap-3">
              <button onClick={() => showToast('Opening chat support...')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-sm font-semibold hover:from-violet-500 hover:to-cyan-400 transition-all">
                <MessageSquare size={14} />Contact Support
              </button>
              <button onClick={() => navigate('changelog')} className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-sm text-gray-300 hover:text-white transition-all">
                View Changelog
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
