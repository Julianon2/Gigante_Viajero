# 09-preparacion-despliegue.md

## Tabla de Contenidos
1. [Objetivo](#objetivo)
2. [Resumen de Acciones](#resumen-de-acciones)
3. [Checklist de Preparación](#checklist-de-preparación)
4. [Acciones Propuestas](#acciones-propuestas)
5. [Buenas Prácticas](#buenas-prácticas)

---

## Objetivo

Preparar el proyecto "Gigante Viajero" para un despliegue seguro, eficiente y profesional en plataformas como Render o Railway, siguiendo las mejores prácticas detectadas en el análisis técnico.

---

## Resumen de Acciones

- Revisión y ajuste de archivos sensibles
- Configuración de variables de entorno
- Mejora de seguridad y exclusión de archivos
- Documentación de ejemplo de variables
- Revisión de scripts y dependencias
- Separación de entornos (dev/prod)
- Preparación para despliegue automático

---

## Checklist de Preparación

- [ ] Eliminar o excluir archivos sensibles del repo (.env, serviceAccountKey.json)
- [ ] Crear `.env.example` con variables necesarias
- [ ] Revisar y mejorar `.gitignore`
- [ ] Documentar variables de entorno en el README
- [ ] Revisar scripts de npm (start, dev, test)
- [ ] Validar dependencias y actualizar si es necesario
- [ ] Separar configuración de entornos (dev/prod)
- [ ] Preparar frontend para despliegue estático
- [ ] Validar endpoints y rutas
- [ ] Documentar pasos de despliegue

---

## Acciones Propuestas

1. **Crear archivo `.env.example`**
   - Incluir todas las variables necesarias, sin valores sensibles.
2. **Actualizar `.gitignore`**
   - Asegurar exclusión de `.env`, `serviceAccountKey.json`, `logs/`, `uploads/`.
3. **Eliminar archivos sensibles del repo**
   - Borrar `.env` y `serviceAccountKey.json` del control de versiones.
4. **Revisar scripts de npm**
   - Validar que `start`, `dev` y `test` funcionen correctamente.
5. **Actualizar dependencias**
   - Revisar y actualizar dependencias críticas.
6. **Separar entornos**
   - Configurar variables para dev y prod.
7. **Preparar frontend**
   - Validar estructura para despliegue estático.
8. **Documentar variables y pasos**
   - Añadir documentación en README y docs.

---

## Buenas Prácticas

- Nunca versionar archivos sensibles.
- Usar variables de entorno seguras.
- Documentar todo el proceso.
- Validar funcionamiento antes de desplegar.

---

> Este documento es la propuesta de preparación previa al despliegue. Espera tu autorización para ejecutar los ajustes.
