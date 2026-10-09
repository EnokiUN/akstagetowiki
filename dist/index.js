var j=24*60*60*1e3,M=new URLSearchParams(globalThis.location.search).get("server")??"en",$=["cn","china"].includes(M.toLowerCase());var E=`https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/${M}/gamedata/levels/`,k=(e,i=$)=>`https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/${i?"cn":"en"}/gamedata/excel/${e}`,x="akstagetowiki_db",N=1,I="gamedata",O=new Promise(e=>{let i,r=globalThis.indexedDB.open(x,N);r.onerror=c=>{console.error("Failed to create indexDB: ",c),e(null)},r.onsuccess=()=>{i=r.result,i.onerror=c=>{console.error("Database error: ",c)},e(i)},r.onupgradeneeded=()=>{i=r.result,i.objectStoreNames.contains(I)||i.createObjectStore(I)}}),R=async(e,i)=>{let r=`${e}-${$}`,c=await O;if(c){let p=c.transaction(I).objectStore(I).get(r),d=await new Promise(S=>{p.onsuccess=()=>{let u=p.result;u&&Date.now()-u.timestamp<j?S(u.map):S(null)},p.onerror=()=>S(null)});if(d)return d}let s=await fetch(k(e,!1)).then(n=>n.json()),o=i(s);if($){let n=await fetch(k(e)).then(t=>t.json());o={...i(n),...o}}if(c){let p=c.transaction(I,"readwrite").objectStore(I).put({timestamp:Date.now(),map:o},r);p.onerror=d=>{console.warn(`Datable erorr: Failed to cache ${r}: `,d)}}return o},w=R("enemy_handbook_table.json",e=>e.enemyData),C=R("item_table.json",e=>e.items),P=R("character_table.json",e=>e),_=R("skill_table.json",e=>e),L=R("stage_table.json",({stages:e,sixStarRuneData:i})=>{let r={};for(let c of Object.values(e)){let s=r[c.code]??={runes:{},stageInfos:[]};s.stageInfos.push(c);let o=[c.advancedRuneIdList1,c.advancedRuneIdList2].flatMap(n=>Object.values(n??{}));for(let n of o){let t=i[n];t?s.runes[n]=t:console.error(`Failed to find rune: ${n} in rune map`)}}return r});var D=document.querySelector("#stage-input"),v=document.querySelector("#convert"),g=document.querySelector("#output"),y=e=>e.replace(/<@lv\.item>( *?)</g,"$1'''<[[").replace(/>( *?)<\/>/g,"]]>'''$1").replace(/\n/g,"<br/>").replace(/\\n/g,"<br/>"),U={ALWAYS:1,ALMOST:2,USUAL:3,OFTEN:4,SOMETIMES:5},G=e=>e.dropType=="COMPLETE"?0:U[e.occPercent],A=async(e,i=void 0)=>{let r=await w,c=await C,s=await P,o=await _,n=await fetch(E+e.levelId.toLowerCase().replace("easy","main")+".json").then(a=>a.json()),t=`{{Operation data
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
`}let S=a=>{let m=s[a.inst.characterKey],l="";if(a.skillIndex>=0){let f=m.skills[a.skillIndex].skillId;l=`, {{Skill|${o[f].levels[a.mainSkillLvl-1].name}}} `,l+=a.mainSkillLvl>7?`Spec. Level ${a.mainSkillLvl-7}`:`Level ${a.mainSkillLvl}`}return`{{C|${m.name}}} (Elite ${a.inst.phase.split("_")[1]} Level ${a.inst.level}${l})`};n.predefines.characterInsts.length&&(t+="|pre = "+n.predefines.characterInsts.map(S).join(", ")+`
`),n.predefines.characterCards.length&&(t+="|comp = "+n.predefines.characterCards.map(a=>"*"+S(a)).join(`
`)+`
`);let u=(a,m)=>{if(!e.stageDropInfo.displayDetailRewards.length)return;let l=e.stageDropInfo.displayDetailRewards.filter(f=>f.dropType==a);if(l.length){t+=`|${m} = `;for(let f of l)t+=`{{I|${c[f.id].name.trim()}|rarity=${G(f)}}}`;t+=`
`}};u("COMPLETE","firstdrop"),u("NORMAL","regdrops"),u("SPECIAL","specdrops"),u("ADDITIONAL","extradrops");let b=a=>a.id in d?d[a.id]:0,h=(a,m)=>{let l=n.enemyDbRefs.filter(f=>r[f.id]?.enemyLevel==a);l.length&&(t+=`|${m} = `,t+=l.sort((f,T)=>b(T)-b(f)).map(f=>`{{E|${r[f.id].name.trim()}${f.id in d?`|${d[f.id]}`:""}}}`).join(", "),t+=`
`)};return h("NORMAL","normal"),h("ELITE","elite"),h("BOSS","boss"),i&&(t+=`|ss1a = ${y(i[e.advancedRuneIdList1[0]].runeDesc)}
`,t+=`|ss1b = ${y(i[e.advancedRuneIdList1[1]].runeDesc)}
`,t+=`|ss2a = ${y(i[e.advancedRuneIdList2[0]].runeDesc)}
`,t+=`|ss2a = ${y(i[e.advancedRuneIdList2[1]].runeDesc)}
`),t=t.trim()+"}}",t};v.addEventListener("click",async e=>{if(e.preventDefault(),D.value=="/reset"){let o=await O;if(o){g.value="Resetting cache";let p=o.transaction(I,"readwrite").objectStore(I).clear();p.onsuccess=()=>{g.value="Cache reset, please refresh"}}return}else if(D.value.startsWith("/enemies")){let o=D.value.split(" ")[1],n=await L,t=Object.keys(n).filter(d=>d.match(o)),p=new Set;for(let[d,S]of t.map((u,b)=>[u,b])){g.value=`Fetching enemies from stages (${S}/${t.length})`;for(let u of n[d].stageInfos){if(!u.levelId)continue;let b=await fetch(E+u.levelId.toLowerCase().replace("easy","main")+".json").then(h=>h.json());for(let h of b.enemyDbRefs)p.add(h.id)}}g.value=Array.from(p).join(", ");return}let i=await L;v.disabled=!0,g.disabled=!0,g.value="Loading, please wait...";let r=i[D.value],c=r?.stageInfos.find(o=>o.difficulty=="NORMAL"&&(o.diffGroup=="NONE"||o.diffGroup=="NORMAL"))??r?.stageInfos[0];if(!c){g.value="Failed to find stage",v.disabled=!1,g.disabled=!1;return}let s=`{{Operation tab}}
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
`,r.stageInfos.length>1){s+="<tabber>";for(let o of r.stageInfos)o.difficulty=="NORMAL"?o.diffGroup=="EASY"?s+="Story Environment":o.diffGroup=="TOUGH"?s+="Adverse Environment":r.stageInfos.find(n=>n.difficulty=="FOUR_STAR")?s+="Normal Mode":r.stageInfos.find(n=>n.difficulty=="SIX_STAR")?s+="Standard Combat":s+="Standard Environment":o.difficulty=="FOUR_STAR"?s+="Challenge Mode":o.difficulty=="SIX_STAR"&&(s+="Adverse Combat"),s+=`=${await A(o)}|-|`,o.difficulty=="SIX_STAR"&&(s+=`Strategic Simulation=${await A(o,r.runes)}|-|`);s=s.replace(/\|-\|$/,"</tabber>")}else s+=await A(c);g.value=s,g.disabled=!1,v.disabled=!1});
