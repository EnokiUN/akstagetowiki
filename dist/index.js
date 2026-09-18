var p="https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/en/gamedata/levels/",g="https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/en/gamedata/excel/stage_table.json",I="https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/en/gamedata/excel/enemy_handbook_table.json";var h=document.querySelector("#stage-input"),f=document.querySelector("#convert"),u=document.querySelector("#output"),y=fetch(I).then(t=>t.json().then(o=>{let s={levelInfo:o.levelInfoList,enemies:{}};return Object.values(o.enemyData).forEach(n=>{s.enemies[n.enemyId]=n}),s})),S=fetch(g).then(t=>t.json().then(o=>{let s={},n={};return Object.values(o.sixStarRuneData).forEach(e=>{s[e.runeId]=e}),Object.values(o.stages).forEach(e=>{e.code in n||(n[e.code]={stageInfos:[],runes:{}}),n[e.code].stageInfos.push(e);let a=i=>{i&&Object.values(i).length>0&&i.forEach(r=>{r in s?n[e.code].runes[r]=s[r]:console.error("Failed to find rune: ",r," in rune map")})};a(e.advancedRuneIdList1),a(e.advancedRuneIdList2)}),n})),d=t=>t.replace(/<@lv\.item>( *?)</g,"$1'''<[[").replace(/>( *?)<\/>/g,"]]>'''$1").replace(`
`,"</br>"),l=async(t,o=void 0)=>{let s=await y,n=await fetch(p+t.levelId.toLowerCase().replace("easy","main")+".json").then(r=>r.json()),e=`{{Operation data
`;t.diffGroup=="EASY"||t.diffGroup=="TOUGH"?e+=`|${t.diffGroup=="EASY"?"story":"adverse"} cond = ${d(t.description.split(/Environmental Conditions: *?<\/>\n/).at(-1))}
`:t.difficulty!="NORMAL"&&(e+=`|cond = ${d(t.description.split(/<@lv\.fs>Condition: *?<\/>\n/).at(-1))}
`),t.diffGroup=="TOUGH"&&(e+=`|adverse = true
`),t.dangerLevel&&(e+=`|level = ${t.dangerLevel}
`),e+=`|sanity = ${t.apCost}
`,e+=`|unit limit = ${n.options.characterLimit}
`;let a=0,i={};for(let r of n.waves)for(let m of r.fragments)for(let c of m.actions)c.actionType=="SPAWN"&&(c.key in i||(i[c.key]=0),i[c.key]+=c.count,a+=c.count);return e+=`|enemies = ${a}
`,e+=`|lp = ${n.options.maxLifePoint}
`,e+=`|dp = ${n.options.initialCost}
`,o&&(e+=`|ss1a = ${d(o[t.advancedRuneIdList1[0]].runeDesc)}
`,e+=`|ss1b = ${d(o[t.advancedRuneIdList1[1]].runeDesc)}
`,e+=`|ss2a = ${d(o[t.advancedRuneIdList2[0]].runeDesc)}
`,e+=`|ss2a = ${d(o[t.advancedRuneIdList2[1]].runeDesc)}
`),e=e.trim()+"}}",e};f.addEventListener("click",async t=>{t.preventDefault();let o=await S;f.disabled=!0;let s=o[h.value],n=s?.stageInfos.find(a=>a.difficulty=="NORMAL"&&(a.diffGroup=="NONE"||a.diffGroup=="NORMAL"))??s?.stageInfos[0];if(!n){u.value="Failed to find stage",f.disabled=!1;return}let e=`{{Operation tab}}
{{Operation info
`;if(e+=`|code = ${n.code}
`,e+=`|name = ${n.name}
`,e+=`|episode = 
|intermezzo = 
|part = 
|prev = 
|next = 
`,e+=`|desc = ${d(n.description)}}}
`,s.stageInfos.length>1){e+="<tabber>";for(let a of s.stageInfos)a.difficulty=="NORMAL"?a.diffGroup=="EASY"?e+="Story Environment":a.diffGroup=="TOUGH"?e+="Adverse Environment":s.stageInfos.find(i=>i.difficulty=="FOUR_STAR")?e+="Normal Mode":s.stageInfos.find(i=>i.difficulty=="SIX_STAR")?e+="Standard Combat":e+="Standard Environment":a.difficulty=="FOUR_STAR"?e+="Challenge Mode":a.difficulty=="SIX_STAR"&&(e+="Adverse Combat"),e+=`=${await l(a)}|-|`,a.difficulty=="SIX_STAR"&&(e+=`Strategic Simulation=${await l(a,s.runes)}|-|`);e=e.replace(/\|-\|$/,"</tabber>")}else e+=await l(n);u.value=e,f.disabled=!1});
