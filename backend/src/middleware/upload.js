// =============================================
// MIDDLEWARE DE SUBIDA DE ARCHIVOS - GIGANTE VIAJERO
// =============================================

const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// Carpeta de uploads en la raíz del backend (al mismo nivel que src/)
const uploadDir = path.join(__dirname, '..', '..', 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('📁 Carpeta uploads creada en:', uploadDir);
}

// ── Configuración de almacenamiento ──────────────────────────────────────────
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext      = path.extname(file.originalname).toLowerCase() || '.jpg';
        const userId   = req.user?._id || req.user?.id || 'unknown';
        const filename = `photo_${userId}_${Date.now()}${ext}`;
        cb(null, filename);
    }
});

// ── Filtro: solo imágenes ─────────────────────────────────────────────────────
const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes (jpg, png, webp, gif)'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // máx 5 MB
});

console.log('✅ Middleware de upload configurado');

module.exports = upload;