"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Home as HomeIcon, 
  BookOpen, 
  Layers, 
  Heart, 
  ShieldAlert, 
  Search, 
  DollarSign 
} from "lucide-react";

// --- 🛡️ Custom Brand Icons ---
const FacebookIcon = () => (
  <svg className="mr-2" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);

const TikTokIcon = () => (
  <svg className="mr-2" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.53 1.53-.3 2.7-1.67 2.67-3.22.03-5.45 0-10.89.02-16.34z"/></svg>
);

const YoutubeIcon = () => (
  <svg className="mr-2" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
);

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.open(`https://memanga.rf.gd/?s=${encodeURIComponent(searchQuery)}`, "_blank");
    }
  };

  // รวม Icon ไว้ใน Array เลย เพื่อกัน Error เวลาแก้ชื่อภาษาไทย
  const mainLinks = [
    { title: 'เพจ Facebook แปลรักข้างหมอน', url: 'https://www.facebook.com/share/1CL7rzs25b/?mibextid=wwXIfr', color: 'bg-[#1877F2]', icon: <FacebookIcon /> },
    { title: 'TikTok แปลรักข้างหมอน', url: 'https://www.tiktok.com/@translatelover?_r=1&_t=ZS-95Z1UuW6LG4', color: 'bg-[#121212] border border-gray-700', icon: <TikTokIcon /> },
    { title: 'Youtube แปลรักข้างหมอน', url: '', color: 'bg-[#FF0000]', icon: <YoutubeIcon /> },
  ];

  const paidLinks = [
    { 
      title: 'ReadToon', 
      url: 'https://readtoon.com/profile/translatelover', 
      color: 'bg-[#4a1a8a]/30 text-[#c084fc] border-[#a855f7]/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
    },
    { 
      title: 'Kairew', 
      url: 'https://kairew.com/writer-profile/translatelover', 
      color: 'bg-[#ea580c]/30 text-[#fb923c] border-[#f97316]/50 shadow-[0_0_15px_rgba(249,115,22,0.15)]' 
    },
  ];

  // ปรับความเร็วการตอบสนองให้ "ติดมือ" (Snappy)
  const fastTransition = { duration: 0.1, ease: "easeOut" };

  return (
    <div className="fixed inset-0 h-[100dvh] w-screen bg-[#050505] text-white flex flex-col items-center justify-between px-6 py-5 overflow-hidden overscroll-none font-sans">
      
      {/* Background Decor */}
      <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[30%] bg-red-900/10 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[30%] bg-blue-900/5 blur-[80px] rounded-full pointer-events-none" />

      {/* --- 👤 Header --- */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center">
        <div className="relative w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-red-700 to-red-950 mb-2 shadow-lg">
          <div className="w-full h-full rounded-full overflow-hidden border-2 border-black">
            <img src="/profile.png" alt="Profile" className="w-full h-full object-cover" fetchPriority="high" />
          </div>
        </div>
        <h1 className="text-xl font-black tracking-tight leading-none">แปลรักข้างหมอน</h1>
        <p className="text-gray-400 text-[9px] font-bold uppercase tracking-[0.15em] mt-1.5 opacity-90">ศูนย์รวมผลงานแปลคุณภาพ</p>
      </motion.div>

      {/* --- 🔍 Search Bar --- */}
      <motion.form onSubmit={handleSearch} className="w-full max-w-md relative">
        <input 
          type="text" 
          placeholder="ค้นชื่อเรื่องที่นี่..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 pl-5 pr-12 text-sm focus:outline-none focus:border-red-600/40 transition-all placeholder:text-gray-700 font-medium"
        />
        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-red-500 transition-colors">
          <Search size={16} />
        </button>
      </motion.form>

      {/* --- 📱 Content Area --- */}
      <div className="w-full max-w-md flex flex-col gap-4 overflow-hidden">
        
        {/* ช่องทางติดตามหลัก (Official Channels) */}
        <div className="space-y-2.5">
          <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] block ml-1 text-center opacity-80">ช่องทางติดตามหลัก</span>
          {mainLinks.map((link, i) => (
            <motion.a 
              key={i} href={link.url} target="_blank"
              whileHover={{ scale: 1.02, filter: "brightness(1.2)" }}
              whileTap={{ scale: 0.98 }}
              transition={fastTransition}
              className={`${link.color} flex items-center justify-center py-3.5 rounded-2xl font-bold text-sm shadow-md border border-white/5 transition-all`}
            >
              {link.icon} {link.title}
            </motion.a>
          ))}
        </div>

        {/* สนับสนุนผู้แปล (Support Us) */}
        <div className="space-y-2">
          <span className="text-[9px] font-black text-yellow-500 uppercase tracking-[0.2em] text-center block opacity-90">อ่านล่วงหน้าได้ที่นี่</span>
          <div className="grid grid-cols-2 gap-3">
            {paidLinks.map((link, i) => (
              <motion.a 
                key={i} href={link.url}
                whileHover={{ y: -3, filter: "brightness(1.2)" }}
                whileTap={{ scale: 0.95 }}
                transition={fastTransition}
                className={`${link.color} flex items-center justify-center py-3 rounded-xl text-[11px] font-extrabold border transition-all`}
              >
                <DollarSign size={13} className="mr-1" /> {link.title}
              </motion.a>
            ))}
          </div>
        </div>

        {/* หมวดหมู่แนะนำ (Quick Explorer) */}
        <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-4 shadow-2xl backdrop-blur-sm">
          <span className="block text-center text-[9px] font-black text-red-600 uppercase tracking-[0.2em] mb-3 opacity-90">เลือกอ่านตามหมวดหมู่</span>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { title: 'มังงะ', icon: <BookOpen size={14} className="text-blue-400" />, url: 'http://memanga.rf.gd/?genre=manga' },
              { title: 'มันฮวา', icon: <Layers size={14} className="text-green-400" />, url: 'http://memanga.rf.gd/?genre=manhwa' },
              { title: 'สายวาย', icon: <Heart size={14} className="text-pink-400" />, url: 'http://memanga.rf.gd/?genre=bl' },
              { title: 'ติดเรท', icon: <ShieldAlert size={14} className="text-red-600" />, url: 'http://memanga.rf.gd/?genre=18plus' },
            ].map((cat, i) => (
              <motion.a 
                key={i} 
                href={cat.url}
                whileHover={{ y: -3, scale: 1.1 }}
                transition={fastTransition}
                className="flex flex-col items-center gap-1 opacity-80 hover:opacity-100 cursor-pointer"
              >
                {cat.icon}
                <span className="text-[8px] font-bold">{cat.title}</span>
              </motion.a>
            ))}
          </div>
          
          <motion.a 
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(139, 0, 0, 0.5)" }} 
            whileTap={{ scale: 0.98 }}
            transition={fastTransition}
            href="https://memanga.rf.gd"
            className="relative bg-gradient-to-br from-[#8B0000] via-[#5b0000] to-[#3a0000] w-full flex items-center justify-center py-4 rounded-2xl font-black text-sm shadow-xl border border-red-900/30 overflow-hidden group"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <HomeIcon className="mr-2 text-red-500/80" size={18} /> เข้าหน้าหลัก MeManga รวมทุกหมด
          </motion.a>
        </div>

      </div>

      <footer className="opacity-10 text-[7px] font-black tracking-[0.5em] uppercase text-center mt-2">
        DEV BY แปลรักข้างหมอน • 2026
      </footer>

      <style jsx>{` @keyframes shimmer { 100% { transform: translateX(100%); } } `}</style>
    </div>
  );
}

