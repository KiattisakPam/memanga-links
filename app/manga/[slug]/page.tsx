import { client } from "@/sanity/lib/client";
import { Metadata } from "next";
import { redirect } from "next/navigation";

type Props = {
  params: { slug: string };
};

// ✨ ฟังก์ชันสำหรับดึงข้อมูลมาทำ SEO/Social Share
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const query = `*[_type == "manga" && slug.current == $slug][0]{
    title,
    englishTitle,
    description,
    "coverUrl": cover.asset->url
  }`;
  
  const manga = await client.fetch(query, { slug: params.slug });

  if (!manga) return { title: "Manga Not Found | แปลรักข้างหมอน" };

  return {
    title: `${manga.title} - แปลรักข้างหมอน`,
    description: manga.description,
    openGraph: {
      title: manga.title,
      description: manga.description,
      images: [manga.coverUrl],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: manga.title,
      description: manga.description,
      images: [manga.coverUrl],
    },
  };
}

export default function MangaPage({ params }: Props) {
  // หน้าหนี้มีไว้เพื่อ SEO เท่านั้น เมื่อคนกดเข้ามา ให้ส่งกลับหน้าแรกพร้อมเปิด Modal (ถ้าทำระบบ Modal แบบ URL ไว้)
  // หรือจะสร้างหน้า Detail สวยๆ ที่นี่ก็ได้ แต่เบื้องต้นให้ Redirect กลับหน้าหลักครับ
  redirect(`/?open=${params.slug}`);
}

