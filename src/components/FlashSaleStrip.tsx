import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { products as defaultProducts, formatINR, type Product } from "@/data/products";
import { productStore } from "@/store/adminStore";

// One product per unique category
const pickOnePerCategory = (all: Product[]): Product[] => {
  const seen = new Set<string>();
  const picks: Product[] = [];
  for (const p of all) {
    const key = p.category || "other";
    if (!seen.has(key)) {
      seen.add(key);
      picks.push(p);
    }
  }
  return picks;
};

const FlashSaleStrip = () => {
  const all = [...productStore.getAll(), ...defaultProducts];
  const items = pickOnePerCategory(all);

  if (items.length === 0) return null;

  return (
    <section className="container py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative rounded-3xl bg-gradient-dark p-6 md:p-8 overflow-hidden glow-border"
      >
        <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-deal/40 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-primary/40 blur-3xl" />

        <div className="relative flex items-center gap-3 text-white mb-6">
          <div className="h-12 w-12 rounded-2xl bg-gradient-deal flex items-center justify-center shadow-deal animate-pulse-glow">
            <Zap className="h-6 w-6" fill="currentColor" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-deal">Top Categories</p>
            <h2 className="font-display font-bold text-2xl md:text-3xl">One Pick From Every Category</h2>
          </div>
        </div>

        <div className="relative flex gap-4 overflow-x-auto pb-2 scrollbar-none -mx-2 px-2 snap-x">
          {items.map((p) => {
            const off = p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
            const Card = (
              <>
                <div className="aspect-square rounded-xl overflow-hidden bg-white/10 mb-3 relative">
                  <img src={p.img} alt={p.title} loading="lazy" className="w-full h-full object-cover" />
                  {off > 0 && (
                    <span className="absolute top-2 left-2 bg-deal text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      -{off}%
                    </span>
                  )}
                  <span className="absolute bottom-2 right-2 bg-white/20 backdrop-blur text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {p.category}
                  </span>
                </div>
                <p className="text-white text-sm font-medium line-clamp-1">{p.title}</p>
                <p className="text-deal font-display font-bold">{formatINR(p.price)}</p>
              </>
            );
            return p.affiliateUrl ? (
              <motion.a
                key={p.id}
                href={p.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                whileHover={{ y: -4 }}
                className="snap-start shrink-0 w-44 sm:w-48 bg-white/5 backdrop-blur-xl rounded-2xl p-3 border border-white/10 hover:border-deal/50 transition-colors block"
              >
                {Card}
              </motion.a>
            ) : (
              <motion.div
                key={p.id}
                whileHover={{ y: -4 }}
                className="snap-start shrink-0 w-44 sm:w-48 bg-white/5 backdrop-blur-xl rounded-2xl p-3 border border-white/10 hover:border-deal/50 transition-colors"
              >
                {Card}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default FlashSaleStrip;
