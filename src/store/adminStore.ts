import { Product } from "@/data/products";

const ADMIN_EMAIL = "sraheel0777@gmail.com";
const ADMIN_PASSWORD = "AdvRaheel777$";
const PRODUCTS_KEY = "dealzgalaxy_products";
const AUTH_KEY = "dealzgalaxy_admin";
const PROMO_KEY = "dealzgalaxy_promos";

export const adminAuth = {
  login(email: string, password: string): boolean {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem(AUTH_KEY, "true");
      return true;
    }
    return false;
  },
  logout() {
    localStorage.removeItem(AUTH_KEY);
  },
  isLoggedIn(): boolean {
    return localStorage.getItem(AUTH_KEY) === "true";
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
