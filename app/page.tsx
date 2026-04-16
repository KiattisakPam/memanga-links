"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { client } from "@/sanity/lib/client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Flame, Crown, Zap, LayoutGrid, Shuffle, 
  ChevronLeft, ChevronRight, Maximize2, Minimize2, Plus
} from "lucide-react";
import { Toaster } from 'sonner';
import MangaCard from "@/components/MangaCard";
import MangaRow from "@/components/MangaRow";

// --- 🎨 Brand Icons SVG (Real Identity) ---
const FacebookIcon = () => <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
const YoutubeIcon = () => <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;
const TikTokIcon = () => <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-4.17.07-8.33.07-12.5z"/></svg>;

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
  const [gridCols, setGridCols] = useState(5);
  const [displayLimit, setDisplayLimit] = useState(12);
  
  const catalogRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Data
  useEffect(() => {
    client.fetch(getMangaQuery).then((data) => setAllManga(data || []));
  }, []);

  // --- 🎡 Auto-Slide Banner Logic (5 Seconds) ---
  useEffect(() => {
    const featured = allManga.filter((m: any) => m.isFeatured);
    if (featured.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % featured.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [allManga]);

  // --- 🎯 Filtering Logic ---
  const processedManga = useMemo(() => {
    let result = allManga;
    if (activeTab !== "ทั้งหมด") {
      const typeMap: any = { "🇰🇷 มันฮวา": "manhwa", "🔞 ติดเรท": "r18" };
      result = result.filter((m: any) => m.mangaType === typeMap[activeTab]);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((m: any) => 
        m.title.toLowerCase().includes(q) || m.englishTitle?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [allManga, activeTab, searchQuery]);

  const featuredManga = useMemo(() => allManga.filter((m: any) => m.isFeatured), [allManga]);
  const isSearching = searchQuery.trim().length > 0;

  const paginate = (dir: number) => {
    setCurrentBanner((prev) => (prev + dir + featuredManga.length) % featuredManga.length);
  };

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white pb-20 overflow-x-hidden font-sans selection:bg-indigo-500/30">
      
      <Toaster position="bottom-right" theme="dark" richColors />

      {/* --- 1. Top Slim Banner (Auto-slide & Clean) --- */}
      {!isSearching && featuredManga.length > 0 && (
        <section className="w-full h-[180px] md:h-[350px] relative overflow-hidden group bg-black border-b border-white/5">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBanner}
              className="absolute inset-0 w-full h-full cursor-pointer"
              initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => setSelectedManga(featuredManga[currentBanner])}
            >
              <img 
                src={featuredManga[currentBanner]?.bannerUrl || featuredManga[currentBanner]?.coverUrl} 
                className="w-full h-full object-cover" 
                alt="Banner"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Nav Controls */}
          <button onClick={(e) => { e.stopPropagation(); paginate(-1); }} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-indigo-600 rounded-full transition-all opacity-0 group-hover:opacity-100 z-20 shadow-xl border border-white/10"><ChevronLeft size={20}/></button>
          <button onClick={(e) => { e.stopPropagation(); paginate(1); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-indigo-600 rounded-full transition-all opacity-0 group-hover:opacity-100 z-20 shadow-xl border border-white/10"><ChevronRight size={20}/></button>

          {/* Dots Indicator */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {featuredManga.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === currentBanner ? 'w-6 bg-indigo-500' : 'w-1.5 bg-white/30'}`} />
            ))}
          </div>
        </section>
      )}

      {/* --- 2. Branding Header (Compact & Integrated) --- */}
      <div className="mt-8 mb-10 w-full max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full border-2 border-indigo-500 p-0.5 shadow-[0_0_20px_rgba(99,102,241,0.2)] bg-[#111]">
            <img src="/profile.png" className="w-full h-full object-cover rounded-full" alt="TL" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white uppercase leading-none italic">TRANSLATE<span className="text-indigo-500">LOVER</span></h1>
            <p className="text-indigo-400 text-[10px] font-bold tracking-[0.3em] mt-1 uppercase">แปลรักข้างหมอน</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <a href="https://facebook.com" target="_blank" className="text-gray-400 hover:text-blue-500 transition-colors"><FacebookIcon /></a>
          <a href="https://youtube.com" target="_blank" className="text-gray-400 hover:text-red-600 transition-colors"><YoutubeIcon /></a>
          <a href="https://tiktok.com" target="_blank" className="text-gray-400 hover:text-pink-500 transition-colors"><TikTokIcon /></a>
        </div>
      </div>

      {/* --- 3. Control Center (Search + Tabs + Master Resizer) --- */}
      <div className="sticky top-4 z-[50] w-full max-w-4xl mx-auto px-4 mb-14 space-y-5">
        <div className="relative group">
          <div className="absolute inset-0 bg-indigo-500/5 blur-2xl group-focus-within:bg-indigo-500/10 transition-all rounded-full" />
          <input 
            type="text" placeholder="ค้นหามังฮวาที่คุณรัก..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="relative w-full bg-[#0D0D0D]/95 backdrop-blur-3xl border border-white/10 rounded-2xl py-4 px-10 text-base focus:outline-none focus:border-indigo-500/50 transition-all shadow-2xl"
          />
          <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors" size={22} />
        </div>

        {!isSearching && (
          <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
            <div className="flex gap-1.5 p-1 bg-[#0D0D0D] rounded-xl border border-white/5 shadow-inner">
              {['ทั้งหมด', '🇰🇷 มันฮวา', '🔞 ติดเรท'].map((tab) => (
                <button key={tab} onClick={() => {setActiveTab(tab); setDisplayLimit(12);}} className={`px-5 py-2 rounded-lg text-[10px] font-black transition-all uppercase whitespace-nowrap ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>{tab}</button>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedManga(allManga[Math.floor(Math.random() * allManga.length)])} className="p-2.5 bg-white text-black hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-xl active:scale-90"><Shuffle size={18} /></button>
              <div className="flex items-center gap-1.5 bg-[#0D0D0D] p-1 rounded-xl border border-white/5 shadow-xl">
                  <button onClick={() => setGridCols(6)} className={`p-2 rounded-lg transition-all ${gridCols === 6 ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:text-gray-200'}`}><Minimize2 size={16}/></button>
                  <button onClick={() => setGridCols(4)} className={`p-2 rounded-xl transition-all ${gridCols === 4 ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:text-gray-200'}`}><Maximize2 size={16}/></button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
        {isSearching ? (
          /* --- 🔍 SEARCH MODE --- */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-4">
            <div className="flex items-center justify-between mb-12 border-l-4 border-indigo-500 pl-6">
               <div>
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Search Results</h2>
                  <p className="text-gray-500 text-xs mt-1 uppercase font-bold tracking-widest">Found {processedManga.length} matching stories</p>
               </div>
               <button onClick={() => setSearchQuery("")} className="text-[11px] font-black uppercase text-gray-500 hover:text-white transition-all underline underline-offset-4 tracking-widest">Clear Search</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
              {processedManga.map((m: any) => <MangaCard key={m.slug} manga={m} onClick={() => setSelectedManga(m)} />)}
            </div>
            {processedManga.length === 0 && <p className="text-center py-40 text-gray-600 font-bold italic uppercase tracking-widest">No results found...</p>}
          </motion.div>
        ) : (
          /* --- 🏠 NORMAL HOME MODE --- */
          <div className="space-y-16 md:space-y-20">
            <MangaRow title="อัปเดตตอนใหม่ล่าสุด" icon={<Zap size={18}/>} items={processedManga.slice(0, 10)} onCardClick={setSelectedManga} gridCols={gridCols} />
            <MangaRow title="มังฮวาเข้าใหม่" icon={<Plus size={18}/>} items={[...processedManga].sort((a,b) => (b._createdAt || "").localeCompare(a._createdAt || "")).slice(0, 10)} onCardClick={setSelectedManga} gridCols={gridCols} />
            <MangaRow title="ยอดนิยมประจำสัปดาห์" icon={<Crown size={18}/>} items={[...processedManga].sort((a,b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 10)} onCardClick={setSelectedManga} gridCols={gridCols} />

            {/* --- Global Catalog with Load More --- */}
            <section ref={catalogRef} id="catalog" className="pt-16 border-t border-white/5">
              <div className="flex items-center gap-4 mb-12">
                <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 shadow-xl"><LayoutGrid className="text-indigo-500" size={24} /></div>
                <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-white">คลังมังฮวา ทั้งหมด</h2>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:gap-8" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${gridCols === 6 ? '135px' : '175px'}, 1fr))` }}>
                <AnimatePresence mode="popLayout">
                  {processedManga.slice(0, displayLimit).map((m: any) => (
                    <MangaCard key={m.slug} manga={m} onClick={() => setSelectedManga(m)} />
                  ))}
                </AnimatePresence>
              </div>

              {displayLimit < processedManga.length && (
                <div className="mt-20 flex justify-center">
                  <button 
                    onClick={() => setDisplayLimit(prev => prev + 12)}
                    className="px-12 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[11px] rounded-2xl uppercase tracking-[0.3em] transition-all shadow-2xl shadow-indigo-900/40 active:scale-95 border border-white/10"
                  >
                    แสดงเพิ่มเติม
                  </button>
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      <footer className="mt-40 opacity-20 text-[9px] font-black tracking-[1.5em] uppercase text-center border-t border-white/5 pt-24 w-full">
        TRANSLATELOVER • 2026
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

