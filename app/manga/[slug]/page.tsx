import { client } from "@/sanity/lib/client";
import { Metadata } from "next";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>; // ✨ ปรับเป็น Promise
};

// ✨ ฟังก์ชันสำหรับดึงข้อมูลมาทำ SEO/Social Share
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; // ✨ ต้อง await params ก่อนนำไปใช้
  
  const query = `*[_type == "manga" && slug.current == $slug][0]{
    title,
    description,
    "coverUrl": cover.asset->url
  }`;
  
  const manga = await client.fetch(query, { slug });

  if (!manga) return { title: "Manga Not Found | แปลรักข้างหมอน" };

  return {
    title: `${manga.title} - แปลรักข้างหมอน`,
    description: manga.description,
    openGraph: {
      title: manga.title,
      description: manga.description,
      images: [
        {
          url: manga.coverUrl,
          width: 800,
          height: 1200,
          alt: manga.title,
        },
      ],
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

export default async function MangaPage({ params }: Props) {
  const { slug } = await params; // ✨ await ตรงนี้ด้วย
  
  // ส่งกลับหน้าหลักพร้อมสั่งเปิด Modal
  redirect(`/?open=${slug}`);
}

