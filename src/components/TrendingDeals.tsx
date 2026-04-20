import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronUp, MessageSquare, Flame, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { products as defaultProducts, formatINR, type Product } from "@/data/products";
import { productStore } from "@/store/adminStore";

type Deal = Product & { off: number; votes: number; comments: number };

const buildDeals = (): Deal[] => {
  const all = [...productStore.getAll(), ...defaultProducts];
  return all.slice(0, 7).map((p) => ({
    ...p,
    off: p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0,
    votes: Math.floor(180 + Math.random() * 250),
    comments: Math.floor(30 + Math.random() * 60),
  }));
};

const DealCard = ({ d, i }: { d: Deal; i: number }) => {
  const [voted, setVoted] = useState(false);
  const isExternal = !!d.affiliateUrl;
  const ImgWrap = ({ children }: { children: React.ReactNode }) =>
    isExternal ? (
      <a href={d.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored" className="relative aspect-[4/3] overflow-hidden bg-muted block">
        {children}
      </a>
    ) : (
      <Link to={`/product/${d.id}`} className="relative aspect-[4/3] overflow-hidden bg-muted block">
        {children}
      </Link>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: i * 0.05 }}
      whileHover={{ y: -6 }}
      className="snap-start shrink-0 w-[260px] sm:w-[280px] group bg-card rounded-2xl overflow-hidden border border-border shadow-soft hover:shadow-elegant transition-shadow flex flex-col"
    >
      <ImgWrap>
        <img src={d.img} alt={d.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        {d.off > 0 && (
          <div className="absolute top-3 left-3 inline-flex items-center gap-1 bg-gradient-deal text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-deal">
            <Flame className="h-3 w-3" /> {d.off}% OFF
          </div>
        )}
        {d.store && (
          <span className="absolute top-3 right-3 glass text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full">
            {d.store}
          </span>
        )}
      </ImgWrap>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-medium text-sm leading-snug line-clamp-2 mb-3 min-h-[2.5rem]">{d.title}</h3>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-display font-bold text-lg text-foreground">{formatINR(d.price)}</span>
          {d.mrp > d.price && <span className="text-xs text-muted-foreground line-through">{formatINR(d.mrp)}</span>}
          {d.off > 0 && <span className="text-xs font-bold text-success ml-auto">{d.off}% off</span>}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setVoted((v) => !v)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              voted
                ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow"
                : "bg-muted border-transparent hover:border-primary/40"
            }`}
          >
            <ChevronUp className="h-3.5 w-3.5" /> {d.votes + (voted ? 1 : 0)}
          </motion.button>
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-muted hover:bg-muted/70">
            <MessageSquare className="h-3.5 w-3.5" /> {d.comments}
          </button>
        </div>

        {isExternal ? (
          <a href={d.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored" className="mt-auto">
            <motion.div
              whileTap={{ scale: 0.97 }}
              className="w-full bg-gradient-primary text-primary-foreground rounded-full py-2.5 text-sm font-semibold flex items-center justify-center gap-2 shadow-glow"
            >
              <Tag className="h-4 w-4" /> Get Deal
            </motion.div>
          </a>
        ) : (
          <Link to={`/product/${d.id}`} className="mt-auto">
            <div className="w-full bg-gradient-primary text-primary-foreground rounded-full py-2.5 text-sm font-semibold flex items-center justify-center gap-2 shadow-glow">
              <Tag className="h-4 w-4" /> Get Deal
            </div>
          </Link>
        )}
      </div>
    </motion.div>
  );
};

const TrendingDeals = () => {
  const deals = buildDeals();
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const amt = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "left" ? -amt : amt, behavior: "smooth" });
  };

  if (deals.length === 0) return null;

  return (
    <section className="container py-14">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-deal mb-2">🔥 Hot Right Now</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl">Trending Deals</h2>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="h-10 w-10 rounded-full border border-border bg-card hover:bg-muted flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="h-10 w-10 rounded-full border border-border bg-card hover:bg-muted flex items-center justify-center transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto snap-x scrollbar-none -mx-4 px-4 pb-2"
      >
        {deals.map((d, i) => <DealCard key={d.id} d={d} i={i} />)}
      </div>
    </section>
  );
};

export default TrendingDeals;
