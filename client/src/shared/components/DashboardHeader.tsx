import { useEffect, useState, memo } from "react";
import { getDashboardConfig } from "@/services/apis/dashboard";
import { useUIStore } from "@/store";

export const DashboardHeader = memo(function DashboardHeader() {
  const [features, setFeatures] = useState<{ name: string }[]>([]);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  
  // Get setActiveTab from your store
  const setActiveTab = useUIStore((s) => s.setActiveTab);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getDashboardConfig();
        console.log("Dashboard Config:", data);
        const featuresList = data?.dashboard?.features || data?.data?.features || data?.features || [];
        
        if (Array.isArray(featuresList) && featuresList.length > 0) {
          setFeatures(featuresList);
          setErrorStatus(null);
        } else {
          setErrorStatus(1); 
        }
      } catch (err: any) {
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
        features.map((feature, index) => {
          const nameLower = feature.name.toLowerCase();
          const isUpperWatchlist = nameLower.includes("watchlist");
          const isIndices = nameLower.includes("indices"); // Added Indices check
          
          const isClickable = isUpperWatchlist || isIndices;

          const handleTabClick = () => {
            if (isUpperWatchlist) setActiveTab("watchlist2");
            if (isIndices) setActiveTab("indices"); // Route to IndicesManager
          };

          return (
            <div 
              key={index} 
              onClick={handleTabClick}
              style={{
                fontSize: "10px", color: "var(--text-primary)",
                fontFamily: "var(--font-mono)", display: "flex",
                alignItems: "center", gap: "6px",
                cursor: isClickable ? "pointer" : "default",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => isClickable && (e.currentTarget.style.color = "var(--green)")}
              onMouseLeave={(e) => isClickable && (e.currentTarget.style.color = "var(--text-primary)")}
            >
              <span style={{ color: "var(--green)" }}>•</span>
              {feature.name}
            </div>
          );
        })
      ) : (
        <span style={{ fontSize: "9px", color: errorStatus ? "var(--red)" : "var(--green)" }}>
          {errorStatus ? getErrorMessage() : "INITIALIZING DATA..."}
        </span>
      )}
    </div>
  );
});