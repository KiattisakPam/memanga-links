"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectHandler({ slug }: { slug: string }) {
  const router = useRouter();
  
  useEffect(() => {
    // ใช้ Client-side redirect แทน เพื่อให้ Bot ของเฟส/ไลน์ ทันได้อ่านข้อมูลปกก่อน
    router.replace(`/?open=${slug}`);
  }, [slug, router]);

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white font-sans relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-indigo-600/20 blur-[60px] rounded-full pointer-events-none" />
      
      <div className="w-10 h-10 border-[3px] border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-6 relative z-10" />
      
      <p className="text-[10px] md:text-xs text-indigo-300 animate-pulse font-black tracking-[0.3em] uppercase relative z-10">
        กำลังพาไปหน้าเรื่อง...
      </p>
    </div>
  );
}

