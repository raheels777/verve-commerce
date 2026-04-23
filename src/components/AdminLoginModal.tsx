import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Mail, Shield } from "lucide-react";
import { adminAuth } from "@/store/adminStore";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const AdminLoginModal = ({ open, onClose, onSuccess }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const ok = await adminAuth.login(email, password);
    if (ok) {
      onSuccess();
      onClose();
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md mx-4 rounded-3xl overflow-hidden shadow-elegant"
            style={{ background: "linear-gradient(135deg, hsl(212 80% 12%), hsl(350 60% 18%))" }}
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white">
              <X className="h-5 w-5" />
            </button>

            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-gradient-primary flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Admin Access</h2>
                  <p className="text-sm text-white/60">DealzGalaxy Control Panel</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Admin email"
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/10 text-white placeholder:text-white/40 outline-none border border-white/10 focus:border-primary/60 transition-colors"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/10 text-white placeholder:text-white/40 outline-none border border-white/10 focus:border-primary/60 transition-colors"
                  />
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full h-12 rounded-xl bg-gradient-primary text-white font-semibold shadow-glow"
                >
                  Login
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminLoginModal;
