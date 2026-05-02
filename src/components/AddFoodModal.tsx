import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Edit3, Scale } from 'lucide-react';
import { FoodItem } from '../types';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<FoodItem, 'id' | 'addedAt'>) => void;
}

export const AddFoodModal: React.FC<AddFoodModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: 100,
    unit: 'g' as const,
    expiryDate: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.expiryDate) return;
    onAdd(formData);
    setFormData({ name: '', quantity: 100, unit: 'g', expiryDate: '' });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-white w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] p-10 overflow-hidden shadow-2xl"
        >
          <div className="flex justify-between items-center mb-10">
            <div>
              <p className="label-caps mb-1">Input Data</p>
              <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Tambah Makanan</h2>
            </div>
            <button onClick={onClose} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-rose-500 transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="label-caps pl-1">Nama Makanan</label>
              <div className="relative">
                <Edit3 className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-600/40" size={18} />
                <input
                  type="text"
                  required
                  placeholder="Misal: Alpukat"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-6 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none font-medium transition-all"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="label-caps pl-1">Jumlah</label>
                <div className="relative">
                  <Scale className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-600/40" size={18} />
                  <input
                    type="number"
                    required
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-6 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none font-medium transition-all"
                    value={formData.quantity}
                    onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="label-caps pl-1">Satuan</label>
                <select
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-6 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none font-medium transition-all appearance-none"
                  value={formData.unit}
                  onChange={e => setFormData({ ...formData, unit: e.target.value as any })}
                >
                  <option value="g">Gram (g)</option>
                  <option value="kg">Kilo (kg)</option>
                  <option value="unit">Buah/Unit</option>
                  <option value="portion">Porsi</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="label-caps pl-1 !text-rose-500">Tanggal Kedaluwarsa</label>
              <div className="relative">
                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-rose-300" size={18} />
                <input
                  type="date"
                  required
                  className="w-full bg-slate-50 border border-rose-50 rounded-2xl py-5 pl-14 pr-6 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 outline-none font-medium transition-all"
                  value={formData.expiryDate}
                  onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-600 text-white font-bold py-5 rounded-[2rem] shadow-xl shadow-brand-100 hover:bg-brand-700 active:scale-95 transition-all text-xs uppercase tracking-widest mt-4"
            >
              Simpan ke Dapur
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
