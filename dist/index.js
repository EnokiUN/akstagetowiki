var _=24*60*60*1e3,k=new URLSearchParams(globalThis.location.search).get("server")??"en",v=["cn","china"].includes(k.toLowerCase());var $=`https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/${k}/gamedata/levels/`,T=(e,i=v)=>`https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/${i?"cn":"en"}/gamedata/excel/${e}`,j="akstagetowiki_db",x=1,S="gamedata",E=new Promise(e=>{let i,r=globalThis.indexedDB.open(j,x);r.onerror=c=>{console.error("Failed to create indexDB: ",c),e(null)},r.onsuccess=()=>{i=r.result,i.onerror=c=>{console.error("Database error: ",c)},e(i)},r.onupgradeneeded=()=>{i=r.result,i.objectStoreNames.contains(S)||i.createObjectStore(S)}}),b=async(e,i)=>{let r=`${e}-${v}`,c=await E;if(c){let p=c.transaction(S).objectStore(S).get(r),d=await new Promise(g=>{p.onsuccess=()=>{let u=p.result;u&&Date.now()-u.timestamp<_?g(u.map):g(null)},p.onerror=()=>g(null)});if(d)return d}let s=await fetch(T(e,!1)).then(n=>n.json()),o=i(s);if(v){let n=await fetch(T(e)).then(t=>t.json());o={...i(n),...o}}if(c){let p=c.transaction(S,"readwrite").objectStore(S).put({timestamp:Date.now(),map:o},r);p.onerror=d=>{console.warn(`Datable erorr: Failed to cache ${r}: `,d)}}return o},M=b("enemy_handbook_table.json",e=>e.enemyData),w=b("item_table.json",e=>e.items),C=b("character_table.json",e=>e),P=b("skill_table.json",e=>e),O=b("stage_table.json",({stages:e,sixStarRuneData:i})=>{let r={};for(let c of Object.values(e)){let s=r[c.code]??={runes:{},stageInfos:[]};s.stageInfos.push(c);let o=[c.advancedRuneIdList1,c.advancedRuneIdList2].flatMap(n=>Object.values(n??{}));for(let n of o){let t=i[n];t?s.runes[n]=t:console.error(`Failed to find rune: ${n} in rune map`)}}return r});var R=document.querySelector("#stage-input"),D=document.querySelector("#convert"),I=document.querySelector("#output"),y=e=>e.replace(/<@lv\.item>( *?)</g,"$1'''<[[").replace(/>( *?)<\/>/g,"]]>'''$1").replace(/\n/g,"<br/>").replace(/\\n/g,"<br/>"),N={ALWAYS:1,ALMOST:2,USUAL:3,OFTEN:4,SOMETIMES:5},U=e=>e.dropType=="COMPLETE"?0:N[e.occPercent],L=async(e,i=void 0)=>{let r=await M,c=await w,s=await C,o=await P,n=await fetch($+e.levelId.toLowerCase().replace("easy","main")+".json").then(a=>a.json()),t=`{{Operation data
`;e.diffGroup=="EASY"||e.diffGroup=="TOUGH"?t+=`|${e.diffGroup=="EASY"?"story":"adverse"} cond = ${y(e.description.split(/Environmental Conditions: *?<\/>\n/).at(-1))}
`:e.difficulty!="NORMAL"&&(t+=`|cond = ${y(e.description.split(/<@lv\.fs>Condition: *?<\/>\n/).at(-1))}
`),e.diffGroup=="TOUGH"&&(t+=`|adverse = true
`),e.difficulty=="FOUR_STAR"&&(t+=`|challenge = true
`),e.dangerLevel&&(t+=`|level = ${e.dangerLevel}
`),t+=`|sanity = ${e.apCost}
`,t+=`|unit limit = ${n.options.characterLimit}
`;let p=0,d={};for(let a of n.waves)for(let m of a.fragments)for(let l of m.actions)l.actionType=="SPAWN"&&(l.key in d||(d[l.key]=0),d[l.key]+=l.count,p+=l.count);if(t+=`|enemies = ${p}
`,t+=`|lp = ${n.options.maxLifePoint}
`,t+=`|dp = ${n.options.initialCost}
`,(e.isPredefined||e.isHardPredefined||e.isSkillSelectablePredefined)&&(t+=`|fixed = true
`),n.predefines.tokenCards.length&&(t+="|deployable = "+n.predefines.tokenCards.map(a=>`{{D|${s[a.inst.characterKey].name}|${a.initialCnt}}}`).join(", ")+`
`),n.predefines.tokenInsts.length){let a={};n.predefines.tokenInsts.forEach(m=>{a[m.inst.characterKey]=(a[m.inst.characterKey]??0)+1}),t+="|static = "+Object.entries(a).map(([m,l])=>`{{D|${s[m].name}|${l}}}`).join(", ")+`
`}n.predefines.characterInsts&&(t+="|pre = "+n.predefines.characterInsts.map(a=>{let m=s[a.inst.characterKey],l="";if(a.skillIndex>=0){let f=m.skills[a.skillIndex].skillId;l=`, {{Skill|${o[f].levels[a.mainSkillLvl-1].name}}} `,l+=a.mainSkillLvl>7?`Spec. Level ${a.mainSkillLvl-7}`:`Level ${a.mainSkillLvl}`}return`{{C|${m.name}}} (Elite ${a.inst.phase.split("_")[1]} Level ${a.inst.level}${l})`}).join(", ")+`
`);let g=(a,m)=>{if(!e.stageDropInfo.displayDetailRewards.length)return;let l=e.stageDropInfo.displayDetailRewards.filter(f=>f.dropType==a);if(l.length){t+=`|${m} = `;for(let f of l)t+=`{{I|${c[f.id].name.trim()}|rarity=${U(f)}}}`;t+=`
`}};g("COMPLETE","firstdrop"),g("NORMAL","regdrops"),g("SPECIAL","specdrops"),g("ADDITIONAL","extradrops");let u=a=>a.id in d?d[a.id]:0,h=(a,m)=>{let l=n.enemyDbRefs.filter(f=>r[f.id]?.enemyLevel==a);l.length&&(t+=`|${m} = `,t+=l.sort((f,A)=>u(A)-u(f)).map(f=>`{{E|${r[f.id].name.trim()}${f.id in d?`|${d[f.id]}`:""}}}`).join(", "),t+=`
`)};return h("NORMAL","normal"),h("ELITE","elite"),h("BOSS","boss"),i&&(t+=`|ss1a = ${y(i[e.advancedRuneIdList1[0]].runeDesc)}
`,t+=`|ss1b = ${y(i[e.advancedRuneIdList1[1]].runeDesc)}
`,t+=`|ss2a = ${y(i[e.advancedRuneIdList2[0]].runeDesc)}
`,t+=`|ss2a = ${y(i[e.advancedRuneIdList2[1]].runeDesc)}
`),t=t.trim()+"}}",t};D.addEventListener("click",async e=>{if(e.preventDefault(),R.value=="/reset"){let o=await E;if(o){I.value="Resetting cache";let p=o.transaction(S,"readwrite").objectStore(S).clear();p.onsuccess=()=>{I.value="Cache reset, please refresh"}}return}else if(R.value.startsWith("/enemies")){let o=R.value.split(" ")[1],n=await O,t=Object.keys(n).filter(d=>d.match(o)),p=new Set;for(let[d,g]of t.map((u,h)=>[u,h])){I.value=`Fetching enemies from stages (${g}/${t.length})`;for(let u of n[d].stageInfos){if(!u.levelId)continue;let h=await fetch($+u.levelId.toLowerCase().replace("easy","main")+".json").then(a=>a.json());for(let a of h.enemyDbRefs)p.add(a.id)}}I.value=Array.from(p).join(", ");return}let i=await O;D.disabled=!0,I.disabled=!0,I.value="Loading, please wait...";let r=i[R.value],c=r?.stageInfos.find(o=>o.difficulty=="NORMAL"&&(o.diffGroup=="NONE"||o.diffGroup=="NORMAL"))??r?.stageInfos[0];if(!c){I.value="Failed to find stage",D.disabled=!1,I.disabled=!1;return}let s=`{{Operation tab}}
{{Operation info
`;if(s+=`|code = ${c.code}
`,s+=`|name = ${c.name}
`,s+=`|episode = 
|intermezzo = 
|sidestory = 
|storycollection = 
|part = 
|prev = 
|next = 
`,s+=`|desc = ${y(c.description)}
`,s+=`|note = }}
`,r.stageInfos.length>1){s+="<tabber>";for(let o of r.stageInfos)o.difficulty=="NORMAL"?o.diffGroup=="EASY"?s+="Story Environment":o.diffGroup=="TOUGH"?s+="Adverse Environment":r.stageInfos.find(n=>n.difficulty=="FOUR_STAR")?s+="Normal Mode":r.stageInfos.find(n=>n.difficulty=="SIX_STAR")?s+="Standard Combat":s+="Standard Environment":o.difficulty=="FOUR_STAR"?s+="Challenge Mode":o.difficulty=="SIX_STAR"&&(s+="Adverse Combat"),s+=`=${await L(o)}|-|`,o.difficulty=="SIX_STAR"&&(s+=`Strategic Simulation=${await L(o,r.runes)}|-|`);s=s.replace(/\|-\|$/,"</tabber>")}else s+=await L(c);I.value=s,I.disabled=!1,D.disabled=!1});
