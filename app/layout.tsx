import type { Metadata } from "next";
import { Kanit } from "next/font/google"; 
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"; 
import { GoogleAnalytics } from '@next/third-parties/google'; 
import AnnouncementBar from "@/components/AnnouncementBar"; 
import { client } from "@/sanity/lib/client"; // ✨ 1. นำเข้า Sanity Client

export const dynamic = "force-dynamic";
// ✨ ตั้งค่าฟอนต์ Kanit ให้รองรับภาษาไทย
const kanit = Kanit({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ["thai", "latin"],
  variable: "--font-kanit",
});

export const metadata: Metadata = {
  title: "แปลรักข้างหมอน - คลังมังฮวาพรีเมียม",
  description: "งานแปลคุณภาพระดับพรีเมียม แหล่งรวมมังฮวาหลากหลายแนว ค้นหาง่าย เช็กคิวอัปเดตและวาร์ปอ่านได้ที่นี่",
  openGraph: {
    title: "แปลรักข้างหมอน - คลังมังฮวาพรีเมียม",
    description: "งานแปลคุณภาพระดับพรีเมียม แหล่งรวมมังฮวาหลากหลายแนว ค้นหาง่าย เช็กคิวอัปเดตและวาร์ปอ่านได้ที่นี่",
    url: "https://translatelover.vercel.app", 
    siteName: "แปลรักข้างหมอน",
    images: [
      {
        url: "/profile.png", 
        width: 800,
        height: 800,
        alt: "โลโก้ แปลรักข้างหมอน",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "แปลรักข้างหมอน - คลังมังฮวาพรีเมียม",
    description: "งานแปลคุณภาพระดับพรีเมียม คลังมังฮวาที่คัดสรรมาเพื่อคุณ",
    images: ["/profile.png"],
  },
};

// ✨ 2. เติม async เพื่อให้ Layout สามารถดึงข้อมูลได้
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  // ✨ 3. ดึงข้อมูลประกาศจากหลังบ้าน (สั่งปิด CDN ของ Sanity และปิด Cache ของ Next.js)
  const siteConfig = await client.withConfig({ useCdn: false }).fetch(
    `*[_type == "siteConfig"][0]{
      announcementText,
      isAnnouncementActive
    }`,
    {},
    { cache: 'no-store' } 
  );

  return (
    <html lang="th" suppressHydrationWarning> 
      <body className={`${kanit.variable} font-sans antialiased`} suppressHydrationWarning>
        
        {/* ✨ 4. ถ้าหลังบ้านเปิดใช้งานอยู่ ให้โชว์และส่งข้อความไปให้ Component */}
        {siteConfig?.isAnnouncementActive && siteConfig?.announcementText && (
           <AnnouncementBar text={siteConfig.announcementText} />
        )}
        
        {children}
        
        <Analytics /> 
        <GoogleAnalytics gaId="G-R7Q8Q4NW48" />
      </body>
    </html>
  );
}

