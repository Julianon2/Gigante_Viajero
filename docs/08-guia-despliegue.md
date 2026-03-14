# Guía de Despliegue

## Tabla de Contenidos
1. [Preparación del Proyecto](#preparación-del-proyecto)
2. [Instalación de Dependencias](#instalación-de-dependencias)
3. [Variables de Entorno](#variables-de-entorno)
4. [Build del Proyecto](#build-del-proyecto)
5. [Pruebas](#pruebas)
6. [Configuración del Hosting](#configuración-del-hosting)
7. [Despliegue](#despliegue)
8. [Validación](#validación)
9. [Monitoreo](#monitoreo)
10. [Mejoras Posteriores](#mejoras-posteriores)

---

## 1. Preparación del Proyecto
- Clonar el repositorio
- Revisar estructura y archivos

## 2. Instalación de Dependencias
```bash
cd backend
npm install
```

## 3. Variables de Entorno
- Crear archivo `.env` (no versionar)
- Configurar variables según `docs/environment-variables.md`

## 4. Build del Proyecto
- No requiere build, es Node.js puro
- Para frontend, solo archivos estáticos

## 5. Pruebas
- Implementar y ejecutar tests (si existen)
```bash
npm test
```

## 6. Configuración del Hosting
- Crear cuenta en Render o Railway
- Configurar servicio backend (Node.js)
- Configurar servicio frontend (estático)
- Definir variables de entorno en el panel

## 7. Despliegue
- Subir código a GitHub
- Conectar repo a Render/Railway
- Deploy automático

## 8. Validación
- Acceder a endpoints y frontend
- Validar funcionamiento y logs

## 9. Monitoreo
- Configurar alertas/logs en Render/Railway
- Revisar logs de winston/morgan

## 10. Mejoras Posteriores
- Implementar tests automatizados
- Mejorar seguridad de variables
- Documentar endpoints
- Separar entornos dev/prod

---

> Este plan se basa en la estructura y necesidades reales del proyecto.
