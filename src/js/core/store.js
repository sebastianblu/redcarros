const s={vehicle:"yaris",mode:"dist"},subs=[];
export const store={get:()=>s,set(p){Object.assign(s,p);subs.forEach(f=>f(s))},on:f=>subs.push(f)};
