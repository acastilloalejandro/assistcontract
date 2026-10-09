/** Explicit opt-in encrypted local storage. No plaintext autosave. */
const STORE='assistcontract-v2-cipher',ITERATIONS=250000;
const b64=b=>btoa([...b].map(x=>String.fromCharCode(x)).join(''));
const fromB64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function keyFor(pass,salt){const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(pass),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:ITERATIONS,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);}
export async function encrypt(draft,password){if(typeof password!=='string'||password.length<12)throw Error('Utiliza al menos 12 caracteres.');if(!globalThis.crypto?.subtle)throw Error('El cifrado requiere un contexto seguro (HTTPS).');const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12)),key=await keyFor(password,salt);const bytes=new TextEncoder().encode(JSON.stringify(draft));const data=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},key,bytes));return JSON.stringify({format:'AC2',kdf:'PBKDF2-SHA256',iterations:ITERATIONS,salt:b64(salt),iv:b64(iv),data:b64(data)});}
export async function decrypt(envelope,password){const obj=JSON.parse(envelope);if(obj.format!=='AC2'||obj.iterations!==ITERATIONS)throw Error('Formato cifrado incompatible.');const key=await keyFor(password,fromB64(obj.salt));const bytes=await crypto.subtle.decrypt({name:'AES-GCM',iv:fromB64(obj.iv)},key,fromB64(obj.data));return JSON.parse(new TextDecoder().decode(bytes));}
export function storeCiphertext(envelope){localStorage.setItem(STORE,envelope);}
export function loadCiphertext(){return localStorage.getItem(STORE);}
export function forgetCiphertext(){localStorage.removeItem(STORE);}
export function hasCiphertext(){return !!localStorage.getItem(STORE);}
