import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newDraft,normalize,updateDraft,validateStep,validateAll,evaluateRules,completeness,importDraft,visibleFields,SCHEMA,qualityReport,compareDrafts} from '../src/engine.js';
import {asJSON,asHTML,asText,renderDocument} from '../src/documents.js';
function valid(){const x=newDraft();Object.assign(x.data,{employer:'Ana',worker:'Luis',city:'Barcelona',services:['limpieza'],weeklyHours:'30',startDate:'2026-10-10',schedule:'Lunes a viernes',rest:'Sábado y domingo',grossPay:'1300',payPeriod:'mes',payment:'Transferencia',workplace:'Barcelona'});return x;}
test('inicialización aislada',()=>{const a=newDraft(),b=newDraft();a.data.services.push('ropa');assert.deepEqual(b.data.services,[]);assert.equal(a.version,1);});
test('rechaza campos no autorizados',()=>assert.throws(()=>normalize('__proto__','x')));
test('ediciones inmutables y versionado',()=>{const a=valid(),b=updateDraft(a,'employer','María');assert.equal(a.data.employer,'Ana');assert.equal(b.version,a.version+1);});
test('listas depuradas contra opciones no válidas',()=>assert.deepEqual(normalize('services',['limpieza','invalido','limpieza']),['limpieza']));
test('identidad incompleta detectada',()=>assert.ok(validateStep(newDraft().data,1).employer));
test('otros servicios habilita subcampo',()=>{const v=valid().data;v.services=['otro'];assert.ok(visibleFields(2,v).some(f=>f.key==='otherService'));});
test('no se exige subcampo cuando no aplica',()=>{const v=valid().data;assert.ok(!visibleFields(2,v).some(f=>f.key==='otherService'));});
test('fecha imposible rechazada',()=>assert.ok(validateStep({...valid().data,startDate:'2026-02-30'},3).startDate));
test('fin anterior a inicio rechazado',()=>assert.ok(validateStep({...valid().data,endDate:'2026-01-01'},3).endDate));
test('jornada fuera de rango rechazada',()=>assert.ok(validateStep({...valid().data,weeklyHours:'170'},3).weeklyHours));
test('jornada hogar mayor de 40 genera alerta',()=>assert.ok(evaluateRules({...valid().data,weeklyHours:'45'}).some(r=>r.code==='WORKING_TIME')));
test('presencia elevada produce revisión',()=>assert.ok(evaluateRules({...valid().data,presenceHours:'21'}).some(r=>r.code==='PRESENCE')));
test('falsa autonomía produce alerta',()=>assert.ok(evaluateRules({...valid().data,mode:'autonomo',direction:'si'}).some(r=>r.code==='CLASSIFICATION')));
test('jurisdicción fuera de alcance bloqueada',()=>assert.ok(validateStep({...valid().data,jurisdiction:'FR'},0).jurisdiction));
test('cláusulas abiertamente coactivas se bloquean',()=>assert.ok(validateStep({...valid().data,additional:'retener pasaporte'},6).additional));
test('documento con datos básicos supera validación estructural',()=>assert.deepEqual(validateAll(valid().data),[]));
test('progreso de datos entre 0 y 100',()=>assert.ok(completeness(valid().data)<=100));
test('importación elimina datos fuera de catálogo',()=>{const d=importDraft({data:{worker:'A',debug:'secreto'}});assert.equal(d.data.debug,undefined);});
test('exportación fuerza estado borrador',()=>{const d=valid();d.status='firmado';assert.equal(JSON.parse(asJSON(d)).status,'borrador');});
test('exportación TXT incluye advertencia explícita',()=>assert.match(asText(valid()),/NO FIRMABLE/));
test('exportación HTML neutraliza XSS',()=>{const d=valid();d.data.worker='<img src=x onerror=alert(1)>';assert.ok(asHTML(d).includes('&lt;img'));assert.ok(!renderDocument(d).includes('<img src=x'));});
test('esquema completo cuenta con ocho etapas',()=>assert.equal(SCHEMA.length,8));

test('importe con más de dos decimales se rechaza',()=>assert.ok(validateStep({...valid().data,grossPay:'1300.001'},4).grossPay));
test('horas deben seguir incrementos de media hora',()=>assert.ok(validateStep({...valid().data,weeklyHours:'30.3'},3).weeklyHours));
test('jornada ordinaria del hogar superior a 40 se rechaza',()=>assert.ok(validateStep({...valid().data,weeklyHours:'41'},3).weeklyHours));
test('cambio de servicios limpia descripción no aplicable',()=>{let d=valid();d=updateDraft(d,'services',['otro']);d=updateDraft(d,'otherService','Tarea');d=updateDraft(d,'services',['limpieza']);assert.equal(d.data.otherService,'');});
test('importación elimina datos de alojamiento si no aplica',()=>{const d=importDraft({data:{mode:'autonomo',accommodation:'si',housing:'Texto privado'}});assert.equal(d.data.housing,'');});

test('autocompletado mantiene campos independientes por parte',()=>{const d=updateDraft(updateDraft(valid(),'employerEmail','empleador@example.es'),'workerEmail','trabajador@example.es');assert.equal(d.data.employerEmail,'empleador@example.es');assert.equal(d.data.workerEmail,'trabajador@example.es');});
test('no se altera modalidad cuando se actualiza nombre',()=>{const d=updateDraft(valid(),'employer','Nuevo nombre');assert.equal(d.data.mode,'hogar');});

test('límite de longitud de campos importados se respeta',()=>{const d=importDraft({data:{employer:'X'.repeat(200)}});assert.equal(d.data.employer.length,140);});
test('datos de servicios condicionales se eliminan al importar',()=>{const d=importDraft({data:{services:['limpieza'],otherService:'No debe persistir'}});assert.equal(d.data.otherService,'');});

test('informe de calidad no confunde completitud con revisión legal',()=>{const x=valid().data;const r=qualityReport(x);assert.equal(r.issues.length,0);assert.equal(r.needsProfessionalReview,true);});
test('comparador de borradores identifica únicamente los cambios',()=>{const a=valid(),b=updateDraft(a,'city','Madrid');const diff=compareDrafts(a,b);assert.deepEqual(diff.map(d=>d.field),['city']);});
test('migración de esquema previo elimina datos externos',()=>{const d=importDraft({schemaVersion:1,data:{employer:'Ana',secreto:'no autorizado'}});assert.equal(d.data.employer,'Ana');assert.equal(d.data.secreto,undefined);});
test('formatos futuros desconocidos se rechazan',()=>assert.throws(()=>importDraft({schemaVersion:999,data:{}})));
