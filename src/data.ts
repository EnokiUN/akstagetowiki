import { CharacterInfo } from "./models/characters.ts";
import {
  EnemyData,
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

enum Table {
  Stage = "stage_table.json",
  Enemy = "enemy_handbook_table.json",
  Item = "item_table.json",
  Character = "character_table.json",
  Skill = "skill_table.json",
}

export const OPERATION_INFO_ROOT_URL =
  `https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/${SERVER}/gamedata/levels/`;

const getTableUrl = (tableKind: Table, china: boolean = IS_CN) => {
  return `https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/refs/heads/master/${
    china ? "cn" : "en"
  }/gamedata/excel/${tableKind}`;
};

// IDB stuff

const DB_NAME = "akstagetowiki_db";
const DB_VERSION = 1;
export const DB_STORE_NAME = "gamedata";

export const dbPromise = new Promise<IDBDatabase | null>((resolve) => {
  let db: IDBDatabase;
  const request = globalThis.indexedDB.open(DB_NAME, DB_VERSION);
  request.onerror = (e) => {
    console.error("Failed to create indexDB: ", e);
    resolve(null);
  };
  request.onsuccess = () => {
    db = request.result;
    db.onerror = (e) => {
      console.error("Database error: ", e);
    };
    resolve(db);
  };
  request.onupgradeneeded = () => {
    db = request.result;
    if (!db.objectStoreNames.contains(DB_STORE_NAME)) {
      db.createObjectStore(DB_STORE_NAME);
    }
  };
});

const preparePromise = async <T, U>(
  table: Table,
  handler: (data: U) => T,
): Promise<T> => {
  const cacheKey = `${table}-${IS_CN}`;
  const db = await dbPromise;
  if (db) {
    const transaction = db.transaction(DB_STORE_NAME);
    const store = transaction.objectStore(DB_STORE_NAME);
    const request = store.get(cacheKey);
    const cached = await new Promise<T | null>((resolve) => {
      request.onsuccess = () => {
        const cached = request.result;
        if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
          resolve(cached.map as T);
        } else resolve(null);
      };
      request.onerror = () => resolve(null);
    });
    if (cached) {
      return cached;
    }
  }

  const data = await fetch(getTableUrl(table, false)).then((r) => r.json());
  let map = handler(data as U);
  if (IS_CN) {
    const cnData = await fetch(getTableUrl(table)).then((r) => r.json());
    map = { ...handler(cnData as U), ...map };
  }

  if (db) {
    const transaction = db.transaction(DB_STORE_NAME, "readwrite");
    const store = transaction.objectStore(DB_STORE_NAME);
    const request = store.put({ timestamp: Date.now(), map }, cacheKey);
    request.onerror = (e) => {
      console.warn(`Datable erorr: Failed to cache ${cacheKey}: `, e);
    };
  }

  return map;
};

export const enemyMapPromise = preparePromise<
  { [id: string]: EnemyData },
  { enemyData: { [enemyId: string]: EnemyData } }
>(
  Table.Enemy,
  (data) => data.enemyData,
);

export const itemMapPromise = preparePromise<
  { [id: string]: ItemInfo },
  { items: { [itemId: string]: ItemInfo } }
>(
  Table.Item,
  (data) => data.items,
);

export const charMapPromise = preparePromise<
  { [id: string]: CharacterInfo },
  { [id: string]: CharacterInfo }
>(
  Table.Character,
  (data) => data,
);

export const skillMapPromise = preparePromise<
  { [id: string]: SkillInfo },
  { [id: string]: SkillInfo }
>(
  Table.Skill,
  (data) => data,
);

export const stageMapPromise = preparePromise<
  { [code: string]: RichStageInfo },
  {
    stages: { [stageId: string]: StageInfo };
    sixStarRuneData: { [runeId: string]: SixStarRuneData };
  }
>(Table.Stage, ({ stages, sixStarRuneData }) => {
  const stageMap: { [code: string]: RichStageInfo } = {};
  for (const stage of Object.values(stages)) {
    const entry = (stageMap[stage.code] ??= { runes: {}, stageInfos: [] });
    entry.stageInfos.push(stage);

    const runeIds = [stage.advancedRuneIdList1, stage.advancedRuneIdList2]
      .flatMap((l) => Object.values(l ?? {}));
    for (const runeId of runeIds) {
      const rune = sixStarRuneData[runeId];
      if (rune) {
        entry.runes[runeId] = rune;
      } else {
        console.error(`Failed to find rune: ${runeId} in rune map`);
      }
    }
  }
  return stageMap;
});
