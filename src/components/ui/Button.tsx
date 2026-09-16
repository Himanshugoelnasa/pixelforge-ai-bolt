import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const VARIANTS = {
  primary: 'bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white shadow-lg shadow-violet-500/20',
  secondary: 'bg-white/10 hover:bg-white/15 text-white border border-white/10 hover:border-white/20',
  ghost: 'hover:bg-white/10 text-gray-400 hover:text-white',
  danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30',
  outline: 'border border-white/20 hover:border-white/40 text-gray-300 hover:text-white hover:bg-white/5',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
};

export default function Button({
  variant = 'secondary',
  size = 'md',
  loading,
  icon,
  iconRight,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 size={size === 'sm' ? 12 : 16} className="animate-spin" /> : icon}
      {children}
      {iconRight}
    </button>
  );
}
