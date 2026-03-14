# AGENTS.md

Este archivo proporciona orientación a WARP (warp.dev) al trabajar con el código de este repositorio.

## Descripción del Proyecto

Gigante Viajero es una plataforma de turismo para el municipio de Gigante, Huila, Colombia. Permite a los visitantes explorar sitios turísticos (miradores, parques, glampings, hospedajes), hacer reservas, dejar reseñas y chatear con un asistente de viaje con IA (TuriBot). El proyecto es un trabajo de clase.

## Stack Tecnológico

- **Backend:** Node.js + Express + Mongoose (MongoDB Atlas)
- **Frontend:** HTML/CSS/JS estático (sin bundler, sin framework) — se sirve con VS Code Live Server
- **Auth:** Sistema dual — JWT (email/contraseña) y Firebase Admin SDK (Google Sign-In). El middleware `protect` intenta JWT primero, luego Firebase.
- **Chat IA:** API de OpenAI (`gpt-4o-mini`) vía `POST /api/chat`
- **Email:** Nodemailer (Gmail SMTP) para confirmaciones de reserva y códigos de recuperación de contraseña
- **Logging:** Winston con archivos de log rotativos diarios
- **Pagos:** Nequi (transferencia manual, no automatizado vía Stripe a pesar de estar en las dependencias)

## Comandos para Desarrollo

```bash
# Instalar dependencias del backend
cd backend && npm install

# Ejecutar backend en desarrollo (nodemon, auto-reload)
cd backend && npm run dev

# Ejecutar backend en producción
cd backend && npm start

# Poblar sitios turísticos en MongoDB
cd backend && npm run seed

# Crear usuario administrador
cd backend && npm run seed:admin
```

No hay paso de build para el frontend — abrir `frontend/pages/index.html` con VS Code Live Server (puertos 5500-5502).

**No hay suite de tests configurada.** `npm test` sale con error. Los archivos en `backend/src/utils/test*.js` son scripts de prueba manuales, no tests automatizados.

## Arquitectura

### Dos puntos de entrada en el backend

- `src/server.js` — **el punto de entrada activo** usado por `npm start` / `npm run dev`. Setup ligero con CORS, parseo JSON y montaje de rutas.
- `src/app.js` — setup más completo con Helmet, rate limiting, sanitización XSS/NoSQL, morgan logging y manejo de errores. Contiene referencias residuales a "TechStore Pro" (un proyecto anterior). **No se usa actualmente como punto de entrada** (no es importado por `server.js`).

### Flujo de peticiones

```
Cliente → server.js → routes/*.js → controllers/*.js → models/*.js → MongoDB Atlas
```

### Módulos principales del backend

- **Modelos:** `User`, `Sitio`, `Booking`, `Review`, `Settings` — todos esquemas de Mongoose
- **Controladores:** `authController`, `Bookingcontroller`, `sitiocontroller`, `ReviewController`, `settingsController`
- **Middleware:** `auth.js` (protect + authorize), `rateLimiter.js`, `errorHandler.js`, `sanitize.js`, `upload.js` (multer), `validation.js`
- **Servicios:** `Emailservice.JS` — envía emails de confirmación de reserva e itinerario
- **Config:** `database.js` (MongoDB), `firebase.js` (Firebase Admin SDK), `logger.js` (Winston), `Nodemailer.js`, `morganConfig.js`

### Estructura del frontend

Páginas HTML estáticas en `frontend/pages/` con módulos JS compartidos en `frontend/scripts/`:
- `api.js` — clase `APIClient` genérica que envuelve `fetch` (base URL: `http://localhost:5000/api`)
- `auth-api.js` — clase `AuthAPI` para registro, login, login con Google, gestión de perfil
- `session.js` — manejo de sesión/token
- `turibot.js` — widget de chat con IA
- `reservations.js` / `reviews.js` — lógica de UI para reservas y reseñas
- `admin_dashboard.js` — lógica del panel de administración

Los datos de sitios turísticos también están disponibles como JSON estático en `frontend/data/sitios.json`, cargado por TuriBot para su system prompt.

## Rutas de la API (server.js)

- `/api/auth` → `routes/auth.js`
- `/api/chat` → `routes/chatRoutes.js`
- `/api/sitios` → `routes/Sitios.js`
- `/api/Bookings` → `routes/Bookings.js`
- `/api/reviews` → `routes/reviews.js`
- `/api/users/photo` → `routes/Photo.js`
- `/api/users` → `routes/users.js`
- `/api/settings` → `routes/settings.js`
- `/api/health` → inline en server.js

**Nota:** La ruta de Bookings está montada en `/api/Bookings` (B mayúscula).

## Detalles del Sistema de Autenticación

- Los usuarios locales se registran con email/contraseña; la contraseña se hashea con bcryptjs (salt rounds 12) en un hook pre-save de Mongoose.
- Los usuarios de Google se autentican vía Firebase; el middleware `protect` crea automáticamente un User en MongoDB en el primer login con Google.
- Payload del JWT: `{ id, email, role }`. La expiración se configura con la variable `JWT_EXPIRE` (por defecto 30d).
- Roles: `customer`, `admin`, `moderator`. Autorización vía middleware `authorize(...roles)`.
- La recuperación de contraseña usa un store de códigos en memoria (no persistido) — códigos de 6 dígitos enviados por email, válidos por 10 minutos.

## Variables de Entorno

Ver `backend/.env.example`. Variables clave:
- `MONGODB_URI` — cadena de conexión a MongoDB Atlas
- `JWT_SECRET`, `JWT_EXPIRE` — configuración JWT
- `OPENAI_API_KEY` — para TuriBot
- `MAIL_USER`, `MAIL_PASS` — credenciales de Gmail para Nodemailer
- `FRONTEND_URL`, `ALLOWED_ORIGINS` — CORS en producción

## Advertencias Importantes

- **Las credenciales de Firebase están hardcodeadas** en `backend/src/config/firebase.js` (JSON de service account embebido directamente). Debería moverse a variables de entorno o a un archivo separado `serviceAccountKey.json`.
- **Convenciones de nombres inconsistentes:** Los nombres de archivos mezclan mayúsculas/minúsculas (`Bookingcontroller.js`, `Emailservice.JS`, `Sitiocontroller.js`). El casing de las rutas también varía (`/api/Bookings` vs `/api/reviews`).
- **Referencias residuales a "TechStore Pro"** aparecen en `app.js`, `api.js`, configuración del logger, comentarios de modelos y middleware. El proyecto fue adaptado de un proyecto de e-commerce anterior.
- **Duplicación `app.js` vs `server.js`:** Ambos archivos configuran aplicaciones Express con definiciones de rutas superpuestas. Solo `server.js` es el punto de entrada activo.
- **No hay tests automatizados.** Los archivos `utils/test*.js` son scripts de prueba manuales independientes.
- El frontend almacena tokens bajo la clave `techstore-auth-token` (nombre heredado de TechStore).
- Las reseñas requieren moderación del admin (`aprobado: false` por defecto).
- Las verificaciones de disponibilidad de reservas filtran por destination ID + accommodation ID para soportar disponibilidad por cabaña.

## Idioma

El código, la UI, los comentarios y la documentación están principalmente en **español**. Los nombres de variables y campos de la API mezclan español e inglés.
