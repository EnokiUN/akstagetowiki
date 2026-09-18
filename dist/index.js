var g=new URLSearchParams(window.location.search).get("server")??"en",A=`https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/${g}/gamedata/levels/`,v=`https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/${g}/gamedata/excel/stage_table.json`,O=`https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/${g}/gamedata/excel/enemy_handbook_table.json`,L=`https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/${g}/gamedata/excel/item_table.json`,b=document.querySelector("#stage-input"),p=document.querySelector("#convert"),y=document.querySelector("#output"),D=fetch(O).then(n=>n.json().then(o=>{let a={};return Object.values(o.enemyData).forEach(s=>{a[s.enemyId]=s}),a})),$=fetch(L).then(n=>n.json().then(o=>{let a={};return Object.values(o.items).forEach(s=>{a[s.itemId]=s}),a})),T=fetch(v).then(n=>n.json().then(o=>{let a={},s={};return Object.values(o.sixStarRuneData).forEach(t=>{a[t.runeId]=t}),Object.values(o.stages).forEach(t=>{t.code in s||(s[t.code]={stageInfos:[],runes:{}}),s[t.code].stageInfos.push(t);let e=d=>{d&&Object.values(d).length>0&&d.forEach(i=>{i in a?s[t.code].runes[i]=a[i]:console.error("Failed to find rune: ",i," in rune map")})};e(t.advancedRuneIdList1),e(t.advancedRuneIdList2)}),s})),l=n=>n.replace(/<@lv\.item>( *?)</g,"$1'''<[[").replace(/>( *?)<\/>/g,"]]>'''$1").replace(`
`,"</br>"),M={ALWAYS:1,ALMOST:2,USUAL:3,OFTEN:4,SOMETIMES:5},_=n=>n.dropType=="COMPLETE"?0:M[n.occPercent],h=async(n,o=void 0)=>{let a=await D,s=await $,t=await fetch(A+n.levelId.toLowerCase().replace("easy","main")+".json").then(c=>c.json()),e=`{{Operation data
`;n.diffGroup=="EASY"||n.diffGroup=="TOUGH"?e+=`|${n.diffGroup=="EASY"?"story":"adverse"} cond = ${l(n.description.split(/Environmental Conditions: *?<\/>\n/).at(-1))}
`:n.difficulty!="NORMAL"&&(e+=`|cond = ${l(n.description.split(/<@lv\.fs>Condition: *?<\/>\n/).at(-1))}
`),n.diffGroup=="TOUGH"&&(e+=`|adverse = true
`),n.difficulty=="FOUR_STAR"&&(e+=`|challenge = true
`),n.dangerLevel&&(e+=`|level = ${n.dangerLevel}
`),e+=`|sanity = ${n.apCost}
`,e+=`|unit limit = ${t.options.characterLimit}
`;let d=0,i={};for(let c of t.waves)for(let m of c.fragments)for(let r of m.actions)r.actionType=="SPAWN"&&(r.key in i||(i[r.key]=0),i[r.key]+=r.count,d+=r.count);e+=`|enemies = ${d}
`,e+=`|lp = ${t.options.maxLifePoint}
`,e+=`|dp = ${t.options.initialCost}
`;let u=(c,m)=>{let r=n.stageDropInfo.displayDetailRewards.filter(f=>f.dropType==c);if(r.length){e+=`|${m} = `;for(let f of r)e+=`{{I|${s[f.id].name}|rarity=${_(f)}}}`;e+=`
`}};u("COMPLETE","firstdrop"),u("NORMAL","regdrop"),u("SPECIAL","specdrops"),u("ADDITIONAL","extradrops");let S=c=>c.id in i?i[c.id]:0,I=(c,m)=>{let r=t.enemyDbRefs.filter(f=>a[f.id]?.enemyLevel==c);if(r.length){e+=`|${m} = `;for(let f of r.sort((R,E)=>S(E)-S(R)))e+=`{{E|${a[f.id].name}${f.id in i?`|${i[f.id]}`:""}}}`;e+=`
`}};return I("NORMAL","normal"),I("ELITE","elite"),I("BOSS","boss"),o&&(e+=`|ss1a = ${l(o[n.advancedRuneIdList1[0]].runeDesc)}
`,e+=`|ss1b = ${l(o[n.advancedRuneIdList1[1]].runeDesc)}
`,e+=`|ss2a = ${l(o[n.advancedRuneIdList2[0]].runeDesc)}
`,e+=`|ss2a = ${l(o[n.advancedRuneIdList2[1]].runeDesc)}
`),e=e.trim()+"}}",e};p.addEventListener("click",async n=>{n.preventDefault();let o=await T;p.disabled=!0;let a=o[b.value],s=a?.stageInfos.find(e=>e.difficulty=="NORMAL"&&(e.diffGroup=="NONE"||e.diffGroup=="NORMAL"))??a?.stageInfos[0];if(!s){y.value="Failed to find stage",p.disabled=!1;return}let t=`{{Operation tab}}
{{Operation info
`;if(t+=`|code = ${s.code}
`,t+=`|name = ${s.name}
`,t+=`|episode = 
|intermezzo = 
|part = 
|prev = 
|next = 
`,t+=`|desc = ${l(s.description)}}}
`,a.stageInfos.length>1){t+="<tabber>";for(let e of a.stageInfos)e.difficulty=="NORMAL"?e.diffGroup=="EASY"?t+="Story Environment":e.diffGroup=="TOUGH"?t+="Adverse Environment":a.stageInfos.find(d=>d.difficulty=="FOUR_STAR")?t+="Normal Mode":a.stageInfos.find(d=>d.difficulty=="SIX_STAR")?t+="Standard Combat":t+="Standard Environment":e.difficulty=="FOUR_STAR"?t+="Challenge Mode":e.difficulty=="SIX_STAR"&&(t+="Adverse Combat"),t+=`=${await h(e)}|-|`,e.difficulty=="SIX_STAR"&&(t+=`Strategic Simulation=${await h(e,a.runes)}|-|`);t=t.replace(/\|-\|$/,"</tabber>")}else t+=await h(s);y.value=t,p.disabled=!1});
