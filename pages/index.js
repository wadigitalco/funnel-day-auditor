import { useState } from "react";

const PAISES = [
  { codigo: "+57", nombre: "🇨🇴 Colombia" },
  { codigo: "+1", nombre: "🇺🇸 Estados Unidos" },
  { codigo: "+52", nombre: "🇲🇽 México" },
  { codigo: "+54", nombre: "🇦🇷 Argentina" },
  { codigo: "+56", nombre: "🇨🇱 Chile" },
  { codigo: "+51", nombre: "🇵🇪 Perú" },
  { codigo: "+58", nombre: "🇻🇪 Venezuela" },
  { codigo: "+593", nombre: "🇪🇨 Ecuador" },
  { codigo: "+502", nombre: "🇬🇹 Guatemala" },
  { codigo: "+503", nombre: "🇸🇻 El Salvador" },
  { codigo: "+504", nombre: "🇭🇳 Honduras" },
  { codigo: "+505", nombre: "🇳🇮 Nicaragua" },
  { codigo: "+506", nombre: "🇨🇷 Costa Rica" },
  { codigo: "+507", nombre: "🇵🇦 Panamá" },
  { codigo: "+53", nombre: "🇨🇺 Cuba" },
  { codigo: "+1-809", nombre: "🇩🇴 Rep. Dominicana" },
  { codigo: "+595", nombre: "🇵🇾 Paraguay" },
  { codigo: "+598", nombre: "🇺🇾 Uruguay" },
  { codigo: "+591", nombre: "🇧🇴 Bolivia" },
  { codigo: "+34", nombre: "🇪🇸 España" },
  { codigo: "+55", nombre: "🇧🇷 Brasil" },
];

export default function Home() {
  const [step, setStep] = useState(1);
  const [lead, setLead] = useState({ nombre: "", email: "", whatsapp: "" });
  const [codigoPais, setCodigoPais] = useState("+57");
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
        body: JSON.stringify({
          nombre: lead.nombre,
          email: lead.email,
          whatsapp: `${codigoPais} ${lead.whatsapp}`,
        }),
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

  const labelStyle = {
    display: "block",
    fontSize: "14px",
    color: "#aaa",
    marginBottom: "6px",
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

  const formularioListo = lead.nombre && lead.email && lead.whatsapp;

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f0f", color: "#fff", fontFamily: "Arial, sans-serif" }}>

      {/* Responsive styles */}
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

        .whatsapp-row {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }

        .select-pais {
          padding: 16px 10px;
          border-radius: 10px;
          border: 2px solid #333;
          background: #1a1a1a;
          color: #fff;
          font-size: 15px;
          outline: none;
          cursor: pointer;
          width: 140px;
          flex-shrink: 0;
        }

        .input-telefono {
          flex: 1;
          min-width: 0;
          padding: 16px 16px;
          border-radius: 10px;
          border: 2px solid #333;
          background: #1a1a1a;
          color: #fff;
          font-size: 16px;
          outline: none;
          width: 100%;
        }

        .btn-principal {
          width: 100%;
          padding: 18px;
          background: #FF0164;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 17px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 8px;
          opacity: 1;
          transition: opacity 0.2s;
        }

        .btn-principal:disabled {
          opacity: 0.45;
          cursor: not-allowed;
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
          .titulo {
            font-size: 32px;
          }
          .select-pais {
            width: 180px;
          }
          .url-row {
            flex-direction: row;
          }
          .btn-auditar {
            width: auto;
          }
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

        {/* ─── PASO 1: Formulario ─── */}
        {step === 1 && (
          <>
            <div style={{ fontSize: "13px", color: "#FF0164", fontWeight: "bold", letterSpacing: "2px", marginBottom: "12px" }}>
              ANTES DE EMPEZAR
            </div>
            <h1 className="titulo">
              ¿A quién le preparamos el diagnóstico?
            </h1>
            <p style={{ color: "#888", marginBottom: "40px", fontSize: "16px", lineHeight: "1.5" }}>
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
            <div className="whatsapp-row">
              <select
                value={codigoPais}
                onChange={(e) => setCodigoPais(e.target.value)}
                className="select-pais"
              >
                {PAISES.map((p) => (
                  <option key={p.codigo} value={p.codigo}>
                    {p.nombre} ({p.codigo})
                  </option>
                ))}
              </select>
              <input
                type="tel"
                placeholder="300 000 0000"
                value={lead.whatsapp}
                onChange={(e) => setLead({ ...lead, whatsapp: e.target.value })}
                className="input-telefono"
              />
            </div>

            <button
              onClick={handleLead}
              disabled={enviando || !formularioListo}
              className="btn-principal"
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
          </>
        )}

      </div>
    </div>
  );
}
