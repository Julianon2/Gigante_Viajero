// =============================================
// models/Settings.js  –  Gigante Viajero
// =============================================

const mongoose = require('mongoose');

// Previene OverwriteModelError en entornos con hot-reload
if (mongoose.models.Settings) {
    module.exports = mongoose.model('Settings');
    return;
}

const SettingsSchema = new mongoose.Schema(
    {
        key: { type: String, default: 'global', unique: true },

        // ── Precios ───────────────────────────────────────────────
        serviceFeePercentage: { type: Number, default: 5,  min: 0, max: 100 },
        taxPercentage:        { type: Number, default: 19, min: 0, max: 100 },

        // ── Notificaciones ────────────────────────────────────────
        notificationEmail: { type: String, default: 'info@giganteviajero.com', trim: true },
        autoConfirmEmail:  { type: Boolean, default: true },

        // ── Política de cancelación ───────────────────────────────
        // BUG FIX: estos campos faltaban en el modelo separado
        freeCancelHours:      { type: Number, default: 48, min: 0 },
        partialRefundPercent: { type: Number, default: 50, min: 0, max: 100 },
        partialRefundHours:   { type: Number, default: 24, min: 0 },

        // ── Pago Nequi GLOBAL (fallback si el destino no tiene QR) ──
        nequiNumber: { type: String, default: '', trim: true },
        nequiName:   { type: String, default: '', trim: true },

        // ── Datos del negocio ─────────────────────────────────────
        businessName:      { type: String, default: 'Gigante Viajero', trim: true },
        businessPhone:     { type: String, default: '', trim: true },
        businessWhatsapp:  { type: String, default: '', trim: true },
        businessAddress:   { type: String, default: '', trim: true },
        businessLogo:      { type: String, default: '', trim: true },
        businessInstagram: { type: String, default: '', trim: true },
        businessFacebook:  { type: String, default: '', trim: true }
    },
    { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Settings', SettingsSchema);