// Frontend-only smart parser for affiliate URLs (Amazon, Flipkart, Myntra, Ajio, etc.)
// Browser CORS ki wajah se hum direct title/price fetch nahi kar sakte,
// par URL se bahut kuch nikal lete hain: store, product ID, category guess,
// aur Amazon ke case me product image bhi (public CDN pattern).

export type ParsedProduct = {
  store: string;
  brand: string;
  affiliateUrl: string;
  productId?: string;
  img?: string;
  images?: string[];
  category: string;
  subcategory: string;
  title: string;
};

const STORE_MAP: Record<string, string> = {
  "amazon.in": "Amazon",
  "amazon.com": "Amazon",
  "amzn.to": "Amazon",
  "amzn.in": "Amazon",
  "flipkart.com": "Flipkart",
  "fkrt.it": "Flipkart",
  "myntra.com": "Myntra",
  "ajio.com": "Ajio",
  "meesho.com": "Meesho",
  "nykaa.com": "Nykaa",
  "tatacliq.com": "Tata CLiQ",
  "snapdeal.com": "Snapdeal",
  "croma.com": "Croma",
  "reliancedigital.in": "Reliance Digital",
};

// Common Indian/global brands — agar URL slug me match mile to brand auto-fill
const KNOWN_BRANDS = [
  "samsung","apple","sony","lg","oneplus","xiaomi","redmi","realme","oppo","vivo","motorola","nokia","nothing","google","asus","hp","dell","lenovo","acer","msi","boat","jbl","bose","sennheiser","skullcandy","noise","fire-boltt","fireboltt","fastrack","titan","casio","fossil","timex","seiko","rolex","puma","adidas","nike","reebok","skechers","crocs","woodland","bata","levis","levi-s","wrangler","peter-england","arrow","raymond","biba","fabindia","manyavar","zara","h-and-m","hm","forever21","lakme","loreal","l-oreal","maybelline","mac","huda","nykaa","mamaearth","wow","plum","minimalist","the-derma-co","cetaphil","neutrogena","olay","ponds","nivea","dove","head-shoulders","pantene","tresemme","schwarzkopf","loreal-paris","calvin-klein","ck","ralph-lauren","tommy","gucci","prada","ray-ban","oakley","fastrack","hidesign","da-milano","caprese","baggit","american-tourister","skybags","vip","wildcraft","safari",
];

const CATEGORY_KEYWORDS: { cat: string; sub: string; words: string[] }[] = [
  { cat: "electronics", sub: "smartphones", words: ["phone","mobile","smartphone","iphone","galaxy","redmi","oneplus","pixel","realme"] },
  { cat: "electronics", sub: "laptops", words: ["laptop","macbook","notebook","ultrabook","chromebook","ideapad","thinkpad","inspiron","pavilion"] },
  { cat: "electronics", sub: "headphones", words: ["headphone","earphone","earbud","airpods","airdopes","tws","headset","earpod"] },
  { cat: "electronics", sub: "smart-watches", words: ["smartwatch","smart-watch","fitness-band","fitband","fit-band","wearable"] },
  { cat: "electronics", sub: "cameras", words: ["camera","dslr","mirrorless","gopro","webcam"] },
  { cat: "men", sub: "watches", words: ["watch","chronograph","analog-watch"] },
  { cat: "men", sub: "sneakers", words: ["sneaker","shoe","running-shoe","trainer","loafer"] },
  { cat: "men", sub: "t-shirts", words: ["t-shirt","tshirt","polo"] },
  { cat: "men", sub: "shirts", words: ["shirt","formal-shirt","casual-shirt"] },
  { cat: "men", sub: "jeans", words: ["jeans","denim","trouser","chinos"] },
  { cat: "women", sub: "dresses", words: ["dress","gown","kurti","kurta","saree","lehenga"] },
  { cat: "women", sub: "handbags", words: ["handbag","tote","clutch","sling","backpack"] },
  { cat: "women", sub: "heels", words: ["heel","sandal","flat","wedge"] },
  { cat: "women", sub: "jewelry", words: ["jewelry","jewellery","earring","necklace","ring","bracelet","bangle"] },
  { cat: "beauty", sub: "skincare", words: ["cream","serum","moisturizer","sunscreen","face-wash","cleanser","toner","lotion"] },
  { cat: "beauty", sub: "makeup", words: ["lipstick","mascara","foundation","eyeliner","kajal","blush","compact","makeup"] },
  { cat: "beauty", sub: "fragrances", words: ["perfume","fragrance","cologne","edp","edt","deo","deodorant","body-spray"] },
  { cat: "beauty", sub: "haircare", words: ["shampoo","conditioner","hair-oil","hair-mask","hair-serum"] },
];

