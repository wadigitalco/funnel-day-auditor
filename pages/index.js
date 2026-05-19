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

      <style>{`
        * { box-sizing: border-box; }
        .header {
          background: #1a1a1a;
          border-bottom: 3px solid #FF0164;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .contenido {
          max-width: 600px;
          margin: 0 auto;
          padding: 40px 20px 60px 20px;
        }
        .titulo {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 8px;
          line-height: 1.2;
        }
        .url-row {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 40px;
        }
        .btn-auditar {
          padding: 16px 32px;
          background: #FF0164;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          width: 100%;
        }
        .btn-auditar:disabled {
          background: #555;
          cursor: not-allowed;
        }
        @media (min-width: 480px) {
          .titulo { font-size: 32px; }
          .url-row { flex-direction: row; }
          .btn-auditar { width: auto; }
        }
      `}</style>

      {/* Header */}
      <div className="header">
        <img src="/logo.png" alt="WA Digital" style={{ height: "38px", width: "auto", objectFit: "contain" }} />
        <div>
          <div style={{ fontWeight: "bold", fontSize: "18px" }}>AuditAI</div>
          <div style={{ fontSize: "12px", color: "#888" }}>by WA Digital</div>
        </div>
      </div>

      <div className="contenido">
        <h1 className="titulo">
          Audita tu tienda en <span style={{ color: "#FF0164" }}>30 segundos</span>
        </h1>
        <p style={{ color: "#888", marginBottom: "40px", fontSize: "16px", lineHeight: "1.5" }}>
          Pegá la URL de tu tienda y te decimos exactamente qué está frenando tus ventas.
        </p>

        <div className="url-row">
          <input
            type="text"
            placeholder="https://tutienda.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ flex: 1, padding: "16px 20px", borderRadius: "10px", border: "2px solid #333", background: "#1a1a1a", color: "#fff", fontSize: "16px", outline: "none", width: "100%" }}
          />
          <button
            onClick={auditar}
            disabled={loading || !url}
            className="btn-auditar"
          >
            {loading ? "Analizando..." : "Auditar →"}
          </button>
        </div>

        {error && (
          <div style={{ background: "#2a1a1a", border: "1px solid #FF0164", borderRadius: "10px", padding: "20px", marginBottom: "30px", color: "#ff6b6b" }}>
            {error}
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#888" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>🔍</div>
            <div style={{ fontSize: "18px" }}>Analizando la tienda...</div>
            <div style={{ fontSize: "14px", marginTop: "8px" }}>Esto toma unos segundos</div>
          </div>
        )}

        {reporte && (
          <div style={{ background: "#1a1a1a", borderRadius: "16px", padding: "24px", border: "1px solid #333" }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", borderBottom: "2px solid #FF0164", paddingBottom: "12px", gap: "12px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>📊 Reporte de Auditoría</h2>
              <button
                onClick={() => { navigator.clipboard.writeText(reporte); alert("✅ Reporte copiado al portapapeles"); }}
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
