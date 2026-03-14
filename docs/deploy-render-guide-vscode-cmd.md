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

## 3. Conectar proyecto local con GitHub usando CMD

Abre la terminal CMD de Visual Studio Code en la raíz del proyecto y ejecuta:

```
git init
```
Inicializa el repositorio local.

```
git add .
```
Agrega todos los archivos al staging.

```
git commit -m "primer commit"
```
Crea el primer commit.

```
git branch -M main
```
Establece la rama principal como `main`.

```
git remote add origin URL_REPOSITORIO
```
Vincula tu repo local con el repo de GitHub. Reemplaza `URL_REPOSITORIO` por la URL de tu repo.

```
git push -u origin main
```
Sube el proyecto a GitHub.

---

## El resto de la guía es igual al archivo principal, solo cambia la terminal utilizada.

> Todos los comandos funcionan igual en CMD de Visual Studio Code. Si tienes problemas con permisos, ejecuta Visual Studio Code como administrador.
