import { useState } from 'react';
import {
  Upload, FileText, Table, Play, Pause, X, RefreshCw, Download, CheckCircle,
  AlertCircle, Clock, Layers, Plus, ChevronRight, Eye, Archive, BarChart3, Trash2, Filter
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { MOCK_BATCH_JOBS } from '@/lib/mockData';
import type { BatchJob } from '@/lib/types';

const STATUS_CONFIG: Record<BatchJob['status'], { label: string; color: string; bg: string; dot: string }> = {
  queued: { label: 'Queued', color: 'text-gray-400', bg: 'bg-gray-500/15 border-gray-500/30', dot: 'bg-gray-500' },
  processing: { label: 'Processing', color: 'text-cyan-400', bg: 'bg-cyan-500/15 border-cyan-500/30', dot: 'bg-cyan-500' },
  completed: { label: 'Completed', color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30', dot: 'bg-emerald-500' },
  failed: { label: 'Failed', color: 'text-red-400', bg: 'bg-red-500/15 border-red-500/30', dot: 'bg-red-500' },
  paused: { label: 'Paused', color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/30', dot: 'bg-amber-500' },
};

const STEP_LABELS = ['Input', 'Configuration', 'Variables', 'Preview'];

export default function BatchStudio() {
  const { showToast } = useApp();
  const [view, setView] = useState<'jobs' | 'create'>('jobs');
  const [createStep, setCreateStep] = useState(1);
  const [filter, setFilter] = useState('all');
  const [jobs, setJobs] = useState(MOCK_BATCH_JOBS);
  const [batchName, setBatchName] = useState('New Batch Job');
  const [inputMode, setInputMode] = useState<'list' | 'csv' | 'json' | 'catalog'>('list');
  const [promptText, setPromptText] = useState('A product photo of {{product_name}} on {{background}} with {{lighting}} lighting\nA lifestyle shot of {{product_name}} in natural setting\nA close-up detail of {{product_name}} showing texture');
  const [newJobStarted, setNewJobStarted] = useState(false);

  const filteredJobs = filter === 'all' ? jobs : jobs.filter(j => j.status === filter);

  const handleStartBatch = () => {
    setNewJobStarted(true);
    const newJob: BatchJob = {
      id: 'batch-new', name: batchName, status: 'processing',
      total: 128, completed: 0, failed: 0, processing: 4,
      model: 'PixelForge Pro', credits: 1024, creditsUsed: 0,
      startedAt: new Date().toISOString(), eta: '18 min',
      prompts: promptText.split('\n').filter(Boolean), outputImages: [],
    };
    setJobs(prev => [newJob, ...prev]);
    setView('jobs');
    showToast('Batch job started! 128 images queued.', 'success');
  };

  const handlePause = (id: string) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: j.status === 'paused' ? 'processing' : 'paused' } : j));
    showToast('Batch job paused.');
  };

  const handleDelete = (id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
    showToast('Batch job deleted.');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Batch Studio</h1>
          <p className="text-gray-500 text-sm mt-1">Generate hundreds of images at once</p>
        </div>
        <button
          onClick={() => { setView('create'); setCreateStep(1); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold text-sm hover:from-violet-500 hover:to-cyan-400 transition-all shadow-lg shadow-violet-500/20"
        >
          <Plus size={16} />
          New Batch Job
        </button>
      </div>

      {view === 'jobs' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Jobs', value: jobs.length, icon: Layers, color: 'violet' },
              { label: 'Processing', value: jobs.filter(j => j.status === 'processing').length, icon: Clock, color: 'cyan' },
              { label: 'Completed', value: jobs.filter(j => j.status === 'completed').length, icon: CheckCircle, color: 'emerald' },
              { label: 'Total Images', value: jobs.reduce((a, j) => a + j.total, 0).toLocaleString(), icon: BarChart3, color: 'blue' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className={`p-4 rounded-2xl bg-${color}-500/10 border border-${color}-500/20`}>
                <Icon size={18} className={`text-${color}-400 mb-3`} />
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={15} className="text-gray-600" />
            {['all', 'processing', 'completed', 'paused', 'failed', 'queued'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all capitalize ${filter === f ? 'bg-violet-500/20 border border-violet-500/40 text-violet-400' : 'bg-white/5 border border-white/8 text-gray-500 hover:text-gray-300'}`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Jobs list */}
          <div className="space-y-3">
            {filteredJobs.map(job => {
              const status = STATUS_CONFIG[job.status];
              const pct = job.total > 0 ? (job.completed / job.total) * 100 : 0;
              return (
                <div key={job.id} className="bg-gray-900/60 border border-white/8 rounded-2xl p-5 hover:border-white/15 transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-white truncate">{job.name}</h3>
                        <span className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${status.bg} ${status.color}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${status.dot} ${job.status === 'processing' ? 'animate-pulse' : ''}`} />
                          {status.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{job.model}</span>
                        <span>·</span>
                        <span>{job.total} images</span>
                        <span>·</span>
                        <span>{job.credits.toLocaleString()} credits</span>
                        {job.startedAt && <><span>·</span><span>{new Date(job.startedAt).toLocaleDateString()}</span></>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {job.status === 'processing' && (
                        <>
                          <button onClick={() => handlePause(job.id)} className="p-2 rounded-xl bg-white/5 border border-white/8 text-gray-400 hover:text-amber-400 hover:border-amber-500/30 transition-all">
                            <Pause size={15} />
                          </button>
                          <button onClick={() => { showToast('Canceling job...'); handleDelete(job.id); }} className="p-2 rounded-xl bg-white/5 border border-white/8 text-gray-400 hover:text-red-400 hover:border-red-500/30 transition-all">
                            <X size={15} />
                          </button>
                        </>
                      )}
                      {job.status === 'paused' && (
                        <button onClick={() => handlePause(job.id)} className="p-2 rounded-xl bg-white/5 border border-white/8 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all">
                          <Play size={15} />
                        </button>
                      )}
                      {job.status === 'completed' && (
                        <button onClick={() => showToast('Downloading ZIP...')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-medium hover:bg-emerald-500/25 transition-colors">
                          <Archive size={13} />
                          Download ZIP
                        </button>
                      )}
                      {job.status === 'failed' && (
                        <button onClick={() => showToast('Retrying failed images...')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/25 transition-colors">
                          <RefreshCw size={13} />
                          Retry Failed
                        </button>
                      )}
                      <button onClick={() => showToast('Viewing results...')} className="p-2 rounded-xl bg-white/5 border border-white/8 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                        <Eye size={15} />
                      </button>
                      <button onClick={() => handleDelete(job.id)} className="p-2 rounded-xl bg-white/5 border border-white/8 text-gray-400 hover:text-red-400 hover:border-red-500/30 transition-all">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{job.completed.toLocaleString()} / {job.total.toLocaleString()} completed</span>
                      <div className="flex items-center gap-3">
                        {job.failed > 0 && <span className="text-red-400">{job.failed} failed</span>}
                        {job.status === 'processing' && <span className="text-gray-500 flex items-center gap-1"><Clock size={10} />ETA: {job.eta}</span>}
                        <span className="text-violet-400 font-medium">{Math.round(pct)}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${job.status === 'failed' ? 'bg-red-500' : 'bg-gradient-to-r from-violet-500 to-cyan-500'} ${job.status === 'processing' ? 'animate-pulse' : ''}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {view === 'create' && (
        <div className="max-w-3xl">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {STEP_LABELS.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 ${i + 1 <= createStep ? 'text-white' : 'text-gray-600'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${i + 1 < createStep ? 'bg-gradient-to-r from-violet-500 to-cyan-500 border-transparent' : i + 1 === createStep ? 'border-violet-500 text-violet-400' : 'border-white/10'}`}>
                    {i + 1 < createStep ? <CheckCircle size={14} className="text-white" /> : i + 1}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{label}</span>
                </div>
                {i < STEP_LABELS.length - 1 && <div className={`flex-1 h-px w-8 ${i + 1 < createStep ? 'bg-gradient-to-r from-violet-500 to-cyan-500' : 'bg-white/10'}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Input */}
          {createStep === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Job Name</label>
                <input value={batchName} onChange={e => setBatchName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-violet-500/50 transition-all" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-3">Input Method</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'list', icon: FileText, label: 'Prompt List' },
                    { id: 'csv', icon: Table, label: 'CSV Upload' },
                    { id: 'json', icon: FileText, label: 'JSON Upload' },
                    { id: 'catalog', icon: Upload, label: 'Product Catalog' },
                  ].map(({ id, icon: Icon, label }) => (
                    <button
                      key={id}
                      onClick={() => setInputMode(id as typeof inputMode)}
                      className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border transition-all ${inputMode === id ? 'border-violet-500/50 bg-violet-500/10 text-violet-400' : 'border-white/8 bg-white/3 text-gray-500 hover:text-gray-300 hover:border-white/15'}`}
                    >
                      <Icon size={20} />
                      <span className="text-xs font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {inputMode === 'list' && (
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Prompts (one per line)</label>
                  <textarea
                    value={promptText}
                    onChange={e => setPromptText(e.target.value)}
                    rows={8}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-700 outline-none focus:border-violet-500/50 resize-none transition-all font-mono"
                    placeholder="Enter your prompts, one per line..."
                  />
                  <p className="text-xs text-gray-600 mt-1.5">{promptText.split('\n').filter(Boolean).length} prompts</p>
                </div>
              )}

              {(inputMode === 'csv' || inputMode === 'json') && (
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center hover:border-violet-500/30 transition-colors cursor-pointer">
                  <Upload size={32} className="text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-400 font-medium">Drop your {inputMode.toUpperCase()} file here</p>
                  <p className="text-xs text-gray-600 mt-1">or click to browse</p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Configuration */}
          {createStep === 2 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Model', options: ['PixelForge Flux Pro', 'PixelForge Pro', 'PixelForge Fast', 'Flux Pro', 'Realistic Vision'] },
                  { label: 'Resolution', options: ['512 × 512', '768 × 768', '1024 × 1024', '1536 × 1024', '2048 × 2048'] },
                  { label: 'Aspect Ratio', options: ['1:1', '16:9', '4:3', '9:16', '3:2', '2:3'] },
                  { label: 'Quality', options: ['Draft', 'Standard', 'High', 'Ultra'] },
                  { label: 'Style', options: ['Photorealistic', 'Cinematic', 'Illustration', 'Anime', 'Concept Art'] },
                  { label: 'Outputs per Prompt', options: ['1', '2', '4', '8'] },
                ].map(({ label, options }) => (
                  <div key={label}>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-gray-300 outline-none">
                      {options.map(o => <option key={o} className="bg-gray-900">{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Global Negative Prompt</label>
                <input defaultValue="blurry, low quality, distorted, artifacts" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500/50 transition-all" />
              </div>
            </div>
          )}

          {/* Step 3: Variables */}
          {createStep === 3 && (
            <div className="space-y-5">
              <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
                <p className="text-xs font-medium text-violet-400 mb-2">Detected Variables</p>
                <p className="text-sm text-gray-300 font-mono leading-relaxed">
                  {'{{'}<span className="text-cyan-400">product_name</span>{'}}'}
                  {', '}
                  {'{{'}<span className="text-cyan-400">background</span>{'}}'}
                  {', '}
                  {'{{'}<span className="text-cyan-400">lighting</span>{'}}'}
                </p>
              </div>

              <div className="overflow-hidden rounded-xl border border-white/8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/8 bg-white/3">
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Variable</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Type</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Values</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[
                      { var: 'product_name', type: 'List', values: 'Wireless Headphones, Smart Watch, Laptop Stand' },
                      { var: 'background', type: 'List', values: 'white studio, marble surface, wooden desk' },
                      { var: 'lighting', type: 'List', values: 'studio, natural, dramatic, soft' },
                    ].map(row => (
                      <tr key={row.var} className="hover:bg-white/3 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-cyan-400">{'{{'}{row.var}{'}}'}</td>
                        <td className="px-4 py-3"><span className="text-xs bg-white/8 px-2 py-0.5 rounded-full text-gray-400">{row.type}</span></td>
                        <td className="px-4 py-3 text-xs text-gray-400 truncate max-w-xs">{row.values}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Step 4: Preview */}
          {createStep === 4 && (
            <div className="space-y-5">
              <div className="bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-violet-500/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-5">Batch Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Total Prompts', value: '3', accent: false },
                    { label: 'Total Images', value: '36', accent: false },
                    { label: 'Estimated Credits', value: '288', accent: true },
                    { label: 'Estimated Time', value: '18 min', accent: false },
                  ].map(({ label, value, accent }) => (
                    <div key={label} className="bg-white/5 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1">{label}</p>
                      <p className={`text-2xl font-bold ${accent ? 'bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent' : 'text-white'}`}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={handleStartBatch} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-sm hover:from-violet-500 hover:to-cyan-400 transition-all shadow-lg shadow-violet-500/20">
                  <Play size={16} />
                  Start Batch
                </button>
                <button onClick={() => showToast('Template saved!')} className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm hover:text-white hover:bg-white/10 transition-all">
                  Save Template
                </button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/8">
            <button
              onClick={() => createStep > 1 ? setCreateStep(s => s - 1) : setView('jobs')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm hover:text-white hover:bg-white/10 transition-all"
            >
              Back
            </button>
            {createStep < 4 && (
              <button
                onClick={() => setCreateStep(s => s + 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold text-sm hover:from-violet-500 hover:to-cyan-400 transition-all shadow-lg shadow-violet-500/20"
              >
                Next <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
