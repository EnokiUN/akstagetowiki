var j=24*60*60*1e3,w=new URLSearchParams(globalThis.location.search).get("server")??"en",D=["cn","china"].includes(w.toLowerCase());var E=`https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/${w}/gamedata/levels/`,k=(e,i=D)=>`https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/${i?"cn":"en"}/gamedata/excel/${e}`,x="akstagetowiki_db",N=1,h="gamedata",O=new Promise(e=>{let i,o=globalThis.indexedDB.open(x,N);o.onerror=c=>{console.error("Failed to create indexDB: ",c),e(null)},o.onsuccess=()=>{i=o.result,i.onerror=c=>{console.error("Database error: ",c)},e(i)},o.onupgradeneeded=()=>{i=o.result,i.objectStoreNames.contains(h)||i.createObjectStore(h)}}),$=async(e,i)=>{let o=`${e}-${D}`,c=await O;if(c){let u=c.transaction(h).objectStore(h).get(o),m=await new Promise(y=>{u.onsuccess=()=>{let f=u.result;f&&Date.now()-f.timestamp<j?y(f.map):y(null)},u.onerror=()=>y(null)});if(m)return m}let s=await fetch(k(e,!1)).then(n=>n.json()),r=i(s);if(D){let n=await fetch(k(e)).then(t=>t.json());r={...i(n),...r}}if(c){let u=c.transaction(h,"readwrite").objectStore(h).put({timestamp:Date.now(),map:r},o);u.onerror=m=>{console.warn(`Datable erorr: Failed to cache ${o}: `,m)}}return r},L=$("enemy_handbook_table.json",e=>e.enemyData),_=$("item_table.json",e=>e.items),C=$("character_table.json",e=>e),P=$("skill_table.json",e=>e),T=$("stage_table.json",({stages:e,sixStarRuneData:i})=>{let o={};for(let c of Object.values(e)){let s=o[c.code]??={runes:{},stageInfos:[]};s.stageInfos.push(c);let r=[c.advancedRuneIdList1,c.advancedRuneIdList2].flatMap(n=>Object.values(n??{}));for(let n of r){let t=i[n];t?s.runes[n]=t:console.error(`Failed to find rune: ${n} in rune map`)}}return o});var R=document.querySelector("#stage-input"),v=document.querySelector("#convert"),g=document.querySelector("#output"),b=e=>e.replace(/<@lv\.item>( *?)</g,"$1'''<[[").replace(/>( *?)<\/>/g,"]]>'''$1").replace(/\n/g,"<br/>").replace(/\\n/g,"<br/>"),U={ALWAYS:1,ALMOST:2,USUAL:3,OFTEN:4,SOMETIMES:5},B=e=>e.dropType=="COMPLETE"?0:U[e.occPercent],A=async(e,i=void 0)=>{let o=await L,c=await _,s=await C,r=await P,n=await fetch(E+e.levelId.toLowerCase().replace("easy","main")+".json").then(a=>a.json()),t=`{{Operation data
`;e.diffGroup=="EASY"||e.diffGroup=="TOUGH"?t+=`|${e.diffGroup=="EASY"?"story":"adverse"} cond = ${b(e.description.split(/Environmental Conditions: *?<\/>\n/).at(-1))}
`:e.difficulty!="NORMAL"&&(t+=`|cond = ${b(e.description.split(/<@lv\.fs>Condition: *?<\/>\n/).at(-1))}
`),e.diffGroup=="TOUGH"&&(t+=`|adverse = true
`),e.difficulty=="FOUR_STAR"&&(t+=`|challenge = true
`),e.dangerLevel&&(t+=`|level = ${e.dangerLevel}
`),t+=`|sanity = ${e.apCost}
`,t+=`|unit limit = ${n.options.characterLimit}
`;let u=0,m={};for(let a of n.waves)for(let l of a.fragments)for(let d of l.actions)d.actionType=="SPAWN"&&(d.key in m||(m[d.key]=0),m[d.key]+=d.count,u+=d.count);if(t+=`|enemies = ${u}
`,t+=`|lp = ${n.options.maxLifePoint}
`,t+=`|dp = ${n.options.initialCost}
`,(e.isPredefined||e.isHardPredefined||e.isSkillSelectablePredefined)&&(t+=`|fixed = true
`),n.predefines.tokenCards.length&&(t+="|deployable = "+n.predefines.tokenCards.map(a=>`{{D|${s[a.inst.characterKey].name}|${a.initialCnt}}}`).join(", ")+`
`),n.predefines.tokenInsts.length){let a={};n.predefines.tokenInsts.forEach(l=>{a[l.inst.characterKey]=(a[l.inst.characterKey]??0)+1}),t+="|static = "+Object.entries(a).map(([l,d])=>`{{D|${s[l].name}|${d}}}`).join(", ")+`
`}let y=a=>{let l=s[a.inst.characterKey],d="";if(a.skillIndex>=0){let p=l.skills[a.skillIndex].skillId;d=`, {{Skill|${r[p].levels[a.mainSkillLvl-1].name}}} `,d+=a.mainSkillLvl>7?`Spec. Level ${a.mainSkillLvl-7}`:`Level ${a.mainSkillLvl}`}return`{{C|${l.name}}} (Elite ${a.inst.phase.split("_")[1]} Level ${a.inst.level}${d})`};n.predefines.characterInsts.length&&(t+="|pre = "+n.predefines.characterInsts.map(y).join(", ")+`
`),n.predefines.characterCards.length&&(t+=`|comp = 
`+n.predefines.characterCards.map(a=>"*"+y(a)).join(`
`)+`
`);let f=(a,l)=>{if(!e.stageDropInfo.displayDetailRewards.length)return;let d=e.stageDropInfo.displayDetailRewards.filter(p=>p.dropType==a);if(d.length){t+=`|${l} = `;for(let p of d)t+=`{{I|${c[p.id].name.trim()}|rarity=${B(p)}}}`;t+=`
`}};f("COMPLETE","firstdrop"),f("NORMAL","regdrops"),f("SPECIAL","specdrops"),f("ADDITIONAL","extradrops");let I=a=>a.id in m?m[a.id]:0,S=(a,l)=>{let d=n.enemyDbRefs.filter(p=>o[p.id.replace(/_a$/,"_2")]?.enemyLevel==a);d.length&&(t+=`|${l} = `,t+=d.sort((p,M)=>I(M)-I(p)).map(p=>`{{E|${o[p.id.replace(/_a$/,"_2")].name.trim()}${p.id in m?`|${m[p.id]}`:""}}}`).join(", "),t+=`
`)};return S("NORMAL","normal"),S("ELITE","elite"),S("BOSS","boss"),i&&(t+=`|ss1a = ${b(i[e.advancedRuneIdList1[0]].runeDesc)}
`,t+=`|ss1b = ${b(i[e.advancedRuneIdList1[1]].runeDesc)}
`,t+=`|ss2a = ${b(i[e.advancedRuneIdList2[0]].runeDesc)}
`,t+=`|ss2a = ${b(i[e.advancedRuneIdList2[1]].runeDesc)}
`),t=t.trim()+"}}",t};v.addEventListener("click",async e=>{if(e.preventDefault(),R.value=="/reset"){let r=await O;if(r){g.value="Resetting cache";let u=r.transaction(h,"readwrite").objectStore(h).clear();u.onsuccess=()=>{g.value="Cache reset, please refresh"}}return}else if(R.value.startsWith("/enemies")){let r=R.value.split(" ")[1],n=await T,t=await L,u=Object.keys(n).filter(f=>f.match(r)),m=new Set;for(let[f,I]of u.map((S,a)=>[S,a])){g.value=`Fetching enemies from stages (${I}/${u.length})`;for(let S of n[f].stageInfos){if(!S.levelId)continue;let a=await fetch(E+S.levelId.toLowerCase().replace("easy","main")+".json").then(l=>l.json());for(let l of a.enemyDbRefs)m.add(l.id)}}let y=Array.from(m).map(f=>t[f.replace(/_a$/,"_2")]);g.value="";for(let f of["NORMAL","ELITE","BOSS"]){g.value+=`
==== ${f} ====`;for(let I of y)if(I.enemyLevel==f){let S=I.name.replace('"',"").replace(`
`,"");g.value+=`
	["${S}"]={name="${S}"${I.name.match(/"/)?`, title="${I.name.replace('"','\\"').replace(`
`,"")}"`:""}, code="${I.enemyIndex}", id="${I.enemyId}"},`}}return}let i=await T;v.disabled=!0,g.disabled=!0,g.value="Loading, please wait...";let o=i[R.value],c=o?.stageInfos.find(r=>r.difficulty=="NORMAL"&&(r.diffGroup=="NONE"||r.diffGroup=="NORMAL"))??o?.stageInfos[0];if(!c){g.value="Failed to find stage",v.disabled=!1,g.disabled=!1;return}let s=`{{Operation tab}}
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
`,s+=`|desc = ${b(c.description)}
`,s+=`|note = }}
`,o.stageInfos.length>1){s+="<tabber>";for(let r of o.stageInfos)r.difficulty=="NORMAL"?r.diffGroup=="EASY"?s+="Story Environment":r.diffGroup=="TOUGH"?s+="Adverse Environment":o.stageInfos.find(n=>n.difficulty=="FOUR_STAR")?s+="Normal Mode":o.stageInfos.find(n=>n.difficulty=="SIX_STAR")?s+="Standard Combat":s+="Standard Environment":r.difficulty=="FOUR_STAR"?s+="Challenge Mode":r.difficulty=="SIX_STAR"&&(s+="Adverse Combat"),s+=`=${await A(r)}|-|`,r.difficulty=="SIX_STAR"&&(s+=`Strategic Simulation=${await A(r,o.runes)}|-|`);s=s.replace(/\|-\|$/,"</tabber>")}else s+=await A(c);g.value=s,g.disabled=!1,v.disabled=!1});
