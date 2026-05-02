import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  UtensilsCrossed, 
  Trash2, 
  Scale, 
  Tag, 
  MessageSquare,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { WasteEntry, CATEGORIES } from '../types';
import { cn } from '../lib/utils';

interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLog: (entry: Omit<WasteEntry, 'id' | 'date'>) => void;
  initialType: 'eaten' | 'thrown';
}

export const AddActivityModal: React.FC<AddActivityModalProps> = ({ 
  isOpen, 
  onClose, 
  onLog,
  initialType 
}) => {
  const [type, setType] = useState<'eaten' | 'thrown'>(initialType);
  const [formData, setFormData] = useState({
    foodName: '',
    quantity: 0,
    unit: 'g',
    reason: 'Expired'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLog({
      foodName: formData.foodName,
      quantity: formData.quantity,
      unit: formData.unit,
      status: type,
      reason: type === 'thrown' ? formData.reason : undefined
    });
    onClose();
    setFormData({ foodName: '', quantity: 0, unit: 'g', reason: 'Expired' });
  };

  const REASONS = ['Expired', 'Masak Terlalu Banyak', 'Lupa Dimakan', 'Rasa Tidak Enak'];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-lg bg-white rounded-t-[3rem] sm:rounded-[3rem] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <header className="p-8 pb-0 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Catat Aktivitas</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Lacak Konsumsi & Limbah</p>
              </div>
              <button 
                onClick={onClose}
                className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </header>

            {/* Type Selector */}
            <div className="px-8 mt-8">
              <div className="flex p-1.5 bg-slate-100 rounded-2xl gap-2">
                 <button 
                   onClick={() => setType('eaten')}
                   className={cn(
                     "flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest transition-all",
                     type === 'eaten' ? "bg-brand-600 text-white shadow-lg" : "text-slate-400"
                   )}
                 >
                   <UtensilsCrossed size={16} /> Dimakan
                 </button>
                 <button 
                   onClick={() => setType('thrown')}
                   className={cn(
                     "flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest transition-all",
                     type === 'thrown' ? "bg-rose-500 text-white shadow-lg" : "text-slate-400"
                   )}
                 >
                   <Trash2 size={16} /> Terbuang
                 </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="label-caps pl-1">Nama Makanan</label>
                <div className="relative">
                  <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Nasi Putih"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none font-medium transition-all"
                    value={formData.foodName}
                    onChange={e => setFormData({ ...formData, foodName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="label-caps pl-1">Jumlah</label>
                  <div className="relative">
                    <Scale className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                      type="number"
                      required
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none font-medium transition-all"
                      value={formData.quantity || ''}
                      onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="label-caps pl-1">Satuan</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none font-medium transition-all appearance-none"
                    value={formData.unit}
                    onChange={e => setFormData({ ...formData, unit: e.target.value })}
                  >
                    <option value="g">Gram (g)</option>
                    <option value="kg">Kilogram (kg)</option>
                    <option value="pcs">Potong (pcs)</option>
                    <option value="L">Liter (L)</option>
                  </select>
                </div>
              </div>

              {type === 'thrown' && (
                <div className="space-y-2">
                  <label className="label-caps pl-1">Alasan Terbuang</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <select
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none font-medium transition-all appearance-none"
                      value={formData.reason}
                      onChange={e => setFormData({ ...formData, reason: e.target.value })}
                    >
                      {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* Feedback Context Container */}
              <div className={cn(
                "p-5 rounded-2xl flex items-start gap-4 border transition-all",
                type === 'eaten' ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-rose-50 border-rose-100 text-rose-800"
              )}>
                 {type === 'eaten' ? <CheckCircle2 size={18} className="mt-0.5" /> : <AlertCircle size={18} className="mt-0.5" />}
                 <p className="text-[11px] font-medium leading-relaxed">
                   {type === 'eaten' 
                     ? "Bagus! Kamu menghabiskan makananmu. Ini meningkatkan skor FoodWise kamu." 
                     : "Terbuang? Catatan alasan membantu sistem memberikan saran pencegahan di masa depan."}
                 </p>
              </div>

              <button
                type="submit"
                className={cn(
                  "w-full text-white font-bold py-5 rounded-2xl shadow-xl active:scale-[0.98] transition-all text-xs uppercase tracking-widest",
                  type === 'eaten' ? "bg-brand-600 shadow-brand-100" : "bg-rose-500 shadow-rose-100"
                )}
              >
                Konfirmasi Aktivitas
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
