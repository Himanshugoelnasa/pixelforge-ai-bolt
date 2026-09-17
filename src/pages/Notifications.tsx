import { useState } from 'react';
import { CheckCircle, AlertTriangle, Info, AlertCircle, Bell, Check } from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '@/lib/mockData';
import { useApp } from '@/contexts/AppContext';

const ICON_MAP: Record<string, React.ElementType> = {
  CheckCircle, AlertTriangle, Info, AlertCircle, Bell, Image: CheckCircle, Sparkles: Info, Download: CheckCircle, CreditCard: CheckCircle, UserPlus: Info, Maximize: CheckCircle, Eraser: CheckCircle, Stars: Info, Key: CheckCircle, BookmarkCheck: CheckCircle, Wrench: Info, HardDrive: Info,
};

const TYPE_CONFIG = {
  success: { color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30' },
  info: { color: 'text-blue-400', bg: 'bg-blue-500/15 border-blue-500/30' },
  warning: { color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/30' },
  error: { color: 'text-red-400', bg: 'bg-red-500/15 border-red-500/30' },
};

export default function Notifications() {
  const { showToast } = useApp();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? notifications : filter === 'unread' ? notifications.filter(n => !n.read) : notifications.filter(n => n.type === filter);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-gray-500 text-sm mt-1">{notifications.filter(n => !n.read).length} unread of {notifications.length} total</p>
        </div>
        <button onClick={markAllRead} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white transition-all">
          <Check size={14} />Mark all read
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['all', 'unread', 'success', 'info', 'warning', 'error'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all capitalize ${filter === f ? 'bg-violet-500/20 border border-violet-500/40 text-violet-400' : 'bg-white/5 border border-white/8 text-gray-500 hover:text-gray-300'}`}>{f}</button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <Bell size={48} className="text-gray-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-500 mb-2">No notifications</h3>
            <p className="text-gray-700 text-sm">You're all caught up!</p>
          </div>
        ) : (
          filtered.map(notif => {
            const Icon = ICON_MAP[notif.icon] || Bell;
            const config = TYPE_CONFIG[notif.type];
            return (
              <div
                key={notif.id}
                onClick={() => markRead(notif.id)}
                className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${notif.read ? 'bg-gray-900/40 border-white/5' : 'bg-gray-900/70 border-white/10 hover:border-white/15'}`}
              >
                <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border ${config.bg}`}>
                  <Icon size={16} className={config.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-medium ${notif.read ? 'text-gray-400' : 'text-white'}`}>{notif.title}</p>
                    {!notif.read && <div className="w-2 h-2 rounded-full bg-violet-500 shrink-0" />}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                  <p className="text-xs text-gray-700 mt-1">{notif.time}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
