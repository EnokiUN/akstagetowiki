var $=24*60*60*1e3,v=new URLSearchParams(globalThis.location.search).get("server")??"en",h=["cn","china"].includes(v.toLowerCase());var D=`https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/${v}/gamedata/levels/`,A=(t,o=h)=>`https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/${o?"cn":"en"}/gamedata/excel/${t}`,_="akstagetowiki_db",C=1,g="gamedata",E=new Promise(t=>{let o,a=globalThis.indexedDB.open(_,C);a.onerror=r=>{console.error("Failed to create indexDB: ",r),t(null)},a.onsuccess=()=>{o=a.result,o.onerror=r=>{console.error("Database error: ",r)},t(o)},a.onupgradeneeded=()=>{o=a.result,o.objectStoreNames.contains(g)||o.createObjectStore(g)}}),y=async(t,o)=>{let a=`${t}-${h}`,r=await E;if(r){let l=r.transaction(g).objectStore(g).get(a),m=await new Promise(u=>{l.onsuccess=()=>{let c=l.result;c&&Date.now()-c.timestamp<$?u(c.map):u(null)},l.onerror=()=>u(null)});if(m)return m}let n=await fetch(A(t,!1)).then(s=>s.json()),e=o(n);if(h){let s=await fetch(A(t)).then(i=>i.json());e={...o(s),...e}}if(r){let l=r.transaction(g,"readwrite").objectStore(g).put({timestamp:Date.now(),map:e},a);l.onerror=m=>{console.warn(`Datable erorr: Failed to cache ${a}: `,m)}}return e},L=y("enemy_handbook_table.json",t=>t.enemyData),w=y("item_table.json",t=>t.items),j=y("character_table.json",t=>t),x=y("skill_table.json",t=>t),O=y("stage_table.json",({stages:t,sixStarRuneData:o})=>{let a={};for(let r of Object.values(t)){let n=a[r.code]??={runes:{},stageInfos:[]};n.stageInfos.push(r);let e=[r.advancedRuneIdList1,r.advancedRuneIdList2].flatMap(s=>Object.values(s??{}));for(let s of e){let i=o[s];i?n.runes[s]=i:console.error(`Failed to find rune: ${s} in rune map`)}}return a});var b=document.querySelector("#stage-input"),R=document.querySelector("#convert"),I=document.querySelector("#output"),S=t=>t.replace(/<@lv\.item>( *?)</g,"$1'''<[[").replace(/>( *?)<\/>/g,"]]>'''$1").replace(/\n/g,"<br/>").replace(/\\n/g,"<br/>"),P={ALWAYS:1,ALMOST:2,USUAL:3,OFTEN:4,SOMETIMES:5},N=t=>t.dropType=="COMPLETE"?0:P[t.occPercent],T=async(t,o=void 0)=>{let a=await L,r=await w,n=await fetch(D+t.levelId.toLowerCase().replace("easy","main")+".json").then(c=>c.json()),e=`{{Operation data
`;t.diffGroup=="EASY"||t.diffGroup=="TOUGH"?e+=`|${t.diffGroup=="EASY"?"story":"adverse"} cond = ${S(t.description.split(/Environmental Conditions: *?<\/>\n/).at(-1))}
`:t.difficulty!="NORMAL"&&(e+=`|cond = ${S(t.description.split(/<@lv\.fs>Condition: *?<\/>\n/).at(-1))}
`),t.diffGroup=="TOUGH"&&(e+=`|adverse = true
`),t.difficulty=="FOUR_STAR"&&(e+=`|challenge = true
`),t.dangerLevel&&(e+=`|level = ${t.dangerLevel}
`),e+=`|sanity = ${t.apCost}
`,e+=`|unit limit = ${n.options.characterLimit}
`;let s=0,i={};for(let c of n.waves)for(let p of c.fragments)for(let d of p.actions)d.actionType=="SPAWN"&&(d.key in i||(i[d.key]=0),i[d.key]+=d.count,s+=d.count);e+=`|enemies = ${s}
`,e+=`|lp = ${n.options.maxLifePoint}
`,e+=`|dp = ${n.options.initialCost}
`;let l=(c,p)=>{let d=t.stageDropInfo.displayDetailRewards.filter(f=>f.dropType==c);if(d.length){e+=`|${p} = `;for(let f of d)e+=`{{I|${r[f.id].name.trim()}|rarity=${N(f)}}}`;e+=`
`}};l("COMPLETE","firstdrop"),l("NORMAL","regdrops"),l("SPECIAL","specdrops"),l("ADDITIONAL","extradrops");let m=c=>c.id in i?i[c.id]:0,u=(c,p)=>{let d=n.enemyDbRefs.filter(f=>a[f.id]?.enemyLevel==c);d.length&&(e+=`|${p} = `,e+=d.sort((f,M)=>m(M)-m(f)).map(f=>`{{E|${a[f.id].name.trim()}${f.id in i?`|${i[f.id]}`:""}}}`).join(", "),e+=`
`)};return u("NORMAL","normal"),u("ELITE","elite"),u("BOSS","boss"),o&&(e+=`|ss1a = ${S(o[t.advancedRuneIdList1[0]].runeDesc)}
`,e+=`|ss1b = ${S(o[t.advancedRuneIdList1[1]].runeDesc)}
`,e+=`|ss2a = ${S(o[t.advancedRuneIdList2[0]].runeDesc)}
`,e+=`|ss2a = ${S(o[t.advancedRuneIdList2[1]].runeDesc)}
`),e=e.trim()+"}}",e};R.addEventListener("click",async t=>{if(t.preventDefault(),b.value=="/reset"){globalThis.localStorage.clear();let e=await E;if(e){I.value="Resetting cache";let l=e.transaction(g,"readwrite").objectStore(g).clear();l.onsuccess=()=>{I.value="Cache reset"}}return}else if(b.value.startsWith("/enemies")){let e=b.value.split(" ")[1],s=await O,i=Object.keys(s).filter(m=>m.match(e)),l=new Set;for(let m of i)for(let u of s[m].stageInfos){if(!u.levelId)continue;let c=await fetch(D+u.levelId.toLowerCase().replace("easy","main")+".json").then(p=>p.json());for(let p of c.enemyDbRefs)l.add(p.id)}I.value=Array.from(l).join(", ");return}let o=await O;R.disabled=!0,I.disabled=!0,I.value="Loading, please wait...";let a=o[b.value],r=a?.stageInfos.find(e=>e.difficulty=="NORMAL"&&(e.diffGroup=="NONE"||e.diffGroup=="NORMAL"))??a?.stageInfos[0];if(!r){I.value="Failed to find stage",R.disabled=!1,I.disabled=!1;return}let n=`{{Operation tab}}
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
`,a.stageInfos.length>1){n+="<tabber>";for(let e of a.stageInfos)e.difficulty=="NORMAL"?e.diffGroup=="EASY"?n+="Story Environment":e.diffGroup=="TOUGH"?n+="Adverse Environment":a.stageInfos.find(s=>s.difficulty=="FOUR_STAR")?n+="Normal Mode":a.stageInfos.find(s=>s.difficulty=="SIX_STAR")?n+="Standard Combat":n+="Standard Environment":e.difficulty=="FOUR_STAR"?n+="Challenge Mode":e.difficulty=="SIX_STAR"&&(n+="Adverse Combat"),n+=`=${await T(e)}|-|`,e.difficulty=="SIX_STAR"&&(n+=`Strategic Simulation=${await T(e,a.runes)}|-|`);n=n.replace(/\|-\|$/,"</tabber>")}else n+=await T(r);I.value=n,I.disabled=!1,R.disabled=!1});
