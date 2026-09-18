var p="https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/en/gamedata/levels/",g="https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/en/gamedata/excel/stage_table.json",I="https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/en/gamedata/excel/enemy_handbook_table.json",v=document.querySelector("#stage-input"),f=document.querySelector("#convert"),u=document.querySelector("#output"),S=fetch(I).then(n=>n.json().then(s=>{let o={levelInfo:s.levelInfoList,enemies:{}};return Object.values(s.enemyData).forEach(t=>{o.enemies[t.enemyId]=t}),o})),y=fetch(g).then(n=>n.json().then(s=>{let o={},t={};return Object.values(s.sixStarRuneData).forEach(e=>{o[e.runeId]=e}),Object.values(s.stages).forEach(e=>{e.code in t||(t[e.code]={stageInfos:[],runes:{}}),t[e.code].stageInfos.push(e);let a=i=>{i&&Object.values(i).length>0&&i.forEach(r=>{r in o?t[e.code].runes[r]=o[r]:console.error("Failed to find rune: ",r," in rune map")})};a(e.advancedRuneIdList1),a(e.advancedRuneIdList2)}),t})),d=n=>n.replace(/<@lv\.item>( *?)</g,"$1'''<[[").replace(/>( *?)<\/>/g,"]]>'''$1").replace(`
`,"</br>"),l=async(n,s=void 0)=>{let o=await S,t=await fetch(p+n.levelId.toLowerCase()+".json").then(r=>r.json()),e=`{{Operation data
`;n.diffGroup=="EASY"||n.diffGroup=="TOUGH"?e+=`|${n.diffGroup=="EASY"?"story":"adverse"} cond = ${d(n.description.split(/Environmental Conditions: *?<\/>\n/).at(-1))}
`:n.difficulty!="NORMAL"&&(e+=`|cond = ${d(n.description.split(/<@lv\.fs>Condition: *?<\/>\n/).at(-1))}
`),n.diffGroup=="TOUGH"&&(e+=`|adverse = true
`),n.dangerLevel&&(e+=`|level = ${n.dangerLevel}
`),e+=`|sanity = ${n.apCost}
`,e+=`|unit limit = ${t.options.characterLimit}
`;let a=0,i={};for(let r of t.waves)for(let m of r.fragments)for(let c of m.actions)c.actionType=="SPAWN"&&(c.key in i||(i[c.key]=0),i[c.key]+=c.count,a+=c.count);return e+=`|enemies = ${a}
`,e+=`|lp = ${t.options.maxLifePoint}
`,e+=`|dp = ${t.options.initialCost}
`,s&&(console.log(n.advancedRuneIdList1),console.log(s),e+=`|ss1a = ${d(s[n.advancedRuneIdList1[0]].runeDesc)}
`,e+=`|ss1b = ${d(s[n.advancedRuneIdList1[1]].runeDesc)}
`,e+=`|ss2a = ${d(s[n.advancedRuneIdList2[0]].runeDesc)}
`,e+=`|ss2a = ${d(s[n.advancedRuneIdList2[1]].runeDesc)}
`),e=e.trim()+"}}",e};f.addEventListener("click",async n=>{n.preventDefault();let s=await y;f.disabled=!0;let o=s[v.value],t=o?.stageInfos.find(a=>a.difficulty=="NORMAL"&&(a.diffGroup=="NONE"||a.diffGroup=="NORMAL"))??o?.stageInfos[0];if(!t){u.value="Failed to find stage",f.disabled=!1;return}let e=`{{Operation tab}}
{{Operation info
`;if(e+=`|code = ${t.code}
`,e+=`|name = ${t.name}
`,e+=`|episode = 
|intermezzo = 
|part = 
|prev = 
|next = 
`,e+=`|desc = ${d(t.description)}}}
`,o.stageInfos.length>1){e+="<tabber>";for(let a of o.stageInfos)a.difficulty=="NORMAL"?a.diffGroup=="EASY"?e+="Story Environment":a.diffGroup=="TOUGH"?e+="Adverse Environment":o.stageInfos.find(i=>i.diffGroup=="FOUR_STAR")?e+="Normal Mode":o.stageInfos.find(i=>i.diffGroup=="SIX_STAR")?e+="Standard Combat":e+="Standard Environment":a.difficulty=="FOUR_STAR"?e+="Challenge Mode":a.difficulty=="SIX_STAR"&&(e+="Adverse Combat"),e+=`=${await l(a)}|-|`,a.difficulty=="SIX_STAR"&&(e+=`Strategic Simulation=${await l(a,o.runes)}|-|`);e=e.replace(/\|-\|$/,"</tabber>")}else e+=await l(t);u.value=e,f.disabled=!1});
