import {$,money,readForm} from "../../utils/formatters.js";
import {store} from "../../core/store.js";
import {quote} from "./pricing.js";
import {waLink} from "../../services/whatsapp.service.js";import {toast} from "../../components/ui/toast.js";import {V} from "../../utils/validators.js";import {db} from "../../services/db.service.js";
export function mountQuote(root,{config,vehicles,pricing:P}){
 const o=(a,f)=>a.map(f).join(""),d0=new Date(Date.now()+2*864e5).toISOString().slice(0,10);
 root.dataset.mode="dist";
 root.innerHTML=`<form id="qf" class="card form"><div class="tabs">${[["dist","Por distancia"],["hours","Por horas / eventos"],["trip","Viaje por días"]].map(([k,t])=>`<button type="button" data-tab="${k}">${t}</button>`).join("")}</div>
 <label class="full">Vehículo<select name="vehicle">${o(vehicles,v=>`<option value="${v.id}">${v.plan} · ${v.model}</option>`)}</select></label>
 <label>Fecha<input type="date" name="date" value="${d0}"></label><label>Hora<input type="time" name="time" value="09:00"></label>
 <label class="full">Recogida<input name="from" placeholder="Ej. Miraflores, Av. Larco 123"></label><label class="full">Destino<input name="to" placeholder="Ej. Aeropuerto Jorge Chávez"></label>
 <div class="g" data-m="dist"><label>Km (ida)<input type="number" name="km" value="16" min="0"></label><label>Espera (min)<input type="number" name="wait" value="0" min="0"></label>
 <label class="chk"><input type="checkbox" name="round">Ida y vuelta</label><label class="chk"><input type="checkbox" name="airport">Aeropuerto</label></div>
 <div class="g" data-m="hours"><label class="full">Tipo de evento<select name="eventId">${o(P.events,e=>`<option value="${e.id}">${e.label}</option>`)}</select></label>
 <label>Horas (mín. ${P.minHours})<input type="number" name="hours" value="4" min="${P.minHours}"></label><label>Km estimados<input type="number" name="ekm" value="40" min="0"></label></div>
 <div class="g" data-m="trip"><label>Días<input type="number" name="days" value="2" min="1"></label><label>Horas extra/día<input type="number" name="dxh" value="0" min="0"></label>
 <label>Km totales<input type="number" name="dkm" value="400" min="0"></label><label>Peajes (S/)<input type="number" name="toll" value="0" min="0"></label>
 <label class="chk"><input type="checkbox" name="food" checked>Alimentación chofer</label><label class="chk"><input type="checkbox" name="lodge" checked>Alojamiento chofer</label></div>
 <label>Exclusividad<select name="excl">${o(P.exclusivity,e=>`<option value="${e.id}">${e.label}</option>`)}</select></label><label>Pasajeros<input type="number" name="pax" value="2" min="1" max="7"></label>
 <label>Cupón (opcional)<input name="coupon" placeholder="REDCORP"></label><label>Nombre<input name="name"></label><label>Celular<input name="phone" inputmode="tel"></label><label class="full">Observaciones<textarea name="obs" rows="2"></textarea></label></form>
 <div class="card res"><h3 style="margin:0">Estimación</h3><div id="ql"></div><div class="total" id="qt"></div>
 <div id="qa"></div><p class="note">Estimación referencial. Precio final y disponibilidad se confirman por coordinación personalizada.</p><a class="btn wa" id="qw" target="_blank" rel="noopener">Enviar solicitud por WhatsApp</a></div>`;
 const f=$("#qf",root);
 const render=()=>{const s={...readForm(f),mode:root.dataset.mode},v=vehicles.find(x=>x.id===s.vehicle),q=quote(s,v,P);f.pax.max=v.maxPax;const over=s.pax>v.maxPax;$("#qa",root).innerHTML=over?`<p class="alert">⚠ ${v.model} admite máximo ${v.maxPax} pasajeros. Elige otro vehículo.</p>`:"";root._ctx={s,v,q,over};
  store.set({vehicle:s.vehicle,mode:s.mode});
  $("#ql",root).innerHTML=q.lines.map(l=>`<div class="row"><span>${l[0]}</span><span>${l[1]<0?"-":""}${money(Math.abs(l[1]))}</span></div>`).join("");
  $("#qt",root).innerHTML=`${money(q.total)}<small>Rango ${money(q.low)} – ${money(q.high)}</small>${q.deposit?`<small>Anticipo sugerido: ${money(q.deposit)}</small>`:""}`;
  const mt={dist:"Traslado por distancia",hours:`Por horas: ${P.events.find(e=>e.id===s.eventId).label} (${s.hours} h)`,trip:`Viaje de ${s.days} día(s)`}[s.mode];
  $("#qw",root).href=$("#fab").href=waLink(config.whatsapp,[`Hola ${config.brand}, quiero reservar un servicio con conductor.`,`Nombre: ${s.name||"-"}`,`Celular: ${s.phone||"-"}`,`Vehículo: ${v.plan} (${v.model})`,`Modalidad: ${mt}`,`Fecha/Hora: ${s.date} ${s.time}`,`Recojo: ${s.from||"-"}`,`Destino: ${s.to||"-"}`,`Pasajeros: ${s.pax}`,`Estimación referencial: ${money(q.low)} – ${money(q.high)}`,`Obs: ${s.obs||"-"}`,"Quedo atento a confirmación de disponibilidad y precio final."]);};
 const check=({s,v,over})=>over?`El vehículo admite máximo ${v.maxPax} pasajeros`:!V.name(s.name)?"Escribe tu nombre completo":!V.phone(s.phone)?"Celular inválido: 9 dígitos y empieza con 9":!V.futureDate(s.date,s.time)?"La fecha y hora deben ser futuras":(!s.from.trim()||!s.to.trim())?"Indica recogida y destino":(s.mode==="dist"&&s.km<=0)?"Los kilómetros deben ser mayores a 0":"";
 [$("#qw",root),$("#fab")].forEach(a=>a.addEventListener("click",e=>{const c=root._ctx,err=check(c);if(err){e.preventDefault();toast(err,"error");return}
  db.add("requests",{kind:"reserva",name:c.s.name,phone:c.s.phone,detail:`${c.v.plan} · ${c.s.mode} · ${c.s.date} ${c.s.time}`,amount:Math.round(c.q.total),status:"nueva"});toast("Solicitud guardada. Se abrirá WhatsApp para confirmar.","ok")}));
 const tabs=[...root.querySelectorAll("[data-tab]")],setTab=k=>{root.dataset.mode=k;tabs.forEach(b=>b.classList.toggle("on",b.dataset.tab===k));render()};
 tabs.forEach(b=>b.onclick=()=>setTab(b.dataset.tab));f.oninput=render;
 store.on(s=>{if(f.vehicle.value!==s.vehicle){f.vehicle.value=s.vehicle;render()}});
 f.vehicle.value=store.get().vehicle;setTab("dist");
}
