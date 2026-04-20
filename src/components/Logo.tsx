import { motion } from "framer-motion";
import logoImg from "@/assets/logo.png";

const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <motion.div
      className={`flex items-center gap-2 sm:gap-2.5 ${className}`}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <img
        src={logoImg}
        alt="DealzGalaxy logo"
        className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 object-contain shrink-0 drop-shadow-sm"
        loading="eager"
        decoding="async"
      />
      <div className="flex flex-col leading-none">
        <span className="font-display font-extrabold text-lg sm:text-xl md:text-2xl tracking-tight">
          Dealz<span className="text-gradient">Galaxy</span>
        </span>
        <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium hidden sm:block">
          Premium Deals · 2026
        </span>
      </div>
    </motion.div>
  );
};

export default Logo;
