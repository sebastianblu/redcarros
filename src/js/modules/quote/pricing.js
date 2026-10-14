// Motor de precios: se alimenta de vehicles.json y pricing.json
export function quote(s,v,P){
 const r=v.rates,L=[];let sub=0,pass=0;
 if(s.mode==="dist"){const km=s.km*(s.round?2:1);let t=km*r.km;L.push([`${km} km × S/ ${r.km}`,t]);
  if(s.wait){const w=s.wait*r.wait;L.push([`Espera ${s.wait} min`,w]);t+=w}
  if(!s.round&&s.km>P.returnAfterKm){const x=P.returnPct*s.km*r.km;L.push(["Retorno del conductor",x]);t+=x}
  if(t<r.min){L.push(["Ajuste a mínimo",r.min-t]);t=r.min}sub=t;
 }else if(s.mode==="hours"){const ev=P.events.find(e=>e.id===s.eventId)||P.events[0],h=Math.max(P.minHours,s.hours);
  let t=h*r.hour;L.push([`${h} h × S/ ${r.hour}`,t]);
  const b=[...P.blocks].reverse().find(b=>h>=b.hours);if(b){L.push([`Descuento ${b.disc*100}% por bloque`,-t*b.disc]);t*=1-b.disc}
  if(ev.mult>1){L.push([`${ev.label} (×${ev.mult})`,t*(ev.mult-1)]);t*=ev.mult}
  const ex=Math.max(0,s.ekm-P.kmPerHour*h)*r.km*P.extraKmPct;if(ex){L.push(["Km adicionales",ex]);t+=ex}sub=t;
 }else{const d=Math.max(1,s.days);let t=d*r.day;L.push([`${d} día(s) × S/ ${r.day}`,t]);
  if(s.dxh){const x=s.dxh*d*r.xh;L.push(["Horas extra",x]);t+=x}
  const ex=Math.max(0,s.dkm-P.kmPerDay*d)*r.km*P.extraKmDayPct;if(ex){L.push([`Km sobre ${P.kmPerDay}/día`,ex]);t+=ex}sub=t;
  if(s.food){const f=P.food*d;L.push(["Alimentación conductor",f]);pass+=f}
  if(s.lodge&&d>1){const l=P.lodge*(d-1);L.push([`Alojamiento conductor (${d-1} noche/s)`,l]);pass+=l}
  if(s.toll){L.push(["Peajes estimados (a rendir)",s.toll]);pass+=s.toll}}
 const m=(P.exclusivity.find(e=>e.id===s.excl)||P.exclusivity[0]).mult;
 if(m>1)L.push([`Exclusividad ×${m}`,sub*(m-1)]);const base=sub*m;let pct=0;
 const h=+(s.time||"09:00").split(":")[0],dt=new Date(`${s.date}T${s.time||"09:00"}`),n=P.night;
 if(h>=n.from||h<n.to){pct+=n.pct;L.push([`Recargo nocturno ${n.pct*100}%`,base*n.pct])}
 if([0,6].includes(dt.getDay())){pct+=P.weekendPct;L.push([`Fin de semana ${P.weekendPct*100}%`,base*P.weekendPct])}
 if(!isNaN(dt)&&dt-new Date()<P.urgentHours*36e5){pct+=P.urgentPct;L.push([`Reserva urgente ${P.urgentPct*100}%`,base*P.urgentPct])}
 const cp=(P.coupons||[]).find(c=>c.code===(s.coupon||'').trim().toUpperCase());if(cp)L.push([`Cupón ${cp.code} -${cp.pct*100}%`,-base*(1+pct)*cp.pct]);let total=base*(1+pct)*(1-(cp?cp.pct:0))+pass;
 if(s.mode==="dist"&&s.airport){total+=P.airportFee;L.push(["Aeropuerto (espera/estacionamiento)",P.airportFee])}
 return{deposit:total*((P.deposit||{})[s.mode]||0),lines:L,total,low:total*(1-P.range),high:total*(1+P.range)};
}
