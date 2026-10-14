import {$,money,esc} from "../../utils/formatters.js";
import {loadAll} from "../../services/data.service.js";
import {db} from "../../services/db.service.js";
import {login,logout,session,sha,ROLES} from "../../services/auth.service.js";
import {toast} from "../../components/ui/toast.js";
const ST=["nueva","confirmada","completada","cancelada"];
export async function mountAdmin(root){
 const D=await loadAll({all:true});let tab="requests";const users=()=>db.get("users",D.users);
 const view=()=>session()?app():auth();
 function auth(){root.innerHTML=`<form class="card login" id="lf"><h2>Acceso administrativo</h2><label>Usuario<input name="user" autocomplete="username"></label><label>Contraseña<input type="password" name="pass" autocomplete="current-password"></label><button class="btn">Ingresar</button><p class="note">Simulación en el navegador: no es seguridad real.</p></form>`;
  $("#lf").onsubmit=async e=>{e.preventDefault();const f=e.target,u=await login(users(),f.user.value,f.pass.value);if(!u)return toast("Usuario o contraseña incorrectos","error");toast("Bienvenido, "+u.name,"ok");view()}}
 function app(){const u=session(),tabs=ROLES[u.role];if(!tabs.includes(tab))tab=tabs[0];
  root.innerHTML=`<header class="bar"><b>RED<span>CARROS</span> · Admin</b><span>${esc(u.name)} (${u.role}) <button class="btn ghost" id="lo">Salir</button></span></header><div class="tabs">${tabs.map(t=>`<button data-t="${t}" class="${t===tab?"on":""}">${{requests:"Solicitudes",vehicles:"Vehículos",users:"Usuarios"}[t]}</button>`).join("")}</div><div id="pane"></div>`;
  $("#lo").onclick=()=>{logout();view()};root.querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>{tab=b.dataset.t;app()});({requests:reqs,vehicles:vehs,users:usrs})[tab]($("#pane"),u)}
 function reqs(p){const R=db.get("requests",[]),ok=R.filter(r=>["confirmada","completada"].includes(r.status));
  p.innerHTML=`<div class="stats"><div class="card"><b>${R.length}</b><span>Solicitudes</span></div><div class="card"><b>${R.filter(r=>r.status==="nueva").length}</b><span>Nuevas</span></div><div class="card"><b>${money(ok.reduce((a,r)=>a+(r.amount||0),0))}</b><span>Confirmado (est.)</span></div></div>
  <div class="card scroll"><table><tr><th>Fecha</th><th>Tipo</th><th>Cliente</th><th>Detalle</th><th>Monto</th><th>Estado</th></tr>${R.map(r=>`<tr><td>${r.at.slice(0,10)}</td><td>${esc(r.kind)}</td><td>${esc(r.name)}<br>${esc(r.phone)}</td><td>${esc(r.detail)}</td><td>${r.amount?money(r.amount):"-"}</td><td><select data-id="${r.id}">${ST.map(s=>`<option ${s===r.status?"selected":""}>${s}</option>`).join("")}</select></td></tr>`).join("")||"<tr><td colspan=6>Sin solicitudes aún. Se registran cuando se envían formularios desde este navegador.</td></tr>"}</table></div>`;
  p.querySelectorAll("select[data-id]").forEach(s=>s.onchange=()=>{db.set("requests",R.map(r=>r.id===s.dataset.id?{...r,status:s.value}:r));toast("Estado actualizado","ok");reqs(p)})}
 function vehs(p){const Vs=db.get("vehicles",D.vehicles),inp=(i,k,v)=>`<input type="number" step="0.1" min="0" data-i="${i}" data-k="${k}" value="${v}">`;
  p.innerHTML=`<div class="card scroll"><table><tr><th>Vehículo</th><th>Máx pax</th><th>S/ km</th><th>Mín</th><th>S/ hora</th><th>S/ día</th><th>Activo</th></tr>${Vs.map((v,i)=>`<tr><td>${esc(v.plan)}<br><small>${esc(v.model)}</small></td><td>${inp(i,"maxPax",v.maxPax)}</td><td>${inp(i,"km",v.rates.km)}</td><td>${inp(i,"min",v.rates.min)}</td><td>${inp(i,"hour",v.rates.hour)}</td><td>${inp(i,"day",v.rates.day)}</td><td><input type="checkbox" data-i="${i}" data-k="active" ${v.active?"checked":""}></td></tr>`).join("")}</table></div><div><button class="btn" id="sv">Guardar cambios</button> <button class="btn ghost" id="rs">Restablecer datos demo</button></div><p class="note">Cambios guardados solo en este navegador (simulación). En producción, edita public/data/vehicles.json.</p>`;
  $("#sv").onclick=()=>{let bad=false;p.querySelectorAll("[data-i]").forEach(e=>{const v=Vs[e.dataset.i],k=e.dataset.k;if(k==="active")v.active=e.checked;else{const n=+e.value;if(!(n>0))bad=true;k==="maxPax"?v.maxPax=n:v.rates[k]=n}});
   if(bad)return toast("Todos los valores deben ser mayores a 0","error");db.set("vehicles",Vs);toast("Vehículos actualizados","ok")};
  $("#rs").onclick=()=>{if(confirm("¿Borrar cambios, solicitudes y usuarios creados?")){db.reset();toast("Datos restablecidos","ok");app()}}}
 function usrs(p,me){const U=users();
  p.innerHTML=`<div class="card scroll"><table><tr><th>Usuario</th><th>Nombre</th><th>Rol</th><th>Activo</th><th></th></tr>${U.map((x,i)=>`<tr><td>${esc(x.user)}</td><td>${esc(x.name)}</td><td>${x.role}</td><td><input type="checkbox" data-a="${i}" ${x.active!==false?"checked":""} ${x.user===me.user?"disabled":""}></td><td>${x.user===me.user?"":`<button class="btn ghost" data-d="${i}">Eliminar</button>`}</td></tr>`).join("")}</table></div>
  <form class="card form" id="uf"><b class="full">Crear usuario</b><label>Nombre<input name="name"></label><label>Usuario<input name="user"></label><label>Contraseña (8+ con número)<input type="password" name="pass"></label><label>Rol<select name="role">${Object.keys(ROLES).map(r=>`<option>${r}</option>`).join("")}</select></label><button class="btn full">Crear</button></form>`;
  p.querySelectorAll("[data-a]").forEach(c=>c.onchange=()=>{U[c.dataset.a].active=c.checked;db.set("users",U);toast("Usuario actualizado","ok")});
  p.querySelectorAll("[data-d]").forEach(b=>b.onclick=()=>{U.splice(b.dataset.d,1);db.set("users",U);toast("Usuario eliminado","ok");usrs(p,me)});
  $("#uf").onsubmit=async e=>{e.preventDefault();const f=e.target,u=f.user.value.trim().toLowerCase();
   if(f.name.value.trim().length<3||!/^[a-z0-9_]{3,}$/.test(u))return toast("Nombre o usuario inválido (usuario: 3+ letras, números o _)","error");
   if(f.pass.value.length<8||!/\d/.test(f.pass.value))return toast("La contraseña debe tener 8+ caracteres y un número","error");
   if(U.some(x=>x.user===u))return toast("Ese usuario ya existe","error");
   U.push({user:u,name:f.name.value.trim(),role:f.role.value,hash:await sha(f.pass.value),active:true});db.set("users",U);toast("Usuario creado","ok");usrs(p,me)}}
 view();
}
