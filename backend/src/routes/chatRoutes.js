// routes/chatRoutes.js - TuriBot - Gigante Viajero v2.2
// ✅ Datos de sitios turísticos integrados desde sitios.json

const express = require("express");
const router  = express.Router();
const OpenAI  = require("openai");
const path    = require("path");
const fs      = require("fs");

if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY no esta definida.");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

// ─────────────────────────────────────────────────────────
//  CARGA DEL JSON DE SITIOS TURÍSTICOS
//  Ajusta la ruta según donde tengas el archivo en tu proyecto
// ─────────────────────────────────────────────────────────
let SITIOS_JSON = [];
try {
    const jsonPath = path.join(__dirname, "../../frontend/data/sitios.json"); // ← ajusta si tu archivo está en otra carpeta
    SITIOS_JSON = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    console.log(`TuriBot: ${SITIOS_JSON.length} sitios turísticos cargados desde sitios.json`);
} catch (err) {
    console.warn("TuriBot: No se pudo cargar sitios.json, usando datos por defecto.", err.message);
}

// ─────────────────────────────────────────────────────────
//  CONVIERTE EL JSON EN TEXTO ESTRUCTURADO PARA EL PROMPT
// ─────────────────────────────────────────────────────────
function buildSitiosTexto(sitios) {
    if (!sitios || sitios.length === 0) {
        return `- Mano del Gigante (monumento iconico)
- Mirador Brisas de Mirthayu (vistas panoramicas)
- Xhimanut (ecoturismo y senderismo)
- La Morra, La Perla, La Casa del Arbol, Los Pinos
- Embalse del Quimbo (turismo acuatico)
- La Ceiba centenaria (patrimonio natural)
- Fincas cafeteras y cacaoteras`;
    }

    return sitios.map(s => {
        const lineas = [];

        // Nombre, resumen y categorías
        lineas.push(`\n📍 ${s.nombre.toUpperCase()}`);
        if (s.resumen)      lineas.push(`   Resumen: ${s.resumen}`);
        if (s.descripcion)  lineas.push(`   Descripcion: ${s.descripcion}`);
        if (s.categorias)   lineas.push(`   Tipo: ${s.categorias.join(", ")}`);

        // Ubicación
        if (s.ubicacion) {
            lineas.push(`   Ubicacion: ${s.ubicacion.referencia}`);
            if (s.ubicacion.tiempoAuto) lineas.push(`   Acceso: ${s.ubicacion.tiempoAuto}`);
        }

        // Entrada
        if (s.entrada) {
            const precioStr = s.entrada.precio === 0 ? "GRATIS" : `$${s.entrada.precio.toLocaleString("es-CO")} COP`;
            lineas.push(`   Entrada: ${precioStr}`);
            if (s.entrada.notas) lineas.push(`   Notas entrada: ${s.entrada.notas}`);
        }

        // Horario
        if (s.horario) lineas.push(`   Horario: ${s.horario}`);

        // Pet Friendly
        if (s.petFriendly !== undefined) lineas.push(`   Pet Friendly: ${s.petFriendly ? "Si" : "No"}`);

        // Atracciones principales (máx. 6 para no saturar el prompt)
        if (s.atracciones && s.atracciones.length > 0) {
            const top = s.atracciones.slice(0, 6);
            lineas.push(`   Atracciones: ${top.map(a => a.nombre).join(" | ")}`);
        }

        // Servicios
        if (s.servicios && s.servicios.length > 0) {
            lineas.push(`   Servicios: ${s.servicios.map(sv => sv.nombre).join(" | ")}`);
        }

        // Alojamientos con precios
        if (s.alojamientos && s.alojamientos.length > 0) {
            lineas.push(`   Alojamientos disponibles:`);
            s.alojamientos.forEach(a => {
                const preciosStr = a.precios.map(p => `${p.descripcion}: $${p.precio.toLocaleString("es-CO")} COP`).join(" / ");
                lineas.push(`     - ${a.nombre} (hasta ${a.capacidadMax} personas): ${preciosStr}${a.incluyeDesayuno ? " [Incluye desayuno]" : ""}`);
                if (a.amenidades) lineas.push(`       Amenidades: ${a.amenidades.join(", ")}`);
            });
        }

        // Tags
        if (s.tags && s.tags.length > 0) {
            lineas.push(`   Tags: ${s.tags.join(", ")}`);
        }

        // WhatsApp para reservas
        if (s.whatsapp) {
            lineas.push(`   Reservas WhatsApp: https://wa.me/${s.whatsapp}`);
        }

        return lineas.join("\n");
    }).join("\n\n");
}

