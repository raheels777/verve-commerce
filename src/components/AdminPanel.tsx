import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Edit3, Save, LogOut, Package, Sparkles, Megaphone, RotateCcw } from "lucide-react";
import { adminAuth, productStore, promoStore, type PromoItem } from "@/store/adminStore";
import type { Product } from "@/data/products";
import { parseAffiliateUrl } from "@/lib/productParser";
import { fetchProductDetails } from "@/lib/priceFetcher";

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
  store: "Amazon",
  hot: false,
  description: "",
  highlights: [""],
  affiliateUrl: "",
  images: [],
};

type Tab = "products" | "promos";

const AdminPanel = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [tab, setTab] = useState<Tab>("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Omit<Product, "id"> & { id?: string } | null>(null);
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [scraping, setScraping] = useState(false);

  // Promo strip state
  const [promos, setPromos] = useState<PromoItem[]>([]);
  const [editingPromo, setEditingPromo] = useState<(Partial<PromoItem> & { isNew?: boolean }) | null>(null);

  useEffect(() => {
    if (open) {
      setProducts(productStore.getAll());
      setPromos(promoStore.getAll());
    }
  }, [open]);

  const handleScrapeUrl = async () => {
    if (!scrapeUrl.trim()) return;
    setScraping(true);
    const parsed = parseAffiliateUrl(scrapeUrl);
    if (!parsed) {
      setScraping(false);
      return;
    }
    // Try to fetch live price/title/image via CORS proxy
    let livePrice = 0;
    let liveMrp = 0;
    let liveTitle = parsed.title;
    let liveImg = parsed.img || "";
    try {
      const fetched = await fetchProductDetails(scrapeUrl);
      if (fetched) {
        if (fetched.price) livePrice = fetched.price;
        if (fetched.mrp) liveMrp = fetched.mrp;
        if (fetched.title) liveTitle = fetched.title;
        if (fetched.image) liveImg = fetched.image;
      }
    } catch {
      // Proxy failed — user can still fill manually
    }

    const prefilled: Omit<Product, "id"> = {
      img: liveImg,
      brand: parsed.brand,
      title: liveTitle,
      price: livePrice,
      mrp: liveMrp || livePrice,
      rating: 4.5,
      reviews: 0,
      category: parsed.category,
      subcategory: parsed.subcategory,
      store: parsed.store,
      hot: false,
      description: "",
      highlights: [""],
      affiliateUrl: parsed.affiliateUrl,
      images: parsed.images || [],
    };
    setEditing(prefilled);
    setScraping(false);
    setScrapeUrl("");
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

  // ----- Promo handlers -----
  const handlePromoSave = () => {
    if (!editingPromo) return;
    const emoji = (editingPromo.emoji || "").trim();
    const text = (editingPromo.text || "").trim();
    if (!text) return;
    if (editingPromo.isNew) {
      promoStore.add({ emoji: emoji || "✨", text });
    } else if (editingPromo.id) {
      promoStore.update(editingPromo.id, { emoji: emoji || "✨", text });
    }
    setPromos(promoStore.getAll());
    setEditingPromo(null);
  };

  const handlePromoDelete = (id: string) => {
    promoStore.remove(id);
    setPromos(promoStore.getAll());
  };

  const handlePromoReset = () => {
    if (!confirm("Reset promo strip to default messages?")) return;
    promoStore.reset();
    setPromos(promoStore.getAll());
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

            {/* Tabs */}
            <div className="px-6 pt-4 flex gap-2 border-b border-white/5">
              {[
                { id: "products" as Tab, label: "Products", icon: Package },
                { id: "promos" as Tab, label: "Promo Strip", icon: Megaphone },
              ].map((t) => {
                const Icon = t.icon;
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-medium transition-colors ${
                      active
                        ? "bg-white/10 text-white border-b-2 border-primary"
                        : "text-white/50 hover:text-white/80"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* ===================== PRODUCTS TAB ===================== */}
            {tab === "products" && (
              <div className="p-6 space-y-6">
                {/* Quick add via affiliate URL */}
                <div className="rounded-2xl border border-primary/30 p-4 bg-gradient-to-br from-primary/10 to-secondary/10">
                  <h3 className="text-sm font-semibold text-white/90 mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" /> Smart Quick-Add — Amazon / Flipkart / Myntra / Ajio
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={scrapeUrl}
                      onChange={(e) => setScrapeUrl(e.target.value)}
                      placeholder="Paste product URL — sab kuch auto-fill ho jayega…"
                      className="flex-1 h-10 px-4 rounded-xl bg-white/10 text-white placeholder:text-white/30 outline-none border border-white/10 focus:border-primary/60 text-sm"
                    />
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleScrapeUrl}
                      disabled={scraping}
                      className="px-4 h-10 rounded-xl bg-gradient-primary text-white text-sm font-semibold disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      {scraping ? "Reading…" : "Auto-Fill"}
                    </motion.button>
                  </div>
                  <p className="text-[11px] text-white/50 mt-2 leading-relaxed">
                    ✅ <b>Auto-fetch</b>: Title, <b>price</b>, MRP, image — sab kuch live Amazon/Flipkart se aa jayega (CORS proxy ke through).
                    <br/>⚠️ Agar proxy down ho ya page block kare, toh manual fill kar sakte ho.
                  </p>
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
                            { key: "affiliateUrl", label: "Affiliate / Buy Link (Amazon, Flipkart…) — clicking product opens this", full: true },
                            { key: "brand", label: "Brand" },
                            { key: "store", label: "Store (Amazon / Flipkart / Myntra)" },
                            { key: "price", label: "Price (₹)", type: "number" },
                            { key: "mrp", label: "MRP (₹)", type: "number" },
                            { key: "category", label: "Category" },
                            { key: "subcategory", label: "Subcategory" },
                            { key: "img", label: "Main Image URL", full: true },
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
            )}

            {/* ===================== PROMO STRIP TAB ===================== */}
            {tab === "promos" && (
              <div className="p-6 space-y-5">
                <div className="rounded-2xl border border-secondary/30 p-4 bg-gradient-to-br from-secondary/10 to-primary/10">
                  <h3 className="text-sm font-semibold text-white/90 flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-primary" /> Top Scrolling Promo Strip
                  </h3>
                  <p className="text-[11px] text-white/50 mt-1.5 leading-relaxed">
                    Yeh woh top wala scrolling banner hai (Free Shipping, GALAXY10, Flash Sale…). Yahan se add / edit / delete karo.
                    <br/>💡 Tip: Text me <code className="text-primary">&lt;b&gt;BOLD&lt;/b&gt;</code> use kar sakte ho, jaise coupon code highlight karne ke liye.
                  </p>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setEditingPromo({ isNew: true, emoji: "✨", text: "" })}
                    className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border border-dashed border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add Promo Message
                  </motion.button>
                  <button
                    onClick={handlePromoReset}
                    className="flex items-center gap-2 px-4 h-11 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm border border-white/10"
                    title="Reset to default messages"
                  >
                    <RotateCcw className="h-4 w-4" /> Reset
                  </button>
                </div>

                {/* Promo edit form */}
                <AnimatePresence>
                  {editingPromo && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="rounded-2xl border border-primary/30 bg-white/5 overflow-hidden"
                    >
                      <div className="p-4 space-y-3">
                        <h3 className="text-sm font-bold text-white">{editingPromo.isNew ? "New Promo Message" : "Edit Promo Message"}</h3>
                        <div className="grid grid-cols-[80px_1fr] gap-3">
                          <div>
                            <label className="text-[11px] text-white/50 mb-1 block">Emoji</label>
                            <input
                              value={editingPromo.emoji || ""}
                              onChange={(e) => setEditingPromo({ ...editingPromo, emoji: e.target.value })}
                              placeholder="🔥"
                              className="w-full h-10 px-3 rounded-lg bg-white/10 text-white text-lg text-center outline-none border border-white/10 focus:border-primary/40"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-white/50 mb-1 block">Message text (HTML allowed: &lt;b&gt;…&lt;/b&gt;)</label>
                            <input
                              value={editingPromo.text || ""}
                              onChange={(e) => setEditingPromo({ ...editingPromo, text: e.target.value })}
                              placeholder="Free Shipping above ₹499"
                              className="w-full h-10 px-3 rounded-lg bg-white/10 text-white text-sm outline-none border border-white/10 focus:border-primary/40"
                            />
                          </div>
                        </div>
                        {/* Live preview */}
                        <div className="text-xs text-white/40">
                          Preview:{" "}
                          <span className="text-white/90">
                            {editingPromo.emoji}{" "}
                            <span dangerouslySetInnerHTML={{ __html: editingPromo.text || "" }} />
                          </span>
                        </div>
                        <div className="flex gap-2 pt-1">
                          <motion.button whileTap={{ scale: 0.95 }} onClick={handlePromoSave} className="flex-1 h-10 rounded-xl bg-gradient-primary text-white text-sm font-semibold flex items-center justify-center gap-2">
                            <Save className="h-4 w-4" /> Save
                          </motion.button>
                          <button onClick={() => setEditingPromo(null)} className="px-4 h-10 rounded-xl bg-white/10 text-white/60 text-sm">Cancel</button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Promo list */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-white/60">Promo Messages ({promos.length})</h3>
                  {promos.length === 0 && <p className="text-white/30 text-sm">No promo messages. Strip will be empty.</p>}
                  {promos.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center text-xl shrink-0">
                        {p.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate" dangerouslySetInnerHTML={{ __html: p.text }} />
                      </div>
                      <button onClick={() => setEditingPromo(p)} className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handlePromoDelete(p.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-white/50 hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminPanel;
