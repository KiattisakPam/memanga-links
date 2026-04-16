"use client";

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
  };
  onClick?: () => void;
  isGlobalModal?: boolean;
  onClose?: () => void;
  onMangaSwap?: (item: any) => void;
  allManga?: any[]; 
}

// --- 📚 การ์ดแนะนำแบบ Yaksha (Detailed & Functional) ---
const DetailedSuggestion = ({ item, onMangaSwap, getRedirectUrl }: any) => (
  <div className="flex flex-col gap-3 p-3 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-indigo-500/10 transition-all group/item shadow-lg">
    <div className="flex gap-3 items-start">
      <div 
        onClick={() => onMangaSwap?.(item)} 
        className="relative w-16 h-24 md:w-20 md:h-28 flex-shrink-0 rounded-xl overflow-hidden cursor-pointer shadow-xl"
      >
        <img src={item.coverUrl} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" alt="" />
        <div className="absolute top-1 right-1 bg-red-600 text-[8px] font-black px-1.5 py-0.5 rounded shadow-lg uppercase">
          EP.{item.latestChapter || '??'}
        </div>
      </div>
      
      <div className="flex flex-col flex-1 min-w-0">
        <h5 
          onClick={() => onMangaSwap?.(item)} 
          className="text-[11px] font-bold text-gray-100 line-clamp-2 cursor-pointer hover:text-indigo-400 transition-colors uppercase italic mb-1"
        >
          {item.title}
        </h5>
        <div className="flex flex-wrap gap-1 mb-2">
            <span className="text-[7px] bg-white/10 text-gray-400 px-1.5 py-0.5 rounded-full uppercase font-black">
              {item.status === 'completed' ? 'จบแล้ว' : 'ปั่นอยู่'}
            </span>
            <span className="text-[7px] text-indigo-400 font-bold uppercase border border-indigo-500/20 px-1.5 py-0.5 rounded-full">
              {item.mangaType === 'r18' ? 'ADULT' : 'MANHWA'}
            </span>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-1.5">
        {item.mangaLinks?.slice(0, 2).map((link: any) => (
            <a 
              key={link.platform} 
              href={getRedirectUrl(link.url)} 
              target="_blank" 
              style={{ backgroundColor: link.btnColor || '#333' }}
              className="py-2 rounded-lg text-[8px] font-black text-white text-center uppercase flex items-center justify-center gap-1 hover:brightness-125 transition-all shadow-md"
            >
              {link.platform} <ExternalLink size={8} />
            </a>
        ))}
    </div>
  </div>
);

