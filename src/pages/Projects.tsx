import { useState } from 'react';
import { Plus, MoreHorizontal, FolderOpen, Images, Clock, Trash2, Edit3, Share2, Download } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { MOCK_PROJECTS } from '@/lib/mockData';
import type { Project } from '@/lib/types';
import Modal from '@/components/ui/Modal';

export default function Projects() {
  const { showToast } = useApp();
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleCreate = () => {
    if (!newName.trim()) return;
    const np: Project = {
      id: `proj-${Date.now()}`,
      name: newName,
      description: newDesc,
      coverImage: 'https://images.pexels.com/photos/10109585/pexels-photo-10109585.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      imageCount: 0,
      lastUpdated: new Date().toISOString(),
      owner: 'Himanshu',
      storage: '0 MB',
      color: 'from-violet-500 to-cyan-600',
    };
    setProjects(p => [np, ...p]);
    setCreateOpen(false);
    setNewName('');
    setNewDesc('');
    showToast('Project created!');
  };

  const handleDelete = (id: string) => {
    setProjects(p => p.filter(pr => pr.id !== id));
    showToast('Project deleted');
    setMenuOpen(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-gray-500 text-sm mt-1">{projects.length} projects · {projects.reduce((a, p) => a + p.imageCount, 0).toLocaleString()} images</p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold text-sm hover:from-violet-500 hover:to-cyan-400 transition-all shadow-lg shadow-violet-500/20"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {projects.map(project => (
          <div key={project.id} className="group bg-gray-900/60 border border-white/5 rounded-2xl overflow-hidden hover:border-white/15 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer">
            <div className="relative aspect-video overflow-hidden">
              <img
                src={project.coverImage}
                alt={project.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-40`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              <div className="absolute top-3 right-3 relative">
                <button
                  onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === project.id ? null : project.id); }}
                  className="p-1.5 rounded-lg bg-black/50 backdrop-blur-sm text-gray-300 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                >
                  <MoreHorizontal size={15} />
                </button>
                {menuOpen === project.id && (
                  <div className="absolute top-full right-0 mt-1 w-44 bg-gray-900 border border-white/10 rounded-xl shadow-2xl py-1 z-20">
                    {[
                      { icon: Edit3, label: 'Rename', action: () => showToast('Rename project') },
                      { icon: Share2, label: 'Share', action: () => showToast('Link copied!') },
                      { icon: Download, label: 'Download all', action: () => showToast('Downloading...') },
                      { icon: Trash2, label: 'Delete', action: () => handleDelete(project.id) },
                    ].map(({ icon: Icon, label, action }) => (
                      <button key={label} onClick={e => { e.stopPropagation(); action(); setMenuOpen(null); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                        <Icon size={13} />
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="absolute bottom-3 left-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r ${project.color} text-white`}>
                  {project.imageCount.toLocaleString()} images
                </span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-white mb-1 group-hover:text-violet-400 transition-colors">{project.name}</h3>
              <p className="text-xs text-gray-500 line-clamp-2 mb-3">{project.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Images size={11} />
                  {project.storage}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={11} />
                  {new Date(project.lastUpdated).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Empty state card */}
        <button
          onClick={() => setCreateOpen(true)}
          className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-white/10 text-gray-600 hover:border-violet-500/40 hover:text-violet-400 hover:bg-violet-500/5 transition-all min-h-[200px]"
        >
          <div className="w-12 h-12 rounded-full border-2 border-dashed border-current flex items-center justify-center">
            <Plus size={20} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">New Project</p>
            <p className="text-xs mt-0.5 opacity-60">Organize your images</p>
          </div>
        </button>
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create New Project">
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Project Name</label>
            <input
              autoFocus
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              placeholder="e.g. E-commerce Campaign"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-violet-500/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Description (optional)</label>
            <textarea
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              placeholder="What's this project for?"
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-violet-500/50 resize-none transition-all"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setCreateOpen(false)} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white transition-all">
              Cancel
            </button>
            <button onClick={handleCreate} disabled={!newName.trim()} className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-sm font-semibold hover:from-violet-500 hover:to-cyan-400 transition-all disabled:opacity-50">
              Create Project
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
