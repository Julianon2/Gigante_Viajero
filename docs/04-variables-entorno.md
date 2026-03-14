# Variables de Entorno

## Tabla de Contenidos
1. [Variables Obligatorias](#variables-obligatorias)
2. [Variables Opcionales](#variables-opcionales)
3. [Variables Sensibles](#variables-sensibles)
4. [Ejemplo de Archivo .env](#ejemplo-de-archivo-env)

---

## Variables Obligatorias
- `PORT`: Puerto del servidor
- `NODE_ENV`: Entorno (development/production)
- `MONGODB_URI`: URI de conexión a MongoDB Atlas
- `JWT_SECRET`: Clave secreta JWT
- `JWT_EXPIRE`: Expiración del token JWT
- `JWT_COOKIE_EXPIRE`: Expiración de la cookie JWT
- `BCRYPT_ROUNDS`: Rondas de hash para bcrypt

---

## Variables Opcionales
- `OPENAI_API_KEY`: Clave de API para OpenAI (IA)
- `STRIPE_SECRET_KEY`: Clave secreta Stripe
- `STRIPE_PUBLISHABLE_KEY`: Clave pública Stripe
- `STRIPE_WEBHOOK_SECRET`: Webhook Stripe
- `FRONTEND_URL`: URL del frontend
- `ALLOWED_ORIGINS`: Orígenes permitidos para CORS
- `EMAIL_HOST`: Host SMTP para emails

---

## Variables Sensibles
- `MONGODB_URI`: Contiene usuario y contraseña de la base de datos
- `JWT_SECRET`: Clave secreta JWT
- `OPENAI_API_KEY`: Clave de API OpenAI
- `STRIPE_SECRET_KEY`: Clave secreta Stripe
- `STRIPE_WEBHOOK_SECRET`: Webhook Stripe
- `EMAIL_HOST`: Host SMTP

---

## Ejemplo de Archivo .env

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://viajerogigante_db_user:GiganteViajero2026.@giganteviajero.zzxkgy8.mongodb.net/gigante_viajero?appName=giganteviajero
JWT_SECRET=techstore-pro-secret-key-super-segura-2025-cambiar-en-produccion
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
BCRYPT_ROUNDS=12
OPENAI_API_KEY=sk-proj-...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:5500
EMAIL_HOST=smtp.gmail.com
```

---

> Las variables han sido extraídas del archivo `.env` real del proyecto.
