# AssistContract

Plataforma web para la elaboración guiada de **borradores orientativos** de acuerdos de asistencia personal, servicios domésticos y colaboraciones profesionales, con un formulario modular y contextual.

**Autor del proyecto:** Alejandro Hernández Castillo.

## Funcionalidad MVP

- Asistente de ocho etapas y diseño adaptable para móviles.
- Clasificación inicial entre empleo doméstico y prestación verdaderamente autónoma.
- Selección inteligente de actividades, comprobación básica de campos y resumen.
- Exportación local de borrador `.txt`, `.html` y `.json` sin almacenar datos personales en un servidor.
- Interfaz en español, sin rastreadores ni claves de API.

## Ejecutar

```bash
npm install
npm run dev
```

## Compilar

```bash
npm run build
```

El sitio compilado se encuentra en `dist/` y puede publicarse como aplicación estática. No existe backend ni autenticación en este MVP.

## Próximas fases

1. Motor de reglas jurídicas versionado, jurisdicciones y alertas de incompatibilidad.
2. Catálogo validado de cláusulas y exportación PDF/DOCX.
3. Revisión humana antes de firma; integración de proveedor de firma electrónica.
4. Backend con autenticación, control de acceso, cifrado, registros de auditoría y política de retención.
5. Pruebas automatizadas adicionales (accesibilidad, E2E, seguridad) y revisión jurídica profesional.

## Importante

La contratación laboral del hogar, la asistencia personal y los servicios autónomos tienen requisitos diferentes. El tipo de contrato lo determinan las circunstancias reales. Este MVP no genera contratos jurídicamente completos y no sustituye asesoramiento profesional. Ninguna cláusula debe suprimir derechos laborales, justificar coacción, retención de documentos o limitaciones de libertad.

## Licencia

Todos los derechos reservados por ahora. No se otorga licencia de explotación ni de redistribución del código sin autorización escrita del titular de derechos. Un repositorio público permite examinar su código, pero no implica que sea software de código abierto.

## Indicadores de calidad estructural

`qualityReport(data)` informa sobre campos incompletos, coherencia básica, fechas y alertas trazables. **No certifica validez legal**. `compareDrafts(left,right)` permite comparar datos normalizados y `importDraft` admite migración limitada del esquema v1 al actual, descartando campos no reconocidos. El motor sigue siendo local y no envía datos de expedientes a servidores.

## Automatización

Los cambios se proponen por pull request. CI debe superar `npm run verify`; las fusiones automáticas están limitadas a mantenimiento autorizado y sujetas a las reglas de la rama principal. El despliegue de GitHub Pages se inicia tras cambios en `main`, con verificación independiente necesaria para confirmar disponibilidad pública.

## Copias portátiles cifradas

En la revisión final puede exportarse `.acenc` con cifrado AES-GCM y contraseña de al menos doce caracteres. Se reimporta mediante «Importar expediente» sin enviar documentos a servidores. El JSON estándar sigue siendo texto sin cifrar: debe manejarse como dato personal sensible. Si se pierde la contraseña de `.acenc`, no existe mecanismo de recuperación. La importación reemplaza el expediente actual solo tras confirmación.

## Catálogo de plantillas y comparación local (3.2)

El editor de servicios ofrece cuatro plantillas de tareas **orientativas, no jurídicas**, reutilizables mediante archivos JSON con formato `assistcontract-services`. La importación solo admite servicios del catálogo, con esquema versionado; no admite expresiones ni código ejecutable. Durante la revisión es posible comparar dos borradores JSON de forma local. La comparación puede exponer datos personales en pantalla, pero no los transmite a servidores.

## Calidad estructural y privacidad (3.3)
La completitud solo incluye campos obligatorios con valores estructuralmente válidos. Las modificaciones de campos condicionales conservan los valores independientes antes de limpiar los campos ya no aplicables. Las exportaciones HTML, TXT y JSON requieren advertencia explícita por su contenido en claro. El nuevo **Informe técnico** contiene exclusivamente indicadores estructurales, campos que faltan y códigos genéricos de alertas; no contiene identificadores, nombres ni direcciones. No equivale a un dictamen legal ni a una evaluación de cumplimiento normativo.

## Servidor local y verificación de publicación (3.4)

`npm run dev` genera `dist/` y sirve únicamente los archivos compilados en `http://127.0.0.1:4173/` con Node.js, sin instalar dependencias externas. No dispone de recarga automática: reiniciar para reconstruir. `npm run verify` incluye ahora comprobaciones estructurales de referencias HTML, imports JS, manifest, Service Worker e iconos. El flujo de Pages verifica después de desplegar que la web pública entrega `index.html` y el módulo JS más reciente; un deploy no se declara exitoso si esta comprobación falla. Ver `docs/qa-matrix.md` para la matriz de pruebas manuales aún pendientes.
