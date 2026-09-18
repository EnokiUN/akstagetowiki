import {
  EnemyData,
  EnemyDbRef,
  ItemInfo,
  OperationInfo,
  RichStageInfo,
  SixStarRuneData,
  StageDetailRewardDisplay,
  StageInfo,
} from "./interfaces.ts";

const OPERATION_INFO_ROOT_URL =
  "https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/en/gamedata/levels/";
const STAGE_TABLE_URL =
  "https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/en/gamedata/excel/stage_table.json";
const ENEMY_HANDBOOK_URL =
  "https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/en/gamedata/excel/enemy_handbook_table.json";
const ITEM_TABLE_URL =
  "https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/en/gamedata/excel/item_table.json";

const stageInput: HTMLInputElement = document.querySelector("#stage-input")!;
const button: HTMLButtonElement = document.querySelector("#convert")!;
const output: HTMLTextAreaElement = document.querySelector("#output")!;

const enemyMapPromise: Promise<{ [id: string]: EnemyData }> = fetch(
  ENEMY_HANDBOOK_URL,
).then((r) =>
  r.json().then((h) => {
    const enemyMap: { [id: string]: EnemyData } = {};
    (Object.values(h.enemyData) as EnemyData[]).forEach((enemy: EnemyData) => {
      enemyMap[enemy.enemyId] = enemy;
    });
    return enemyMap;
  })
);

const itemMapPromise: Promise<{ [id: string]: ItemInfo }> = fetch(
  ITEM_TABLE_URL,
).then((r) =>
  r.json().then((h) => {
    const itemMap: { [id: string]: ItemInfo } = {};
    (Object.values(h.items) as ItemInfo[]).forEach((item: ItemInfo) => {
      itemMap[item.itemId] = item;
    });
    return itemMap;
  })
);

const stageMapPromise: Promise<{ [code: string]: RichStageInfo }> = fetch(
  STAGE_TABLE_URL,
).then((r) =>
  r.json().then((s) => {
    const runeMap: { [id: string]: SixStarRuneData } = {};
    const stageMap: { [id: string]: RichStageInfo } = {};
    (Object.values(s.sixStarRuneData) as SixStarRuneData[]).forEach(
      (rune: SixStarRuneData) => {
        runeMap[rune.runeId] = rune;
      },
    );
    (Object.values(s.stages) as StageInfo[]).forEach((stage: StageInfo) => {
      if (!(stage.code in stageMap)) {
        stageMap[stage.code] = { stageInfos: [], runes: {} };
      }
      stageMap[stage.code].stageInfos.push(stage);
      const handleRunes = (runeList?: object) => {
        if (runeList && Object.values(runeList).length > 0) {
          (runeList as string[]).forEach((r) => {
            if (r in runeMap) {
              stageMap[stage.code].runes[r] = runeMap[r];
            } else {
              console.error("Failed to find rune: ", r, " in rune map");
            }
          });
        }
      };
      handleRunes(stage.advancedRuneIdList1);
      handleRunes(stage.advancedRuneIdList2);
    });
    return stageMap;
  })
);

const formatDesc = (s: string) =>
  s.replace(
    /<@lv\.item>( *?)</g,
    "$1'''<[[",
  ).replace(/>( *?)<\/>/g, "]]>'''$1").replace("\n", "</br>");

const ITEM_RARITY_MAP: { [rarity: string]: number } = {
  ALWAYS: 1,
  ALMOST: 2,
  USUAL: 3,
  OFTEN: 4,
  SOMETIMES: 5,
};
const getItemRarity = (item: StageDetailRewardDisplay) =>
  item.dropType == "COMPLETE" ? 0 : ITEM_RARITY_MAP[item.occPercent];

