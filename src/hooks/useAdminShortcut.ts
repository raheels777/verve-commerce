import { useEffect, useState } from "react";
import { adminAuth } from "@/store/adminStore";

export const useAdminShortcut = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    const open = () => {
      if (adminAuth.isLoggedIn()) setShowPanel(true);
      else setShowLogin(true);
    };
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && (e.key === "R" || e.key === "r")) {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", handler);
    window.addEventListener("open-admin", open);
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("open-admin", open);
    };
  }, []);

  const onLoginSuccess = () => {
    setShowLogin(false);
    setShowPanel(true);
  };

  return { showLogin, setShowLogin, showPanel, setShowPanel, onLoginSuccess };
};
