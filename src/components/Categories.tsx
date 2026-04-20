import { motion } from "framer-motion";
import { Shirt, Smartphone, Sparkles, Watch, Headphones, Gem, Footprints, Camera } from "lucide-react";

const cats = [
  { icon: Shirt, label: "Fashion", color: "from-primary to-primary-glow" },
  { icon: Smartphone, label: "Mobiles", color: "from-secondary to-primary" },
  { icon: Headphones, label: "Audio", color: "from-deal to-accent" },
  { icon: Sparkles, label: "Beauty", color: "from-primary to-deal" },
  { icon: Watch, label: "Watches", color: "from-secondary to-primary-glow" },
  { icon: Footprints, label: "Footwear", color: "from-accent to-deal" },
  { icon: Gem, label: "Jewelry", color: "from-primary-glow to-secondary" },
  { icon: Camera, label: "Cameras", color: "from-deal to-primary" },
];

const Categories = () => {
  return (
    <section className="container py-14">
      <div className="text-center mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-2">Shop by Category</p>
        <h2 className="font-display font-bold text-3xl md:text-4xl">Explore the Galaxy</h2>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
        {cats.map((c, i) => (
          <motion.a
            key={c.label}
            href="#"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            whileHover={{ y: -8, rotate: -3 }}
            className="group flex flex-col items-center gap-3"
          >
            <div className="relative">
              <div className={`h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-gradient-to-br ${c.color} p-[2px] shadow-soft group-hover:shadow-glow transition-shadow`}>
                <div className="h-full w-full rounded-2xl bg-card flex items-center justify-center group-hover:scale-95 transition-transform">
                  <c.icon className="h-7 w-7 md:h-8 md:w-8 text-foreground group-hover:text-primary transition-colors" strokeWidth={1.8} />
                </div>
              </div>
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${c.color} blur-xl opacity-0 group-hover:opacity-50 transition-opacity -z-10`} />
            </div>
            <span className="text-xs md:text-sm font-medium">{c.label}</span>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default Categories;
