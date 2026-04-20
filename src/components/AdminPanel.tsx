import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Edit3, Link as LinkIcon, Save, LogOut, Package } from "lucide-react";
import { adminAuth, productStore } from "@/store/adminStore";
import type { Product } from "@/data/products";

const emptyProduct: Omit<Product, "id"> = {
  img: "",
  brand: "",
  title: "",
  price: 0,
  mrp: 0,
  rating: 4.5,
  reviews: 0,
  category: "men",
  subcategory: "",
  store: "",
  hot: false,
  description: "",
  highlights: [""],
};

const AdminPanel = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Omit<Product, "id"> & { id?: string } | null>(null);
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [scraping, setScraping] = useState(false);

  useEffect(() => {
    if (open) setProducts(productStore.getAll());
  }, [open]);

  const handleScrapeUrl = async () => {
    if (!scrapeUrl.trim()) return;
    setScraping(true);
    // Simulate scraping - in future connect to Firecrawl backend
    setTimeout(() => {
      const scraped: Omit<Product, "id"> = {
        img: "https://via.placeholder.com/400x400?text=Scraped+Product",
        brand: new URL(scrapeUrl).hostname.replace("www.", "").split(".")[0].toUpperCase(),
        title: "Scraped Product from " + new URL(scrapeUrl).hostname,
        price: Math.floor(Math.random() * 5000) + 500,
        mrp: Math.floor(Math.random() * 8000) + 2000,
        rating: +(Math.random() * 2 + 3).toFixed(1),
        reviews: Math.floor(Math.random() * 2000),
        category: "men",
        subcategory: "accessories",
        store: new URL(scrapeUrl).hostname.replace("www.", ""),
        hot: false,
        description: "Product scraped from " + scrapeUrl + ". Edit the details as needed.",
        highlights: ["Scraped product", "Edit details manually"],
      };
      setEditing(scraped);
      setScraping(false);
      setScrapeUrl("");
    }, 1500);
  };

  const handleSave = () => {
    if (!editing) return;
    if (editing.id) {
      productStore.update(editing.id, editing);
    } else {
      const newProduct: Product = {
        ...editing as Omit<Product, "id">,
        id: "product-" + Date.now(),
      };
      productStore.add(newProduct);
    }
    setProducts(productStore.getAll());
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    productStore.remove(id);
    setProducts(productStore.getAll());
  };

  const handleLogout = () => {
    adminAuth.logout();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex"
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="relative ml-auto w-full max-w-2xl h-full overflow-y-auto"
            style={{ background: "linear-gradient(180deg, hsl(212 80% 8%), hsl(350 40% 12%))" }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/10" style={{ background: "linear-gradient(135deg, hsl(212 80% 10%), hsl(350 50% 15%))" }}>
              <div className="flex items-center gap-3">
                <Package className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold text-white">Admin Panel</h2>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 text-sm">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
                <button onClick={onClose} className="text-white/60 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Scrape URL */}
              <div className="rounded-2xl border border-white/10 p-4 bg-white/5">
                <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" /> Add Product via URL
                </h3>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={scrapeUrl}
                    onChange={(e) => setScrapeUrl(e.target.value)}
                    placeholder="Paste product URL (Amazon, Flipkart, Myntra…)"
                    className="flex-1 h-10 px-4 rounded-xl bg-white/10 text-white placeholder:text-white/30 outline-none border border-white/10 focus:border-primary/60 text-sm"
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleScrapeUrl}
                    disabled={scraping}
                    className="px-4 h-10 rounded-xl bg-gradient-primary text-white text-sm font-semibold disabled:opacity-50"
                  >
                    {scraping ? "Scraping…" : "Fetch"}
                  </motion.button>
                </div>
                <p className="text-[11px] text-white/40 mt-2">Backend scraping will be connected later. Currently creates a placeholder you can edit.</p>
              </div>

              {/* Add manually */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setEditing({ ...emptyProduct })}
                className="w-full flex items-center justify-center gap-2 h-12 rounded-xl border border-dashed border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors"
              >
                <Plus className="h-4 w-4" /> Add Product Manually
              </motion.button>

              {/* Edit form */}
              <AnimatePresence>
                {editing && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="rounded-2xl border border-primary/30 bg-white/5 overflow-hidden"
                  >
                    <div className="p-4 space-y-3">
                      <h3 className="text-sm font-bold text-white">{editing.id ? "Edit Product" : "New Product"}</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { key: "title", label: "Title", full: true },
                          { key: "brand", label: "Brand" },
                          { key: "store", label: "Store" },
                          { key: "price", label: "Price (₹)", type: "number" },
                          { key: "mrp", label: "MRP (₹)", type: "number" },
                          { key: "category", label: "Category" },
                          { key: "subcategory", label: "Subcategory" },
                          { key: "img", label: "Image URL", full: true },
                          { key: "rating", label: "Rating", type: "number" },
                          { key: "reviews", label: "Reviews", type: "number" },
                        ].map(({ key, label, type, full }) => (
                          <div key={key} className={full ? "col-span-2" : ""}>
                            <label className="text-[11px] text-white/50 mb-1 block">{label}</label>
                            <input
                              type={type || "text"}
                              value={(editing as any)[key] || ""}
                              onChange={(e) => setEditing({ ...editing, [key]: type === "number" ? +e.target.value : e.target.value })}
                              className="w-full h-9 px-3 rounded-lg bg-white/10 text-white text-sm outline-none border border-white/10 focus:border-primary/40"
                            />
                          </div>
                        ))}
                        <div className="col-span-2">
                          <label className="text-[11px] text-white/50 mb-1 block">Description</label>
                          <textarea
                            value={editing.description}
                            onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 rounded-lg bg-white/10 text-white text-sm outline-none border border-white/10 focus:border-primary/40 resize-none"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-[11px] text-white/50 mb-1 block">Highlights (comma separated)</label>
                          <input
                            value={editing.highlights.join(", ")}
                            onChange={(e) => setEditing({ ...editing, highlights: e.target.value.split(",").map((s) => s.trim()) })}
                            className="w-full h-9 px-3 rounded-lg bg-white/10 text-white text-sm outline-none border border-white/10 focus:border-primary/40"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <motion.button whileTap={{ scale: 0.95 }} onClick={handleSave} className="flex-1 h-10 rounded-xl bg-gradient-primary text-white text-sm font-semibold flex items-center justify-center gap-2">
                          <Save className="h-4 w-4" /> Save
                        </motion.button>
                        <button onClick={() => setEditing(null)} className="px-4 h-10 rounded-xl bg-white/10 text-white/60 text-sm">Cancel</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Product list */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white/60">Products ({products.length})</h3>
                {products.length === 0 && <p className="text-white/30 text-sm">No admin products yet. Add one above.</p>}
                {products.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    {p.img && <img src={p.img} alt={p.title} className="h-12 w-12 rounded-lg object-cover bg-white/10" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{p.title}</p>
                      <p className="text-xs text-white/40">{p.brand} · ₹{p.price}</p>
                    </div>
                    <button onClick={() => setEditing(p)} className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-white/50 hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminPanel;
