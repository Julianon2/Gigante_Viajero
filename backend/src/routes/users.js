// =============================================
// RUTAS DE USUARIOS - GIGANTE VIAJERO
// =============================================

const express = require('express');
const router  = express.Router();
const User    = require('../models/User');

// ── GET /api/users — Lista todos los usuarios ─────────────────────
router.get('/', async (req, res) => {
    try {
        const users = await User.find({})
            .select('-password')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: users });
    } catch (error) {
        console.error('❌ Error obteniendo usuarios:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ── DELETE /api/users/:id — Eliminar usuario por ID ───────────────
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        console.log(`🗑️ Usuario eliminado: ${user.email}`);
        res.json({ success: true, message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('❌ Error eliminando usuario:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;