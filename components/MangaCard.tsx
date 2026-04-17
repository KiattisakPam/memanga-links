"use client";

import { useMemo } from "react";
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

// --- 🎨 การ์ดแนะนำแบบ Yaksha Style (กดได้ทั้งใบ ยกเว้นปุ่มอ่าน) ---
const DetailedSuggestion = ({ item, onMangaSwap, getRedirectUrl }: any) => (
  <div 
    onClick={() => onMangaSwap?.(item)} // ✨ กดตรงไหนก็ได้ใน Card เพื่อเปลี่ยนเรื่อง
    className="cursor-pointer flex flex-col gap-3 p-3 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-indigo-500/10 transition-all group/item shadow-lg"
  >
    <div className="flex gap-3 items-start">
      <div className="relative w-16 h-24 md:w-20 md:h-28 flex-shrink-0 rounded-xl overflow-hidden shadow-xl border border-white/5">
        <img src={item.coverUrl} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" alt="" />
        <div className="absolute top-1 right-1 bg-red-600 text-[8px] font-black px-1.5 py-0.5 rounded shadow-lg uppercase">
          EP.{item.latestChapter || '??'}
        </div>
      </div>
      
      <div className="flex flex-col flex-1 min-w-0 justify-center">
        <h5 className="text-[11px] sm:text-[12px] font-bold text-gray-100 line-clamp-2 uppercase italic mb-1 leading-tight group-hover/item:text-indigo-400 transition-colors">
          {item.title}
        </h5>
        <div className="flex flex-wrap gap-1">
            <span className="text-[7px] sm:text-[8px] bg-white/10 text-gray-400 px-1.5 py-0.5 rounded-full font-black uppercase">
              {item.status === 'completed' ? 'จบแล้ว' : 'ปั่นอยู่'}
            </span>
            <span className="text-[7px] sm:text-[8px] text-indigo-400 font-bold uppercase border border-indigo-500/20 px-1.5 py-0.5 rounded-full">
              {item.mangaType === 'r18' ? '18+' : 'MANHWA'}
            </span>
        </div>
      </div>
    </div>

    {/* ปุ่มอ่าน (แยกคลิกด้วย e.stopPropagation) */}
    <div className="grid grid-cols-2 gap-1.5" onClick={(e) => e.stopPropagation()}>
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
    </div>
  </div>
);

