import {
  EnemyDbRef,
  OperationInfo,
  SixStarRuneData,
  StageDetailRewardDisplay,
  StageInfo,
} from "./models/index.ts";
import {
  charMapPromise,
  DB_STORE_NAME,
  dbPromise,
  enemyMapPromise,
  itemMapPromise,
  OPERATION_INFO_ROOT_URL,
  skillMapPromise,
  stageMapPromise,
} from "./data.ts";
import { OperationPredifineBase } from "./models/operations.ts";

const stageInput: HTMLInputElement = document.querySelector("#stage-input")!;
const button: HTMLButtonElement = document.querySelector("#convert")!;
const output: HTMLTextAreaElement = document.querySelector("#output")!;

const formatDesc = (s: string) =>
  s.replace(/<@lv\.item>( *?)</g, "$1'''<[[")
    .replace(/>( *?)<\/>/g, "]]>'''$1")
    .replace(/\n/g, "<br/>")
    .replace(/\\n/g, "<br/>"); // ok, but, like, hhhhwhyyyyyy??

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
  const charMap = await charMapPromise;
  const skillMap = await skillMapPromise;

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

  if (
    info.isPredefined || info.isHardPredefined ||
    info.isSkillSelectablePredefined
  ) {
    operationData += "|fixed = true\n";
  }

  if (operationInfo.predefines.tokenCards.length) {
    operationData += "|deployable = " +
      operationInfo.predefines.tokenCards.map((c) => {
        const name = charMap[c.inst.characterKey].name;
        return `{{D|${name}|${c.initialCnt}}}`;
      }).join(", ") + "\n";
  }

  if (operationInfo.predefines.tokenInsts.length) {
    const staticCounter: { [staticId: string]: number } = {};
    operationInfo.predefines.tokenInsts.forEach((i) => {
      staticCounter[i.inst.characterKey] =
        (staticCounter[i.inst.characterKey] ?? 0) + 1;
    });
    operationData += "|static = " +
      Object.entries(staticCounter).map(([i, n]) => {
        const name = charMap[i].name;
        return `{{D|${name}|${n}}}`;
      }).join(", ") + "\n";
  }

  const formatCharacter = (predefine: OperationPredifineBase) => {
    const char = charMap[predefine.inst.characterKey];
    let skillInfo = "";
    if (predefine.skillIndex >= 0) {
      const skillId = char.skills[predefine.skillIndex].skillId;
      const skill = skillMap[skillId];
      skillInfo = `, {{Skill|${
        skill.levels[predefine.mainSkillLvl - 1].name
      }}} `;
      skillInfo += predefine.mainSkillLvl > 7
        ? `Spec. Level ${predefine.mainSkillLvl - 7}`
        : `Level ${predefine.mainSkillLvl}`;
    }
    return `{{C|${char.name}}} (Elite ${
      predefine.inst.phase.split("_")[1]
    } Level ${predefine.inst.level}${skillInfo})`;
  };

  if (operationInfo.predefines.characterInsts.length) {
    operationData += "|pre = " +
      operationInfo.predefines.characterInsts.map(formatCharacter).join(", ") +
      "\n";
  }

  if (operationInfo.predefines.characterCards.length) {
    operationData += "|comp = \n" +
      operationInfo.predefines.characterCards.map((c) =>
        "*" + formatCharacter(c)
      ).join("\n") +
      "\n";
  }

  // TODO: terrain

  const handleDrops = (cond: string, field: string) => {
    if (!info.stageDropInfo.displayDetailRewards.length) {
      return;
    }

    const drops = info.stageDropInfo.displayDetailRewards.filter((d) =>
      d.dropType == cond
    );
    if (drops.length) {
      operationData += `|${field} = `;
      for (const drop of drops) {
        operationData += `{{I|${itemMap[drop.id].name.trim()}|rarity=${
          getItemRarity(drop)
        }}}`;
      }
      operationData += "\n";
    }
  };

  handleDrops("COMPLETE", "firstdrop");
  handleDrops("NORMAL", "regdrops");
  handleDrops("SPECIAL", "specdrops");
  handleDrops("ADDITIONAL", "extradrops");

  const getEnemyCount = (e: EnemyDbRef) =>
    e.id in enemyCounter ? enemyCounter[e.id] : 0;

  const handleEnemies = (tier: string, field: string) => {
    const enemies = operationInfo.enemyDbRefs.filter((e) =>
      enemyMap[e.id.replace(/_a$/, "_2")]?.enemyLevel == tier
    );
    if (enemies.length) {
      operationData += `|${field} = `;
      operationData += enemies.sort((e1, e2) =>
        getEnemyCount(e2) - getEnemyCount(e1)
      ).map((
        enemy,
      ) =>
        `{{E|${enemyMap[enemy.id.replace(/_a$/, "_2")].name.trim()}${
          enemy.id in enemyCounter ? `|${enemyCounter[enemy.id]}` : ""
        }}}`
      ).join(", ");
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
  if (stageInput.value == "/reset") {
    // TODO: find a better way to also do this (probably just isolate this into a helper function tbh)
    const db = await dbPromise;
    if (db) {
      output.value = "Resetting cache";
      const transaction = db.transaction(DB_STORE_NAME, "readwrite");
      const store = transaction.objectStore(DB_STORE_NAME);
      const request = store.clear();
      request.onsuccess = () => {
        output.value = "Cache reset, please refresh";
      };
    }
    return;
  } else if (stageInput.value.startsWith("/enemies")) {
    // TODO: find a better way to do this
    const stageCode = stageInput.value.split(" ")[1];
    const stageMap = await stageMapPromise;
    const enemyMap = await enemyMapPromise;
    const stages = Object.keys(stageMap).filter((s) => s.match(stageCode));
    const enemyIDs = new Set();
    for (const [code, i] of stages.map((s, i) => [s, i])) {
      output.value = `Fetching enemies from stages (${i}/${stages.length})`;
      for (const stage of stageMap[code].stageInfos) {
        if (!stage.levelId) continue;
        const operationInfo: OperationInfo = await fetch(
          OPERATION_INFO_ROOT_URL +
            stage.levelId.toLowerCase().replace("easy", "main") + ".json",
        ).then((r) => r.json());
        for (const entry of operationInfo.enemyDbRefs) {
          enemyIDs.add(entry.id);
        }
      }
    }
    const enemies = Array.from(enemyIDs).map((enemyId) => {
      return enemyMap[(enemyId as string).replace(/_a$/, "_2")];
    });
    output.value = "";
    for (const enemyType of ["NORMAL", "ELITE", "BOSS"]) {
      output.value += `\n==== ${enemyType} ====`;
      for (const enemy of enemies) {
        if (enemy.enemyLevel == enemyType) {
          const cleanName = enemy.name.replace('"', "").replace("\n", "");
          output.value += `\n\t["${cleanName}"]={name="${cleanName}"${
            enemy.name.match(/"/)
              ? `, title="${enemy.name.replace('"', '\\"').replace("\n", "")}"`
              : ""
          }, code="${enemy.enemyIndex}", id="${enemy.enemyId}"},`;
        }
      }
    }
    return;
  }

  const stageMap = await stageMapPromise;
  button.disabled = true;
  output.disabled = true;
  output.value = "Loading, please wait...";

  const stageInfo = stageMap[stageInput.value];
  const defaultDifficulty = stageInfo?.stageInfos.find((s) =>
    s.difficulty == "NORMAL" &&
    (s.diffGroup == "NONE" || s.diffGroup == "NORMAL")
  ) ?? stageInfo?.stageInfos[0];

  if (!defaultDifficulty) {
    output.value = "Failed to find stage";
    button.disabled = false;
    output.disabled = false;
    return;
  }

  let operationInfo = "{{Operation tab}}\n{{Operation info\n";
  operationInfo += `|code = ${defaultDifficulty.code}\n`;
  operationInfo += `|name = ${defaultDifficulty.name}\n`;
  operationInfo +=
    `|episode = \n|intermezzo = \n|sidestory = \n|storycollection = \n|part = \n|prev = \n|next = \n`;
  operationInfo += `|desc = ${formatDesc(defaultDifficulty.description)}\n`;
  operationInfo += `|note = }}\n`;

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
  output.disabled = false;
  button.disabled = false;
});
