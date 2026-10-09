var k=24*60*60*1e3,M=new URLSearchParams(globalThis.location.search).get("server")??"en",E=["cn","china"].includes(M.toLowerCase());var O=`https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/${M}/gamedata/levels/`,$=(e,i=E)=>`https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/${i?"cn":"en"}/gamedata/excel/${e}`,j="akstagetowiki_db",N=1,S="gamedata",v=new Promise(e=>{let i,o=globalThis.indexedDB.open(j,N);o.onerror=c=>{console.error("Failed to create indexDB: ",c),e(null)},o.onsuccess=()=>{i=o.result,i.onerror=c=>{console.error("Database error: ",c)},e(i)},o.onupgradeneeded=()=>{i=o.result,i.objectStoreNames.contains(S)||i.createObjectStore(S)}}),b=async(e,i)=>{let o=`${e}-${E}`,c=await v;if(c){let f=c.transaction(S).objectStore(S).get(o),l=await new Promise(g=>{f.onsuccess=()=>{let p=f.result;p&&Date.now()-p.timestamp<k?g(p.map):g(null)},f.onerror=()=>g(null)});if(l)return l}let a=await fetch($(e,!1)).then(n=>n.json()),s=i(a);if(E){let n=await fetch($(e)).then(t=>t.json());s={...i(n),...s}}if(c){let f=c.transaction(S,"readwrite").objectStore(S).put({timestamp:Date.now(),map:s},o);f.onerror=l=>{console.warn(`Datable erorr: Failed to cache ${o}: `,l)}}return s},w=b("enemy_handbook_table.json",e=>e.enemyData),L=b("item_table.json",e=>e.items),C=b("character_table.json",e=>e),_=b("skill_table.json",e=>e),A=b("stage_table.json",({stages:e,sixStarRuneData:i})=>{let o={};for(let c of Object.values(e)){let a=o[c.code]??={runes:{},stageInfos:[]};a.stageInfos.push(c);let s=[c.advancedRuneIdList1,c.advancedRuneIdList2].flatMap(n=>Object.values(n??{}));for(let n of s){let t=i[n];t?a.runes[n]=t:console.error(`Failed to find rune: ${n} in rune map`)}}return o});var R=document.querySelector("#stage-input"),D=document.querySelector("#convert"),I=document.querySelector("#output"),h=e=>e.replace(/<@lv\.item>( *?)</g,"$1'''<[[").replace(/>( *?)<\/>/g,"]]>'''$1").replace(/\n/g,"<br/>").replace(/\\n/g,"<br/>"),x={ALWAYS:1,ALMOST:2,USUAL:3,OFTEN:4,SOMETIMES:5},U=e=>e.dropType=="COMPLETE"?0:x[e.occPercent],T=async(e,i=void 0)=>{let o=await w,c=await L,a=await C,s=await _,n=await fetch(O+e.levelId.toLowerCase().replace("easy","main")+".json").then(r=>r.json()),t=`{{Operation data
`;e.diffGroup=="EASY"||e.diffGroup=="TOUGH"?t+=`|${e.diffGroup=="EASY"?"story":"adverse"} cond = ${h(e.description.split(/Environmental Conditions: *?<\/>\n/).at(-1))}
`:e.difficulty!="NORMAL"&&(t+=`|cond = ${h(e.description.split(/<@lv\.fs>Condition: *?<\/>\n/).at(-1))}
`),e.diffGroup=="TOUGH"&&(t+=`|adverse = true
`),e.difficulty=="FOUR_STAR"&&(t+=`|challenge = true
`),e.dangerLevel&&(t+=`|level = ${e.dangerLevel}
`),t+=`|sanity = ${e.apCost}
`,t+=`|unit limit = ${n.options.characterLimit}
`;let f=0,l={};for(let r of n.waves)for(let m of r.fragments)for(let d of m.actions)d.actionType=="SPAWN"&&(d.key in l||(l[d.key]=0),l[d.key]+=d.count,f+=d.count);if(t+=`|enemies = ${f}
`,t+=`|lp = ${n.options.maxLifePoint}
`,t+=`|dp = ${n.options.initialCost}
`,n.predefines.tokenCards.length&&(t+="|deployable = "+n.predefines.tokenCards.map(r=>`{{D|${a[r.inst.characterKey].name}|${r.initialCnt}}}`).join(", ")+`
`),n.predefines.tokenInsts.length){let r={};n.predefines.tokenInsts.forEach(m=>{console.log(r[m.inst.characterKey]),r[m.inst.characterKey]=(r[m.inst.characterKey]??0)+1,console.log((r[m.inst.characterKey]??0)+1)}),t+="|static = "+Object.entries(r).map(([m,d])=>`{{D|${a[m].name}|${d}}}`).join(", ")+`
`}let g=(r,m)=>{let d=e.stageDropInfo.displayDetailRewards.filter(u=>u.dropType==r);if(d.length){t+=`|${m} = `;for(let u of d)t+=`{{I|${c[u.id].name.trim()}|rarity=${U(u)}}}`;t+=`
`}};g("COMPLETE","firstdrop"),g("NORMAL","regdrops"),g("SPECIAL","specdrops"),g("ADDITIONAL","extradrops");let p=r=>r.id in l?l[r.id]:0,y=(r,m)=>{let d=n.enemyDbRefs.filter(u=>o[u.id]?.enemyLevel==r);d.length&&(t+=`|${m} = `,t+=d.sort((u,P)=>p(P)-p(u)).map(u=>`{{E|${o[u.id].name.trim()}${u.id in l?`|${l[u.id]}`:""}}}`).join(", "),t+=`
`)};return y("NORMAL","normal"),y("ELITE","elite"),y("BOSS","boss"),i&&(t+=`|ss1a = ${h(i[e.advancedRuneIdList1[0]].runeDesc)}
`,t+=`|ss1b = ${h(i[e.advancedRuneIdList1[1]].runeDesc)}
`,t+=`|ss2a = ${h(i[e.advancedRuneIdList2[0]].runeDesc)}
`,t+=`|ss2a = ${h(i[e.advancedRuneIdList2[1]].runeDesc)}
`),t=t.trim()+"}}",t};D.addEventListener("click",async e=>{if(e.preventDefault(),R.value=="/reset"){let s=await v;if(s){I.value="Resetting cache";let f=s.transaction(S,"readwrite").objectStore(S).clear();f.onsuccess=()=>{I.value="Cache reset, please refresh"}}return}else if(R.value.startsWith("/enemies")){let s=R.value.split(" ")[1],n=await A,t=Object.keys(n).filter(l=>l.match(s)),f=new Set;for(let[l,g]of t.map((p,y)=>[p,y])){I.value=`Fetching enemies from stages (${g}/${t.length})`;for(let p of n[l].stageInfos){if(!p.levelId)continue;let y=await fetch(O+p.levelId.toLowerCase().replace("easy","main")+".json").then(r=>r.json());for(let r of y.enemyDbRefs)f.add(r.id)}}I.value=Array.from(f).join(", ");return}let i=await A;D.disabled=!0,I.disabled=!0,I.value="Loading, please wait...";let o=i[R.value],c=o?.stageInfos.find(s=>s.difficulty=="NORMAL"&&(s.diffGroup=="NONE"||s.diffGroup=="NORMAL"))??o?.stageInfos[0];if(!c){I.value="Failed to find stage",D.disabled=!1,I.disabled=!1;return}let a=`{{Operation tab}}
{{Operation info
`;if(a+=`|code = ${c.code}
`,a+=`|name = ${c.name}
`,a+=`|episode = 
|intermezzo = 
|sidestory = 
|storycollection = 
|part = 
|prev = 
|next = 
`,a+=`|desc = ${h(c.description)}
`,a+=`|note = }}
`,o.stageInfos.length>1){a+="<tabber>";for(let s of o.stageInfos)s.difficulty=="NORMAL"?s.diffGroup=="EASY"?a+="Story Environment":s.diffGroup=="TOUGH"?a+="Adverse Environment":o.stageInfos.find(n=>n.difficulty=="FOUR_STAR")?a+="Normal Mode":o.stageInfos.find(n=>n.difficulty=="SIX_STAR")?a+="Standard Combat":a+="Standard Environment":s.difficulty=="FOUR_STAR"?a+="Challenge Mode":s.difficulty=="SIX_STAR"&&(a+="Adverse Combat"),a+=`=${await T(s)}|-|`,s.difficulty=="SIX_STAR"&&(a+=`Strategic Simulation=${await T(s,o.runes)}|-|`);a=a.replace(/\|-\|$/,"</tabber>")}else a+=await T(c);I.value=a,I.disabled=!1,D.disabled=!1});
