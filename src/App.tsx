/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  ShoppingBasket, 
  Plus, 
  Sparkles, 
  Leaf, 
  User,
  UtensilsCrossed,
  Trash2
} from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { AddFoodModal } from './components/AddFoodModal';
import { Recommendations } from './components/Recommendations';
import { EnvironmentalImpactView } from './components/EnvironmentalImpactView';
import { Profile } from './components/Profile';
import { AddActivityModal } from './components/AddActivityModal';
import { FoodItem, WasteEntry } from './types';
import { Storage } from './lib/storage';
import { cn } from './lib/utils';

type Tab = 'dashboard' | 'inventory' | 'recommendations' | 'impact' | 'profile';

export default function App() {
  const [inventory, setInventory] = useState<FoodItem[]>([]);
  const [log, setLog] = useState<WasteEntry[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [activityType, setActivityType] = useState<'eaten' | 'thrown'>('eaten');
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'warning' } | null>(null);

  // Load initial data
  useEffect(() => {
    const savedInventory = Storage.getInventory();
    const savedLog = Storage.getLog();
    
    // Seed dummy data if empty for competition presentation
    if (savedInventory.length === 0 && savedLog.length === 0) {
      const dummyInventory: FoodItem[] = [
        { id: '1', name: 'Bayam Organik', quantity: 200, unit: 'g', expiryDate: new Date(Date.now() + 86400000).toISOString(), addedAt: new Date().toISOString() },
        { id: '2', name: 'Susu UHT', quantity: 1, unit: 'unit', expiryDate: new Date(Date.now() + 259200000).toISOString(), addedAt: new Date().toISOString() },
        { id: '3', name: 'Daging Sapi', quantity: 500, unit: 'g', expiryDate: new Date(Date.now() + 172800000).toISOString(), addedAt: new Date().toISOString() },
      ];
      
      const now = new Date();
      const dummyLog: WasteEntry[] = Array.from({ length: 15 }, (_, i) => ({
        id: `l${i}`,
        name: ['Nasi', 'Tempe', 'Sayur Sop', 'Ayam Goreng'][i % 4],
        quantity: Math.floor(Math.random() * 200) + 50,
        unit: 'g',
        status: Math.random() > 0.3 ? 'eaten' : 'thrown',
        date: new Date(now.getTime() - (i * 12 * 60 * 60 * 1000)).toISOString()
      }));

      setInventory(dummyInventory);
      setLog(dummyLog);
      Storage.setInventory(dummyInventory);
      dummyLog.forEach(l => Storage.addLogEntry(l));
    } else {
      setInventory(savedInventory);
      setLog(savedLog);
    }
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
    showFeedback("Bahan berhasil ditambahkan ke dapur!", "success");
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

    if (status === 'eaten') {
      showFeedback("Mantap! Kamu memakan makananmu daripada membuangnya.", "success");
    } else {
      showFeedback("Sangat disayangkan, lain kali coba beli secukupnya ya.", "warning");
    }
  };

  const handleLogActivity = (entryData: Omit<WasteEntry, 'id' | 'date'>) => {
    const entry: WasteEntry = {
      ...entryData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString()
    };

    const newLog = [entry, ...log];
    setLog(newLog);
    Storage.addLogEntry(entry);

    // If matches inventory (fuzzy match name), reduce quantity
    const existingItemIdx = inventory.findIndex(i => i.name.toLowerCase() === entry.name.toLowerCase());
    if (existingItemIdx > -1) {
      const updatedInventory = [...inventory];
      const item = { ...updatedInventory[existingItemIdx] };
      item.quantity = Math.max(0, item.quantity - entry.quantity);
      if (item.quantity === 0) {
        updatedInventory.splice(existingItemIdx, 1);
      } else {
        updatedInventory[existingItemIdx] = item;
      }
      setInventory(updatedInventory);
      Storage.setInventory(updatedInventory);
    }

    if (entry.status === 'eaten') {
      showFeedback("Aktivitas makan dicatat! Skor kamu meningkat.", "success");
    } else {
      showFeedback("Aktivitas limbah dicatat. Ayo kurangi ke depannya!", "warning");
    }
  };

  const showFeedback = (message: string, type: 'success' | 'warning') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const score = useMemo(() => {
    const total = log.length;
    if (total === 0) return 100;
    const eaten = log.filter(l => l.status === 'eaten').length;
    return Math.round((eaten / total) * 100);
  }, [log]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard log={log} inventory={inventory} score={score} onNavigate={setActiveTab} />;
      case 'inventory':
        return <Inventory items={inventory} onAction={handleAction} onAdd={() => setIsAddModalOpen(true)} />;
      case 'recommendations':
        return <Recommendations inventory={inventory} />;
      case 'impact':
        return <EnvironmentalImpactView log={log} />;
      case 'profile':
        return <Profile log={log} score={score} />;
      default:
        return <Dashboard log={log} inventory={inventory} score={score} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col max-w-lg mx-auto shadow-2xl relative overflow-hidden">
      {/* Header */}
      <header className="px-8 pt-8 pb-4 sticky top-0 bg-[#f8faf9]/80 backdrop-blur-md z-30 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-100">
             <Leaf className="text-white" size={16} />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">FoodWise</h1>
        </div>
        <button 
          onClick={() => setActiveTab('profile')}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all",
            activeTab === 'profile' ? "bg-brand-100 text-brand-700 shadow-inner" : "bg-white text-slate-400 shadow-sm border border-slate-100"
          )}
        >
          <User size={20} />
        </button>
      </header>

      {/* Feedback Toast */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-0 left-0 right-0 z-[100] p-4 flex justify-center pointer-events-none"
          >
            <div className={cn(
              "w-full max-w-md px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-4 border text-sm font-bold tracking-tight pointer-events-auto",
              feedback.type === 'success' ? "bg-emerald-600 border-emerald-500 text-white" : "bg-rose-600 border-rose-500 text-white"
            )}>
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                <Sparkles size={20} />
              </div>
              <p className="flex-1 leading-tight">{feedback.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 px-6 overflow-y-auto custom-scrollbar pb-32">

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* FAB and Action Buttons */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
        <AnimatePresence>
          {isFabOpen && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-4">
               <motion.button
                 initial={{ opacity: 0, scale: 0.5, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.5, y: 20 }}
                 onClick={() => {
                   setIsAddModalOpen(true);
                   setIsFabOpen(false);
                 }}
                 className="w-14 h-14 bg-white rounded-full shadow-xl border border-emerald-50 flex flex-col items-center justify-center text-brand-600"
               >
                 <Plus size={20} />
                 <span className="text-[10px] font-bold uppercase">Stok Baru</span>
               </motion.button>
               <motion.button
                 initial={{ opacity: 0, scale: 0.5, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.5, y: 20 }}
                 onClick={() => {
                   setActivityType('eaten');
                   setIsActivityModalOpen(true);
                   setIsFabOpen(false);
                 }}
                 className="w-14 h-14 bg-brand-600 rounded-full shadow-xl flex flex-col items-center justify-center text-white"
               >
                 <UtensilsCrossed size={20} />
                 <span className="text-[10px] font-bold uppercase">Makan</span>
               </motion.button>
               <motion.button
                 initial={{ opacity: 0, scale: 0.5, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.5, y: 20 }}
                 onClick={() => {
                   setActivityType('thrown');
                   setIsActivityModalOpen(true);
                   setIsFabOpen(false);
                 }}
                 className="w-14 h-14 bg-rose-500 rounded-full shadow-xl flex flex-col items-center justify-center text-white"
               >
                 <Trash2 size={20} />
                 <span className="text-[10px] font-bold uppercase">Buang</span>
               </motion.button>
            </div>
          )}
        </AnimatePresence>
        
        <button 
          onClick={() => setIsFabOpen(!isFabOpen)}
          className={cn(
            "w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 active:scale-90",
            isFabOpen ? "bg-slate-800 text-white rotate-45" : "bg-brand-600 text-white"
          )}
        >
          <Plus size={32} />
        </button>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg frosted-nav h-20 px-8 flex justify-between items-center z-40">
        <NavButton 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
          icon={<LayoutDashboard size={22} />} 
          label="Utama" 
        />
        <NavButton 
          active={activeTab === 'inventory'} 
          onClick={() => setActiveTab('inventory')} 
          icon={<ShoppingBasket size={22} />} 
          label="Dapur" 
        />
        
        <div className="w-16" /> {/* Space for FAB */}
        
        <NavButton 
          active={activeTab === 'recommendations'} 
          onClick={() => setActiveTab('recommendations')} 
          icon={<Sparkles size={22} />} 
          label="Saran" 
        />
        <NavButton 
          active={activeTab === 'impact'} 
          onClick={() => setActiveTab('impact')} 
          icon={<Leaf size={22} />} 
          label="Dampak" 
        />
      </nav>

      {/* Modals */}
      <AddFoodModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddItem} 
      />

      <AddActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onLog={handleLogActivity}
        initialType={activityType}
      />

      {/* Background Decor */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-1/2 bg-gradient-to-b from-brand-50/30 to-transparent -z-10 pointer-events-none" />
    </div>
  );
}

function NavButton({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 transition-all",
        active ? "text-brand-700" : "text-slate-300"
      )}
    >
      <div className={cn(
        "p-1 rounded-xl transition-all",
        active && "bg-brand-50"
      )}>
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
    </button>
  );
}
