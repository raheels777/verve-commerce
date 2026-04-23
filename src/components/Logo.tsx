import { motion } from "framer-motion";
import logoImg from "@/assets/logo.png";

const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <motion.div
      className={`flex items-center gap-1 sm:gap-1.5 ${className}`}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <img
        src={logoImg}
        alt="DealzGalaxy logo"
        className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 object-contain shrink-0 drop-shadow-lg"
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
