// =============================================
// controllers/Sitiocontroller.js  –  Gigante Viajero
// =============================================

const Sitio = require('../models/Sitio');

// ── GET /api/sitios ───────────────────────────
const getSitios = async (req, res) => {
    try {
        const sitios = await Sitio.find({ activo: true })
            .select('-__v')
            .sort({ nombre: 1 });
        res.json({ ok: true, total: sitios.length, data: sitios });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
};

// ── GET /api/sitios/categoria/:tipo ───────────
const getSitiosByCategoria = async (req, res) => {
    const tiposValidos = ['parque', 'mirador', 'glamping', 'hospedaje'];
    const tipo = req.params.tipo.toLowerCase();
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            message: `Tipo inválido. Usa: ${tiposValidos.join(', ')}`
        });
    }
    try {
        const sitios = await Sitio.find({ activo: true, categorias: tipo })
            .select('nombre slug descripcion ubicacion entrada precioBaseReserva imagen categorias')
            .sort({ nombre: 1 });

        const data = sitios.map(s => ({
            id:          s.slug,
            name:        s.nombre,
            location:    s.ubicacion?.referencia
                         || `${s.ubicacion?.municipio}, ${s.ubicacion?.departamento}`,
            price:       s.precioBaseReserva ?? s.entrada?.precio ?? 0,
            image:       s.imagen,
            description: s.descripcion
        }));
        res.json({ ok: true, total: data.length, data });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
};

// ── GET /api/sitios/mapa/lugares ─────────────
const getSitiosMapa = async (req, res) => {
    try {
        const filtro = {
            activo: true,
            'ubicacion.coordenadas.lat': { $exists: true },
            'ubicacion.coordenadas.lng': { $exists: true }
        };
        if (req.query.categoria) filtro.mapCategoria = req.query.categoria;

        const sitios = await Sitio.find(filtro)
            .select('nombre slug descripcion ubicacion mapCategoria mapTipo mapIcono paginaDetalle imagen entrada')
            .sort({ nombre: 1 })
            .lean();

        const lugares = sitios.map(s => ({
            _id:          s._id,
            nombre:       s.nombre,
            slug:         s.slug,
            categoria:    s.mapCategoria || 'naturaleza',
            pos: {
                lat: s.ubicacion.coordenadas.lat,
                lng: s.ubicacion.coordenadas.lng
            },
            descripcion:   s.descripcion   || '',
            tipo:          s.mapTipo        || 'Turismo',
            icono:         s.mapIcono       || '📍',
            direccion:     s.ubicacion.referencia
                           || `${s.ubicacion.municipio}, ${s.ubicacion.departamento}`,
            paginaDetalle: s.paginaDetalle  || '#',
            imagen:        s.imagen         || '',
            entrada: {
                precio:          s.entrada?.precio          || 0,
                notas:           s.entrada?.notas           || '',
                incluyeAlmuerzo: s.entrada?.incluyeAlmuerzo || false
            }
        }));
        res.json({ ok: true, total: lugares.length, lugares });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
};

// ── GET /api/sitios/:slug ─────────────────────
const getSitioBySlug = async (req, res) => {
    try {
        const sitio = await Sitio.findOne({ slug: req.params.slug, activo: true });
        if (!sitio) return res.status(404).json({ ok: false, message: 'Sitio no encontrado' });
        res.json({ ok: true, data: sitio });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
};

// ── POST /api/sitios ──────────────────────────
// Crea un nuevo sitio desde el panel de administración
const createSitio = async (req, res) => {
    try {
        const {
            nombre, categorias, descripcion, ubicacion,
            entrada, imagen, precioBaseReserva,
            servicios, atracciones, horario, contacto,
            petFriendly, mapCategoria, mapTipo, mapIcono, paginaDetalle
        } = req.body;

        if (!nombre) {
            return res.status(400).json({ ok: false, message: 'El campo "nombre" es obligatorio.' });
        }

        // Genera slug a partir del nombre si no viene en el body
        const slug = req.body.slug
            || nombre.toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')   // quita tildes
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '');

        // Verifica unicidad de slug
        const existe = await Sitio.findOne({ slug });
        if (existe) {
            return res.status(409).json({
                ok: false,
                message: `Ya existe un sitio con el slug "${slug}". Cambia el nombre o envía un slug personalizado.`
            });
        }

        const sitio = await Sitio.create({
            nombre, slug,
            categorias:        categorias || [],
            descripcion,
            ubicacion,
            entrada,
            imagen,
            precioBaseReserva,
            servicios,
            atracciones,
            horario,
            contacto,
            petFriendly,
            mapCategoria,
            mapTipo,
            mapIcono,
            paginaDetalle,
            activo: true
        });

        res.status(201).json({ ok: true, message: 'Sitio creado exitosamente.', data: sitio });
    } catch (err) {
        // Error de clave duplicada de MongoDB
        if (err.code === 11000) {
            return res.status(409).json({
                ok: false,
                message: 'Ya existe un sitio con ese nombre o slug.'
            });
        }
        res.status(500).json({ ok: false, message: err.message });
    }
};

// ── PUT /api/sitios/:slug ─────────────────────
// Actualiza un sitio existente
const updateSitio = async (req, res) => {
    try {
        const {
            nombre, categorias, descripcion, ubicacion,
            entrada, imagen, precioBaseReserva,
            servicios, atracciones, horario, contacto,
            petFriendly, mapCategoria, mapTipo, mapIcono, paginaDetalle
        } = req.body;

        const update = {
            ...(nombre            !== undefined && { nombre }),
            ...(categorias        !== undefined && { categorias }),
            ...(descripcion       !== undefined && { descripcion }),
            ...(ubicacion         !== undefined && { ubicacion }),
            ...(entrada           !== undefined && { entrada }),
            ...(imagen            !== undefined && { imagen }),
            ...(precioBaseReserva !== undefined && { precioBaseReserva }),
            ...(servicios         !== undefined && { servicios }),
            ...(atracciones       !== undefined && { atracciones }),
            ...(horario           !== undefined && { horario }),
            ...(contacto          !== undefined && { contacto }),
            ...(petFriendly       !== undefined && { petFriendly }),
            ...(mapCategoria      !== undefined && { mapCategoria }),
            ...(mapTipo           !== undefined && { mapTipo }),
            ...(mapIcono          !== undefined && { mapIcono }),
            ...(paginaDetalle     !== undefined && { paginaDetalle })
        };

        const sitio = await Sitio.findOneAndUpdate(
            { slug: req.params.slug },
            { $set: update },
            { new: true, runValidators: true }
        );

        if (!sitio) return res.status(404).json({ ok: false, message: 'Sitio no encontrado.' });
        res.json({ ok: true, message: 'Sitio actualizado correctamente.', data: sitio });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
};

// ── DELETE /api/sitios/:slug ──────────────────
// Borrado suave (activo → false) para preservar datos históricos de reservas
const deleteSitio = async (req, res) => {
    try {
        const sitio = await Sitio.findOneAndUpdate(
            { slug: req.params.slug },
            { $set: { activo: false } },
            { new: true }
        );
        if (!sitio) return res.status(404).json({ ok: false, message: 'Sitio no encontrado.' });
        res.json({ ok: true, message: `Sitio "${sitio.nombre}" desactivado correctamente.` });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
};

module.exports = {
    getSitios,
    getSitiosByCategoria,
    getSitioBySlug,
    getSitiosMapa,
    createSitio,
    updateSitio,
    deleteSitio
};