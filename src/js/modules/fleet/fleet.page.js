import {money} from "../../utils/formatters.js";
import {store} from "../../core/store.js";
export function mountFleet(root,{vehicles}){
 root.innerHTML=vehicles.map(v=>`<div class="card car" data-id="${v.id}"><div class="img" style="--c:${v.colorHex}" data-label="${v.model}"><img src="${v.image}" alt="${v.model}" onerror="this.remove()"></div>
 <div class="b"><h3>${v.plan}</h3><div class="note">${v.model} · ${v.type} · hasta ${v.maxPax} pax</div><p>${v.desc}</p><ul>${v.features.map(f=>`<li>${f}</li>`).join("")}</ul>
 <div class="price">Desde ${money(v.rates.min)} · ${money(v.rates.hour)}/h · ${money(v.rates.day)}/día</div></div></div>`).join("");
 const mark=s=>root.querySelectorAll(".car").forEach(c=>c.classList.toggle("sel",c.dataset.id===s.vehicle));
 root.onclick=e=>{const c=e.target.closest(".car");if(c){store.set({vehicle:c.dataset.id});location.hash="#cotizador"}};
 store.on(mark);mark(store.get());
}