export default function MangaCard({ manga, onClick, isGlobalModal, onClose, onMangaSwap, allManga, relativeTime }: MangaProps) {
  
  const statusColors: any = { hot: 'bg-orange-500', ongoing: 'bg-emerald-500', hiatus: 'bg-amber-500', completed: 'bg-indigo-500' };
  const getRedirectUrl = (targetUrl: string) => `/redirect?url=${encodeURIComponent(targetUrl)}`;

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/manga/${manga.slug}`);
    toast.success("คัดลอกลิงก์สำเร็จ!");
  };

  const similarStories = useMemo(() => {
    if (!allManga) return [];
    return allManga.filter((item: any) => 
      item.slug !== manga.slug && 
      item.genres?.some((g: string) => manga.genres?.includes(g))
    ).slice(0, 4);
  }, [allManga, manga.slug, manga.genres]);

  if (!isGlobalModal) {
    return (
      <motion.div layout whileHover={{ y: -6 }} onClick={onClick} className="relative group cursor-pointer bg-[#0D0D0D] rounded-xl md:rounded-2xl overflow-hidden border border-white/5 aspect-[3/4.2] shadow-2xl mx-0.5">
        <div className="absolute top-2.5 right-2.5 z-10 bg-indigo-600 text-[10px] md:text-[12px] font-black px-2.5 py-1.5 rounded-lg shadow-xl border border-white/10 uppercase tracking-widest">EP.{manga.latestChapter}</div>
        <div className={`absolute top-2.5 left-2.5 z-10 px-3 py-1.5 rounded-full text-[10px] md:text-[12px] font-black text-white ${statusColors[manga.status] || 'bg-gray-500'} shadow-xl uppercase tracking-tighter shadow-black/80`}>{manga.status === 'completed' ? 'จบแล้ว' : 'ปั่นอยู่'}</div>
        <img src={manga.coverUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
        {relativeTime && <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[9px] font-bold text-gray-300 border border-white/5 z-10">{relativeTime}</div>}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4"><span className="text-[12px] md:text-[14px] font-bold leading-tight line-clamp-2 text-white italic uppercase tracking-tighter">{manga.title}</span></div>
        {manga.mangaType === 'r18' && <div className="absolute bottom-2.5 right-2.5 z-10 bg-red-600 text-[10px] md:text-[11px] font-black px-2 py-0.5 rounded shadow-xl text-white">18+</div>}
      </motion.div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/98 backdrop-blur-xl" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-4xl bg-[#0D0D0D] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl z-[110] flex flex-col max-h-[94vh]"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2.5 bg-white/5 hover:bg-red-600 rounded-full z-[120] transition-all border border-white/10 active:scale-90 shadow-xl"><X size={24} /></button>

        <div className="overflow-y-auto custom-vertical-scrollbar p-5 md:p-10 space-y-8">
          
          {/* 1. HEADER SECTION (Side-by-Side Always) */}
          <div className="flex flex-row gap-4 md:gap-10 items-start">
            <div className="w-28 sm:w-44 md:w-64 flex-shrink-0 relative group/cover">
               <img src={manga.coverUrl} className="w-full aspect-[3/4.2] object-cover rounded-2xl md:rounded-[2.5rem] shadow-2xl border border-white/10" alt="" />
            </div>
            
            <div className="flex-1 flex flex-col items-start text-left pt-1 sm:pt-3 min-w-0">
               <div className="space-y-1 mb-3">
                  <h2 className="text-base sm:text-2xl md:text-4xl font-black italic uppercase leading-none text-white tracking-tighter truncate w-full">{manga.title}</h2>
                  <p className="text-gray-500 text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.2em] opacity-60 italic">{manga.englishTitle}</p>
               </div>
               
               <div className="flex flex-wrap gap-1.5 sm:gap-2.5 mb-3">
                  <span className="px-2.5 py-1 sm:px-5 sm:py-2 bg-red-600 text-[8px] sm:text-[11px] font-black rounded-lg sm:rounded-xl uppercase shadow-lg">EP.{manga.latestChapter || '??'}</span>
                  <span className={`px-2.5 py-1 sm:px-5 sm:py-2 ${statusColors[manga.status]} text-[8px] sm:text-[11px] font-black rounded-lg sm:rounded-xl uppercase shadow-lg`}>{statusColors[manga.status] ? (manga.status === 'ongoing' ? 'ปั่นอยู่' : 'จบแล้ว') : manga.status}</span>
                  <span className="px-2.5 py-1 sm:px-5 sm:py-2 bg-white/5 border border-white/10 text-[8px] sm:text-[11px] font-black rounded-lg sm:rounded-xl uppercase">{manga.mangaType === 'r18' ? '18+' : 'Manhwa'}</span>
               </div>
               
               <div className="flex flex-wrap gap-1.5 mb-4">
                  {manga.genres?.slice(0, 5).map((g) => (
                    <span key={g} className="text-[8px] sm:text-[10px] text-gray-400 font-bold uppercase border border-white/5 px-2.5 py-1 rounded-lg hover:text-indigo-400 transition-all cursor-default"># {g}</span>
                  ))}
               </div>

               {/* ✨ SYNOPSIS: ถมที่ว่างข้างปกในหน้าจอคอม ✨ */}
               <div className="hidden md:block mb-5 w-full">
                  <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-2">Synopsis</h4>
                  <p className="text-gray-400 text-[13px] leading-relaxed italic font-medium opacity-90 line-clamp-6">
                    "{manga.description || "แอดมินกำลังเดินทางข้ามมิติไปเขียนเรื่องย่อให้ครับ..."}"
                  </p>
               </div>

               <button onClick={handleShare} className="flex items-center gap-2 px-4 py-1.5 sm:px-6 sm:py-2.5 bg-white/5 hover:bg-indigo-600 rounded-xl sm:rounded-2xl transition-all text-gray-400 hover:text-white text-[9px] sm:text-[11px] font-black border border-white/5">
                 <Share2 size={14} /> SHARE STORY
               </button>
            </div>
          </div>

          {/* ✨ SYNOPSIS: อยู่ข้างล่างแบบที่แอดมินชอบ (สำหรับมือถือและเป็นส่วนหลักด้านล่าง) ✨ */}
          <div className="bg-white/[0.02] p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600 opacity-40 group-hover:opacity-100 transition-opacity" />
            <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4">Synopsis / เรื่องย่อ</h4>
            <p className="text-gray-400 text-[13px] md:text-[15px] leading-relaxed italic font-medium opacity-90">
              "{manga.description || "แอดมินกำลังเดินทางข้ามมิติไปเขียนเรื่องย่อให้ครับ..."}"
            </p>
          </div>

          {/* 2. READING CHANNEL SECTION (ปรับปุ่มให้พรีเมียม เล็กลง) */}
          <div className="space-y-4">
             <h4 className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                <ExternalLink size={14} className="text-red-500" /> เลือกช่องทางการอ่าน
             </h4>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {manga.mangaLinks?.slice(0, 3).map((link, i) => (
                  <a key={i} href={getRedirectUrl(link.url)} target="_blank" style={{ backgroundColor: link.btnColor || '#4f46e5' }} className="flex items-center justify-between px-8 py-3.5 rounded-2xl font-black text-[12px] uppercase shadow-2xl hover:brightness-125 transition-all text-white active:scale-95 group">
                    {link.platform} <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                ))}
                {manga.novelUrl && (
                  <a href={getRedirectUrl(manga.novelUrl)} target="_blank" className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-2xl font-black text-[12px] uppercase flex items-center justify-center gap-3 transition-all shadow-2xl active:scale-95 text-white">
                    <BookOpen size={18} /> READ NOVEL
                  </a>
                )}
             </div>
          </div>

          {/* 3. LOWER SECTION: Suggestions */}
          <div className="grid md:grid-cols-2 gap-10 border-t border-white/5 pt-12 pb-6">
            <div className="space-y-6">
              <h4 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.4em] flex items-center gap-3 ml-2"><Info size={18} /> รูปแบบอื่น</h4>
              <div className="grid grid-cols-1 gap-4">
                {manga.relatedStories?.length ? manga.relatedStories.map((rel: any) => (
                  <DetailedSuggestion key={rel.slug} item={rel} onMangaSwap={onMangaSwap} getRedirectUrl={getRedirectUrl} />
                )) : <div className="py-12 text-center border border-dashed border-white/5 rounded-[2rem] text-gray-700 text-[11px] font-bold uppercase italic">No related versions</div>}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[11px] font-black text-green-500 uppercase tracking-[0.4em] flex items-center gap-3 ml-2"><Flame size={18} /> เรื่องที่คุณอาจจะชอบ</h4>
              <div className="grid grid-cols-1 gap-4">
                {similarStories.length ? similarStories.map((sim: any) => (
                  <DetailedSuggestion key={sim.slug} item={sim} onMangaSwap={onMangaSwap} getRedirectUrl={getRedirectUrl} />
                )) : <div className="py-12 text-center border border-dashed border-white/5 rounded-[2rem] text-gray-700 text-[11px] font-bold uppercase italic">No recommendations</div>}
              </div>
            </div>
          </div>

          {/* 4. FOOTER TAGS */}
          <div className="border-t border-white/5 pt-10 mt-6 text-center pb-10">
             <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.5em] mb-6 flex items-center justify-center gap-3"><TagIcon size={14} /> Keywords</h4>
             <div className="flex flex-wrap justify-center gap-2.5">
                {[manga.originalTitle, ...(manga.tags || [])].filter(Boolean).map((name) => (
                  <span key={name as string} className="px-4 py-2 bg-white/[0.02] text-[10px] font-bold text-gray-600 rounded-xl border border-white/5 hover:border-indigo-500/40 hover:text-indigo-400 transition-all cursor-default">#{name as string}</span>
                ))}
             </div>
          </div>
        </div>

        <style jsx global>{`
          .custom-vertical-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-vertical-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-vertical-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.08); border-radius: 20px; }
          .custom-vertical-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.4); }
        `}</style>
      </motion.div>
    </div>
  );
}

