import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve('dist');
const host='127.0.0.1';
const port=Number(process.env.PORT||4173);
if(!Number.isInteger(port)||port<1||port>65535)throw Error('Puerto inválido.');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json','.svg':'image/svg+xml'};
createServer(async(req,res)=>{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'}).end();return;}
  try{
    const pathname=decodeURIComponent(new URL(req.url||'/', 'http://localhost').pathname);
    const name=pathname==='/'?'index.html':pathname.replace(/^\/+/,'');
    const filename=resolve(root,name);
    if(!filename.startsWith(root+sep)){res.writeHead(403).end();return;}
    const content=await readFile(filename);
    res.writeHead(200,{'Content-Type':mime[extname(filename)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
    res.end(req.method==='HEAD'?undefined:content);
  }catch(error){res.writeHead(404).end('Archivo no encontrado.');}
}).listen(port,host,()=>console.log('AssistContract disponible en http://'+host+':'+port+'/ (Ctrl+C para detener)'));
