// Login simulado en el navegador (no es seguridad real). Contraseñas guardadas como hash SHA-256.
const S="redcarros_session";
export const ROLES={superadmin:["requests","vehicles","users"],admin:["requests","vehicles"],operador:["requests"]};
export const sha=async s=>[...new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s)))].map(b=>b.toString(16).padStart(2,"0")).join("");
export const session=()=>JSON.parse(sessionStorage.getItem(S)||"null");
export const logout=()=>sessionStorage.removeItem(S);
export async function login(users,name,pass){const h=await sha(pass),u=users.find(x=>x.user===name.trim().toLowerCase()&&x.hash===h&&x.active!==false);
 if(!u)return null;const s={user:u.user,role:u.role,name:u.name};sessionStorage.setItem(S,JSON.stringify(s));return s}
