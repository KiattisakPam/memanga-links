"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

// ✨ Props สำหรับโปรเจกต์ แปลรักข้างหมอน
interface AgeGateProps {
  isVisible: boolean;
  onConfirm: () => void;
  onDecline: () => void;
}

export default function AgeGate({ isVisible, onConfirm, onDecline }: AgeGateProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        // z-index สูงสุดเพื่อบังเนื้อหาทั้งหมด
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          
          {/* พื้นหลังดำสนิท 98% พร้อม Blur ความละเอียดสูง */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#050505]/98 backdrop-blur-xl"
          />
          
          {/* กล่องข้อความแจ้งเตือน */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-[#111] border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,1)] max-w-md w-full text-center overflow-hidden"
          >
            {/* ✨ ปรับแสง Decor ด้านหลังเป็นสี Indigo ตามธีมแปลรักข้างหมอน */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600/20 blur-[60px] rounded-full pointer-events-none" />
            
            <div className="flex justify-center mb-6 relative z-10">
              {/* ✨ ปรับสีไอคอนเป็น Indigo */}
              <div className="p-4 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                <AlertTriangle className="text-indigo-500 w-10 h-10" />
              </div>
            </div>

            <h2 className="text-2xl font-black text-white mb-3 uppercase italic tracking-tighter relative z-10">
              คำเตือน: เนื้อหาสำหรับผู้ใหญ่
            </h2>
            
            <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-8 relative z-10">
              เว็บไซต์นี้รวบรวมมังฮวาซึ่งอาจมีเนื้อหา ภาพประกอบ หรือภาษาที่เหมาะสำหรับผู้ใหญ่ 
              {/* ✨ ปรับสีข้อความเน้นย้ำเป็น Indigo */}
              <span className="block mt-2 text-indigo-400 font-bold">สงวนสิทธิ์เฉพาะผู้ที่มีอายุ 18 ปีบริบูรณ์ขึ้นไปเท่านั้น</span>
            </p>

            <div className="flex flex-col gap-3 relative z-10">
              {/* ✨ ปรับสีปุ่มหลักเป็น Indigo-600 */}
              <button 
                onClick={onConfirm}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-2xl uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
              >
                ฉันมีอายุ 18 ปีขึ้นไป
              </button>
              
              <button 
                onClick={onDecline}
                className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white font-bold text-xs rounded-2xl uppercase tracking-widest transition-all active:scale-95"
              >
                อายุยังไม่ถึง (กลับหน้าหลัก)
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

