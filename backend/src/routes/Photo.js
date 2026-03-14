// =============================================
// RUTA DE FOTO DE PERFIL - GIGANTE VIAJERO
// =============================================

const express = require('express');
const router  = express.Router();
const path    = require('path');
const fs      = require('fs');

// Rutas exactas según la estructura del proyecto
const { protect }  = require('../middleware/auth');
const upload       = require('../middleware/upload');
const User         = require('../models/User');

console.log('📸 Inicializando rutas de foto de perfil');

// ── POST /api/users/photo  →  Subir / cambiar foto ───────────────────────────
router.post('/', protect, upload.single('photo'), async (req, res) => {
    try {
        console.log('📸 POST /api/users/photo - Subiendo foto...');

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No se recibió ninguna imagen.'
            });
        }

        const userId = req.user?._id || req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'No autenticado.'
            });
        }

        // URL pública de la imagen
        const photoURL = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        console.log(`   📎 Nueva URL: ${photoURL}`);

        // Borrar la foto anterior del disco si existe
        const userBefore = await User.findById(userId).select('photoURL avatar');
        const oldURL = userBefore?.photoURL || userBefore?.avatar;
        if (oldURL && oldURL.includes('/uploads/')) {
            const oldFilename = oldURL.split('/uploads/')[1];
            if (oldFilename) {
                const oldPath = path.join(__dirname, '..', '..', 'uploads', oldFilename);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                    console.log(`   🗑️ Foto anterior eliminada: ${oldFilename}`);
                }
            }
        }

        // Actualizar photoURL y avatar en MongoDB
        const user = await User.findByIdAndUpdate(
            userId,
            { photoURL, avatar: photoURL },
            { new: true, select: 'email firstName lastName photoURL avatar' }
        );

        console.log(`   ✅ Foto actualizada para: ${user.email}`);

        return res.json({
            success:  true,
            message:  'Foto actualizada correctamente.',
            photoURL: user.photoURL,
            user
        });

    } catch (err) {
        console.error('❌ Error al subir foto:', err);
        return res.status(500).json({
            success: false,
            message: 'Error interno al guardar la foto.'
        });
    }
});


// ── DELETE /api/users/photo  →  Eliminar foto ────────────────────────────────
router.delete('/', protect, async (req, res) => {
    try {
        console.log('🗑️ DELETE /api/users/photo - Eliminando foto...');

        const userId = req.user?._id || req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'No autenticado.'
            });
        }

        const user = await User.findById(userId).select('photoURL avatar');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado.'
            });
        }

        // Borrar archivo del disco
        const oldURL = user.photoURL || user.avatar;
        if (oldURL && oldURL.includes('/uploads/')) {
            const filename = oldURL.split('/uploads/')[1];
            if (filename) {
                const filePath = path.join(__dirname, '..', '..', 'uploads', filename);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log(`   🗑️ Archivo eliminado: ${filename}`);
                }
            }
        }

        // Limpiar campos en MongoDB
        await User.findByIdAndUpdate(userId, {
            $unset: { photoURL: '', avatar: '' }
        });

        console.log(`   ✅ Foto eliminada para usuario: ${userId}`);

        return res.json({
            success: true,
            message: 'Foto eliminada correctamente.'
        });

    } catch (err) {
        console.error('❌ Error al eliminar foto:', err);
        return res.status(500).json({
            success: false,
            message: 'Error interno al eliminar la foto.'
        });
    }
});

module.exports = router;