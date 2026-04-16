"use client";

import { motion } from "framer-motion";
import { 
  X, 
  ExternalLink, 
  BookOpen, 
  Layers, 
  Flame, 
  Clock, 
  CheckCircle2, 
  Coffee, 
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

// --- 🎨 คอมโพเนนต์ย่อยสำหรับการ์ดแนะนำแบบละเอียด (Yaksha Pro Style) ---
const DetailedSuggestion = ({ item, onMangaSwap, getRedirectUrl }: any) => (
  <div className="flex flex-col gap-3 p-4 bg-white/[0.03] border border-white/5 rounded-[2rem] hover:bg-indigo-500/10 transition-all group/item shadow-lg">
    <div className="flex gap-4 items-start">
      {/* ภาพปกขนาดใหญ่และชัดเจน */}
      <div 
        onClick={() => onMangaSwap?.(item)} 
        className="relative w-20 h-28 md:w-24 md:h-32 flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer shadow-2xl border border-white/5"
      >
        <img src={item.coverUrl} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" alt="" />
        <div className="absolute top-1.5 right-1.5 bg-red-600 text-[10px] font-black px-2 py-0.5 rounded shadow-lg uppercase">
          EP.{item.latestChapter || '??'}
        </div>
      </div>
      
      {/* ข้อมูลเรื่องแนะนำแบบครบถ้วน */}
      <div className="flex flex-col flex-1 min-w-0">
        <h5 
          onClick={() => onMangaSwap?.(item)} 
          className="text-[12px] font-bold text-gray-100 line-clamp-2 cursor-pointer hover:text-indigo-400 transition-colors uppercase italic tracking-tighter mb-2"
        >
          {item.title}
        </h5>
        <div className="flex flex-wrap gap-1.5 mb-3">
            <span className="text-[9px] bg-white/10 text-gray-400 px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest border border-white/5">
              {item.status === 'completed' ? 'จบแล้ว' : 'ปั่นอยู่'}
            </span>
            <span className="text-[9px] text-indigo-400 font-black uppercase border border-indigo-500/20 px-2.5 py-0.5 rounded-full bg-indigo-500/5">
              {item.mangaType === 'r18' ? 'ADULT' : 'MANHWA'}
            </span>
        </div>
        {/* หมวดหมู่จิ๋ว */}
        <div className="flex flex-wrap gap-1 opacity-60">
            {item.genres?.slice(0, 2).map((g: string) => (
                <span key={g} className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">#{g}</span>
            ))}
        </div>
      </div>
    </div>

    {/* ปุ่มอ่านช่องทางต่างๆ ในการ์ดแนะนำ (เหมือนหน้าหลัก) */}
    <div className="grid grid-cols-2 gap-2 mt-1">
        {item.mangaLinks?.slice(0, 2).map((link: any) => (
            <a 
              key={link.platform} 
              href={getRedirectUrl(link.url)} 
              target="_blank" 
              style={{ backgroundColor: link.btnColor || '#333' }}
              className="py-2.5 rounded-xl text-[9px] font-black text-white text-center uppercase flex items-center justify-center gap-1.5 hover:brightness-125 transition-all shadow-md active:scale-95"
            >
              {link.platform} <ExternalLink size={10} />
            </a>
        ))}
        {!item.mangaLinks?.length && (
            <div className="col-span-2 py-2.5 text-center text-[9px] text-gray-600 font-black uppercase tracking-widest border border-dashed border-white/5 rounded-xl">
               No Links Available
            </div>
        )}
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
    toast.success("คัดลอกลิงก์สำเร็จ!", {
      description: "แอดมินนำไปแชร์ต่อได้เลยครับ",
      icon: <Share2 size={16} className="text-indigo-400" />,
    });
  };

  const similarStories = allManga?.filter((item: any) => 
    item.slug !== manga.slug && 
    item.genres?.some((g: string) => manga.genres?.includes(g))
  ).slice(0, 4) || [];

  // --- 🖼️ Mode 1: การ์ดปกติบน Grid (หน้าแรก) ---
  if (!isGlobalModal) {
    return (
      <motion.div
        layout
        whileHover={{ y: -6 }}
        onClick={onClick}
        className="relative group cursor-pointer bg-[#0D0D0D] rounded-xl md:rounded-[2.5rem] overflow-hidden border border-white/5 aspect-[3/4.2] shadow-2xl mx-0.5"
      >
        {/* ✨ EP Tag: ขยายขนาดให้อ่านง่าย */}
        {manga.latestChapter && (
          <div className="absolute top-2.5 right-2.5 z-10 bg-indigo-600 text-[10px] md:text-[12px] font-black px-2.5 py-1 rounded-lg shadow-xl uppercase tracking-widest border border-white/10">
            EP.{manga.latestChapter}
          </div>
        )}
        {/* ✨ Status Tag: ขยายขนาดให้อ่านง่าย */}
        <div className={`absolute top-2.5 left-2.5 z-10 px-3 py-1 rounded-full text-[10px] md:text-[12px] font-black text-white ${statusInfo.color} shadow-xl shadow-black/40 uppercase tracking-tighter`}>
          {statusInfo.label}
        </div>

        <img src={manga.coverUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-3 md:p-5">
           <span className="text-[11px] md:text-[13px] font-bold leading-tight line-clamp-2 text-white italic uppercase tracking-tighter">{manga.title}</span>
        </div>

        {/* ✨ 18+ Tag: ขยายขนาดให้อ่านง่าย */}
        {manga.mangaType === 'r18' && (
          <div className="absolute bottom-2.5 right-2.5 z-10 bg-red-600/90 backdrop-blur-md text-[10px] md:text-[11px] font-black px-2 py-0.5 rounded shadow-xl text-white border border-white/20">18+</div>
        )}
      </motion.div>
    );
  }

  // --- 🚨 Mode 2: Premium Global Modal (Yaksha Pro Edition) ---
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6 overflow-hidden">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-[#050505]/98 backdrop-blur-xl" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-5xl bg-[#0D0D0D] border border-white/10 rounded-3xl md:rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row h-full max-h-[92vh] z-[110]"
      >
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-5 right-5 md:top-8 md:right-8 p-3 bg-white/5 hover:bg-red-600 rounded-full z-[120] transition-all border border-white/10 shadow-xl">
          <X size={20} />
        </button>

        {/* Sidebar - Left (Sticky Cover) */}
        <div className="w-full md:w-72 lg:w-80 p-6 md:p-10 flex-shrink-0 bg-gradient-to-b from-indigo-500/[0.05] to-transparent border-b md:border-b-0 md:border-r border-white/5 overflow-y-auto no-scrollbar">
          <div className="sticky top-0">
            <motion.img 
              key={manga.coverUrl}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              src={manga.coverUrl} 
              className="w-48 md:w-full aspect-[3/4.2] object-cover rounded-2xl md:rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10 mb-6 mx-auto md:mx-0" 
            />
            
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="px-4 py-2 bg-indigo-600 text-[10px] font-black rounded-xl shadow-lg uppercase tracking-widest">EP.{manga.latestChapter || '??'}</span>
              <span className={`px-4 py-2 ${statusInfo.color} text-[10px] font-black rounded-xl uppercase shadow-lg`}>{statusInfo.label}</span>
              <span className="px-4 py-2 bg-white/5 border border-white/10 text-[10px] font-black rounded-xl uppercase">{manga.mangaType === 'r18' ? 'Adult 18+' : 'Manhwa'}</span>
            </div>
          </div>
        </div>

        {/* Content Area - Right (Fully Scrollable) */}
        <div className="flex-1 p-6 md:p-10 overflow-y-auto no-scrollbar bg-[#0D0D0D]">
          <div className="flex justify-between items-start mb-2 gap-4">
            <h2 className="text-2xl md:text-4xl font-black leading-tight text-white uppercase italic tracking-tighter">{manga.title}</h2>
            <button onClick={handleShare} className="p-3 bg-white/5 hover:bg-indigo-600 rounded-2xl transition-all text-gray-400 hover:text-white flex items-center gap-2 text-[10px] font-black flex-shrink-0 border border-white/5">
              <Share2 size={16} /> SHARE
            </button>
          </div>
          <p className="text-gray-500 text-[11px] font-bold uppercase tracking-[0.2em] mb-6 opacity-60 italic">{manga.englishTitle}</p>
          
          <div className="flex flex-wrap gap-1.5 mb-8">
            {manga.genres?.map((g) => (
              <span key={g} className="px-3 py-1 bg-indigo-500/5 border border-indigo-500/10 rounded-full text-[9px] font-bold text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all cursor-default uppercase tracking-tighter"># {g}</span>
            ))}
          </div>

          <div className="bg-white/[0.01] p-6 md:p-8 rounded-[2rem] border border-white/5 mb-10 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600 opacity-40" />
            <p className="text-gray-400 text-[13px] md:text-[14px] leading-relaxed italic font-medium opacity-90">
              "{manga.description || "แอดมินกำลังเดินทางข้ามมิติไปเขียนเรื่องย่อให้ครับ... โปรดรอสักครู่"}"
            </p>
          </div>

          {/* Reading Section (Large Buttons) */}
          <div className="space-y-5 mb-14">
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] flex items-center gap-3 ml-1"><BookOpen size={16} /> เลือกช่องทางการอ่าน</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {manga.mangaLinks?.map((link, i) => (
                <a 
                  key={i} href={getRedirectUrl(link.url)} target="_blank" 
                  style={{ backgroundColor: link.btnColor || '#4f46e5' }}
                  className="flex items-center justify-between px-8 py-5 rounded-2xl transition-all font-black text-[12px] uppercase group shadow-2xl hover:brightness-125 active:scale-95 text-white"
                >
                  {link.platform} <ExternalLink size={18} className="group-hover:translate-x-1 transition-transform" />
                </a>
              ))}
              {manga.novelUrl && (
                <a href={getRedirectUrl(manga.novelUrl)} target="_blank" className="w-full py-5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-2xl font-black text-[12px] uppercase flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95">
                  <Layers size={20} /> READ THAI NOVEL
                </a>
              )}
            </div>
          </div>

          {/* --- 📚 เรื่องแนะนำ (Yaksha Style - Detailed Cards) --- */}
          <div className="grid md:grid-cols-2 gap-8 border-t border-white/5 pt-12 mb-10">
            {/* รูปแบบอื่น */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] flex items-center gap-3 ml-1"><Info size={18} /> รูปแบบอื่น (นิยาย/มังฮวา)</h4>
              <div className="grid gap-3">
                {manga.relatedStories?.length ? manga.relatedStories.map((rel: any) => (
                  <DetailedSuggestion key={rel.slug} item={rel} onMangaSwap={onMangaSwap} getRedirectUrl={getRedirectUrl} />
                )) : <div className="py-10 text-center border border-dashed border-white/5 rounded-3xl text-gray-700 text-[10px] font-bold uppercase tracking-widest">No Related Version</div>}
              </div>
            </div>

            {/* เรื่องที่คุณอาจจะชอบ */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-green-500 uppercase tracking-[0.4em] flex items-center gap-3 ml-1"><Flame size={18} /> เรื่องที่คุณอาจจะชอบ</h4>
              <div className="grid gap-3">
                {similarStories.length ? similarStories.map((sim: any) => (
                  <DetailedSuggestion key={sim.slug} item={sim} onMangaSwap={onMangaSwap} getRedirectUrl={getRedirectUrl} />
                )) : <div className="py-10 text-center border border-dashed border-white/5 rounded-3xl text-gray-700 text-[10px] font-bold uppercase tracking-widest">No Recommendations</div>}
              </div>
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="border-t border-white/5 pt-10">
             <h4 className="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em] mb-5 ml-1 flex items-center gap-3"><TagIcon size={14} /> ชื่ออื่นๆ และคีย์เวิร์ด</h4>
             <div className="flex flex-wrap gap-2">
                {[manga.originalTitle, ...(manga.tags || [])].filter(Boolean).map((name) => (
                  <span key={name as string} className="px-4 py-2 bg-white/[0.02] text-[10px] font-bold text-gray-600 rounded-xl border border-white/5 hover:border-indigo-500/30 hover:text-indigo-400 transition-all">{name as string}</span>
                ))}
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

