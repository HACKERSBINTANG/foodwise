import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Trash2, CheckCircle, Clock, Package, AlertCircle, ShoppingBag } from 'lucide-react';
import { FoodItem } from '../types';
import { differenceInDays } from 'date-fns';
import { cn } from '../lib/utils';

interface InventoryProps {
  items: FoodItem[];
  onAction: (id: string, status: 'eaten' | 'thrown') => void;
  onAdd: () => void;
}

export const Inventory: React.FC<InventoryProps> = ({ items, onAction, onAdd }) => {
  const getDaysLeft = (date: string) => {
    return differenceInDays(new Date(date), new Date());
  };

  const urgentItems = useMemo(() => {
    return items.filter(item => {
      const days = getDaysLeft(item.expiryDate);
      return days >= 0 && days <= 2;
    });
  }, [items]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => 
      new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
    );
  }, [items]);

  const getStatusClasses = (days: number) => {
    if (days < 0) return { 
      label: 'Expired', 
      classes: 'text-rose-500 bg-rose-50 border-rose-100',
      dot: 'bg-rose-500'
    };
    if (days <= 2) return { 
      label: 'Urgent', 
      classes: 'text-amber-500 bg-amber-50 border-amber-100',
      dot: 'bg-amber-500'
    };
    return { 
      label: 'Safe', 
      classes: 'text-emerald-500 bg-emerald-50 border-emerald-100',
      dot: 'bg-emerald-500'
    };
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* Header with Title and Add Button */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-brand-50">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Dapur Saya</h2>
          <p className="text-[10px] uppercase font-black text-brand-600/40 tracking-[0.2em] mt-1">
            {items.length} Bahan Tersimpan
          </p>
        </div>
        <button 
          onClick={onAdd}
          className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-100 active:scale-95 transition-all"
        >
          <ShoppingBag size={20} />
        </button>
      </div>

      {/* Urgent - Use Now Section */}
      {urgentItems.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle size={14} className="text-amber-500" />
            <h3 className="label-caps !text-amber-600">Gunakan Segera</h3>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
             {urgentItems.map(item => (
                <motion.div 
                  key={item.id}
                  whileHover={{ y: -4 }}
                  className="min-w-[160px] bg-white p-5 rounded-[2rem] border-2 border-amber-100 shadow-sm snap-start"
                >
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-3">
                    <Clock size={20} />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1 truncate">{item.name}</h4>
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">
                    {getDaysLeft(item.expiryDate) === 0 ? 'Hari Ini' : `${getDaysLeft(item.expiryDate)} Hari Lagi`}
                  </p>
                </motion.div>
             ))}
          </div>
        </section>
      )}

      {/* Main Inventory List */}
      <section className="space-y-4">
        <h3 className="label-caps">Semua Bahan</h3>
        {items.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 opacity-50">
            <Package size={48} className="text-slate-300 mb-4" strokeWidth={1} />
            <p className="text-sm font-medium italic text-slate-400">Dapur masih kosong...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {sortedItems.map((item, idx) => {
              const daysLeft = getDaysLeft(item.expiryDate);
              const status = getStatusClasses(daysLeft);
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="geometric-card p-4 flex items-center gap-4 group"
                >
                  <div className={cn("w-2 h-12 rounded-full", status.dot)} />
                  
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onAction(item.id, 'eaten')}>
                    <h4 className="font-bold text-slate-800 truncate">{item.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {item.quantity}{item.unit}
                      </span>
                      <span className={cn(
                        "text-[9px] px-2 py-0.5 rounded-full border font-black uppercase tracking-widest",
                        status.classes
                      )}>
                        {status.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAction(item.id, 'eaten');
                      }}
                      className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-all hover:bg-brand-600 hover:text-white group/btn"
                    >
                      <CheckCircle size={18} />
                      <span className="text-[7px] font-black uppercase tracking-tighter">Makan</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAction(item.id, 'thrown');
                      }}
                      className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-all hover:bg-rose-600 hover:text-white group/btn"
                    >
                      <Trash2 size={18} />
                      <span className="text-[7px] font-black uppercase tracking-tighter">Buang</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
