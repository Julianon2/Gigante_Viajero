# Riesgos Técnicos

## Tabla de Contenidos
1. [Problemas de Seguridad](#problemas-de-seguridad)
2. [Dependencias Desactualizadas](#dependencias-desactualizadas)
3. [Malas Prácticas](#malas-prácticas)
4. [Archivos Sensibles Versionados](#archivos-sensibles-versionados)
5. [Configuraciones Incorrectas](#configuraciones-incorrectas)
6. [Problemas de Despliegue](#problemas-de-despliegue)
7. [Deuda Técnica](#deuda-técnica)

---

## Problemas de Seguridad
- Variables sensibles (claves, contraseñas, API keys) expuestas en `.env` y posiblemente versionadas.
- Clave JWT y credenciales MongoDB hardcodeadas en `.env`.
- Clave de servicio Firebase (`serviceAccountKey.json`) presente en el repo.
- Falta de archivo `.env.example` para despliegue seguro.

---

## Dependencias Desactualizadas
- Algunas dependencias pueden estar desactualizadas, pero no se detectan vulnerabilidades graves en el lockfile.

---

## Malas Prácticas
- Contraseñas y claves en `.env` sin rotación ni protección.
- Falta de tests automatizados (script de test no implementado).
- No se detecta CI/CD.

---

## Archivos Sensibles Versionados
- `.env` y `serviceAccountKey.json` están presentes en el repo.
- Recomendado agregar a `.gitignore` y usar variables de entorno seguras.

---

## Configuraciones Incorrectas
- No se detecta configuración de Docker ni CI/CD.
- Falta de separación de entornos (dev/prod).

---

## Problemas de Despliegue
- Variables sensibles expuestas dificultan despliegue seguro.
- Falta de scripts de build/test robustos.

---

## Deuda Técnica
- Falta de documentación de despliegue.
- Falta de tests.
- Falta de ejemplo de variables de entorno.

---

> Los riesgos han sido detectados en base a los archivos reales del proyecto.
