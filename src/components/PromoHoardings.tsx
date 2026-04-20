import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import promo1 from "@/assets/promo-1.jpg";
import promo2 from "@/assets/promo-2.jpg";
import promo3 from "@/assets/promo-3.jpg";

const promos = [
  { image: promo1, eyebrow: "Trending", title: "Flat 50% OFF", sub: "Men's Premium Wardrobe", color: "from-primary/80 to-deal/60" },
  { image: promo2, eyebrow: "Just In", title: "New Arrivals", sub: "Sneakers & Accessories", color: "from-secondary/80 to-primary/60" },
  { image: promo3, eyebrow: "Today Only", title: "Limited Time", sub: "Beauty & Glow Edit", color: "from-deal/80 to-accent/60" },
];

const PromoHoardings = () => {
  return (
    <section className="container py-14 md:py-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-2">Hoardings</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl">Curated Drops</h2>
        </div>
        <a href="#" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">
          View all <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {promos.map((p, i) => (
          <motion.a
            key={p.title}
            href="#"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -6 }}
            className="group relative rounded-3xl overflow-hidden h-72 md:h-80 shadow-soft hover:shadow-glow-purple transition-shadow"
          >
            <img
              src={p.image}
              alt={p.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${p.color} mix-blend-multiply opacity-70 group-hover:opacity-90 transition-opacity`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] opacity-90 mb-1 translate-y-2 group-hover:translate-y-0 transition-transform">
                {p.eyebrow}
              </span>
              <h3 className="font-display font-bold text-3xl md:text-4xl mb-1 translate-y-2 group-hover:translate-y-0 transition-transform delay-75">
                {p.title}
              </h3>
              <p className="text-sm opacity-90 mb-4 translate-y-2 group-hover:translate-y-0 transition-transform delay-100">
                {p.sub}
              </p>
              <div className="flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all delay-150">
                Shop now <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default PromoHoardings;
