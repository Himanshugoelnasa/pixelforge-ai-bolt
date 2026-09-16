import { useState } from 'react';
import { Key, Plus, Copy, Trash2, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { MOCK_API_KEYS } from '@/lib/mockData';
import Modal from '@/components/ui/Modal';

export default function ApiKeys() {
  const { showToast } = useApp();
  const [keys, setKeys] = useState(MOCK_API_KEYS);
  const [showKeys, setShowKeys] = useState<Set<string>>(new Set());
  const [createOpen, setCreateOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');

  const toggleShow = (id: string) => setShowKeys(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const handleCreate = () => {
    if (!newKeyName.trim()) return;
    const newKey = {
      id: `key-new-${Date.now()}`,
      name: newKeyName,
      key: `pf_prod_sk_${'*'.repeat(21)}${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      requestCount: 0,
      status: 'active' as const,
      permissions: ['generate'],
    };
    setKeys(prev => [newKey, ...prev]);
    setCreateOpen(false);
    setNewKeyName('');
    showToast('API key created! Copy it now — it won\'t be shown again.', 'info');
  };

  const handleRevoke = (id: string) => {
    setKeys(prev => prev.map(k => k.id === id ? { ...k, status: 'revoked' as const } : k));
    showToast('API key revoked');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">API Keys</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your API keys for programmatic access</p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold text-sm hover:from-violet-500 hover:to-cyan-400 transition-all shadow-lg shadow-violet-500/20"
        >
          <Plus size={16} />Create API Key
        </button>
      </div>

      {/* Security notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
        <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-300">Keep your API keys secret. Never share them in public repositories or client-side code.</p>
      </div>

      {/* Keys */}
      <div className="space-y-3">
        {keys.map(apiKey => (
          <div key={apiKey.id} className={`bg-gray-900/60 border rounded-2xl p-5 ${apiKey.status === 'revoked' ? 'border-white/5 opacity-60' : 'border-white/8'}`}>
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${apiKey.status === 'active' ? 'bg-violet-500/20' : 'bg-white/5'}`}>
                  <Key size={16} className={apiKey.status === 'active' ? 'text-violet-400' : 'text-gray-600'} />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{apiKey.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Created {new Date(apiKey.createdAt).toLocaleDateString()} · Last used: {apiKey.lastUsed}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${apiKey.status === 'active' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-red-500/15 border-red-500/30 text-red-400'}`}>
                  {apiKey.status === 'active' ? 'Active' : 'Revoked'}
                </span>
                {apiKey.status === 'active' && (
                  <button onClick={() => handleRevoke(apiKey.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors">
                    <Trash2 size={12} />Revoke
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/3 border border-white/8 rounded-xl px-4 py-2.5">
              <code className="flex-1 text-xs font-mono text-gray-400">
                {showKeys.has(apiKey.id) ? apiKey.key : apiKey.key.replace(/sk_.*/, 'sk_' + '•'.repeat(20))}
              </code>
              <button onClick={() => toggleShow(apiKey.id)} className="text-gray-600 hover:text-gray-400 transition-colors ml-2">
                {showKeys.has(apiKey.id) ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button onClick={() => showToast('API key copied!')} className="text-gray-600 hover:text-gray-400 transition-colors">
                <Copy size={14} />
              </button>
            </div>

            <div className="flex items-center gap-4 mt-3">
              <span className="text-xs text-gray-600">{apiKey.requestCount.toLocaleString()} requests</span>
              <span className="text-gray-800">·</span>
              <div className="flex gap-1.5">
                {apiKey.permissions.map(p => (
                  <span key={p} className="text-xs bg-white/5 border border-white/8 px-2 py-0.5 rounded-full text-gray-500">{p}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Code examples */}
      <div className="bg-gray-900/60 border border-white/8 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/8">
          <h2 className="text-base font-semibold text-white">API Reference</h2>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm text-gray-400">Base URL: <code className="text-violet-400 bg-white/5 px-2 py-0.5 rounded-md text-xs">https://api.pixelforge.ai/v1</code></p>
          <div className="space-y-3">
            {[
              { method: 'POST', path: '/images/generate', desc: 'Generate a single image' },
              { method: 'POST', path: '/images/batch', desc: 'Start a batch generation job' },
              { method: 'GET', path: '/jobs/{id}', desc: 'Get batch job status' },
              { method: 'GET', path: '/images/{id}', desc: 'Get image details' },
            ].map(({ method, path, desc }) => (
              <div key={path} className="flex items-center gap-4 p-3 bg-white/3 border border-white/5 rounded-xl">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md min-w-[44px] text-center ${method === 'GET' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>{method}</span>
                <code className="text-xs font-mono text-gray-300 flex-1">{path}</code>
                <span className="text-xs text-gray-500">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create API Key">
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Key Name</label>
            <input autoFocus value={newKeyName} onChange={e => setNewKeyName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCreate()} placeholder="e.g. Production API" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-violet-500/50 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Permissions</label>
            <div className="flex flex-wrap gap-2">
              {['generate', 'batch', 'gallery', 'projects', 'upscale'].map(p => (
                <label key={p} className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 hover:border-white/15 transition-colors">
                  <input type="checkbox" defaultChecked={p === 'generate'} className="accent-violet-500" />
                  <span className="text-xs text-gray-400">{p}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setCreateOpen(false)} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white transition-all">Cancel</button>
            <button onClick={handleCreate} disabled={!newKeyName.trim()} className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-sm font-semibold hover:from-violet-500 hover:to-cyan-400 transition-all disabled:opacity-50">Create Key</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
