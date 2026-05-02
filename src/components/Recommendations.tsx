import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  ChefHat, 
  Lightbulb, 
  ArrowRight,
  RefreshCw,
  Share2,
  Utensils
} from 'lucide-react';
import { FoodItem } from '../types';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../lib/utils';

// Helper to sanitize JSON response from LLM
const sanitizeJson = (text: string) => {
  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return [];
  } catch (e) {
    console.error("Failed to parse JSON from AI", e);
    return [];
  }
};

interface RecommendationsProps {
  inventory: FoodItem[];
}

export const Recommendations: React.FC<RecommendationsProps> = ({ inventory }) => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [tips, setTips] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAIRecommendations = async () => {
    if (inventory.length === 0) return;
    setIsLoading(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const ingredients = inventory.map(i => i.name).join(', ');
      
      const prompt = `Based on these ingredients in my kitchen: ${ingredients}. 
      Give me 3 simple Indonesian recipe ideas and 2 waste reduction tips.
      Format the output strictly as a JSON object with:
      "recipes": [{"name": "string", "description": "string", "difficulty": "Mudah|Sedang"}],
      "tips": ["string", "string"]`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      const data = sanitizeJson(response.text || "");
      if (data) {
        setRecipes(data.recipes || []);
        setTips(data.tips || []);
      }
    } catch (error) {
      console.error("AI Error:", error);
      // Fallback dummy data
      setRecipes([
        { name: "Nasi Goreng Sederhana", description: "Gunakan sisa nasi dan sayuran layu untuk sarapan lezat.", difficulty: "Mudah" },
        { name: "Tumis Sayur Pelangi", description: "Campur semua sisa sayuran di kulkas dengan saus tiram.", difficulty: "Mudah" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (inventory.length > 0 && recipes.length === 0) {
      fetchAIRecommendations();
    }
  }, [inventory]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      <header className="space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Rekomendasi Pintar</h2>
          <button 
            onClick={fetchAIRecommendations}
            disabled={isLoading}
            className="p-2 text-brand-600 hover:bg-brand-50 rounded-xl transition-colors disabled:opacity-30"
          >
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed translate-y-[-4px]">
          AI kami membantu mengolah bahan yang ada menjadi hidangan lezat.
        </p>
      </header>

      {/* Hero Recipe Tip */}
      <section className="bg-brand-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
         <div className="relative z-10">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-brand-800 rounded-2xl flex items-center justify-center">
                 <ChefHat size={20} className="text-brand-300" />
              </div>
              <h4 className="label-caps !text-white !opacity-100 uppercase tracking-[0.3em]">Menu Hari Ini</h4>
           </div>
           
           {isLoading ? (
             <div className="space-y-2 animate-pulse">
               <div className="h-8 bg-brand-800 rounded-lg w-3/4" />
               <div className="h-4 bg-brand-800 rounded-lg w-1/2" />
             </div>
           ) : recipes[0] ? (
             <div>
                <h3 className="text-2xl font-bold mb-2">{recipes[0].name}</h3>
                <p className="text-sm text-brand-100 mb-6 leading-relaxed opacity-80">{recipes[0].description}</p>
                <button className="bg-white text-brand-900 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-all">
                  Lihat Resep Lengkap <ArrowRight size={14} />
                </button>
             </div>
           ) : (
             <p className="text-sm italic opacity-60">Tambahkan bahan ke dapur untuk mendapatkan resep...</p>
           )}
         </div>
         <Utensils className="absolute -bottom-10 -right-10 text-brand-800/30 w-64 h-64 -rotate-12 group-hover:rotate-0 transition-all duration-1000" />
      </section>

      {/* More Recipe Ideas */}
      <section className="space-y-4">
        <h3 className="label-caps">Ide Masakan Lainnya</h3>
        <div className="grid gap-4">
          {isLoading ? (
            [1, 2].map(i => (
              <div key={i} className="geometric-card p-6 h-24 animate-pulse opacity-50" />
            ))
          ) : recipes.slice(1).map((recipe, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="geometric-card p-6 flex items-center justify-between hover:border-brand-200 cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{recipe.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{recipe.difficulty || 'Mudah'}</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sustainable Lifestyle Tips */}
      <section className="space-y-4">
        <h3 className="label-caps">Tips Minim Limbah</h3>
        <div className="space-y-4">
          {tips.map((tip, idx) => (
            <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex gap-4 items-start shadow-sm">
               <div className={cn("shrink-0 p-2 rounded-lg", idx === 0 ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600")}>
                  <Lightbulb size={18} />
               </div>
               <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
                  {tip}
               </p>
            </div>
          ))}
          
          {/* Share Tip */}
          <div className="bg-brand-50 p-8 rounded-[2.5rem] border border-brand-100 flex flex-col items-center text-center">
             <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-600 shadow-sm mb-4 animate-bounce">
                <Share2 size={24} />
             </div>
             <h4 className="font-bold text-brand-900 mb-2">Punya Bahan Berlebih?</h4>
             <p className="text-[12px] text-brand-700 leading-relaxed mb-6 opacity-80">
                Jangan biarkan membusuk. Bagikan dengan tetangga atau komunitas sekitar kamu melalui FoodWise Share.
             </p>
             <button className="text-[10px] font-black uppercase tracking-widest text-brand-800 bg-white border border-brand-200 px-8 py-3 rounded-2xl active:scale-95 transition-all">
                Bagikan Sekarang
             </button>
          </div>
        </div>
      </section>
    </div>
  );
};
