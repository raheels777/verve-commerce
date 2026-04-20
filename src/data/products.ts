import musallah from "@/assets/setial-musallah.jpg";

export type Product = {
  id: string;
  img: string;
  brand: string;
  title: string;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  category: string;
  subcategory: string;
  store?: string;
  hot?: boolean;
  description: string;
  highlights: string[];
  affiliateUrl?: string;
  images?: string[];
};

export const products: Product[] = [
  {
    id: "setial-living-musallah",
    img: musallah,
    brand: "Setial Living",
    title: "Setial Living Premium Foldable Musallah / Prayer Mat",
    price: 799,
    mrp: 1499,
    rating: 4.7,
    reviews: 312,
    category: "lifestyle",
    subcategory: "prayer-mats",
    store: "Amazon",
    hot: true,
    description:
      "Setial Living premium foldable musallah / janamaz with elegant Islamic geometric design. Soft padded comfort, anti-slip base, lightweight and travel-friendly — perfect for daily prayers at home, office, or travel.",
    highlights: [
      "Premium soft padded fabric",
      "Foldable & travel-friendly design",
      "Anti-slip base for stability",
      "Elegant Islamic geometric pattern",
    ],
    affiliateUrl: "https://www.amazon.in/s?k=setial+living+musallah",
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);

export const getProductsByCategory = (category: string) =>
  products.filter((p) => p.category === category);

export const getProductsBySubcategory = (subcategory: string) =>
  products.filter((p) => p.subcategory === subcategory);

export const formatINR = (n: number) => "₹" + n.toLocaleString("en-IN");
