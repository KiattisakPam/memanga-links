import {defineField, defineType} from 'sanity'

export const mangaType = defineType({
  name: 'manga',
  title: 'รายชื่อมังฮวา',
  type: 'document',
  fields: [
    // --- 🆔 ส่วนที่ 1: ข้อมูลระบุตัวตน (Identity) ---
    defineField({
      name: 'title',
      title: 'ชื่อเรื่อง (ภาษาไทย)',
      type: 'string',
      validation: (Rule) => Rule.required().error('ต้องใส่ชื่อเรื่องภาษาไทยด้วยนะแอด'),
    }),
    defineField({
      name: 'englishTitle',
      title: 'ชื่อภาษาอังกฤษ (English Title)',
      type: 'string',
      description: 'สำคัญ: ใช้สำหรับค้นหาและสร้าง URL',
    }),
    defineField({
      name: 'originalTitle',
      title: 'ชื่อต้นฉบับ (เกาหลี/ญี่ปุ่น)',
      type: 'string',
      description: 'ช่วยให้คนค้นเจอแม้ใช้ชื่อจากต้นทาง',
    }),
    defineField({
      name: 'altTitles',
      title: '🔍 ชื่อเรียกอื่นๆ (Alternative Titles)',
      type: 'array',
      of: [{type: 'string'}],
      description: 'ใส่ชื่ออื่นๆ หรือชื่อเล่นที่คนมักจะใช้ค้นหา (กด Enter เพื่อเพิ่มหลายชื่อได้)',
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: {
        source: 'englishTitle',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error('อย่าลืมกด Generate ลิงก์นะครับ'),
    }),

    // --- 🏷️ ส่วนที่ 2: การคัดกรอง (Filtering & Recommendation) ---
    defineField({
      name: 'mangaType',
      title: '🏷️ ประเภทเนื้อหา',
      type: 'string',
      options: {
        list: [
          {title: '🇰🇷 มันฮวา (Manhwa)', value: 'manhwa'},
          {title: '🔞 ติดเรท (Adult 18+)', value: 'r18'},
        ],
      },
      initialValue: 'manhwa',
    }),
    defineField({
      name: 'genres',
      title: '🎭 หมวดหมู่หลัก (Genres)',
      type: 'array',
      of: [{type: 'string'}],
      description: 'เลือกหมวดหมู่ให้ครบ ระบบจะใช้ค่านี้ไปหา "เรื่องแนวเดียวกัน" มาโชว์ใน Modal',
      options: {
        list: [
          {title: 'Action (แอคชั่น)', value: 'action'},
          {title: 'Romance (โรแมนติก)', value: 'romance'},
          {title: 'Fantasy (แฟนตาซี)', value: 'fantasy'},
          {title: 'Drama (ดราม่า)', value: 'drama'},
          {title: 'Comedy (ตลก)', value: 'comedy'},
          {title: 'Reincarnation (เกิดใหม่)', value: 'reincarnation'},
          {title: 'Villainess (นางร้าย)', value: 'villainess'},
          {title: 'System (ระบบ)', value: 'system'},
          {title: 'Murim (จอมยุทธ์)', value: 'murim'},
          {title: 'School Life (ชีวิตโรงเรียน)', value: 'school-life'},
          {title: 'Horror (สยองขวัญ)', value: 'horror'},
        ]
      }
    }),
    defineField({
      name: 'tags',
      title: '📌 แท็กพิเศษ (SEO Tags)',
      type: 'array',
      of: [{type: 'string'}],
      description: 'ใส่คีย์เวิร์ดที่คนชอบค้นหา เช่น #พระเอกเก่ง #ล้างแค้น',
      options: { layout: 'tags' }
    }),

    // --- 👤 ส่วนที่ 3: ผู้สร้าง (Creators) ---
    defineField({
      name: 'author',
      title: '✍️ ผู้แต่ง (Author)',
      type: 'string',
    }),
    defineField({
      name: 'artist',
      title: '🎨 นักวาด (Artist)',
      type: 'string',
    }),

    // --- 🖼️ ส่วนที่ 4: สื่อหลัก (Media) ---
    defineField({
      name: 'cover',
      title: 'รูปหน้าปก',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'bannerImage',
      title: '🖼️ ภาพ Banner (สไลด์หน้าแรก)',
      type: 'image',
      options: {hotspot: true},
      description: 'แนะนำขนาด 1200x400 เพื่อความพรีเมียม',
    }),
    defineField({
      name: 'description',
      title: 'เรื่องย่อ / บันทึกจากแอดมิน',
      type: 'text',
      rows: 5,
    }),

    // --- 📊 ส่วนที่ 5: สถานะและสถิติ ---
    defineField({
      name: 'status',
      title: 'สถานะเรื่อง',
      type: 'string',
      options: {
        list: [
          {title: '🔥 HOT (อัปเดตเดือด)', value: 'hot'},
          {title: '✍️ ปั่นตอนใหม่ (Ongoing)', value: 'ongoing'},
          {title: '⏳ พักซีซั่น (Hiatus)', value: 'hiatus'},
          {title: '✅ จบสมบูรณ์ (Completed)', value: 'completed'},
        ],
      },
      initialValue: 'ongoing',
    }),
    // ✨ เพิ่มฟิลด์: ตารางอัปเดตรายสัปดาห์ ✨
    defineField({
      name: 'updateDay',
      title: '📅 วันที่ลงตอนใหม่ (Schedule)',
      type: 'string',
      options: {
        list: [
          {title: 'วันจันทร์ (Monday)', value: 'monday'},
          {title: 'วันอังคาร (Tuesday)', value: 'tuesday'},
          {title: 'วันพุธ (Wednesday)', value: 'wednesday'},
          {title: 'วันพฤหัสบดี (Thursday)', value: 'thursday'},
          {title: 'วันศุกร์ (Friday)', value: 'friday'},
          {title: 'วันเสาร์ (Saturday)', value: 'saturday'},
          {title: 'วันอาทิตย์ (Sunday)', value: 'sunday'},
          {title: 'ยังไม่กำหนด (TBA)', value: 'tba'},
        ]
      },
      initialValue: 'tba',
    }),
    defineField({
      name: 'releaseYear',
      title: '📅 ปีที่ออกฉาย',
      type: 'string',
      description: 'เช่น 2024, 2025',
    }),
    defineField({
      name: 'latestChapter',
      title: 'ตอนล่าสุด (เช่น EP.25)',
      type: 'string',
    }),
    defineField({
      name: 'chapterUpdatedAt',
      title: '📅 วันที่อัปเดตตอนล่าสุด',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      description: 'สำคัญ: ให้กดเปลี่ยนวันที่ตรงนี้เฉพาะเวลาที่ "ลงตอนใหม่" เท่านั้น เพื่อให้ระบบเรียงลำดับในหน้าแรกถูกต้อง',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
      }
    }),
    defineField({
      name: 'viewCount',
      title: 'ยอดเข้าชมรวม',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'isFeatured',
      title: '⭐ แนะนำเรื่องนี้ (โชว์บน Banner สไลด์)',
      type: 'boolean',
      initialValue: false,
    }),

    // --- 🔗 ส่วนที่ 6: ช่องทางการอ่าน ---
    defineField({
      name: 'mangaLinks',
      title: 'ช่องทางอ่านมังฮวา',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'linkItem',
          fields: [
            {name: 'platform', title: 'ชื่อเว็บ/แอป', type: 'string'},
            {name: 'url', title: 'URL ลิงก์ตรง', type: 'url'},
            {
              name: 'btnColor',
              title: 'สีของปุ่ม (Identity Color)',
              type: 'string',
              options: {
                list: [
                  {title: 'ม่วง Indigo (TL Default)', value: '#6366f1'},
                  {title: 'ม่วงเข้ม Violet (Premium)', value: '#8b5cf6'},
                  {title: 'ส้ม (Kairew / Kaedang)', value: '#f97316'},
                  {title: 'แดง (ReadToon)', value: '#ef4444'},
                  {title: 'ม่วงอ่อน (ReadRealm)', value: '#a855f7'},
                  {title: 'น้ำเงิน (Official / Inter)', value: '#3b82f6'},
                  {title: 'เขียว (Webtoon)', value: '#22c55e'},
                  {title: 'ดำ (Onyx)', value: '#111111'},
                ]
              },
              initialValue: '#6366f1'
            }
          ]
        },
      ],
    }),
    defineField({
      name: 'novelUrl',
      title: 'ลิงก์อ่านนิยาย (ถ้ามี)',
      type: 'url',
    }),

    // --- 🔗 ส่วนที่ 7: ระบบความสัมพันธ์ (Yaksha Style) ---
    defineField({
      name: 'relatedStories',
      title: 'เรื่องที่เกี่ยวข้องกัน (รูปแบบอื่น)',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'manga'}]}],
      description: 'เช่น ถ้าเรื่องนี้เป็นมังฮวา ให้เลือกเรื่องที่เป็น "ฉบับนิยาย" ของมันมาใส่',
    }),

    // --- 📄 ส่วนที่ 8: SEO Metadata ---
    defineField({
      name: 'seoDescription',
      title: 'SEO Meta Description',
      type: 'text',
      rows: 2,
      description: 'ข้อความที่จะโชว์บน Google Search (ไม่เกิน 160 ตัว)',
      validation: (Rule) => Rule.max(160),
    }),
  ],

  // --- 🎨 การแสดงผล Preview ในหลังบ้าน ---
  preview: {
    select: {
      title: 'title',
      subtitle: 'latestChapter',
      media: 'cover',
      type: 'mangaType',
      updatedDate: 'chapterUpdatedAt', 
    },
    prepare({title, subtitle, media, type, updatedDate}) {
      const typeLabel = type === 'r18' ? '🔞 R18' : '🇰🇷 Manhwa'
      const dateStr = updatedDate ? new Date(updatedDate).toLocaleDateString('th-TH') : 'ไม่มีวันที่'
      
      return {
        title: title || 'ยังไม่มีชื่อเรื่อง',
        subtitle: `${typeLabel} | ${subtitle ? `ปัจจุบัน: ${subtitle}` : 'ยังไม่ได้ลงตอน'} (${dateStr})`,
        media: media,
      }
    },
  },
})

