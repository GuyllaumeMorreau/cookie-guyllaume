import {unseal} from './crypto.js';
const form=document.querySelector('#unlock-form'),field=document.querySelector('#key'),status=document.querySelector('#status'),panel=document.querySelector('#unlock'),lock=document.querySelector('#lock');
let frame,blobUrl;
form.addEventListener('submit',async event=>{
 event.preventDefault();const button=form.querySelector('button');button.disabled=true;status.textContent='กำลังเปิดของขวัญ…';
 let password=field.value;field.value='';
 try {
  const response=await fetch('./payload.json',{cache:'no-store'});if(!response.ok)throw new Error('unavailable');
  const payload=await response.json();const html=await unseal(payload,password);password='';
  blobUrl=URL.createObjectURL(new Blob([html],{type:'text/html'}));
  frame=document.createElement('iframe');frame.title='ของขวัญ';frame.src=blobUrl;frame.setAttribute('sandbox','allow-scripts allow-same-origin');
  document.body.append(frame);panel.hidden=true;lock.hidden=false;document.body.classList.add('open');status.textContent='';
 }catch {password='';status.textContent='เปิดไม่ได้ ลองตรวจรหัสผ่านแล้วอีกครั้งนะ';field.focus();}
 button.disabled=false;
});
lock.addEventListener('click',()=>{frame?.remove();if(blobUrl)URL.revokeObjectURL(blobUrl);frame=null;blobUrl=null;lock.hidden=true;panel.hidden=false;document.body.classList.remove('open');field.value='';field.focus();});
