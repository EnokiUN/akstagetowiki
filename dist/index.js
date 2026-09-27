var p=new URLSearchParams(globalThis.location.search).get("server")??"en",y=`https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/${p}/gamedata/levels/`,v=`https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/${p}/gamedata/excel/stage_table.json`,L="https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/en/gamedata/excel/enemy_handbook_table.json",D="https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/cn/gamedata/excel/enemy_handbook_table.json",T="https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/en/gamedata/excel/item_table.json",M="https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/cn/gamedata/excel/item_table.json",S=fetch(L).then(n=>n.json().then(async o=>{let a={};if(Object.values(o.enemyData).forEach(s=>{a[s.enemyId]=s}),p=="cn"){let s=await fetch(D).then(e=>e.json());Object.values(s.enemyData).forEach(e=>{e.enemyId in a||(a[e.enemyId]=e)})}return a})),R=fetch(T).then(n=>n.json().then(async o=>{let a={};if(Object.values(o.items).forEach(s=>{a[s.itemId]=s}),p=="cn"){let s=await fetch(M).then(e=>e.json());Object.values(s.items).forEach(e=>{e.itemId in a||(a[e.itemId]=e)})}return a})),A=fetch(v).then(n=>n.json().then(o=>{let a={},s={};return Object.values(o.sixStarRuneData).forEach(e=>{a[e.runeId]=e}),Object.values(o.stages).forEach(e=>{e.code in s||(s[e.code]={stageInfos:[],runes:{}}),s[e.code].stageInfos.push(e);let t=d=>{d&&Object.values(d).length>0&&d.forEach(i=>{i in a?s[e.code].runes[i]=a[i]:console.error("Failed to find rune: ",i," in rune map")})};t(e.advancedRuneIdList1),t(e.advancedRuneIdList2)}),s}));var _=document.querySelector("#stage-input"),g=document.querySelector("#convert"),O=document.querySelector("#output"),m=n=>n.replace(/<@lv\.item>( *?)</g,"$1'''<[[").replace(/>( *?)<\/>/g,"]]>'''$1").replace(/\n/g,"</br>"),$={ALWAYS:1,ALMOST:2,USUAL:3,OFTEN:4,SOMETIMES:5},w=n=>n.dropType=="COMPLETE"?0:$[n.occPercent],h=async(n,o=void 0)=>{let a=await S,s=await R,e=await fetch(y+n.levelId.toLowerCase().replace("easy","main")+".json").then(f=>f.json()),t=`{{Operation data
`;n.diffGroup=="EASY"||n.diffGroup=="TOUGH"?t+=`|${n.diffGroup=="EASY"?"story":"adverse"} cond = ${m(n.description.split(/Environmental Conditions: *?<\/>\n/).at(-1))}
`:n.difficulty!="NORMAL"&&(t+=`|cond = ${m(n.description.split(/<@lv\.fs>Condition: *?<\/>\n/).at(-1))}
`),n.diffGroup=="TOUGH"&&(t+=`|adverse = true
`),n.difficulty=="FOUR_STAR"&&(t+=`|challenge = true
`),n.dangerLevel&&(t+=`|level = ${n.dangerLevel}
`),t+=`|sanity = ${n.apCost}
`,t+=`|unit limit = ${e.options.characterLimit}
`;let d=0,i={};for(let f of e.waves)for(let l of f.fragments)for(let r of l.actions)r.actionType=="SPAWN"&&(r.key in i||(i[r.key]=0),i[r.key]+=r.count,d+=r.count);t+=`|enemies = ${d}
`,t+=`|lp = ${e.options.maxLifePoint}
`,t+=`|dp = ${e.options.initialCost}
`;let u=(f,l)=>{let r=n.stageDropInfo.displayDetailRewards.filter(c=>c.dropType==f);if(r.length){t+=`|${l} = `;for(let c of r)t+=`{{I|${s[c.id].name.trim()}|rarity=${w(c)}}}`;t+=`
`}};u("COMPLETE","firstdrop"),u("NORMAL","regdrops"),u("SPECIAL","specdrops"),u("ADDITIONAL","extradrops");let E=f=>f.id in i?i[f.id]:0,I=(f,l)=>{let r=e.enemyDbRefs.filter(c=>a[c.id]?.enemyLevel==f);r.length&&(t+=`|${l} = `,t+=r.sort((c,b)=>E(b)-E(c)).map(c=>`{{E|${a[c.id].name.trim()}${c.id in i?`|${i[c.id]}`:""}}}`).join(", "),t+=t+=`
`)};return I("NORMAL","normal"),I("ELITE","elite"),I("BOSS","boss"),o&&(t+=`|ss1a = ${m(o[n.advancedRuneIdList1[0]].runeDesc)}
`,t+=`|ss1b = ${m(o[n.advancedRuneIdList1[1]].runeDesc)}
`,t+=`|ss2a = ${m(o[n.advancedRuneIdList2[0]].runeDesc)}
`,t+=`|ss2a = ${m(o[n.advancedRuneIdList2[1]].runeDesc)}
`),t=t.trim()+"}}",t};g.addEventListener("click",async n=>{n.preventDefault();let o=await A;g.disabled=!0;let a=o[_.value],s=a?.stageInfos.find(t=>t.difficulty=="NORMAL"&&(t.diffGroup=="NONE"||t.diffGroup=="NORMAL"))??a?.stageInfos[0];if(!s){O.value="Failed to find stage",g.disabled=!1;return}let e=`{{Operation tab}}
{{Operation info
`;if(e+=`|code = ${s.code}
`,e+=`|name = ${s.name}
`,e+=`|episode = 
|intermezzo = 
|sidestory = 
|storycollection = 
|part = 
|prev = 
|next = 
`,e+=`|desc = ${m(s.description)}
`,e+="|note = }}",a.stageInfos.length>1){e+="<tabber>";for(let t of a.stageInfos)t.difficulty=="NORMAL"?t.diffGroup=="EASY"?e+="Story Environment":t.diffGroup=="TOUGH"?e+="Adverse Environment":a.stageInfos.find(d=>d.difficulty=="FOUR_STAR")?e+="Normal Mode":a.stageInfos.find(d=>d.difficulty=="SIX_STAR")?e+="Standard Combat":e+="Standard Environment":t.difficulty=="FOUR_STAR"?e+="Challenge Mode":t.difficulty=="SIX_STAR"&&(e+="Adverse Combat"),e+=`=${await h(t)}|-|`,t.difficulty=="SIX_STAR"&&(e+=`Strategic Simulation=${await h(t,a.runes)}|-|`);e=e.replace(/\|-\|$/,"</tabber>")}else e+=await h(s);O.value=e,g.disabled=!1});
