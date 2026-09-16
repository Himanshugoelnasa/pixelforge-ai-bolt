interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple' | 'cyan';
  size?: 'sm' | 'md';
}

const VARIANTS = {
  default: 'bg-white/10 text-gray-300',
  success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  error: 'bg-red-500/20 text-red-400 border border-red-500/30',
  info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  purple: 'bg-violet-500/20 text-violet-400 border border-violet-500/30',
  cyan: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
};

const SIZES = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
};

export default function Badge({ children, variant = 'default', size = 'md' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${VARIANTS[variant]} ${SIZES[size]}`}>
      {children}
    </span>
  );
}
