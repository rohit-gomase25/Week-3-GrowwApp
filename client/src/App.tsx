import { useState, useEffect } from "react";
import { useWebSocket } from "@/shared/hooks/useWebSocket";
import { Header } from "@/shared/components/Header";
import { NotificationStack } from "@/shared/components/NotificationStack";
import { DashboardPage } from "@/pages/DashboardPage";
import { PortfolioPage } from "@/features/portfolio-overview/PortfolioPage";
import { OrderBookPage } from "@/features/order-book/OrderBookPage";
import { WatchlistPage } from "@/features/dashboard/WatchlistPage";
import { LoginPage } from "@/features/auth/LoginPage";
import { useUIStore } from "@/store/ui.store";
import { DashboardHeader } from "@/shared/components/DashboardHeader";
import { preAuthHandshake } from "@/services/apis/prehandshake";
import { WatchlistManager } from "./shared/components/WatchlistManager";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const activeTab = useUIStore((s) => s.activeTab);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await preAuthHandshake();
        const token = localStorage.getItem('bearer_token');
        if (token) setIsAuthenticated(true);
      } catch (error) {
        console.error("Critical Session Error. Force-cleaning browser state...");
        localStorage.clear(); 
        sessionStorage.clear();
        if (!window.location.search.includes('reset=true')) {
          window.location.href = window.location.pathname + '?reset=true';
        }
        setIsAuthenticated(false);
      } finally {
        setIsReady(true);
      }
    };
    initializeApp();
  }, []);

  useWebSocket();

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard":  return <DashboardPage />;
      case "portfolio":  return <PortfolioPage />;
      case "orderbook":  return <OrderBookPage />;
      // Standard Groww Watchlist
      case "watchlist":  return <WatchlistPage />;
      // API Config Watchlist (Dashboard Header)
      case "watchlist2": return <WatchlistManager />;
      default:           return <DashboardPage />;
    }
  };

  if (!isReady) {
    return (
      <div style={{ 
        height: "100vh", display: "flex", alignItems: "center", 
        justifyContent: "center", background: "var(--bg-void)", color: "var(--green)",
        fontFamily: "var(--font-mono)", fontSize: "11px"
      }}>
        [ INITIALIZING SECURE SESSION ]
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "100vh", overflow: "hidden",
      background: "var(--bg-void)",
    }}>
      <DashboardHeader />
      <Header />

      <main style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
        {renderTab()}
      </main>

      <footer style={{
        padding: "4px 20px",
        borderTop: "1px solid var(--border)",
        background: "var(--bg-panel)",
        display: "flex", justifyContent: "space-between",
        fontSize: "9px", color: "var(--text-muted)",
        fontFamily: "var(--font-mono)", letterSpacing: "0.5px",
        flexShrink: 0,
      }}>
        <span>ws://localhost:8080</span>
        <span>Groww-915 · Secure Session Active</span>
      </footer>

      <NotificationStack />
    </div>
  );
}