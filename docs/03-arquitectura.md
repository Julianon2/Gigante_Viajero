# Arquitectura

## Tabla de Contenidos
1. [Punto de Entrada](#punto-de-entrada)
2. [Flujo de la Aplicación](#flujo-de-la-aplicación)
3. [Módulos Principales](#módulos-principales)
4. [Servicios y Controladores](#servicios-y-controladores)
5. [Rutas](#rutas)
6. [Interacción Frontend/Backend](#interacción-frontendbackend)
7. [Interacción con Base de Datos](#interacción-con-base-de-datos)
8. [Diagramas Conceptuales](#diagramas-conceptuales)

---

## Punto de Entrada
- **Backend:** `src/server.js` y `src/app.js`
- **Frontend:** `frontend/pages/index.html` (principal)

---

## Flujo de la Aplicación

1. El backend inicia con `server.js`, configura middlewares, conecta a MongoDB, carga rutas y arranca el servidor.
2. El frontend es una web estática que consume la API backend vía fetch/AJAX.

---

## Módulos Principales
- **config/**: Configuración de base de datos, Firebase, logger, morgan, email.
- **controllers/**: Lógica de negocio para auth, bookings, reviews, settings, sitios.
- **middleware/**: Seguridad, validación, uploads, rate limiting, error handling.
- **models/**: Esquemas de MongoDB (Booking, Review, Settings, Sitio, User).
- **routes/**: Endpoints REST para auth, bookings, chat, sitios, reviews, users, settings.
- **services/**: Email, integración externa.
- **utils/**: Tests y utilidades.
- **validators/**: Validaciones de datos.

---

## Servicios y Controladores
- **Controladores:** authController, Bookingcontroller, ReviewController, settingsController, sitiocontroller.
- **Servicios:** Emailservice, Firebase, Stripe, OpenAI.

---

## Rutas
- `/api/auth`: Autenticación
- `/api/chat`: Chat
- `/api/sitios`: Sitios turísticos
- `/api/Bookings`: Reservas
- `/api/reviews`: Reviews
- `/api/users/photo`: Fotos de usuario
- `/api/users`: Usuarios
- `/api/settings`: Configuración

---

## Interacción Frontend/Backend
- El frontend consume endpoints REST del backend.
- El backend expone endpoints protegidos por JWT y middlewares.

---

## Interacción con Base de Datos
- El backend usa Mongoose para interactuar con MongoDB Atlas.
- Los modelos representan Booking, Review, Settings, Sitio, User.

---

## Diagramas Conceptuales

### Diagrama de Flujo Simplificado

```
[Frontend]
   |
   |  (fetch/AJAX)
   v
[Backend API]
   |
   |  (Mongoose)
   v
[MongoDB Atlas]
```

### Diagrama de Módulos Backend

```
[server.js]
   |
   v
[app.js]
   |
   v
[Middlewares] -> [Rutas] -> [Controladores] -> [Modelos] -> [MongoDB]
```

---

> La arquitectura se ha documentado según los archivos y estructura real del proyecto.