const titleCase = (s: string) =>
  s.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim().split(" ").map(w => w[0]?.toUpperCase() + w.slice(1).toLowerCase()).join(" ");

const detectStore = (host: string): string => {
  const clean = host.replace(/^www\./, "");
  for (const key of Object.keys(STORE_MAP)) {
    if (clean === key || clean.endsWith("." + key)) return STORE_MAP[key];
  }
  return titleCase(clean.split(".")[0] || "Store");
};

const extractAmazonAsin = (url: URL): string | undefined => {
  // /dp/ASIN, /gp/product/ASIN, /product/ASIN
  const m = url.pathname.match(/\/(?:dp|gp\/product|product)\/([A-Z0-9]{10})/i);
  return m?.[1];
};

const extractFlipkartPid = (url: URL): string | undefined => {
  const pid = url.searchParams.get("pid");
  if (pid) return pid;
  const m = url.pathname.match(/\/p\/([a-zA-Z0-9]+)/);
  return m?.[1];
};

const guessTitleFromPath = (url: URL): string => {
  // Flipkart, Myntra, Ajio etc. ka title slug usually pathname me hota hai
  // e.g. /samsung-galaxy-s24-ultra-titanium-black-256-gb/p/itm123
  const segments = url.pathname.split("/").filter(Boolean);
  const candidates = segments.filter(s =>
    s.length > 8 &&
    /[a-z]/.test(s) &&
    !/^(p|dp|gp|product|buy|item|itm)$/i.test(s) &&
    !/^[A-Z0-9]{10}$/.test(s) // skip ASINs
  );
  if (candidates.length === 0) return "";
  // pick the longest candidate (most likely the slug)
  const best = candidates.sort((a, b) => b.length - a.length)[0];
  return titleCase(best.replace(/[^a-zA-Z0-9-]/g, " "));
};

const guessBrand = (slug: string): string => {
  const lower = slug.toLowerCase();
  for (const b of KNOWN_BRANDS) {
    if (lower.includes(b)) return titleCase(b.replace(/-/g, " "));
  }
  return "";
};

const guessCategory = (slug: string): { category: string; subcategory: string } => {
  const lower = slug.toLowerCase();
  for (const c of CATEGORY_KEYWORDS) {
    if (c.words.some(w => lower.includes(w))) {
      return { category: c.cat, subcategory: c.sub };
    }
  }
  return { category: "electronics", subcategory: "" };
};

export const parseAffiliateUrl = (rawUrl: string): ParsedProduct | null => {
  let url: URL;
  try { url = new URL(rawUrl.trim()); } catch { return null; }

  const store = detectStore(url.hostname);
  const slug = url.pathname + " " + (url.searchParams.toString() || "");
  const titleGuess = guessTitleFromPath(url);
  const brand = guessBrand(slug + " " + titleGuess);
  const { category, subcategory } = guessCategory(slug + " " + titleGuess);

  let productId: string | undefined;
  let img: string | undefined;
  const images: string[] = [];

  if (store === "Amazon") {
    productId = extractAmazonAsin(url);
    // Amazon image CDN — works for most products without auth
    if (productId) {
      img = `https://images-na.ssl-images-amazon.com/images/P/${productId}.01._SCRM_.jpg`;
      images.push(
        `https://images-na.ssl-images-amazon.com/images/P/${productId}.01._SCRM_.jpg`,
        `https://images-na.ssl-images-amazon.com/images/P/${productId}.02._SCRM_.jpg`,
        `https://images-na.ssl-images-amazon.com/images/P/${productId}.03._SCRM_.jpg`,
      );
    }
  } else if (store === "Flipkart") {
    productId = extractFlipkartPid(url);
  }

  // Build clean affiliate URL — strip tracking junk except essential bits
  const cleanUrl = (() => {
    if (store === "Amazon" && productId) {
      const tag = url.searchParams.get("tag");
      return `https://${url.hostname}/dp/${productId}${tag ? `?tag=${tag}` : ""}`;
    }
    return rawUrl.trim();
  })();

  return {
    store,
    brand: brand || store,
    affiliateUrl: cleanUrl,
    productId,
    img,
    images: images.length ? images : undefined,
    category,
    subcategory,
    title: titleGuess,
  };
};
