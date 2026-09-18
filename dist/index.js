var A="https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/en/gamedata/levels/",E="https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/en/gamedata/excel/stage_table.json",O="https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/en/gamedata/excel/enemy_handbook_table.json",v="https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/en/gamedata/excel/item_table.json",L=document.querySelector("#stage-input"),p=document.querySelector("#convert"),S=document.querySelector("#output"),b=fetch(O).then(n=>n.json().then(i=>{let a={};return Object.values(i.enemyData).forEach(s=>{a[s.enemyId]=s}),a})),D=fetch(v).then(n=>n.json().then(i=>{let a={};return Object.values(i.items).forEach(s=>{a[s.itemId]=s}),a})),T=fetch(E).then(n=>n.json().then(i=>{let a={},s={};return Object.values(i.sixStarRuneData).forEach(t=>{a[t.runeId]=t}),Object.values(i.stages).forEach(t=>{t.code in s||(s[t.code]={stageInfos:[],runes:{}}),s[t.code].stageInfos.push(t);let e=d=>{d&&Object.values(d).length>0&&d.forEach(o=>{o in a?s[t.code].runes[o]=a[o]:console.error("Failed to find rune: ",o," in rune map")})};e(t.advancedRuneIdList1),e(t.advancedRuneIdList2)}),s})),l=n=>n.replace(/<@lv\.item>( *?)</g,"$1'''<[[").replace(/>( *?)<\/>/g,"]]>'''$1").replace(`
`,"</br>"),M={ALWAYS:1,ALMOST:2,USUAL:3,OFTEN:4,SOMETIMES:5},$=n=>n.dropType=="COMPLETE"?0:M[n.occPercent],I=async(n,i=void 0)=>{let a=await b,s=await D,t=await fetch(A+n.levelId.toLowerCase().replace("easy","main")+".json").then(c=>c.json()),e=`{{Operation data
`;n.diffGroup=="EASY"||n.diffGroup=="TOUGH"?e+=`|${n.diffGroup=="EASY"?"story":"adverse"} cond = ${l(n.description.split(/Environmental Conditions: *?<\/>\n/).at(-1))}
`:n.difficulty!="NORMAL"&&(e+=`|cond = ${l(n.description.split(/<@lv\.fs>Condition: *?<\/>\n/).at(-1))}
`),n.diffGroup=="TOUGH"&&(e+=`|adverse = true
`),n.difficulty=="FOUR_STAR"&&(e+=`|challenge = true
`),n.dangerLevel&&(e+=`|level = ${n.dangerLevel}
`),e+=`|sanity = ${n.apCost}
`,e+=`|unit limit = ${t.options.characterLimit}
`;let d=0,o={};for(let c of t.waves)for(let m of c.fragments)for(let r of m.actions)r.actionType=="SPAWN"&&(r.key in o||(o[r.key]=0),o[r.key]+=r.count,d+=r.count);e+=`|enemies = ${d}
`,e+=`|lp = ${t.options.maxLifePoint}
`,e+=`|dp = ${t.options.initialCost}
`;let u=(c,m)=>{let r=n.stageDropInfo.displayDetailRewards.filter(f=>f.dropType==c);if(r.length){e+=`|${m} = `;for(let f of r)e+=`{{I|${s[f.id].name}|rarity=${$(f)}}}`;e+=`
`}};u("COMPLETE","firstdrop"),u("NORMAL","regdrop"),u("SPECIAL","specdrops"),u("ADDITIONAL","extradrops");let h=c=>c.id in o?o[c.id]:0,g=(c,m)=>{let r=t.enemyDbRefs.filter(f=>a[f.id]?.enemyLevel==c);if(r.length){e+=`|${m} = `;for(let f of r.sort((y,R)=>h(R)-h(y)))e+=`{{E|${a[f.id].name}${f.id in o?`|${o[f.id]}`:""}}}`;e+=`
`}};return g("NORMAL","normal"),g("ELITE","elite"),g("BOSS","boss"),i&&(e+=`|ss1a = ${l(i[n.advancedRuneIdList1[0]].runeDesc)}
`,e+=`|ss1b = ${l(i[n.advancedRuneIdList1[1]].runeDesc)}
`,e+=`|ss2a = ${l(i[n.advancedRuneIdList2[0]].runeDesc)}
`,e+=`|ss2a = ${l(i[n.advancedRuneIdList2[1]].runeDesc)}
`),e=e.trim()+"}}",e};p.addEventListener("click",async n=>{n.preventDefault();let i=await T;p.disabled=!0;let a=i[L.value],s=a?.stageInfos.find(e=>e.difficulty=="NORMAL"&&(e.diffGroup=="NONE"||e.diffGroup=="NORMAL"))??a?.stageInfos[0];if(!s){S.value="Failed to find stage",p.disabled=!1;return}let t=`{{Operation tab}}
{{Operation info
`;if(t+=`|code = ${s.code}
`,t+=`|name = ${s.name}
`,t+=`|episode = 
|intermezzo = 
|part = 
|prev = 
|next = 
`,t+=`|desc = ${l(s.description)}}}
`,a.stageInfos.length>1){t+="<tabber>";for(let e of a.stageInfos)e.difficulty=="NORMAL"?e.diffGroup=="EASY"?t+="Story Environment":e.diffGroup=="TOUGH"?t+="Adverse Environment":a.stageInfos.find(d=>d.difficulty=="FOUR_STAR")?t+="Normal Mode":a.stageInfos.find(d=>d.difficulty=="SIX_STAR")?t+="Standard Combat":t+="Standard Environment":e.difficulty=="FOUR_STAR"?t+="Challenge Mode":e.difficulty=="SIX_STAR"&&(t+="Adverse Combat"),t+=`=${await I(e)}|-|`,e.difficulty=="SIX_STAR"&&(t+=`Strategic Simulation=${await I(e,a.runes)}|-|`);t=t.replace(/\|-\|$/,"</tabber>")}else t+=await I(s);S.value=t,p.disabled=!1});
