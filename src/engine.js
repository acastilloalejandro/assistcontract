/** AssistContract 2.0 - declarative fields, immutable state and explainable warnings. */
export const SOURCES = Object.freeze({
  hogar: 'https://www.boe.es/eli/es/rd/2011/11/14/1620/con',
  riesgos: 'https://www.boe.es/eli/es/rd/2024/09/10/893/con',
  datos: 'https://www.aepd.es/derechos-y-deberes/cumple-tus-deberes/medidas-de-cumplimiento/proteccion-de-datos-por-defecto',
  et: 'https://www.boe.es/buscar/act.php?id=BOE-A-2015-11430'
});
const options = (...pairs) => pairs.map(([value,label])=>({value,label}));
const yesNo = options(['no','No'],['si','Sí']);
export const SERVICE_OPTIONS = [
  ['limpieza','Limpieza y mantenimiento'],['cocina','Preparación de comidas'],
  ['ropa','Lavado y planchado'],['orden','Organización del hogar'],
  ['compras','Compras y recados'],['acompanamiento','Acompañamiento'],
  ['apoyo','Apoyo personal no sanitario'],['mascotas','Atención ordinaria de mascotas'],
  ['otro','Otras actividades']
];
const f = (key,label,type='text',extra={}) => ({key,label,type,...extra});
export const SCHEMA = [
  {id:'modalidad',title:'Naturaleza jurídica',subtitle:'La modalidad se determina por las circunstancias reales, no por el título del documento.',fields:[
    f('jurisdiction','Jurisdicción','select',{required:true,options:options(['ES','España'])}),
    f('mode','Modalidad declarada','radio',{required:true,options:options(['hogar','Empleo del hogar familiar'],['autonomo','Servicios autónomos (revisión específica)'])}),
    f('direction','¿El empleador dirige cómo y cuándo trabajar?','radio',{required:true,options:options(['si','Sí'],['no','No'],['incierto','No está claro'])}),
    f('ownMeans','¿La persona prestadora utiliza sus propios medios y organización?','radio',{required:true,options:options(['si','Sí'],['no','No'],['incierto','No está claro'])}),
  ]},
  {id:'partes',title:'Identificación de las partes',subtitle:'Introduce solo los datos necesarios. No existe envío a servidores.',fields:[
    f('employer','Nombre del empleador o cliente','text',{required:true,max:140}),
    f('employerId','NIF/NIE del empleador (opcional hasta la firma)','text',{max:20}),
    f('employerEmail','Correo del empleador','email',{max:160}),
    f('worker','Nombre de la persona trabajadora o prestadora','text',{required:true,max:140}),
    f('workerId','NIF/NIE de la persona prestadora (opcional)','text',{max:20}),
    f('workerEmail','Correo de la persona prestadora','email',{max:160}),
    f('city','Municipio','text',{required:true,max:120}),
    f('province','Provincia','text',{max:120}),
  ]},
  {id:'servicios',title:'Servicios y funciones',subtitle:'Selecciona funciones concretas y describe los límites del encargo.',fields:[
    f('services','Servicios incluidos','multi',{required:true,options:SERVICE_OPTIONS.map(([value,label])=>({value,label}))}),
    f('otherService','Descripción de otras tareas','textarea',{required:true,max:700,when:d=>d.services.includes('otro')}),
    f('scope','Alcance y responsabilidades','textarea',{max:1000}),
    f('exclusions','Tareas expresamente excluidas','textarea',{max:700}),
  ]},
  {id:'tiempo',title:'Vigencia y jornada',subtitle:'Diferencia el trabajo efectivo de los tiempos de presencia.',fields:[
    f('startDate','Fecha de inicio','date',{required:true}),
    f('endDate','Fecha final prevista (si procede)','date'),
    f('weeklyHours','Horas semanales de trabajo efectivo','number',{required:true,min:0.5,max:168,step:0.5}),
    f('schedule','Distribución del horario','textarea',{required:true,max:700}),
    f('presenceHours','Horas semanales de presencia pactadas','number',{min:0,max:168,step:0.5,when:d=>d.mode==='hogar'}),
    f('rest','Descanso diario y semanal','textarea',{required:true,max:700}),
  ]},
  {id:'economia',title:'Retribución y pagos',subtitle:'Importes declarados: es imprescindible verificar los mínimos legales vigentes.',fields:[
    f('grossPay','Retribución bruta (€)','number',{required:true,min:0.01,step:0.01}),
    f('payPeriod','Periodicidad','select',{required:true,options:options(['mes','Mensual'],['hora','Por hora'])}),
    f('extras','Pagas extraordinarias y complementos','textarea',{max:600}),
    f('payment','Fecha y medio de pago','text',{required:true,max:160}),
    f('inKind','¿Existe retribución en especie?','radio',{options:yesNo,when:d=>d.mode==='hogar'}),
    f('inKindDetails','Valoración y condiciones (pendiente de revisión)','textarea',{max:500,when:d=>d.mode==='hogar'&&d.inKind==='si'}),
  ]},
  {id:'condiciones',title:'Condiciones adicionales',subtitle:'Registra pactos proporcionados que respeten la libertad y los derechos de ambas partes.',fields:[
    f('workplace','Lugar de prestación','text',{required:true,max:180}),
    f('accommodation','¿Existe alojamiento asociado?','radio',{options:yesNo,when:d=>d.mode==='hogar'}),
    f('housing','Características y acceso al alojamiento','textarea',{required:true,max:700,when:d=>d.mode==='hogar'&&d.accommodation==='si'}),
    f('overnight','¿Se pactan pernoctas?','radio',{options:yesNo,when:d=>d.mode==='hogar'&&d.accommodation==='si'}),
    f('equipment','Medios y material proporcionado','textarea',{max:600}),
    f('prevention','Medidas de prevención y seguridad','textarea',{max:600}),
    f('confidentiality','Confidencialidad proporcionada','textarea',{max:600}),
  ]},
  {id:'clausulas',title:'Cláusulas particulares',subtitle:'Estas notas no sustituyen cláusulas revisadas por especialistas.',fields:[
    f('trial','Periodo de prueba propuesto, si procede','text',{max:150}),
    f('termination','Finalización, avisos y procedimiento','textarea',{max:750}),
    f('additional','Cláusulas adicionales propuestas','textarea',{max:1200}),
    f('observations','Observaciones de revisión jurídica','textarea',{max:800}),
  ]},
  {id:'revision',title:'Revisión y exportación',subtitle:'El resultado es un borrador informativo no apto para firma.',fields:[]}
];
export const FIELD_MAP = Object.fromEntries(SCHEMA.flatMap(step=>step.fields).map(field=>[field.key,field]));
export const DEFAULT = Object.fromEntries(Object.keys(FIELD_MAP).map(key=>[key,key==='services'?[]:'']));
Object.assign(DEFAULT,{jurisdiction:'ES',mode:'hogar',direction:'si',ownMeans:'no',payPeriod:'mes',inKind:'no',accommodation:'no',overnight:'no'});
export function newDraft() {
  const id = globalThis.crypto?.randomUUID?.() || `ac-${Date.now().toString(36)}`;
  return {schemaVersion:2,id,status:'borrador',version:1,updatedAt:new Date().toISOString(),data:{...DEFAULT,services:[]},history:[]};
}
export function normalize(key,raw) {
  if(!Object.hasOwn(FIELD_MAP,key))throw Error('Campo no admitido');const field=FIELD_MAP[key];
  if(field.type==='multi'){
    const allowed=new Set(field.options.map(o=>o.value));
    return [...new Set((Array.isArray(raw)?raw:[]).filter(x=>typeof x==='string'&&allowed.has(x)))];
  }
  const value=String(raw??'').replace(/[\u0000-\u001f\u007f]/g,' ').slice(0,field.max||180);
  if(field.type==='select'||field.type==='radio') return field.options.some(o=>o.value===value)?value:'';
  return value;
}
export function updateDraft(draft,key,value){
  const data={...draft.data,[key]:normalize(key,value)};
  if(key==='services'&&!data.services.includes('otro'))data.otherService='';
  if(key==='inKind'&&data.inKind!=='si')data.inKindDetails='';
  if(key==='accommodation'&&data.accommodation!=='si'){data.housing='';data.overnight='no';}
  if(key==='mode'&&data.mode!=='hogar'){data.presenceHours='';data.inKind='no';data.inKindDetails='';data.accommodation='no';data.housing='';data.overnight='no';}
  return {...draft,data,status:'borrador',version:draft.version+1,updatedAt:new Date().toISOString(),history:[...draft.history.slice(-29),{key,version:draft.version+1,at:new Date().toISOString()}]};
}
const blank=v=>Array.isArray(v)?v.length===0:String(v??'').trim()==='';
function dateValid(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const d=new Date(s+'T12:00:00Z');return !isNaN(d.getTime())&&d.toISOString().slice(0,10)===s;}
export function visibleFields(stepIndex,data){return SCHEMA[stepIndex]?.fields.filter(field=>!field.when||field.when(data))||[];}
export function validateStep(data,stepIndex){
  const errors={};
  for(const field of visibleFields(stepIndex,data)){
    const value=data[field.key];
    if(field.required&&blank(value)){errors[field.key]='Este campo es obligatorio.';continue;}
    if(blank(value))continue;
    if(field.type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))errors[field.key]='Correo electrónico no válido.';
    if(field.type==='number'&&(!Number.isFinite(Number(value))||(field.min!==undefined&&Number(value)<field.min)||(field.max!==undefined&&Number(value)>field.max)||(field.step!==undefined&&Math.abs((Number(value)-(field.min??0))/field.step-Math.round((Number(value)-(field.min??0))/field.step))>1e-7)))errors[field.key]='Importe, horas o incremento fuera de rango.';
    if(field.max&&String(value).length>field.max)errors[field.key]='Se ha superado la longitud máxima.';
    if(field.type==='date'&&!dateValid(value))errors[field.key]='Fecha no válida.';
    if(['radio','select'].includes(field.type)&&!field.options.some(o=>o.value===value))errors[field.key]='Selecciona una opción válida.';
    if(field.type==='multi'&&(!Array.isArray(value)||value.some(v=>!field.options.some(o=>o.value===v))))errors[field.key]='Selección no válida.';
  }
  if(stepIndex===0&&data.jurisdiction!=='ES')errors.jurisdiction='Solo está disponible España.';
  if(stepIndex===3&&dateValid(data.startDate)&&dateValid(data.endDate)&&data.endDate<data.startDate)errors.endDate='No puede ser anterior al inicio.';
  if(stepIndex===6&&/(retener\s+(el\s+)?pasaporte|prohibid[oa]\s+salir|sin\s+descansos|confiscar\s+documentos)/i.test(data.additional))errors.additional='Cláusula potencialmente coactiva no admisible.';
  if(stepIndex===3&&data.mode==='hogar'&&Number(data.weeklyHours)>40)errors.weeklyHours='Jornada ordinaria superior a 40 horas semanales.';
  return errors;
}
export function validateAll(data){return SCHEMA.flatMap((_,step)=>Object.entries(validateStep(data,step)).map(([field,message])=>({step,field,message})));}
const warning=(level,code,title,detail,url)=>({level,code,title,detail,url});
export function evaluateRules(data){
  const alerts=[];
  if(data.jurisdiction!=='ES')alerts.push(warning('bloqueo','JURISDICTION','Jurisdicción no compatible','Las referencias disponibles solo corresponden a España.',SOURCES.hogar));
  if(data.mode==='autonomo'&&(data.direction==='si'||data.ownMeans==='no'||data.direction==='incierto'))alerts.push(warning('alerta','CLASSIFICATION','Posible relación laboral encubierta','La dependencia y ajenidad reales pueden determinar una relación laboral, aunque se titule mercantil.',SOURCES.et));
  if(data.mode==='hogar'&&Number(data.weeklyHours)>40)alerts.push(warning('alerta','WORKING_TIME','Jornada ordinaria por encima de 40 horas','La jornada máxima ordinaria del hogar es de 40 horas semanales de trabajo efectivo.',SOURCES.hogar));
  if(data.mode==='hogar'&&Number(data.presenceHours)>20)alerts.push(warning('alerta','PRESENCE','Presencia superior a 20 horas semanales declaradas','La regla legal se refiere al promedio de un mes salvo compensación con descanso equivalente: revisar el cálculo y el pacto.',SOURCES.hogar));
  if(data.mode==='hogar'&&data.accommodation==='si')alerts.push(warning('revisión','HOUSING','Alojamiento y pernocta','Debe preservarse el descanso y la libertad de movimiento; revisar condiciones concretas.',SOURCES.hogar));
  if(data.mode==='hogar'&&data.inKind==='si')alerts.push(warning('revisión','IN_KIND','Salario en especie','Verificar límites y mínimos monetarios obligatorios.',SOURCES.hogar));
  if(data.mode==='hogar')alerts.push(warning('revisión','PREVENTION','Protección de seguridad y salud','Revisar evaluación de riesgos y medidas preventivas del servicio doméstico.',SOURCES.riesgos));
  alerts.push(warning('revisión','PAY','Retribución y Seguridad Social','No se verifican automáticamente SMI, convenio, cotizaciones ni exigencias de alta.',SOURCES.hogar));
  alerts.push(warning('revisión','LEGAL','Revisión jurídica y firma','El borrador no incorpora firma electrónica, identidad validada ni un clausulado legal exhaustivo.',SOURCES.et));
  return alerts;
}
export function completeness(data){const total=SCHEMA.slice(0,-1).flatMap((_,i)=>visibleFields(i,data).filter(f=>f.required));const completed=total.filter(f=>!blank(data[f.key]));return Math.round((completed.length/Math.max(1,total.length))*100);}
export function importDraft(raw){if(!raw||typeof raw!=='object'||Array.isArray(raw)||!raw.data||typeof raw.data!=='object'||Array.isArray(raw.data))throw Error('Archivo de expediente incorrecto.');if(raw.schemaVersion!==undefined&&raw.schemaVersion!==2)throw Error('Versión incompatible.');const result=newDraft();for(const key of Object.keys(FIELD_MAP)){if(Object.hasOwn(raw.data,key))result.data[key]=normalize(key,raw.data[key]);}if(!result.data.services.includes('otro'))result.data.otherService='';if(result.data.mode!=='hogar'){result.data.presenceHours='';result.data.inKind='no';result.data.inKindDetails='';result.data.accommodation='no';result.data.housing='';result.data.overnight='no';}if(result.data.inKind!=='si')result.data.inKindDetails='';if(result.data.accommodation!=='si'){result.data.housing='';result.data.overnight='no';}return result;}
