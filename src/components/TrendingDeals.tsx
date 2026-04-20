import { motion } from "framer-motion";
import { ChevronUp, MessageSquare, Flame, ExternalLink } from "lucide-react";
import { useState } from "react";
import p1 from "@/assets/product-1.jpg";
import p2 from "@/assets/product-2.jpg";
import p3 from "@/assets/product-3.jpg";
import p4 from "@/assets/product-4.jpg";

const deals = [
  { img: p1, store: "Amazon", title: "Sony WH-1000XM5 Wireless Headphones", price: "₹24,990", mrp: "₹34,990", off: 28, votes: 412, comments: 87, hot: true },
  { img: p2, store: "Myntra", title: "Premium White Sneakers (Limited)", price: "₹2,199", mrp: "₹5,499", off: 60, votes: 318, comments: 54, hot: true },
  { img: p3, store: "Flipkart", title: "Classic Chronograph Watch — Black", price: "₹3,499", mrp: "₹9,999", off: 65, votes: 256, comments: 41, hot: false },
  { img: p4, store: "Ajio", title: "Designer Leather Handbag — Tan", price: "₹1,899", mrp: "₹4,999", off: 62, votes: 189, comments: 33, hot: false },
];

const DealCard = ({ d, i }: { d: typeof deals[number]; i: number }) => {
  const [voted, setVoted] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: i * 0.08 }}
      whileHover={{ y: -6 }}
      className="group bg-card rounded-2xl overflow-hidden border border-border shadow-soft hover:shadow-elegant transition-shadow flex flex-col"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img src={d.img} alt={d.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        {d.hot && (
          <div className="absolute top-3 left-3 inline-flex items-center gap-1 bg-gradient-deal text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-deal">
            <Flame className="h-3 w-3" /> {d.off}% OFF
          </div>
        )}
        <span className="absolute top-3 right-3 glass text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full">
          {d.store}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-medium text-sm leading-snug line-clamp-2 mb-3 min-h-[2.5rem]">{d.title}</h3>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="font-display font-bold text-lg text-foreground">{d.price}</span>
          <span className="text-xs text-muted-foreground line-through">{d.mrp}</span>
          <span className="text-xs font-bold text-success ml-auto">{d.off}% off</span>
        </div>

        <div className="mt-auto flex items-center gap-2">
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
          <button className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-primary hover:gap-2 transition-all">
            Grab <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const TrendingDeals = () => {
  return (
    <section className="container py-14">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-deal mb-2">🔥 Hot Right Now</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl">Trending Deals</h2>
        </div>
        <a href="#" className="hidden sm:inline text-sm font-medium text-primary">All deals →</a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {deals.map((d, i) => <DealCard key={i} d={d} i={i} />)}
      </div>
    </section>
  );
};

export default TrendingDeals;
