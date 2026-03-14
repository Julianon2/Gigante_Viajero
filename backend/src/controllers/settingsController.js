// =============================================
// controllers/settingsController.js  –  Gigante Viajero
// =============================================

const Settings = require('../models/Settings');

// ── Campos permitidos (whitelist de seguridad) ────────────────────
const ALLOWED_FIELDS = [
    'serviceFeePercentage',
    'taxPercentage',
    'notificationEmail',
    'autoConfirmEmail',
    'freeCancelHours',
    'partialRefundPercent',
    'partialRefundHours',
    'businessName',
    'businessPhone',
    'businessWhatsapp',
    'businessAddress',
    'businessLogo',
    'businessInstagram',
    'businessFacebook'
];

// ── Helper: filtra solo campos permitidos ─────────────────────────
function filterFields(body) {
    const update = {};
    ALLOWED_FIELDS.forEach(field => {
        if (body[field] !== undefined) update[field] = body[field];
    });
    return update;
}

// ── GET /api/settings ─────────────────────────────────────────────
// Devuelve la configuración actual (o los defaults si no existe aún)
const getSettings = async (req, res) => {
    try {
        // findOneAndUpdate con upsert = true crea el doc si no existe
        let settings = await Settings.findOne({ key: 'global' });

        if (!settings) {
            settings = await Settings.create({ key: 'global' });
        }

        res.json({ ok: true, data: settings });
    } catch (err) {
        console.error('❌ Error en getSettings:', err);
        res.status(500).json({ ok: false, message: err.message });
    }
};

// ── PUT /api/settings ─────────────────────────────────────────────
// Actualiza parcial o totalmente la configuración
const updateSettings = async (req, res) => {
    try {
        const update = filterFields(req.body);

        if (Object.keys(update).length === 0) {
            return res.status(400).json({
                ok:      false,
                message: 'No se enviaron campos válidos para actualizar.'
            });
        }

        // upsert: true  → crea el documento si no existía
        // new: true     → devuelve el documento actualizado
        const settings = await Settings.findOneAndUpdate(
            { key: 'global' },
            { $set: update },
            { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
        );

        res.json({
            ok:      true,
            message: 'Configuración actualizada correctamente.',
            data:    settings
        });
    } catch (err) {
        console.error('❌ Error en updateSettings:', err);

        // Error de validación de Mongoose
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ ok: false, message: errors.join(', ') });
        }

        res.status(500).json({ ok: false, message: err.message });
    }
};

// ── DELETE /api/settings/reset ────────────────────────────────────
// Restaura todos los valores a los defaults del schema
const resetSettings = async (req, res) => {
    try {
        await Settings.deleteOne({ key: 'global' });
        const fresh = await Settings.create({ key: 'global' });
        res.json({
            ok:      true,
            message: 'Configuración restaurada a valores por defecto.',
            data:    fresh
        });
    } catch (err) {
        console.error('❌ Error en resetSettings:', err);
        res.status(500).json({ ok: false, message: err.message });
    }
};

module.exports = { getSettings, updateSettings, resetSettings };