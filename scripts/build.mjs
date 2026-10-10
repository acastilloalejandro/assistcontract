import {mkdir,cp,stat,rm} from 'node:fs/promises';
const required=['index.html','manifest.webmanifest','icon.svg','favicon.svg','sw.js','src'];
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
for(const name of required){await stat(name);await cp(name,'dist/'+name,{recursive:true,force:true});}
console.log('Build estático verificado: dist/ · '+required.length+' entradas.');