export default function MangaCard({ manga, onClick, isGlobalModal, onClose, onMangaSwap, allManga }: MangaProps) {
  
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

  const similarStories = allManga?.filter((item: any) => 
    item.slug !== manga.slug && 
    item.genres?.some((g: string) => manga.genres?.includes(g))
  ).slice(0, 4) || [];

  // --- 🖼️ Mode 1: การ์ดปกติบน Grid ---
  if (!isGlobalModal) {
    return (
      <motion.div
        layout
        whileHover={{ y: -6 }}
        onClick={onClick}
        className="relative group cursor-pointer bg-[#0D0D0D] rounded-xl md:rounded-2xl overflow-hidden border border-white/5 aspect-[3/4.2] shadow-2xl mx-0.5"
      >
        {/* Big Tags */}
        {manga.latestChapter && (
          <div className="absolute top-2 right-2 md:top-3 md:right-3 z-10 bg-indigo-600 text-[10px] md:text-[11px] font-black px-2.5 py-1 rounded-lg shadow-xl uppercase tracking-widest border border-white/10">
            EP.{manga.latestChapter}
          </div>
        )}
        <div className={`absolute top-2 left-2 md:top-3 md:left-3 z-10 px-3 py-1 rounded-full text-[10px] md:text-[11px] font-black text-white ${statusInfo.color} shadow-xl uppercase tracking-tighter`}>
          {statusInfo.label}
        </div>

        <img src={manga.coverUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" alt="" />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
           <span className="text-[11px] font-bold leading-tight line-clamp-2 text-white italic">{manga.title}</span>
        </div>

        {manga.mangaType === 'r18' && (
          <div className="absolute bottom-2.5 right-2.5 z-10 bg-red-600/90 text-[10px] font-black px-2 py-0.5 rounded shadow-xl text-white">18+</div>
        )}
      </motion.div>
    );
  }

  // --- 🚨 Mode 2: Yaksha Style Scrollable Modal ---
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="relative w-full max-w-2xl bg-[#0D0D0D] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl z-[110] flex flex-col max-h-[94vh]"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-red-600 rounded-full z-[120] transition-all border border-white/10"><X size={20} /></button>

        {/* --- Single Scroll Container: ปกและข้อมูลอยู่ด้วยกัน --- */}
        <div className="overflow-y-auto no-scrollbar p-6 md:p-10">
          
          {/* Header Section: ปก + ชื่อ + แท็ก */}
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left mb-8">
            <img src={manga.coverUrl} className="w-48 md:w-56 aspect-[3/4.2] object-cover rounded-[2rem] shadow-2xl border border-white/10" alt="" />
            <div className="flex-1 space-y-4">
               <h2 className="text-2xl md:text-3xl font-black italic uppercase leading-tight text-white">{manga.title}</h2>
               <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] opacity-60 italic">{manga.englishTitle}</p>
               
               <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  <span className="px-4 py-1.5 bg-red-600 text-[10px] font-black rounded-xl uppercase">EP.{manga.latestChapter || '??'}</span>
                  <span className={`px-4 py-1.5 ${statusInfo.color} text-[10px] font-black rounded-xl uppercase`}>{statusInfo.label}</span>
                  <span className="px-4 py-1.5 bg-white/5 border border-white/10 text-[10px] font-black rounded-xl uppercase">{manga.mangaType === 'r18' ? 'Adult 18+' : 'Manhwa'}</span>
               </div>
               
               <div className="flex flex-wrap justify-center md:justify-start gap-1.5">
                  {manga.genres?.map((g) => <span key={g} className="text-[9px] text-gray-500 font-bold uppercase hover:text-indigo-400 transition-colors cursor-default"># {g}</span>)}
               </div>

               <button onClick={handleShare} className="mx-auto md:mx-0 p-2.5 bg-white/5 hover:bg-indigo-600 rounded-xl transition-all text-gray-400 hover:text-white flex items-center gap-2 text-[10px] font-black border border-white/5">
                 <Share2 size={14} /> SHARE
               </button>
            </div>
          </div>

          {/* เรื่องย่อ */}
          <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/5 mb-8 relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600 opacity-40" />
            <p className="text-gray-400 text-[13px] leading-relaxed italic font-medium opacity-90">
              "{manga.description || "แอดมินกำลังเดินทางข้ามมิติไปเขียนเรื่องย่อให้ครับ..."}"
            </p>
          </div>

          {/* ปุ่มอ่านหลัก */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            {manga.mangaLinks?.map((link, i) => (
              <a key={i} href={getRedirectUrl(link.url)} target="_blank" style={{ backgroundColor: link.btnColor || '#4f46e5' }} className="flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-black text-[12px] uppercase shadow-xl hover:brightness-125 text-white">
                {link.platform} <ExternalLink size={16} />
              </a>
            ))}
            {manga.novelUrl && (
              <a href={getRedirectUrl(manga.novelUrl)} target="_blank" className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-2xl font-black text-[12px] uppercase flex items-center justify-center gap-2 transition-all shadow-xl">
                <BookOpen size={16} /> READ NOVEL
              </a>
            )}
          </div>

          {/* --- 📚 เรื่องแนะนำ (เลื่อนต่อลงมาจะเจอที่นี่) --- */}
          <div className="grid md:grid-cols-2 gap-6 border-t border-white/5 pt-10 pb-4">
            <div className="space-y-5">
              <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] flex items-center gap-2 ml-1"><Info size={16} /> รูปแบบอื่น</h4>
              <div className="grid gap-3">
                {manga.relatedStories?.length ? manga.relatedStories.map((rel: any) => (
                  <DetailedSuggestion key={rel.slug} item={rel} onMangaSwap={onMangaSwap} getRedirectUrl={getRedirectUrl} />
                )) : <div className="py-10 text-center border border-dashed border-white/5 rounded-2xl text-gray-700 text-[10px] font-bold uppercase">No Related Data</div>}
              </div>
            </div>

            <div className="space-y-5">
              <h4 className="text-[10px] font-black text-green-500 uppercase tracking-[0.4em] flex items-center gap-2 ml-1"><Flame size={16} /> เรื่องที่คุณอาจจะชอบ</h4>
              <div className="grid gap-3">
                {similarStories.length ? similarStories.map((sim: any) => (
                  <DetailedSuggestion key={sim.slug} item={sim} onMangaSwap={onMangaSwap} getRedirectUrl={getRedirectUrl} />
                )) : <div className="py-10 text-center border border-dashed border-white/5 rounded-2xl text-gray-700 text-[10px] font-bold uppercase">No Recommendations</div>}
              </div>
            </div>
          </div>

          {/* Footer Meta */}
          <div className="border-t border-white/5 pt-8 mt-4 text-center">
             <h4 className="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em] mb-4 flex items-center justify-center gap-2"><TagIcon size={12} /> Keywords</h4>
             <div className="flex flex-wrap justify-center gap-2">
                {[manga.originalTitle, ...(manga.tags || [])].filter(Boolean).map((name) => (
                  <span key={name as string} className="px-3 py-2 bg-white/[0.02] text-[9px] font-bold text-gray-600 rounded-lg border border-white/5">{name as string}</span>
                ))}
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

