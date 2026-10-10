# Matriz de QA de AssistContract

Esta lista define comprobaciones **pendientes de ejecución manual en dispositivos reales**. No significa que se hayan realizado.

## Navegadores y pantallas
- Safari en iOS, orientación vertical y horizontal, teclado virtual y áreas seguras.
- Chrome en Android, tamaño de letra aumentado, PWA instalada y modo offline.
- Edge y Chrome en Windows, zoom 200 %, navegación con Tab y teclado.
- Safari de macOS y Firefox de escritorio, al menos una revisión de compatibilidad.

## Flujo funcional
- Completar las ocho etapas; volver y avanzar sin perder datos.
- Rellenar nombre, correo y dirección con autocompletado del navegador.
- Activar y desactivar alojamiento, retribución en especie y otras tareas: no deben reaparecer datos ocultos.
- Importar un JSON anterior y comparar borradores; rechazar archivos incompatibles.
- Guardar, exportar, importar y eliminar una copia cifrada, probando contraseñas correctas e incorrectas.
- Exportar HTML, TXT y JSON: comprobar advertencias por datos sin cifrar.
- Imprimir a PDF sin ocultar contenido documental.
- Instalar la PWA, abrirla sin red y actualizarla al recuperar conexión.

## Accesibilidad y seguridad
- Revisión manual de contraste y foco visible, lectura de errores con lector de pantalla.
- Ningún expediente se transmite a servidores propios o de terceros.
- Confirmar que los archivos .acenc no contienen datos personales legibles.
- Confirmar que el informe técnico no incluye nombres ni direcciones.
- Verificar que no se acepta una clasificación contractual automática sin advertencias.

## Producción y reversión
- Comprobar CI, validación estática del directorio dist y smoke test HTTP de Pages.
- Para revertir, generar un PR de reversión del commit defectuoso contra main, ejecutar CI y dejar que Pages publique el nuevo main. No sobrescribir main ni omitir reglas de protección.
