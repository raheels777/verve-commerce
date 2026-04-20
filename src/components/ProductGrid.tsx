import { products } from "@/data/products";
import { productStore } from "@/store/adminStore";
import ProductCard from "./ProductCard";

const ProductGrid = () => {
  const adminProducts = productStore.getAll();
  const allProducts = [...adminProducts, ...products];

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

      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {allProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
    </section>
  );
};

export default ProductGrid;
