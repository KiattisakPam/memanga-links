"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

function RedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawUrl = searchParams.get("url");
  const [count, setCount] = useState(3);

  useEffect(() => {
    // ป้องกันกรณี URL เป็น null หรือไม่ได้ส่งมา
    if (!rawUrl) { 
      router.push("/"); 
      return; 
    }

    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // ทำการ Redirect เมื่อนับถึง 0
          window.location.href = decodeURIComponent(rawUrl);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [rawUrl, router]);

  return (
    /* ✨ ใช้ min-h-dvh เพื่อให้กลางจอ 100% แม้ในมือถือที่มีแถบ Browser ✨ */
    <div className="min-h-dvh w-full bg-[#050505] text-white flex items-center justify-center p-6 font-sans">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="bg-[#111] p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] max-w-[340px] w-full text-center relative overflow-hidden"
      >
        {/* Effect พื้นหลังจางๆ ใน Card */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-600/5 blur-[50px] rounded-full" />
        
        <h2 className="text-xl md:text-2xl font-black mb-2 uppercase tracking-tighter italic">
          กำลังเตรียมหน้าอ่าน...
        </h2>
        <p className="text-gray-500 text-[10px] mb-10 uppercase font-bold tracking-[0.2em] opacity-60">
          SECURE REDIRECTING
        </p>
        
        {/* Countdown Area */}
        <div className="relative flex items-center justify-center mb-10">
           <div className="text-7xl font-black text-red-600 tabular-nums drop-shadow-[0_0_15px_rgba(220,38,38,0.3)]">
             {count}
           </div>
           {/* วงแหวน Loading หมุนรอบตัวเลข */}
           <Loader2 className="absolute w-28 h-28 text-red-600/10 animate-spin" strokeWidth={1} />
           <motion.div 
             initial={{ rotate: 0 }}
             animate={{ rotate: 360 }}
             transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
             className="absolute w-20 h-20 border-2 border-red-600/20 border-t-red-600 rounded-full"
           />
        </div>

        {/* Support Text */}
        <div className="space-y-4">
          {/* <p className="text-gray-400 text-xs leading-relaxed italic px-2">
            "สนับสนุนผู้แปลได้โดยการอ่านในช่องทางที่ถูกต้องนะครับ"
          </p> */}
          
          <div className="pt-2">
            <span className="text-red-500/40 text-[10px] font-black tracking-[0.4em] uppercase">
              - TRANSLATELOVER -
            </span>
          </div>
        </div>

        {/* Progress Bar ด้านล่างสุดของ Card */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
           <motion.div 
             initial={{ width: "0%" }}
             animate={{ width: "100%" }}
             transition={{ duration: 3, ease: "linear" }}
             className="h-full bg-red-600"
           />
        </div>
      </motion.div>

      {/* Footer Decoration */}
      <div className="absolute bottom-8 w-full text-center">
         <p className="text-[9px] font-bold text-gray-700 uppercase tracking-[0.5em]">
           Translating Love Beside The Pillow
         </p>
      </div>
    </div>
  );
}

export default function RedirectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
      </div>
    }>
      <RedirectContent />
    </Suspense>
  );
}

