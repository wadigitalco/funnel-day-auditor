import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [reporte, setReporte] = useState(null);
  const [error, setError] = useState(null);

  const auditar = async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    setReporte(null);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setReporte(data.reporte);
    } catch (err) {
      setError("Hubo un error al auditar la tienda. Verifica la URL e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f0f", color: "#fff", fontFamily: "Arial, sans-serif" }}>
      
      {/* Header */}
      <div style={{ background: "#1a1a1a", borderBottom: "3px solid #FF0164", padding: "20px 40px", display: "flex", alignItems: "center", gap: "16px" }}>
    <img src="/logo.png" alt="WA Digital" style={{ height: "40px", width: "auto", objectFit: "contain" }} />
        <div>
          <div style={{ fontWeight: "bold", fontSize: "18px" }}>Auditor de Tienda</div>
          <div style={{ fontSize: "12px", color: "#888" }}>Funnel Day by WA Digital</div>
        </div>
      </div>

      {/* Main */}
      <div style={{ maxWidth: "800px", margin: "60px auto", padding: "0 20px" }}>
        
        <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "8px" }}>
          Audita tu tienda en <span style={{ color: "#FF0164" }}>30 segundos</span>
        </h1>
        <p style={{ color: "#888", marginBottom: "40px", fontSize: "16px" }}>
          Pegá la URL de tu tienda y te decimos exactamente qué está frenando tus ventas.
        </p>

        {/* Input */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "40px" }}>
          <input
            type="text"
            placeholder="https://tutienda.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ flex: 1, padding: "16px 20px", borderRadius: "10px", border: "2px solid #333", background: "#1a1a1a", color: "#fff", fontSize: "16px", outline: "none" }}
          />
          <button
            onClick={auditar}
            disabled={loading}
            style={{ padding: "16px 32px", background: loading ? "#555" : "#FF0164", color: "#fff", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Analizando..." : "Auditar"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "#2a1a1a", border: "1px solid #FF0164", borderRadius: "10px", padding: "20px", marginBottom: "30px", color: "#ff6b6b" }}>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#888" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>🔍</div>
            <div style={{ fontSize: "18px" }}>Analizando la tienda...</div>
            <div style={{ fontSize: "14px", marginTop: "8px" }}>Esto toma unos segundos</div>
          </div>
        )}

        {/* Reporte */}
       {reporte && (
  <div style={{ background: "#1a1a1a", borderRadius: "16px", padding: "32px", border: "1px solid #333" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", borderBottom: "2px solid #FF0164", paddingBottom: "12px" }}>
      <h2 style={{ fontSize: "22px", fontWeight: "bold", margin: 0 }}>
        📊 Reporte de Auditoría
      </h2>
      <button
        onClick={() => {
          navigator.clipboard.writeText(reporte);
          alert("✅ Reporte copiado al portapapeles");
        }}
        style={{ padding: "10px 20px", background: "#FF8C00", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "bold", cursor: "pointer" }}
      >
        📋 Copiar reporte
      </button>
    </div>
            <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.8", fontSize: "15px", color: "#ddd" }}>
              {reporte}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}