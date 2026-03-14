// =============================================
// SERVICIO DE EMAILS - GIGANTE VIAJERO
// =============================================

const { sendEmail, sendEmailWithAttachments } = require('../validators/nodemailer');
const logger = require('../config/logger');

/**
 * PLANTILLA BASE DE EMAIL - DISEÑO PROFESIONAL
 */
const getEmailTemplate = (content) => {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Gigante Viajero</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Arial', 'Helvetica', sans-serif; 
                background-color: #f3f4f6; 
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: linear-gradient(135deg, #195C33 0%, #0d3d20 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
            }
            .header h1 {
                font-size: 32px;
                font-weight: 700;
                margin-bottom: 8px;
            }
            .header p {
                font-size: 16px;
                opacity: 0.95;
            }
            .content {
                padding: 40px 30px;
                color: #374151;
                line-height: 1.6;
            }
            .booking-code {
                background: linear-gradient(135deg, #F4C400 0%, #FFE347 100%);
                padding: 20px;
                border-radius: 12px;
                text-align: center;
                margin: 30px 0;
            }
            .booking-code p {
                font-size: 14px;
                color: #195C33;
                font-weight: 600;
                margin-bottom: 8px;
            }
            .booking-code h2 {
                font-size: 32px;
                font-weight: 800;
                color: #195C33;
                font-family: 'Courier New', monospace;
                letter-spacing: 4px;
            }
            .info-box {
                background: #f9fafb;
                border-left: 4px solid #195C33;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
            }
            .info-box h3 {
                color: #195C33;
                font-size: 18px;
                margin-bottom: 12px;
                font-weight: 700;
            }
            .info-item {
                display: flex;
                justify-content: space-between;
                padding: 12px 0;
                border-bottom: 1px solid #e5e7eb;
            }
            .info-item:last-child {
                border-bottom: none;
            }
            .info-label {
                font-weight: 600;
                color: #6b7280;
            }
            .info-value {
                font-weight: 700;
                color: #195C33;
            }
            .itinerary {
                margin: 30px 0;
            }
            .day-card {
                background: #f9fafb;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 16px;
                border-left: 4px solid #F4C400;
            }
            .day-card h4 {
                color: #195C33;
                font-size: 18px;
                margin-bottom: 12px;
            }
            .day-card ul {
                list-style: none;
                padding-left: 0;
            }
            .day-card li {
                padding: 8px 0;
                color: #374151;
            }
            .day-card li::before {
                content: "✓";
                color: #10b981;
                font-weight: bold;
                margin-right: 10px;
            }
            .button {
                display: inline-block;
                background: linear-gradient(135deg, #195C33 0%, #0d3d20 100%);
                color: white;
                padding: 16px 40px;
                text-decoration: none;
                border-radius: 30px;
                font-weight: 700;
                margin: 20px 0;
                text-align: center;
            }
            .footer {
                background: #f9fafb;
                padding: 30px;
                text-align: center;
                border-top: 2px solid #e5e7eb;
            }
            .footer p {
                color: #6b7280;
                font-size: 14px;
                margin-bottom: 16px;
            }
            .social-links {
                margin: 20px 0;
            }
            .social-links a {
                display: inline-block;
                margin: 0 8px;
                color: #195C33;
                text-decoration: none;
                font-size: 24px;
            }
            .warning-box {
                background: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 16px;
                border-radius: 8px;
                margin: 20px 0;
            }
            .warning-box p {
                color: #92400e;
                font-size: 14px;
            }
            @media only screen and (max-width: 600px) {
                .content { padding: 20px; }
                .header { padding: 30px 20px; }
                .header h1 { font-size: 24px; }
                .booking-code h2 { font-size: 24px; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🌄 Gigante Viajero</h1>
                <p>Tu aventura comienza aquí</p>
            </div>
            ${content}
            <div class="footer">
                <p><strong>Gigante Viajero</strong> - Tu compañero ideal para descubrir nuevos destinos</p>
                <div class="social-links">
                    <a href="https://facebook.com">📘</a>
                    <a href="https://instagram.com">📸</a>
                    <a href="https://tiktok.com">🎵</a>
                </div>
                <p style="font-size: 12px; color: #9ca3af;">
                    📧 info@giganteviajero.com | 📞 +57 123 456 7890<br>
                    Gigante, Huila, Colombia
                </p>
                <p style="font-size: 11px; color: #9ca3af; margin-top: 16px;">
                    © ${new Date().getFullYear()} Gigante Viajero. Todos los derechos reservados.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
};

/**
 * EMAIL 1: CONFIRMACIÓN DE RESERVA CON ITINERARIO
 * Se envía inmediatamente después de hacer la reserva
 */
const sendBookingConfirmation = async (bookingData) => {
    try {
        const { personalInfo, destination, checkIn, checkOut, nights, numPeople, bookingCode, companions, emergencyContact } = bookingData;

        // Formatear fechas
        const checkInDate = new Date(checkIn).toLocaleDateString('es-CO', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        const checkOutDate = new Date(checkOut).toLocaleDateString('es-CO', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

        // Generar lista de acompañantes
        let companionsList = '';
        if (companions && companions.length > 0) {
            companionsList = `
                <div class="info-box">
                    <h3>👥 Acompañantes Registrados (${companions.length})</h3>
                    ${companions.map((comp, index) => `
                        <div class="info-item">
                            <span class="info-label">${index + 1}. ${comp.name}</span>
                            <span class="info-value">${comp.documentType} ${comp.documentNumber}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        const content = `
            <div class="content">
                <h2 style="color: #195C33; margin-bottom: 20px;">¡Reserva Confirmada! 🎉</h2>
                
                <p style="font-size: 16px; margin-bottom: 20px;">
                    Hola <strong>${personalInfo.fullName}</strong>,
                </p>
                
                <p style="margin-bottom: 30px;">
                    ¡Gracias por confiar en <strong>Gigante Viajero</strong>! Tu reserva ha sido confirmada exitosamente. 
                    A continuación encontrarás todos los detalles de tu aventura.
                </p>

                <div class="booking-code">
                    <p>Código de Reserva</p>
                    <h2>${bookingCode}</h2>
                </div>

                <div class="info-box">
                    <h3>📍 Detalles del Destino</h3>
                    <div class="info-item">
                        <span class="info-label">Destino:</span>
                        <span class="info-value">${destination.name}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Ubicación:</span>
                        <span class="info-value">${destination.location}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Tipo de Servicio:</span>
                        <span class="info-value">${bookingData.serviceType.toUpperCase()}</span>
                    </div>
                </div>

                <div class="info-box">
                    <h3>📅 Fechas y Duración</h3>
                    <div class="info-item">
                        <span class="info-label">Check-in:</span>
                        <span class="info-value">${checkInDate}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Check-out:</span>
                        <span class="info-value">${checkOutDate}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Noches:</span>
                        <span class="info-value">${nights} ${nights === 1 ? 'noche' : 'noches'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Personas:</span>
                        <span class="info-value">${numPeople} ${numPeople === '1' ? 'persona' : 'personas'}</span>
                    </div>
                </div>

                ${companionsList}

                <div class="info-box">
                    <h3>🚨 Contacto de Emergencia</h3>
                    <div class="info-item">
                        <span class="info-label">Nombre:</span>
                        <span class="info-value">${emergencyContact.name}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Teléfono:</span>
                        <span class="info-value">${emergencyContact.phone}</span>
                    </div>
                </div>

                <div class="info-box">
                    <h3>💰 Resumen de Pagos</h3>
                    <div class="info-item">
                        <span class="info-label">Subtotal:</span>
                        <span class="info-value">$${bookingData.pricing.subtotal.toLocaleString('es-CO')} COP</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Tarifa de servicio:</span>
                        <span class="info-value">$${bookingData.pricing.serviceFee.toLocaleString('es-CO')} COP</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Impuestos:</span>
                        <span class="info-value">$${bookingData.pricing.tax.toLocaleString('es-CO')} COP</span>
                    </div>
                    <div class="info-item" style="background: #fffbeb; margin: 12px -20px -20px; padding: 16px 20px; border-radius: 0 0 8px 8px;">
                        <span class="info-label" style="font-size: 18px;">TOTAL:</span>
                        <span class="info-value" style="font-size: 24px; color: #F4C400;">$${bookingData.pricing.total.toLocaleString('es-CO')} COP</span>
                    </div>
                </div>

                <div class="warning-box">
                    <p><strong>⚠️ Políticas de Cancelación:</strong></p>
                    <p style="margin-top: 8px;">
                        • Cancelación gratuita hasta 48 horas antes del check-in<br>
                        • Entre 24-48 horas: reembolso del 50%<br>
                        • Menos de 24 horas: sin reembolso
                    </p>
                </div>

                <div style="text-align: center; margin: 40px 0;">
                    <a href="https://giganteviajero.com/mis-reservas" class="button">
                        Ver Mi Reserva Completa
                    </a>
                </div>

                <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
                    Si tienes alguna pregunta, no dudes en contactarnos:<br>
                    📧 reservas@giganteviajero.com<br>
                    📞 +57 123 456 7890 (WhatsApp disponible)
                </p>

                <p style="margin-top: 20px; font-size: 16px; color: #195C33; font-weight: 600;">
                    ¡Nos vemos pronto en tu aventura! 🌄
                </p>
            </div>
        `;

        const mailOptions = {
            to: personalInfo.email,
            subject: `✅ Reserva Confirmada - ${bookingCode} | Gigante Viajero`,
            html: getEmailTemplate(content)
        };

        const result = await sendEmail(mailOptions);

        if (result.success) {
            logger.info('✅ Email de confirmación enviado', {
                bookingCode,
                to: personalInfo.email
            });
        }

        return result;
    } catch (error) {
        logger.error('❌ Error al enviar email de confirmación:', error);
        return { success: false, error: error.message };
    }
};

/**
 * EMAIL 2: ITINERARIO DETALLADO
 * Se envía con el itinerario completo del viaje
 */
const sendItinerary = async (bookingData, itinerary) => {
    try {
        const { personalInfo, destination, checkIn, checkOut, bookingCode } = bookingData;

        // Generar días del itinerario
        const itineraryDays = itinerary.map((day, index) => `
            <div class="day-card">
                <h4>📅 Día ${index + 1}: ${day.title}</h4>
                <ul>
                    ${day.activities.map(activity => `
                        <li><strong>${activity.time}:</strong> ${activity.description}</li>
                    `).join('')}
                </ul>
                ${day.meals ? `
                    <p style="margin-top: 12px; color: #6b7280; font-size: 14px;">
                        🍽️ Comidas incluidas: 
                        ${day.meals.breakfast ? 'Desayuno' : ''} 
                        ${day.meals.lunch ? 'Almuerzo' : ''} 
                        ${day.meals.dinner ? 'Cena' : ''}
                    </p>
                ` : ''}
            </div>
        `).join('');

        const content = `
            <div class="content">
                <h2 style="color: #195C33; margin-bottom: 20px;">📋 Itinerario de tu Viaje</h2>
                
                <p style="font-size: 16px; margin-bottom: 20px;">
                    Hola <strong>${personalInfo.fullName}</strong>,
                </p>
                
                <p style="margin-bottom: 30px;">
                    Hemos preparado un itinerario detallado para que aproveches al máximo tu experiencia en 
                    <strong>${destination.name}</strong>. A continuación, encontrarás todas las actividades planeadas día por día.
                </p>

                <div class="booking-code">
                    <p>Código de Reserva</p>
                    <h2>${bookingCode}</h2>
                </div>

                <div class="itinerary">
                    <h3 style="color: #195C33; margin-bottom: 20px;">🗓️ Programación Completa</h3>
                    ${itineraryDays}
                </div>

                <div class="info-box">
                    <h3>📌 Recomendaciones Importantes</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li style="padding: 8px 0;">✓ Llega 15 minutos antes de cada actividad</li>
                        <li style="padding: 8px 0;">✓ Lleva ropa cómoda y protector solar</li>
                        <li style="padding: 8px 0;">✓ Mantén hidratado durante todo el día</li>
                        <li style="padding: 8px 0;">✓ No olvides tu cámara para capturar momentos especiales</li>
                        <li style="padding: 8px 0;">✓ Respeta las normas de seguridad en cada actividad</li>
                    </ul>
                </div>

                <div class="warning-box">
                    <p><strong>⚠️ Importante:</strong></p>
                    <p style="margin-top: 8px;">
                        Este itinerario puede estar sujeto a cambios por condiciones climáticas o circunstancias 
                        imprevistas. Te notificaremos cualquier modificación con anticipación.
                    </p>
                </div>

                <div style="text-align: center; margin: 40px 0;">
                    <a href="https://giganteviajero.com/itinerario/${bookingCode}" class="button">
                        Descargar Itinerario PDF
                    </a>
                </div>

                <p style="margin-top: 30px; font-size: 16px; color: #195C33; font-weight: 600;">
                    ¡Prepárate para vivir una experiencia inolvidable! 🎒✨
                </p>
            </div>
        `;

        const mailOptions = {
            to: personalInfo.email,
            subject: `📋 Itinerario Detallado - ${destination.name} | Código: ${bookingCode}`,
            html: getEmailTemplate(content)
        };

        const result = await sendEmail(mailOptions);

        if (result.success) {
            logger.info('✅ Email de itinerario enviado', {
                bookingCode,
                to: personalInfo.email
            });
        }

        return result;
    } catch (error) {
        logger.error('❌ Error al enviar itinerario:', error);
        return { success: false, error: error.message };
    }
};

/**
 * EMAIL 3: RECORDATORIO 24H ANTES DEL CHECK-IN
 */
const sendReminder = async (bookingData) => {
    try {
        const { personalInfo, destination, checkIn, bookingCode } = bookingData;

        const checkInDate = new Date(checkIn).toLocaleDateString('es-CO', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

        const content = `
            <div class="content">
                <h2 style="color: #195C33; margin-bottom: 20px;">⏰ Tu Aventura Comienza Mañana</h2>
                
                <p style="font-size: 16px; margin-bottom: 20px;">
                    Hola <strong>${personalInfo.fullName}</strong>,
                </p>
                
                <p style="margin-bottom: 30px;">
                    ¡Tu viaje a <strong>${destination.name}</strong> comienza mañana! Queremos asegurarnos de que 
                    estés completamente preparado para disfrutar al máximo tu experiencia.
                </p>

                <div class="booking-code">
                    <p>Código de Reserva</p>
                    <h2>${bookingCode}</h2>
                </div>

                <div class="info-box">
                    <h3>📅 Fecha de Check-in</h3>
                    <p style="font-size: 18px; color: #195C33; font-weight: 700; margin-top: 12px;">
                        ${checkInDate}
                    </p>
                    <p style="margin-top: 8px; color: #6b7280;">
                        Horario de check-in: A partir de las 2:00 PM
                    </p>
                </div>

                <div class="info-box">
                    <h3>🎒 Lista de Verificación Pre-viaje</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li style="padding: 8px 0;">☐ Documento de identidad</li>
                        <li style="padding: 8px 0;">☐ Comprobante de reserva (este email)</li>
                        <li style="padding: 8px 0;">☐ Ropa cómoda y zapatos deportivos</li>
                        <li style="padding: 8px 0;">☐ Protector solar y repelente</li>
                        <li style="padding: 8px 0;">☐ Medicamentos personales</li>
                        <li style="padding: 8px 0;">☐ Cámara o smartphone con batería</li>
                        <li style="padding: 8px 0;">☐ Botella de agua reutilizable</li>
                    </ul>
                </div>

                <div class="info-box">
                    <h3>📍 Cómo Llegar</h3>
                    <p style="margin-top: 12px;">
                        <strong>${destination.name}</strong><br>
                        ${destination.location}<br><br>
                        <a href="https://maps.google.com/?q=${encodeURIComponent(destination.name + ' ' + destination.location)}" 
                           style="color: #195C33; font-weight: 600;">
                           📍 Ver en Google Maps
                        </a>
                    </p>
                </div>

                <div class="warning-box">
                    <p><strong>⚠️ Importante:</strong></p>
                    <p style="margin-top: 8px;">
                        Si necesitas cancelar o modificar tu reserva, recuerda que debes hacerlo con al menos 48 horas 
                        de anticipación para obtener un reembolso completo.
                    </p>
                </div>

                <div style="text-align: center; margin: 40px 0;">
                    <p style="font-size: 18px; color: #195C33; margin-bottom: 20px;">
                        ¿Tienes alguna pregunta de último momento?
                    </p>
                    <a href="https://wa.me/571234567890?text=Hola,%20tengo%20la%20reserva%20${bookingCode}" 
                       class="button">
                        Contactar por WhatsApp
                    </a>
                </div>

                <p style="margin-top: 30px; font-size: 16px; color: #195C33; font-weight: 600;">
                    ¡Nos vemos mañana! Prepárate para una experiencia increíble 🌟
                </p>
            </div>
        `;

        const mailOptions = {
            to: personalInfo.email,
            subject: `⏰ Recordatorio: Tu Check-in es Mañana - ${bookingCode}`,
            html: getEmailTemplate(content)
        };

        const result = await sendEmail(mailOptions);

        if (result.success) {
            logger.info('✅ Email de recordatorio enviado', {
                bookingCode,
                to: personalInfo.email
            });
        }

        return result;
    } catch (error) {
        logger.error('❌ Error al enviar recordatorio:', error);
        return { success: false, error: error.message };
    }
};

/**
 * EMAIL 4: AGRADECIMIENTO POST-VIAJE
 */
const sendThankYou = async (bookingData) => {
    try {
        const { personalInfo, destination, bookingCode } = bookingData;

        const content = `
            <div class="content">
                <h2 style="color: #195C33; margin-bottom: 20px;">¡Gracias por Viajar con Nosotros! 💚</h2>
                
                <p style="font-size: 16px; margin-bottom: 20px;">
                    Hola <strong>${personalInfo.fullName}</strong>,
                </p>
                
                <p style="margin-bottom: 30px;">
                    Esperamos que hayas disfrutado al máximo tu experiencia en <strong>${destination.name}</strong>. 
                    Tu opinión es muy importante para nosotros y nos ayuda a mejorar continuamente.
                </p>

                <div style="text-align: center; margin: 40px 0;">
                    <p style="font-size: 18px; color: #195C33; margin-bottom: 20px; font-weight: 600;">
                        ⭐ ¿Cómo fue tu experiencia?
                    </p>
                    <a href="https://giganteviajero.com/reseña/${bookingCode}" 
                       class="button">
                        Dejar una Reseña
                    </a>
                </div>

                <div class="info-box">
                    <h3>🎁 Beneficio Especial</h3>
                    <p style="margin-top: 12px;">
                        Como agradecimiento por tu confianza, te ofrecemos un <strong>10% de descuento</strong> 
                        en tu próxima reserva. Usa el código:
                    </p>
                    <div style="background: #F4C400; padding: 16px; border-radius: 8px; text-align: center; margin: 20px 0;">
                        <p style="font-size: 24px; font-weight: 800; color: #195C33; font-family: monospace;">
                            GIGANTE10
                        </p>
                    </div>
                    <p style="font-size: 13px; color: #6b7280;">
                        *Válido por 30 días desde la fecha de check-out
                    </p>
                </div>

                <div class="info-box">
                    <h3>📸 Comparte tu Experiencia</h3>
                    <p style="margin-top: 12px;">
                        ¿Tomaste fotos increíbles? ¡Compártelas con nosotros!<br><br>
                        Etiquétanos en Instagram: <strong>@giganteviajero</strong><br>
                        Usa el hashtag: <strong>#GiganteViajeroExperience</strong>
                    </p>
                </div>

                <div style="text-align: center; margin: 40px 0;">
                    <p style="font-size: 16px; margin-bottom: 20px;">
                        ¿Listo para tu próxima aventura?
                    </p>
                    <a href="https://giganteviajero.com/destinos" 
                       class="button">
                        Explorar Más Destinos
                    </a>
                </div>

                <p style="margin-top: 30px; font-size: 16px; color: #195C33; font-weight: 600;">
                    ¡Esperamos verte pronto en una nueva aventura! 🌄✨
                </p>
            </div>
        `;

        const mailOptions = {
            to: personalInfo.email,
            subject: `💚 Gracias por tu Visita | Tu Próximo Viaje te Espera`,
            html: getEmailTemplate(content)
        };

        const result = await sendEmail(mailOptions);

        if (result.success) {
            logger.info('✅ Email de agradecimiento enviado', {
                bookingCode,
                to: personalInfo.email
            });
        }

        return result;
    } catch (error) {
        logger.error('❌ Error al enviar email de agradecimiento:', error);
        return { success: false, error: error.message };
    }
};

/**
 * FUNCIÓN PRINCIPAL: Enviar todos los emails de una reserva
 */
const sendBookingEmails = async (bookingData, itinerary = null) => {
    try {
        const results = {
            confirmation: null,
            itinerary: null
        };

        // 1. Enviar confirmación de reserva (INMEDIATO)
        results.confirmation = await sendBookingConfirmation(bookingData);

        // 2. Enviar itinerario si está disponible (INMEDIATO)
        if (itinerary && itinerary.length > 0) {
            results.itinerary = await sendItinerary(bookingData, itinerary);
        }

        // 3. Programar recordatorio para 24h antes (esto requeriría un cron job o tarea programada)
        // En producción, usarías algo como node-cron o un servicio de colas como Bull

        logger.info('✅ Emails de reserva procesados', {
            bookingCode: bookingData.bookingCode,
            results
        });

        return results;
    } catch (error) {
        logger.error('❌ Error al enviar emails de reserva:', error);
        throw error;
    }
};

module.exports = {
    sendBookingConfirmation,
    sendItinerary,
    sendReminder,
    sendThankYou,
    sendBookingEmails
};