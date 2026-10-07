import { CharacterInfo } from "./models/characters.ts";
import {
  EnemyInfo,
  ItemInfo,
  RichStageInfo,
  SixStarRuneData,
  SkillInfo,
  StageInfo,
} from "./models/index.ts";

const CACHE_EXPIRY = 24 * 60 * 60 * 1000;

const SERVER = new URLSearchParams(globalThis.location.search).get("server") ??
  "en";
const IS_CN = ["cn", "china"].includes(SERVER.toLowerCase());

export const OPERATION_INFO_ROOT_URL =
  `https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/${SERVER}/gamedata/levels/`;
const STAGE_TABLE_URL =
  `https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/${SERVER}/gamedata/excel/stage_table.json`;
const ENEMY_HANDBOOK_URL =
  "https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/en/gamedata/excel/enemy_handbook_table.json";
const ENEMY_HANDBOOK_URL_CN =
  "https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/cn/gamedata/excel/enemy_handbook_table.json";
const ITEM_TABLE_URL =
  "https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/en/gamedata/excel/item_table.json";
const ITEM_TABLE_URL_CN =
  "https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/cn/gamedata/excel/item_table.json";
const CHAR_TABLE_URL =
  "https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/en/gamedata/excel/character_table.json";
const CHAR_TABLE_URL_CN =
  "https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/cn/gamedata/excel/character_table.json";

const getCached = <T>(key: string): T | null => {
  try {
    const cached = globalThis.localStorage.getItem(key);
    if (cached) {
      const { timestamp, map } = JSON.parse(cached);
      if (new Date().getTime() - timestamp < CACHE_EXPIRY) {
        return map as T;
      }
    }
  } catch {
    return null;
  }
  return null;
};

export const enemyMapPromise: Promise<{ [id: string]: EnemyInfo }> = fetch(
  ENEMY_HANDBOOK_URL,
).then((r) =>
  r.json().then(async (h) => {
    const cacheKey = "enemies" + (IS_CN ? "-cn" : "");
    const enemyMap: { [id: string]: EnemyInfo } = {};
    const cached: typeof enemyMap | null = getCached(cacheKey);
    if (cached) {
      return cached;
    }
    (Object.values(h.enemyInfo) as EnemyInfo[]).forEach((enemy: EnemyInfo) => {
      enemyMap[enemy.enemyId] = enemy;
    });
    if (SERVER == "cn") {
      const cnEnemies = await fetch(ENEMY_HANDBOOK_URL_CN).then((r) =>
        r.json()
      );
      (Object.values(cnEnemies.enemyInfo) as EnemyInfo[]).forEach(
        (enemy) => {
          if (!(enemy.enemyId in enemyMap)) {
            enemyMap[enemy.enemyId] = enemy;
          }
        },
      );
    }
    globalThis.localStorage.setItem(
      cacheKey,
      JSON.stringify({ timestamp: new Date().getTime(), map: enemyMap }),
    );
    return enemyMap;
  })
);

export const itemMapPromise: Promise<{ [id: string]: ItemInfo }> = fetch(
  ITEM_TABLE_URL,
).then((r) =>
  r.json().then(async (h) => {
    const cacheKey = "items" + (IS_CN ? "-cn" : "");
    const itemMap: { [id: string]: ItemInfo } = {};
    const cached: typeof itemMap | null = getCached(cacheKey);
    if (cached) {
      return cached;
    }
    (Object.values(h.items) as ItemInfo[]).forEach((item) => {
      itemMap[item.itemId] = item;
    });
    if (SERVER == "cn") {
      const cnItems = await fetch(ITEM_TABLE_URL_CN).then((r) => r.json());
      (Object.values(cnItems.items) as ItemInfo[]).forEach(
        (item: ItemInfo) => {
          if (!(item.itemId in itemMap)) {
            itemMap[item.itemId] = item;
          }
        },
      );
    }
    globalThis.localStorage.setItem(
      cacheKey,
      JSON.stringify({ timestamp: new Date().getTime(), map: itemMap }),
    );
    return itemMap;
  })
);

export const stageMapPromise: Promise<{ [code: string]: RichStageInfo }> =
  fetch(
    STAGE_TABLE_URL,
  ).then((r) =>
    r.json().then((s) => {
      const cacheKey = "stages" + (IS_CN ? "-cn" : "");
      const runeMap: { [id: string]: SixStarRuneData } = {};
      const stageMap: { [id: string]: RichStageInfo } = {};
      const cached: typeof stageMap | null = getCached(cacheKey);
      if (cached) {
        return cached;
      }
      (Object.values(s.sixStarRuneData) as SixStarRuneData[]).forEach(
        (rune: SixStarRuneData) => {
          runeMap[rune.runeId] = rune;
        },
      );
      (Object.values(s.stages) as StageInfo[]).forEach((stage) => {
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
      globalThis.localStorage.setItem(
        cacheKey,
        JSON.stringify({ timestamp: new Date().getTime(), map: stageMap }),
      );
      return stageMap;
    })
  );

export const charMapPromise: Promise<{ [id: string]: CharacterInfo }> = fetch(
  CHAR_TABLE_URL,
).then((r) =>
  r.json().then(async (h) => {
    const cacheKey = "characters" + (IS_CN ? "-cn" : "");
    const characterMap: { [id: string]: CharacterInfo } = {};
    const cached: typeof characterMap | null = getCached(cacheKey);
    if (cached) {
      return cached;
    }
    (Object.entries(h) as [string, CharacterInfo][]).forEach(
      ([id, character]) => {
        characterMap[id] = character;
      },
    );
    if (SERVER == "cn") {
      const cnCharacters = await fetch(CHAR_TABLE_URL_CN).then((r) => r.json());
      (Object.entries(cnCharacters) as [string, CharacterInfo][]).forEach(
        ([id, character]) => {
          if (!(id in characterMap)) {
            characterMap[id] = character;
          }
        },
      );
    }
    globalThis.localStorage.setItem(
      cacheKey,
      JSON.stringify({ timestamp: new Date().getTime(), map: characterMap }),
    );
    return characterMap;
  })
);

export const skillMapPromise: Promise<{ [id: string]: SkillInfo }> = fetch(
  CHAR_TABLE_URL,
).then((r) =>
  r.json().then(async (h) => {
    const cacheKey = "skills" + (IS_CN ? "-cn" : "");
    const skillMap: { [id: string]: SkillInfo } = {};
    const cached: typeof skillMap | null = getCached(cacheKey);
    if (cached) {
      return cached;
    }
    (Object.entries(h) as [string, SkillInfo][]).forEach(
      ([id, skill]) => {
        skillMap[id] = skill;
      },
    );
    if (SERVER == "cn") {
      const cnSkills = await fetch(CHAR_TABLE_URL_CN).then((r) => r.json());
      (Object.entries(cnSkills) as [string, SkillInfo][]).forEach(
        ([id, skill]) => {
          if (!(id in skillMap)) {
            skillMap[id] = skill;
          }
        },
      );
    }
    globalThis.localStorage.setItem(
      cacheKey,
      JSON.stringify({ timestamp: new Date().getTime(), map: skillMap }),
    );
    return skillMap;
  })
);
