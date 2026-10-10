import {qualityReport,SCHEMA} from './engine.js';
/** Export a diagnostics-only record, intentionally excluding names, addresses and draft history. */
export function reviewReport(data){
  const assessment=qualityReport(data);
  return {
    format:'assistcontract-structural-review',schemaVersion:1,
    generatedAt:new Date().toISOString(),
    legalAssessment:'NOT_PERFORMED',
    advisory:'Diagnóstico estructural orientativo: no verifica normas vigentes, salario mínimo, identidad ni firma.',
    completion:assessment.completeness,
    checks:assessment.checks,
    pendingFields:assessment.issues.map(({step,field,message})=>({stage:SCHEMA[step]?.id||String(step),field,message})),
    warnings:assessment.warnings.map(({code,level,title,url})=>({code,level,title,reference:url})),
    professionalReviewRequired:true
  };
}
export function reviewReportJSON(data){return JSON.stringify(reviewReport(data),null,2);}
