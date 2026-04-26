import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { TrendingDown, Share2, RotateCcw, Wallet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { WasteEntry } from '../types';

interface DashboardProps {
  log: WasteEntry[];
  onShare: () => void;
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ log, onShare, onReset }) => {
  const totalWaste = useMemo(() => log.filter(e => e.status === 'thrown').reduce((acc, curr) => acc + curr.quantity, 0), [log]);
  const totalEaten = useMemo(() => log.filter(e => e.status === 'eaten').reduce((acc, curr) => acc + curr.quantity, 0), [log]);
  
  // Savings Calculation Logic
  // Average Indonesian household waste: ~100g/day per person (hypothetically for this app)
  // Value of food: roughly Rp 50 per gram (average)
  const savings = useMemo(() => {
    const avgMonthlyWasteGrams = 3000; // 3kg/month average
    const currentWasteGrams = totalWaste;
    const reducedGrams = Math.max(0, avgMonthlyWasteGrams - currentWasteGrams);
    const valuePerGram = 50; // Rp 50 per gram
    return reducedGrams * valuePerGram;
  }, [totalWaste]);

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }).reverse();

    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    return last7Days.map(date => {
      const dailyWaste = log
        .filter(e => e.date.startsWith(date) && e.status === 'thrown')
        .reduce((acc, curr) => acc + curr.quantity, 0);
      return {
        name: dayNames[new Date(date).getDay()],
        waste: dailyWaste
      };
    });
  }, [log]);

  return (
    <div className="space-y-6 pb-32">
      {/* Stats Section with Impact Card */}
      <div className="space-y-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <h2 className="label-caps !text-emerald-300/60 mb-2">Total Limbah Bulan Ini</h2>
              <button 
                onClick={onReset}
                className="p-2 bg-emerald-800/50 rounded-xl text-emerald-200 hover:text-white transition-colors"
                title="Reset Data"
              >
                <RotateCcw size={16} />
              </button>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="impact-number">{totalWaste}</span>
              <span className="text-2xl font-light opacity-60">gram</span>
            </div>
            <p className="mt-4 text-emerald-200/80 text-sm leading-relaxed max-w-[240px] italic">
              "Kamu lebih hemat dari 78% warga di sekitarmu!"
            </p>
          </div>
          <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-emerald-800 rounded-full blur-3xl opacity-50"></div>
        </motion.div>

        {/* Savings Calculator Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="geometric-card p-6 bg-gradient-to-br from-white to-emerald-50/30 overflow-hidden relative"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
              <Wallet size={18} />
            </div>
            <h4 className="label-caps !text-emerald-800">Kalkulator Penghematan</h4>
          </div>
          
          <div className="flex flex-col gap-1">
            <p className="text-xs text-slate-500">Estimasi uang yang dihemat:</p>
            <h3 className="text-3xl font-black text-emerald-600 tracking-tighter">
              Rp {savings.toLocaleString('id-ID')}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1 italic">
              *Dibandingkan rata-rata nasional (3kg/bulan per rumah tangga)
            </p>
          </div>
          <div className="absolute top-4 right-4 opacity-5 rotate-12">
            <TrendingDown size={80} />
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="geometric-card p-5 border-l-4 border-emerald-500"
          >
            <p className="label-caps mb-1">Dimakan</p>
            <h3 className="text-2xl font-bold text-emerald-600">{totalEaten}g</h3>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="geometric-card p-5 border-l-4 border-rose-400"
          >
            <p className="label-caps mb-1">Terbuang</p>
            <h3 className="text-2xl font-bold text-rose-500">{totalWaste}g</h3>
          </motion.div>
        </div>
      </div>

      {/* Chart */}
      <div className="geometric-card p-6">
        <h4 className="label-caps mb-4">Tren Limbah Mingguan (g)</h4>
        <div className="h-48 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="waste" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.waste > 200 ? '#ef4444' : '#10b981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <button 
          onClick={onShare}
          className="flex-1 bg-emerald-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 active:scale-95 transition-transform"
        >
          <Share2 size={18} />
          Bagikan Kelebihan Makanan
        </button>
      </div>
    </div>
  );
};

