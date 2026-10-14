var x=24*60*60*1e3,P=new URLSearchParams(globalThis.location.search).get("server")??"en",O=["cn","china"].includes(P.toLowerCase());var L=`https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/${P}/gamedata/levels/`,C=(e,i=O)=>`https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/${i?"cn":"en"}/gamedata/excel/${e}`,U="akstagetowiki_db",F=1,h="gamedata",T=new Promise(e=>{let i,o=globalThis.indexedDB.open(U,F);o.onerror=c=>{console.error("Failed to create indexDB: ",c),e(null)},o.onsuccess=()=>{i=o.result,i.onerror=c=>{console.error("Database error: ",c)},e(i)},o.onupgradeneeded=()=>{i=o.result,i.objectStoreNames.contains(h)||i.createObjectStore(h)}}),v=async(e,i)=>{let o=`${e}-${O}`,c=await T;if(c){let g=c.transaction(h).objectStore(h).get(o),m=await new Promise(y=>{g.onsuccess=()=>{let d=g.result;d&&Date.now()-d.timestamp<x?y(d.map):y(null)},g.onerror=()=>y(null)});if(m)return m}let s=await fetch(C(e,!1)).then(a=>a.json()),r=i(s);if(O){let a=await fetch(C(e)).then(t=>t.json());r={...i(a),...r}}if(c){let g=c.transaction(h,"readwrite").objectStore(h).put({timestamp:Date.now(),map:r},o);g.onerror=m=>{console.warn(`Datable erorr: Failed to cache ${o}: `,m)}}return r},A=v("enemy_handbook_table.json",e=>e.enemyData),_=v("item_table.json",e=>e.items),N=v("character_table.json",e=>e),j=v("skill_table.json",e=>e),w=v("stage_table.json",({stages:e,sixStarRuneData:i})=>{let o={};for(let c of Object.values(e)){let s=o[c.code]??={runes:{},stageInfos:[]};s.stageInfos.push(c);let r=[c.advancedRuneIdList1,c.advancedRuneIdList2].flatMap(a=>Object.values(a??{}));for(let a of r){let t=i[a];t?s.runes[a]=t:console.error(`Failed to find rune: ${a} in rune map`)}}return o});var D=document.querySelector("#stage-input"),E=document.querySelector("#convert"),I=document.querySelector("#output"),R=e=>e.replace(/<@lv\.item>( *?)</g,"$1'''<[[").replace(/>( *?)<\/>/g,"]]>'''$1").replace(/\n/g,"<br/>").replace(/\\n/g,"<br/>"),B={ALWAYS:1,ALMOST:2,USUAL:3,OFTEN:4,SOMETIMES:5},G=e=>e.dropType=="COMPLETE"?0:B[e.occPercent],$=e=>e.overwrittenData?.prefabKey.m_defined?e.overwrittenData.prefabKey.m_value??e.id:e.id,M=async(e,i=void 0)=>{let o=await A,c=await _,s=await N,r=await j,a=await fetch(L+e.levelId.toLowerCase().replace("easy","main")+".json").then(n=>n.json()),t=`{{Operation data
`;e.diffGroup=="EASY"||e.diffGroup=="TOUGH"?t+=`|${e.diffGroup=="EASY"?"story":"adverse"} cond = ${R(e.description.split(/Environmental Conditions: *?<\/>\n/).at(-1))}
`:e.difficulty!="NORMAL"&&(t+=`|cond = ${R(e.description.split(/<@lv\.fs>Condition: *?<\/>\n/).at(-1))}
`),e.diffGroup=="TOUGH"&&(t+=`|adverse = true
`),e.difficulty=="FOUR_STAR"&&(t+=`|challenge = true
`),e.dangerLevel&&(t+=`|level = ${e.dangerLevel.replace(/lv\./i,"Level ").replace("\u7CBE\u82F1","Elite ")}
`),t+=`|sanity = ${e.apCost}
`,t+=`|unit limit = ${a.options.characterLimit}
`;let g=0,m={},y=Object.fromEntries(a.enemyDbRefs.map(n=>[n.id,$(n)]));for(let n of a.waves)for(let u of n.fragments)for(let f of u.actions)if(f.actionType=="SPAWN"){let l=y[f.key];l in m||(m[l]=0),m[l]+=f.count,g+=f.count}if(t+=`|enemies = ${g}
`,t+=`|lp = ${a.options.maxLifePoint}
`,t+=`|dp = ${a.options.initialCost}
`,(e.isPredefined||e.isHardPredefined||e.isSkillSelectablePredefined)&&(t+=`|fixed = true
`),a.predefines.tokenCards.length&&(t+="|deployable = "+a.predefines.tokenCards.map(n=>`{{D|${s[n.inst.characterKey].name}|${n.initialCnt}}}`).join(", ")+`
`),a.predefines.tokenInsts.length){let n={};a.predefines.tokenInsts.forEach(u=>{n[u.inst.characterKey]=(n[u.inst.characterKey]??0)+1}),t+="|static = "+Object.entries(n).map(([u,f])=>`{{D|${s[u].name}|${f}}}`).join(", ")+`
`}let d=n=>{let u=s[n.inst.characterKey],f="";if(n.skillIndex>=0){let l=u.skills[n.skillIndex].skillId;f=`, {{Skill|${r[l].levels[n.mainSkillLvl-1].name}}} `,f+=n.mainSkillLvl>7?`Spec. Level ${n.mainSkillLvl-7}`:`Level ${n.mainSkillLvl}`}return`{{C|${u.name}}} (Elite ${n.inst.phase.split("_")[1]} Level ${n.inst.level}${f})`};a.predefines.characterInsts.length&&(t+=`|pre = 
`+a.predefines.characterInsts.map(n=>"*"+d(n)).join(`
`)+`
`),a.predefines.characterCards.length&&(t+=`|comp = 
`+a.predefines.characterCards.map(n=>"*"+d(n)).join(`
`)+`
`);let p=(n,u)=>{if(!e.stageDropInfo.displayDetailRewards.length)return;let f=e.stageDropInfo.displayDetailRewards.filter(l=>l.dropType==n);if(f.length){t+=`|${u} = `;for(let l of f)t+=`{{I|${c[l.id].name.trim()}|rate=${G(l)}}}`;t+=`
`}};p("COMPLETE","firstdrop"),p("NORMAL","regdrops"),p("SPECIAL","specdrops"),p("ADDITIONAL","extradrops");let S=n=>n.id in m?m[n.id]:0,b=(n,u)=>{let f=a.enemyDbRefs.filter(l=>o[$(l)]?.enemyLevel==n);f.length&&(t+=`|${u} = `,t+=f.sort((l,k)=>S(k)-S(l)).map(l=>`{{E|${o[$(l)].name.trim()}${l.id in m?`|${m[l.id]}`:""}}}`).join(", "),t+=`
`)};return b("NORMAL","normal"),b("ELITE","elite"),b("BOSS","boss"),i&&(t+=`|ss1a = ${R(i[e.advancedRuneIdList1[0]].runeDesc)}
`,t+=`|ss1b = ${R(i[e.advancedRuneIdList1[1]].runeDesc)}
`,t+=`|ss2a = ${R(i[e.advancedRuneIdList2[0]].runeDesc)}
`,t+=`|ss2a = ${R(i[e.advancedRuneIdList2[1]].runeDesc)}
`),t=t.trim()+"}}",t};E.addEventListener("click",async e=>{if(e.preventDefault(),D.value=="/reset"){let r=await T;if(r){I.value="Resetting cache";let g=r.transaction(h,"readwrite").objectStore(h).clear();g.onsuccess=()=>{I.value="Cache reset, please refresh"}}return}else if(D.value.startsWith("/enemies")){let r=D.value.split(" ")[1],a=await w,t=await A,g=Object.keys(a).filter(d=>d.match(r)),m=new Set;for(let[d,p]of g.map((S,b)=>[S,b])){I.value=`Fetching enemies from stages (${p}/${g.length})`;for(let S of a[d].stageInfos){if(!S.levelId)continue;let b=await fetch(L+S.levelId.toLowerCase().replace("easy","main")+".json").then(n=>n.json());for(let n of b.enemyDbRefs)m.add($(n))}}let y=Array.from(m).map(d=>t[d]??d);I.value="";for(let d of["NORMAL","ELITE","BOSS"]){I.value+=`
==== ${d} ====`;for(let p of y){if(typeof p=="string"){I.value+=`
	ERROR: FAILED TO FIND INFO ON ${p}`;continue}if(p.enemyLevel==d){let S=p.name.replace('"',"").replace(`
`,"");I.value+=`
	["${S}"]={name="${S}"${p.name.match(/"/)?`, title="${p.name.replace('"','\\"').replace(`
`,"")}"`:""}, code="${p.enemyIndex}", id="${p.enemyId}"},`}}}return}let i=await w;E.disabled=!0,I.disabled=!0,I.value="Loading, please wait...";let o=i[D.value],c=o?.stageInfos.find(r=>r.difficulty=="NORMAL"&&(r.diffGroup=="NONE"||r.diffGroup=="NORMAL"))??o?.stageInfos[0];if(!c){I.value="Failed to find stage",E.disabled=!1,I.disabled=!1;return}let s=`{{Operation tab}}
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
`,s+=`|desc = ${R(c.description)}
`,s+=`|note = }}
`,o.stageInfos.length>1){s+="<tabber>";for(let r of o.stageInfos)r.difficulty=="NORMAL"?r.diffGroup=="EASY"?s+="Story Environment":r.diffGroup=="TOUGH"?s+="Adverse Environment":o.stageInfos.find(a=>a.difficulty=="FOUR_STAR")?s+="Normal Mode":o.stageInfos.find(a=>a.difficulty=="SIX_STAR")?s+="Standard Combat":s+="Standard Environment":r.difficulty=="FOUR_STAR"?s+="Challenge Mode":r.difficulty=="SIX_STAR"&&(s+="Adverse Combat"),s+=`=${await M(r)}|-|`,r.difficulty=="SIX_STAR"&&(s+=`Strategic Simulation=${await M(r,o.runes)}|-|`);s=s.replace(/\|-\|$/,"</tabber>")}else s+=await M(c);I.value=s,I.disabled=!1,E.disabled=!1});
