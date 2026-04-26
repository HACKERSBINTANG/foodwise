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
    <div className="space-y-4 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-neutral-800">Dapur Saya</h2>
        <button 
          onClick={onAdd}
          className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl font-bold text-sm active:scale-95 transition-transform"
        >
          + Tambah Bahan
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 opacity-50 space-y-4">
          <Package size={48} className="mx-auto" />
          <p className="text-sm">Dapur kamu kosong.<br/>Mulai tambahkan makanan!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item, idx) => {
            const daysLeft = getDaysLeft(item.expiryDate);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="clay-card rounded-2xl p-4 flex items-center justify-between group"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-neutral-800">{item.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-neutral-400 font-medium">
                      {item.quantity}{item.unit}
                    </span>
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-tighter flex items-center gap-1",
                      getStatusColor(daysLeft)
                    )}>
                      <Clock size={10} />
                      {getStatusText(daysLeft)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAction(item.id, 'thrown')}
                    className="p-3 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    title="Tanda sebagai Terbuang"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => onAction(item.id, 'eaten')}
                    className="p-3 text-neutral-300 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-colors"
                    title="Tanda sebagai Dimakan"
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
