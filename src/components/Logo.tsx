import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <motion.a
      href="#"
      className={`flex items-center gap-2 ${className}`}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="relative">
        <div className="h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
          <Sparkles className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <div className="absolute inset-0 rounded-xl bg-gradient-primary blur-md opacity-50 -z-10" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-display font-extrabold text-xl tracking-tight">
          Dealz<span className="text-gradient">Galaxy</span>
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium hidden sm:block">
          Premium Deals · 2026
        </span>
      </div>
    </motion.a>
  );
};

export default Logo;
