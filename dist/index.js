var N=24*60*60*1e3,P=new URLSearchParams(globalThis.location.search).get("server")??"en",O=["cn","china"].includes(P.toLowerCase());var L=`https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/${P}/gamedata/levels/`,C=(e,i=O)=>`https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/${i?"cn":"en"}/gamedata/excel/${e}`,U="akstagetowiki_db",B=1,y="gamedata",T=new Promise(e=>{let i,r=globalThis.indexedDB.open(U,B);r.onerror=c=>{console.error("Failed to create indexDB: ",c),e(null)},r.onsuccess=()=>{i=r.result,i.onerror=c=>{console.error("Database error: ",c)},e(i)},r.onupgradeneeded=()=>{i=r.result,i.objectStoreNames.contains(y)||i.createObjectStore(y)}}),v=async(e,i)=>{let r=`${e}-${O}`,c=await T;if(c){let u=c.transaction(y).objectStore(y).get(r),f=await new Promise(h=>{u.onsuccess=()=>{let m=u.result;m&&Date.now()-m.timestamp<N?h(m.map):h(null)},u.onerror=()=>h(null)});if(f)return f}let s=await fetch(C(e,!1)).then(a=>a.json()),o=i(s);if(O){let a=await fetch(C(e)).then(t=>t.json());o={...i(a),...o}}if(c){let u=c.transaction(y,"readwrite").objectStore(y).put({timestamp:Date.now(),map:o},r);u.onerror=f=>{console.warn(`Datable erorr: Failed to cache ${r}: `,f)}}return o},A=v("enemy_handbook_table.json",e=>e.enemyData),_=v("item_table.json",e=>e.items),j=v("character_table.json",e=>e),x=v("skill_table.json",e=>e),w=v("stage_table.json",({stages:e,sixStarRuneData:i})=>{let r={};for(let c of Object.values(e)){let s=r[c.code]??={runes:{},stageInfos:[]};s.stageInfos.push(c);let o=[c.advancedRuneIdList1,c.advancedRuneIdList2].flatMap(a=>Object.values(a??{}));for(let a of o){let t=i[a];t?s.runes[a]=t:console.error(`Failed to find rune: ${a} in rune map`)}}return r});var D=document.querySelector("#stage-input"),$=document.querySelector("#convert"),I=document.querySelector("#output"),R=e=>e.replace(/<@lv\.item>( *?)</g,"$1'''<[[").replace(/>( *?)<\/>/g,"]]>'''$1").replace(/\n/g,"<br/>").replace(/\\n/g,"<br/>"),G={ALWAYS:1,ALMOST:2,USUAL:3,OFTEN:4,SOMETIMES:5},F=e=>e.dropType=="COMPLETE"?0:G[e.occPercent],E=e=>e.overwrittenData?.prefabKey.m_defined?e.overwrittenData.prefabKey.m_value??e.id:e.id,M=async(e,i=void 0)=>{let r=await A,c=await _,s=await j,o=await x,a=await fetch(L+e.levelId.toLowerCase().replace("easy","main")+".json").then(n=>n.json()),t=`{{Operation data
`;e.diffGroup=="EASY"||e.diffGroup=="TOUGH"?t+=`|${e.diffGroup=="EASY"?"story":"adverse"} cond = ${R(e.description.split(/Environmental Conditions: *?<\/>\n/).at(-1))}
`:e.difficulty!="NORMAL"&&(t+=`|cond = ${R(e.description.split(/<@lv\.fs>Condition: *?<\/>\n/).at(-1))}
`),e.diffGroup=="TOUGH"&&(t+=`|adverse = true
`),e.difficulty=="FOUR_STAR"&&(t+=`|challenge = true
`),e.dangerLevel&&(t+=`|level = ${e.dangerLevel}
`),t+=`|sanity = ${e.apCost}
`,t+=`|unit limit = ${a.options.characterLimit}
`;let u=0,f={},h=Object.fromEntries(a.enemyDbRefs.map(n=>[n.id,E(n)]));for(let n of a.waves)for(let p of n.fragments)for(let d of p.actions)if(d.actionType=="SPAWN"){let l=h[d.key];console.log(d.key,l,d.count),l in f||(f[l]=0),f[l]+=d.count,u+=d.count}if(console.log(f),t+=`|enemies = ${u}
`,t+=`|lp = ${a.options.maxLifePoint}
`,t+=`|dp = ${a.options.initialCost}
`,(e.isPredefined||e.isHardPredefined||e.isSkillSelectablePredefined)&&(t+=`|fixed = true
`),a.predefines.tokenCards.length&&(t+="|deployable = "+a.predefines.tokenCards.map(n=>`{{D|${s[n.inst.characterKey].name}|${n.initialCnt}}}`).join(", ")+`
`),a.predefines.tokenInsts.length){let n={};a.predefines.tokenInsts.forEach(p=>{n[p.inst.characterKey]=(n[p.inst.characterKey]??0)+1}),t+="|static = "+Object.entries(n).map(([p,d])=>`{{D|${s[p].name}|${d}}}`).join(", ")+`
`}let m=n=>{let p=s[n.inst.characterKey],d="";if(n.skillIndex>=0){let l=p.skills[n.skillIndex].skillId;d=`, {{Skill|${o[l].levels[n.mainSkillLvl-1].name}}} `,d+=n.mainSkillLvl>7?`Spec. Level ${n.mainSkillLvl-7}`:`Level ${n.mainSkillLvl}`}return`{{C|${p.name}}} (Elite ${n.inst.phase.split("_")[1]} Level ${n.inst.level}${d})`};a.predefines.characterInsts.length&&(t+="|pre = "+a.predefines.characterInsts.map(m).join(", ")+`
`),a.predefines.characterCards.length&&(t+=`|comp = 
`+a.predefines.characterCards.map(n=>"*"+m(n)).join(`
`)+`
`);let g=(n,p)=>{if(!e.stageDropInfo.displayDetailRewards.length)return;let d=e.stageDropInfo.displayDetailRewards.filter(l=>l.dropType==n);if(d.length){t+=`|${p} = `;for(let l of d)t+=`{{I|${c[l.id].name.trim()}|rarity=${F(l)}}}`;t+=`
`}};g("COMPLETE","firstdrop"),g("NORMAL","regdrops"),g("SPECIAL","specdrops"),g("ADDITIONAL","extradrops");let S=n=>n.id in f?f[n.id]:0,b=(n,p)=>{let d=a.enemyDbRefs.filter(l=>r[E(l)]?.enemyLevel==n);d.length&&(t+=`|${p} = `,t+=d.sort((l,k)=>S(k)-S(l)).map(l=>`{{E|${r[E(l)].name.trim()}${l.id in f?`|${f[l.id]}`:""}}}`).join(", "),t+=`
`)};return b("NORMAL","normal"),b("ELITE","elite"),b("BOSS","boss"),i&&(t+=`|ss1a = ${R(i[e.advancedRuneIdList1[0]].runeDesc)}
`,t+=`|ss1b = ${R(i[e.advancedRuneIdList1[1]].runeDesc)}
`,t+=`|ss2a = ${R(i[e.advancedRuneIdList2[0]].runeDesc)}
`,t+=`|ss2a = ${R(i[e.advancedRuneIdList2[1]].runeDesc)}
`),t=t.trim()+"}}",t};$.addEventListener("click",async e=>{if(e.preventDefault(),D.value=="/reset"){let o=await T;if(o){I.value="Resetting cache";let u=o.transaction(y,"readwrite").objectStore(y).clear();u.onsuccess=()=>{I.value="Cache reset, please refresh"}}return}else if(D.value.startsWith("/enemies")){let o=D.value.split(" ")[1],a=await w,t=await A,u=Object.keys(a).filter(m=>m.match(o)),f=new Set;for(let[m,g]of u.map((S,b)=>[S,b])){I.value=`Fetching enemies from stages (${g}/${u.length})`;for(let S of a[m].stageInfos){if(!S.levelId)continue;let b=await fetch(L+S.levelId.toLowerCase().replace("easy","main")+".json").then(n=>n.json());for(let n of b.enemyDbRefs)f.add(E(n))}}let h=Array.from(f).map(m=>t[m]);I.value="";for(let m of["NORMAL","ELITE","BOSS"]){I.value+=`
==== ${m} ====`;for(let g of h)if(g.enemyLevel==m){let S=g.name.replace('"',"").replace(`
`,"");I.value+=`
	["${S}"]={name="${S}"${g.name.match(/"/)?`, title="${g.name.replace('"','\\"').replace(`
`,"")}"`:""}, code="${g.enemyIndex}", id="${g.enemyId}"},`}}return}let i=await w;$.disabled=!0,I.disabled=!0,I.value="Loading, please wait...";let r=i[D.value],c=r?.stageInfos.find(o=>o.difficulty=="NORMAL"&&(o.diffGroup=="NONE"||o.diffGroup=="NORMAL"))??r?.stageInfos[0];if(!c){I.value="Failed to find stage",$.disabled=!1,I.disabled=!1;return}let s=`{{Operation tab}}
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
`,r.stageInfos.length>1){s+="<tabber>";for(let o of r.stageInfos)o.difficulty=="NORMAL"?o.diffGroup=="EASY"?s+="Story Environment":o.diffGroup=="TOUGH"?s+="Adverse Environment":r.stageInfos.find(a=>a.difficulty=="FOUR_STAR")?s+="Normal Mode":r.stageInfos.find(a=>a.difficulty=="SIX_STAR")?s+="Standard Combat":s+="Standard Environment":o.difficulty=="FOUR_STAR"?s+="Challenge Mode":o.difficulty=="SIX_STAR"&&(s+="Adverse Combat"),s+=`=${await M(o)}|-|`,o.difficulty=="SIX_STAR"&&(s+=`Strategic Simulation=${await M(o,r.runes)}|-|`);s=s.replace(/\|-\|$/,"</tabber>")}else s+=await M(c);I.value=s,I.disabled=!1,$.disabled=!1});