// ─────────────────────────────────────────────────────────
//  TEXTO DE SERVICIOS TURÍSTICOS GENERALES
// ─────────────────────────────────────────────────────────
function buildServiciosTexto(servicios) {
    if (!servicios || servicios.length === 0) {
        return `- Restaurantes con cocina huilense: ~$15.000-$40.000 COP
- Transporte mototaxi local: ~$3.000-$8.000 COP
- Experiencias en finca (recorrido + catacion): ~$25.000-$60.000 COP`;
    }
    return servicios.map(s =>
        `- ${s.nombre} (${s.tipo}): ${s.descripcion}` +
        (s.precio_promedio ? ` | ~$${s.precio_promedio} COP` : "")
    ).join("\n");
}

// ─────────────────────────────────────────────────────────
//  OBTENER NOMBRE DEL USUARIO DESDE BD (opcional)
// ─────────────────────────────────────────────────────────
async function getNombreUsuario(userId) {
    if (!userId) return null;
    try {
        // -- Mongoose --
        // const Usuario = require("../models/User");
        // const user = await Usuario.findById(userId).select("firstName fullName");
        // return user?.firstName || user?.fullName?.split(" ")[0] || null;

        // -- MySQL2 --
        // const db = require("../config/database");
        // const [rows] = await db.query(
        //   "SELECT firstName, fullName FROM users WHERE id = ? AND isActive = 1", [userId]
        // );
        // return rows[0]?.firstName || rows[0]?.fullName?.split(" ")[0] || null;

        return null;
    } catch (err) {
        console.error("Error al obtener usuario de BD:", err.message);
        return null;
    }
}

async function getServiciosTuristicos() {
    try {
        return [];
    } catch (err) {
        return [];
    }
}

// ─────────────────────────────────────────────────────────
//  CONSTRUCCIÓN DEL SYSTEM PROMPT
// ─────────────────────────────────────────────────────────
function buildSystemPrompt(nombreUsuario, sitios, servicios) {
    const sitiosTexto    = buildSitiosTexto(sitios);
    const serviciosTexto = buildServiciosTexto(servicios);

    const saludoPersonalizado = nombreUsuario
        ? `El usuario se llama "${nombreUsuario}". Dirigete a el/ella por su nombre de forma calida al inicio o en momentos clave.`
        : `No conoces el nombre del usuario. Se igualmente amable.`;

    return `Eres TuriBot, el asistente oficial de turismo en Gigante, Huila, Colombia.
Eres un guia local apasionado, cercano y entusiasta.

PERSONALIZACION:
${saludoPersonalizado}

PERSONALIDAD:
- Usa emojis ocasionalmente
- Respuestas claras y motivadoras. Max. 5 parrafos.
- Para itinerarios usa formato estructurado dia por dia.
- NUNCA menciones que eres IA, chatbot o base de datos.
- Cuando menciones un sitio con WhatsApp disponible, incluye el enlace de reservas al final.

SITIOS TURISTICOS DISPONIBLES EN GIGANTE, HUILA:
(Usa ESTA informacion como fuente principal y definitiva)
${sitiosTexto}

SERVICIOS GENERALES Y PRECIOS:
${serviciosTexto}

Reglas:
1. Usa la informacion de sitios turisticos de arriba como base principal.
2. Precios son orientativos; menciona que pueden variar por temporada.
3. No inventes datos que no esten aqui. Si no tienes la info, dilo honestamente.
4. Para sitios con alojamiento, menciona los tipos de cabanas/glamping y precios reales.
5. Respeta los horarios de cada sitio cuando los menciones.

MODO ITINERARIO:
Cuando el usuario pida un plan usa esta estructura:

---
PLAN PERSONALIZADO
Duracion: X dia(s) | Presupuesto: ~$XXX.XXX COP | Tipo: [Tipo]

DIA 1 - [Titulo]
Manana: [actividad + lugar + costo aprox]
Tarde: [actividad + lugar + costo aprox]
Noche: [actividad/alojamiento + costo aprox]

RESUMEN ESTIMADO:
- Transporte: ~$XX.XXX | Comida: ~$XX.XXX
- Actividades: ~$XX.XXX | Alojamiento: ~$XX.XXX
- TOTAL: ~$XXX.XXX COP

CONSEJO: [tip personalizado]
---

Adapta segun tipo:
- ROMANTICO: La Morra (glamping jacuzzi), La Perla, Brisas de Mirthayu, atardeceres en La Loma de la Cruz.
- FAMILIAR: Xhimanut, Los Pinos (almuerzo incluido), La Mano del Gigante (deslizador), La Casa del Arbol.
- AVENTURA: La Mano del Gigante (columpio extremo + deslizador 210m), La Morra (alta montana), Xhimanut (paintball).
- ECONOMICO: La Loma de la Cruz (GRATIS), La Casa del Arbol ($8.000), Brisas de Mirthayu ($5.000), transporte local.
- ECOLOGICO: Los Pinos (eco hotel), La Casa del Arbol, La Morra, rutas de senderismo.

RESPONDE SOLO SOBRE:
turismo en Gigante Huila, ruta del cafe/cacao, fincas, experiencias,
gastronomia local, alojamiento rural, fiestas del cacao y cafe,
como llegar desde Neiva, clima, temporadas, costos en COP,
planes personalizados, itinerarios, sitios turisticos del municipio.

Para cualquier otro tema responde exactamente:
"Soy especialista en Gigante, Huila. Tienes alguna pregunta sobre nuestro turismo?"
`;
}

