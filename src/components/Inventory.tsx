import React from 'react';
import { motion } from 'motion/react';
import { Trash2, CheckCircle, Clock, Package } from 'lucide-react';
import { FoodItem } from '../types';
import { format, differenceInDays } from 'date-fns';
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

  const getStatusColor = (days: number) => {
    if (days < 0) return 'text-red-500 bg-red-50 border-red-100';
    if (days <= 2) return 'text-amber-500 bg-amber-50 border-amber-100';
    return 'text-emerald-500 bg-emerald-50 border-emerald-100';
  };

  const getStatusText = (days: number) => {
    if (days < 0) return 'Kedaluwarsa';
    if (days === 0) return 'Hari Ini';
    return `${days} hari lagi`;
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="label-caps mb-1">Manajemen Stok</p>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Dapur Saya</h2>
        </div>
        <button 
          onClick={onAdd}
          className="bg-emerald-600 text-white px-5 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-emerald-100"
        >
          + Tambah
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-24 opacity-30 space-y-4">
          <Package size={64} className="mx-auto" strokeWidth={1} />
          <p className="text-sm italic font-medium">Belum ada bahan di dapur...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, idx) => {
            const daysLeft = getDaysLeft(item.expiryDate);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="geometric-card p-5 flex items-center justify-between group"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 text-lg">{item.name}</h3>
                  <div className="flex items-center gap-4 mt-1.5">
                    <span className="label-caps !text-slate-400">
                      {item.quantity}{item.unit}
                    </span>
                    <span className={cn(
                      "text-[10px] px-2.5 py-0.5 rounded-lg border font-bold uppercase tracking-widest flex items-center gap-1.5",
                      getStatusColor(daysLeft)
                    )}>
                      <Clock size={10} />
                      {getStatusText(daysLeft)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl">
                  <button
                    onClick={() => onAction(item.id, 'thrown')}
                    className="p-3 text-slate-300 hover:text-rose-500 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                    title="Buang"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => onAction(item.id, 'eaten')}
                    className="p-3 text-slate-300 hover:text-emerald-600 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                    title="Dimakan"
                  >
                    <CheckCircle size={18} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
