import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";
import p1 from "@/assets/product-1.jpg";
import p2 from "@/assets/product-2.jpg";
import p3 from "@/assets/product-3.jpg";
import p4 from "@/assets/product-4.jpg";
import p5 from "@/assets/product-5.jpg";
import p6 from "@/assets/product-6.jpg";

const products = [
  { img: p1, brand: "Sony", title: "WH-1000XM5 Wireless", price: 24990, mrp: 34990, rating: 4.7 },
  { img: p2, brand: "Adidas", title: "Cloud Runner Sneakers", price: 2199, mrp: 5499, rating: 4.5 },
  { img: p3, brand: "Fossil", title: "Classic Chronograph", price: 3499, mrp: 9999, rating: 4.6 },
  { img: p4, brand: "Hidesign", title: "Leather Tote Bag", price: 1899, mrp: 4999, rating: 4.4 },
  { img: p5, brand: "Calvin Klein", title: "Eternity EDP 100ml", price: 4299, mrp: 6499, rating: 4.8 },
  { img: p6, brand: "Ray-Ban", title: "Clubmaster Classic", price: 5499, mrp: 8999, rating: 4.6 },
];

const formatINR = (n: number) => "₹" + n.toLocaleString("en-IN");

const ProductGrid = () => {
  return (
    <section className="container py-14">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-2">Top Picks</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl">Best of the Galaxy</h2>
        </div>
        <div className="hidden md:flex items-center gap-2">
          {["All", "New", "Bestsellers", "Premium"].map((t, i) => (
            <button
              key={t}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                i === 0 ? "bg-gradient-primary text-primary-foreground shadow-glow" : "bg-muted hover:bg-muted/70"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5">
        {products.map((p, i) => {
          const off = Math.round(((p.mrp - p.price) / p.mrp) * 100);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="group bg-card rounded-3xl overflow-hidden border border-border shadow-soft hover:shadow-elegant transition-all"
            >
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <span className="absolute top-3 left-3 bg-gradient-deal text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-deal">
                  -{off}%
                </span>
                <button
                  aria-label="Add to wishlist"
                  className="absolute top-3 right-3 h-9 w-9 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all hover:bg-deal hover:text-primary-foreground"
                >
                  <Heart className="h-4 w-4" />
                </button>

                <div className="absolute inset-x-3 bottom-3 translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button className="w-full bg-gradient-primary text-primary-foreground rounded-full py-2.5 text-sm font-semibold flex items-center justify-center gap-2 shadow-glow ripple">
                    <ShoppingBag className="h-4 w-4" /> Add to Cart
                  </button>
                </div>
              </div>

              <div className="p-4">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">{p.brand}</p>
                <h3 className="text-sm font-medium line-clamp-1 mb-2">{p.title}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display font-bold">{formatINR(p.price)}</span>
                    <span className="text-xs text-muted-foreground line-through">{formatINR(p.mrp)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold bg-success/10 text-success px-2 py-0.5 rounded-full">
                    <Star className="h-3 w-3 fill-current" /> {p.rating}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductGrid;
