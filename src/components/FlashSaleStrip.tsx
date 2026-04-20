import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap, Clock } from "lucide-react";
import p1 from "@/assets/product-1.jpg";
import p2 from "@/assets/product-2.jpg";
import p3 from "@/assets/product-3.jpg";
import p4 from "@/assets/product-4.jpg";
import p5 from "@/assets/product-5.jpg";
import p6 from "@/assets/product-6.jpg";

const flashItems = [
  { img: p1, title: "Sony Headphones", price: "₹24,990", off: 28 },
  { img: p2, title: "Cloud Sneakers", price: "₹2,199", off: 60 },
  { img: p3, title: "Chrono Watch", price: "₹3,499", off: 65 },
  { img: p4, title: "Leather Tote", price: "₹1,899", off: 62 },
  { img: p5, title: "CK Eternity", price: "₹4,299", off: 34 },
  { img: p6, title: "Ray-Ban Classic", price: "₹5,499", off: 39 },
];

const useCountdown = (hours = 4) => {
  const [time, setTime] = useState(hours * 3600);
  useEffect(() => {
    const t = setInterval(() => setTime((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(time / 3600).toString().padStart(2, "0");
  const m = Math.floor((time % 3600) / 60).toString().padStart(2, "0");
  const s = (time % 60).toString().padStart(2, "0");
  return { h, m, s };
};

const FlashSaleStrip = () => {
  const { h, m, s } = useCountdown(4);

  return (
    <section className="container py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative rounded-3xl bg-gradient-dark p-6 md:p-8 overflow-hidden glow-border"
      >
        {/* glow */}
        <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-deal/40 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-primary/40 blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 text-white">
            <div className="h-12 w-12 rounded-2xl bg-gradient-deal flex items-center justify-center shadow-deal animate-pulse-glow">
              <Zap className="h-6 w-6" fill="currentColor" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-deal">Flash Sale Live</p>
              <h2 className="font-display font-bold text-2xl md:text-3xl">Up to 80% OFF · Today Only</h2>
            </div>
          </div>

          <div className="flex items-center gap-2 text-white">
            <Clock className="h-4 w-4 opacity-70" />
            <span className="text-xs uppercase tracking-wider opacity-70">Ends in</span>
            <div className="flex items-center gap-1.5 ml-2">
              {[h, m, s].map((v, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="bg-white/10 backdrop-blur px-2.5 py-1.5 rounded-lg font-display font-bold text-lg tabular-nums min-w-[44px] text-center">
                    {v}
                  </div>
                  {i < 2 && <span className="opacity-50">:</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative flex gap-4 overflow-x-auto pb-2 scrollbar-none -mx-2 px-2 snap-x">
          {flashItems.map((it, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="snap-start shrink-0 w-44 bg-white/5 backdrop-blur-xl rounded-2xl p-3 border border-white/10 hover:border-deal/50 transition-colors"
            >
              <div className="aspect-square rounded-xl overflow-hidden bg-white/10 mb-3 relative">
                <img src={it.img} alt={it.title} loading="lazy" className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-deal text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  -{it.off}%
                </span>
              </div>
              <p className="text-white text-sm font-medium line-clamp-1">{it.title}</p>
              <p className="text-deal font-display font-bold">{it.price}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default FlashSaleStrip;