const formatStageInfo = async (
  info: StageInfo,
  runes: { [name: string]: SixStarRuneData } | undefined = undefined,
) => {
  const enemyMap = await enemyMapPromise;
  const itemMap = await itemMapPromise;

  const operationInfo: OperationInfo = await fetch(
    OPERATION_INFO_ROOT_URL +
      info.levelId.toLowerCase().replace("easy", "main") + ".json",
  ).then((r) => r.json());

  let operationData = "{{Operation data\n";
  if (info.diffGroup == "EASY" || info.diffGroup == "TOUGH") {
    operationData += `|${
      info.diffGroup == "EASY" ? "story" : "adverse"
    } cond = ${
      formatDesc(
        info.description.split(/Environmental Conditions: *?<\/>\n/).at(
          -1,
        )!,
      )
    }\n`;
  } else if (info.difficulty != "NORMAL") {
    operationData += `|cond = ${
      formatDesc(
        info.description.split(/<@lv\.fs>Condition: *?<\/>\n/).at(
          -1,
        )!,
      )
    }\n`;
  }
  if (info.diffGroup == "TOUGH") {
    operationData += "|adverse = true\n";
  }
  if (info.difficulty == "FOUR_STAR") {
    operationData += "|challenge = true\n";
  }
  if (info.dangerLevel) {
    operationData += `|level = ${info.dangerLevel}\n`;
  }
  operationData += `|sanity = ${info.apCost}\n`;
  operationData += `|unit limit = ${operationInfo.options.characterLimit}\n`;

  let enemyCount = 0;
  const enemyCounter: { [enemyId: string]: number } = {};

  for (const wave of operationInfo.waves) {
    for (const fragment of wave.fragments) {
      for (const action of fragment.actions) {
        if (action.actionType == "SPAWN") {
          if (!(action.key in enemyCounter)) {
            enemyCounter[action.key] = 0;
          }

          enemyCounter[action.key] += action.count;
          enemyCount += action.count;
        }
      }
    }
  }

  operationData += `|enemies = ${enemyCount}\n`;
  operationData += `|lp = ${operationInfo.options.maxLifePoint}\n`;
  operationData += `|dp = ${operationInfo.options.initialCost}\n`;

  // TODO: deployable
  // TODO: static

  const handleDrops = (cond: string, field: string) => {
    const drops = info.stageDropInfo.displayDetailRewards.filter((d) =>
      d.dropType == cond
    );
    if (drops.length) {
      operationData += `|${field} = `;
      for (const drop of drops) {
        operationData += `{{I|${itemMap[drop.id].name}|rarity=${
          getItemRarity(drop)
        }}}`;
      }
      operationData += "\n";
    }
  };

  handleDrops("COMPLETE", "firstdrop");
  handleDrops("NORMAL", "regdrop");
  handleDrops("SPECIAL", "specdrops");
  handleDrops("ADDITIONAL", "extradrops");

  const getEnemyCount = (e: EnemyDbRef) =>
    e.id in enemyCounter ? enemyCounter[e.id] : 0;

  const handleEnemies = (tier: string, field: string) => {
    const enemies = operationInfo.enemyDbRefs.filter((e) =>
      enemyMap[e.id]?.enemyLevel == tier
    );
    if (enemies.length) {
      operationData += `|${field} = `;
      for (
        const enemy of enemies.sort((e1, e2) =>
          getEnemyCount(e2) - getEnemyCount(e1)
        )
      ) {
        operationData += `{{E|${enemyMap[enemy.id].name}${
          enemy.id in enemyCounter ? `|${enemyCounter[enemy.id]}` : ""
        }}}`;
      }
      operationData += "\n";
    }
  };
  handleEnemies("NORMAL", "normal");
  handleEnemies("ELITE", "elite");
  handleEnemies("BOSS", "boss");

  if (runes) {
    operationData += `|ss1a = ${
      formatDesc(runes[info.advancedRuneIdList1![0]].runeDesc)
    }\n`;
    operationData += `|ss1b = ${
      formatDesc(runes[info.advancedRuneIdList1![1]].runeDesc)
    }\n`;
    operationData += `|ss2a = ${
      formatDesc(runes[info.advancedRuneIdList2![0]].runeDesc)
    }\n`;
    operationData += `|ss2a = ${
      formatDesc(runes[info.advancedRuneIdList2![1]].runeDesc)
    }\n`;
  }

  operationData = operationData.trim() + "}}";
  return operationData;
};

button.addEventListener("click", async (e) => {
  e.preventDefault();
  const stageMap = await stageMapPromise;
  button.disabled = true;

  const stageInfo = stageMap[stageInput.value];
  const defaultDifficulty = stageInfo?.stageInfos.find((s) =>
    s.difficulty == "NORMAL" &&
    (s.diffGroup == "NONE" || s.diffGroup == "NORMAL")
  ) ?? stageInfo?.stageInfos[0];

  if (!defaultDifficulty) {
    output.value = "Failed to find stage";
    button.disabled = false;
    return;
  }

  let operationInfo = "{{Operation tab}}\n{{Operation info\n";
  operationInfo += `|code = ${defaultDifficulty.code}\n`;
  operationInfo += `|name = ${defaultDifficulty.name}\n`;
  operationInfo +=
    `|episode = \n|intermezzo = \n|part = \n|prev = \n|next = \n`;
  operationInfo += `|desc = ${formatDesc(defaultDifficulty.description)}}}\n`;

  if (stageInfo.stageInfos.length > 1) {
    operationInfo += `<tabber>`;

    for (const info of stageInfo.stageInfos) {
      if (info.difficulty == "NORMAL") {
        if (info.diffGroup == "EASY") {
          operationInfo += `Story Environment`;
        } else if (info.diffGroup == "TOUGH") {
          operationInfo += `Adverse Environment`;
        } else {
          if (
            stageInfo.stageInfos.find((s) =>
              s.difficulty == "FOUR_STAR"
            )
          ) {
            operationInfo += `Normal Mode`;
          } else if (
            stageInfo.stageInfos.find((s) => s.difficulty == "SIX_STAR")
          ) {
            operationInfo += `Standard Combat`;
          } else {
            operationInfo += `Standard Environment`;
          }
        }
      } else if (info.difficulty == "FOUR_STAR") {
        operationInfo += `Challenge Mode`;
      } else if (info.difficulty == "SIX_STAR") {
        operationInfo += `Adverse Combat`;
      }

      operationInfo += `=${await formatStageInfo(info)}|-|`;

      if (info.difficulty == "SIX_STAR") {
        operationInfo += `Strategic Simulation=${await formatStageInfo(
          info,
          stageInfo.runes,
        )}|-|`;
      }
    }

    operationInfo = operationInfo.replace(/\|-\|$/, "</tabber>");
  } else {
    operationInfo += await formatStageInfo(defaultDifficulty);
  }

  output.value = operationInfo;

  button.disabled = false;
});
