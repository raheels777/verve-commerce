import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronUp, MessageSquare, Flame, ExternalLink } from "lucide-react";
import { useState } from "react";
import { products, formatINR } from "@/data/products";

const deals = products.slice(0, 4).map((p) => ({
  ...p,
  off: Math.round(((p.mrp - p.price) / p.mrp) * 100),
  votes: Math.floor(180 + Math.random() * 250),
  comments: Math.floor(30 + Math.random() * 60),
}));

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
      <Link to={`/product/${d.id}`} className="relative aspect-[4/3] overflow-hidden bg-muted block">
        <img src={d.img} alt={d.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        {d.hot && (
          <div className="absolute top-3 left-3 inline-flex items-center gap-1 bg-gradient-deal text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-deal">
            <Flame className="h-3 w-3" /> {d.off}% OFF
          </div>
        )}
        {d.store && (
          <span className="absolute top-3 right-3 glass text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full">
            {d.store}
          </span>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link to={`/product/${d.id}`}>
          <h3 className="font-medium text-sm leading-snug line-clamp-2 mb-3 min-h-[2.5rem] hover:text-primary transition-colors">{d.title}</h3>
        </Link>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="font-display font-bold text-lg text-foreground">{formatINR(d.price)}</span>
          <span className="text-xs text-muted-foreground line-through">{formatINR(d.mrp)}</span>
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
          <Link to={`/product/${d.id}`} className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-primary hover:gap-2 transition-all">
            Grab <ExternalLink className="h-3 w-3" />
          </Link>
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
        <Link to="/category/deals" className="hidden sm:inline text-sm font-medium text-primary">All deals →</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {deals.map((d, i) => <DealCard key={d.id} d={d} i={i} />)}
      </div>
    </section>
  );
};

export default TrendingDeals;
