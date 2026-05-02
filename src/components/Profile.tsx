import React from 'react';
import { motion } from 'motion/react';
import { 
  Award, 
  Settings, 
  LogOut, 
  ArrowRight,
  TrendingDown,
  Recycle,
  Shield
} from 'lucide-react';
import { WasteEntry } from '../types';
import { cn } from '../lib/utils';

interface ProfileProps {
  log: WasteEntry[];
  score: number;
}

export const Profile: React.FC<ProfileProps> = ({ log, score }) => {
  const level = Math.floor(log.length / 5) + 1;
  const levelProgress = (log.length % 5) * 20;

  const badges = [
    { id: '1', name: 'Eco Pioneer', icon: '🌱', unlocked: true, desc: 'Memulai perjalanan FoodWise' },
    { id: '2', name: 'Zero Hero', icon: '⭐', unlocked: log.length >= 10, desc: 'Mencatat 10 aktivitas konsumsi' },
    { id: '3', name: 'Chef Pintar', icon: '🍳', unlocked: score >= 90, desc: 'Mencapai efisiensi >90%' },
    { id: '4', name: 'Bumi Bahagia', icon: '🌎', unlocked: false, desc: 'Cegah 10kg emisi CO2' },
  ];

  const getLevelName = (lvl: number) => {
    if (lvl < 2) return 'Pemula Hijau';
    if (lvl < 5) return 'Penjaga Dapur';
    if (lvl < 10) return 'Pejuang Limbah';
    return 'Eco Hero';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* Profile Header */}
      <section className="flex flex-col items-center pt-4">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-tr from-brand-600 to-emerald-400 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-xl">
             AJ
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-900 border-4 border-white rounded-xl flex items-center justify-center text-white">
             <Shield size={14} />
          </div>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mt-4 tracking-tight">Andhika Jaya</h2>
        <p className="text-[10px] font-bold text-brand-600 uppercase tracking-widest mt-1">Level {level} • {getLevelName(level)}</p>
      </section>

      {/* Level Progress */}
      <section className="geometric-card p-6">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h4 className="label-caps !text-slate-800">Progres Level</h4>
            <p className="text-[11px] text-slate-400 font-medium mt-1">10 XP menuju Level {level + 1}</p>
          </div>
          <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest bg-brand-50 px-2 py-0.5 rounded-full">{levelProgress}%</span>
        </div>
        <div className="w-full h-3 bg-brand-50 rounded-full overflow-hidden">
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: `${levelProgress}%` }}
             transition={{ duration: 1, ease: 'easeOut' }}
             className="h-full bg-brand-600"
           />
        </div>
      </section>

      {/* Achievement Badges */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
           <h3 className="label-caps">Pencapaian</h3>
           <button className="text-[10px] font-black text-brand-600 uppercase tracking-widest flex items-center gap-1">
             Semua <ArrowRight size={12} />
           </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
           {badges.map(badge => (
             <div 
               key={badge.id}
               className={cn(
                 "geometric-card p-6 flex flex-col items-center text-center transition-all",
                 !badge.unlocked && "opacity-40 grayscale"
               )}
             >
               <div className="text-4xl mb-3">{badge.icon}</div>
               <h4 className="text-sm font-bold text-slate-800 mb-1">{badge.name}</h4>
               <p className="text-[9px] text-slate-400 font-medium leading-tight">{badge.desc}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Menu Settings */}
      <section className="space-y-3">
         <ProfileMenuItem icon={<Settings size={18} />} label="Pengaturan Akun" />
         <ProfileMenuItem icon={<Recycle size={18} />} label="Donasi Makanan" />
         <ProfileMenuItem icon={<Award size={18} />} label="Papan Peringkat" />
         <ProfileMenuItem icon={<LogOut size={18} />} label="Keluar" color="text-rose-500" />
      </section>

       {/* Seasonal Impact Widget */}
       <div className="bg-brand-50 p-8 rounded-[2.5rem] border border-brand-100 relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="label-caps !text-brand-800 mb-2">Musim Ini</h4>
            <p className="text-sm text-brand-900 font-bold mb-4">Kamu telah menyelamatkan setara 12 porsi makanan.</p>
            <div className="flex gap-2">
               <div className="w-8 h-8 rounded-full bg-brand-200" />
               <div className="w-8 h-8 rounded-full bg-brand-200" />
               <div className="w-8 h-8 rounded-full bg-brand-200" />
               <div className="w-8 h-8 rounded-full bg-brand-100 border-2 border-dashed border-brand-300 flex items-center justify-center text-brand-400 text-[10px] font-bold">+9</div>
            </div>
          </div>
          <TrendingDown size={100} className="absolute -bottom-8 -right-8 text-brand-200/50 -rotate-12" />
       </div>
    </div>
  );
};

function ProfileMenuItem({ icon, label, color = "text-slate-600" }: any) {
  return (
    <button className="w-full p-5 bg-white border border-slate-50 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all">
       <div className="flex items-center gap-4">
          <div className={cn("shrink-0", color)}>
             {icon}
          </div>
          <span className={cn("text-sm font-bold", color === "text-rose-500" ? "text-rose-500" : "text-slate-700")}>{label}</span>
       </div>
       <ArrowRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
    </button>
  );
}
