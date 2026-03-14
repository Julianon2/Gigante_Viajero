// =============================================
// models/Review.js  –  Gigante Viajero
// =============================================

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    // Referencia al sitio turístico por slug
    sitioSlug: {
        type:     String,
        required: true,
        index:    true
    },

    // Datos del autor
    usuario: {
        id:     { type: String, required: true },
        nombre: { type: String, required: true },
        email:  { type: String, required: true },
        foto:   { type: String, default: '' }
    },

    // Calificación 1–5 estrellas
    calificacion: {
        type:     Number,
        required: true,
        min:      1,
        max:      5
    },

    // Texto del comentario
    comentario: {
        type:      String,
        required:  true,
        minlength: 10,
        maxlength: 1000,
        trim:      true
    },

    // true = visible; false = pendiente de moderación
    aprobado: { type: Boolean, default: true }

}, { timestamps: true, collection: 'reviews' });

// Un usuario solo puede dejar UNA reseña por sitio
reviewSchema.index({ sitioSlug: 1, 'usuario.id': 1 }, { unique: true });

module.exports = mongoose.models.Review || mongoose.model('Review', reviewSchema);