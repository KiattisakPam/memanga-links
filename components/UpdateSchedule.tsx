"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "lucide-react";

const days = [
  { label: "MON", value: "monday" },
  { label: "TUE", value: "tuesday" },
  { label: "WED", value: "wednesday" },
  { label: "THU", value: "thursday" },
  { label: "FRI", value: "friday" },
  { label: "SAT", value: "saturday" },
  { label: "SUN", value: "sunday" },
];

export default function UpdateSchedule({ allManga, onMangaClick }: any) {
  // ดึงวันปัจจุบัน (0 = Sunday, 1 = Monday...)
  const todayIndex = new Date().getDay();
  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const [selectedDay, setSelectedDay] = useState(dayNames[todayIndex]);

  const filteredManga = allManga.filter((m: any) => m.updateDay === selectedDay);

  return (
    <div className="w-full bg-[#0D0D0D] border border-white/5 rounded-[2.5rem] p-6 md:p-8 shadow-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-500">
          <Calendar size={20} />
        </div>
        <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">ตารางอัปเดตรายสัปดาห์</h2>
      </div>

      {/* Day Selector */}
      <div className="flex justify-between gap-1 mb-8 overflow-x-auto no-scrollbar pb-2">
        {days.map((day) => (
          <button
            key={day.value}
            onClick={() => setSelectedDay(day.value)}
            className={`flex-1 min-w-[60px] py-3 rounded-2xl text-[10px] font-black transition-all ${
              selectedDay === day.value 
              ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] scale-105" 
              : "bg-white/5 text-gray-500 hover:bg-white/10"
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>

      {/* Manga List in Schedule */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AnimatePresence mode="wait">
          {filteredManga.length > 0 ? (
            filteredManga.map((m: any) => (
              <motion.div
                key={m.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={() => onMangaClick(m)}
                className="flex gap-4 p-3 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-indigo-500/10 transition-all cursor-pointer group"
              >
                <img src={m.coverUrl} className="w-14 h-20 object-cover rounded-xl shadow-lg border border-white/10 group-hover:scale-105 transition-transform" />
                <div className="flex flex-col justify-center min-w-0">
                  <h4 className="text-[13px] font-bold text-gray-100 truncate uppercase italic">{m.title}</h4>
                  <p className="text-[10px] text-indigo-400 font-black mt-1 uppercase tracking-widest">
                    EP.{m.latestChapter || '??'}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-10 text-center text-gray-600 text-[11px] font-bold uppercase italic tracking-widest border border-dashed border-white/5 rounded-[2rem]">
              ไม่มีคิวอัปเดตในวันนี้
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

