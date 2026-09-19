var p=new URLSearchParams(globalThis.location.search).get("server")??"en",E=`https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/${p}/gamedata/levels/`,L=`https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/${p}/gamedata/excel/stage_table.json`,D="https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/en/gamedata/excel/enemy_handbook_table.json",T="https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/cn/gamedata/excel/enemy_handbook_table.json",M="https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/en/gamedata/excel/item_table.json",_="https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/cn/gamedata/excel/item_table.json",S=fetch(D).then(n=>n.json().then(async o=>{let a={};if(Object.values(o.enemyData).forEach(s=>{a[s.enemyId]=s}),p=="cn"){let s=await fetch(T).then(e=>e.json());Object.values(s.enemyData).forEach(e=>{e.enemyId in a||(a[e.enemyId]=e)})}return a})),R=fetch(M).then(n=>n.json().then(async o=>{let a={};if(Object.values(o.items).forEach(s=>{a[s.itemId]=s}),p=="cn"){let s=await fetch(_).then(e=>e.json());Object.values(s.items).forEach(e=>{e.itemId in a||(a[e.itemId]=e)})}return a})),A=fetch(L).then(n=>n.json().then(o=>{let a={},s={};return Object.values(o.sixStarRuneData).forEach(e=>{a[e.runeId]=e}),Object.values(o.stages).forEach(e=>{e.code in s||(s[e.code]={stageInfos:[],runes:{}}),s[e.code].stageInfos.push(e);let t=c=>{c&&Object.values(c).length>0&&c.forEach(i=>{i in a?s[e.code].runes[i]=a[i]:console.error("Failed to find rune: ",i," in rune map")})};t(e.advancedRuneIdList1),t(e.advancedRuneIdList2)}),s}));var $=document.querySelector("#stage-input"),g=document.querySelector("#convert"),O=document.querySelector("#output"),m=n=>n.replace(/<@lv\.item>( *?)</g,"$1'''<[[").replace(/>( *?)<\/>/g,"]]>'''$1").replace(`
`,"</br>"),w={ALWAYS:1,ALMOST:2,USUAL:3,OFTEN:4,SOMETIMES:5},N=n=>n.dropType=="COMPLETE"?0:w[n.occPercent],h=async(n,o=void 0)=>{let a=await S,s=await R,e=await fetch(E+n.levelId.toLowerCase().replace("easy","main")+".json").then(d=>d.json()),t=`{{Operation data
`;n.diffGroup=="EASY"||n.diffGroup=="TOUGH"?t+=`|${n.diffGroup=="EASY"?"story":"adverse"} cond = ${m(n.description.split(/Environmental Conditions: *?<\/>\n/).at(-1))}
`:n.difficulty!="NORMAL"&&(t+=`|cond = ${m(n.description.split(/<@lv\.fs>Condition: *?<\/>\n/).at(-1))}
`),n.diffGroup=="TOUGH"&&(t+=`|adverse = true
`),n.difficulty=="FOUR_STAR"&&(t+=`|challenge = true
`),n.dangerLevel&&(t+=`|level = ${n.dangerLevel}
`),t+=`|sanity = ${n.apCost}
`,t+=`|unit limit = ${e.options.characterLimit}
`;let c=0,i={};for(let d of e.waves)for(let l of d.fragments)for(let r of l.actions)r.actionType=="SPAWN"&&(r.key in i||(i[r.key]=0),i[r.key]+=r.count,c+=r.count);t+=`|enemies = ${c}
`,t+=`|lp = ${e.options.maxLifePoint}
`,t+=`|dp = ${e.options.initialCost}
`;let u=(d,l)=>{let r=n.stageDropInfo.displayDetailRewards.filter(f=>f.dropType==d);if(r.length){t+=`|${l} = `;for(let f of r)t+=`{{I|${s[f.id].name.trim()}|rarity=${N(f)}}}`;t+=`
`}};u("COMPLETE","firstdrop"),u("NORMAL","regdrop"),u("SPECIAL","specdrops"),u("ADDITIONAL","extradrops");let y=d=>d.id in i?i[d.id]:0,I=(d,l)=>{let r=e.enemyDbRefs.filter(f=>a[f.id]?.enemyLevel==d);if(r.length){t+=`|${l} = `;for(let f of r.sort((b,v)=>y(v)-y(b)))t+=`{{E|${a[f.id].name.trim()}${f.id in i?`|${i[f.id]}`:""}}}`;t+=`
`}};return I("NORMAL","normal"),I("ELITE","elite"),I("BOSS","boss"),o&&(t+=`|ss1a = ${m(o[n.advancedRuneIdList1[0]].runeDesc)}
`,t+=`|ss1b = ${m(o[n.advancedRuneIdList1[1]].runeDesc)}
`,t+=`|ss2a = ${m(o[n.advancedRuneIdList2[0]].runeDesc)}
`,t+=`|ss2a = ${m(o[n.advancedRuneIdList2[1]].runeDesc)}
`),t=t.trim()+"}}",t};g.addEventListener("click",async n=>{n.preventDefault();let o=await A;g.disabled=!0;let a=o[$.value],s=a?.stageInfos.find(t=>t.difficulty=="NORMAL"&&(t.diffGroup=="NONE"||t.diffGroup=="NORMAL"))??a?.stageInfos[0];if(!s){O.value="Failed to find stage",g.disabled=!1;return}let e=`{{Operation tab}}
{{Operation info
`;if(e+=`|code = ${s.code}
`,e+=`|name = ${s.name}
`,e+=`|episode = 
|intermezzo = 
|part = 
|prev = 
|next = 
`,e+=`|desc = ${m(s.description)}}}
`,a.stageInfos.length>1){e+="<tabber>";for(let t of a.stageInfos)t.difficulty=="NORMAL"?t.diffGroup=="EASY"?e+="Story Environment":t.diffGroup=="TOUGH"?e+="Adverse Environment":a.stageInfos.find(c=>c.difficulty=="FOUR_STAR")?e+="Normal Mode":a.stageInfos.find(c=>c.difficulty=="SIX_STAR")?e+="Standard Combat":e+="Standard Environment":t.difficulty=="FOUR_STAR"?e+="Challenge Mode":t.difficulty=="SIX_STAR"&&(e+="Adverse Combat"),e+=`=${await h(t)}|-|`,t.difficulty=="SIX_STAR"&&(e+=`Strategic Simulation=${await h(t,a.runes)}|-|`);e=e.replace(/\|-\|$/,"</tabber>")}else e+=await h(s);O.value=e,g.disabled=!1});
