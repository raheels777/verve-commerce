import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const slides = [
  {
    image: hero1,
    eyebrow: "Mega Sale · Limited Time",
    title: "FLAT 70% OFF",
    subtitle: "Fashion drop · 2026 collection",
    cta: "Shop Fashion",
    accent: "from-primary to-primary-glow",
  },
  {
    image: hero2,
    eyebrow: "Tech Carnival",
    title: "ELECTRONICS FEST",
    subtitle: "Top brands · upto 65% off + extra 10%",
    cta: "Explore Tech",
    accent: "from-secondary to-primary-glow",
  },
  {
    image: hero3,
    eyebrow: "Beauty Edit",
    title: "GLOW SEASON",
    subtitle: "Skincare & makeup · luxe picks",
    cta: "Shop Beauty",
    accent: "from-deal to-primary",
  },
];

const Hero = () => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, []);

  const next = () => setIdx((i) => (i + 1) % slides.length);
  const prev = () => setIdx((i) => (i - 1 + slides.length) % slides.length);
  const slide = slides[idx];

  return (
    <section className="container pt-6">
      <div className="relative h-[480px] md:h-[560px] rounded-[2rem] overflow-hidden shadow-elegant">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <motion.img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1.18 }}
              transition={{ duration: 7, ease: "linear" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent dark:from-black/80 dark:via-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-2xl px-6 md:px-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs uppercase tracking-[0.25em] font-semibold mb-5">
                  <span className="h-1.5 w-1.5 rounded-full bg-deal animate-pulse" />
                  {slide.eyebrow}
                </span>
                <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight mb-4">
                  <span className={`bg-gradient-to-r ${slide.accent} bg-clip-text text-transparent drop-shadow-sm`}>
                    {slide.title}
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-md">
                  {slide.subtitle}
                </p>
                <div className="flex flex-wrap gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="ripple group inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-7 py-3.5 rounded-full font-semibold shadow-glow hover:shadow-glow-purple transition-shadow"
                  >
                    {slide.cta}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="glass px-7 py-3.5 rounded-full font-semibold hover:bg-white/40 dark:hover:bg-white/10 transition-colors"
                  >
                    View Lookbook
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* arrows */}
        <button
          onClick={prev}
          aria-label="Previous"
          className="hidden md:flex absolute left-5 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full glass items-center justify-center hover:scale-110 transition-transform z-20"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          aria-label="Next"
          className="hidden md:flex absolute right-5 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full glass items-center justify-center hover:scale-110 transition-transform z-20"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === idx ? "w-8 bg-gradient-primary" : "w-2 bg-foreground/30 hover:bg-foreground/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
