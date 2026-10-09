# AssistContract

Plataforma web para la elaboración guiada de **borradores orientativos** de acuerdos de asistencia personal, servicios domésticos y colaboraciones profesionales, con un formulario modular y contextual.

**Autor del proyecto:** Alejandro Hernández Castillo.

## Funcionalidad MVP

- Asistente de cinco etapas y diseño adaptable para móviles.
- Clasificación inicial entre empleo doméstico y prestación verdaderamente autónoma.
- Selección inteligente de actividades, comprobación básica de campos y resumen.
- Exportación local de borrador `.txt` sin almacenar datos personales en un servidor.
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
5. Tests automatizados (unitarios, accesibilidad, E2E, seguridad) y revisión jurídica profesional.

## Importante

La contratación laboral del hogar, la asistencia personal y los servicios autónomos tienen requisitos diferentes. El tipo de contrato lo determinan las circunstancias reales. Este MVP no genera contratos jurídicamente completos y no sustituye asesoramiento profesional. Ninguna cláusula debe suprimir derechos laborales, justificar coacción, retención de documentos o limitaciones de libertad.

## Licencia

Todos los derechos reservados por ahora. No se otorga licencia de explotación ni de redistribución del código sin autorización escrita del titular de derechos. Un repositorio público permite examinar su código, pero no implica que sea software de código abierto.
