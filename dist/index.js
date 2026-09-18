var y="https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/en/gamedata/levels/",S="https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/en/gamedata/excel/stage_table.json",h="https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/en/gamedata/excel/enemy_handbook_table.json",A="https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/en/gamedata/excel/item_table.json",E=document.querySelector("#stage-input"),u=document.querySelector("#convert"),I=document.querySelector("#output"),R=fetch(h).then(n=>n.json().then(o=>{let s={levelInfo:o.levelInfoList,enemies:{}};return Object.values(o.enemyData).forEach(a=>{s.enemies[a.enemyId]=a}),s})),v=fetch(A).then(n=>n.json().then(o=>{let s={};return Object.values(o.items).forEach(a=>{s[a.itemId]=a}),s})),O=fetch(S).then(n=>n.json().then(o=>{let s={},a={};return Object.values(o.sixStarRuneData).forEach(t=>{s[t.runeId]=t}),Object.values(o.stages).forEach(t=>{t.code in a||(a[t.code]={stageInfos:[],runes:{}}),a[t.code].stageInfos.push(t);let e=i=>{i&&Object.values(i).length>0&&i.forEach(d=>{d in s?a[t.code].runes[d]=s[d]:console.error("Failed to find rune: ",d," in rune map")})};e(t.advancedRuneIdList1),e(t.advancedRuneIdList2)}),a})),c=n=>n.replace(/<@lv\.item>( *?)</g,"$1'''<[[").replace(/>( *?)<\/>/g,"]]>'''$1").replace(`
`,"</br>"),L={ALWAYS:1,ALMOST:2,USUAL:3,OFTEN:4,SOMETIMES:5},M=n=>n.dropType=="COMPLETE"?0:L[n.occPercent],g=async(n,o=void 0)=>{let s=await R,a=await v,t=await fetch(y+n.levelId.toLowerCase().replace("easy","main")+".json").then(f=>f.json()),e=`{{Operation data
`;n.diffGroup=="EASY"||n.diffGroup=="TOUGH"?e+=`|${n.diffGroup=="EASY"?"story":"adverse"} cond = ${c(n.description.split(/Environmental Conditions: *?<\/>\n/).at(-1))}
`:n.difficulty!="NORMAL"&&(e+=`|cond = ${c(n.description.split(/<@lv\.fs>Condition: *?<\/>\n/).at(-1))}
`),n.diffGroup=="TOUGH"&&(e+=`|adverse = true
`),n.difficulty=="FOUR_STAR"&&(e+=`|challenge = true
`),n.dangerLevel&&(e+=`|level = ${n.dangerLevel}
`),e+=`|sanity = ${n.apCost}
`,e+=`|unit limit = ${t.options.characterLimit}
`;let i=0,d={};for(let f of t.waves)for(let p of f.fragments)for(let r of p.actions)r.actionType=="SPAWN"&&(r.key in d||(d[r.key]=0),d[r.key]+=r.count,i+=r.count);e+=`|enemies = ${i}
`,e+=`|lp = ${t.options.maxLifePoint}
`,e+=`|dp = ${t.options.initialCost}
`;let l=(f,p)=>{let r=n.stageDropInfo.displayDetailRewards.filter(m=>m.dropType==f);if(r){e+=`${p} = `;for(let m of r)e+=`{{I|${a[m.id].name}|rarity=${M(m)}}}`;e+=`
`}};return l("COMPLETE","firstdrop"),l("NORMAL","regdrop"),l("SPECIAL","specdrops"),l("ADDITIONAL","extradrops"),o&&(e+=`|ss1a = ${c(o[n.advancedRuneIdList1[0]].runeDesc)}
`,e+=`|ss1b = ${c(o[n.advancedRuneIdList1[1]].runeDesc)}
`,e+=`|ss2a = ${c(o[n.advancedRuneIdList2[0]].runeDesc)}
`,e+=`|ss2a = ${c(o[n.advancedRuneIdList2[1]].runeDesc)}
`),e=e.trim()+"}}",e};u.addEventListener("click",async n=>{n.preventDefault();let o=await O;u.disabled=!0;let s=o[E.value],a=s?.stageInfos.find(e=>e.difficulty=="NORMAL"&&(e.diffGroup=="NONE"||e.diffGroup=="NORMAL"))??s?.stageInfos[0];if(!a){I.value="Failed to find stage",u.disabled=!1;return}let t=`{{Operation tab}}
{{Operation info
`;if(t+=`|code = ${a.code}
`,t+=`|name = ${a.name}
`,t+=`|episode = 
|intermezzo = 
|part = 
|prev = 
|next = 
`,t+=`|desc = ${c(a.description)}}}
`,s.stageInfos.length>1){t+="<tabber>";for(let e of s.stageInfos)e.difficulty=="NORMAL"?e.diffGroup=="EASY"?t+="Story Environment":e.diffGroup=="TOUGH"?t+="Adverse Environment":s.stageInfos.find(i=>i.difficulty=="FOUR_STAR")?t+="Normal Mode":s.stageInfos.find(i=>i.difficulty=="SIX_STAR")?t+="Standard Combat":t+="Standard Environment":e.difficulty=="FOUR_STAR"?t+="Challenge Mode":e.difficulty=="SIX_STAR"&&(t+="Adverse Combat"),t+=`=${await g(e)}|-|`,e.difficulty=="SIX_STAR"&&(t+=`Strategic Simulation=${await g(e,s.runes)}|-|`);t=t.replace(/\|-\|$/,"</tabber>")}else t+=await g(a);I.value=t,u.disabled=!1});
