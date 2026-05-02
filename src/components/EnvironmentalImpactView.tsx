import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Leaf, 
  Droplets, 
  CloudRain, 
  Wind,
  Info,
  ArrowRight
} from 'lucide-react';
import { WasteEntry } from '../types';
import { cn } from '../lib/utils';

interface EnvironmentalImpactViewProps {
  log: WasteEntry[];
}

export const EnvironmentalImpactView: React.FC<EnvironmentalImpactViewProps> = ({ log }) => {
  const stats = useMemo(() => {
    const totalEatenGrams = log
      .filter(e => e.status === 'eaten')
      .reduce((acc, curr) => acc + curr.quantity, 0);
    
    const kg = totalEatenGrams / 1000;
    
    return {
      foodSaved: kg.toFixed(1),
      co2Avoided: (kg * 2.5).toFixed(1), // Avg 2.5kg CO2 per kg food
      waterSaved: Math.round(kg * 800), // Avg 800L water per kg food
      treesEquivalent: (kg * 0.1).toFixed(1) // rough estimate
    };
  }, [log]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      <header className="space-y-2">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Dampak Kamu</h2>
        <p className="text-sm text-slate-500 leading-relaxed translate-y-[-4px]">
          Setiap makanan yang kamu makan daripada dibuang memberikan dampak nyata bagi Bumi.
        </p>
      </header>

      {/* Main Impact Grid */}
      <div className="grid grid-cols-1 gap-6">
        <ImpactCard 
          icon={<CloudRain size={24} />}
          label="Emisi Karbon Dicegah"
          value={stats.co2Avoided}
          unit="kg CO2"
          description="Sama dengan mengurangi perjalanan mobil sejauh 12km."
          color="bg-slate-900"
          accent="text-emerald-400"
        />
        
        <ImpactCard 
          icon={<Droplets size={24} />}
          label="Air Berhasil Dihemat"
          value={stats.waterSaved.toLocaleString()}
          unit="Liter"
          description="Cukup untuk mengisi 1.200 botol air minum."
          color="bg-brand-600"
          accent="text-white"
        />

        <div className="grid grid-cols-2 gap-4">
           <div className="geometric-card p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-4 animate-float">
                <Leaf size={24} />
              </div>
              <h4 className="label-caps mb-2">Pangan Selamat</h4>
              <p className="text-2xl font-black text-slate-800">{stats.foodSaved}kg</p>
           </div>
           <div className="geometric-card p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-4 animate-float" style={{ animationDelay: '1s' }}>
                <Wind size={24} />
              </div>
              <h4 className="label-caps mb-2">Udara Bersih</h4>
              <p className="text-2xl font-black text-slate-800">{stats.treesEquivalent} Pohon</p>
           </div>
        </div>
      </div>

      {/* Educational Section */}
      <section className="bg-emerald-50/50 p-8 rounded-[2.5rem] border border-emerald-100/50">
        <div className="flex items-center gap-3 mb-4">
          <Info size={18} className="text-brand-600" />
          <h3 className="font-bold text-slate-800">Tahukah Kamu?</h3>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          Sekitar sepertiga dari total pangan yang diproduksi di dunia terbuang sia-sia. 
          Limbah makanan berkontribusi pada 8-10% dari total emisi gas rumah kaca global.
        </p>
        <button className="mt-6 text-xs font-bold text-brand-700 uppercase tracking-widest flex items-center gap-2">
           Pelajari Krisis Food Waste <ArrowRight size={14} />
        </button>
      </section>
    </div>
  );
};

function ImpactCard({ icon, label, value, unit, description, color, accent, delay = 0 }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn("p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-xl", color)}
    >
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6 opacity-60">
           {icon}
           <h4 className="label-caps !text-white !opacity-100">{label}</h4>
        </div>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-5xl font-black tracking-tighter">{value}</span>
          <span className={cn("text-lg font-medium opacity-60", accent)}>{unit}</span>
        </div>
        <p className="text-xs opacity-70 leading-relaxed font-medium italic">
          "{description}"
        </p>
      </div>
      
      {/* Decorative large icon backbox */}
      <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12">
        {React.cloneElement(icon as React.ReactElement, { size: 180 })}
      </div>
    </motion.div>
  );
}


