"use client";

import { useMemo } from "react"; // ✨ เพิ่ม Import เพื่อแก้ Error useMemo is not defined
import { motion } from "framer-motion";
import { 
  X, 
  ExternalLink, 
  BookOpen, 
  Layers, 
  Flame, 
  Share2, 
  Info, 
  Tag as TagIcon 
} from "lucide-react";
import { toast } from 'sonner';

interface MangaLink {
  platform: string;
  url: string;
  btnColor?: string;
}

interface RelatedStory {
  title: string;
  slug: string;
  coverUrl: string;
  status: string;
  latestChapter?: string;
  mangaType?: string;
  mangaLinks?: MangaLink[];
  genres?: string[];
}

interface MangaProps {
  manga: {
    title: string;
    englishTitle?: string;
    originalTitle?: string;
    slug: string;
    coverUrl: string;
    mangaType?: string;
    status: 'hot' | 'ongoing' | 'hiatus' | 'completed';
    latestChapter?: string;
    mangaLinks?: MangaLink[];
    novelUrl?: string;
    description?: string;
    tags?: string[];
    genres?: string[];
    relatedStories?: RelatedStory[];
    _updatedAt: string;
  };
  onClick?: () => void;
  isGlobalModal?: boolean;
  onClose?: () => void;
  onMangaSwap?: (item: any) => void;
  allManga?: any[]; 
  relativeTime?: string | null;
}

// --- 🎨 การ์ดแนะนำแบบ Yaksha Pro (โชว์ปก + ข้อมูล + ปุ่มอ่านทันที) ---
const DetailedSuggestion = ({ item, onMangaSwap, getRedirectUrl }: any) => (
  <div className="flex flex-col gap-3 p-3 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-indigo-500/10 transition-all group/item shadow-lg">
    <div className="flex gap-4 items-start">
      {/* ภาพปกพรีเมียม */}
      <div 
        onClick={() => onMangaSwap?.(item)} 
        className="relative w-20 h-28 flex-shrink-0 rounded-xl overflow-hidden cursor-pointer shadow-xl border border-white/5"
      >
        <img src={item.coverUrl} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" alt="" />
        <div className="absolute top-1.5 right-1.5 bg-red-600 text-[9px] font-black px-1.5 py-0.5 rounded shadow-lg uppercase">
          EP.{item.latestChapter || '??'}
        </div>
      </div>
      
      {/* ข้อมูลเนื้อหา */}
      <div className="flex flex-col flex-1 min-w-0 justify-center">
        <h5 
          onClick={() => onMangaSwap?.(item)} 
          className="text-[12px] font-bold text-gray-100 line-clamp-2 cursor-pointer hover:text-indigo-400 transition-colors uppercase italic mb-2 leading-tight"
        >
          {item.title}
        </h5>
        <div className="flex flex-wrap gap-1.5 mb-2">
            <span className="text-[8px] bg-white/10 text-gray-400 px-2 py-0.5 rounded-full uppercase font-black border border-white/5">
              {item.status === 'completed' ? 'จบแล้ว' : 'ปั่นอยู่'}
            </span>
            <span className="text-[8px] text-indigo-400 font-bold uppercase border border-indigo-500/20 px-2 py-0.5 rounded-full bg-indigo-500/5">
              {item.mangaType === 'r18' ? 'ADULT' : 'MANHWA'}
            </span>
        </div>
      </div>
    </div>

    {/* ปุ่มอ่านด่วนในตัวการ์ดแนะนำ (สไตล์ Yaksha) */}
    <div className="grid grid-cols-2 gap-1.5">
        {item.mangaLinks?.slice(0, 2).map((link: any) => (
            <a 
              key={link.platform} 
              href={getRedirectUrl(link.url)} 
              target="_blank" 
              style={{ backgroundColor: link.btnColor || '#333' }}
              className="py-2 rounded-xl text-[9px] font-black text-white text-center uppercase flex items-center justify-center gap-1 hover:brightness-125 transition-all shadow-md active:scale-95"
            >
              {link.platform} <ExternalLink size={10} />
            </a>
        ))}
        {!item.mangaLinks?.length && (
            <div className="col-span-2 py-2 text-center text-[9px] text-gray-600 font-black uppercase tracking-widest border border-dashed border-white/5 rounded-xl">
               No Links Available
            </div>
        )}
    </div>
  </div>
);

