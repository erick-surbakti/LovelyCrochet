import type { Locale, StaticRouteKey } from './routes';

export interface PageMeta {
  /** <title>, ≤ 60 chars */
  title: string;
  /** meta description, ≤ 155 chars */
  description: string;
  /** Short label for breadcrumbs and the OG image kicker */
  label: string;
  /** Visible H1 */
  h1: string;
}

export const pageMeta: Record<StaticRouteKey, Record<Locale, PageMeta>> = {
  home: {
    id: {
      title: 'Simpul Mungil: Crochet & Rajutan Handmade Bekasi',
      description:
        'Buket bunga rajut, boneka amigurumi, tas rajut, dan kado handmade dari Bekasi. Bisa custom, same-day Jabodetabek, kirim ke seluruh Indonesia.',
      label: 'Beranda',
      h1: 'Rajutan tangan yang mungil, dari Bekasi.',
    },
    en: {
      title: 'Simpul Mungil: Handmade Crochet from Bekasi, Indonesia',
      description:
        'Crochet flower bouquets, amigurumi, crochet bags and handmade gifts from Bekasi. Custom orders, same-day Jabodetabek, shipping across Indonesia.',
      label: 'Home',
      h1: 'Mungil means little: hand-crocheted with love in Bekasi.',
    },
  },
  shop: {
    id: {
      title: 'Koleksi Rajutan Handmade | Simpul Mungil',
      description:
        'Semua koleksi rajutan handmade Simpul Mungil. Boneka amigurumi, gantungan kunci, buket bunga rajut, tas, dan renda rajut. Bisa custom.',
      label: 'Koleksi',
      h1: 'Koleksi rajutan tangan',
    },
    en: {
      title: 'Shop Handmade Crochet | Simpul Mungil',
      description:
        'Shop every Simpul Mungil piece: amigurumi, keychains, crochet bouquets, bags and lace. Custom orders welcome.',
      label: 'Shop',
      h1: 'The hand-crocheted collection',
    },
  },
  custom: {
    id: {
      title: 'Pesan Rajutan Custom: Boneka, Buket & Nama | Simpul Mungil',
      description:
        'Rancang rajutan custom-mu sendiri. Pilih jenis, ukuran, warna, dan personalisasi, lalu kirim lewat WhatsApp. DP 50%, pengerjaan 3–14 hari kerja.',
      label: 'Pesanan Custom',
      h1: 'Rancang rajutanmu sendiri',
    },
    en: {
      title: 'Custom Crochet Orders: Dolls, Bouquets & Names | Simpul Mungil',
      description:
        'Design your own crochet piece. Pick the type, size, colours and personalisation, then send it on WhatsApp. 50% deposit, 3–14 working days.',
      label: 'Custom Order',
      h1: 'Design your own crochet piece',
    },
  },
  gifts: {
    id: {
      title: 'Ide Kado Handmade per Momen | Simpul Mungil',
      description:
        'Panduan kado rajut handmade untuk wisuda, ulang tahun, anniversary, Valentine, Hari Ibu, Lebaran, baby shower, dan kado korporat.',
      label: 'Hadiah',
      h1: 'Kado rajut untuk setiap momen',
    },
    en: {
      title: 'Handmade Gift Guides by Occasion | Simpul Mungil',
      description:
        "Handmade crochet gift guides for graduations, birthdays, anniversaries, Valentine's Day, Mother's Day, Eid, baby showers and corporate gifts.",
      label: 'Gifts',
      h1: 'Crochet gifts for every occasion',
    },
  },
  about: {
    id: {
      title: 'Tentang Simpul Mungil, Studio Rajut di Bekasi',
      description:
        'Kenalan dengan Simpul Mungil, studio rajut rumahan di Bekasi. Cerita, nilai, filosofi bahan, dan proses di balik setiap rajutan tangan kami.',
      label: 'Tentang Kami',
      h1: 'Setiap simpul bercerita',
    },
    en: {
      title: 'About Simpul Mungil, a Crochet Studio in Bekasi',
      description:
        'Meet Simpul Mungil, a home crochet studio in Bekasi, Indonesia. Our story, values, materials and the process behind every hand-made piece.',
      label: 'About',
      h1: 'Every stitch tells a story',
    },
  },
  journal: {
    id: {
      title: 'Jurnal Rajut: Tips Merajut & Merawat | Simpul Mungil',
      description:
        'Artikel seputar merajut. Jenis benang, tusuk dasar untuk pemula, cara merawat rajutan, ide kado, dan cerita di balik layar studio kami.',
      label: 'Jurnal',
      h1: 'Jurnal rajut',
    },
    en: {
      title: 'Crochet Journal: Tips, Care & Stories | Simpul Mungil',
      description:
        'Articles about crochet. Yarn types, beginner stitches, caring for crochet, gift ideas and behind-the-scenes stories from our studio.',
      label: 'Journal',
      h1: 'The crochet journal',
    },
  },
  patterns: {
    id: {
      title: 'Pola Rajut Gratis Bahasa Indonesia | Simpul Mungil',
      description:
        'Pola rajut gratis dalam bahasa Indonesia, siap cetak. Lengkap dengan daftar bahan, ukuran hakpen, gauge, singkatan, dan instruksi per putaran.',
      label: 'Pola Gratis',
      h1: 'Pola rajut gratis',
    },
    en: {
      title: 'Free Crochet Patterns, Printable | Simpul Mungil',
      description:
        'Free printable crochet patterns with materials, hook size, gauge, abbreviations and round-by-round instructions. Beginner friendly.',
      label: 'Free Patterns',
      h1: 'Free crochet patterns',
    },
  },
  glossary: {
    id: {
      title: 'Kamus Rajut: Istilah & Singkatan Crochet A–Z',
      description:
        'Kamus istilah rajut A–Z dalam bahasa Indonesia dengan padanan bahasa Inggris dan perbedaan istilah US vs UK. Rantai, tusuk tunggal, magic ring, dan lainnya.',
      label: 'Kamus Rajut',
      h1: 'Kamus rajut A–Z',
    },
    en: {
      title: 'Crochet Glossary: US vs UK Terms A–Z | Simpul Mungil',
      description:
        'An A–Z crochet glossary with Indonesian equivalents and US vs UK terminology. Chain, single crochet, magic ring, increases and more.',
      label: 'Crochet Glossary',
      h1: 'Crochet glossary A–Z',
    },
  },
  care: {
    id: {
      title: 'Cara Mencuci & Merawat Rajutan | Simpul Mungil',
      description:
        'Panduan mencuci, mengeringkan, menyimpan, dan membentuk ulang rajutan untuk setiap jenis benang. Cotton milk, katun, acrylic, polyester, dan wol.',
      label: 'Panduan Perawatan',
      h1: 'Panduan perawatan rajutan',
    },
    en: {
      title: 'How to Wash & Care for Crochet | Simpul Mungil',
      description:
        'How to wash, dry, store and reshape crochet for each fibre. Milk cotton, cotton, acrylic, polyester and wool, with a quick reference table.',
      label: 'Care Guide',
      h1: 'Crochet care guide',
    },
  },
  size: {
    id: {
      title: 'Panduan Ukuran Boneka, Renda & Tas Rajut | Simpul Mungil',
      description:
        'Ukuran boneka rajut Simpul Mungil, cara mengukur panjang renda untuk baju, dan patokan ukuran tas rajut custom. Semua dalam sentimeter.',
      label: 'Panduan Ukuran',
      h1: 'Panduan ukuran',
    },
    en: {
      title: 'Size Guide: Crochet Dolls, Lace & Bags | Simpul Mungil',
      description:
        'Simpul Mungil doll sizes, how to measure lace for your clothes, and size guidelines for custom crochet bags. All in centimetres.',
      label: 'Size Guide',
      h1: 'Size guide',
    },
  },
  faq: {
    id: {
      title: 'FAQ: Pemesanan, Pembayaran & Pengiriman | Simpul Mungil',
      description:
        'Jawaban untuk pertanyaan seputar cara pesan, pembayaran QRIS dan transfer, pengiriman same-day, pesanan custom, pengembalian, dan perawatan rajutan.',
      label: 'FAQ',
      h1: 'Pertanyaan yang sering ditanyakan',
    },
    en: {
      title: 'FAQ: Ordering, Payment & Shipping | Simpul Mungil',
      description:
        'Answers about ordering, paying by QRIS or transfer, same-day delivery, custom orders, returns and caring for your crochet.',
      label: 'FAQ',
      h1: 'Frequently asked questions',
    },
  },
  shipping: {
    id: {
      title: 'Pengiriman & Pengembalian | Simpul Mungil',
      description:
        'Info pengiriman same-day Bekasi & Jabodetabek, kurir ke seluruh Indonesia, pengiriman internasional, serta kebijakan penukaran dan pengembalian.',
      label: 'Pengiriman & Pengembalian',
      h1: 'Pengiriman & pengembalian',
    },
    en: {
      title: 'Shipping & Returns | Simpul Mungil',
      description:
        'Same-day delivery in Bekasi and Jabodetabek, couriers across Indonesia, international shipping, and our exchange and returns policy.',
      label: 'Shipping & Returns',
      h1: 'Shipping & returns',
    },
  },
  privacy: {
    id: {
      title: 'Kebijakan Privasi | Simpul Mungil',
      description:
        'Bagaimana Simpul Mungil mengumpulkan, memakai, dan melindungi data pribadimu saat kamu memesan atau mendaftar kabar terbaru.',
      label: 'Kebijakan Privasi',
      h1: 'Kebijakan privasi',
    },
    en: {
      title: 'Privacy Policy | Simpul Mungil',
      description:
        'How Simpul Mungil collects, uses and protects your personal data when you order or sign up for updates.',
      label: 'Privacy Policy',
      h1: 'Privacy policy',
    },
  },
  terms: {
    id: {
      title: 'Syarat & Ketentuan | Simpul Mungil',
      description:
        'Syarat dan ketentuan pemesanan di Simpul Mungil, termasuk harga, pembayaran, pesanan custom, hak cipta desain, dan penyelesaian masalah.',
      label: 'Syarat & Ketentuan',
      h1: 'Syarat & ketentuan',
    },
    en: {
      title: 'Terms & Conditions | Simpul Mungil',
      description:
        'Terms for ordering from Simpul Mungil, covering prices, payment, custom orders, design copyright and resolving problems.',
      label: 'Terms & Conditions',
      h1: 'Terms & conditions',
    },
  },
  contact: {
    id: {
      title: 'Kontak Simpul Mungil: WhatsApp & Email',
      description:
        'Hubungi Simpul Mungil lewat WhatsApp atau email. Studio rumahan di Kota Bekasi, balas chat Senin–Sabtu 09.00–18.00 WIB.',
      label: 'Kontak',
      h1: 'Yuk, ngobrol!',
    },
    en: {
      title: 'Contact Simpul Mungil: WhatsApp & Email',
      description:
        'Reach Simpul Mungil on WhatsApp or email. Home studio in Kota Bekasi, chat replies Monday–Saturday 09:00–18:00 WIB.',
      label: 'Contact',
      h1: "Let's talk!",
    },
  },
  bekasi: {
    id: {
      title: 'Crochet & Rajutan Handmade di Bekasi | Simpul Mungil',
      description:
        'Rajutan handmade dari Kota Bekasi. Boneka rajut, buket bunga rajut, dan kado custom dengan pengiriman same-day ke seluruh Bekasi, Cikarang, dan Jabodetabek.',
      label: 'Rajutan Bekasi',
      h1: 'Crochet & rajutan handmade di Bekasi',
    },
    en: {
      title: 'Handmade Crochet in Bekasi, Same-Day Delivery | Simpul Mungil',
      description:
        'Handmade crochet from Kota Bekasi. Amigurumi, bouquets and custom gifts with same-day delivery across Bekasi, Cikarang and Jabodetabek.',
      label: 'Crochet in Bekasi',
      h1: 'Handmade crochet in Bekasi',
    },
  },
  search: {
    id: {
      title: 'Cari di Simpul Mungil',
      description: 'Cari produk, artikel, pola gratis, dan istilah rajut di Simpul Mungil.',
      label: 'Cari',
      h1: 'Cari',
    },
    en: {
      title: 'Search Simpul Mungil',
      description: 'Search products, articles, free patterns and crochet terms on Simpul Mungil.',
      label: 'Search',
      h1: 'Search',
    },
  },
  thanks: {
    id: {
      title: 'Terima Kasih Sudah Mendaftar | Simpul Mungil',
      description:
        'Pendaftaranmu sudah kami terima. Pola tulip mini gratis bisa langsung kamu buka dan cetak dari halaman ini.',
      label: 'Terima Kasih',
      h1: 'Terima kasih, simpulnya sudah terikat!',
    },
    en: {
      title: 'Thanks for Signing Up | Simpul Mungil',
      description: 'We have your sign-up. Your free mini tulip pattern is ready to open and print from this page.',
      label: 'Thank You',
      h1: 'Thank you, the knot is tied!',
    },
  },
};
