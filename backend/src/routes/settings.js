// =============================================
// routes/settings.js  –  Gigante Viajero
// =============================================

const express  = require('express');
const router   = express.Router();
const Settings = require('../models/Settings'); // ← usa el modelo separado

const ALLOWED = [
    'serviceFeePercentage', 'taxPercentage',
    'notificationEmail',    'autoConfirmEmail',
    'freeCancelHours',      'partialRefundPercent', 'partialRefundHours',
    'nequiNumber',          'nequiName',
    'businessName',         'businessPhone',        'businessWhatsapp',
    'businessAddress',      'businessLogo',         'businessInstagram',
    'businessFacebook'
];

// ── GET /api/settings ─────────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        let settings = await Settings.findOne({ key: 'global' });
        if (!settings) settings = await Settings.create({ key: 'global' });
        res.json({ ok: true, data: settings });
    } catch (err) {
        console.error('getSettings error:', err.message);
        res.status(500).json({ ok: false, message: err.message });
    }
});

// ── PUT /api/settings ─────────────────────────────────────────────
router.put('/', async (req, res) => {
    try {
        const update = {};
        ALLOWED.forEach(f => { if (req.body[f] !== undefined) update[f] = req.body[f]; });

        if (!Object.keys(update).length)
            return res.status(400).json({ ok: false, message: 'No se enviaron campos válidos.' });

        const settings = await Settings.findOneAndUpdate(
            { key: 'global' },
            { $set: update },
            { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
        );
        res.json({ ok: true, message: 'Configuración actualizada.', data: settings });
    } catch (err) {
        console.error('updateSettings error:', err.message);
        if (err.name === 'ValidationError') {
            const msgs = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ ok: false, message: msgs.join(', ') });
        }
        res.status(500).json({ ok: false, message: err.message });
    }
});

// ── DELETE /api/settings/reset ────────────────────────────────────
router.delete('/reset', async (req, res) => {
    try {
        await Settings.deleteOne({ key: 'global' });
        const fresh = await Settings.create({ key: 'global' });
        res.json({ ok: true, message: 'Configuración restaurada a defaults.', data: fresh });
    } catch (err) {
        console.error('resetSettings error:', err.message);
        res.status(500).json({ ok: false, message: err.message });
    }
});

// ── GET /api/settings/public ──────────────────────────────────────
// Sin autenticación — solo datos públicos del negocio
// BUG FIX: usaba .lean() y luego intentaba .create() sobre el resultado
router.get('/public', async (req, res) => {
    try {
        // Sin .lean() para que Create funcione si no existe
        let doc = await Settings.findOne({ key: 'global' });
        if (!doc) doc = await Settings.create({ key: 'global' });

        res.json({
            ok: true,
            data: {
                businessName:      doc.businessName      || 'Gigante Viajero',
                businessPhone:     doc.businessPhone     || '',
                businessWhatsapp:  doc.businessWhatsapp  || '',
                businessAddress:   doc.businessAddress   || '',
                businessLogo:      doc.businessLogo      || '',
                businessInstagram: doc.businessInstagram || '',
                businessFacebook:  doc.businessFacebook  || '',
                nequiNumber:       doc.nequiNumber       || '',
                nequiName:         doc.nequiName         || '',
                // BUG FIX: exponer tarifas para que reservations.js las use
                serviceFeePercentage: doc.serviceFeePercentage ?? 5,
                taxPercentage:        doc.taxPercentage        ?? 19
            }
        });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
});

module.exports = router;