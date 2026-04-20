import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, User, Search, Menu, X, ChevronDown } from "lucide-react";
import Logo from "./Logo";

const menus = [
  { label: "Men", items: ["T-Shirts", "Shirts", "Jeans", "Sneakers", "Watches"] },
  { label: "Women", items: ["Dresses", "Tops", "Heels", "Handbags", "Jewelry"] },
  { label: "Electronics", items: ["Smartphones", "Laptops", "Headphones", "Smart Watches", "Cameras"] },
  { label: "Beauty", items: ["Skincare", "Makeup", "Fragrances", "Haircare", "Wellness"] },
  { label: "Deals", items: ["Flash Sale", "Trending", "Coupons", "Clearance", "Today Only"] },
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
      <div className="bg-gradient-primary text-primary-foreground text-xs sm:text-sm py-2 overflow-hidden">
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
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled ? "glass shadow-soft" : "bg-background/80 backdrop-blur-sm"
        }`}
      >
        <div className="container flex items-center gap-4 h-16 md:h-20">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 ml-6">
            {menus.map((m) => (
              <div
                key={m.label}
                className="relative"
                onMouseEnter={() => setOpenMenu(m.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium hover:bg-muted transition-colors">
                  {m.label}
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>
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
                          <a
                            key={it}
                            href="#"
                            className="block px-3 py-2 rounded-lg text-sm hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            {it}
                          </a>
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
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search for products, brands…"
                className="w-full h-11 pl-11 pr-4 rounded-full bg-muted border border-transparent focus:border-primary/40 focus:bg-background outline-none text-sm transition-all"
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
                className="relative h-10 w-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
              >
                <Icon className="h-5 w-5" />
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
              className="lg:hidden h-10 w-10 flex items-center justify-center rounded-full hover:bg-muted"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
                  <a key={m.label} href="#" className="block px-4 py-3 rounded-xl hover:bg-muted font-medium">
                    {m.label}
                  </a>
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
