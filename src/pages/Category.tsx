import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

const Category = () => {
  const { category, subcategory } = useParams();

  const filtered = products.filter((p) => {
    if (subcategory) return p.subcategory === subcategory;
    if (category) return p.category === category;
    return true;
  });

  const title = subcategory || category || "Shop";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10 md:py-14">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-2">
            {category && <Link to={`/category/${category}`} className="hover:underline capitalize">{category}</Link>}
            {subcategory && <span> / <span className="capitalize">{subcategory}</span></span>}
          </p>
          <h1 className="font-display font-bold text-3xl md:text-4xl capitalize">{title}</h1>
          <p className="text-muted-foreground mt-2">{filtered.length} products</p>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground mb-4">No products in this category yet.</p>
            <Link to="/" className="text-primary font-semibold">← Back to home</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Category;
