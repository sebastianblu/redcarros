import {db} from "./db.service.js";
const get=u=>fetch(u).then(r=>r.json());
export async function loadAll({all=false}={}){
 const[config,v,pricing,u]=await Promise.all([get("/data/config.json"),get("/data/vehicles.json"),get("/data/pricing.json"),all?get("/data/users.json"):[]]);
 const vehicles=db.get("vehicles",v);return{config,pricing,users:u,vehicles:all?vehicles:vehicles.filter(x=>x.active)}}
