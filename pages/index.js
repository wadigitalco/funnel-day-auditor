import { useState } from "react";

function parseReporte(texto) {
  const secciones = [];
  const lineas = texto.split("\n");
  let seccionActual = null;
  let contenidoActual = [];

  const flush = () => {
    if (seccionActual) {
      secciones.push({ ...seccionActual, contenido: contenidoActual.join("\n").trim() });
      contenidoActual = [];
      seccionActual = null;
    }
  };

  for (const linea of lineas) {
    if (linea.startsWith("## ")) {
      flush();
      const titulo = linea.replace(/^## /, "").replace(/\*\*/g, "").trim();
      seccionActual = { titulo };
    } else if (linea.startsWith("# ")) {
      flush();
      seccionActual = { titulo: linea.replace(/^# /, "").replace(/\*\*/g, "").trim(), esHeader: true };
    } else {
      contenidoActual.push(linea);
    }
  }
  flush();
  return secciones;
}

function renderLinea(linea, idx) {
  const esBullet = linea.startsWith("- ") || linea.startsWith("→ ");
  const texto = linea.replace(/^[-→] /, "");

  const renderBold = (t) => {
    const partes = t.split(/\*\*(.*?)\*\*/g);
    return partes.map((p, i) =>
      i % 2 === 1 ? <strong key={i} style={{ color: "#fff" }}>{p}</strong> : p
    );
  };

  if (esBullet) {
    return (
      <div key={idx} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "flex-start" }}>
        <span style={{ color: "#FF0164", fontSize: "16px", marginTop: "2px", flexShrink: 0 }}>→</span>
        <span style={{ color: "#ccc", lineHeight: "1.6", fontSize: "15px" }}>{renderBold(texto)}</span>
      </div>
    );
  }

  if (!linea.trim()) return null;

  return (
    <p key={idx} style={{ color: "#ccc", lineHeight: "1.7", fontSize: "15px", marginBottom: "8px" }}>
      {renderBold(linea)}
    </p>
  );
}

function SeccionCard({ seccion, numero }) {
  if (seccion.esHeader) return null;

  const tituloLimpio = seccion.titulo.replace(/^\d+\.\s*[^\s]+\s*—\s*/, "").replace(/Calificación:.*$/, "").trim();
  const etiqueta = seccion.titulo.match(/^(\d+)\.\s*([^\s—]+)/)?.[2] || null;
  const calificacion = seccion.titulo.match(/Calificación:\s*(\d+\/\d+)/)?.[1] || null;

  const lineas = seccion.contenido.split("\n").filter(l => l.trim());

  return (
    <div style={{
      background: "#111",
      border: "1px solid #222",
      borderRadius: "14px",
      marginBottom: "20px",
      overflow: "hidden",
    }}>
      {/* Header de la tarjeta */}
      <div style={{
        padding: "18px 24px",
        borderBottom: "1px solid #222",
        display: "flex",
        alignItems: "center",
        gap: "14px",
      }}>
        <div style={{
          width: "34px", height: "34px",
          background: "#FF0164",
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: "bold", fontSize: "15px", color: "#fff",
          flexShrink: 0,
        }}>
          {numero}
        </div>
        <div>
          {etiqueta && (
            <div style={{ fontSize: "11px", color: "#FF0164", fontWeight: "bold", letterSpacing: "1.5px", marginBottom: "3px" }}>
              {etiqueta.toUpperCase()}
            </div>
          )}
          <div style={{ fontWeight: "bold", fontSize: "16px", color: "#fff", lineHeight: "1.2" }}>
            {tituloLimpio}
          </div>
        </div>
        {calificacion && (
          <div style={{
            marginLeft: "auto",
            background: "#1a1a1a",
            border: "1px solid #333",
            borderRadius: "8px",
            padding: "6px 12px",
            fontSize: "13px",
            color: "#FF0164",
            fontWeight: "bold",
            flexShrink: 0,
          }}>
            {calificacion}
          </div>
        )}
      </div>
      {/* Contenido */}
      <div style={{ padding: "20px 24px" }}>
        {lineas.map((l, i) => renderLinea(l, i))}
      </div>
    </div>
  );
}

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

  const secciones = reporte ? parseReporte(reporte) : [];

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
          max-width: 680px;
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
          Pega la URL de un producto de tu tienda y te decimos exactamente qué está frenando tus ventas.
        </p>

        <div className="url-row">
          <input
            type="text"
            placeholder="https://tutienda.com/products/nombre-producto"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ flex: 1, padding: "16px 20px", borderRadius: "10px", border: "2px solid #333", background: "#1a1a1a", color: "#fff", fontSize: "16px", outline: "none", width: "100%" }}
          />
          <button onClick={auditar} disabled={loading || !url} className="btn-auditar">
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
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>📊 Reporte de Auditoría</h2>
              <button
                onClick={() => { navigator.clipboard.writeText(reporte); alert("✅ Reporte copiado al portapapeles"); }}
                style={{ padding: "10px 20px", background: "#FF8C00", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "bold", cursor: "pointer" }}
              >
                📋 Copiar reporte
              </button>
            </div>
            {secciones.filter(s => !s.esHeader).map((s, i) => (
              <SeccionCard key={i} seccion={s} numero={i + 1} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
