import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL requerida" });

  try {
    // Obtener el HTML de la tienda
    const response = await axios.get(url, {
      timeout: 10000,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; WA-Auditor/1.0)" },
    });

    const $ = cheerio.load(response.data);
    const html = response.data.toLowerCase();

    // Extraer información de la tienda
    const titulo = $("title").text() || "";
    const metaDesc = $('meta[name="description"]').attr("content") || "";
$("script, style, noscript, header, footer, nav, .header, .footer, .navigation, .announcement-bar").remove();
const textoVisible = $("body").text().replace(/\s+/g, " ").substring(0, 10000);

    const contexto = `
Título de la página: ${titulo}
Meta descripción: ${metaDesc}
Texto visible de la tienda: ${textoVisible}
    `;

    // Llamar a Claude API
    const claudeRes = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: `Eres un experto en conversión de tiendas ecommerce. Analiza esta tienda y genera un reporte de auditoría detallado en español.

${contexto}

Evalúa estos 7 elementos y da una calificación de 0 a 10 a cada uno, junto con observaciones específicas y recomendaciones concretas:

1. 🚨 ESCASEZ — ¿Muestra stock limitado, unidades disponibles, o mensajes de "quedan pocas unidades"?
2. ⏰ URGENCIA — ¿Tiene contador regresivo, ofertas por tiempo limitado, o fechas de expiración?
3. ⭐ PRUEBA SOCIAL — ¿Tiene reseñas, calificaciones, número de compradores, o testimonios?
4. 🏆 AUTORIDAD — ¿Muestra certificaciones, menciones en medios, años de experiencia, o premios?
5. 🔒 SEGURIDAD — ¿Tiene SSL visible, métodos de pago claros, políticas de devolución, o garantías?
6. 💎 CREDIBILIDAD — ¿Tiene página "sobre nosotros", fotos reales del equipo, historia de marca?
7. 🛒 ESTRUCTURA DE PRODUCTO — ¿Las descripciones son claras, las imágenes son de calidad, el CTA es visible?

Formato del reporte:
- Para cada elemento: calificación, qué encontraste, qué falta, y qué hacer primero
- Al final: TOP 3 acciones prioritarias para aumentar conversiones esta semana
- Sé específico, directo y accionable. No uses lenguaje genérico.`,
          },
        ],
      },
      {
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
      }
    );

    const reporte = claudeRes.data.content[0].text;
    res.status(200).json({ reporte });

  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.status(500).json({ error: "Error al analizar la tienda. Intenta con otra URL." });
  }
}