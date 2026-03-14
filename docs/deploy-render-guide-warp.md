# Deploy completo del proyecto en Render (Terminal Warp)

## Tabla de Contenidos
1. [Requisitos previos](#1-requisitos-previos)
2. [Crear repositorio en GitHub](#2-crear-repositorio-en-github)
3. [Conectar proyecto local con GitHub usando Warp](#3-conectar-proyecto-local-con-github-usando-warp)
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

## 3. Conectar proyecto local con GitHub usando Warp

Abre la terminal Warp en la raíz del proyecto y ejecuta:

```bash
git init
git add .
git commit -m "primer commit"
git branch -M main
git remote add origin URL_REPOSITORIO
git push -u origin main
```

> Warp soporta comandos estándar de git y bash. Si usas Warp en Windows, asegúrate de tener Git instalado y configurado en tu PATH.

---

## El resto de la guía es igual al archivo principal, solo cambia la terminal utilizada.

> Todos los comandos funcionan igual en Warp. Si tienes problemas con permisos, revisa la configuración de Git y Warp.
