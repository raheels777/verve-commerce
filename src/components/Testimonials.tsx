import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  { name: "Aarav Mehta", role: "Verified Buyer", text: "DealzGalaxy ka flash sale insane tha — my Sony headphones came in 2 days, sealed pack. Bookmarked forever!", rating: 5 },
  { name: "Priya Sharma", role: "Fashion Lover", text: "The curation is unreal. Found 3 outfits I'd never see anywhere else. Packaging felt luxe.", rating: 5 },
  { name: "Rohan Iyer", role: "Tech Enthusiast", text: "Compared prices across 5 sites — DealzGalaxy was cheapest with a coupon stack. Trusted ✨", rating: 5 },
];

const Testimonials = () => {
  return (
    <section className="container py-16">
      <div className="text-center mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-2">Loved by Shoppers</p>
        <h2 className="font-display font-bold text-3xl md:text-4xl">10,000+ Happy Customers</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {reviews.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            className="relative rounded-3xl glass p-6 shadow-soft hover:shadow-glow-purple transition-shadow"
          >
            <Quote className="absolute top-5 right-5 h-8 w-8 text-primary/20" />
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: r.rating }).map((_, j) => (
                <Star key={j} className="h-4 w-4 fill-accent text-accent" />
              ))}
            </div>
            <p className="text-sm leading-relaxed mb-5 text-foreground/85">"{r.text}"</p>
            <div className="flex items-center gap-3 pt-4 border-t border-border/50">
              <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                {r.name[0]}
              </div>
              <div>
                <p className="text-sm font-semibold">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
