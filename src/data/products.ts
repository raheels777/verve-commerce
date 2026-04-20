import p1 from "@/assets/product-1.jpg";
import p2 from "@/assets/product-2.jpg";
import p3 from "@/assets/product-3.jpg";
import p4 from "@/assets/product-4.jpg";
import p5 from "@/assets/product-5.jpg";
import p6 from "@/assets/product-6.jpg";

export type Product = {
  id: string;
  img: string;
  brand: string;
  title: string;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  category: string; // matches mega-menu category slug e.g. "men", "women", "electronics"
  subcategory: string; // matches item slug e.g. "sneakers"
  store?: string;
  hot?: boolean;
  description: string;
  highlights: string[];
};

export const products: Product[] = [
  {
    id: "sony-wh1000xm5",
    img: p1,
    brand: "Sony",
    title: "WH-1000XM5 Wireless Headphones",
    price: 24990,
    mrp: 34990,
    rating: 4.7,
    reviews: 2841,
    category: "electronics",
    subcategory: "headphones",
    store: "Amazon",
    hot: true,
    description:
      "Industry-leading noise cancellation with two processors and eight microphones. Crystal-clear hands-free calls, 30-hour battery life and premium comfort for all-day listening.",
    highlights: [
      "Industry-leading noise cancellation",
      "30 hour battery, fast charge",
      "Multipoint Bluetooth 5.2",
      "Hi-Res Audio Wireless",
    ],
  },
  {
    id: "adidas-cloud-runner",
    img: p2,
    brand: "Adidas",
    title: "Cloud Runner Sneakers",
    price: 2199,
    mrp: 5499,
    rating: 4.5,
    reviews: 1532,
    category: "men",
    subcategory: "sneakers",
    store: "Myntra",
    hot: true,
    description:
      "Premium white sneakers built for everyday comfort with cloudfoam cushioning and a breathable mesh upper. Goes with anything, anywhere.",
    highlights: ["Cloudfoam midsole", "Breathable mesh upper", "Rubber outsole grip", "Lightweight everyday wear"],
  },
  {
    id: "fossil-chronograph",
    img: p3,
    brand: "Fossil",
    title: "Classic Chronograph Watch",
    price: 3499,
    mrp: 9999,
    rating: 4.6,
    reviews: 894,
    category: "men",
    subcategory: "watches",
    store: "Flipkart",
    description:
      "A timeless chronograph with a stainless-steel case, mineral crystal and genuine leather strap. Subtle, elegant and built to last.",
    highlights: ["Stainless steel case", "Genuine leather strap", "Chronograph movement", "5 ATM water resistant"],
  },
  {
    id: "hidesign-tote",
    img: p4,
    brand: "Hidesign",
    title: "Designer Leather Tote Bag",
    price: 1899,
    mrp: 4999,
    rating: 4.4,
    reviews: 412,
    category: "women",
    subcategory: "handbags",
    store: "Ajio",
    description:
      "Hand-finished full-grain leather tote with roomy interior, secure zip pocket and signature brass hardware. Crafted to age beautifully.",
    highlights: ["Full-grain leather", "Spacious interior", "Brass hardware", "Handcrafted in India"],
  },
  {
    id: "ck-eternity",
    img: p5,
    brand: "Calvin Klein",
    title: "Eternity Eau de Parfum 100ml",
    price: 4299,
    mrp: 6499,
    rating: 4.8,
    reviews: 1129,
    category: "beauty",
    subcategory: "fragrances",
    description:
      "An iconic floral bouquet with notes of freesia, sage, and sandalwood. Long-lasting, romantic, unmistakably Eternity.",
    highlights: ["Top: Freesia, Sage", "Heart: Lily, Marigold", "Base: Sandalwood, Amber", "Long-lasting EDP"],
  },
  {
    id: "rayban-clubmaster",
    img: p6,
    brand: "Ray-Ban",
    title: "Clubmaster Classic Sunglasses",
    price: 5499,
    mrp: 8999,
    rating: 4.6,
    reviews: 2010,
    category: "men",
    subcategory: "accessories",
    description:
      "The unmistakable retro silhouette in acetate and metal, with crystal G-15 lenses for true color and crisp contrast.",
    highlights: ["Acetate + metal frame", "Crystal G-15 lenses", "100% UV protection", "Iconic Clubmaster design"],
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);

export const getProductsByCategory = (category: string) =>
  products.filter((p) => p.category === category);

export const getProductsBySubcategory = (subcategory: string) =>
  products.filter((p) => p.subcategory === subcategory);

export const formatINR = (n: number) => "₹" + n.toLocaleString("en-IN");
