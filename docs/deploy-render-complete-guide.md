# Deploy completo del proyecto en Render

## Tabla de Contenidos
1. [Requisitos previos](#1-requisitos-previos)
2. [Crear repositorio en GitHub](#2-crear-repositorio-en-github)
3. [Conectar proyecto local con GitHub](#3-conectar-proyecto-local-con-github)
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

Antes de comenzar, asegúrate de tener:

- Node.js instalado en tu computadora ([descargar aquí](https://nodejs.org/))
- Una cuenta en GitHub ([crear aquí](https://github.com/join))
- Una cuenta en MongoDB Atlas ([crear aquí](https://www.mongodb.com/cloud/atlas/register))
- Una cuenta en Render ([crear aquí](https://render.com/register))

---

## 2. Crear repositorio en GitHub

1. Ingresa a [github.com](https://github.com)
2. Haz clic en "New repository"
3. Escribe el nombre del repositorio (por ejemplo: `gigante-viajero`)
4. Elige la visibilidad (Public o Private)
5. **No** crees README inicial ni archivos extra
6. Haz clic en "Create repository"

> ⚠️ No agregues archivos extra para evitar conflictos al subir tu proyecto.

---

## 3. Conectar proyecto local con GitHub

Abre una terminal en la raíz de tu proyecto y ejecuta:

```bash
git init
```
Inicializa el repositorio local.

```bash
git add .
```
Agrega todos los archivos al staging.

```bash
git commit -m "primer commit"
```
Crea el primer commit.

```bash
git branch -M main
```
Establece la rama principal como `main`.

```bash
git remote add origin URL_REPOSITORIO
```
Vincula tu repo local con el repo de GitHub. Reemplaza `URL_REPOSITORIO` por la URL de tu repo.

```bash
git push -u origin main
```
Sube el proyecto a GitHub.

> ⚠️ Asegúrate de que `.env` y archivos sensibles estén en `.gitignore` antes de subir.

---

## 4. Subir actualizaciones al repositorio

Cada vez que hagas cambios, ejecuta:

```bash
git add .
git commit -m "mensaje del cambio"
git push
```

- `git add .`: agrega los cambios
- `git commit -m "mensaje"`: guarda los cambios
- `git push`: sube los cambios a GitHub

---

## 5. Crear cuenta en Render

1. Ingresa a [render.com](https://render.com)
2. Haz clic en "Sign Up"
3. Regístrate usando tu cuenta de GitHub
4. Autoriza el acceso a tus repositorios

> ⚠️ Render necesita acceso a tu repo para desplegar automáticamente.

---

## 6. Crear servicio backend en Render

1. Haz clic en "New Web Service"
2. Selecciona el repositorio de tu proyecto
3. En "Root Directory", escribe `backend`
4. Configura:
   - **Build Command:**
     ```bash
     npm install
     ```
   - **Start Command:**
     ```bash
     node src/server.js
     ```
5. Elige la región más cercana a tus usuarios
6. Haz clic en "Create Web Service"

> ⚠️ No olvides seleccionar la carpeta `backend` para el servicio.

---

## 7. Configurar variables de entorno en Render

En la sección "Environment" de tu servicio backend, agrega las siguientes variables:

- `PORT`
- `NODE_ENV`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRE`
- `JWT_COOKIE_EXPIRE`
- `BCRYPT_ROUNDS`
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `FRONTEND_URL`
- `ALLOWED_ORIGINS`
- `EMAIL_HOST`

> ⚠️ Copia los valores desde tu archivo `.env` local, pero **nunca** subas `.env` al repo.

---

## 8. Desplegar el frontend

1. Haz clic en "New Static Site"
2. Selecciona el mismo repositorio
3. En "Root Directory", escribe `frontend`
4. Render detectará automáticamente los archivos estáticos
5. Haz clic en "Create Static Site"

> ⚠️ El frontend no requiere comandos de build, solo archivos estáticos.

---

## 9. Realizar el deploy

- Render ejecutará el build automáticamente
- Puedes ver los logs en la interfaz
- Cuando el deploy termine, Render mostrará la URL pública

> ⚠️ Si hay errores, revisa los logs y verifica variables de entorno.

---

## 10. Verificar funcionamiento

- Accede a la URL del backend y prueba los endpoints (por ejemplo: `/api/health`)
- Accede a la URL del frontend y verifica la carga
- Revisa la conexión con MongoDB Atlas
- Prueba autenticación y servicios externos (Stripe, Firebase, OpenAI)

---

## 11. Actualizar la aplicación

Cada vez que hagas un `git push` a GitHub, Render detectará el cambio y hará un redeploy automático.

> ⚠️ Si cambias variables de entorno, actualízalas en Render manualmente.

---

## Checklist final de deploy

- [ ] Node.js instalado
- [ ] Cuenta en GitHub, MongoDB Atlas y Render
- [ ] Repo creado en GitHub
- [ ] Proyecto subido a GitHub
- [ ] `.env` y archivos sensibles excluidos
- [ ] Servicio backend creado en Render (carpeta backend)
- [ ] Variables de entorno configuradas en Render
- [ ] Servicio frontend creado en Render (carpeta frontend)
- [ ] Deploy realizado y verificado
- [ ] Actualizaciones automáticas funcionando

---

> Sigue esta guía paso a paso para desplegar tu proyecto completo en Render sin errores. Si tienes dudas, revisa la documentación en la carpeta docs o consulta la ayuda oficial de Render.