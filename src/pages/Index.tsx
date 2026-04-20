import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PromoHoardings from "@/components/PromoHoardings";
import Categories from "@/components/Categories";
import TrendingDeals from "@/components/TrendingDeals";
import FlashSaleStrip from "@/components/FlashSaleStrip";
import ProductGrid from "@/components/ProductGrid";
import FloatingHoardings from "@/components/FloatingHoardings";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import AdminLoginModal from "@/components/AdminLoginModal";
import AdminPanel from "@/components/AdminPanel";
import { useAdminShortcut } from "@/hooks/useAdminShortcut";

const Index = () => {
  const { showLogin, setShowLogin, showPanel, setShowPanel, onLoginSuccess } = useAdminShortcut();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <PromoHoardings />
        <Categories />
        <TrendingDeals />
        <FlashSaleStrip />
        <ProductGrid />
        <Testimonials />
      </main>
      <Footer />
      <FloatingHoardings />
      <AdminLoginModal open={showLogin} onClose={() => setShowLogin(false)} onSuccess={onLoginSuccess} />
      <AdminPanel open={showPanel} onClose={() => setShowPanel(false)} />
    </div>
  );
};

export default Index;
