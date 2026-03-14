# Gigante Viajero — Preparación para Despliegue

## Variables de Entorno

Configura las variables en un archivo `.env` (no versionar). Usa el ejemplo de `.env.example`:

```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/<db>?appName=<app>
JWT_SECRET=<jwt_secret>
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
BCRYPT_ROUNDS=12
OPENAI_API_KEY=<openai_api_key>
STRIPE_SECRET_KEY=<stripe_secret_key>
STRIPE_PUBLISHABLE_KEY=<stripe_publishable_key>
STRIPE_WEBHOOK_SECRET=<stripe_webhook_secret>
FRONTEND_URL=https://<frontend_url>
ALLOWED_ORIGINS=https://<frontend_url>
EMAIL_HOST=smtp.gmail.com
```

## Scripts de npm

- `npm start`: Inicia el backend en producción
- `npm run dev`: Inicia el backend en modo desarrollo (nodemon)
- `npm test`: Ejecuta pruebas (por implementar)

## Exclusión de archivos sensibles

Asegúrate de que `.env`, `.env.example`, `serviceAccountKey.json`, `logs/`, `uploads/` y `node_modules/` estén excluidos en `.gitignore`.

## Despliegue

Sigue la guía en [docs/08-guia-despliegue.md](docs/08-guia-despliegue.md) para el despliegue en Render o Railway.

---

> Revisa la documentación en la carpeta docs para más detalles y buenas prácticas.