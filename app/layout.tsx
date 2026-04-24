import type { Metadata } from "next";
import { Kanit } from "next/font/google"; // ✨ เปลี่ยนมาใช้ฟอนต์ Kanit เพื่อความสวยงามพรีเมียม
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"; // ✨ 1. เรียกใช้งาน Analytics

// ✨ ตั้งค่าฟอนต์ Kanit ให้รองรับภาษาไทย
const kanit = Kanit({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ["thai", "latin"],
  variable: "--font-kanit",
});

// ✨ 2. แก้ Metadata: จุดนี้สำคัญมาก! คือสิ่งที่จะโชว์บน Google และตอนแชร์ลิงก์
export const metadata: Metadata = {
  title: "แปลรักข้างหมอน - คลังมังฮวาพรีเมียม",
  description: "คลังมังฮวาพรีเมียม งานแปลคุณภาพระดับพรีเมียม ค้นหาง่าย เช็กคิวอัปเดตและวาร์ปอ่านได้ที่นี่",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // เปลี่ยน lang="en" เป็น "th" เพื่อให้ถูกหลัก SEO ของเว็บไทย
    <html lang="th" suppressHydrationWarning> 
      <body className={`${kanit.variable} font-sans antialiased`} suppressHydrationWarning>
        {children}
        
        {/* ✨ 3. วาง Analytics ไว้ล่างสุดก่อนปิด body เพื่อเริ่มเก็บสถิติ */}
        <Analytics /> 
      </body>
    </html>
  );
}

