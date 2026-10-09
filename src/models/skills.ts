export interface SkillInfo {
  skillId: string;
  iconId?: string;
  hidden: boolean;
  levels: SkillLevel[];
}

export interface SkillLevel {
  name: string;
  description: string;
}
