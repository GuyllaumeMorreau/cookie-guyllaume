const encoder = new TextEncoder();
export const iterations = 600000;
const b64 = bytes => {
 let text=''; for (const byte of new Uint8Array(bytes)) text+=String.fromCharCode(byte);
 return btoa(text);
};
const bytes = text => Uint8Array.from(atob(text), c=>c.charCodeAt(0));
async function derive(password,salt,rounds) {
 const material=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveKey']);
 return crypto.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',salt,iterations:rounds},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
export async function seal(plaintext,password) {
 const salt=crypto.getRandomValues(new Uint8Array(16));
 const iv=crypto.getRandomValues(new Uint8Array(12));
 const key=await derive(password,salt,iterations);
 const ciphertext=await crypto.subtle.encrypt({name:'AES-GCM',iv,tagLength:128},key,encoder.encode(plaintext));
 return {version:1,kdf:'PBKDF2-SHA256',iterations,cipher:'AES-256-GCM',salt:b64(salt),iv:b64(iv),ciphertext:b64(ciphertext)};
}
export async function unseal(payload,password) {
 if(payload.version!==1 || payload.kdf!=='PBKDF2-SHA256' || payload.cipher!=='AES-256-GCM' || payload.iterations!==iterations) throw new Error('Unsupported encrypted gift');
 const salt=bytes(payload.salt),iv=bytes(payload.iv);
 if(salt.length!==16 || iv.length!==12) throw new Error('Invalid encrypted gift');
 const key=await derive(password,salt,payload.iterations);
 return new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv,tagLength:128},key,bytes(payload.ciphertext)));
}
