export * from "./stages.ts";
export * from "./enemies.ts";
export * from "./operations.ts";
export * from "./characters.ts";
export * from "./items.ts";
export * from "./skills.ts";

import { SixStarRuneData, StageInfo } from "./stages.ts";

export interface RichStageInfo {
  stageInfos: StageInfo[];
  runes: { [name: string]: SixStarRuneData };
}
