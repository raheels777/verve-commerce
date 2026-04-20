import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, User, Search, Menu, X, ChevronDown } from "lucide-react";
import Logo from "./Logo";

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const menus = [
  { label: "Men", slug: "men", items: ["T-Shirts", "Shirts", "Jeans", "Sneakers", "Watches"] },
  { label: "Women", slug: "women", items: ["Dresses", "Tops", "Heels", "Handbags", "Jewelry"] },
  { label: "Electronics", slug: "electronics", items: ["Smartphones", "Laptops", "Headphones", "Smart Watches", "Cameras"] },
  { label: "Beauty", slug: "beauty", items: ["Skincare", "Makeup", "Fragrances", "Haircare", "Wellness"] },
  { label: "Deals", slug: "deals", items: ["Flash Sale", "Trending", "Coupons", "Clearance", "Today Only"] },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Top announcement bar */}
      <div className="text-primary-foreground text-xs sm:text-sm py-2 overflow-hidden" style={{ background: "linear-gradient(90deg, hsl(212 80% 28%) 0%, hsl(280 60% 26%) 50%, hsl(350 75% 28%) 100%)" }}>
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-6">
              <span>🚀 Free Shipping above ₹499</span>
              <span>🔥 Flat 70% OFF on Fashion</span>
              <span>💎 New Drops Every Friday</span>
              <span>🎁 Use code <b>GALAXY10</b> for extra 10% OFF</span>
              <span>⚡ Flash Sale Ends in 4h</span>
            </div>
          ))}
        </div>
      </div>

      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 transition-all duration-500 shadow-soft"
        style={{ background: scrolled
          ? "linear-gradient(90deg, hsl(212 80% 18%) 0%, hsl(280 55% 18%) 50%, hsl(350 75% 20%) 100%)"
          : "linear-gradient(90deg, hsl(212 80% 24%) 0%, hsl(280 55% 24%) 50%, hsl(350 75% 26%) 100%)", backdropFilter: "blur(20px)" }}
      >
        <div className="container flex items-center gap-4 h-16 md:h-20">
          <Link to="/" aria-label="DealzGalaxy home">
            <Logo />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 ml-6">
            {menus.map((m) => (
              <div
                key={m.label}
                className="relative"
                onMouseEnter={() => setOpenMenu(m.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <Link
                  to={`/category/${m.slug}`}
                  className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium text-white/90 hover:bg-white/15 transition-colors"
                >
                  {m.label}
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </Link>
                <AnimatePresence>
                  {openMenu === m.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 pt-3 w-56"
                    >
                      <div className="glass rounded-2xl p-3 shadow-elegant">
                        {m.items.map((it) => (
                          <Link
                            key={it}
                            to={`/category/${m.slug}/${slug(it)}`}
                            onClick={() => setOpenMenu(null)}
                            className="block px-3 py-2 rounded-lg text-sm hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            {it}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-auto">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 group-focus-within:text-white transition-colors" />
                <input
                 type="text"
                 placeholder="Search for products, brands…"
                 className="w-full h-11 pl-11 pr-4 rounded-full bg-white/15 border border-white/10 focus:border-white/30 focus:bg-white/20 outline-none text-sm text-white placeholder:text-white/50 transition-all"
               />
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-1 ml-auto">
            {[
              { icon: Heart, badge: 3, label: "Wishlist" },
              { icon: ShoppingBag, badge: 5, label: "Cart" },
              { icon: User, badge: 0, label: "Profile" },
            ].map(({ icon: Icon, badge, label }) => (
              <motion.button
                key={label}
                aria-label={label}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/15 transition-colors"
              >
                <Icon className="h-5 w-5 text-white" />
                {badge > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-gradient-deal text-[10px] font-bold text-primary-foreground flex items-center justify-center shadow-deal">
                    {badge}
                  </span>
                )}
              </motion.button>
            ))}

            <button
              aria-label="Menu"
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/15"
            >
              {mobileOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden border-t border-border"
            >
              <div className="container py-4 space-y-1">
                <div className="relative md:hidden mb-3">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search…"
                    className="w-full h-11 pl-11 pr-4 rounded-full bg-muted outline-none text-sm"
                  />
                </div>
                {menus.map((m) => (
                  <div key={m.label} className="rounded-xl overflow-hidden">
                    <Link
                      to={`/category/${m.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-3 hover:bg-muted font-medium"
                    >
                      {m.label}
                    </Link>
                    <div className="pl-4 pb-2 grid grid-cols-2 gap-1">
                      {m.items.map((it) => (
                        <Link
                          key={it}
                          to={`/category/${m.slug}/${slug(it)}`}
                          onClick={() => setMobileOpen(false)}
                          className="block px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          {it}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
};

export default Navbar;
