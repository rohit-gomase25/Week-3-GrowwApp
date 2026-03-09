import { memo, useEffect, useState } from "react";
import { useMarketStore } from "@/store";
import { useUIStore } from "@/store";
import axios from "axios";
import { BASE_URL, getAuthHeaders } from "@/services/apis/config"; // Ensure this path is correct

export const Header = memo(function Header() {
  const isConnected = useMarketStore((s) => s.isConnected);
  const tickCount   = useMarketStore((s) => s.tickCount);
  const activeTab   = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.setActiveTab);

  const [isMarketOpen, setIsMarketOpen] = useState(false);
  

// --- LOGOUT LOGIC ---
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('bearer_token');
      await axios.get(
        `${BASE_URL}/v1/api/auth/logout`, 
        { headers: getAuthHeaders(token || "") }
      );

      console.log("DEBUG: API Logout successful");
    } catch (err) {

      console.error("Logout API Error", err);
    } finally {
      localStorage.removeItem("bearer_token");
      sessionStorage.clear();
      
      console.log("DEBUG: Local storage cleared. Redirecting...");
      window.location.href = "/";
    }
  };

  useEffect(() => {
    
const fetchMarketStatus = async () => {
  try {
    const token = localStorage.getItem('bearer_token');
    const response = await axios.post(
      `${BASE_URL}/v2/api/stocks/market-status`, 
      {}, 
      { headers: getAuthHeaders(token || "") } 
    );

    console.log("MARKET STATUS DATA:", response.data);
    
    // FIX 3: Robust status check
    const marketArray = response.data?.market_status;
    if (Array.isArray(marketArray) && marketArray.length > 0) {
      const status = marketArray[0].marketStatus || "";
      setIsMarketOpen(status.toLowerCase().includes("open"));
    }
  } catch (err) {
    console.error("Market API Error", err);
  }
};

    fetchMarketStatus();
    const interval = setInterval(fetchMarketStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const statusLabel = !isConnected ? "OFFLINE" : isMarketOpen ? "LIVE" : "CLOSED";
  const statusColor = (isConnected && isMarketOpen) ? "var(--green)" : "var(--red)";

  

  const tabs: Array<{ id: typeof activeTab; label: string }> = [
    { id: "dashboard",  label: "Market" },
    { id: "portfolio",  label: "Portfolio" },
    { id: "orderbook",  label: "Order Book" },
    { id: "watchlist",  label: "Watchlist" },
  ];

  return (
    <header style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px", height: "52px",
      background: "var(--bg-panel)",
      borderBottom: "1px solid var(--border)",
      flexShrink: 0,
      gap: "24px",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
        <span style={{
          fontFamily: "var(--font-display)", fontSize: "20px",
          fontWeight: "800", color: "var(--blue)", letterSpacing: "-0.5px",
        }}>
          OmneNEST
        </span>
        <span style={{
          fontSize: "9px", color: "var(--text-muted)",
          letterSpacing: "2px", fontFamily: "var(--font-mono)",
        }}>
        </span>
      </div>

      {/* Nav tabs */}
      <nav style={{ display: "flex", gap: "4px", flex: 1 }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            background: activeTab === t.id ? "var(--bg-elevated)" : "none",
            border: activeTab === t.id ? "1px solid var(--border)" : "1px solid transparent",
            color: activeTab === t.id ? "var(--text-primary)" : "var(--text-muted)",
            borderRadius: "var(--radius)",
            padding: "5px 14px",
            fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: "500",
            cursor: "pointer", letterSpacing: "0.5px",
            transition: "all 0.15s ease",
          }}>
            {t.label}
          </button>
        ))}
      </nav>

      {/* Status */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px", flexShrink: 0 }}>
        {tickCount > 0 && (
          <span style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            {tickCount.toLocaleString()} ticks
          </span>
        )}
        
        <div style={{ display: "flex", alignItems: "center", gap: "7px", borderRight: "1px solid var(--border)", paddingRight: "16px" }}>
          <div className={(isConnected && isMarketOpen) ? "pulse" : ""} style={{
            width: "7px", height: "7px", borderRadius: "50%",
            background: statusColor,
            boxShadow: (isConnected && isMarketOpen) ? `0 0 6px ${statusColor}` : "none",
          }} />
          <span style={{
            fontSize: "10px", fontWeight: "600", letterSpacing: "1px",
            color: statusColor,
            fontFamily: "var(--font-mono)",
          }}>
            {statusLabel}
          </span>
        </div>

        {/* LOGOUT BUTTON */}
        <button 
          onClick={handleLogout}
          style={{
            background: "none",
            border: "1px solid var(--border)",
            color: "var(--text-muted)",
            fontSize: "9px",
            fontFamily: "var(--font-mono)",
            padding: "4px 10px",
            cursor: "pointer",
            borderRadius: "4px",
            textTransform: "uppercase",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--red)";
            e.currentTarget.style.borderColor = "var(--red)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-muted)";
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
});