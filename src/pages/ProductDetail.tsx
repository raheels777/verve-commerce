import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star, ArrowLeft, Truck, ShieldCheck, RotateCcw, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProduct, formatINR, products } from "@/data/products";
import { productStore } from "@/store/adminStore";
import ProductCard from "@/components/ProductCard";
import { useState } from "react";

const ProductDetail = () => {
  const { id } = useParams();
  const adminProducts = productStore.getAll();
  const product = id ? (getProduct(id) || adminProducts.find((p) => p.id === id)) : undefined;
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-32 text-center">
          <h1 className="font-display font-bold text-3xl mb-4">Product not found</h1>
          <Link to="/" className="text-primary font-semibold">← Back to home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const off = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const related = products.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8 md:py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-square rounded-3xl overflow-hidden bg-muted shadow-elegant"
          >
            <img src={product.img} alt={product.title} className="w-full h-full object-cover" />
            <span className="absolute top-4 left-4 bg-gradient-deal text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-deal">
              -{off}%
            </span>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-xs uppercase tracking-[0.25em] font-semibold text-primary mb-2">{product.brand}</p>
            <h1 className="font-display font-bold text-3xl md:text-4xl leading-tight mb-3">{product.title}</h1>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1 bg-success/10 text-success px-2.5 py-1 rounded-full text-xs font-semibold">
                <Star className="h-3 w-3 fill-current" /> {product.rating}
              </div>
              <span className="text-sm text-muted-foreground">{product.reviews.toLocaleString("en-IN")} reviews</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-display font-bold text-4xl">{formatINR(product.price)}</span>
              <span className="text-lg text-muted-foreground line-through">{formatINR(product.mrp)}</span>
              <span className="text-sm font-bold text-success">{off}% off</span>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>

            <div className="space-y-2 mb-8">
              {product.highlights.map((h) => (
                <div key={h} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-success" /> {h}
                </div>
              ))}
            </div>

            {/* Qty + actions */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center bg-muted rounded-full">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-10 w-10 rounded-full hover:bg-muted-foreground/10 font-bold">−</button>
                <span className="w-10 text-center font-semibold">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="h-10 w-10 rounded-full hover:bg-muted-foreground/10 font-bold">+</button>
              </div>
              <span className="text-xs text-success font-semibold">In stock</span>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="ripple flex-1 inline-flex items-center justify-center gap-2 bg-gradient-primary text-primary-foreground px-7 py-3.5 rounded-full font-semibold shadow-glow"
              >
                <ShoppingBag className="h-4 w-4" /> Add to Cart
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="ripple flex-1 inline-flex items-center justify-center gap-2 rounded-full font-semibold px-7 py-3.5 text-primary-foreground"
                style={{ background: "linear-gradient(135deg, hsl(212 80% 25%), hsl(212 80% 35%))" }}
              >
                ⚡ Buy Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 glass px-6 py-3.5 rounded-full font-semibold"
              >
                <Heart className="h-4 w-4" /> Wishlist
              </motion.button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              {[
                { icon: Truck, label: "Free Shipping" },
                { icon: ShieldCheck, label: "2 Yr Warranty" },
                { icon: RotateCcw, label: "7 Day Returns" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-muted">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="font-medium text-center">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related */}
        <section className="mt-20">
          <h2 className="font-display font-bold text-2xl md:text-3xl mb-6">You may also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
