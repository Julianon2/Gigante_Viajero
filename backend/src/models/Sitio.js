// =============================================
// models/Sitio.js  –  Gigante Viajero
// =============================================

const mongoose = require('mongoose');

const alojamientoSchema = new mongoose.Schema({
    nombre:       { type: String, required: true },
    tipo:         { type: String, enum: ['cabaña', 'glamping', 'habitación'] },
    capacidadMax: Number,
    precios: [{
        descripcion: String,
        precio:      { type: Number, required: true }
    }]
}, { _id: false });

const sitioSchema = new mongoose.Schema({
    nombre:     { type: String, required: true, unique: true },
    slug:       { type: String, required: true, unique: true, index: true },

    categorias: {
        type:    [String],
        enum:    ['parque', 'mirador', 'glamping', 'hospedaje'],
        default: []
    },

    descripcion: String,

    ubicacion: {
        municipio:    { type: String, default: 'Gigante' },
        departamento: { type: String, default: 'Huila' },
        referencia:   String,
        // ── NUEVO: coordenadas para el mapa ──
        coordenadas: {
            lat: Number,
            lng: Number
        }
    },

    entrada: {
        precio:          Number,
        incluyeAlmuerzo: { type: Boolean, default: false },
        notas:           String
    },

    atracciones:  [String],
    servicios:    [String],
    alojamientos: [alojamientoSchema],
    horario:      String,

    contacto: {
        telefono:  String,
        email:     String,
        instagram: String,
        facebook:  String
    },

    petFriendly:       { type: Boolean, default: false },
    imagen:            String,
    precioBaseReserva: Number,

    // ── NUEVO: campos para el mapa ────────────
    mapCategoria:  { type: String, enum: ['miradores', 'naturaleza', 'aventura', 'gastronomia', ''], default: '' },
    mapTipo:       { type: String, default: '' },    // badge: "Mirador", "Aventura"...
    mapIcono:      { type: String, default: '📍' },  // emoji del marcador
    paginaDetalle: { type: String, default: '#' },   // archivo HTML de detalle

    activo: { type: Boolean, default: true }

}, { timestamps: true, collection: 'sitios' });

module.exports = mongoose.models.Sitio || mongoose.model('Sitio', sitioSchema);