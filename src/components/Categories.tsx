import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shirt, Smartphone, Sparkles, Watch, Headphones, Gem, Footprints, Camera } from "lucide-react";

const cats = [
  { icon: Shirt, label: "Fashion", to: "/category/men", color: "from-primary to-primary-glow" },
  { icon: Smartphone, label: "Mobiles", to: "/category/electronics/smartphones", color: "from-secondary to-primary" },
  { icon: Headphones, label: "Audio", to: "/category/electronics/headphones", color: "from-deal to-accent" },
  { icon: Sparkles, label: "Beauty", to: "/category/beauty", color: "from-primary to-deal" },
  { icon: Watch, label: "Watches", to: "/category/men/watches", color: "from-secondary to-primary-glow" },
  { icon: Footprints, label: "Footwear", to: "/category/men/sneakers", color: "from-accent to-deal" },
  { icon: Gem, label: "Jewelry", to: "/category/women/jewelry", color: "from-primary-glow to-secondary" },
  { icon: Camera, label: "Cameras", to: "/category/electronics/cameras", color: "from-deal to-primary" },
];

const Categories = () => {
  return (
    <section className="container py-14">
      <div className="text-center mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-2">Shop by Category</p>
        <h2 className="font-display font-bold text-3xl md:text-4xl">Explore the Galaxy</h2>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4">
        {cats.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            whileHover={{ y: -8, rotate: -3 }}
          >
            <Link to={c.to} className="group flex flex-col items-center gap-3">
              <div className="relative">
                <div className={`h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-2xl bg-gradient-to-br ${c.color} p-[2px] shadow-soft group-hover:shadow-glow transition-shadow`}>
                  <div className="h-full w-full rounded-2xl bg-card flex items-center justify-center group-hover:scale-95 transition-transform">
                    <c.icon className="h-7 w-7 md:h-8 md:w-8 text-foreground group-hover:text-primary transition-colors" strokeWidth={1.8} />
                  </div>
                </div>
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${c.color} blur-xl opacity-0 group-hover:opacity-50 transition-opacity -z-10`} />
              </div>
              <span className="text-xs md:text-sm font-medium">{c.label}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
