// =============================================
// VALIDADORES DE RESERVAS - GIGANTE VIAJERO
// =============================================

const { body, validationResult } = require('express-validator');

const validateBooking = [
    body('serviceType').notEmpty().withMessage('El tipo de servicio es requerido').isIn(['parque', 'mirador', 'glamping', 'hospedaje']).withMessage('Tipo de servicio inválido'),
    body('destination.name').notEmpty().withMessage('El nombre del destino es requerido').trim().isLength({ min: 3, max: 200 }),
    body('destination.location').notEmpty().withMessage('La ubicación del destino es requerida'),
    body('destination.price').notEmpty().isNumeric().withMessage('El precio debe ser un número').custom(v => v >= 0),
    body('checkIn').notEmpty().isISO8601().custom(v => { const d = new Date(v); const t = new Date(); t.setHours(0,0,0,0); return d >= t; }).withMessage('La fecha de entrada debe ser hoy o en el futuro'),
    body('checkOut').notEmpty().isISO8601().custom((v, { req }) => new Date(v) > new Date(req.body.checkIn)).withMessage('La fecha de salida debe ser posterior a la fecha de entrada'),
    body('numPeople').notEmpty().withMessage('El número de personas es requerido'),
    body('personalInfo.fullName').notEmpty().trim().isLength({ min: 3, max: 100 }).matches(/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/).withMessage('El nombre solo puede contener letras y espacios'),
    body('personalInfo.email').notEmpty().isEmail().withMessage('Formato de correo electrónico inválido').normalizeEmail(),
    body('personalInfo.phone').notEmpty().matches(/^\d{10}$/).withMessage('El teléfono debe tener exactamente 10 dígitos'),
    body('personalInfo.documentType').notEmpty().isIn(['CC', 'CE', 'PA', 'TI']).withMessage('Tipo de documento inválido'),
    body('personalInfo.documentNumber').notEmpty().trim().isLength({ min: 6, max: 20 }),
    body('emergencyContact.name').notEmpty().trim().isLength({ min: 3, max: 100 }).matches(/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/),
    body('emergencyContact.phone').notEmpty().matches(/^\d{10}$/).withMessage('El teléfono de emergencia debe tener 10 dígitos'),

    // ✅ Solo Nequi como método de pago válido
    body('paymentMethod').notEmpty().withMessage('El método de pago es requerido').equals('nequi').withMessage('Solo se acepta Nequi como método de pago'),

    body('pricing.total').notEmpty().isNumeric().custom(v => v > 0).withMessage('El total debe ser mayor a 0'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Errores de validación',
                errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
            });
        }
        next();
    }
];

const validateStatusUpdate = [
    body('status').notEmpty().isIn(['pending', 'confirmed', 'in-progress', 'completed', 'cancelled']).withMessage('Estado inválido'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Estado inválido', errors: errors.array() });
        next();
    }
];

const validateCancellation = [
    body('reason').optional().trim().isLength({ max: 500 }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Datos de cancelación inválidos', errors: errors.array() });
        next();
    }
];

module.exports = { validateBooking, validateStatusUpdate, validateCancellation };