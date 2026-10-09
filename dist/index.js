var M=24*60*60*1e3,T=new URLSearchParams(globalThis.location.search).get("server")??"en",R=["cn","china"].includes(T.toLowerCase());var D=`https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/${T}/gamedata/levels/`,A=(t,o=R)=>`https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/${o?"cn":"en"}/gamedata/excel/${t}`,_="akstagetowiki_db",C=1,I="gamedata",E=new Promise(t=>{let o,a=globalThis.indexedDB.open(_,C);a.onerror=r=>{console.error("Failed to create indexDB: ",r),t(null)},a.onsuccess=()=>{o=a.result,o.onerror=r=>{console.error("Database error: ",r)},t(o)},a.onupgradeneeded=()=>{o=a.result,o.objectStoreNames.contains(I)||o.createObjectStore(I)}}),y=async(t,o)=>{let a=`${t}-${R}`,r=await E;if(r){let d=r.transaction(I).objectStore(I).get(a),f=await new Promise(u=>{d.onsuccess=()=>{let i=d.result;i&&Date.now()-i.timestamp<M?u(i.map):u(null)},d.onerror=()=>u(null)});if(f)return f}let n=await fetch(A(t,!1)).then(s=>s.json()),e=o(n);if(R){let s=await fetch(A(t)).then(c=>c.json());e={...o(s),...e}}if(r){let d=r.transaction(I,"readwrite").objectStore(I).put({timestamp:Date.now(),map:e},a);d.onerror=f=>{console.warn(`Datable erorr: Failed to cache ${a}: `,f)}}return e},$=y("enemy_handbook_table.json",t=>t.enemyData),L=y("item_table.json",t=>t.items),j=y("character_table.json",t=>t),x=y("skill_table.json",t=>t),O=y("stage_table.json",({stages:t,sixStarRuneData:o})=>{let a={};for(let r of Object.values(t)){let n=a[r.code]??={runes:{},stageInfos:[]};n.stageInfos.push(r);let e=[r.advancedRuneIdList1,r.advancedRuneIdList2].flatMap(s=>Object.values(s??{}));for(let s of e){let c=o[s];c?n.runes[s]=c:console.error(`Failed to find rune: ${s} in rune map`)}}return a});var b=document.querySelector("#stage-input"),h=document.querySelector("#convert"),p=document.querySelector("#output"),S=t=>t.replace(/<@lv\.item>( *?)</g,"$1'''<[[").replace(/>( *?)<\/>/g,"]]>'''$1").replace(/\n/g,"<br/>").replace(/\\n/g,"<br/>"),P={ALWAYS:1,ALMOST:2,USUAL:3,OFTEN:4,SOMETIMES:5},N=t=>t.dropType=="COMPLETE"?0:P[t.occPercent],v=async(t,o=void 0)=>{let a=await $,r=await L,n=await fetch(D+t.levelId.toLowerCase().replace("easy","main")+".json").then(i=>i.json()),e=`{{Operation data
`;t.diffGroup=="EASY"||t.diffGroup=="TOUGH"?e+=`|${t.diffGroup=="EASY"?"story":"adverse"} cond = ${S(t.description.split(/Environmental Conditions: *?<\/>\n/).at(-1))}
`:t.difficulty!="NORMAL"&&(e+=`|cond = ${S(t.description.split(/<@lv\.fs>Condition: *?<\/>\n/).at(-1))}
`),t.diffGroup=="TOUGH"&&(e+=`|adverse = true
`),t.difficulty=="FOUR_STAR"&&(e+=`|challenge = true
`),t.dangerLevel&&(e+=`|level = ${t.dangerLevel}
`),e+=`|sanity = ${t.apCost}
`,e+=`|unit limit = ${n.options.characterLimit}
`;let s=0,c={};for(let i of n.waves)for(let g of i.fragments)for(let l of g.actions)l.actionType=="SPAWN"&&(l.key in c||(c[l.key]=0),c[l.key]+=l.count,s+=l.count);e+=`|enemies = ${s}
`,e+=`|lp = ${n.options.maxLifePoint}
`,e+=`|dp = ${n.options.initialCost}
`;let d=(i,g)=>{let l=t.stageDropInfo.displayDetailRewards.filter(m=>m.dropType==i);if(l.length){e+=`|${g} = `;for(let m of l)e+=`{{I|${r[m.id].name.trim()}|rarity=${N(m)}}}`;e+=`
`}};d("COMPLETE","firstdrop"),d("NORMAL","regdrops"),d("SPECIAL","specdrops"),d("ADDITIONAL","extradrops");let f=i=>i.id in c?c[i.id]:0,u=(i,g)=>{let l=n.enemyDbRefs.filter(m=>a[m.id]?.enemyLevel==i);l.length&&(e+=`|${g} = `,e+=l.sort((m,w)=>f(w)-f(m)).map(m=>`{{E|${a[m.id].name.trim()}${m.id in c?`|${c[m.id]}`:""}}}`).join(", "),e+=`
`)};return u("NORMAL","normal"),u("ELITE","elite"),u("BOSS","boss"),o&&(e+=`|ss1a = ${S(o[t.advancedRuneIdList1[0]].runeDesc)}
`,e+=`|ss1b = ${S(o[t.advancedRuneIdList1[1]].runeDesc)}
`,e+=`|ss2a = ${S(o[t.advancedRuneIdList2[0]].runeDesc)}
`,e+=`|ss2a = ${S(o[t.advancedRuneIdList2[1]].runeDesc)}
`),e=e.trim()+"}}",e};h.addEventListener("click",async t=>{if(t.preventDefault(),b.value=="/reset"){let e=await E;if(e){p.value="Resetting cache";let d=e.transaction(I,"readwrite").objectStore(I).clear();d.onsuccess=()=>{p.value="Cache reset, please refresh"}}return}else if(b.value.startsWith("/enemies")){let e=b.value.split(" ")[1],s=await O,c=Object.keys(s).filter(f=>f.match(e)),d=new Set;for(let[f,u]of c.map((i,g)=>[i,g])){console.log(f,u),p.value=`Fetching enemies from stages (${u}/${c.length})`;for(let i of s[f].stageInfos){if(!i.levelId)continue;let g=await fetch(D+i.levelId.toLowerCase().replace("easy","main")+".json").then(l=>l.json());for(let l of g.enemyDbRefs)d.add(l.id)}}p.value=Array.from(d).join(", ");return}let o=await O;h.disabled=!0,p.disabled=!0,p.value="Loading, please wait...";let a=o[b.value],r=a?.stageInfos.find(e=>e.difficulty=="NORMAL"&&(e.diffGroup=="NONE"||e.diffGroup=="NORMAL"))??a?.stageInfos[0];if(!r){p.value="Failed to find stage",h.disabled=!1,p.disabled=!1;return}let n=`{{Operation tab}}
{{Operation info
`;if(n+=`|code = ${r.code}
`,n+=`|name = ${r.name}
`,n+=`|episode = 
|intermezzo = 
|sidestory = 
|storycollection = 
|part = 
|prev = 
|next = 
`,n+=`|desc = ${S(r.description)}
`,n+=`|note = }}
`,a.stageInfos.length>1){n+="<tabber>";for(let e of a.stageInfos)e.difficulty=="NORMAL"?e.diffGroup=="EASY"?n+="Story Environment":e.diffGroup=="TOUGH"?n+="Adverse Environment":a.stageInfos.find(s=>s.difficulty=="FOUR_STAR")?n+="Normal Mode":a.stageInfos.find(s=>s.difficulty=="SIX_STAR")?n+="Standard Combat":n+="Standard Environment":e.difficulty=="FOUR_STAR"?n+="Challenge Mode":e.difficulty=="SIX_STAR"&&(n+="Adverse Combat"),n+=`=${await v(e)}|-|`,e.difficulty=="SIX_STAR"&&(n+=`Strategic Simulation=${await v(e,a.runes)}|-|`);n=n.replace(/\|-\|$/,"</tabber>")}else n+=await v(r);p.value=n,p.disabled=!1,h.disabled=!1});
