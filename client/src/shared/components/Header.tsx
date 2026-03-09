import { memo, useEffect, useState, useCallback } from "react";
import { useMarketStore } from "@/store";
import { useUIStore } from "@/store";
import axios from "axios";
import { BASE_URL, getAuthHeaders } from "@/services/apis/config";
import { fetchGlobalSearch, SearchResult } from "@/services/apis/search";

export const Header = memo(function Header() {
  const isConnected = useMarketStore((s) => s.isConnected);
  const tickCount = useMarketStore((s) => s.tickCount);
  const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.setActiveTab);

  const [isMarketOpen, setIsMarketOpen] = useState(false);

  // --- SEARCH STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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
      window.location.href = "/";
    }
  };

  // --- GLOBAL SEARCH EXECUTION ---
  const executeSearch = useCallback(async (query: string) => {
    // API likely requires 3+ characters (based on your 400 error)
    if (query.trim().length < 3) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const results = await fetchGlobalSearch(query);
      setSearchResults(results);
    } catch (err) {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce Effect - Runs globally now
  useEffect(() => {
    const timer = setTimeout(() => {
      executeSearch(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, executeSearch]);

  useEffect(() => {
    const fetchMarketStatus = async () => {
      try {
        const token = localStorage.getItem('bearer_token');
        const response = await axios.post(
          `${BASE_URL}/v2/api/stocks/market-status`,
          {},
          { headers: getAuthHeaders(token || "") }
        );

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
    { id: "dashboard", label: "Market" },
    { id: "portfolio", label: "Portfolio" },
    { id: "orderbook", label: "Order Book" },
    { id: "watchlist", label: "Watchlist" },
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
      </div>

      {/* GLOBAL SEARCH & NAV */}
      <nav style={{ display: "flex", gap: "12px", flex: 1, alignItems: "center" }}>
        <div style={{ display: "flex", gap: "4px" }}>
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
        </div>

        {/* SEARCH INPUT (Now Global) */}
        <div style={{ position: "relative", flex: 1, maxWidth: "320px" }}>
          <input
            type="text"
            placeholder="SEARCH (e.g. RELIANCE)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%", background: "var(--bg-elevated)", border: "1px solid var(--border)",
              borderRadius: "4px", padding: "6px 12px", color: "var(--text-primary)",
              fontSize: "10px", outline: "none", fontFamily: "var(--font-mono)"
            }}
          />

          {/* RESULTS DROPDOWN */}
          {/* RESULTS DROPDOWN */}
          {searchResults.length > 0 && searchQuery.length >= 3 && (
            <div style={{
              position: "absolute", top: "calc(100% + 5px)", left: 0, right: 0,
              background: "var(--bg-panel)", border: "1px solid var(--border)",
              zIndex: 1000, maxHeight: "350px", overflowY: "auto",
              boxShadow: "0 12px 24px rgba(0,0,0,0.6)", borderRadius: "4px"
            }}>
              {searchResults.map((res) => (
                <div
                  // FIX: Changed from res.tradingSymbol to res.uniqueKey
                  key={res.uniqueKey || res.scripToken}
                  style={{
                    padding: "10px 14px", borderBottom: "1px solid var(--border-subtle)",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-elevated)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  onClick={() => {
                    console.log("Global Selection:", res.tradingSymbol);
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                >
                  <div style={{ color: "var(--blue)", fontSize: "11px", fontWeight: "bold", fontFamily: "var(--font-mono)" }}>
                    {res.tradingSymbol} <span style={{ color: "var(--text-muted)", fontSize: "9px", marginLeft: "4px" }}>[{res.exchangeName}]</span>
                  </div>
                  <div style={{ fontSize: "9px", color: "var(--text-muted)", marginTop: "2px" }}>{res.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Right Side Stats & Logout */}
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

        <button
          onClick={handleLogout}
          style={{
            background: "none", border: "1px solid var(--border)", color: "var(--text-muted)",
            fontSize: "9px", fontFamily: "var(--font-mono)", padding: "4px 10px",
            cursor: "pointer", borderRadius: "4px", textTransform: "uppercase", transition: "all 0.2s"
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