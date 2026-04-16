"use client";

import { motion } from "framer-motion";
import MangaCard from "./MangaCard";
import { ChevronRight } from "lucide-react";

interface MangaRowProps {
  title: string;
  icon: any;
  items: any[];
  onCardClick: (manga: any) => void;
  onViewAll?: () => void;
  gridCols: number;
}

export default function MangaRow({ title, icon, items, onCardClick, onViewAll, gridCols }: MangaRowProps) {
  if (!items || items.length === 0) return null;

  // ✨ จำกัดการโชว์ 10 เรื่องเพื่อให้โหลดไวและแถวไม่ยาวเกินไป
  const displayItems = items.slice(0, 10);

  // ✨ ปรับความกว้างการ์ดให้ "เล็กและกระชับ" ขึ้นตาม Master Resizer
  const dynamicWidth = {
    4: "w-[160px] sm:w-[190px] md:w-[210px]",
    5: "w-[140px] sm:w-[165px] md:w-[185px]",
    6: "w-[120px] sm:w-[140px] md:w-[160px]",
  }[gridCols as 4 | 5 | 6] || "w-[160px]";

  return (
    <div className="w-full mb-10 md:mb-14 group/row relative">
      {/* --- 🏷️ Header แถว (ปรับให้เล็กลงและชิดขึ้น) --- */}
      <div className="flex items-center justify-between mb-3.5 px-1">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-500 shadow-sm group-hover/row:border-indigo-500/40 transition-all">
            {icon && <span className="scale-75 inline-block">{icon}</span>}
          </div>
          
          <div className="flex flex-col">
            <h2 className="text-sm md:text-lg font-black uppercase tracking-tight italic text-white/90">
              {title}
            </h2>
            {/* เส้นใต้แบบบางพิเศษ */}
            <div className="h-[1px] w-4 bg-indigo-500 mt-0.5 rounded-full opacity-40 group-hover/row:w-full transition-all duration-500" />
          </div>
        </div>
        
        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-all group/btn"
          >
            <span className="border-b border-transparent group-hover/btn:border-indigo-500 transition-all pb-0.5">
              VIEW ALL
            </span>
            <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform text-indigo-500" />
          </button>
        )}
      </div>

      {/* --- 🖼️ รายการมังฮวา (Scroll แนวนอนแบบกระชับ) --- */}
      <div className="relative group/scroll">
        {/* Edge Fade Effect */}
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none hidden md:block opacity-0 group-hover/scroll:opacity-100 transition-opacity duration-300" />
        
        <div 
          className="flex gap-2.5 md:gap-3.5 overflow-x-auto pb-4 no-scrollbar snap-x scroll-px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayItems.map((manga, index) => (
            <motion.div 
              key={manga.slug}
              initial={{ opacity: 0, x: 15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.3,
                delay: index * 0.02,
              }}
              className={`${dynamicWidth} flex-shrink-0 snap-start transition-all duration-500`}
            >
              <MangaCard 
                manga={manga} 
                onClick={() => onCardClick(manga)} 
              />
            </motion.div>
          ))}
          
          {/* ช่องว่างท้ายแถว */}
          <div className="w-6 flex-shrink-0" />
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

