import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Youtube, Send } from "lucide-react";
import Logo from "./Logo";

const cols = [
  { title: "Shop", links: ["New Arrivals", "Best Sellers", "Flash Sale", "Coupons", "Gift Cards"] },
  { title: "Help", links: ["Track Order", "Returns", "Shipping", "FAQ", "Contact"] },
  { title: "Company", links: ["About Us", "Careers", "Press", "Sustainability", "Blog"] },
];

const Footer = () => {
  return (
    <footer className="mt-10 bg-gradient-dark text-white relative overflow-hidden">
      <div className="absolute -top-20 left-1/4 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
      <div className="absolute -bottom-20 right-1/4 h-64 w-64 rounded-full bg-deal/20 blur-3xl" />

      <div className="container py-14 relative">
        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl glass-dark p-8 md:p-10 mb-12 flex flex-col md:flex-row items-center gap-6 justify-between"
        >
          <div>
            <h3 className="font-display font-bold text-2xl md:text-3xl mb-2">Join the Galaxy</h3>
            <p className="text-white/70 text-sm">Drop your email — get exclusive deals before anyone else.</p>
          </div>
          <form className="flex w-full md:w-auto gap-2 max-w-md" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              required
              placeholder="you@email.com"
              className="flex-1 md:w-72 h-12 px-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 outline-none focus:border-primary"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ripple h-12 px-6 rounded-full bg-gradient-primary font-semibold flex items-center gap-2 shadow-glow"
            >
              Subscribe <Send className="h-4 w-4" />
            </motion.button>
          </form>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Logo className="text-white" />
            <p className="text-sm text-white/70 mt-4 max-w-xs">
              The premium destination for trending deals on fashion, electronics, beauty and more.
            </p>
            <div className="flex gap-2 mt-5">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -3, scale: 1.1 }}
                  className="h-10 w-10 rounded-full glass-dark flex items-center justify-center hover:bg-primary/30 transition-colors"
                  aria-label="social"
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="font-display font-semibold mb-4 text-sm uppercase tracking-wider">{c.title}</h4>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-white/70 hover:text-white transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between gap-3 text-xs text-white/50">
          <p>© 2026 DealzGalaxy. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
