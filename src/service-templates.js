import {SERVICE_OPTIONS,updateDraft} from './engine.js';
const known=new Set(SERVICE_OPTIONS.map(([id])=>id));
export const SERVICE_PRESETS=Object.freeze([
  {id:'mantenimiento',title:'Mantenimiento del hogar',description:'Limpieza, ropa y organización doméstica',services:['limpieza','ropa','orden']},
  {id:'cocina',title:'Cocina y compras',description:'Preparación de comidas y recados',services:['cocina','compras']},
  {id:'acompanamiento',title:'Acompañamiento no sanitario',description:'Acompañamiento y apoyo personal no sanitario',services:['acompanamiento','apoyo']},
  {id:'mixto',title:'Apoyo doméstico general',description:'Selección inicial de tareas frecuentes',services:['limpieza','cocina','ropa','compras']}
]);
export function createServiceTemplate(title,services){
  if(typeof title!=='string'||!title.trim()||title.trim().length>80)throw Error('El título debe contener entre 1 y 80 caracteres.');
  if(!Array.isArray(services)||services.length<1||services.length>known.size||services.some(s=>typeof s!=='string'||!known.has(s)))throw Error('Lista de servicios inválida.');
  return {format:'assistcontract-services',schemaVersion:1,title:title.trim(),services:[...new Set(services)]};
}
export function parseServiceTemplate(raw){
  if(!raw||typeof raw!=='object'||Array.isArray(raw)||raw.format!=='assistcontract-services'||raw.schemaVersion!==1)throw Error('Formato de plantilla incompatible.');
  return createServiceTemplate(raw.title,raw.services);
}
export function applyServiceTemplate(draft,template){return updateDraft(draft,'services',parseServiceTemplate(template).services);}
