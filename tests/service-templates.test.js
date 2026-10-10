import {test} from 'node:test';
import assert from 'node:assert/strict';
import {SERVICE_PRESETS,createServiceTemplate,parseServiceTemplate,applyServiceTemplate} from '../src/service-templates.js';
import {newDraft} from '../src/engine.js';
test('plantillas integradas contienen servicios válidos',()=>{for(const p of SERVICE_PRESETS)assert.deepEqual(parseServiceTemplate(createServiceTemplate(p.title,p.services)).services,p.services);});
test('plantilla de servicios conserva opciones únicas',()=>assert.deepEqual(createServiceTemplate('Mi lista',['limpieza','limpieza','ropa']).services,['limpieza','ropa']));
test('plantillas no pueden inyectar servicios arbitrarios',()=>assert.throws(()=>createServiceTemplate('Invalida',['no_existe'])));
test('importación de plantilla rechaza versiones desconocidas',()=>assert.throws(()=>parseServiceTemplate({format:'assistcontract-services',schemaVersion:99,title:'a',services:['limpieza']})));
test('aplicación de plantilla solo cambia servicios',()=>{const d=newDraft();const before=d.data.mode;const next=applyServiceTemplate(d,createServiceTemplate('Mi lista',['ropa']));assert.equal(next.data.mode,before);assert.deepEqual(next.data.services,['ropa']);assert.deepEqual(d.data.services,[]);});
