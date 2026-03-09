import { useState, useEffect } from "react";
import { fetchIndicesApi, IndexDetail } from "@/services/apis/indices";

export const IndicesManager = () => {
  const [indices, setIndices] = useState<IndexDetail[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchIndicesApi("BSE");
        console.log("DEBUG: Indices State being set:", data);
        
        
        
        // REDIRECT LOGIC: If content is missing, redirect to localhost:5173
        if (!data || data.length === 0) {
          alert("Indices data is empty. Redirecting...");
          window.location.href = "http://localhost:5173";
          return;
        }
        
        setIndices(data);
      } catch (err) {
        console.error("Failed to fetch indices:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div style={msgStyle}>[ SYNCING GLOBAL INDICES... ]</div>;

  return (
    <div style={{ padding: "24px", overflowY: "auto", height: "100%", width: "100%" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ marginBottom: "20px", fontFamily: "var(--font-mono)" }}>
          <span style={{ color: "var(--green)" }}></span> MARKET_INDICES_BSE
        </div>
        
        <div style={tableContainer}>
          {indices.map((item, idx) => (
            <div key={idx} style={rowStyle}>
              <div>
                <div style={{ fontWeight: "bold", fontSize: "14px" }}>{item.indexName}</div>
                <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                  {item.exchange} | {item.exchangeSegment}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "var(--green)", fontWeight: "bold" }}>{item.indexToken}</div>
                <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                  PRECISION: {item.decimalPrecision}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Styling
const tableContainer: React.CSSProperties = { background: "var(--bg-panel)", border: "1px solid var(--border)", borderRadius: "8px" };
const rowStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", padding: "16px", borderBottom: "1px solid var(--border)", fontFamily: "var(--font-mono)" };
const msgStyle: React.CSSProperties = { textAlign: "center", marginTop: "100px", color: "var(--green)", fontFamily: "var(--font-mono)" };