import { useState } from 'react';
import { UserPlus, MoreHorizontal, Mail, Trash2, Shield, Edit3 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { MOCK_TEAM } from '@/lib/mockData';
import Modal from '@/components/ui/Modal';

const ROLE_CONFIG = {
  owner: { label: 'Owner', color: 'bg-violet-500/20 text-violet-400 border-violet-500/30' },
  admin: { label: 'Admin', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  editor: { label: 'Editor', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  viewer: { label: 'Viewer', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
};

export default function Team() {
  const { showToast } = useApp();
  const [members, setMembers] = useState(MOCK_TEAM);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('editor');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    setInviteOpen(false);
    setInviteEmail('');
    showToast(`Invitation sent to ${inviteEmail}`, 'success');
  };

  const handleRemove = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    showToast('Team member removed');
    setMenuOpen(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Team</h1>
          <p className="text-gray-500 text-sm mt-1">{members.length} members · Pro plan allows up to 10</p>
        </div>
        <button
          onClick={() => setInviteOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold text-sm hover:from-violet-500 hover:to-cyan-400 transition-all shadow-lg shadow-violet-500/20"
        >
          <UserPlus size={16} />Invite Member
        </button>
      </div>

      {/* Roles explanation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(ROLE_CONFIG).map(([role, { label, color }]) => (
          <div key={role} className="bg-gray-900/60 border border-white/8 rounded-xl p-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${color} mb-2`}>{label}</span>
            <p className="text-xs text-gray-600">
              {role === 'owner' ? 'Full access, manage billing' : role === 'admin' ? 'Manage team, all features' : role === 'editor' ? 'Create and edit content' : 'View only access'}
            </p>
          </div>
        ))}
      </div>

      {/* Members table */}
      <div className="bg-gray-900/60 border border-white/8 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/8">
          <h2 className="text-base font-semibold text-white">Members</h2>
        </div>
        <div className="divide-y divide-white/5">
          {members.map(member => {
            const roleConfig = ROLE_CONFIG[member.role];
            return (
              <div key={member.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/3 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {member.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-white text-sm truncate">{member.name}</p>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium border ${roleConfig.color}`}>{roleConfig.label}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{member.email}</p>
                </div>
                <div className="hidden md:flex flex-col items-end text-right">
                  <p className="text-xs text-gray-400">{member.imagesGenerated.toLocaleString()} images</p>
                  <p className="text-xs text-gray-600">Active {member.lastActive}</p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(menuOpen === member.id ? null : member.id)}
                    className="p-2 rounded-xl text-gray-600 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                  {menuOpen === member.id && (
                    <div className="absolute top-full right-0 mt-1 w-44 bg-gray-900 border border-white/10 rounded-xl shadow-2xl py-1 z-20">
                      {member.role !== 'owner' && [
                        { icon: Edit3, label: 'Change role', action: () => showToast('Change role...') },
                        { icon: Mail, label: 'Send message', action: () => showToast('Opening message...') },
                        { icon: Shield, label: 'View permissions', action: () => showToast('Viewing permissions...') },
                        { icon: Trash2, label: 'Remove member', action: () => handleRemove(member.id) },
                      ].map(({ icon: Icon, label, action }) => (
                        <button key={label} onClick={() => { action(); setMenuOpen(null); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                          <Icon size={13} />
                          {label}
                        </button>
                      ))}
                      {member.role === 'owner' && (
                        <p className="px-3 py-2 text-xs text-gray-700">Owner cannot be removed</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pending invites */}
      <div className="bg-gray-900/60 border border-white/8 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/8">
          <h2 className="text-base font-semibold text-white">Pending Invitations</h2>
        </div>
        <div className="p-5">
          {['dev@acmecorp.com', 'designer@studiox.io'].map(email => (
            <div key={email} className="flex items-center justify-between py-3 border-b border-white/5 last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Mail size={14} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">{email}</p>
                  <p className="text-xs text-gray-600">Invited 2 days ago · Editor</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => showToast('Invite resent!')} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">Resend</button>
                <button onClick={() => showToast('Invite revoked')} className="text-xs text-gray-600 hover:text-red-400 transition-colors">Revoke</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite Team Member">
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Email Address</label>
            <input autoFocus type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleInvite()} placeholder="colleague@company.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-violet-500/50 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Role</label>
            <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none">
              {Object.entries(ROLE_CONFIG).filter(([r]) => r !== 'owner').map(([role, { label }]) => (
                <option key={role} value={role} className="bg-gray-900">{label}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setInviteOpen(false)} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white transition-all">Cancel</button>
            <button onClick={handleInvite} disabled={!inviteEmail.trim()} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-sm font-semibold hover:from-violet-500 hover:to-cyan-400 transition-all disabled:opacity-50">
              <Mail size={14} />Send Invite
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
