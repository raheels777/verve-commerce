import { useEffect, useState } from "react";
import { adminAuth } from "@/store/adminStore";

export const useAdminShortcut = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && (e.key === "R" || e.key === "r")) {
        e.preventDefault();
        if (adminAuth.isLoggedIn()) {
          setShowPanel(true);
        } else {
          setShowLogin(true);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const onLoginSuccess = () => {
    setShowLogin(false);
    setShowPanel(true);
  };

  return { showLogin, setShowLogin, showPanel, setShowPanel, onLoginSuccess };
};
