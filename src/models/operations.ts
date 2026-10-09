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
  predefines: OperationPredefines;
  hardPredefines: OperationPredefines;
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

export interface OperationPredefines {
  characterInsts: OperationPredifineInst[];
  tokenInsts: OperationPredifineInst[];
  characterCards: OperationPredifineToken[];
  tokenCards: OperationPredifineToken[];
}

export interface OperationPredifineBase {
  alias?: string;
  uniEquipIds?: { key: string; level: number }[];
  showSpIllust: boolean;
  masterInfos?: object;
  inst: {
    characterKey: string;
    level: number;
    phase: "PHASE_0" | "PHASE_1" | "PHASE_2";
    favorPoint: number;
    potentialRank: number;
  };
  skillIndex: number;
  mainSkillLvl: number;
  skinId: string;
  tmplId?: object;
  overrideSkillBlackboard?: object;
  overrideTalents?: object;
}

export interface OperationPredifineInst extends OperationPredifineBase {
  position: { row: number; col: number };
  direction: "UP" | "DOWN" | "LEFT" | "RIGHT";
}

export interface OperationPredifineToken extends OperationPredifineBase {
  initialCnt: number;
  hidden: boolean;
}
