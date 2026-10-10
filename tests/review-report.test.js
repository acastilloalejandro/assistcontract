import {test} from 'node:test';
import assert from 'node:assert/strict';
import {reviewReport,reviewReportJSON} from '../src/review-report.js';
import {newDraft,qualityReport,completeness,updateDraft} from '../src/engine.js';
test('informe estructural nunca contiene datos personales del expediente',()=>{
 const draft=newDraft();draft.data.employer='PERSONA_SECRETA_123';draft.data.worker='PERSONA_SECRETA_456';draft.data.workplace='DIRECCION_PRIVADA_789';draft.data.employerEmail='privado@example.com';
 const plain=reviewReportJSON(draft.data);
 for(const value of ['PERSONA_SECRETA_123','PERSONA_SECRETA_456','DIRECCION_PRIVADA_789','privado@example.com'])assert.ok(!plain.includes(value));
 assert.equal(JSON.parse(plain).legalAssessment,'NOT_PERFORMED');
});
test('diagnóstico estructural no afirma validación jurídica',()=>{const result=reviewReport(newDraft().data);assert.equal(result.professionalReviewRequired,true);assert.ok(result.advisory.includes('no verifica'));});
test('datos extra en memoria generan aviso estructural',()=>{const d=newDraft().data;assert.equal(qualityReport({...d,shadowKey:'una prueba'}).checks.knownFieldsOnly,false);});
test('progreso no cuenta campos obligatorios con errores',()=>{let d=newDraft();d=updateDraft(d,'weeklyHours','168');const n=completeness(d.data);assert.ok(n<100);const errors=qualityReport(d.data).issues;assert.ok(errors.some(e=>e.field==='weeklyHours'));});
test('informe de revisión omite historial y datos en bruto',()=>{const result=reviewReport(newDraft().data);assert.equal(Object.hasOwn(result,'history'),false);assert.equal(Object.hasOwn(result,'data'),false);});
