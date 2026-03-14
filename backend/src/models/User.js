// =============================================
// MODELO USUARIO - TECHSTORE PRO ECOMMERCE
// =============================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

console.log('👤 Iniciando creación del modelo User con seguridad avanzada...');

const userSchema = new mongoose.Schema({

    // =============================================
    // INFORMACIÓN PERSONAL BÁSICA
    // =============================================

    firstName: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
        minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
        maxlength: [50, 'El nombre no puede tener más de 50 caracteres'],
        validate: {
            validator: function(name) {
                // ✅ Acepta letras, espacios, acentos Y puntos (nombres de Google como "Jr.")
                const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'.,-]+$/;
                return nameRegex.test(name);
            },
            message: 'El nombre solo puede contener letras y espacios'
        }
    },

    lastName: {
        type: String,
        required: [true, 'El apellido es obligatorio'],
        trim: true,
        minlength: [1, 'El apellido debe tener al menos 1 caracter'],  // ← cambiado de 2 a 1
        maxlength: [50, 'El apellido no puede tener más de 50 caracteres'],
        validate: {
            validator: function(name) {
                // ✅ Acepta letras, espacios, acentos Y puntos
                const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'.,-]*$/;
                return nameRegex.test(name);
            },
            message: 'El apellido solo puede contener letras y espacios'
        }
    },

    // =============================================
    // EMAIL
    // =============================================

    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            },
            message: 'Por favor ingresa un email válido'
        },
        index: true
    },

    // =============================================
    // CONTRASEÑA
    // ✅ CAMBIO CLAVE: required solo si NO es Google
    // =============================================

    password: {
        type: String,
        required: function() {
            // Solo requerida si el usuario se registró con email/password
            return this.authProvider === 'local' || !this.authProvider;
        },
        minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
        validate: {
            validator: function(password) {
                // Si es usuario de Google, saltear validación
                if (this.authProvider === 'google') return true;
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
                return passwordRegex.test(password);
            },
            message: 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúscula, minúscula y número'
        },
        select: false
    },

    // =============================================
    // ✅ NUEVOS CAMPOS PARA GOOGLE/FIREBASE
    // =============================================

    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },

    firebaseUid: {
        type: String,
        default: null,
        index: true    // Para buscar rápido por UID de Firebase
    },

    photoURL: {
        type: String,
        default: null
    },

    // =============================================
    // ROLES Y PERMISOS
    // =============================================

    role: {
        type: String,
        enum: {
            values: ['customer', 'admin', 'moderator'],
            message: '{VALUE} no es un rol válido'
        },
        default: 'customer',
        index: true
    },

    // =============================================
    // ESTADO DE LA CUENTA
    // =============================================

    isActive: {
        type: Boolean,
        default: true,
        index: true
    },

    isEmailVerified: {
        type: Boolean,
        // ✅ Google ya verificó el email, así que lo marcamos como verificado
        default: function() {
            return this.authProvider === 'google';
        }
    },

    passwordResetToken: {
        type: String,
        select: false
    },

    passwordResetExpires: {
        type: Date,
        select: false
    },

    // =============================================
    // INFORMACIÓN DE CONTACTO
    // =============================================

    phone: {
        type: String,
        trim: true,
        validate: {
            validator: function(phone) {
                if (!phone) return true;
                const phoneRegex = /^(\+57)?[3][0-9]{9}$/;
                return phoneRegex.test(phone.replace(/\s/g, ''));
            },
            message: 'Por favor ingresa un número de teléfono colombiano válido (ej: +57 3123456789)'
        }
    },

    // =============================================
    // DIRECCIÓN PRINCIPAL
    // =============================================

    address: {
        street: { type: String, trim: true, maxlength: [200, 'La dirección no puede tener más de 200 caracteres'] },
        city: { type: String, trim: true, maxlength: [100, 'La ciudad no puede tener más de 100 caracteres'] },
        state: { type: String, trim: true, maxlength: [100, 'El departamento no puede tener más de 100 caracteres'] },
        zipCode: { type: String, trim: true, maxlength: [10, 'El código postal no puede tener más de 10 caracteres'] },
        country: { type: String, default: 'Colombia', maxlength: [50, 'El país no puede tener más de 50 caracteres'] }
    },

    // =============================================
    // INFORMACIÓN DE PERFIL
    // =============================================

    avatar: {
        type: String,
        validate: {
            validator: function(url) {
                if (!url) return true;
                // ✅ Acepta URLs de Google (lh3.googleusercontent.com) y URLs normales de imagen
                const urlRegex = /^https?:\/\/.+/i;
                return urlRegex.test(url);
            },
            message: 'El avatar debe ser una URL válida'
        }
    },

    dateOfBirth: {
        type: Date,
        validate: {
            validator: function(date) {
                if (!date) return true;
                const now = new Date();
                const minDate = new Date(now.getFullYear() - 120, 0, 1);
                const maxDate = new Date(now.getFullYear() - 13, now.getMonth(), now.getDate());
                return date >= minDate && date <= maxDate;
            },
            message: 'Por favor ingresa una fecha de nacimiento válida (entre 13 y 120 años)'
        }
    },

    gender: {
        type: String,
        enum: { values: ['male', 'female', 'other', 'prefer-not-to-say'], message: '{VALUE} no es un género válido' },
        default: 'prefer-not-to-say'
    },

    // =============================================
    // ACTIVIDAD Y SESIONES
    // =============================================

    lastLogin: { type: Date, default: Date.now },
    loginAttempts: { type: Number, default: 0, max: [10, 'Demasiados intentos de login'] },
    lockUntil: { type: Date },

    // =============================================
    // INFORMACIÓN COMERCIAL
    // =============================================

    totalOrders: { type: Number, default: 0, min: [0, 'El total de órdenes no puede ser negativo'] },
    totalSpent: { type: Number, default: 0, min: [0, 'El total gastado no puede ser negativo'] },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    loyaltyPoints: { type: Number, default: 0, min: [0, 'Los puntos de lealtad no pueden ser negativos'] }

}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.password;
            delete ret.passwordResetToken;
            delete ret.passwordResetExpires;
            delete ret.loginAttempts;
            delete ret.lockUntil;
            return ret;
        }
    },
    toObject: { virtuals: true }
});

