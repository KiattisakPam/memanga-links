"use client";

import { useState, useEffect, useMemo } from "react";
import { client } from "@/sanity/lib/client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, LayoutGrid, ChevronLeft, ChevronRight, 
  ArrowUpDown, Home 
} from "lucide-react";
import Link from "next/link";
import MangaCard from "@/components/MangaCard";
import AgeGate from "@/components/AgeGate";

const getRelativeTime = (dateString: string): string => {
  if (!dateString) return "";
  const now = new Date();
  const updated = new Date(dateString);
  const diffInMs = now.getTime() - updated.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) return "ไม่กี่นาทีที่แล้ว";
  if (diffInHours < 24) return `${diffInHours} ชม. ที่แล้ว`;
  return `${diffInDays} วันที่แล้ว`;
};

const getCatalogQuery = `*[_type == "manga"] {
  ...,
  "slug": slug.current,
  "coverUrl": cover.asset->url,
  "bannerUrl": bannerImage.asset->url,
  status,
  mangaType,
  viewCount,
  chapterUpdatedAt,
  genres,
  _createdAt,
  _updatedAt
}`;

export default function CatalogPage() {
  const [allManga, setAllManga] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true); // ✨ เติมสถานะ Loading

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("ทั้งหมด");
  const [sortBy, setSortBy] = useState("latest_update"); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18; 

  const [isAdultConfirmed, setIsAdultConfirmed] = useState(false);
  const [showAgeGate, setShowAgeGate] = useState(false);
  const [selectedManga, setSelectedManga] = useState<any>(null);

  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const uniqueGenres = useMemo(() => {
    const all = allManga.flatMap((m) => m.genres || []);
    return Array.from(new Set(all)).filter(Boolean).sort();
  }, [allManga]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const sortParam = params.get('sort');
      const tabParam = params.get('tab');
      const genreParam = params.get('genre'); // ✨ 1. เพิ่มบรรทัดนี้เพื่อรับค่า genre
      
      if (sortParam) setSortBy(sortParam);
      if (tabParam === 'completed') setActiveTab("✅ จบแล้ว");
      if (genreParam) setSelectedGenre(genreParam); // ✨ 2. กำหนดค่าหมวดหมู่ให้ตรงกับที่กดมา
    }

    const isConfirmed = localStorage.getItem("isAdultConfirmed") === "true";
    setIsAdultConfirmed(isConfirmed);
    
    // ✨ ดึงข้อมูลเสร็จแล้วปิด Loading
    client.fetch(getCatalogQuery).then((data) => {
      setAllManga(data || []);
      setIsLoading(false);
    });
  }, []);

  const filteredAndSortedManga = useMemo(() => {
    let result = [...allManga];

    // ✨ เปลี่ยนจาก r18
    if (!isAdultConfirmed && activeTab !== "🔞 ติดเรท") {
      result = result.filter((m: any) => m.mangaType !== 'r18');
    }

    if (activeTab !== "ทั้งหมด") {
      if (activeTab === "✅ จบแล้ว") {
        result = result.filter((m: any) => m.status === "completed" || m.status === "✅ จบสมบูรณ์ (Completed)" || m.status === "จบแล้ว");
      } else {
        // ✨ เปลี่ยน Map ให้ตรงกับ Schema แปลรักข้างหมอน
        const typeMap: any = { "🇰🇷 มันฮวา": "manhwa", "🔞 ติดเรท": "r18" };
        result = result.filter((m: any) => m.mangaType === typeMap[activeTab]);
      }
    }

    if (selectedGenre) {
      result = result.filter((m: any) => m.genres?.includes(selectedGenre));
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((m: any) => 
        m.title.toLowerCase().includes(q) || 
        m.englishTitle?.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      if (sortBy === "latest_update") {
        return new Date(b.chapterUpdatedAt || b._updatedAt).getTime() - new Date(a.chapterUpdatedAt || a._updatedAt).getTime();
      }
      if (sortBy === "newest") {
        return new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime();
      }
      if (sortBy === "popular") {
        return (b.viewCount || 0) - (a.viewCount || 0);
      }
      if (sortBy === "a_z") {
        return a.title.localeCompare(b.title, 'th');
      }
      return 0;
    });

    return result;
  }, [allManga, activeTab, searchQuery, sortBy, isAdultConfirmed, selectedGenre]);

  const totalPages = Math.ceil(filteredAndSortedManga.length / itemsPerPage);
  const currentItems = filteredAndSortedManga.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmAge = () => {
    localStorage.setItem("isAdultConfirmed", "true");
    setIsAdultConfirmed(true);
    setShowAgeGate(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-20 pt-6 px-3 md:px-8 font-sans">
      
      {/* ✨ แก้ปุ่ม Decline เป็นโหมดปกติ */}
      <AgeGate 
        isVisible={showAgeGate} 
        onConfirm={confirmAge} 
        onDecline={() => { setShowAgeGate(false); setActiveTab("🇰🇷 มันฮวา"); }} 
      />

      <div className="max-w-7xl mx-auto mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-gray-500 hover:text-indigo-500 transition-colors mb-4 md:mb-2 group"
        >
          <div className="p-1.5 bg-white/5 rounded-full group-hover:bg-indigo-500/10 transition-colors">
            <Home size={16} />
          </div>
          <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">กลับหน้าหลัก</span>
        </Link>

        <div className="flex flex-col items-center text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter mb-2">
            คลัง<span className="text-indigo-500">มังฮวา</span>ทั้งหมด
          </h1>
          <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">Explore Our Full Library</p>
        </div>
        
        <div className="flex flex-col items-center gap-4 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row w-full gap-3">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="ค้นหาในคลัง..." 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full bg-[#111] border border-white/5 rounded-2xl py-3.5 px-12 text-sm focus:border-indigo-500 outline-none transition-all shadow-lg"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
            </div>

            <div className="flex items-center gap-2 bg-[#111] border border-white/5 px-4 py-1 rounded-2xl shadow-lg shrink-0">
              <div className="text-indigo-500"><ArrowUpDown size={16} /></div>
              <select 
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                className="bg-transparent outline-none text-xs md:text-sm font-black uppercase tracking-widest cursor-pointer text-gray-300 py-2.5"
              >
                <option value="latest_update" className="bg-[#111]">⚡ อัปเดตล่าสุด</option>
                <option value="newest" className="bg-[#111]">✨ เรื่องเข้าใหม่</option>
                <option value="popular" className="bg-[#111]">🔥 ยอดนิยม</option>
                <option value="a_z" className="bg-[#111]">🔤 เรียงตาม ก-ฮ</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-1.5 bg-[#111] p-1.5 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar w-full sm:w-auto justify-start sm:justify-center">
            {/* ✨ เปลี่ยนชื่อ Tab ตรงนี้ */}
            {['ทั้งหมด', '🇰🇷 มันฮวา', '🔞 ติดเรท', '✅ จบแล้ว'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => {
                  if (tab === "🔞 ติดเรท" && !isAdultConfirmed) { setShowAgeGate(true); return; }
                  setActiveTab(tab);
                  setCurrentPage(1);
                }} 
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase whitespace-nowrap transition-all flex-1 sm:flex-none ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* แถบหมวดหมู่ (Genre Bar) */}
        {!isLoading && uniqueGenres.length > 0 && (
          <div className="w-full max-w-4xl mx-auto mt-4 px-2">
            <div className="flex gap-2 overflow-x-auto pb-3 snap-x genre-scrollbar">
              <button
                onClick={() => { setSelectedGenre(null); setCurrentPage(1); }}
                className={`snap-start shrink-0 px-4 py-2 rounded-full text-[10px] md:text-xs font-black uppercase transition-all border ${!selectedGenre ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-[#111] text-gray-500 border-white/5 hover:border-white/10 hover:text-gray-300'}`}
              >
                รวมทุกแนว
              </button>
              {uniqueGenres.map((genre: any) => {
                const count = allManga.filter((m: any) => m.genres?.includes(genre)).length;
                return (
                  <button
                    key={genre}
                    onClick={() => { setSelectedGenre(genre); setCurrentPage(1); }}
                    className={`snap-start shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] md:text-xs font-black uppercase transition-all border ${selectedGenre === genre ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'bg-[#111] text-gray-500 border-white/5 hover:border-white/10 hover:text-gray-300'}`}
                  >
                    <span>#{genre}</span>
                    <span className={`text-[9px] ${selectedGenre === genre ? 'text-indigo-300' : 'text-gray-600'}`}>({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* --- Manga Grid --- */}
      <div className="max-w-7xl mx-auto min-h-[600px]">
        {/* ✨ เพิ่ม Skeleton Loading ตอนรอโหลดข้อมูล */}
        {isLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-4 md:gap-5">
            {[...Array(18)].map((_, i) => (
              <div key={`skeleton-${i}`} className="aspect-[3/4.2] bg-[#111] animate-pulse rounded-xl md:rounded-2xl border border-white/5 overflow-hidden relative">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              </div>
            ))}
          </div>
        ) : currentItems.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-4 md:gap-5">
            {currentItems.map((m: any) => (
              <MangaCard 
                key={m.slug} 
                manga={m} 
                onClick={() => {
                  if (m.mangaType === 'r18' && !isAdultConfirmed) { setShowAgeGate(true); return; }
                  setSelectedManga(m);
                }}
                relativeTime={getRelativeTime(m.chapterUpdatedAt || m._updatedAt)} 
                isCompact={true}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
            <LayoutGrid size={64} className="mb-4 text-gray-600" />
            <p className="font-bold uppercase tracking-widest text-xs">ไม่พบมังฮวาที่ค้นหา</p>
          </div>
        )}
      </div>

      {/* --- 🔢 Pagination UI --- */}
      {!isLoading && totalPages > 1 && (
        <div className="max-w-7xl mx-auto mt-16 flex justify-center items-center gap-1.5 md:gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="p-2.5 md:p-3 rounded-xl bg-[#111] border border-white/5 text-gray-500 hover:text-white disabled:opacity-20 transition-all"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex gap-1.5 md:gap-2">
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-9 h-9 md:w-11 md:h-11 rounded-xl font-black text-[10px] md:text-xs transition-all ${currentPage === page ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 scale-105' : 'bg-[#111] border border-white/5 text-gray-500 hover:bg-white/5 hover:text-white'}`}
                  >
                    {page}
                  </button>
                );
              }
              if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="text-gray-700 px-1 pt-2">...</span>;
              }
              return null;
            })}
          </div>

          <button 
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="p-2.5 md:p-3 rounded-xl bg-[#111] border border-white/5 text-gray-500 hover:text-white disabled:opacity-20 transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* --- Modal --- */}
      <AnimatePresence>
        {selectedManga && (
          <MangaCard 
            manga={selectedManga} 
            isGlobalModal={true} 
            onClose={() => setSelectedManga(null)} 
            onMangaSwap={setSelectedManga} 
            allManga={allManga} 
          />
        )}
      </AnimatePresence>

      <style jsx global>{`
        .genre-scrollbar::-webkit-scrollbar { height: 4px; }
        .genre-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .genre-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 10px; }
        .genre-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.6); }
        
        /* Shimmer Animation */
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

