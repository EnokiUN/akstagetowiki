export interface RichStageInfo {
  stageInfos: StageInfo[];
  runes: { [name: string]: SixStarRuneData };
}

// types from the datamined stuff
export interface StageInfo {
  stageType: string;
  difficulty: string;
  performanceStageFlag: string;
  diffGroup: string;
  unlockCondition: object;
  stageId: string;
  levelId: string;
  zoneId: string;
  code: string;
  name: string;
  description: string;
  hardStagedId: string;
  sixStarStageId: null; // yes, this is always null. I checked
  dangerLevel: string;
  dangerPoint: number;
  loadingPicId: string;
  canPractice: boolean;
  canBattleReplay: boolean;
  apCost: number;
  apFailReturn: number;
  maxSlot: number;
  etItemId?: string;
  etCost: number;
  etFailReturn: number;
  etButtonStyle?: string;
  apProtectTimes: number;
  diamondOnceDrop: number;
  practiceTicketCost: number;
  dailyStageDifficulty: number;
  expGain: number;
  goldGain: number;
  loseExpGain: number;
  loseGoldGain: number;
  passFavor: number;
  completeFavor: number;
  slProgress: number;
  displayMainItem: string;
  hilightMark: boolean;
  bossMark: boolean;
  isPredefined: boolean;
  isHardPredefined: boolean;
  isSkillSelectablePredefined: boolean;
  isStoryOnly: boolean;
  appearanceStyle: string;
  stageDropInfo: StageDropInfo;
  canUseCharm: boolean;
  canUseTech: boolean;
  canUseTrapTool: boolean;
  canUseBattlePerformance: boolean;
  canUseFirework: boolean;
  canMultipleBattle: boolean;
  startButtonOverrideId: string;
  isStagePatch: boolean;
  mainStageId: string;
  extraCondition: string;
  extraInfo?: object;
  sixStarBaseDesc?: string;
  sixStarDisplayRewardList?: object;
  advancedRuneIdList1?: string[];
  advancedRuneIdList2?: string[];
  useSpecialSizeMapPreview: boolean;
}

export interface StageDropInfo {
  // these seem to have been superceded by the `displayRewards` and `displayDetailRewards` fields
  firstPassRewards: null;
  firstCompleteRewards: null;
  passRewards: null;
  completeRewards: null;

  displayRewards: StageRewardDisplay[];
  displayDetailRewards: StageDetailRewardDisplay[];
}

export interface StageRewardDisplay {
  type: string;
  id: string;
  dropType: "COMPLETE" | "NORMAL" | "SPECIAL" | "ADDITIONAL";
}

export interface StageDetailRewardDisplay extends StageRewardDisplay {
  occPercent: string;
}

export interface SixStarRuneData {
  runeId: string;
  runeDesc: string;
  runeKey: string;
}

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

export interface EnemyHandbookRaceData {
  id: string;
  raceName: string;
  sortId: number;
}

export interface OperationInfo {
  options: OperationOptions;
  levelId?: string; // ??
  mapId?: string; // ??
  bgmEvent: string;
  environmentSe?: string;
  mapData: object;
  tiles: object;
  tilesDisallowToLocate: object[];
  runes: object[];
  optionalRunes: object[];
  globalBuffs: object[];
  routes: object[];
  extraRoutes: object[];
  enemies: object[];
  enemyDbRefs: EnemyDbRef[];
  waves: OperationWave[];
  branches: object;
  predefines: object;
  hardPredefines: object;
  excludeCharIdList: string[];
  randomSeed: number;
  operaConfig?: string;
  camrePlugin: string;
}

export interface OperationOptions {
  characterLimit: number;
  maxLifePoint: number;
  initialCost: number;
  maxCost: number;
  constIncreaseTime: number;
  moveMultiplier: number;
  steeringEnabled: boolean;
  reachableCheckIgnoreStartTile: boolean;
  isTrainingLevel: boolean;
  isHardTrainingLevel: boolean;
  isPredifinedCardsSelectable: boolean;
  displayRestTime: boolean;
  maxPlayTime: number;
  functionDisableMask: string;
  configBlackBoard: object[];
}

export interface EnemyDbRef {
  useDb: boolean;
  id: string;
  level: number;
  // overwrittenData?: EnemyDbRefOverwrittenData; // maybe in the future
  overwrittenData?: object;
}

// export interface EnemyDbRefOverwrittenData {
//   ...
// }
//
// export interface EnemyDbRefOverwrittenDataSetting {
//   m_definedL: any;
//   m_value: any;
// }

export interface OperationWave {
  preDelay: number;
  postDelay: number;
  maxTimeWaitingFornextWave: number;
  fragments: OperationWaveFragment[];
}

export interface OperationWaveFragment {
  preDelay: number;
  actions: OperationWaveFragmentAction[];
}

export interface OperationWaveFragmentAction {
  actionType: "SPAWN" | "DISPLAY_ENEMY_INFO";
  managedByScheduler: boolean;
  key: string;
  count: number;
  preDelay: number;
  interval: number;
  routeIndex: number;
  blockFragment: boolean;
  autoPreviewRoute: boolean;
  autoDisplayEnemyInfo: boolean;
  isUnharmfulAndAlwaysCountAsKilled: boolean;
  hiddenGroup?: object;
  randomSpawnGroupKey?: object;
  randomSpawnGroupPackKey?: object;
  randomType: string;
  refreshType: string;
  weight: number;
  dontBlockWave: boolean;
  forceBlockWaveInBranch: boolean;
}

export interface ItemInfo {
  itemId: string;
  name: string;
  description: string;
  rarity: string;
  iconId: string;
  overrideBkg: object;
  stackIconId: object;
  sortId: number;
  usage: string;
  obtainApproach: string;
  hideInItemGet: boolean;
  classifyType: string;
  itemType: string;
  stageDropList: object[];
  buildingProductList: object;
  voucherRelateList: object;
  shopRelateInfoList: object;
}
