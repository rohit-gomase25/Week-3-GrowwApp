import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL, getAuthHeaders } from "@/services/apis/config";

export const WatchlistManager = () => {
  const [view, setView] = useState<"GRID" | "SCRIPS">("GRID");
  const [watchlists, setWatchlists] = useState<any[]>([]);
  const [selectedScrips, setSelectedScrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWatchlists();
  }, []);

  const fetchWatchlists = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("bearer_token");
      const res = await axios.get(`${BASE_URL}/v1/api/watchlist/list`, {
        headers: getAuthHeaders(token || ""),
      });
      setWatchlists([...res.data.userDefinedWatchlists, ...res.data.predefinedWatchlists]);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCardClick = async (id: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("bearer_token");
      const res = await axios.post(`${BASE_URL}/v1/api/watchlist/scrips/list`, 
        { watchlistId: id }, 
        { headers: getAuthHeaders(token || "") }
      );
      setSelectedScrips(res.data.scrips);
      setView("SCRIPS");
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) return <div style={msgStyle}>[ SYNCING MARKET DATA... ]</div>;

  return (
    <div style={{ padding: "24px", overflowY: "auto", height: "100%" }}>
      {view === "GRID" ? (
        <div style={gridStyle}>
          {watchlists.map((wl) => (
            <div key={wl.watchlistId} style={cardStyle} onClick={() => handleCardClick(wl.watchlistId)}>
              <div style={{ color: "var(--green)", fontSize: "10px" }}>#{wl.watchlistId}</div>
              <div style={{ fontSize: "16px", fontWeight: "bold", margin: "10px 0" }}>{wl.watchlistName}</div>
              <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>VIEW DETAILS →</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
  <button onClick={() => setView("GRID")} style={btnStyle}>← BACK TO LIST</button>
  
  <div style={tableContainer}>
    {selectedScrips.length > 0 ? (
      selectedScrips.map((s) => (
        <div key={s.scripToken} style={rowStyle}>
          <div>
            <div style={{ fontWeight: "bold" }}>{s.symbolName}</div>
            <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>
              {s.exchange} | {s.exchangeSegment}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "var(--green)", fontWeight: "bold" }}>₹{s.lastTradedPrice}</div>
            <div style={{ fontSize: "10px", color: s.netChange < 0 ? "var(--red)" : "var(--green)" }}>
              {s.netChange > 0 ? "+" : ""}{s.netChange}
            </div>
          </div>
        </div>
      ))
    ) : (
      /* Fallback UI while the redirect initiates */
      <div style={{ padding: "40px", textAlign: "center", fontFamily: "var(--font-mono)", color: "var(--red)" }}>
        [ DATA MISSING: REDIRECTING... ]
      </div>
    )}
  </div>
</div>
      )}
    </div>
  );
};

// --- STYLING ---
const gridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" };
const cardStyle: React.CSSProperties = { background: "var(--bg-panel)", border: "1px solid var(--border)", padding: "24px", borderRadius: "8px", cursor: "pointer", fontFamily: "var(--font-mono)" };
const rowStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", padding: "16px", borderBottom: "1px solid var(--border)", fontFamily: "var(--font-mono)" };
const btnStyle: React.CSSProperties = { background: "none", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "4px 12px", borderRadius: "4px", marginBottom: "20px", cursor: "pointer", fontSize: "10px" };
const tableContainer: React.CSSProperties = { background: "var(--bg-panel)", border: "1px solid var(--border)", borderRadius: "8px" };
const msgStyle: React.CSSProperties = { textAlign: "center", marginTop: "100px", color: "var(--green)", fontFamily: "var(--font-mono)" };