// =============================================
// CAMPOS VIRTUALES
// =============================================

userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`.trim();
});

userSchema.virtual('age').get(function() {
    if (!this.dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
});

userSchema.virtual('fullAddress').get(function() {
    if (!this.address || !this.address.street) return '';
    const parts = [];
    if (this.address.street) parts.push(this.address.street);
    if (this.address.city) parts.push(this.address.city);
    if (this.address.state) parts.push(this.address.state);
    if (this.address.zipCode) parts.push(`CP ${this.address.zipCode}`);
    if (this.address.country && this.address.country !== 'Colombia') parts.push(this.address.country);
    return parts.join(', ');
});

userSchema.virtual('isLocked').get(function() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

userSchema.virtual('customerLevel').get(function() {
    if (this.totalSpent >= 5000000) return 'platinum';
    if (this.totalSpent >= 2000000) return 'gold';
    if (this.totalSpent >= 500000) return 'silver';
    return 'bronze';
});

userSchema.virtual('formattedTotalSpent').get(function() {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP',
        minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(this.totalSpent);
});

// =============================================
// MIDDLEWARE PRE-SAVE
// =============================================

userSchema.pre('save', async function(next) {
    console.log(`🔍 Procesando usuario antes de guardar: ${this.email}`);

    // ✅ Si es usuario de Google, NO encriptar password (es un hash aleatorio)
    if (this.authProvider === 'google') {
        console.log(`🔥 Usuario de Google, saltando encriptación de contraseña`);
        return next();
    }

    if (!this.isModified('password')) {
        console.log(`💤 Contraseña no modificada, saltando encriptación`);
        return next();
    }

    try {
        console.log(`🔐 Encriptando contraseña para: ${this.email}`);
        const saltRounds = 12;
        this.password = await bcrypt.hash(this.password, saltRounds);
        console.log(`✅ Contraseña encriptada exitosamente`);
        next();
    } catch (error) {
        console.error(`❌ Error encriptando contraseña: ${error.message}`);
        next(error);
    }
});

userSchema.post('save', function(doc) {
    console.log(`✅ Usuario guardado: ${doc.fullName} | ${doc.email} | ${doc.authProvider || 'local'}`);
});

// =============================================
// MÉTODOS DE INSTANCIA
// =============================================

userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        // ✅ Usuarios de Google no tienen contraseña real
        if (this.authProvider === 'google') {
            console.log(`⚠️ Usuario de Google no puede hacer login con contraseña`);
            return false;
        }
        console.log(`🔍 Verificando contraseña para: ${this.email}`);
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        console.log(isMatch ? `✅ Contraseña CORRECTA` : `❌ Contraseña INCORRECTA`);
        return isMatch;
    } catch (error) {
        throw new Error('Error interno al verificar contraseña');
    }
};

userSchema.methods.incrementLoginAttempts = function() {
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({ $unset: { lockUntil: 1 }, $set: { loginAttempts: 1 } });
    }
    const updates = { $inc: { loginAttempts: 1 } };
    if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + 30 * 60 * 1000 };
        console.log(`🔒 Cuenta bloqueada temporalmente: ${this.email}`);
    }
    return this.updateOne(updates);
};

userSchema.methods.resetLoginAttempts = function() {
    return this.updateOne({
        $unset: { loginAttempts: 1, lockUntil: 1 },
        $set: { lastLogin: new Date() }
    });
};

userSchema.methods.addPurchase = function(orderTotal) {
    this.totalOrders += 1;
    this.totalSpent += orderTotal;
    const pointsEarned = Math.floor(orderTotal / 1000);
    this.loyaltyPoints += pointsEarned;
    return this.save();
};

userSchema.methods.addToWishlist = function(productId) {
    if (!this.wishlist.includes(productId)) {
        this.wishlist.push(productId);
        return this.save();
    }
    return Promise.resolve(this);
};

userSchema.methods.removeFromWishlist = function(productId) {
    this.wishlist = this.wishlist.filter(id => !id.equals(productId));
    return this.save();
};

userSchema.methods.generateAuthToken = function() {
    const payload = { id: this._id, email: this.email, role: this.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });
    console.log(`✅ Token JWT generado para: ${this.email}`);
    return token;
};

userSchema.methods.getPublicProfile = function() {
    return {
        id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        fullName: this.fullName,
        email: this.email,
        role: this.role,
        phone: this.phone,
        address: this.address,
        avatar: this.avatar || this.photoURL,
        isActive: this.isActive,
        isEmailVerified: this.isEmailVerified,
        authProvider: this.authProvider,
        customerLevel: this.customerLevel,
        totalOrders: this.totalOrders,
        totalSpent: this.totalSpent,
        formattedTotalSpent: this.formattedTotalSpent,
        loyaltyPoints: this.loyaltyPoints,
        createdAt: this.createdAt
    };
};

// =============================================
// MÉTODOS ESTÁTICOS
// =============================================

userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email: email.toLowerCase() }).select('+password');
};

userSchema.statics.findByCredentials = async function(email) {
    return this.findOne({ email: email.toLowerCase() }).select('+password');
};

userSchema.statics.getActiveUsers = function(limit = 50) {
    return this.find({ isActive: true }).sort({ createdAt: -1 }).limit(limit).select('-password');
};

userSchema.statics.getUsersByRole = function(role) {
    return this.find({ role, isActive: true }).sort({ createdAt: -1 });
};

userSchema.statics.getUserStats = function() {
    return this.aggregate([
        {
            $group: {
                _id: null,
                totalUsers: { $sum: 1 },
                activeUsers: { $sum: { $cond: ['$isActive', 1, 0] } },
                adminUsers: { $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] } },
                customerUsers: { $sum: { $cond: [{ $eq: ['$role', 'customer'] }, 1, 0] } },
                googleUsers: { $sum: { $cond: [{ $eq: ['$authProvider', 'google'] }, 1, 0] } },
                localUsers: { $sum: { $cond: [{ $eq: ['$authProvider', 'local'] }, 1, 0] } },
                totalOrders: { $sum: '$totalOrders' },
                totalSpent: { $sum: '$totalSpent' },
                averageSpent: { $avg: '$totalSpent' }
            }
        }
    ]);
};

// =============================================
// CREAR Y EXPORTAR EL MODELO
// =============================================

const User = mongoose.model('User', userSchema);

console.log('✅ Modelo User creado exitosamente');
console.log('🔥 Soporte para login con Google/Firebase activado');
console.log('📋 Campos nuevos: authProvider, firebaseUid, photoURL');

module.exports = User;