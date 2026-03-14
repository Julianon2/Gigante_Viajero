// =============================================
// routes/reviews.js  –  Gigante Viajero
// FIX: el middleware adminOnly está inline para no
// depender de cómo se llame en tu auth.js
// =============================================

const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');  // ← solo "protect", igual que antes

const {
    getReviewsBySitio,
    createReview,
    deleteReview,
    getPendingReviews,
    approveReview,
    rejectReview,
} = require('../controllers/ReviewController');

// Middleware inline: verifica que el usuario sea admin
// Sin depender de un middleware externo que quizás no existe
function adminOnly(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ ok: false, message: 'Acceso solo para administradores.' });
    }
    next();
}

// ─── RUTAS ADMIN (van PRIMERO para que Express no las
//     confunda con el parámetro :slug) ──────────────────

router.get('/admin/pending',        protect, adminOnly, getPendingReviews);
router.patch('/admin/:id/approve',  protect, adminOnly, approveReview);
router.delete('/admin/:id/reject',  protect, adminOnly, rejectReview);

// ─── RUTAS PÚBLICAS / USUARIO ─────────────────────────

router.get('/:slug',     getReviewsBySitio);
router.post('/:slug',    protect, createReview);
router.delete('/:id',    protect, deleteReview);

module.exports = router;