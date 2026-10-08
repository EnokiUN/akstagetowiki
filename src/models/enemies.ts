export interface EnemyHandbookLevelInfo {
  classLevel: string;
  attack: EnemyHandbookLevelInfoRange;
  def: EnemyHandbookLevelInfoRange;
  magicRes: EnemyHandbookLevelInfoRange;
  maxHP: EnemyHandbookLevelInfoRange;
  moveSpeed: EnemyHandbookLevelInfoRange;
  attackSpeed: EnemyHandbookLevelInfoRange;
  enemyDamageRes: EnemyHandbookLevelInfoRange;
  enemyRes: EnemyHandbookLevelInfoRange;
}

export interface EnemyHandbookLevelInfoRange {
  min: number;
  max: number;
}

export interface EnemyData {
  enemyId: string;
  enemyIndex: string;
  enemyTags: null; // always null idk
  sortId: number;
  name: string;
  enemyLevel: string;
  description: string;
  attackType: null; // also always null lol
  ability: null; // you guessed it
  isInvalidKilled: boolean;
  overrideKillCntInfos: object; // always empty {}
  hideInHandbook: boolean;
  hideInStage: boolean;
  abilityList: EnemyAbility[];
  linkEnemies: string[];
  damageType: string[];
  invisibleDetail: boolean;
}

export interface EnemyAbility {
  test: string;
  textFormat: string;
}

export interface EnemyHandbookRaceInfo {
  id: string;
  raceName: string;
  sortId: number;
}
