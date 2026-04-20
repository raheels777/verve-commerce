import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Tag } from "lucide-react";

const FloatingHoardings = () => {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  return (
    <>
      <AnimatePresence>
        {leftOpen && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ y: { repeat: Infinity, duration: 3, ease: "easeInOut" }, opacity: { duration: 0.4 } }}
            className="hidden xl:block fixed left-4 top-1/2 -translate-y-1/2 z-40 w-32"
          >
            <div className="relative rounded-2xl bg-gradient-primary p-4 text-primary-foreground shadow-glow text-center">
              <button
                onClick={() => setLeftOpen(false)}
                aria-label="Close"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background text-foreground flex items-center justify-center shadow"
              >
                <X className="h-3 w-3" />
              </button>
              <Gift className="h-7 w-7 mx-auto mb-2" />
              <p className="text-[10px] uppercase tracking-wider opacity-90">Coupon</p>
              <p className="font-display font-bold text-2xl leading-none">10%</p>
              <p className="text-[10px] mt-1 opacity-90">code GALAXY10</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {rightOpen && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0, y: [0, 6, 0] }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ y: { repeat: Infinity, duration: 3, ease: "easeInOut" }, opacity: { duration: 0.4 } }}
            className="hidden xl:block fixed right-4 top-1/2 -translate-y-1/2 z-40 w-32"
          >
            <div className="relative rounded-2xl bg-gradient-deal p-4 text-primary-foreground shadow-deal text-center">
              <button
                onClick={() => setRightOpen(false)}
                aria-label="Close"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background text-foreground flex items-center justify-center shadow"
              >
                <X className="h-3 w-3" />
              </button>
              <Tag className="h-7 w-7 mx-auto mb-2" />
              <p className="text-[10px] uppercase tracking-wider opacity-90">Flash</p>
              <p className="font-display font-bold text-2xl leading-none">80%</p>
              <p className="text-[10px] mt-1 opacity-90">OFF Today</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingHoardings;
