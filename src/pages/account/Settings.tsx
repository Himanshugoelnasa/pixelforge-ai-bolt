import { useState } from 'react';
import { User, Sliders, Bell, Palette, Shield, Key, Check } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const TABS = [
  { id: 'general', icon: User, label: 'General' },
  { id: 'generation', icon: Sliders, label: 'Generation' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'appearance', icon: Palette, label: 'Appearance' },
  { id: 'security', icon: Shield, label: 'Security' },
];

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button onClick={onChange} className={`w-10 h-5.5 rounded-full transition-all relative ${checked ? 'bg-gradient-to-r from-violet-600 to-cyan-500' : 'bg-white/10'}`} style={{ height: '22px' }}>
    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${checked ? 'right-0.5' : 'left-0.5'}`} />
  </button>
);

export default function Settings() {
  const { showToast } = useApp();
  const [tab, setTab] = useState('general');
  const [notifs, setNotifs] = useState({ genComplete: true, batchComplete: true, failedJobs: true, billing: false, updates: true });
  const [darkMode, setDarkMode] = useState(true);
  const [animations, setAnimations] = useState(true);

  const toggleNotif = (key: keyof typeof notifs) => setNotifs(p => ({ ...p, [key]: !p[key] }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account preferences and configuration</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-52 flex lg:flex-col gap-1">
          {TABS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === id ? 'bg-gradient-to-r from-violet-600/25 to-cyan-500/15 text-white border border-violet-500/30' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
            >
              <Icon size={15} className={tab === id ? 'text-violet-400' : ''} />
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 max-w-2xl space-y-5">
          {tab === 'general' && (
            <div className="bg-gray-900/60 border border-white/8 rounded-2xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white">Profile Information</h2>
              <div className="flex items-center gap-5 pb-5 border-b border-white/8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xl font-bold text-white">HS</div>
                <div>
                  <button onClick={() => showToast('Upload avatar')} className="text-sm text-violet-400 hover:text-violet-300 transition-colors">Change Avatar</button>
                  <p className="text-xs text-gray-600 mt-1">JPG, PNG up to 2MB</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[['First Name', 'Himanshu'], ['Last Name', 'Sharma'], ['Email', 'himanshu@pixelforge.ai'], ['Username', 'himanshu']].map(([label, val]) => (
                  <div key={label}>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
                    <input defaultValue={val} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500/50 transition-all" />
                  </div>
                ))}
                {[['Language', ['English', 'Spanish', 'French', 'German']], ['Timezone', ['UTC-8 (Pacific)', 'UTC-5 (Eastern)', 'UTC+0 (UTC)', 'UTC+5:30 (IST)']]].map(([label, opts]) => (
                  <div key={label as string}>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none">
                      {(opts as string[]).map(o => <option key={o} className="bg-gray-900">{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <button onClick={() => showToast('Profile updated!')} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-sm font-semibold hover:from-violet-500 hover:to-cyan-400 transition-all">
                Save Changes
              </button>
            </div>
          )}

          {tab === 'generation' && (
            <div className="bg-gray-900/60 border border-white/8 rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-white">Generation Defaults</h2>
              <div className="space-y-4">
                {[
                  { label: 'Default Model', options: ['PixelForge Flux Pro', 'PixelForge Pro', 'PixelForge Fast'] },
                  { label: 'Default Resolution', options: ['1024 × 1024', '1536 × 1024', '2048 × 2048'] },
                  { label: 'Default Aspect Ratio', options: ['16:9', '1:1', '4:3', '9:16'] },
                  { label: 'Default Quality', options: ['High', 'Standard', 'Ultra', 'Draft'] },
                ].map(({ label, options }) => (
                  <div key={label}>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none">
                      {options.map(o => <option key={o} className="bg-gray-900">{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <button onClick={() => showToast('Generation defaults saved!')} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-sm font-semibold hover:from-violet-500 hover:to-cyan-400 transition-all">
                Save Defaults
              </button>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="bg-gray-900/60 border border-white/8 rounded-2xl p-6 space-y-1">
              <h2 className="text-base font-semibold text-white mb-4">Notification Preferences</h2>
              {[
                { key: 'genComplete' as const, label: 'Generation completed', desc: 'When a single image generation finishes' },
                { key: 'batchComplete' as const, label: 'Batch job completed', desc: 'When a batch processing job finishes' },
                { key: 'failedJobs' as const, label: 'Failed jobs', desc: 'When a generation or batch job fails' },
                { key: 'billing' as const, label: 'Billing & payments', desc: 'Invoices, subscription renewals, credit alerts' },
                { key: 'updates' as const, label: 'Product updates', desc: 'New features, model releases, announcements' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between py-4 border-b border-white/5 last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-white">{label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                  </div>
                  <Toggle checked={notifs[key]} onChange={() => toggleNotif(key)} />
                </div>
              ))}
            </div>
          )}

          {tab === 'appearance' && (
            <div className="bg-gray-900/60 border border-white/8 rounded-2xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white">Appearance</h2>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-3">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {[{ id: 'dark', label: 'Dark', active: true }, { id: 'light', label: 'Light' }, { id: 'system', label: 'System' }].map(t => (
                    <button key={t.id} onClick={() => showToast(`${t.label} theme applied`)} className={`py-3 rounded-xl border text-sm font-medium transition-all ${t.active || (t.id === 'dark' && darkMode) ? 'border-violet-500/50 bg-violet-500/10 text-violet-400' : 'border-white/8 bg-white/3 text-gray-500 hover:text-gray-300'}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                {[
                  { label: 'Enable Animations', desc: 'Smooth transitions and micro-interactions', checked: animations, toggle: () => setAnimations(v => !v) },
                  { label: 'Dark Mode', desc: 'Use dark color scheme', checked: darkMode, toggle: () => setDarkMode(v => !v) },
                ].map(({ label, desc, checked, toggle }) => (
                  <div key={label} className="flex items-center justify-between py-4 border-b border-white/5 last:border-b-0">
                    <div>
                      <p className="text-sm font-medium text-white">{label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                    </div>
                    <Toggle checked={checked} onChange={toggle} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div className="space-y-4">
              <div className="bg-gray-900/60 border border-white/8 rounded-2xl p-6 space-y-4">
                <h2 className="text-base font-semibold text-white">Change Password</h2>
                {['Current Password', 'New Password', 'Confirm New Password'].map(f => (
                  <div key={f}>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">{f}</label>
                    <input type="password" defaultValue="••••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500/50 transition-all" />
                  </div>
                ))}
                <button onClick={() => showToast('Password updated!')} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-sm font-semibold">
                  Update Password
                </button>
              </div>
              <div className="bg-gray-900/60 border border-white/8 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-white">Two-Factor Authentication</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Add an extra layer of security to your account</p>
                  </div>
                  <button onClick={() => showToast('2FA setup started')} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white transition-all">Enable 2FA</button>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-gray-400">Not enabled</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
