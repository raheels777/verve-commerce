// Frontend-only price/title fetcher using public CORS proxies.
// Browsers block direct cross-origin requests, so we route through proxies.
// Multiple fallbacks for reliability.

export type FetchedPriceData = {
  price?: number;
  mrp?: number;
  title?: string;
  image?: string;
};

const PROXIES = [
  (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  (u: string) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
  (u: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
];

const fetchHtml = async (url: string): Promise<string | null> => {
  for (const proxy of PROXIES) {
    try {
      const res = await fetch(proxy(url), { signal: AbortSignal.timeout(8000) });
      if (!res.ok) continue;
      const text = await res.text();
      if (text && text.length > 500) return text;
    } catch {
      continue;
    }
  }
  return null;
};

const parsePriceFromText = (s: string): number | undefined => {
  const cleaned = s.replace(/[,\s]/g, "");
  const m = cleaned.match(/(\d{2,7}(?:\.\d{1,2})?)/);
  if (!m) return undefined;
  const n = parseFloat(m[1]);
  return n > 0 && n < 10000000 ? Math.round(n) : undefined;
};

const extractAmazon = (html: string): FetchedPriceData => {
  const data: FetchedPriceData = {};

  // Title
  const titleMatch =
    html.match(/<span[^>]*id="productTitle"[^>]*>([\s\S]*?)<\/span>/i) ||
    html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i);
  if (titleMatch) data.title = titleMatch[1].replace(/\s+/g, " ").trim();

  // Price - many selectors Amazon uses
  const pricePatterns = [
    /<span class="a-price-whole">([\d,]+)/i,
    /<span[^>]*id="priceblock_(?:ourprice|dealprice|saleprice)"[^>]*>[\s₹Rs.]*([\d,.]+)/i,
    /"priceAmount":\s*"?([\d.]+)"?/i,
    /"price":\s*"?₹?\s*([\d,.]+)"?/i,
    /class="a-offscreen">₹([\d,.]+)</i,
  ];
  for (const re of pricePatterns) {
    const m = html.match(re);
    if (m) {
      const p = parsePriceFromText(m[1]);
      if (p) { data.price = p; break; }
    }
  }

  // MRP / List price
  const mrpPatterns = [
    /<span class="a-price a-text-price"[^>]*>[\s\S]*?<span class="a-offscreen">₹([\d,.]+)</i,
    /"basisPrice":\s*"?₹?\s*([\d,.]+)"?/i,
    /<span[^>]*data-a-strike="true"[^>]*>[\s\S]*?₹([\d,.]+)/i,
    /M\.?R\.?P\.?[^₹]*₹\s*([\d,.]+)/i,
  ];
  for (const re of mrpPatterns) {
    const m = html.match(re);
    if (m) {
      const p = parsePriceFromText(m[1]);
      if (p) { data.mrp = p; break; }
    }
  }

  // Image
  const imgMatch =
    html.match(/<img[^>]+id="landingImage"[^>]+src="([^"]+)"/i) ||
    html.match(/"hiRes":"([^"]+\.jpg)"/i) ||
    html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i);
  if (imgMatch) data.image = imgMatch[1];

  return data;
};

const extractFlipkart = (html: string): FetchedPriceData => {
  const data: FetchedPriceData = {};
  const titleMatch =
    html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i) ||
    html.match(/<title>([^<|]+)/i);
  if (titleMatch) data.title = titleMatch[1].trim();

  const priceMatch =
    html.match(/"price":\s*\{[^}]*"value":\s*(\d+)/i) ||
    html.match(/₹\s*<\/div>\s*([\d,]+)/i) ||
    html.match(/class="[^"]*_30jeq3[^"]*"[^>]*>₹([\d,]+)/i);
  if (priceMatch) data.price = parsePriceFromText(priceMatch[1]);

  const mrpMatch = html.match(/class="[^"]*_3I9_wc[^"]*"[^>]*>₹([\d,]+)/i);
  if (mrpMatch) data.mrp = parsePriceFromText(mrpMatch[1]);

  const imgMatch = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i);
  if (imgMatch) data.image = imgMatch[1];

  return data;
};

const extractGeneric = (html: string): FetchedPriceData => {
  const data: FetchedPriceData = {};
  const titleMatch =
    html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i) ||
    html.match(/<title>([^<]+)<\/title>/i);
  if (titleMatch) data.title = titleMatch[1].trim();

  const imgMatch = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i);
  if (imgMatch) data.image = imgMatch[1];

  // JSON-LD price
  const jsonLd = html.match(/"price"\s*:\s*"?([\d.]+)"?/i);
  if (jsonLd) data.price = parsePriceFromText(jsonLd[1]);
  return data;
};

export const fetchProductDetails = async (url: string): Promise<FetchedPriceData | null> => {
  const html = await fetchHtml(url);
  if (!html) return null;

  const host = (() => { try { return new URL(url).hostname; } catch { return ""; } })();
  if (host.includes("amazon")) return extractAmazon(html);
  if (host.includes("flipkart")) return extractFlipkart(html);
  return extractGeneric(html);
};
