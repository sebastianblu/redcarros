// Tema de color cambiante: modo auto (el matiz rota solo) o presets
const K="redcarros_theme",P=[null,350,210,150,45,280],N=["Auto","Rojo","Azul","Verde","Dorado","Violeta"];let i=+localStorage.getItem(K)||0,h=350,iv;
const set=()=>document.documentElement.style.setProperty("--h",h);
export function initTheme(btn){const run=()=>{clearInterval(iv);if(P[i]===null)iv=setInterval(()=>{h=(h+.5)%360;set()},120);else{h=P[i];set()}if(btn)btn.textContent="Tema: "+N[i]};run();
 if(btn)btn.onclick=()=>{i=(i+1)%P.length;localStorage.setItem(K,i);run()}}
