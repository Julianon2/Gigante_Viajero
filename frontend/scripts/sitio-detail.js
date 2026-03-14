/**
 * sitio-detail.js
 * Script compartido para todas las páginas de detalle de sitio turístico.
 * Lee sitios.json y rellena el HTML según el data-slug del <body>.
 *
 * Uso en cada HTML:
 *   <body data-slug="brisas-de-mirthayu">
 *   <script src="../scripts/sitio-detail.js"></script>
 */

(async function () {
    // ── 1. Obtener slug desde el body ──────────────────────────────────────
    const slug = document.body.dataset.slug;
    if (!slug) {
        console.warn('[sitio-detail] No se encontró data-slug en el body.');
        return;
    }

    // ── 2. Cargar sitios.json ──────────────────────────────────────────────
    let sitio;
    try {
        const res = await fetch('../data/sitios.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const sitios = await res.json();
        sitio = sitios.find(s => s.slug === slug);
        if (!sitio) throw new Error(`Sitio "${slug}" no encontrado en sitios.json`);
    } catch (err) {
        console.error('[sitio-detail] Error cargando datos:', err);
        return;
    }

    // ── 3. Helpers ─────────────────────────────────────────────────────────
    const $ = id => document.getElementById(id);
    const set = (id, html) => { const el = $(id); if (el) el.innerHTML = html; };
    const setText = (id, text) => { const el = $(id); if (el) el.textContent = text; };
    const fmt = n => n === 0 ? 'Gratis' : '$' + n.toLocaleString('es-CO');

    // ── 4. Campos simples ──────────────────────────────────────────────────
    document.title = `${sitio.nombre} - Gigante Viajero`;

    set('sitio-hero-title', sitio.nombre);
    const heroBg = document.getElementById('sitio-hero-bg');
    if (heroBg) heroBg.src = sitio.imagen;

    setText('sitio-nombre', sitio.nombre);
    setText('sitio-descripcion', sitio.descripcion);

    set('sitio-categorias', sitio.categorias
        .map(c => `<span class="badge-cat">${c}</span>`).join(''));

    // ── 5. Datos rápidos ───────────────────────────────────────────────────
    const datosEl = $('sitio-datos-grid');
    if (datosEl) {
        const entrada = sitio.entrada.precio === 0 ? 'Gratis' : fmt(sitio.entrada.precio);
        datosEl.innerHTML = `
            <div class="dato-card">
                <div class="dato-icon">📍</div>
                <div class="dato-label">Ubicación</div>
                <div class="dato-value">${sitio.ubicacion.referencia}</div>
            </div>
            <div class="dato-card">
                <div class="dato-icon">🚗</div>
                <div class="dato-label">De Gigante</div>
                <div class="dato-value">${sitio.ubicacion.tiempoAuto}</div>
            </div>
            <div class="dato-card">
                <div class="dato-icon">💵</div>
                <div class="dato-label">Entrada</div>
                <div class="dato-value">${entrada}</div>
            </div>
            <div class="dato-card">
                <div class="dato-icon">⏰</div>
                <div class="dato-label">Horario</div>
                <div class="dato-value">${sitio.horario}</div>
            </div>
            ${sitio.petFriendly ? `
            <div class="dato-card">
                <div class="dato-icon">🐕</div>
                <div class="dato-label">Mascotas</div>
                <div class="dato-value">Pet Friendly</div>
            </div>` : ''}
            ${sitio.entrada.notas ? `
            <div class="dato-card">
                <div class="dato-icon">📝</div>
                <div class="dato-label">Notas</div>
                <div class="dato-value" style="font-size:1rem">${sitio.entrada.notas}</div>
            </div>` : ''}
        `;
    }

    // ── 6. Historia / leyenda ──────────────────────────────────────────────
    if (sitio.historia) {
        const histEl = $('sitio-historia');
        if (histEl) {
            histEl.closest('.historia-section')?.style.removeProperty('display');
            histEl.textContent = sitio.historia;
        }
    }

    // ── 7. Elementos (solo Xhimanut) ──────────────────────────────────────
    const elementosGrid = $('sitio-elementos-grid');
    if (elementosGrid && sitio.elementos?.length) {
        elementosGrid.closest('.elementos-section')?.style.removeProperty('display');
        elementosGrid.innerHTML = sitio.elementos.map(e => `
            <div class="elemento-card">
                <div class="elemento-icon">${e.icono}</div>
                <h3>${e.nombre}</h3>
                <p>${e.descripcion}</p>
            </div>
        `).join('');
    }

    // ── 8. Atracciones ────────────────────────────────────────────────────
    const atrGrid = $('sitio-atracciones-grid');
    if (atrGrid && sitio.atracciones?.length) {
        atrGrid.innerHTML = sitio.atracciones.map(a => `
            <div class="atraccion-card">
                <div class="atraccion-icon">${a.icono}</div>
                <h3>${a.nombre}</h3>
                <p>${a.descripcion}</p>
            </div>
        `).join('');
    }

    // ── 9. Servicios ──────────────────────────────────────────────────────
    const srvGrid = $('sitio-servicios-grid');
    if (srvGrid && sitio.servicios?.length) {
        srvGrid.innerHTML = sitio.servicios.map(s => `
            <div class="servicio-item">
                <i class="${s.icono}"></i>
                <span>${s.nombre}</span>
            </div>
        `).join('');
    }

    // ── 10. Alojamientos ──────────────────────────────────────────────────
    const aloSection = $('sitio-alojamientos-section');
    const aloGrid    = $('sitio-alojamientos-grid');

    if (aloGrid && sitio.alojamientos?.length) {
        if (aloSection) aloSection.style.removeProperty('display');
        aloGrid.innerHTML = sitio.alojamientos.map(a => {
            const preciosHtml = a.precios.map(p =>
                `<div class="alojamiento-precio">
                    <span class="precio-desc">${p.descripcion}</span>
                    <span class="precio-val">${fmt(p.precio)}</span>
                </div>`
            ).join('');
            const amenidadesHtml = a.amenidades?.length
                ? `<div class="alojamiento-amenidades">
                    ${a.amenidades.map(am => `<span class="amenidad-tag">${am}</span>`).join('')}
                   </div>` : '';
            const desayunoTag = a.incluyeDesayuno
                ? `<span class="desayuno-tag">✅ Desayuno incluido</span>` : '';

            return `
    <div class="alojamiento-card">
        <div class="alojamiento-header">
            <h3>${a.nombre}</h3>
            <span class="alojamiento-tipo">${a.tipo}</span>
        </div>
        <p class="alojamiento-desc">${a.descripcion}</p>
        ${desayunoTag}
        ${amenidadesHtml}
        <div class="alojamiento-precios">${preciosHtml}</div>
        <a href="https://wa.me/${sitio.whatsapp}?text=Hola,%20quiero%20reservar%20${encodeURIComponent(a.nombre)}%20en%20${encodeURIComponent(sitio.nombre)}"
           target="_blank" class="btn-reservar">
          Reservar por WhatsApp
        </a>
    </div>`;
        }).join('');
    } else if (aloSection) {
        aloSection.style.display = 'none';
    }

    // ── 11. CTA ───────────────────────────────────────────────────────────
    set('sitio-cta-title', `¿Listo para visitar ${sitio.nombre}?`);
    const ctaBtn = $('sitio-cta-btn');
    if (ctaBtn) ctaBtn.href = `reserva.html?sitio=${sitio.slug}`;

    // ── 12. Tags ──────────────────────────────────────────────────────────
    const tagsEl = $('sitio-tags');
    if (tagsEl && sitio.tags?.length) {
        tagsEl.innerHTML = sitio.tags.map(t => `<span class="tag">#${t}</span>`).join('');
    }

    // ── 13. Inyectar sección de reseñas en el <main> ──────────────────────
    const mainEl = document.querySelector('main');
    if (mainEl) {
        const reviewsSection = document.createElement('section');
        reviewsSection.className = 'reviews-section';
        reviewsSection.id        = 'reviews-section';
        reviewsSection.innerHTML =
            '<h2>⭐ Reseñas y Calificaciones</h2>' +
            '<div class="reviews-summary" id="reviews-summary">' +
              '<div class="summary-score">' +
                '<div class="big-number" id="rv-promedio">–</div>' +
                '<div class="summary-stars" id="rv-stars-display"></div>' +
                '<div class="total-label" id="rv-total">Sin reseñas aún</div>' +
              '</div>' +
              '<div class="summary-bars" id="rv-bars"></div>' +
            '</div>' +
            '<div id="review-form-container"></div>' +
            // ✅ FIX: contenedor vacío, reviews.js lo rellena
            '<div id="reviews-list-container"></div>';

        if (tagsEl) {
            mainEl.insertBefore(reviewsSection, tagsEl);
        } else {
            mainEl.appendChild(reviewsSection);
        }
    }

    // ── 14. ¡CRÍTICO! Avisar a reviews.js que el DOM ya está listo ─────────
    window.dispatchEvent(new CustomEvent('sitioDetailReady', { detail: { slug } }));

})();