export default function MangaCard({ manga, onClick, isGlobalModal, onClose, onMangaSwap, allManga, relativeTime }: MangaProps) {
  
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'hot': return { label: '🔥 HOT', color: 'bg-orange-500' };
      case 'ongoing': return { label: 'ปั่นอยู่', color: 'bg-emerald-500' };
      case 'hiatus': return { label: 'พักซีซั่น', color: 'bg-amber-500' };
      case 'completed': return { label: 'จบแล้ว', color: 'bg-indigo-500' };
      default: return { label: status, color: 'bg-slate-600' };
    }
  };

  const statusInfo = getStatusConfig(manga.status);
  const getRedirectUrl = (targetUrl: string) => `/redirect?url=${encodeURIComponent(targetUrl)}`;

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/manga/${manga.slug}`;
    navigator.clipboard.writeText(url);
    toast.success("คัดลอกลิงก์สำเร็จ!", { icon: <Share2 size={16} className="text-indigo-400" /> });
  };

  // ✨ ระบบคัดเลือกเรื่องที่คล้ายกัน: คัด 4 เรื่องที่มี Genres ตรงกันมากที่สุด
  const similarStories = useMemo(() => {
    if (!allManga) return [];
    return allManga.filter((item: any) => 
      item.slug !== manga.slug && 
      item.genres?.some((g: string) => manga.genres?.includes(g))
    ).slice(0, 4);
  }, [allManga, manga.slug, manga.genres]);

  // --- 🖼️ Mode 1: การ์ดปกติบน Grid (หน้าแรก) ---
  if (!isGlobalModal) {
    return (
      <motion.div
        layout
        whileHover={{ y: -6 }}
        onClick={onClick}
        className="relative group cursor-pointer bg-[#0D0D0D] rounded-xl md:rounded-2xl overflow-hidden border border-white/5 aspect-[3/4.2] shadow-[0_10px_30px_rgba(0,0,0,0.5)] mx-0.5"
      >
        {/* BIG TAGS: ขยายใหญ่ให้อ่านง่ายสะใจ */}
        {manga.latestChapter && (
          <div className="absolute top-2.5 right-2.5 md:top-3.5 md:right-3.5 z-10 bg-indigo-600 text-[10px] md:text-[13px] font-black px-2.5 py-1.5 rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.6)] border border-white/10 uppercase tracking-widest">
            EP.{manga.latestChapter}
          </div>
        )}
        <div className={`absolute top-2.5 left-2.5 md:top-3.5 md:left-3.5 z-10 px-3 py-1.5 rounded-full text-[10px] md:text-[13px] font-black text-white ${statusInfo.color} shadow-[0_4px_15px_rgba(0,0,0,0.6)] uppercase tracking-tighter shadow-black/80`}>
          {statusInfo.label}
        </div>

        <img src={manga.coverUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" alt="" />
        
        {/* แสดงเวลาอัปเดตมุมซ้ายล่าง */}
        {relativeTime && (
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[9px] font-bold text-gray-300 border border-white/5 z-10">
            {relativeTime}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4 md:p-6">
           <span className="text-[12px] md:text-[14px] font-bold leading-tight line-clamp-2 text-white italic uppercase tracking-tighter">{manga.title}</span>
        </div>

        {manga.mangaType === 'r18' && (
          <div className="absolute bottom-2.5 right-2.5 z-10 bg-red-600/90 backdrop-blur-md text-[10px] md:text-[12px] font-black px-2 py-0.5 rounded shadow-2xl text-white border border-white/20">18+</div>
        )}
      </motion.div>
    );
  }

  // --- 🚨 Mode 2: Premium Global Modal (Yaksha x Kamimic Style) ---
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/98 backdrop-blur-xl" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-4xl bg-[#0D0D0D] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.9)] flex flex-col max-h-[96vh] z-[110]"
      >
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-6 right-6 p-2.5 bg-white/5 hover:bg-red-600 rounded-full z-[120] transition-all border border-white/10 shadow-xl active:scale-90">
          <X size={24} />
        </button>

        {/* --- SCROLLABLE CONTENT AREA --- */}
        <div className="overflow-y-auto no-scrollbar p-6 md:p-10">
          
          {/* 1. ABOVE THE FOLD: ข้อมูลสำคัญโชว์ครบหน้าแรก */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start mb-10">
            {/* ปกเรื่อง (ขนาดพอเหมาะไม่กินที่) */}
            <div className="w-48 md:w-64 flex-shrink-0 relative group/cover">
               <img src={manga.coverUrl} className="w-full aspect-[3/4.2] object-cover rounded-[2.5rem] shadow-2xl border border-white/10" alt="" />
               <div className="absolute inset-0 rounded-[2.5rem] bg-indigo-500/10 opacity-0 group-hover/cover:opacity-100 transition-opacity pointer-events-none" />
            </div>
            
            {/* รายละเอียดข้างปก */}
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-5">
               <div className="space-y-2">
                  <h2 className="text-2xl md:text-4xl font-black italic uppercase leading-none text-white tracking-tighter">{manga.title}</h2>
                  <p className="text-gray-500 text-[11px] font-bold uppercase tracking-[0.2em] opacity-60 italic">{manga.englishTitle}</p>
               </div>
               
               {/* Tags สถานะ */}
               <div className="flex flex-wrap justify-center md:justify-start gap-2.5">
                  <span className="px-5 py-2 bg-red-600 text-[11px] font-black rounded-xl uppercase shadow-lg">EP.{manga.latestChapter || '??'}</span>
                  <span className={`px-5 py-2 ${statusInfo.color} text-[11px] font-black rounded-xl uppercase shadow-lg`}>{statusInfo.label}</span>
                  <span className="px-5 py-2 bg-white/5 border border-white/10 text-[11px] font-black rounded-xl uppercase">{manga.mangaType === 'r18' ? 'Adult 18+' : 'Manhwa'}</span>
               </div>
               
               {/* หมวดหมู่ */}
               <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {manga.genres?.map((g) => <span key={g} className="text-[10px] text-gray-500 font-bold uppercase border border-white/5 px-3 py-1.5 rounded-xl hover:text-indigo-400 hover:border-indigo-500/30 transition-all cursor-default"># {g}</span>)}
               </div>

               <button onClick={handleShare} className="flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-indigo-600 rounded-2xl transition-all text-gray-400 hover:text-white text-[11px] font-black border border-white/5 shadow-xl">
                 <Share2 size={16} /> SHARE STORY
               </button>

               {/* Core Reading Buttons (Yaksha Style - ขึ้นมาอยู่ข้างบนเลย) */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-4">
                  {manga.mangaLinks?.slice(0, 3).map((link, i) => (
                    <a key={i} href={getRedirectUrl(link.url)} target="_blank" style={{ backgroundColor: link.btnColor || '#4f46e5' }} className="flex items-center justify-between px-8 py-4 rounded-2xl font-black text-[12px] uppercase shadow-2xl hover:brightness-125 transition-all text-white active:scale-95 group">
                      {link.platform} <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  ))}
                  {manga.novelUrl && (
                    <a href={getRedirectUrl(manga.novelUrl)} target="_blank" className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-2xl font-black text-[12px] uppercase flex items-center justify-center gap-3 transition-all shadow-2xl active:scale-95 text-white">
                      <BookOpen size={18} /> READ NOVEL
                    </a>
                  )}
               </div>
            </div>
          </div>

          {/* 2. SYNOPSIS SECTION */}
          <div className="bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5 mb-12 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600 opacity-40 group-hover:opacity-100 transition-opacity" />
            <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] mb-4">Synopsis / เรื่องย่อ</h4>
            <p className="text-gray-400 text-[14px] md:text-[15px] leading-relaxed italic font-medium opacity-90">
              "{manga.description || "แอดมินกำลังเดินทางข้ามมิติไปเขียนเรื่องย่อให้ครับ... รับประกันความพรีเมียมแน่นอน!"}"
            </p>
          </div>

          {/* 3. SUGGESTIONS SECTION (เลื่อนลงมาต่อจะเจอ) */}
          <div className="grid md:grid-cols-2 gap-10 border-t border-white/5 pt-12 pb-6">
            {/* รูปแบบอื่น */}
            <div className="space-y-6">
              <h4 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.4em] flex items-center gap-3 ml-2"><Info size={18} /> รูปแบบอื่น (นิยาย/มังฮวา)</h4>
              <div className="grid gap-4">
                {manga.relatedStories?.length ? manga.relatedStories.map((rel: any) => (
                  <DetailedSuggestion key={rel.slug} item={rel} onMangaSwap={onMangaSwap} getRedirectUrl={getRedirectUrl} />
                )) : <div className="py-12 text-center border border-dashed border-white/5 rounded-[2rem] text-gray-700 text-[11px] font-bold uppercase tracking-widest italic">No related versions</div>}
              </div>
            </div>

            {/* เรื่องที่คล้ายกัน (Genres Match) */}
            <div className="space-y-6">
              <h4 className="text-[11px] font-black text-green-500 uppercase tracking-[0.4em] flex items-center gap-3 ml-2"><Flame size={18} /> เรื่องที่คุณอาจจะชอบ</h4>
              <div className="grid gap-4">
                {similarStories.length ? similarStories.map((sim: any) => (
                  <DetailedSuggestion key={sim.slug} item={sim} onMangaSwap={onMangaSwap} getRedirectUrl={getRedirectUrl} />
                )) : <div className="py-12 text-center border border-dashed border-white/5 rounded-[2rem] text-gray-700 text-[11px] font-bold uppercase tracking-widest italic">No recommendations</div>}
              </div>
            </div>
          </div>

          {/* 4. FOOTER KEYWORDS */}
          <div className="border-t border-white/5 pt-10 mt-6 text-center">
             <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.5em] mb-6 flex items-center justify-center gap-3"><TagIcon size={14} /> Keywords & Tags</h4>
             <div className="flex flex-wrap justify-center gap-2.5">
                {[manga.originalTitle, ...(manga.tags || [])].filter(Boolean).map((name) => (
                  <span key={name as string} className="px-4 py-2 bg-white/[0.02] text-[10px] font-bold text-gray-600 rounded-xl border border-white/5 hover:border-indigo-500/40 hover:text-indigo-400 transition-all cursor-default">#{name as string}</span>
                ))}
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

