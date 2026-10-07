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
