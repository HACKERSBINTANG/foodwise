import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingDown, AlertTriangle, Lightbulb, Share2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { WasteEntry, FoodItem } from '../types';
import { format, differenceInDays } from 'date-fns';

interface DashboardProps {
  log: WasteEntry[];
  inventory: FoodItem[];
  onShare: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ log, inventory, onShare }) => {
  const totalWaste = useMemo(() => log.filter(e => e.status === 'thrown').reduce((acc, curr) => acc + curr.quantity, 0), [log]);
  const totalEaten = useMemo(() => log.filter(e => e.status === 'eaten').reduce((acc, curr) => acc + curr.quantity, 0), [log]);
  
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return format(d, 'yyyy-MM-dd');
    }).reverse();

    return last7Days.map(date => {
      const dailyWaste = log
        .filter(e => e.date.startsWith(date) && e.status === 'thrown')
        .reduce((acc, curr) => acc + curr.quantity, 0);
      return {
        name: format(new Date(date), 'EEE'),
        waste: dailyWaste
      };
    });
  }, [log]);

  const activeNudges = useMemo(() => {
    const nudges = [];
    
    if (totalWaste > 1000) {
      nudges.push({
        id: 'heavy-waste',
        type: 'waste',
        message: `Kamu telah membuang ${totalWaste}g makanan bulan ini. Itu cukup untuk memberi makan seseorang selama sehari!`,
        icon: <TrendingDown className="text-red-500" />
      });
    }

    const expiringSoon = inventory.filter(item => {
      const days = differenceInDays(new Date(item.expiryDate), new Date());
      return days >= 0 && days <= 2;
    });

    if (expiringSoon.length > 0) {
      const days = differenceInDays(new Date(expiringSoon[0].expiryDate), new Date());
      nudges.push({
        id: 'expiring',
        type: 'expiry',
        message: `${expiringSoon[0].name} akan kedaluwarsa dalam ${days === 0 ? 'hari ini' : days + ' hari'}. Rencanakan menu makanan segera!`,
        icon: <AlertTriangle className="text-amber-500" />
      });
    }

    nudges.push({
      id: 'sharing-tip',
      type: 'tips',
      message: "Punya bahan makanan sisa? Bagikan dengan tetangga daripada dibuang.",
      icon: <Lightbulb className="text-emerald-500" />
    });

    return nudges;
  }, [totalWaste, inventory]);

  return (
    <div className="space-y-6 pb-20">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="clay-card rounded-2xl p-4 border-l-4 border-emerald-500"
        >
          <p className="text-xs font-semibold uppercase text-neutral-400 tracking-wider">Total Dimakan</p>
          <h3 className="text-2xl font-bold text-emerald-600">{totalEaten}g</h3>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="clay-card rounded-2xl p-4 border-l-4 border-red-500"
        >
          <p className="text-xs font-semibold uppercase text-neutral-400 tracking-wider">Total Limbah</p>
          <h3 className="text-2xl font-bold text-red-600">{totalWaste}g</h3>
        </motion.div>
      </div>

      {/* Chart */}
      <div className="clay-card rounded-3xl p-6">
        <h4 className="text-sm font-bold mb-4 text-neutral-700">Tren Limbah Mingguan (g)</h4>
        <div className="h-48 w-full">
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

      {/* Smart Nudges */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-neutral-700 flex items-center gap-2">
          <Lightbulb size={16} className="text-emerald-500" />
          Saran Cerdas
        </h4>
        <div className="space-y-3">
          <AnimatePresence>
            {activeNudges.map((nudge, idx) => (
              <motion.div
                key={nudge.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + (idx * 0.1) }}
                className="bg-white p-4 rounded-2xl border border-emerald-100 flex gap-4 shadow-sm"
              >
                <div className="mt-1">{nudge.icon}</div>
                <div>
                  <p className="text-sm text-neutral-700 leading-relaxed">{nudge.message}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
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
