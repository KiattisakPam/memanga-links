import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. ข้ามการเช็ค TypeScript ตอน Build เพื่อให้ผ่านง่ายขึ้น (ตามที่แอดมินต้องการ)
  typescript: {
    ignoreBuildErrors: true,
  },

  // 2. ตั้งค่าให้เว็บอนุญาตโหลดรูปภาพจาก Sanity (สำคัญมาก! ถ้าไม่ใส่รูปจะไม่ขึ้น)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
    ],
  },

  /* หมายเหตุ: ส่วน eslint: { ignoreDuringBuilds: true } ถูกถอดออก 
     เพราะ Next.js v16 ไม่รองรับในคอนฟิกแล้ว
  */
};

export default nextConfig;

