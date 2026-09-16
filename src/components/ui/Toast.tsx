import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import type { ToastMessage } from '@/lib/types';

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const COLORS = {
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  error: 'border-red-500/30 bg-red-500/10 text-red-400',
  info: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
};

function ToastItem({ toast }: { toast: ToastMessage }) {
  const Icon = ICONS[toast.type];
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl bg-gray-900/90 shadow-2xl min-w-[280px] max-w-[380px] animate-slide-up ${COLORS[toast.type]}`}>
      <Icon size={18} className="shrink-0" />
      <p className="text-sm font-medium text-gray-100 flex-1">{toast.message}</p>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts } = useApp();
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2">
      {toasts.map(t => <ToastItem key={t.id} toast={t} />)}
    </div>
  );
}
