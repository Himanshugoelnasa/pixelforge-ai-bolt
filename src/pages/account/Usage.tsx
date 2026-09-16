import { BarChart3, TrendingUp, Images, Zap, HardDrive, CheckCircle } from 'lucide-react';
import { USAGE_STATS } from '@/lib/mockData';

const BarChart = ({ data, key1, color }: { data: Record<string, number>[]; key1: string; color: string }) => {
  const max = Math.max(...data.map(d => d[key1] || 0));
  return (
    <div className="flex items-end gap-3 h-32 mt-4">
      {data.map((d, i) => {
        const label = d.month || d.day || `${i}`;
        const val = d[key1] || 0;
        return (
          <div key={label} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full rounded-t-md" style={{ height: `${(val / max) * 100}px`, background: color }} title={`${val}`} />
            <span className="text-xs text-gray-600">{label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default function Usage() {
  const stats = USAGE_STATS;
  const creditsUsed = 10000 - 8420;

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Usage Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Track your generation activity and resource consumption</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Images', value: stats.totalImages.toLocaleString(), icon: Images, color: 'violet' },
          { label: 'This Month', value: stats.monthImages.toLocaleString(), icon: TrendingUp, color: 'cyan' },
          { label: 'Batch Jobs', value: stats.batchJobs, icon: BarChart3, color: 'blue' },
          { label: 'Credits Used', value: creditsUsed.toLocaleString(), icon: Zap, color: 'amber' },
          { label: 'Storage', value: stats.storage, icon: HardDrive, color: 'pink' },
          { label: 'Success Rate', value: `${stats.successRate}%`, icon: CheckCircle, color: 'emerald' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`p-4 rounded-2xl bg-${color}-500/10 border border-${color}-500/20`}>
            <Icon size={18} className={`text-${color}-400 mb-3`} />
            <p className="text-xl font-bold text-white">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly images */}
        <div className="bg-gray-900/60 border border-white/8 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Images Generated</h2>
            <span className="text-xs text-gray-500 bg-white/5 border border-white/8 px-2 py-1 rounded-lg">Last 6 months</span>
          </div>
          <BarChart
            data={stats.monthlyData}
            key1="images"
            color="linear-gradient(to top, rgb(124 58 237), rgb(6 182 212))"
          />
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
            <span className="text-xs text-gray-500">Average/month</span>
            <span className="text-sm font-semibold text-white">{Math.round(stats.monthlyData.reduce((a, d) => a + d.images, 0) / stats.monthlyData.length).toLocaleString()}</span>
          </div>
        </div>

        {/* Daily images */}
        <div className="bg-gray-900/60 border border-white/8 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Daily Activity</h2>
            <span className="text-xs text-gray-500 bg-white/5 border border-white/8 px-2 py-1 rounded-lg">This week</span>
          </div>
          <BarChart
            data={stats.dailyData}
            key1="images"
            color="linear-gradient(to top, rgb(6 182 212), rgb(59 130 246))"
          />
        </div>

        {/* Credits */}
        <div className="bg-gray-900/60 border border-white/8 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">Credits Overview</h2>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">10,000 monthly credits</span>
            <span className="text-sm font-bold text-white">{creditsUsed.toLocaleString()} used</span>
          </div>
          <div className="h-3 bg-white/5 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full" style={{ width: `${(creditsUsed / 10000) * 100}%` }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Used', value: creditsUsed.toLocaleString(), color: 'text-violet-400' },
              { label: 'Remaining', value: (8420).toLocaleString(), color: 'text-cyan-400' },
              { label: 'Image Generation', value: '1,580', color: 'text-gray-300' },
              { label: 'Batch Processing', value: '3,072', color: 'text-gray-300' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white/3 border border-white/5 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p className={`text-lg font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top models */}
        <div className="bg-gray-900/60 border border-white/8 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">Top Models Used</h2>
          <div className="space-y-3">
            {[
              { name: 'PixelForge Flux Pro', count: 4820, pct: 38 },
              { name: 'PixelForge Pro', count: 3640, pct: 28 },
              { name: 'Realistic Vision', count: 2180, pct: 17 },
              { name: 'Cinematic XL', count: 1450, pct: 11 },
              { name: 'Others', count: 752, pct: 6 },
            ].map(({ name, count, pct }) => (
              <div key={name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-300">{name}</span>
                  <span className="text-xs text-gray-500">{count.toLocaleString()} · {pct}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
