import { client } from "@/sanity/lib/client";
import { Metadata } from "next";
import RedirectHandler from "./RedirectHandler";

type Props = {
  params: Promise<{ slug: string }>;
};

// ✨ ฟังก์ชันสำหรับดึงข้อมูลมาทำ SEO/Social Share
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  const query = `*[_type == "manga" && slug.current == $slug][0]{
    title,
    description,
    "coverUrl": cover.asset->url,
    "siteTitle": "แปลรักข้างหมอน" 
  }`;
  
  const manga = await client.fetch(query, { slug });

  if (!manga) return { title: "ไม่พบผลงานที่ค้นหา | แปลรักข้างหมอน" };

  const siteDescription = manga.description || `อ่านมังฮวาเรื่อง ${manga.title} งานแปลคุณภาพระดับพรีเมียมได้ที่นี่ - แปลรักข้างหมอน`;

  // ✨ Pro-tip: หากต้องการความปลอดภัยสูงสุด (Anti-Ban) ให้ใช้ "/profile.png" 
  // แต่ถ้าต้องการเน้นดึงดูดด้วยรูปเรื่อง ให้ใช้ "manga.coverUrl"
  const shareImage = "/profile.png"; 

  return {
    title: `${manga.title} - แปลรักข้างหมอน`,
    description: siteDescription,
    alternates: {
      canonical: `/manga/${slug}`,
    },
    openGraph: {
      title: `${manga.title} | แปลรักข้างหมอน`,
      description: siteDescription,
      siteName: "แปลรักข้างหมอน",
      images: [
        {
          url: shareImage, // ✨ ใช้รูปที่ตั้งค่าไว้เพื่อความปลอดภัยของโดเมน
          width: 1200,
          height: 630,
          alt: manga.title,
        },
      ],
      locale: "th_TH",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: manga.title,
      description: siteDescription,
      images: [shareImage],
    },
  };
}

export default async function MangaPage({ params }: Props) {
  const { slug } = await params;
  
  // ✨ แสดงหน้าโหลดดิ้งพรีเมียม (RedirectHandler) ก่อนเด้งไปหน้าแรกเพื่อเปิด Modal
  return <RedirectHandler slug={slug} />;
}

