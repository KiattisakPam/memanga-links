"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { client } from "@/sanity/lib/client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Flame, Crown, Zap, LayoutGrid, Shuffle, 
  ChevronLeft, ChevronRight, Plus, Square, Grid2X2, Grid3X3 
} from "lucide-react";
import { Toaster } from 'sonner';
import MangaCard from "@/components/MangaCard";
import MangaRow from "@/components/MangaRow";

// --- 🎨 Brand Icons SVG ---
const FacebookIcon = () => <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
const YoutubeIcon = () => <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;
const TikTokIcon = () => <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-4.17.07-8.33.07-12.5z"/></svg>;

const getMangaQuery = `*[_type == "manga"] | order(_updatedAt desc) {
  ...,
  "slug": slug.current,
  "coverUrl": cover.asset->url,
  "bannerUrl": bannerImage.asset->url,
  mangaLinks[]{ platform, url, btnColor },
  relatedStories[]->{
    title, "slug": slug.current, "coverUrl": cover.asset->url,
    status, mangaType, latestChapter, genres,
    mangaLinks[]{ platform, url, btnColor }
  }
}`;

export default function Home() {
  const [allManga, setAllManga] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("ทั้งหมด");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedManga, setSelectedManga] = useState<any>(null); 
  const [currentBanner, setCurrentBanner] = useState(0);
  const [gridCols, setGridCols] = useState(3); // 1: Big, 2: Mid, 3: Small
  const [displayLimit, setDisplayLimit] = useState(12);
  
  const catalogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    client.fetch(getMangaQuery).then((data) => setAllManga(data || []));
  }, []);

  useEffect(() => {
    const featured = allManga.filter((m: any) => m.isFeatured);
    if (featured.length <= 1) return;
    const timer = setInterval(() => setCurrentBanner((prev) => (prev + 1) % featured.length), 5000);
    return () => clearInterval(timer);
  }, [allManga]);

  const processedManga = useMemo(() => {
    let result = allManga;
    if (activeTab !== "ทั้งหมด") {
      const typeMap: any = { "🇰🇷 มันฮวา": "manhwa", "🔞 ติดเรท": "r18" };
      result = result.filter((m: any) => m.mangaType === typeMap[activeTab]);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((m: any) => m.title.toLowerCase().includes(q) || m.englishTitle?.toLowerCase().includes(q));
    }
    return result;
  }, [allManga, activeTab, searchQuery]);

  const featuredManga = useMemo(() => allManga.filter((m: any) => m.isFeatured), [allManga]);
  const isSearching = searchQuery.trim().length > 0;

  const getGridClass = () => {
    if (gridCols === 1) return "grid-cols-1 sm:grid-cols-2"; 
    if (gridCols === 2) return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"; 
    return "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"; 
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white pb-20 overflow-x-hidden font-sans selection:bg-indigo-500/30">
      <Toaster position="bottom-right" theme="dark" richColors />

      {/* --- 1. Top Slim Banner --- */}
      {!isSearching && featuredManga.length > 0 && (
        <section className="w-full h-[180px] md:h-[350px] relative overflow-hidden bg-black border-b border-white/5">
          <AnimatePresence mode="wait">
            <motion.div key={currentBanner} className="absolute inset-0 w-full h-full cursor-pointer" initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} onClick={() => setSelectedManga(featuredManga[currentBanner])}>
              <img src={featuredManga[currentBanner]?.bannerUrl || featuredManga[currentBanner]?.coverUrl} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {featuredManga.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all ${i === currentBanner ? 'w-6 bg-indigo-500' : 'w-1.5 bg-white/30'}`} />
            ))}
          </div>
        </section>
      )}

      {/* --- 2. Branding & Controls (Tight Layout) --- */}
      <div className="mt-4 mb-6 px-4 md:px-6 flex flex-col items-center">
        {/* Branding Header */}
        <div className="flex items-center gap-3 mb-2">
          <img src="/profile.png" className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-indigo-500 p-0.5 shadow-lg" alt="Profile" />
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-black italic uppercase leading-none">แปลรักข้าง<span className="text-indigo-500">หมอน</span></h1>
            <p className="text-indigo-400 text-[9px] font-bold uppercase tracking-widest mt-0.5">งานแปลคุณภาพระดับพรีเมียม</p>
          </div>
        </div>

        {/* Social Icons (Reduced Spacing) */}
        <div className="flex gap-5 text-gray-500 mb-4">
           <a href="#" className="hover:text-blue-500 transition-colors"><FacebookIcon /></a>
           <a href="#" className="hover:text-red-600 transition-colors"><YoutubeIcon /></a>
           <a href="#" className="hover:text-pink-500 transition-colors"><TikTokIcon /></a>
        </div>

        {/* Search & Tabs & Resizer (Fully Visible) */}
        <div className="w-full max-w-4xl space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <input 
              type="text" placeholder="ค้นหามังฮวาที่รัก..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full bg-[#111]/90 border border-white/10 rounded-xl py-3 px-6 text-sm focus:border-indigo-500 outline-none transition-all shadow-xl" 
            />
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          </div>

          {/* Controls Row: Tabs + Shuffle + Resizer */}
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Tabs */}
            <div className="flex gap-1 bg-[#111] p-1 rounded-xl border border-white/5 w-full md:w-auto overflow-x-auto no-scrollbar">
              {['ทั้งหมด', '🇰🇷 มันฮวา', '🔞 ติดเรท'].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-[10px] font-black uppercase whitespace-nowrap transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>{tab}</button>
              ))}
            </div>
            
            {/* Action Buttons: Shuffle & Resizer (Always Visible) */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-center">
              <button onClick={() => setSelectedManga(allManga[Math.floor(Math.random() * allManga.length)])} className="p-2.5 bg-[#111] border border-white/10 rounded-xl text-gray-400 hover:text-indigo-500 transition-all shadow-lg active:scale-90" title="สุ่มเรื่อง">
                <Shuffle size={18} />
              </button>
              
              {/* ✨ Master Resizer (3 Levels) */}
              <div className="flex items-center gap-1 bg-[#111] p-1 rounded-xl border border-white/10 shadow-lg">
                  <button onClick={() => setGridCols(1)} className={`p-1.5 rounded-lg transition-all ${gridCols === 1 ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}><Square size={16}/></button>
                  <button onClick={() => setGridCols(2)} className={`p-1.5 rounded-lg transition-all ${gridCols === 2 ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}><Grid2X2 size={16}/></button>
                  <button onClick={() => setGridCols(3)} className={`p-1.5 rounded-lg transition-all ${gridCols === 3 ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}><Grid3X3 size={16}/></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- 3. Content Area (Reduced Row Spacing) --- */}
      <div className="w-full max-w-7xl mx-auto px-2 md:px-8">
        {isSearching ? (
          /* Search Results */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-xl font-black uppercase italic mb-8 border-l-4 border-indigo-500 pl-4">ผลการค้นหา ({processedManga.length})</h2>
            <div className={`grid ${getGridClass()} gap-2 md:gap-3`}>
              {processedManga.map((m: any) => <MangaCard key={m.slug} manga={m} onClick={() => setSelectedManga(m)} />)}
            </div>
            {processedManga.length === 0 && <p className="text-center py-40 text-gray-600 font-bold italic uppercase tracking-widest">ไม่พบมังฮวาที่คุณค้นหา...</p>}
          </motion.div>
        ) : (
          /* Standard Home Layout */
          <div className="space-y-8 md:space-y-12">
            <MangaRow title="อัปเดตตอนใหม่ล่าสุด" icon={<Zap size={18} fill="currentColor"/>} items={processedManga.slice(0, 10)} onCardClick={setSelectedManga} gridCols={gridCols === 1 ? 4 : gridCols === 2 ? 5 : 6} />
            <MangaRow title="มังฮวาเข้าใหม่" icon={<Plus size={18}/>} items={[...processedManga].sort((a,b) => (b._createdAt || "").localeCompare(a._createdAt || "")).slice(0, 10)} onCardClick={setSelectedManga} gridCols={gridCols === 1 ? 4 : gridCols === 2 ? 5 : 6} />
            <MangaRow title="ยอดนิยมประจำสัปดาห์" icon={<Crown size={18} fill="currentColor"/>} items={[...processedManga].sort((a,b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 10)} onCardClick={setSelectedManga} gridCols={gridCols === 1 ? 4 : gridCols === 2 ? 5 : 6} />

            {/* Catalog Section */}
            <section ref={catalogRef} className="pt-8 border-t border-white/5">
              <div className="flex items-center gap-3 mb-8 px-2">
                <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-lg"><LayoutGrid className="text-indigo-500" size={20} /></div>
                <h2 className="text-lg md:text-xl font-black uppercase italic tracking-tighter text-white">คลังมังฮวา ทั้งหมด</h2>
              </div>
              
              <div className={`grid ${getGridClass()} gap-2 md:gap-3`}>
                <AnimatePresence mode="popLayout">
                  {processedManga.slice(0, displayLimit).map((m: any) => (
                    <MangaCard key={m.slug} manga={m} onClick={() => setSelectedManga(m)} />
                  ))}
                </AnimatePresence>
              </div>

              {displayLimit < processedManga.length && (
                <div className="mt-16 flex justify-center">
                  <button onClick={() => setDisplayLimit(prev => prev + 12)} className="px-12 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[11px] rounded-2xl uppercase tracking-[0.3em] transition-all shadow-xl active:scale-95 border border-white/10">แสดงเพิ่มเติม</button>
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      <footer className="mt-40 opacity-20 text-[9px] font-black tracking-[1.5em] uppercase text-center border-t border-white/5 pt-20 w-full px-6">
        แปลรักข้างหมอน • PREMIUM QUALITY • 2026
      </footer>

      {/* --- 🚨 GLOBAL DETAIL MODAL --- */}
      <AnimatePresence>
        {selectedManga && (
          <MangaCard manga={selectedManga} isGlobalModal={true} onClose={() => setSelectedManga(null)} onMangaSwap={setSelectedManga} allManga={allManga} />
        )}
      </AnimatePresence>
    </div>
  );
}

