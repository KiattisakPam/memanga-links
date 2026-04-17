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
  showTime?: boolean; // เปิด/ปิด การโชว์เวลาอัปเดต
  getRelativeTime?: (date: string) => string; // ฟังก์ชันคำนวณเวลา
}

export default function MangaRow({ 
  title, 
  icon, 
  items, 
  onCardClick, 
  onViewAll, 
  gridCols,
  showTime,
  getRelativeTime 
}: MangaRowProps) {
  if (!items || items.length === 0) return null;

  // ✨ จำกัด 10 เรื่องต่อแถว เพื่อความคลีนและประสิทธิภาพ
  const displayItems = items.slice(0, 10);

  // ✨ ปรับความกว้างการ์ดให้ต่างกันชัดเจนตาม Level ของ Resizer (Sync กับหน้าหลัก)
  const getDynamicWidth = () => {
    switch (gridCols) {
      case 1: return "w-[185px] sm:w-[220px] md:w-[245px]"; // Level 1: ใหญ่สะใจ
      case 2: return "w-[155px] sm:w-[190px] md:w-[215px]"; // Level 2: มาตรฐาน
      case 3: return "w-[135px] sm:w-[155px] md:w-[180px]"; // Level 3: จิ๋วประหยัดพื้นที่ (Kamimic Style)
      default: return "w-[155px]";
    }
  };

  return (
    <div className="w-full mb-8 md:mb-12 group/row relative px-2">
      {/* --- 🏷️ Header แถว (Premium Indigo Style) --- */}
      <div className="flex items-center justify-between mb-4 px-1 md:px-2">
        <div className="flex items-center gap-3">
          {/* Icon Box with Glow */}
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.1)] group-hover/row:border-indigo-500/40 transition-all duration-500">
            {icon && <span className="scale-90 inline-block">{icon}</span>}
          </div>
          
          <div className="flex flex-col">
            <h2 className="text-base md:text-xl font-black uppercase tracking-tight italic text-white/90 leading-none">
              {title}
            </h2>
            {/* เส้นใต้แบบ Animated Glow */}
            <div className="h-[1.5px] w-8 bg-indigo-500 mt-1.5 rounded-full opacity-40 group-hover/row:w-full transition-all duration-700 ease-in-out" />
          </div>
        </div>
        
        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-all group/btn"
          >
            <span className="border-b border-transparent group-hover/btn:border-indigo-500 transition-all pb-0.5">
              VIEW ALL
            </span>
            <ChevronRight size={14} className="group-hover/btn:translate-x-1.5 transition-transform text-indigo-500" />
          </button>
        )}
      </div>

      {/* --- 🖼️ รายการมังฮวา (Horizontal Scroll แบบขอบจาง) --- */}
      <div className="relative group/scroll">
        {/* Edge Fade Effect: ทำให้ขอบขวาดูนุ่มนวลเวลาเลื่อน */}
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050505] via-[#050505]/20 to-transparent z-10 pointer-events-none hidden md:block opacity-0 group-hover/scroll:opacity-100 transition-opacity duration-500" />
        
        <div 
          className="flex gap-2.5 md:gap-4 overflow-x-auto pb-6 no-scrollbar snap-x scroll-px-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayItems.map((manga, index) => (
            <motion.div 
              key={manga.slug}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.4,
                delay: index * 0.03,
                ease: [0.22, 1, 0.36, 1]
              }}
              className={`${getDynamicWidth()} flex-shrink-0 snap-start transition-all duration-500`}
            >
              <MangaCard 
                manga={manga} 
                onClick={() => onCardClick(manga)} 
                // ✨ ส่งต่อเวลาอัปเดตไปที่การ์ด
                relativeTime={showTime && getRelativeTime ? getRelativeTime(manga._updatedAt) : null}
              />
            </motion.div>
          ))}
          
          {/* ช่องว่างท้ายแถวเพื่อให้เลื่อนสุดแล้วไม่ติดขอบหน้าจอ */}
          <div className="w-10 flex-shrink-0" />
        </div>
      </div>

      {/* CSS Global สำหรับซ่อน Scrollbar */}
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

