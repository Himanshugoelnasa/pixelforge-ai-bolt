import { Sparkles, Zap, Plus, Bug, Wrench } from 'lucide-react';

const CHANGELOG = [
  {
    version: '3.2.1',
    date: 'Sep 14, 2026',
    tag: 'Latest',
    changes: [
      { type: 'feature', text: 'New Flux Pro model with improved photorealism and creative range' },
      { type: 'feature', text: 'Batch variable mapping with CSV column detection' },
      { type: 'improvement', text: 'Faster generation times — up to 30% speed improvement' },
      { type: 'fix', text: 'Fixed issue where batch jobs would pause unexpectedly on large queues' },
    ],
  },
  {
    version: '3.1.0',
    date: 'Aug 28, 2026',
    changes: [
      { type: 'feature', text: 'AI Upscaler now supports 8× upscaling with face enhancement' },
      { type: 'feature', text: 'New camera controls: lens, focal length, depth of field' },
      { type: 'improvement', text: 'Gallery now supports masonry view and bulk operations' },
      { type: 'fix', text: 'Resolved credit calculation error on 4K resolution' },
    ],
  },
  {
    version: '3.0.0',
    date: 'Aug 10, 2026',
    tag: 'Major',
    changes: [
      { type: 'feature', text: 'Completely redesigned dashboard with analytics' },
      { type: 'feature', text: 'Team management with roles and permissions' },
      { type: 'feature', text: 'API v1 with full programmatic access' },
      { type: 'feature', text: 'Project organization with shared assets' },
      { type: 'improvement', text: 'New dual-color gradient design system' },
    ],
  },
  {
    version: '2.8.4',
    date: 'Jul 22, 2026',
    changes: [
      { type: 'feature', text: 'Background remover with custom color and gradient options' },
      { type: 'improvement', text: 'Image detail modal with full metadata display' },
      { type: 'fix', text: 'Fixed negative prompt not being applied in batch jobs' },
    ],
  },
  {
    version: '2.7.0',
    date: 'Jul 5, 2026',
    changes: [
      { type: 'feature', text: 'Template system with 12+ pre-built generation templates' },
      { type: 'feature', text: 'Image variations with similarity and creativity controls' },
      { type: 'improvement', text: 'Search now covers images, projects, and templates' },
    ],
  },
];

const TYPE_CONFIG = {
  feature: { icon: Plus, color: 'text-violet-400', bg: 'bg-violet-500/15 border-violet-500/30', label: 'New' },
  improvement: { icon: Zap, color: 'text-cyan-400', bg: 'bg-cyan-500/15 border-cyan-500/30', label: 'Improved' },
  fix: { icon: Bug, color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30', label: 'Fixed' },
};

export default function Changelog() {
  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Changelog</h1>
        <p className="text-gray-500 text-sm mt-1">What's new in PixelForge AI</p>
      </div>

      <div className="space-y-6">
        {CHANGELOG.map((release, idx) => (
          <div key={release.version} className="relative">
            {/* Timeline line */}
            {idx < CHANGELOG.length - 1 && (
              <div className="absolute left-5 top-12 bottom-0 w-px bg-white/5" />
            )}

            <div className="flex gap-4">
              <div className="shrink-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${idx === 0 ? 'bg-gradient-to-br from-violet-500 to-cyan-500' : 'bg-white/5 border border-white/10'}`}>
                  <Sparkles size={16} className={idx === 0 ? 'text-white' : 'text-gray-500'} />
                </div>
              </div>

              <div className="flex-1 pb-6">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-lg font-bold text-white">v{release.version}</h2>
                  {release.tag && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${idx === 0 ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                      {release.tag}
                    </span>
                  )}
                  <span className="text-xs text-gray-600 ml-auto">{release.date}</span>
                </div>

                <div className="space-y-2 mt-3">
                  {release.changes.map((change, i) => {
                    const config = TYPE_CONFIG[change.type as keyof typeof TYPE_CONFIG];
                    const Icon = config.icon;
                    return (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-900/40 border border-white/5">
                        <span className={`shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.color}`}>
                          <Icon size={10} />
                          {config.label}
                        </span>
                        <p className="text-sm text-gray-400 leading-relaxed">{change.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
