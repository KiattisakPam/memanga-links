"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

function RedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get("url");
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (!url) { router.push("/"); return; }

    const timer = setInterval(() => {
      setCount((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    if (count === 0) { window.location.href = url; }
    return () => clearInterval(timer);
  }, [count, url, router]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-[#111] p-10 rounded-[3rem] border border-white/10 shadow-2xl max-w-sm w-full"
      >
        <h2 className="text-xl font-black mb-2 uppercase tracking-tighter">กำลังเตรียมหน้าอ่าน...</h2>
        <p className="text-gray-500 text-[10px] mb-8 uppercase font-bold tracking-widest">โปรดรอสักครู่</p>
        
        <div className="relative flex items-center justify-center mb-8">
           <div className="text-6xl font-black text-red-600 tabular-nums">{count}</div>
           <Loader2 className="absolute w-24 h-24 text-red-600/20 animate-spin" strokeWidth={1} />
        </div>

        <p className="text-gray-400 text-xs leading-relaxed italic">
          "สนับสนุนผู้แปลได้โดยการอ่านในช่องทางที่ถูกต้องนะครับ" <br/>
          <span className="text-red-500/50 not-italic font-black mt-2 block">- TRANSLATELOVER -</span>
        </p>
      </motion.div>
    </div>
  );
}

export default function RedirectPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RedirectContent />
    </Suspense>
  );
}

