export const $=(s,r=document)=>r.querySelector(s);
export const money=n=>"S/ "+Math.round(n).toLocaleString("es-PE");
export const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export const readForm=f=>{const o={};[...f.elements].forEach(e=>{if(e.name)o[e.name]=e.type==="checkbox"?e.checked:e.type==="number"?(+e.value||0):e.value});return o};
