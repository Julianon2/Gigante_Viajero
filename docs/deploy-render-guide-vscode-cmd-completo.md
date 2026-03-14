# Deploy completo del proyecto en Render (Visual Studio Code CMD)

## Tabla de Contenidos
1. [Requisitos previos](#1-requisitos-previos)
2. [Crear repositorio en GitHub](#2-crear-repositorio-en-github)
3. [Conectar proyecto local con GitHub usando CMD](#3-conectar-proyecto-local-con-github-usando-cmd)
4. [Subir actualizaciones al repositorio](#4-subir-actualizaciones-al-repositorio)
5. [Crear cuenta en Render](#5-crear-cuenta-en-render)
6. [Crear servicio backend en Render](#6-crear-servicio-backend-en-render)
7. [Configurar variables de entorno en Render](#7-configurar-variables-de-entorno-en-render)
8. [Desplegar el frontend](#8-desplegar-el-frontend)
9. [Realizar el deploy](#9-realizar-el-deploy)
10. [Verificar funcionamiento](#10-verificar-funcionamiento)
11. [Actualizar la aplicación](#11-actualizar-la-aplicación)
12. [Checklist final de deploy](#checklist-final-de-deploy)

---

## 1. Requisitos previos

- Node.js instalado ([descargar aquí](https://nodejs.org/))
- Cuenta en GitHub ([crear aquí](https://github.com/join))
- Cuenta en MongoDB Atlas ([crear aquí](https://www.mongodb.com/cloud/atlas/register))
- Cuenta en Render ([crear aquí](https://render.com/register))

---

## 2. Crear repositorio en GitHub

1. Ingresa a [github.com](https://github.com)
2. Haz clic en "New repository"
3. Escribe el nombre del repositorio
4. Elige visibilidad
5. No crees README inicial
6. Haz clic en "Create repository"

---

## 3. Conectar proyecto local con GitHub usando CMD

Abre la terminal CMD de Visual Studio Code en la raíz del proyecto y ejecuta:

```
git init
git add .
git commit -m "primer commit"
git branch -M main
git remote add origin URL_REPOSITORIO
git push -u origin main
```

> Reemplaza `URL_REPOSITORIO` por la URL de tu repo.

---

## 4. Subir actualizaciones al repositorio

```
git add .
git commit -m "mensaje del cambio"
git push
```

---

## 5. Crear cuenta en Render

1. Ingresa a [render.com](https://render.com)
2. Regístrate con GitHub
3. Autoriza repositorios

---

## 6. Crear servicio backend en Render

1. Haz clic en "New Web Service"
2. Selecciona el repositorio
3. En "Root Directory", escribe `backend`
4. Build Command: `npm install`
5. Start Command: `node src/server.js`
6. Elige región
7. Haz clic en "Create Web Service"

---

## 7. Configurar variables de entorno en Render

Agrega las variables detectadas:

- PORT
- NODE_ENV
- MONGODB_URI
- JWT_SECRET
- JWT_EXPIRE
- JWT_COOKIE_EXPIRE
- BCRYPT_ROUNDS
- OPENAI_API_KEY
- STRIPE_SECRET_KEY
- STRIPE_PUBLISHABLE_KEY
- STRIPE_WEBHOOK_SECRET
- FRONTEND_URL
- ALLOWED_ORIGINS
- EMAIL_HOST

---

## 8. Desplegar el frontend

1. Haz clic en "New Static Site"
2. Selecciona el repositorio
3. En "Root Directory", escribe `frontend`
4. Haz clic en "Create Static Site"

---

## 9. Realizar el deploy

- Render ejecuta el build automáticamente
- Revisa los logs
- Obtén la URL pública

---

## 10. Verificar funcionamiento

- Accede a la URL del backend y frontend
- Prueba endpoints y conexión MongoDB
- Verifica autenticación y servicios externos

---

## 11. Actualizar la aplicación

- Cada `git push` a GitHub genera un redeploy automático
- Si cambias variables de entorno, actualízalas en Render

---

## 12. Checklist final de deploy

- [ ] Node.js instalado
- [ ] Cuenta en GitHub, MongoDB Atlas y Render
- [ ] Repo creado en GitHub
- [ ] Proyecto subido a GitHub
- [ ] `.env` y archivos sensibles excluidos
- [ ] Servicio backend creado en Render
- [ ] Variables de entorno configuradas
- [ ] Servicio frontend creado en Render
- [ ] Deploy realizado y verificado
- [ ] Actualizaciones automáticas funcionando

---

> Todos los pasos están adaptados para terminal CMD de Visual Studio Code.