import {
  EnemyData,
  ItemInfo,
  RichStageInfo,
  SixStarRuneData,
  StageInfo,
} from "./interfaces.ts";

const SERVER = new URLSearchParams(globalThis.location.search).get("server") ??
  "en";

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

export const enemyMapPromise: Promise<{ [id: string]: EnemyData }> = fetch(
  ENEMY_HANDBOOK_URL,
).then((r) =>
  r.json().then(async (h) => {
    const enemyMap: { [id: string]: EnemyData } = {};
    (Object.values(h.enemyData) as EnemyData[]).forEach((enemy: EnemyData) => {
      enemyMap[enemy.enemyId] = enemy;
    });
    if (SERVER == "cn") {
      const cnEnemies = await fetch(ENEMY_HANDBOOK_URL_CN).then((r) =>
        r.json()
      );
      (Object.values(cnEnemies.enemyData) as EnemyData[]).forEach(
        (enemy: EnemyData) => {
          if (!(enemy.enemyId in enemyMap)) {
            enemyMap[enemy.enemyId] = enemy;
          }
        },
      );
    }
    return enemyMap;
  })
);

export const itemMapPromise: Promise<{ [id: string]: ItemInfo }> = fetch(
  ITEM_TABLE_URL,
).then((r) =>
  r.json().then(async (h) => {
    const itemMap: { [id: string]: ItemInfo } = {};
    (Object.values(h.items) as ItemInfo[]).forEach((item: ItemInfo) => {
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
    return itemMap;
  })
);

export const stageMapPromise: Promise<{ [code: string]: RichStageInfo }> =
  fetch(
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
