import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingDown, 
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  BarChart3,
  Recycle,
  Lightbulb,
  UtensilsCrossed,
  Trash2,
  Leaf
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { WasteEntry, FoodItem } from '../types';
import { cn } from '../lib/utils';

interface DashboardProps {
  log: WasteEntry[];
  inventory: FoodItem[];
  score: number;
  onNavigate: (tab: 'inventory' | 'recommendations' | 'impact') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ log, inventory, score, onNavigate }) => {
  const totalWaste = useMemo(() => 
    log.filter(e => e.status === 'thrown').reduce((acc, curr) => acc + curr.quantity, 0), 
  [log]);
  
  const totalEaten = useMemo(() => 
    log.filter(e => e.status === 'eaten').reduce((acc, curr) => acc + curr.quantity, 0), 
  [log]);

  const scoreStatus = useMemo(() => {
    if (score >= 80) return { label: 'Sangat Efisien', color: 'text-emerald-500', bg: 'bg-emerald-50', icon: <ShieldCheck size={16} /> };
    if (score >= 50) return { label: 'Normal', color: 'text-amber-500', bg: 'bg-amber-50', icon: <AlertCircle size={16} /> };
    return { label: 'Boros', color: 'text-rose-500', bg: 'bg-rose-50', icon: <TrendingDown size={16} /> };
  }, [score]);

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const entries = log.filter(e => e.date.startsWith(date));
      return {
        name: date.split('-')[2],
        waste: entries.filter(e => e.status === 'thrown').reduce((acc, curr) => acc + curr.quantity, 0),
        eaten: entries.filter(e => e.status === 'eaten').reduce((acc, curr) => acc + curr.quantity, 0),
      };
    });
  }, [log]);

  const expiringSoonCount = useMemo(() => {
    const today = new Date();
    return inventory.filter(item => {
      const expiry = new Date(item.expiryDate);
      const diff = (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 3;
    }).length;
  }, [inventory]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* FoodWise Score Section */}
      <section className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(34,197,94,0.05)] border border-emerald-50 relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center text-center">
          <h2 className="label-caps mb-6">Skor FoodWise Kamu</h2>
          <div className="relative mb-6">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-emerald-50" />
              <circle
                cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent"
                strokeDasharray={364.4}
                strokeDashoffset={364.4 - (364.4 * score) / 100}
                className="text-brand-500 transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-4xl font-black text-slate-800 tracking-tighter">{score}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Poin</span>
            </div>
          </div>
          
          <div className={cn("px-4 py-1.5 rounded-full flex items-center gap-2 mb-2", scoreStatus.bg)}>
            <div className={scoreStatus.color}>{scoreStatus.icon}</div>
            <span className={cn("text-xs font-bold uppercase tracking-wider", scoreStatus.color)}>
              {scoreStatus.label}
            </span>
          </div>
          <p className="text-sm text-slate-500 max-w-[200px] leading-relaxed">
            {score >= 80 ? "Hebat! Terus pertahankan pola konsumsi kamu." : "Yuk, kurangi membuang makanan dengan saran cerdas kami."}
          </p>
        </div>
        
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-50/50 rounded-full blur-3xl -ml-16 -mb-16" />
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-2 gap-4">
        <div className="geometric-card p-6 border-l-4 border-l-brand-500">
          <div className="flex items-center gap-2 mb-3">
             <UtensilsCrossed size={14} className="text-brand-500" />
             <h4 className="label-caps">Dimakan</h4>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-800 tracking-tight">{totalEaten}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">g</span>
          </div>
        </div>
        <div className="geometric-card p-6 border-l-4 border-l-rose-500">
          <div className="flex items-center gap-2 mb-3">
             <Trash2 size={14} className="text-rose-500" />
             <h4 className="label-caps">Limbah</h4>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-800 tracking-tight">{totalWaste}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">g</span>
          </div>
        </div>
      </section>

      {/* Expiry Alert Card */}
      {expiringSoonCount > 0 && (
        <section 
          onClick={() => onNavigate('inventory')}
          className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900">{expiringSoonCount} item akan segera kedaluwarsa</p>
              <p className="text-[11px] text-amber-700/70">Segera gunakan atau bagikan.</p>
            </div>
          </div>
          <ArrowRight size={18} className="text-amber-400" />
        </section>
      )}

      {/* Weekly Trend Chart */}
      <section className="geometric-card p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Tren Mingguan</h3>
            <p className="text-[11px] text-slate-400 uppercase font-bold tracking-widest mt-1">Konsumsi vs Limbah</p>
          </div>
          <BarChart3 className="text-emerald-100" size={24} />
        </div>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorEaten" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                labelStyle={{ fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}
              />
              <Area type="monotone" dataKey="eaten" name="Dimakan" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorEaten)" />
              <Area type="monotone" dataKey="waste" name="Limbah" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorWaste)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 pt-6 border-t border-slate-50 space-y-4">
           <div className="flex gap-3 items-start">
             <Lightbulb size={18} className="text-emerald-500 shrink-0" />
             <p className="text-[12px] text-slate-500 leading-relaxed italic">
               {totalWaste > totalEaten * 0.5 
                 ? "Waspada! Limbah kamu minggu ini cukup tinggi. Coba belanja lebih sedikit untuk akhir pekan." 
                 : "Bagus! Kamu mengonsumsi sebagian besar makananmu minggu ini. Pertahankan skor FoodWise kamu."}
             </p>
           </div>
           
           {/* Smart Insights for Competition Wow Factor */}
           <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-brand-600 shadow-sm">
                    <TrendingDown size={14} />
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pola Perilaku</p>
                    <p className="text-xs font-bold text-slate-700">Limbah meningkat pada akhir pekan</p>
                 </div>
              </div>
              <ShieldCheck size={16} className="text-emerald-500" />
           </div>
        </div>
      </section>

      {/* Sustainable Impact Card Mini */}
      <section 
        onClick={() => onNavigate('impact')}
        className="bg-brand-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden group cursor-pointer"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4 opacity-70">
            <Recycle size={14} />
            <h4 className="label-caps !text-white !opacity-100">Dampak Lingkungan</h4>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tighter">{(totalEaten / 1000).toFixed(1)}</span>
            <span className="text-lg opacity-60">kg CO2 dicegah</span>
          </div>
          <div className="mt-6 flex items-center text-[11px] font-bold uppercase tracking-widest text-emerald-400 group-hover:gap-2 transition-all">
            Lihat Detail Dampak <ArrowRight size={14} className="ml-1" />
          </div>
        </div>
        <Leaf className="absolute -bottom-8 -right-8 text-emerald-800/20 w-48 h-48 -rotate-12 group-hover:rotate-0 transition-all duration-700" />
      </section>
    </div>
  );
};
