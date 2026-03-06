import { useEffect, useState, memo } from "react";
import { getDashboardConfig } from "@/services/apis/dashboard";

export const DashboardHeader = memo(function DashboardHeader() {
  const [features, setFeatures] = useState<{ name: string }[]>([]);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getDashboardConfig();
        
        // Log the successful JSON to the console
        console.log("%c >>> DASHBOARD CONFIG SUCCESS:", "color: #00ff00; font-weight: bold;", data);

        const featuresList = data?.dashboard?.features || data?.data?.features || data?.features || [];
        
        if (Array.isArray(featuresList) && featuresList.length > 0) {
          setFeatures(featuresList);
          setErrorStatus(null);
        } else {
          setErrorStatus(1); 
        }
      } catch (err: any) {
        console.error("DashboardHeader API error:", err);
        // If 412, it's a handshake/session issue
        setErrorStatus(err.response?.status || 500);
      }
    };
    fetchConfig();
  }, []);

  const getErrorMessage = () => {
    if (errorStatus === 412) return "SESSION AUTH REQUIRED (412)";
    if (errorStatus === 404) return "CONFIG NOT FOUND (404)";
    return "SYNCING ERROR";
  };

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "20px",
      padding: "0 24px", height: "30px", background: "var(--bg-panel)", 
      borderBottom: "1px solid var(--border)", overflowX: "auto",
      whiteSpace: "nowrap", flexShrink: 0,
    }}>
      <span style={{ 
        fontSize: "9px", fontWeight: "bold", color: "var(--text-muted)", 
        textTransform: "uppercase", letterSpacing: "1px", fontFamily: "var(--font-mono)"
      }}>
        MARKET INSIGHTS:
      </span>
      
      {features.length > 0 ? (
        features.map((feature, index) => (
          <div key={index} style={{
            fontSize: "10px", color: "var(--text-primary)",
            fontFamily: "var(--font-mono)", display: "flex",
            alignItems: "center", gap: "6px"
          }}>
            <span style={{ color: "var(--green)" }}>•</span>
            {feature.name}
          </div>
        ))
      ) : (
        <span style={{ fontSize: "9px", color: errorStatus ? "var(--red)" : "var(--green)" }}>
          {errorStatus ? getErrorMessage() : "INITIALIZING DATA..."}
        </span>
      )}
    </div>
  );
});