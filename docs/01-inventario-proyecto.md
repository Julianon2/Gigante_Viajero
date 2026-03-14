# Inventario del Proyecto

## Tabla de Contenidos
1. [Resumen del Proyecto](#resumen-del-proyecto)
2. [Estructura del Repositorio](#estructura-del-repositorio)
3. [Descripción General del Sistema](#descripción-general-del-sistema)

---

## Resumen del Proyecto

Este proyecto, "Gigante Viajero", es una plataforma web orientada a reservas, gestión de sitios turísticos, reviews, pagos y autenticación. Consta de dos grandes componentes:
- **Backend**: API RESTful basada en Node.js, Express y MongoDB.
- **Frontend**: Aplicación web estática con HTML, CSS y JavaScript.

El objetivo es ofrecer funcionalidades de reservas, gestión de usuarios, reviews, pagos y administración de sitios turísticos.

---

## Estructura del Repositorio

```
Gigante_Viagero/
├── backend/
│   ├── package.json
│   ├── .env
│   ├── serviceAccountKey.json
│   ├── logs/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── Seed/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   ├── uploads/
├── frontend/
│   ├── assets/
│   ├── data/
│   ├── pages/
│   ├── scripts/
│   ├── styles/
├── docs/
```

**Archivos clave:**
- `backend/package.json`: Configuración de dependencias y scripts.
- `backend/.env`: Variables de entorno.
- `backend/serviceAccountKey.json`: Clave de servicio (Firebase).
- `backend/src/server.js` y `backend/src/app.js`: Entrypoints del backend.
- `frontend/pages/`: HTMLs principales del frontend.

---

## Descripción General del Sistema

- **Backend**: API RESTful, maneja autenticación, reservas, reviews, pagos, uploads, y administración.
- **Frontend**: Aplicación estática, consume la API, permite interacción de usuarios, administración y visualización de sitios.

**Tipo de proyecto:**
- Fullstack (Backend + Frontend)
- Monorepo
- API RESTful
- Aplicación web estática (Frontend)

**No se detecta dockerización ni archivos de CI/CD en la raíz.**

---

> Este inventario se basa en la estructura y archivos reales detectados en el workspace.
