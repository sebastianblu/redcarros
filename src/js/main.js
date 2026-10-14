import {loadAll} from "./services/data.service.js";
import {initTheme} from "./utils/theme.js";
import {mountFleet} from "./modules/fleet/fleet.page.js";
import {mountQuote} from "./modules/quote/quote.page.js";
import {mountRegister} from "./modules/register/register.page.js";
const $=s=>document.querySelector(s);initTheme($("#theme"));
loadAll().then(d=>{mountFleet($("#fleet"),d);mountQuote($("#quote"),d);mountRegister($("#register"),d);
 $("#foot").innerHTML=`${d.config.brand} · ${d.config.city} · WhatsApp +${d.config.whatsapp} · <a href="mailto:${d.config.email}">${d.config.email}</a><br>Tarifas referenciales. Disponibilidad sujeta a confirmación.`;
}).catch(e=>{document.body.insertAdjacentHTML("afterbegin",`<p style="padding:20px">Error cargando datos: ${e}. Usa <code>npm run dev</code>.</p>`)});