// ─────────────────────────────────────────────────────────
//  RUTA POST /api/chat
// ─────────────────────────────────────────────────────────
router.post("/", async (req, res) => {
    try {
        const {
            message,
            userId,
            nombreUsuario,
            presupuesto,
            dias,
            tipoViaje,
            conQuien,
            tieneTransporte,
            quiereRestaurantes
        } = req.body;

        if (!message?.trim()) {
            return res.status(400).json({ reply: "Por favor escribe un mensaje." });
        }

        if (!process.env.OPENAI_API_KEY) {
            return res.status(500).json({
                reply: "El servicio de chat no esta configurado.",
                error: "OPENAI_API_KEY no configurada"
            });
        }

        // Carga en paralelo: nombre del usuario (BD) + servicios generales
        // Los sitios ya están en memoria (SITIOS_JSON)
        const [nombreDeBD, servicios] = await Promise.all([
            getNombreUsuario(userId),
            getServiciosTuristicos()
        ]);

        const nombre = nombreDeBD || nombreUsuario || null;

        // ── Modo planificador ─────────────────────────────
        const tieneDatosPlanificador = presupuesto || dias || tipoViaje || conQuien;
        let mensajeFinal = message.trim();

        if (tieneDatosPlanificador) {
            const ctx = [];
            if (presupuesto)                ctx.push(`Presupuesto: $${parseInt(presupuesto).toLocaleString("es-CO")} COP`);
            if (dias)                       ctx.push(`Dias: ${dias}`);
            if (tipoViaje)                  ctx.push(`Tipo: ${tipoViaje}`);
            if (conQuien)                   ctx.push(`Viaja: ${conQuien}`);
            if (tieneTransporte != null)    ctx.push(`Transporte propio: ${tieneTransporte ? "Si" : "No"}`);
            if (quiereRestaurantes != null) ctx.push(`Restaurantes: ${quiereRestaurantes ? "Si" : "Prefiere local"}`);

            mensajeFinal = `El usuario pide un plan turistico personalizado:\n${ctx.join("\n")}\nMensaje: "${message.trim()}"\nGenera el itinerario completo con el formato indicado usando los sitios turisticos reales disponibles.`;
        }

        // ── Llamada a OpenAI ──────────────────────────────
        const completion = await openai.chat.completions.create({
            model:       "gpt-4o-mini",
            temperature: 0.75,
            max_tokens:  1100,  // Aumentado un poco por el mayor contexto de sitios
            messages: [
                { role: "system", content: buildSystemPrompt(nombre, SITIOS_JSON, servicios) },
                { role: "user",   content: mensajeFinal }
            ],
        });

        const reply = completion.choices[0]?.message?.content || "No pude generar una respuesta.";

        res.json({
            reply,
            usuario:        nombre || null,
            sitiosCount:    SITIOS_JSON.length,
            modoItinerario: !!tieneDatosPlanificador
        });

    } catch (error) {
        console.error("TuriBot error:", error.message);

        if (error.status === 401 || error.code === "invalid_api_key") {
            return res.status(500).json({ reply: "Error de configuracion. Contacta al administrador.", error: "API key invalida" });
        }
        if (error.status === 429) {
            return res.status(500).json({ reply: "Servicio saturado. Intenta en unos minutos.", error: "Quota excedida" });
        }
        if (error.status === 404) {
            return res.status(500).json({ reply: "Error de configuracion. Contacta al administrador.", error: "Modelo no disponible" });
        }

        res.status(500).json({ reply: "Error inesperado. Intenta de nuevo.", error: error.message });
    }
});

module.exports = router;