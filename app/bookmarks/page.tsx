"use client";

import { useState, useEffect, useMemo } from "react";
import { client } from "@/sanity/lib/client";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Home, LayoutGrid } from "lucide-react";
import Link from "next/link";
import MangaCard from "@/components/MangaCard";
import AgeGate from "@/components/AgeGate"; // ✨ 1. นำเข้า AgeGate

// 🕒 คำนวณเวลาอัปเดต
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

// ดึงข้อมูลใหม่ล่าสุดมาเช็กเวลา
const getBookmarksQuery = `*[_type == "manga"] {
  ..., "slug": slug.current, "coverUrl": cover.asset->url, "bannerUrl": bannerImage.asset->url,
  status, mangaType, chapterUpdatedAt, _updatedAt, mangaLinks[]{ platform, url, btnColor }
}`;

export default function BookmarksPage() {
  const [allManga, setAllManga] = useState<any[]>([]);
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [selectedManga, setSelectedManga] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [isAdultConfirmed, setIsAdultConfirmed] = useState(false);
  const [showAgeGate, setShowAgeGate] = useState(false); // ✨ 2. เพิ่ม State สำหรับเปิด/ปิดป๊อปอัปอายุ

  useEffect(() => {
    // โหลดรายชื่อที่เซฟไว้จากเบราว์เซอร์
    const stored = JSON.parse(localStorage.getItem('manga_bookmarks') || '[]');
    // ปรับลอจิกให้รองรับทั้งแบบ Array ของ Slug หรือ Array ของ Object
    const slugs = stored.map((item: any) => typeof item === 'string' ? item : item.slug);
    setSavedSlugs(slugs);
    
    const confirmed = localStorage.getItem("isAdultConfirmed") === "true";
    setIsAdultConfirmed(confirmed);

    // ดึงข้อมูลมังฮวาจาก Sanity
    client.fetch(getBookmarksQuery).then((data) => {
      setAllManga(data || []);
      setIsLoading(false);
    });
  }, []);

  // กรองเฉพาะเรื่องที่เราเซฟไว้ และเรียงลำดับเรื่องที่ "อัปเดตตอนใหม่ล่าสุด" ขึ้นมาบนสุด!
  const savedMangaList = useMemo(() => {
    if (allManga.length === 0 || savedSlugs.length === 0) return [];
    
    const filtered = allManga.filter(m => savedSlugs.includes(m.slug));
    return filtered.sort((a, b) => {
      const dateA = a.chapterUpdatedAt || a._updatedAt;
      const dateB = b.chapterUpdatedAt || b._updatedAt;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
  }, [allManga, savedSlugs]);

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-20 pt-6 px-3 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto mb-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-indigo-500 transition-colors mb-6 group">
          <div className="p-1.5 bg-white/5 rounded-full group-hover:bg-indigo-500/10 transition-colors"><Home size={16} /></div>
          <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">กลับหน้าหลัก</span>
        </Link>

        <div className="flex flex-col items-center text-center mb-12">
          <div className="p-4 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-500 mb-4 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
             <Heart size={32} className="fill-current" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter mb-2">
            ชั้นหนังสือ<span className="text-indigo-500">ของฉัน</span>
          </h1>
          <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">ติดตามการอัปเดตตอนใหม่ได้ที่นี่</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-4 md:gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[3/4.2] bg-[#111] animate-pulse rounded-xl md:rounded-2xl border border-white/5 overflow-hidden relative">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              </div>
            ))}
          </div>
        ) : savedMangaList.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-4 md:gap-5">
            {savedMangaList.map((m: any) => (
              <MangaCard 
                key={m.slug} manga={m} 
                onClick={() => {
                  // ✨ 3. เพิ่มการเช็คเรท 18+ ก่อนเปิดเรื่อง
                  if (m.mangaType === 'r18' && !isAdultConfirmed) {
                    setShowAgeGate(true);
                    return;
                  }
                  setSelectedManga(m);
                }}
                relativeTime={getRelativeTime(m.chapterUpdatedAt || m._updatedAt)} 
                isCompact={true}
                isBookmarkPage={true} // ✨ 4. เพิ่มบรรทัดนี้! สำคัญมากสำหรับเปิดป้ายแจ้งเตือนตอนใหม่
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 opacity-40">
            <LayoutGrid size={64} className="mb-4 text-gray-600" />
            <p className="font-bold uppercase tracking-widest text-xs text-center leading-loose">
              ยังไม่มีเรื่องในชั้นหนังสือ<br/>ลองกดรูปหัวใจ 🤍 ที่เรื่องที่ชอบสิครับ
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedManga && (
           <MangaCard manga={selectedManga} isGlobalModal={true} onClose={() => {
              const stored = JSON.parse(localStorage.getItem('manga_bookmarks') || '[]');
              const slugs = stored.map((item: any) => typeof item === 'string' ? item : item.slug);
              setSavedSlugs(slugs);
              setSelectedManga(null);
           }} onMangaSwap={setSelectedManga} allManga={allManga} />
        )}
      </AnimatePresence>

      {/* ✨ 5. วาง Component ยืนยันอายุ */}
      <AgeGate 
        isVisible={showAgeGate} 
        onConfirm={() => {
          localStorage.setItem("isAdultConfirmed", "true");
          setIsAdultConfirmed(true);
          setShowAgeGate(false);
        }} 
        onDecline={() => setShowAgeGate(false)} 
      />

      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}


