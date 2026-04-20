import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Star, Tag } from "lucide-react";
import { Product, formatINR } from "@/data/products";

const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  const off = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const isExternal = !!product.affiliateUrl;

  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    isExternal ? (
      <a
        href={product.affiliateUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block"
      >
        {children}
      </a>
    ) : (
      <Link to={`/product/${product.id}`} className="block">
        {children}
      </Link>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="group bg-card rounded-3xl overflow-hidden border border-border shadow-soft hover:shadow-elegant transition-all"
    >
      <Wrapper>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.img}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <span className="absolute top-3 left-3 bg-gradient-deal text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-deal">
            -{off}%
          </span>
          {product.store && (
            <span className="absolute top-3 left-3 mt-8 bg-background/90 backdrop-blur text-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full border border-border">
              {product.store}
            </span>
          )}
          <button
            aria-label="Add to wishlist"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute top-3 right-3 h-9 w-9 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all hover:bg-deal hover:text-primary-foreground"
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
            {product.brand}
          </p>
          <h3 className="text-sm font-medium line-clamp-2 mb-2 min-h-[2.5rem]">
            {product.title}
          </h3>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-bold">{formatINR(product.price)}</span>
              <span className="text-xs text-muted-foreground line-through">
                {formatINR(product.mrp)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold bg-success/10 text-success px-2 py-0.5 rounded-full">
              <Star className="h-3 w-3 fill-current" /> {product.rating}
            </div>
          </div>

          <div className="w-full bg-gradient-primary text-primary-foreground rounded-full py-2.5 text-sm font-semibold flex items-center justify-center gap-2 shadow-glow group-hover:shadow-elegant transition-shadow">
            <Tag className="h-4 w-4" /> Get Deal
          </div>
        </div>
      </Wrapper>
    </motion.div>
  );
};

export default ProductCard;
