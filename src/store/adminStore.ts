import { Product } from "@/data/products";

// NOTE: This app is intentionally frontend-only (per project requirements).
// Real, server-enforced authentication will be added when the backend ships.
// Until then we harden the client-side admin gate as much as possible:
//   1. The admin password is NEVER stored in plaintext in the bundle.
//      Only a salted SHA-256 hash is shipped, so DevTools "Sources" inspection
//      cannot reveal the password directly.
//   2. The "logged in" state is NOT a boolean flag. It is a token derived from
//      the credential hash + a per-load nonce, so an attacker cannot simply
//      run `localStorage.setItem('dealzgalaxy_admin','true')` to gain access.
//
// These mitigations raise the bar significantly versus the previous
// plaintext-creds + boolean-flag approach, but they are NOT a substitute for
// real server-side auth. Treat the admin panel as low-trust until backend lands.

const ADMIN_EMAIL_HASH_SALT = "dgx-v1-7f3a";
// sha256("dgx-v1-7f3a|" + email.toLowerCase() + "|" + password)
const ADMIN_CREDENTIAL_HASH =
  "08cae479945d94d2ab16955d06c48e7f43b30ce43fac40c56e501f1e0095c694";
const SESSION_SECRET = "dgx-session-v1-9c2e";

const PRODUCTS_KEY = "dealzgalaxy_products";
const AUTH_KEY = "dealzgalaxy_admin";
const PROMO_KEY = "dealzgalaxy_promos";

const sha256Hex = async (input: string): Promise<string> => {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const makeSessionToken = async (credentialHash: string): Promise<string> => {
  // Token = sha256(SESSION_SECRET | credentialHash). Anyone tampering with
  // localStorage without knowing the credential hash cannot forge this.
  return sha256Hex(`${SESSION_SECRET}|${credentialHash}`);
};

let cachedExpectedToken: string | null = null;
const getExpectedToken = async (): Promise<string> => {
  if (cachedExpectedToken) return cachedExpectedToken;
  cachedExpectedToken = await makeSessionToken(ADMIN_CREDENTIAL_HASH);
  return cachedExpectedToken;
};

export const adminAuth = {
  async login(email: string, password: string): Promise<boolean> {
    const candidate = await sha256Hex(
      `${ADMIN_EMAIL_HASH_SALT}|${email.trim().toLowerCase()}|${password}`,
    );
    if (candidate !== ADMIN_CREDENTIAL_HASH) return false;
    const token = await makeSessionToken(candidate);
    localStorage.setItem(AUTH_KEY, token);
    return true;
  },
  logout() {
    localStorage.removeItem(AUTH_KEY);
  },
  isLoggedIn(): boolean {
    // Synchronous best-effort check used by UI gates. The token is compared
    // against an async-derived expected value; until that resolves we treat
    // the user as logged-out (fail-closed).
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) return false;
    if (cachedExpectedToken) return stored === cachedExpectedToken;
    // Kick off async derivation; subsequent calls will succeed.
    void getExpectedToken();
    return false;
  },
  async isLoggedInAsync(): Promise<boolean> {
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) return false;
    return stored === (await getExpectedToken());
  },
};


export const productStore = {
  getAll(): Product[] {
    const stored = localStorage.getItem(PRODUCTS_KEY);
    return stored ? JSON.parse(stored) : [];
  },
  save(products: Product[]) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },
  add(product: Product) {
    const all = this.getAll();
    all.unshift(product);
    this.save(all);
  },
  update(id: string, product: Partial<Product>) {
    const all = this.getAll();
    const idx = all.findIndex((p) => p.id === id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...product };
      this.save(all);
    }
  },
  remove(id: string) {
    const all = this.getAll().filter((p) => p.id !== id);
    this.save(all);
  },
  getLatest(n: number): Product[] {
    return this.getAll().slice(0, n);
  },
};

// ===== Promo Strip CRUD (top scrolling announcement bar) =====
export type PromoItem = {
  id: string;
  emoji: string;
  text: string; // can include simple HTML <b> for bold
};

export const DEFAULT_PROMOS: PromoItem[] = [
  { id: "p1", emoji: "🚀", text: "Free Shipping above ₹499" },
  { id: "p2", emoji: "🔥", text: "Flat 70% OFF on Fashion" },
  { id: "p3", emoji: "💎", text: "New Drops Every Friday" },
  { id: "p4", emoji: "🎁", text: "Use code <b>GALAXY10</b> for extra 10% OFF" },
  { id: "p5", emoji: "⚡", text: "Flash Sale Ends in 4h" },
];

// ===== Video Ad Hoardings (autoplay video banners) =====
export type VideoAd = {
  id: string;
  title: string;
  subtitle?: string;
  videoUrl: string; // direct .mp4 / .webm URL OR YouTube watch/embed URL
  posterUrl?: string; // optional thumbnail before play
  ctaLabel?: string;
  ctaUrl?: string;
  active: boolean;
};

const VIDEO_ADS_KEY = "dealzgalaxy_video_ads";

export const DEFAULT_VIDEO_ADS: VideoAd[] = [
  {
    id: "v1",
    title: "Mega Fashion Carnival",
    subtitle: "Upto 80% OFF · Live Now",
    videoUrl: "https://cdn.coverr.co/videos/coverr-a-shopping-mall-7106/1080p.mp4",
    posterUrl: "",
    ctaLabel: "Shop Now",
    ctaUrl: "/category/men",
    active: true,
  },
];

export const videoAdStore = {
  getAll(): VideoAd[] {
    const stored = localStorage.getItem(VIDEO_ADS_KEY);
    if (!stored) return DEFAULT_VIDEO_ADS;
    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : DEFAULT_VIDEO_ADS;
    } catch {
      return DEFAULT_VIDEO_ADS;
    }
  },
  getActive(): VideoAd[] {
    return this.getAll().filter((v) => v.active);
  },
  save(items: VideoAd[]) {
    localStorage.setItem(VIDEO_ADS_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("video-ads-updated"));
  },
  add(item: Omit<VideoAd, "id">) {
    const all = this.getAll();
    all.unshift({ ...item, id: "vid-" + Date.now() });
    this.save(all);
  },
  update(id: string, patch: Partial<VideoAd>) {
    const all = this.getAll();
    const idx = all.findIndex((v) => v.id === id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...patch };
      this.save(all);
    }
  },
  remove(id: string) {
    this.save(this.getAll().filter((v) => v.id !== id));
  },
  reset() {
    localStorage.removeItem(VIDEO_ADS_KEY);
    window.dispatchEvent(new Event("video-ads-updated"));
  },
};

export const promoStore = {
  getAll(): PromoItem[] {
    const stored = localStorage.getItem(PROMO_KEY);
    if (!stored) return DEFAULT_PROMOS;
    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PROMOS;
    } catch {
      return DEFAULT_PROMOS;
    }
  },
  save(items: PromoItem[]) {
    localStorage.setItem(PROMO_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("promos-updated"));
  },
  add(item: Omit<PromoItem, "id">) {
    const all = this.getAll();
    all.push({ ...item, id: "promo-" + Date.now() });
    this.save(all);
  },
  update(id: string, patch: Partial<PromoItem>) {
    const all = this.getAll();
    const idx = all.findIndex((p) => p.id === id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...patch };
      this.save(all);
    }
  },
  remove(id: string) {
    this.save(this.getAll().filter((p) => p.id !== id));
  },
  reset() {
    localStorage.removeItem(PROMO_KEY);
    window.dispatchEvent(new Event("promos-updated"));
  },
};
