// =============================================
// CONFIGURACIÓN DE NODEMAILER - GIGANTE VIAJERO
// =============================================

const nodemailer = require('nodemailer');
const logger = require('./logger');

// ─────────────────────────────────────────────
// Crear transporte de email
// ─────────────────────────────────────────────
const createTransport = () => {
    try {

        // Verificar variables de entorno
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error('❌ Faltan credenciales EMAIL_USER o EMAIL_PASS en el .env');
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            secure: true
        });

        logger.info('✅ Transporte de email configurado', {
            service: 'gmail',
            user: process.env.EMAIL_USER
        });

        return transporter;

    } catch (error) {
        logger.error('❌ Error configurando Nodemailer:', error);
        throw error;
    }
};

// ─────────────────────────────────────────────
// Instancia del transporter
// ─────────────────────────────────────────────
const transporter = createTransport();


// ─────────────────────────────────────────────
// Verificar conexión con el servidor de correo
// ─────────────────────────────────────────────
const verifyEmailConfig = async () => {
    try {

        await transporter.verify();

        logger.info('✅ Servidor de correo listo');
        console.log('📧 Servidor de email conectado');
        console.log(`👤 Cuenta: ${process.env.EMAIL_USER}`);

        return true;

    } catch (error) {

        logger.error('❌ Error verificando email:', error);

        console.log('\n⚠️  Configuración de Gmail requerida:');
        console.log('1️⃣ Activar verificación en 2 pasos');
        console.log('2️⃣ Crear contraseña de aplicación');
        console.log('3️⃣ Colocarla en EMAIL_PASS del .env\n');

        return false;
    }
};


// ─────────────────────────────────────────────
// Enviar correo genérico
// ─────────────────────────────────────────────
const sendEmail = async (mailOptions) => {

    try {

        if (!mailOptions.from) {
            mailOptions.from = {
                name: 'Gigante Viajero',
                address: process.env.EMAIL_USER
            };
        }

        const info = await transporter.sendMail(mailOptions);

        logger.info('📧 Email enviado', {
            to: mailOptions.to,
            subject: mailOptions.subject,
            id: info.messageId
        });

        return {
            success: true,
            messageId: info.messageId
        };

    } catch (error) {

        logger.error('❌ Error enviando email:', error);

        return {
            success: false,
            error: error.message
        };
    }
};


// ─────────────────────────────────────────────
// Enviar email con adjuntos
// ─────────────────────────────────────────────
const sendEmailWithAttachments = async (to, subject, html, attachments = []) => {

    const mailOptions = {
        from: {
            name: 'Gigante Viajero',
            address: process.env.EMAIL_USER
        },
        to,
        subject,
        html,
        attachments
    };

    return await sendEmail(mailOptions);
};


// ─────────────────────────────────────────────
// Exportaciones
// ─────────────────────────────────────────────
module.exports = {
    transporter,
    sendEmail,
    sendEmailWithAttachments,
    verifyEmailConfig
};