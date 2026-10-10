import {readFile,stat} from 'node:fs/promises';
import {resolve,dirname,sep} from 'node:path';
const root=resolve('dist');
const required=['index.html','src/main.js','src/engine.js','src/documents.js','src/vault.js','src/service-templates.js','src/review-report.js','src/style.css','sw.js','manifest.webmanifest','icon.svg','favicon.svg'];
async function expectFile(path){
 const name=resolve(root,path);
 if(!name.startsWith(root+sep))throw Error('Ruta fuera de dist: '+path);
 const entry=await stat(name);
 if(!entry.isFile()||entry.size===0)throw Error('Recurso vacío: '+path);
}
await Promise.all(required.map(expectFile));
const html=await readFile(resolve(root,'index.html'),'utf8');
for(const match of html.matchAll(/(?:src|href)="(\.[^"]+)"/g))await expectFile(match[1]);
const manifest=JSON.parse(await readFile(resolve(root,'manifest.webmanifest'),'utf8'));
if(manifest.scope!=='./'||manifest.start_url!=='./')throw Error('Rutas de PWA incompatibles con Pages.');
for(const icon of manifest.icons||[])await expectFile(icon.src);
const jsFiles=required.filter(p=>p.endsWith('.js'));
for(const jsFile of jsFiles){
 const text=await readFile(resolve(root,jsFile),'utf8');
 for(const match of text.matchAll(/\bfrom\s*['"](\.[^'"]+)['"]/g)){
  const imported=resolve(dirname(resolve(root,jsFile)),match[1]);
  const relative=imported.slice(root.length+1);
  await expectFile(relative);
 }
}
const sw=await readFile(resolve(root,'sw.js'),'utf8');
for(const match of sw.matchAll(/'((?:\.\/)[^']+\.(?:js|css|svg|html|webmanifest))'/g))await expectFile(match[1]);
console.log('Smoke test de dist correcto: rutas HTML, módulos, manifest e iconos.');
