var x=24*60*60*1e3,P=new URLSearchParams(globalThis.location.search).get("server")??"en",L=["cn","china"].includes(P.toLowerCase());var T=`https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/${P}/gamedata/levels/`,C=(e,c=L)=>`https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/${c?"cn":"en"}/gamedata/excel/${e}`,U="akstagetowiki_db",F=1,h="gamedata",A=new Promise(e=>{let c,o=globalThis.indexedDB.open(U,F);o.onerror=i=>{console.error("Failed to create indexDB: ",i),e(null)},o.onsuccess=()=>{c=o.result,c.onerror=i=>{console.error("Database error: ",i)},e(c)},o.onupgradeneeded=()=>{c=o.result,c.objectStoreNames.contains(h)||c.createObjectStore(h)}}),D=async(e,c)=>{let o=`${e}-${L}`,i=await A;if(i){let g=i.transaction(h).objectStore(h).get(o),f=await new Promise(b=>{g.onsuccess=()=>{let d=g.result;d&&Date.now()-d.timestamp<x?b(d.map):b(null)},g.onerror=()=>b(null)});if(f)return f}let s=await fetch(C(e,!1)).then(a=>a.json()),r=c(s);if(L){let a=await fetch(C(e)).then(t=>t.json());r={...c(a),...r}}if(i){let g=i.transaction(h,"readwrite").objectStore(h).put({timestamp:Date.now(),map:r},o);g.onerror=f=>{console.warn(`Datable erorr: Failed to cache ${o}: `,f)}}return r},w=D("enemy_handbook_table.json",e=>e.enemyData),_=D("item_table.json",e=>e.items),N=D("character_table.json",e=>e),j=D("skill_table.json",e=>e),M=D("stage_table.json",({stages:e,sixStarRuneData:c})=>{let o={};for(let i of Object.values(e)){let s=o[i.code]??={runes:{},stageInfos:[]};s.stageInfos.push(i);let r=[i.advancedRuneIdList1,i.advancedRuneIdList2].flatMap(a=>Object.values(a??{}));for(let a of r){let t=c[a];t?s.runes[a]=t:console.error(`Failed to find rune: ${a} in rune map`)}}return o});var $=document.querySelector("#stage-input"),E=document.querySelector("#convert"),I=document.querySelector("#output"),v=e=>e.replace(/<@lv\.item>( *?)</g,"$1'''<[[").replace(/>( *?)<\/>/g,"]]>'''$1").replace(/\n/g,"<br/>").replace(/\\n/g,"<br/>"),B={ALWAYS:1,ALMOST:2,USUAL:3,OFTEN:4,SOMETIMES:5},G=e=>e.dropType=="COMPLETE"?0:B[e.occPercent],O=e=>e.overwrittenData?.prefabKey.m_defined?e.overwrittenData.prefabKey.m_value??e.id:e.id,k=async(e,c=void 0)=>{let o=await w,i=await _,s=await N,r=await j,a=await fetch(T+e.levelId.toLowerCase().replace("easy","main")+".json").then(n=>n.json()),t=`{{Operation data
`;e.diffGroup=="EASY"||e.diffGroup=="TOUGH"?t+=`|${e.diffGroup=="EASY"?"story":"adverse"} cond = ${v(e.description.split(/Environmental Conditions: *?<\/>\n/).at(-1))}
`:e.difficulty!="NORMAL"&&(t+=`|cond = ${v(e.description.split(/<@lv\.fs>Condition: *?<\/>\n/).at(-1))}
`),e.diffGroup=="TOUGH"&&(t+=`|adverse = true
`),e.difficulty=="FOUR_STAR"&&(t+=`|challenge = true
`),e.dangerLevel&&(t+=`|level = ${e.dangerLevel.replace(/lv\./i,"Level ").replace("\u7CBE\u82F1","Elite ")}
`),t+=`|sanity = ${e.apCost}
`,t+=`|unit limit = ${a.options.characterLimit}
`;let g=0,f={},b=Object.fromEntries(a.enemyDbRefs.map(n=>[n.id,O(n)]));for(let n of a.waves)for(let u of n.fragments)for(let p of u.actions)if(p.actionType=="SPAWN"){let l=b[p.key];l in f||(f[l]=0),f[l]+=p.count,g+=p.count}if(t+=`|enemies = ${g}
`,t+=`|lp = ${a.options.maxLifePoint}
`,t+=`|dp = ${a.options.initialCost}
`,(e.isPredefined||e.isHardPredefined||e.isSkillSelectablePredefined)&&(t+=`|fixed = true
`),a.predefines.tokenCards.length&&(t+="|deployable = "+a.predefines.tokenCards.map(n=>`{{D|${s[n.inst.characterKey].name}|${n.initialCnt}}}`).join(", ")+`
`),a.predefines.tokenInsts.length){let n={};a.predefines.tokenInsts.forEach(u=>{n[u.inst.characterKey]=(n[u.inst.characterKey]??0)+1}),t+="|static = "+Object.entries(n).map(([u,p])=>`{{D|${s[u].name}|${p}}}`).join(", ")+`
`}let d=n=>{let u=s[n.inst.characterKey],p="";if(n.skillIndex>=0){let l=u.skills[n.skillIndex].skillId;p=`, {{Skill|${r[l].levels[n.mainSkillLvl-1].name}}} `,p+=n.mainSkillLvl>7?`Spec. Level ${n.mainSkillLvl-7}`:`Level ${n.mainSkillLvl}`}return`{{C|${u.name}}} (Elite ${n.inst.phase.split("_")[1]} Level ${n.inst.level}${p})`};a.predefines.characterInsts.length&&(t+=`|pre = 
`+a.predefines.characterInsts.map(n=>"*"+d(n)).join(`
`)+`
`),a.predefines.characterCards.length&&(t+=`|comp = 
`+a.predefines.characterCards.map(n=>"*"+d(n)).join(`
`)+`
`);let m=(n,u,p=!0)=>{if(!e.stageDropInfo.displayDetailRewards.length)return;let l=e.stageDropInfo.displayDetailRewards.filter(y=>y.dropType==n);if(l.length){t+=`|${u} = `;for(let y of l)p?t+=`{{I|${i[y.id].name.trim()}|rate=${G(y)}}}`:t+=`{{I|${i[y.id].name.trim()}}}`;t+=`
`}};m("COMPLETE","firstdrop"),m("NORMAL","regdrops"),m("SPECIAL","specdrops"),m("ADDITIONAL","extradrops",!1);let S=n=>n.id in f?f[n.id]:0,R=(n,u)=>{let p=a.enemyDbRefs.filter(l=>o[O(l)]?.enemyLevel==n);p.length&&(t+=`|${u} = `,t+=p.sort((l,y)=>S(y)-S(l)).map(l=>`{{E|${o[O(l)].name.trim()}${l.id in f?`|${f[l.id]}`:""}}}`).join(", "),t+=`
`)};return R("NORMAL","normal"),R("ELITE","elite"),R("BOSS","boss"),c&&(t+=`|ss1a = ${v(c[e.advancedRuneIdList1[0]].runeDesc)}
`,t+=`|ss1b = ${v(c[e.advancedRuneIdList1[1]].runeDesc)}
`,t+=`|ss2a = ${v(c[e.advancedRuneIdList2[0]].runeDesc)}
`,t+=`|ss2b = ${v(c[e.advancedRuneIdList2[1]].runeDesc)}
`),t=t.trim()+"}}",t};E.addEventListener("click",async e=>{if(e.preventDefault(),$.value=="/reset"){let r=await A;if(r){I.value="Resetting cache";let g=r.transaction(h,"readwrite").objectStore(h).clear();g.onsuccess=()=>{I.value="Cache reset, please refresh"}}return}else if($.value.startsWith("/enemies")){let r=$.value.split(" ")[1],a=await M,t=await w,g=Object.keys(a).filter(d=>d.match(r)),f=new Set;for(let[d,m]of g.map((S,R)=>[S,R])){I.value=`Fetching enemies from stages (${m}/${g.length})`;for(let S of a[d].stageInfos){if(!S.levelId)continue;let R=await fetch(T+S.levelId.toLowerCase().replace("easy","main")+".json").then(n=>n.json());for(let n of R.enemyDbRefs)f.add(O(n))}}let b=Array.from(f).map(d=>t[d]??d);I.value="";for(let d of["NORMAL","ELITE","BOSS"]){I.value+=`
==== ${d} ====`;for(let m of b){if(typeof m=="string"){I.value+=`
	ERROR: FAILED TO FIND INFO ON ${m}`;continue}if(m.enemyLevel==d){let S=m.name.replace('"',"").replace(`
`,"");I.value+=`
	["${S}"]={name="${S}"${m.name.match(/"/)?`, title="${m.name.replace('"','\\"').replace(`
`,"")}"`:""}, code="${m.enemyIndex}", id="${m.enemyId}"},`}}}return}let c=await M;E.disabled=!0,I.disabled=!0,I.value="Loading, please wait...";let o=c[$.value],i=o?.stageInfos.find(r=>r.difficulty=="NORMAL"&&(r.diffGroup=="NONE"||r.diffGroup=="NORMAL"))??o?.stageInfos[0];if(!i){I.value="Failed to find stage",E.disabled=!1,I.disabled=!1;return}let s=`{{Operation tab}}
{{Operation info
`;if(s+=`|code = ${i.code}
`,s+=`|name = ${i.name}
`,s+=`|episode = 
|intermezzo = 
|sidestory = 
|storycollection = 
|part = 
|prev = 
|next = 
`,s+=`|desc = ${v(i.description)}
`,s+=`|note = }}
`,o.stageInfos.length>1){s+="<tabber>";for(let r of o.stageInfos)r.difficulty=="NORMAL"?r.diffGroup=="EASY"?s+="Story Environment":r.diffGroup=="TOUGH"?s+="Adverse Environment":o.stageInfos.find(a=>a.difficulty=="FOUR_STAR")?s+="Normal Mode":o.stageInfos.find(a=>a.difficulty=="SIX_STAR")?s+="Standard Combat":s+="Standard Environment":r.difficulty=="FOUR_STAR"?s+="Challenge Mode":r.difficulty=="SIX_STAR"&&(s+="Adverse Combat"),s+=`=${await k(r)}|-|`,r.difficulty=="SIX_STAR"&&(s+=`Strategic Simulation=${await k(r,o.runes)}|-|`);s=s.replace(/\|-\|$/,"</tabber>")}else s+=await k(i);I.value=s,I.disabled=!1,E.disabled=!1});
