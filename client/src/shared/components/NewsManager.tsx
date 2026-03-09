import { useEffect, useState } from "react";
import { getMarketNews, NewsItem } from "@/services/apis/news";

export  function NewsManager() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const data = await getMarketNews(10, 0);
        console.log("News:", data);
        setNews(data);
        setError(false);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "12px" }}>
        FETCHING LATEST MARKET INTELLIGENCE...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "var(--red)", fontFamily: "var(--font-mono)", fontSize: "12px" }}>
        FAILED TO RETRIEVE NEWS FEED. PLEASE CHECK CONNECTION.
      </div>
    );
  }

  return (
    <div style={{ 
      padding: "24px", 
      height: "100%", 
      overflowY: "auto", 
      background: "var(--bg-main)",
      display: "flex",
      flexDirection: "column",
      gap: "16px"
    }}>
      <div style={{ marginBottom: "8px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>Market News</h2>
        <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "4px 0 0 0", fontFamily: "var(--font-mono)" }}>
          {news.length} RECENT UPDATES
        </p>
      </div>

      {news.map((item, index) => (
        <a 
          key={index}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{ 
            textDecoration: "none",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "16px",
            background: "var(--bg-panel)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--blue)";
            e.currentTarget.style.transform = "translateX(4px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.transform = "translateX(0px)";
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ 
              fontSize: "14px", 
              fontWeight: "600", 
              color: "var(--text-primary)", 
              lineHeight: "1.4" 
            }}>
              {item.title}
            </span>
            <span style={{ 
              fontSize: "9px", 
              color: "var(--blue)", 
              fontFamily: "var(--font-mono)",
              background: "rgba(0, 122, 255, 0.1)",
              padding: "2px 6px",
              borderRadius: "2px",
              whiteSpace: "nowrap"
            }}>
              {item.source.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          <p style={{ 
            fontSize: "12px", 
            color: "var(--text-muted)", 
            margin: 0, 
            lineHeight: "1.5",
            display: "-webkit-box",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}>
            {item.contentSnippet}
          </p>

          <div style={{ 
            fontSize: "10px", 
            color: "var(--text-muted)", 
            fontFamily: "var(--font-mono)",
            marginTop: "4px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span style={{ color: "var(--green)" }}>[ {item.publishedDate} ]</span>
            <span>•</span>
            <span style={{ color: "var(--text-muted)" }}>READ FULL ARTICLE →</span>
          </div>
        </a>
      ))}
    </div>
  );
}