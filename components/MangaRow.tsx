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
  gridCols: number; // รับค่า (1, 2, 3) จาก Resizer
}

export default function MangaRow({ title, icon, items, onCardClick, onViewAll, gridCols }: MangaRowProps) {
  if (!items || items.length === 0) return null;

  // ✨ จำกัด 10 เรื่องต่อแถว เพื่อความคลีนและประสิทธิภาพ
  const displayItems = items.slice(0, 10);

  // ✨ ปรับความกว้างการ์ดให้ต่างกันชัดเจนตาม Level ของ Resizer
  const getDynamicWidth = () => {
    switch (gridCols) {
      case 1: return "w-[195px] sm:w-[230px] md:w-[260px]"; // Level 1: ใหญ่สะใจ
      case 2: return "w-[155px] sm:w-[185px] md:w-[210px]"; // Level 2: มาตรฐาน
      case 3: return "w-[130px] sm:w-[150px] md:w-[175px]"; // Level 3: จิ๋วประหยัดพื้นที่ (Kamimic Style)
      default: return "w-[155px]";
    }
  };

  return (
    <div className="w-full mb-6 md:mb-10 group/row relative">
      {/* --- 🏷️ Header แถว (Premium Branding) --- */}
      <div className="flex items-center justify-between mb-3 px-1 md:px-2">
        <div className="flex items-center gap-3">
          {/* Icon Box with Premium Glow */}
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.1)] group-hover/row:border-indigo-500/40 transition-all duration-500">
            {icon && <span className="scale-90 inline-block">{icon}</span>}
          </div>
          
          <div className="flex flex-col">
            <h2 className="text-sm md:text-xl font-black uppercase tracking-tight italic text-white/90 leading-none">
              {title}
            </h2>
            {/* เส้นใต้แบบ Animated: สั้นไปยาวเมื่อ Hover ทั้งแถว */}
            <div className="h-[1.5px] w-6 bg-indigo-500 mt-1.5 rounded-full opacity-40 group-hover/row:w-full transition-all duration-700 ease-in-out" />
          </div>
        </div>
        
        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-all group/btn"
          >
            <span className="border-b border-transparent group-hover/btn:border-indigo-500 transition-all pb-0.5">
              VIEW ALL
            </span>
            <ChevronRight size={12} className="group-hover/btn:translate-x-1.5 transition-transform text-indigo-500" />
          </button>
        )}
      </div>

      {/* --- 🖼️ รายการมังฮวา (Horizontal Scroll แบบชิด) --- */}
      <div className="relative group/scroll">
        {/* Edge Fade Effect: ทำให้ขอบจางนุ่มนวลขึ้น */}
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050505] via-[#050505]/30 to-transparent z-10 pointer-events-none hidden md:block opacity-0 group-hover/scroll:opacity-100 transition-opacity duration-500" />
        
        <div 
          className="flex gap-2 md:gap-3 overflow-x-auto pb-4 no-scrollbar snap-x scroll-px-1 md:scroll-px-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayItems.map((manga, index) => (
            <motion.div 
              key={manga.slug}
              initial={{ opacity: 0, x: 15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.4,
                delay: index * 0.02,
                ease: [0.22, 1, 0.36, 1]
              }}
              className={`${getDynamicWidth()} flex-shrink-0 snap-start transition-all duration-500`}
            >
              <MangaCard 
                manga={manga} 
                onClick={() => onCardClick(manga)} 
              />
            </motion.div>
          ))}
          
          {/* ช่องว่างท้ายแถวเพื่อให้เลื่อนสุดแล้วสวย */}
          <div className="w-8 flex-shrink-0" />
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

