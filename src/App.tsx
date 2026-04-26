/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, ShoppingBasket, PlusCircle, Share2, Info } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { AddFoodModal } from './components/AddFoodModal';
import { FoodItem, WasteEntry } from './types';
import { Storage } from './lib/storage';
import { cn } from './lib/utils';

export default function App() {
  const [inventory, setInventory] = useState<FoodItem[]>([]);
  const [log, setLog] = useState<WasteEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory'>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    setInventory(Storage.getInventory());
    setLog(Storage.getLog());
  }, []);

  const handleAddItem = (data: Omit<FoodItem, 'id' | 'addedAt'>) => {
    const newItem: FoodItem = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      addedAt: new Date().toISOString()
    };
    const updated = [newItem, ...inventory];
    setInventory(updated);
    Storage.setInventory(updated);
  };

  const handleAction = (id: string, status: 'eaten' | 'thrown') => {
    const item = inventory.find(i => i.id === id);
    if (!item) return;

    const wasteEntry: WasteEntry = {
      id: Math.random().toString(36).substr(2, 9),
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      status,
      date: new Date().toISOString()
    };

    const newLog = [wasteEntry, ...log];
    setLog(newLog);
    Storage.addLogEntry(wasteEntry);

    const newInventory = inventory.filter(i => i.id !== id);
    setInventory(newInventory);
    Storage.setInventory(newInventory);
  };

  const handleShare = () => {
    const excessFood = inventory.map(i => `${i.name} (${i.quantity}${i.unit})`).join(', ');
    const text = `Halo! Saya punya kelebihan makanan untuk dibagikan: ${excessFood}. Ada yang berminat? #FoodWise #BagiBukanBuang`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Berbagi FoodWise',
        text: text,
      }).catch(console.error);
    } else {
      // Fallback: Copy to clipboard or alert
      alert(`Teks Berbagi Disalin: \n\n${text}`);
    }
  };

  const handleResetLog = () => {
    Storage.clearLog();
    setLog([]);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col max-w-lg mx-auto shadow-2xl bg-white relative">
      {/* Header */}
      <header className="p-8 pb-4 sticky top-0 bg-[#f3f7f4]/80 backdrop-blur-md z-30">
        <div className="flex justify-between items-center bg-white p-5 rounded-3xl shadow-sm border border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white rounded-sm transform rotate-45" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-emerald-900 tracking-tight leading-none">FoodWise</h1>
              <p className="text-[10px] uppercase font-black text-emerald-600/40 tracking-[0.3em] mt-1">Indonesia</p>
            </div>
          </div>
          <nav className="flex gap-4">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={cn(
                "text-[10px] font-bold uppercase tracking-widest pb-1 transition-all",
                activeTab === 'dashboard' ? "text-emerald-700 border-b-2 border-emerald-600" : "text-slate-400"
              )}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('inventory')}
              className={cn(
                "text-[10px] font-bold uppercase tracking-widest pb-1 transition-all",
                activeTab === 'inventory' ? "text-emerald-700 border-b-2 border-emerald-600" : "text-slate-400"
              )}
            >
              Dapur
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-8 pt-2 pb-40 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              <Dashboard log={log} inventory={inventory} onShare={handleShare} onReset={handleResetLog} />
            </motion.div>
          ) : (
            <motion.div
              key="inventory"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <Inventory 
                items={inventory} 
                onAction={handleAction} 
                onAdd={() => setIsAddModalOpen(true)} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation (Subtle Status Bar style) */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white/40 backdrop-blur-md px-10 py-4 flex justify-between items-center z-40 border-t border-emerald-50">
        <div className="label-caps !text-[7px] opacity-30">v1.0.4</div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-emerald-600 text-white p-5 rounded-3xl -translate-y-6 shadow-2xl shadow-emerald-200 active:scale-90 transition-transform flex items-center gap-2 group"
        >
          <PlusCircle size={24} />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold text-xs uppercase tracking-widest">Tambah</span>
        </button>

        <div className="flex gap-4">
          <span className="label-caps !text-[7px] text-emerald-800 opacity-30">Target 82%</span>
        </div>
      </nav>

      {/* Modal */}
      <AddFoodModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddItem} 
      />

      {/* Decorative Gradient Background (Limited to Container) */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-emerald-50/50 to-transparent -z-10" />
    </div>
  );
}
