// "Base de datos" simulada: JSON en /public/data + cambios guardados en localStorage
const K=k=>"redcarros_"+k;
export const db={
 get(k,d){try{return JSON.parse(localStorage.getItem(K(k)))??d}catch{return d}},
 set(k,v){localStorage.setItem(K(k),JSON.stringify(v))},
 add(k,item){const a=db.get(k,[]);a.unshift({id:Date.now().toString(36),at:new Date().toISOString(),...item});db.set(k,a)},
 reset(){["vehicles","requests","users"].forEach(k=>localStorage.removeItem(K(k)))}};
