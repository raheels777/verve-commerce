import { Product } from "@/data/products";

const ADMIN_EMAIL = "sraheel0777@gmail.com";
const ADMIN_PASSWORD = "AdvRaheel777$";
const PRODUCTS_KEY = "dealzgalaxy_products";
const AUTH_KEY = "dealzgalaxy_admin";

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
