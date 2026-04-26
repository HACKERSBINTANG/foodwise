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

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col max-w-lg mx-auto shadow-2xl bg-white relative">
      {/* Header */}
      <header className="p-6 pb-2 sticky top-0 bg-white/80 backdrop-blur-md z-30">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-emerald-600 tracking-tighter">FoodWise</h1>
            <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-[0.2em] mt-0.5">Hidup Lebih Bermakna</p>
          </div>
          <button className="p-2 text-neutral-400 hover:text-emerald-500 transition-colors">
            <Info size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 pt-4">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              <Dashboard log={log} inventory={inventory} onShare={handleShare} />
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

      {/* Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white/90 backdrop-blur-xl border-t border-neutral-100 px-8 py-4 flex justify-between items-center z-40">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={cn(
            "flex flex-col items-center gap-1 transition-all",
            activeTab === 'dashboard' ? "text-emerald-600 scale-110" : "text-neutral-400"
          )}
        >
          <LayoutDashboard size={24} fill={activeTab === 'dashboard' ? "currentColor" : "none"} strokeWidth={activeTab === 'dashboard' ? 2 : 1.5} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Dashboard</span>
        </button>

        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-emerald-600 text-white p-4 rounded-full -translate-y-8 shadow-xl shadow-emerald-200 active:scale-90 transition-transform"
        >
          <PlusCircle size={28} />
        </button>

        <button 
          onClick={() => setActiveTab('inventory')}
          className={cn(
            "flex flex-col items-center gap-1 transition-all",
            activeTab === 'inventory' ? "text-emerald-600 scale-110" : "text-neutral-400"
          )}
        >
          <ShoppingBasket size={24} fill={activeTab === 'inventory' ? "currentColor" : "none"} strokeWidth={activeTab === 'inventory' ? 2 : 1.5} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Dapur</span>
        </button>
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
