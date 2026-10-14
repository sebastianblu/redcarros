export function toast(msg,type="info"){let b=document.getElementById("toasts");if(!b){b=document.createElement("div");b.id="toasts";document.body.append(b)}
 const t=document.createElement("div");t.className="toast "+type;t.textContent=msg;b.append(t);setTimeout(()=>t.classList.add("out"),3500);setTimeout(()=>t.remove(),4000)}
