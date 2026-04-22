import { useState } from "react";

export default function Home() {
  const [step, setStep] = useState(1);
  const [lead, setLead] = useState({ nombre: "", email: "", whatsapp: "" });
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [reporte, setReporte] = useState(null);
  const [error, setError] = useState(null);

  const MAKE_WEBHOOK = "https://hook.us2.make.com/n86yp08kem6q5dpdrovne5bnw8onee29";

  const handleLead = async () => {
    if (!lead.nombre || !lead.email || !lead.whatsapp) return;
    setEnviando(true);
    try {
      await fetch(MAKE_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: lead.nombre, email: lead.email, whatsapp: lead.whatsapp }),
      });
    } catch (e) {
      console.log("Webhook error:", e);
    } finally {
      setEnviando(false);
      setStep(2);
    }
  };

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

  const inputStyle = {
    width: "100%",
    padding: "16px 20px",
    borderRadius: "10px",
    border: "2px solid #333",
    background: "#1a1a1a",
    color: "#fff",
    fontSize: "16px",
    outline: "none",
    boxSizing: "border-box",
    marginBottom: "16px",
  };

  const labelStyle = {
    display: "block",
    fontSize: "14px",
    color: "#aaa",
    marginBottom: "6px",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f0f", color: "#fff", fontFamily: "Arial, sans-serif" }}>

      {/* Header */}
      <div style={{ background: "#1a1a1a", borderBottom: "3px solid #FF0164", padding: "20px 40px", display: "flex", alignItems: "center", gap: "16px" }}>
        <img src="/logo.png" alt="WA Digital" style={{ height: "40px", width: "auto", objectFit: "contain" }} />
        <div>
          <div style={{ fontWeight: "bold", fontSize: "18px" }}>AuditAI</div>
          <div style={{ fontSize: "12px", color: "#888" }}>by WA Digital</div>
        </div>
      </div>

      <div style={{ maxWidth: "600px", margin: "60px auto", padding: "0 20px" }}>

        {/* ─── PASO 1: Formulario de datos ─── */}
        {step === 1 && (
          <>
            <div style={{ fontSize: "13px", color: "#FF0164", fontWeight: "bold", letterSpacing: "2px", marginBottom: "12px" }}>
              ANTES DE EMPEZAR
            </div>
            <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "8px" }}>
              ¿A quién le preparamos el diagnóstico?
            </h1>
            <p style={{ color: "#888", marginBottom: "40px", fontSize: "16px" }}>
              Déjanos tus datos y en 2 minutos tienes tu análisis completo personalizado.
            </p>

            <label style={labelStyle}>Nombre completo *</label>
            <input
              type="text"
              placeholder="Tu nombre completo"
              value={lead.nombre}
              onChange={(e) => setLead({ ...lead, nombre: e.target.value })}
              style={inputStyle}
            />

            <label style={labelStyle}>Email *</label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={lead.email}
              onChange={(e) => setLead({ ...lead, email: e.target.value })}
              style={inputStyle}
            />

            <label style={labelStyle}>WhatsApp *</label>
            <input
              type="text"
              placeholder="+57 300 000 0000"
              value={lead.whatsapp}
              onChange={(e) => setLead({ ...lead, whatsapp: e.target.value })}
              style={inputStyle}
            />

            <button
              onClick={handleLead}
              disabled={enviando || !lead.nombre || !lead.email || !lead.whatsapp}
              style={{
                width: "100%",
                padding: "18px",
                background: (enviando || !lead.nombre || !lead.email || !lead.whatsapp) ? "#555" : "#FF0164",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontSize: "17px",
                fontWeight: "bold",
                cursor: "pointer",
                marginTop: "8px",
              }}
            >
              {enviando ? "Guardando..." : "Empezar mi diagnóstico →"}
            </button>

            <p style={{ textAlign: "center", color: "#555", fontSize: "13px", marginTop: "16px" }}>
              Tu información es confidencial. No hacemos spam.
            </p>
          </>
        )}

        {/* ─── PASO 2: Auditoría ─── */}
        {step === 2 && (
          <>
            <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "8px" }}>
              Audita tu tienda en <span style={{ color: "#FF0164" }}>30 segundos</span>
            </h1>
            <p style={{ color: "#888", marginBottom: "40px", fontSize: "16px" }}>
              Pegá la URL de tu tienda y te decimos exactamente qué está frenando tus ventas.
            </p>

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
              <div style={{ background: "#1a1a1a", borderRadius: "16px", padding: "32px", border: "1px solid #333" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", borderBottom: "2px solid #FF0164", paddingBottom: "12px" }}>
                  <h2 style={{ fontSize: "22px", fontWeight: "bold", margin: 0 }}>📊 Reporte de Auditoría</h2>
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
          </>
        )}

      </div>
    </div>
  );
}
