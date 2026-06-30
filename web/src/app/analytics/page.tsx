'use client';
import { ShieldAlert, TrendingUp, Search, AlertTriangle, ShieldCheck, MapPin } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Cell, PieChart as RePieChart, Pie
} from 'recharts';

// --- SIMULATED DATA FOR DEMO ---

const categorySpendingData = [
  { name: 'Groceries & Food', value: 65, color: '#10b981' }, // Emerald
  { name: 'Medicines', value: 20, color: '#3b82f6' }, // Blue
  { name: 'Education', value: 10, color: '#f59e0b' }, // Amber
  { name: 'Agriculture', value: 5, color: '#8b5cf6' }, // Purple
];

const regionalVelocityData = [
  { name: 'Davao City', volume: 85000, color: '#4f46e5' },
  { name: 'Tagum City', volume: 42000, color: '#0ea5e9' },
  { name: 'Panabo City', volume: 38000, color: '#06b6d4' },
  { name: 'Digos City', volume: 29000, color: '#14b8a6' },
];

const securityAlerts = [
  {
    id: 1,
    type: 'critical',
    title: 'High-Velocity Cash-Out Attempt',
    description: 'Beneficiary GABCD...789Z spent their entire 3,000 XLM allocation at a single sari-sari store exactly 45 seconds after disbursement.',
    time: '2 mins ago',
    icon: <AlertTriangle className="w-4 h-4 text-rose-600" />
  },
  {
    id: 2,
    type: 'warning',
    title: 'Geographical Anomaly',
    description: 'Wallet registered in Digos City just attempted a transaction at a hardware store in Manila.',
    time: '15 mins ago',
    icon: <MapPin className="w-4 h-4 text-amber-600" />
  },
  {
    id: 3,
    type: 'info',
    title: 'Smart Contract Block',
    description: 'Auto-rejected 14 transfer attempts to unauthorized Binance deposit addresses today.',
    time: '1 hour ago',
    icon: <ShieldCheck className="w-4 h-4 text-blue-600" />
  }
];

export default function AnalyticsPage() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Spending & Security Analytics</h1>
        <p className="text-slate-500 mt-1">Real-time blockchain monitoring and programmable money tracking.</p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Total Token Velocity</h3>
            <div className="text-2xl md:text-3xl font-bold text-slate-900">206,000 <span className="text-lg text-slate-400">XLM</span></div>
            <p className="text-emerald-500 text-xs font-bold mt-1">+14% circulated this month</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Compliance Rate</h3>
            <div className="text-2xl md:text-3xl font-bold text-emerald-600">99.8%</div>
            <p className="text-slate-500 text-xs font-medium mt-1">Funds spent on allowed categories</p>
          </div>
        </div>

        <div className="bg-rose-50 rounded-2xl border border-rose-200 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-100 rounded-full blur-xl opacity-50"></div>
          <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-rose-800 text-sm font-bold uppercase tracking-wider mb-1">Threats Blocked</h3>
            <div className="text-2xl md:text-3xl font-bold text-rose-600">142</div>
            <p className="text-rose-500 text-xs font-bold mt-1">Smart Contract Interventions</p>
          </div>
        </div>
      </div>

      {/* Middle Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Programmable Money Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col">
          <div className="mb-2">
            <h2 className="text-lg font-bold text-slate-900">Essential Goods Breakdown</h2>
            <p className="text-xs text-slate-500">Proof of programmable money enforcement</p>
          </div>
          <div className="flex-1 min-h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={categorySpendingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categorySpendingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value) => `${value}%`}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </RePieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-slate-800">100%</span>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Compliant</span>
            </div>
          </div>
          {/* Custom Legend */}
          <div className="grid grid-cols-2 gap-3 mt-2">
            {categorySpendingData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs font-medium text-slate-600">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Anomaly Detection */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-lg flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-400" /> Smart Contract Alerts
              </h2>
              <p className="text-xs text-slate-400 mt-1">AI-powered fraud & anomaly detection</p>
            </div>
            <div className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-[10px] font-bold uppercase tracking-widest animate-pulse">
              Live Monitoring
            </div>
          </div>
          
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
            {securityAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-4 rounded-xl border flex gap-4 ${
                  alert.type === 'critical' ? 'bg-rose-500/10 border-rose-500/30' :
                  alert.type === 'warning' ? 'bg-amber-500/10 border-amber-500/30' :
                  'bg-blue-500/10 border-blue-500/30'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  alert.type === 'critical' ? 'bg-rose-500/20' :
                  alert.type === 'warning' ? 'bg-amber-500/20' :
                  'bg-blue-500/20'
                }`}>
                  {alert.icon}
                </div>
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-sm font-bold ${
                      alert.type === 'critical' ? 'text-rose-400' :
                      alert.type === 'warning' ? 'text-amber-400' :
                      'text-blue-400'
                    }`}>{alert.title}</h4>
                    <span className="text-[10px] text-slate-500">{alert.time}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{alert.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      
      {/* Regional Velocity Bar Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Regional Token Velocity</h2>
            <p className="text-xs text-slate-500 mt-1">Where are the 4P-Tokens circulating the fastest?</p>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionalVelocityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(val) => `${val/1000}k`} />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#334155', fontSize: 12, fontWeight: 600}} width={90} />
              <RechartsTooltip 
                cursor={{fill: '#f1f5f9'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [`${value} XLM`, 'Volume']}
              />
              <Bar dataKey="volume" radius={[0, 4, 4, 0]} barSize={32}>
                {regionalVelocityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
    </div>
  );
}
