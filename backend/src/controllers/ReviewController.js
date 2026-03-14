// =============================================
// controllers/ReviewController.js  –  Gigante Viajero
// CAMBIOS:
//   · createReview  → aprobado: false (espera moderación)
//   · getPending    → lista reseñas pendientes para el admin
//   · approveReview → aprueba una reseña
//   · rejectReview  → rechaza (y elimina) una reseña
// =============================================

const Review = require('../models/Review');
const Sitio  = require('../models/Sitio');

// ── GET /api/reviews/:slug ────────────────────────────────────
// Devuelve SOLO las reseñas APROBADAS de un sitio + estadísticas
const getReviewsBySitio = async (req, res) => {
    try {
        const { slug } = req.params;

        const reviews = await Review.find({ sitioSlug: slug, aprobado: true })
            .sort({ createdAt: -1 });

        const total = reviews.length;
        let suma = 0;
        const distribucion = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

        reviews.forEach(r => {
            suma += r.calificacion;
            distribucion[r.calificacion]++;
        });

        const promedio = total > 0 ? (suma / total).toFixed(1) : 0;

        res.json({
            ok:          true,
            promedio:    parseFloat(promedio),
            total,
            distribucion,
            data:        reviews
        });

    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
};

// ── POST /api/reviews/:slug ───────────────────────────────────
// Crea la reseña con aprobado: false → queda en espera de moderación
const createReview = async (req, res) => {
    try {
        const { slug }                     = req.params;
        const { calificacion, comentario } = req.body;

        if (!calificacion || !comentario)
            return res.status(400).json({ ok: false, message: 'Calificación y comentario son requeridos.' });

        if (calificacion < 1 || calificacion > 5)
            return res.status(400).json({ ok: false, message: 'La calificación debe estar entre 1 y 5.' });

        if (comentario.trim().length < 10)
            return res.status(400).json({ ok: false, message: 'El comentario debe tener al menos 10 caracteres.' });

        const sitio = await Sitio.findOne({ slug, activo: true });
        if (!sitio)
            return res.status(404).json({ ok: false, message: 'Sitio no encontrado.' });

        const userId = req.user._id.toString();
        const nombre = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || 'Usuario';
        const email  = req.user.email;
        const foto   = req.user.photoURL || req.user.foto || '';

        const review = new Review({
            sitioSlug:    slug,
            usuario: { id: userId, nombre, email, foto },
            calificacion: parseInt(calificacion),
            comentario:   comentario.trim(),
            aprobado:     false,          // ← CAMBIO CLAVE: espera moderación
        });

        await review.save();

        // Respuesta exitosa — el frontend mostrará "en revisión"
        res.status(201).json({
            ok:      true,
            pending: true,
            message: 'Reseña recibida. Será publicada tras revisión del equipo.',
            data:    review
        });

    } catch (err) {
        if (err.code === 11000)
            return res.status(409).json({ ok: false, message: 'Ya dejaste una reseña para este sitio.' });

        res.status(500).json({ ok: false, message: err.message });
    }
};

// ── DELETE /api/reviews/:id ───────────────────────────────────
// El propio autor o un admin puede borrar su reseña
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review)
            return res.status(404).json({ ok: false, message: 'Reseña no encontrada.' });

        const userId = req.user._id.toString();

        if (review.usuario.id !== userId && req.user.role !== 'admin')
            return res.status(403).json({ ok: false, message: 'No tienes permiso para borrar esta reseña.' });

        await review.deleteOne();

        res.json({ ok: true, message: 'Reseña eliminada.' });

    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
};

// ── GET /api/reviews/admin/pending ───────────────────────────
// [ADMIN] Lista todas las reseñas pendientes de moderación
const getPendingReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ aprobado: false })
            .sort({ createdAt: 1 });   // más antiguas primero

        res.json({
            ok:    true,
            total: reviews.length,
            data:  reviews
        });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
};

// ── PATCH /api/reviews/admin/:id/approve ─────────────────────
// [ADMIN] Aprueba la reseña → queda visible en el sitio
const approveReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            {
                aprobado:    true,
                moderadoPor: req.user._id,
                moderadoEn:  new Date(),
            },
            { new: true }
        );

        if (!review)
            return res.status(404).json({ ok: false, message: 'Reseña no encontrada.' });

        res.json({ ok: true, message: 'Reseña aprobada y publicada.', data: review });

    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
};

// ── DELETE /api/reviews/admin/:id/reject ─────────────────────
// [ADMIN] Rechaza y elimina la reseña
const rejectReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);

        if (!review)
            return res.status(404).json({ ok: false, message: 'Reseña no encontrada.' });

        res.json({ ok: true, message: 'Reseña rechazada y eliminada.' });

    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
};

module.exports = {
    getReviewsBySitio,
    createReview,
    deleteReview,
    getPendingReviews,
    approveReview,
    rejectReview,
};