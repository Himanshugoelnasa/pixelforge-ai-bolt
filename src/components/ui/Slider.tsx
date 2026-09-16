interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  hint?: string;
  showValue?: boolean;
}

export default function Slider({ label, value, min, max, step = 1, onChange, hint, showValue = true }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-400">{label}</label>
        {showValue && (
          <span className="text-xs font-mono font-semibold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-md">
            {value}
          </span>
        )}
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full h-1.5 appearance-none rounded-full cursor-pointer bg-white/10"
          style={{
            background: `linear-gradient(to right, rgb(124 58 237) 0%, rgb(6 182 212) ${pct}%, rgba(255,255,255,0.1) ${pct}%)`,
          }}
        />
      </div>
      {hint && <p className="text-xs text-gray-600">{hint}</p>}
    </div>
  );
}
