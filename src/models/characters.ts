export interface CharacterInfo {
  name: string;
  description: string;
  sortIndex: number;
  spTargetType?: "NONE" | "ROGUE";
  spTargetId?: string;
  canUseGeneralPotentialItem: false;
  // ...
  skills: { skillId: string }[];
}

// "canUseGeneralPotentialItem": true,
//         "canUseActivityPotentialItem": false,
//         "potentialItemId": "p_char_1032_excu2",
//         "activityPotentialItemId": null,
//         "classicPotentialItemId": null,
//         "nationId": "laterano",
//         "groupId": null,
//         "teamId": null,
//         "mainPower": {
//             "nationId": "laterano",
//             "groupId": null,
//             "teamId": null
//         },
//         "subPower": null,
//         "displayNumber": "LT40",
//         "appellation": " ",
//         "position": "MELEE",
//         "tagList": [
//             "DPS"
//         ],
//         "itemUsage": "Saint Federico Giallo, known here as Executor.",
//         "itemDesc": "Now when given a task, he might sometimes ask why.",
//         "itemObtainApproach": "Recruitment & Headhunting",
//         "isNotObtainable": false,
//         "isSpChar": true,
//         "maxPotentialLevel": 5,
//         "rarity": "TIER_6",
//         "profession": "WARRIOR",
//         "subProfessionId": "reaper",
//         "trait": {
//             "candidates": [
//                 {
//                     "unlockCondition": {
//                         "phase": "PHASE_0",
//                         "level": 1
//                     },
//                     "requiredPotentialRank": 0,
//                     "blackboard": [
//                         {
//                             "key": "value",
//                             "value": 50.0,
//                             "valueStr": null
//                         }
//                     ],
//                     "overrideDescripton": "Cannot be healed by allies; Attacks deal <@ba.kw>AoE damage</>; Recovers <@ba.kw>{value}</> HP for every enemy hit during attacks, up to Block count",
//                     "prefabKey": null,
//                     "rangeId": null
//                 }
//             ]
//         },
//         "phases": [
//             {
//                 "characterPrefabKey": "char_1032_excu2",
//                 "rangeId": "1-3",
//                 "maxLevel": 50,
//                 "attributesKeyFrames": [
//                     {
//                         "level": 1,
//                         "data": {
//                             "maxHp": 1076,
//                             "atk": 298,
//                             "def": 224,
//                             "magicResistance": 0.0,
//                             "cost": 20,
//                             "blockCnt": 1,
//                             "moveSpeed": 1.0,
//                             "attackSpeed": 100.0,
//                             "baseAttackTime": 1.3,
//                             "respawnTime": 70,
//                             "hpRecoveryPerSec": 0.0,
//                             "spRecoveryPerSec": 1.0,
//                             "maxDeployCount": 1,
//                             "maxDeckStackCnt": 0,
//                             "tauntLevel": 0,
//                             "massLevel": 0,
//                             "baseForceLevel": 0,
//                             "stunImmune": false,
//                             "silenceImmune": false,
//                             "sleepImmune": false,
//                             "frozenImmune": false,
//                             "levitateImmune": false,
//                             "disarmedCombatImmune": false,
//                             "fearedImmune": false,
//                             "palsyImmune": false,
//                             "attractImmune": false,
//                             "teleportImmune": false,
//                             "groundBoundImmune": false
//                         }
//                     },
//                     {
//                         "level": 50,
//                         "data": {
//                             "maxHp": 1475,
//                             "atk": 439,
//                             "def": 308,
//                             "magicResistance": 0.0,
//                             "cost": 20,
//                             "blockCnt": 1,
//                             "moveSpeed": 1.0,
//                             "attackSpeed": 100.0,
//                             "baseAttackTime": 1.3,
//                             "respawnTime": 70,
//                             "hpRecoveryPerSec": 0.0,
//                             "spRecoveryPerSec": 1.0,
//                             "maxDeployCount": 1,
//                             "maxDeckStackCnt": 0,
//                             "tauntLevel": 0,
//                             "massLevel": 0,
//                             "baseForceLevel": 0,
//                             "stunImmune": false,
//                             "silenceImmune": false,
//                             "sleepImmune": false,
//                             "frozenImmune": false,
//                             "levitateImmune": false,
//                             "disarmedCombatImmune": false,
//                             "fearedImmune": false,
//                             "palsyImmune": false,
//                             "attractImmune": false,
//                             "teleportImmune": false,
//                             "groundBoundImmune": false
//                         }
//                     }
//                 ],
//                 "evolveCost": null
//             },
//             {
//                 "characterPrefabKey": "char_1032_excu2",
//                 "rangeId": "1-3",
//                 "maxLevel": 80,
//                 "attributesKeyFrames": [
//                     {
//                         "level": 1,
//                         "data": {
//                             "maxHp": 1475,
//                             "atk": 439,
//                             "def": 308,
//                             "magicResistance": 0.0,
//                             "cost": 21,
//                             "blockCnt": 2,
//                             "moveSpeed": 1.0,
//                             "attackSpeed": 100.0,
//                             "baseAttackTime": 1.3,
//                             "respawnTime": 70,
//                             "hpRecoveryPerSec": 0.0,
//                             "spRecoveryPerSec": 1.0,
//                             "maxDeployCount": 1,
//                             "maxDeckStackCnt": 0,
//                             "tauntLevel": 0,
//                             "massLevel": 0,
//                             "baseForceLevel": 0,
//                             "stunImmune": false,
//                             "silenceImmune": false,
//                             "sleepImmune": false,
//                             "frozenImmune": false,
//                             "levitateImmune": false,
//                             "disarmedCombatImmune": false,
//                             "fearedImmune": false,
//                             "palsyImmune": false,
//                             "attractImmune": false,
//                             "teleportImmune": false,
//                             "groundBoundImmune": false
//                         }
//                     },
//                     {
//                         "level": 80,
//                         "data": {
//                             "maxHp": 1967,
//                             "atk": 586,
//                             "def": 396,
//                             "magicResistance": 0.0,
//                             "cost": 21,
//                             "blockCnt": 2,
//                             "moveSpeed": 1.0,
//                             "attackSpeed": 100.0,
//                             "baseAttackTime": 1.3,
//                             "respawnTime": 70,
//                             "hpRecoveryPerSec": 0.0,
//                             "spRecoveryPerSec": 1.0,
//                             "maxDeployCount": 1,
//                             "maxDeckStackCnt": 0,
//                             "tauntLevel": 0,
//                             "massLevel": 0,
//                             "baseForceLevel": 0,
//                             "stunImmune": false,
//                             "silenceImmune": false,
//                             "sleepImmune": false,
//                             "frozenImmune": false,
//                             "levitateImmune": false,
//                             "disarmedCombatImmune": false,
//                             "fearedImmune": false,
//                             "palsyImmune": false,
//                             "attractImmune": false,
//                             "teleportImmune": false,
//                             "groundBoundImmune": false
//                         }
//                     }
//                 ],
//                 "evolveCost": [
//                     {
//                         "id": "3221",
//                         "count": 5,
//                         "type": "MATERIAL"
//                     },
//                     {
//                         "id": "30052",
//                         "count": 7,
//                         "type": "MATERIAL"
//                     },
//                     {
//                         "id": "30042",
//                         "count": 4,
//                         "type": "MATERIAL"
//                     }
//                 ]
//             },
//             {
//                 "characterPrefabKey": "char_1032_excu2",
//                 "rangeId": "1-3",
//                 "maxLevel": 90,
//                 "attributesKeyFrames": [
//                     {
//                         "level": 1,
//                         "data": {
//                             "maxHp": 1967,
//                             "atk": 586,
//                             "def": 396,
//                             "magicResistance": 0.0,
//                             "cost": 23,
//                             "blockCnt": 2,
//                             "moveSpeed": 1.0,
//                             "attackSpeed": 100.0,
//                             "baseAttackTime": 1.3,
//                             "respawnTime": 70,
//                             "hpRecoveryPerSec": 0.0,
//                             "spRecoveryPerSec": 1.0,
//                             "maxDeployCount": 1,
//                             "maxDeckStackCnt": 0,
//                             "tauntLevel": 0,
//                             "massLevel": 0,
//                             "baseForceLevel": 0,
//                             "stunImmune": false,
//                             "silenceImmune": false,
//                             "sleepImmune": false,
//                             "frozenImmune": false,
//                             "levitateImmune": false,
//                             "disarmedCombatImmune": false,
//                             "fearedImmune": false,
//                             "palsyImmune": false,
//                             "attractImmune": false,
//                             "teleportImmune": false,
//                             "groundBoundImmune": false
//                         }
//                     },
//                     {
//                         "level": 90,
//                         "data": {
//                             "maxHp": 2491,
//                             "atk": 707,
//                             "def": 461,
//                             "magicResistance": 0.0,
//                             "cost": 23,
//                             "blockCnt": 2,
//                             "moveSpeed": 1.0,
//                             "attackSpeed": 100.0,
//                             "baseAttackTime": 1.3,
//                             "respawnTime": 70,
//                             "hpRecoveryPerSec": 0.0,
//                             "spRecoveryPerSec": 1.0,
//                             "maxDeployCount": 1,
//                             "maxDeckStackCnt": 0,
//                             "tauntLevel": 0,
//                             "massLevel": 0,
//                             "baseForceLevel": 0,
//                             "stunImmune": false,
//                             "silenceImmune": false,
//                             "sleepImmune": false,
//                             "frozenImmune": false,
//                             "levitateImmune": false,
//                             "disarmedCombatImmune": false,
//                             "fearedImmune": false,
//                             "palsyImmune": false,
//                             "attractImmune": false,
//                             "teleportImmune": false,
//                             "groundBoundImmune": false
//                         }
//                     }
//                 ],
//                 "evolveCost": [
//                     {
//                         "id": "3223",
//                         "count": 4,
//                         "type": "MATERIAL"
//                     },
//                     {
//                         "id": "30155",
//                         "count": 3,
//                         "type": "MATERIAL"
//                     },
//                     {
//                         "id": "31014",
//                         "count": 7,
//                         "type": "MATERIAL"
//                     }
//                 ]
//             }
//         ],
//         "skills": [
//             {
//                 "skillId": "skchr_excu2_1",
//                 "overridePrefabKey": null,
//                 "overrideTokenKey": null,
//                 "levelUpCostCond": [
//                     {
//                         "unlockCond": {
//                             "phase": "PHASE_2",
//                             "level": 1
//                         },
//                         "lvlUpTime": 28800,
//                         "levelUpCost": [
//                             {
//                                 "id": "3303",
//                                 "count": 8,
//                                 "type": "MATERIAL"
//                             },
//                             {
//                                 "id": "30054",
//                                 "count": 4,
//                                 "type": "MATERIAL"
//                             },
//                             {
//                                 "id": "30043",
//                                 "count": 5,
//                                 "type": "MATERIAL"
//                             }
//                         ]
//                     },
//                     {
//                         "unlockCond": {
//                             "phase": "PHASE_2",
//                             "level": 1
//                         },
//                         "lvlUpTime": 57600,
//                         "levelUpCost": [
//                             {
//                                 "id": "3303",
//                                 "count": 12,
//                                 "type": "MATERIAL"
//                             },
//                             {
//                                 "id": "31034",
//                                 "count": 4,
//                                 "type": "MATERIAL"
//                             },
//                             {
//                                 "id": "30014",
//                                 "count": 9,
//                                 "type": "MATERIAL"
//                             }
//                         ]
//                     },
//                     {
//                         "unlockCond": {
//                             "phase": "PHASE_2",
//                             "level": 1
//                         },
//                         "lvlUpTime": 86400,
//                         "levelUpCost": [
//                             {
//                                 "id": "3303",
//                                 "count": 15,
//                                 "type": "MATERIAL"
//                             },
//                             {
//                                 "id": "30145",
//                                 "count": 6,
//                                 "type": "MATERIAL"
//                             },
//                             {
//                                 "id": "30104",
//                                 "count": 4,
//                                 "type": "MATERIAL"
//                             }
//                         ]
//                     }
//                 ],
//                 "unlockCond": {
//                     "phase": "PHASE_0",
//                     "level": 1
//                 }
//             },
//             {
//                 "skillId": "skchr_excu2_2",
//                 "overridePrefabKey": null,
//                 "overrideTokenKey": null,
//                 "levelUpCostCond": [
//                     {
//                         "unlockCond": {
//                             "phase": "PHASE_2",
//                             "level": 1
//                         },
//                         "lvlUpTime": 28800,
//                         "levelUpCost": [
//                             {
//                                 "id": "3303",
//                                 "count": 8,
//                                 "type": "MATERIAL"
//                             },
//                             {
//                                 "id": "31024",
//                                 "count": 4,
//                                 "type": "MATERIAL"
//                             },
//                             {
//                                 "id": "31023",
//                                 "count": 7,
//                                 "type": "MATERIAL"
//                             }
//                         ]
//                     },
//                     {
//                         "unlockCond": {
//                             "phase": "PHASE_2",
//                             "level": 1
//                         },
//                         "lvlUpTime": 57600,
//                         "levelUpCost": [
//                             {
//                                 "id": "3303",
//                                 "count": 12,
//                                 "type": "MATERIAL"
//                             },
//                             {
//                                 "id": "30104",
//                                 "count": 4,
//                                 "type": "MATERIAL"
//                             },
//                             {
//                                 "id": "31044",
//                                 "count": 8,
//                                 "type": "MATERIAL"
//                             }
//                         ]
//                     },
//                     {
//                         "unlockCond": {
//                             "phase": "PHASE_2",
//                             "level": 1
//                         },
//                         "lvlUpTime": 86400,
//                         "levelUpCost": [
//                             {
//                                 "id": "3303",
//                                 "count": 15,
//                                 "type": "MATERIAL"
//                             },
//                             {
//                                 "id": "30155",
//                                 "count": 6,
//                                 "type": "MATERIAL"
//                             },
//                             {
//                                 "id": "30064",
//                                 "count": 3,
//                                 "type": "MATERIAL"
//                             }
//                         ]
//                     }
//                 ],
//                 "unlockCond": {
//                     "phase": "PHASE_1",
//                     "level": 1
//                 }
//             },
//             {
//                 "skillId": "skchr_excu2_3",
//                 "overridePrefabKey": null,
//                 "overrideTokenKey": null,
//                 "levelUpCostCond": [
//                     {
//                         "unlockCond": {
//                             "phase": "PHASE_2",
//                             "level": 1
//                         },
//                         "lvlUpTime": 28800,
//                         "levelUpCost": [
//                             {
//                                 "id": "3303",
//                                 "count": 8,
//                                 "type": "MATERIAL"
//                             },
//                             {
//                                 "id": "31054",
//                                 "count": 4,
//                                 "type": "MATERIAL"
//                             },
//                             {
//                                 "id": "30073",
//                                 "count": 8,
//                                 "type": "MATERIAL"
//                             }
//                         ]
//                     },
//                     {
//                         "unlockCond": {
//                             "phase": "PHASE_2",
//                             "level": 1
//                         },
//                         "lvlUpTime": 57600,
//                         "levelUpCost": [
//                             {
//                                 "id": "3303",
//                                 "count": 12,
//                                 "type": "MATERIAL"
//                             },
//                             {
//                                 "id": "30044",
//                                 "count": 4,
//                                 "type": "MATERIAL"
//                             },
//                             {
//                                 "id": "30094",
//                                 "count": 7,
//                                 "type": "MATERIAL"
//                             }
//                         ]
//                     },
//                     {
//                         "unlockCond": {
//                             "phase": "PHASE_2",
//                             "level": 1
//                         },
//                         "lvlUpTime": 86400,
//                         "levelUpCost": [
//                             {
//                                 "id": "3303",
//                                 "count": 15,
//                                 "type": "MATERIAL"
//                             },
//                             {
//                                 "id": "30115",
//                                 "count": 6,
//                                 "type": "MATERIAL"
//                             },
//                             {
//                                 "id": "31024",
//                                 "count": 6,
//                                 "type": "MATERIAL"
//                             }
//                         ]
//                     }
//                 ],
//                 "unlockCond": {
//                     "phase": "PHASE_2",
//                     "level": 1
//                 }
//             }
//         ],
//         "displayTokenDict": null,
//         "talents": [
//             {
//                 "candidates": [
//                     {
//                         "unlockCondition": {
//                             "phase": "PHASE_1",
//                             "level": 1
//                         },
//                         "requiredPotentialRank": 0,
//                         "prefabKey": "1",
//                         "name": "The Chosen One",
//                         "description": "Attacks have a 10% chance to hit twice; this chance increases by 3% for each ammo consumed while a skill is active, resetting when the skill ends",
//                         "rangeId": null,
//                         "blackboard": [
//                             {
//                                 "key": "prob",
//                                 "value": 0.1,
//                                 "valueStr": null
//                             },
//                             {
//                                 "key": "prob_add",
//                                 "value": 0.03,
//                                 "valueStr": null
//                             }
//                         ],
//                         "tokenKey": null,
//                         "isHideTalent": false
//                     },
//                     {
//                         "unlockCondition": {
//                             "phase": "PHASE_1",
//                             "level": 1
//                         },
//                         "requiredPotentialRank": 4,
//                         "prefabKey": "1",
//                         "name": "The Chosen One",
//                         "description": "Attacks have a 13% <@ba.talpu>(+3%)</> chance to hit twice; this chance increases by 3% for each ammo consumed while a skill is active, resetting when the skill ends",
//                         "rangeId": null,
//                         "blackboard": [
//                             {
//                                 "key": "prob",
//                                 "value": 0.13,
//                                 "valueStr": null
//                             },
//                             {
//                                 "key": "prob_add",
//                                 "value": 0.03,
//                                 "valueStr": null
//                             }
//                         ],
//                         "tokenKey": null,
//                         "isHideTalent": false
//                     },
//                     {
//                         "unlockCondition": {
//                             "phase": "PHASE_2",
//                             "level": 1
//                         },
//                         "requiredPotentialRank": 0,
//                         "prefabKey": "1",
//                         "name": "The Chosen One",
//                         "description": "Attacks have a 20% chance to hit twice; this chance increases by 5% for each ammo consumed while a skill is active, resetting when the skill ends",
//                         "rangeId": null,
//                         "blackboard": [
//                             {
//                                 "key": "prob",
//                                 "value": 0.2,
//                                 "valueStr": null
//                             },
//                             {
//                                 "key": "prob_add",
//                                 "value": 0.05,
//                                 "valueStr": null
//                             }
//                         ],
//                         "tokenKey": null,
//                         "isHideTalent": false
//                     },
//                     {
//                         "unlockCondition": {
//                             "phase": "PHASE_2",
//                             "level": 1
//                         },
//                         "requiredPotentialRank": 4,
//                         "prefabKey": "1",
//                         "name": "The Chosen One",
//                         "description": "Attacks have a 23% <@ba.talpu>(+3%)</> chance to hit twice; this chance increases by 5% for each ammo consumed while a skill is active, resetting when the skill ends",
//                         "rangeId": null,
//                         "blackboard": [
//                             {
//                                 "key": "prob",
//                                 "value": 0.23,
//                                 "valueStr": null
//                             },
//                             {
//                                 "key": "prob_add",
//                                 "value": 0.05,
//                                 "valueStr": null
//                             }
//                         ],
//                         "tokenKey": null,
//                         "isHideTalent": false
//                     }
//                 ]
//             },
//             {
//                 "candidates": [
//                     {
//                         "unlockCondition": {
//                             "phase": "PHASE_2",
//                             "level": 1
//                         },
//                         "requiredPotentialRank": 0,
//                         "prefabKey": "2",
//                         "name": "Empathy by Shotgun",
//                         "description": "For every Laterano Operator deployed, increases the ammo capacity of this unit's ammo-based skills by +1 (stacks up to 4 times)",
//                         "rangeId": null,
//                         "blackboard": [
//                             {
//                                 "key": "add_count",
//                                 "value": 1.0,
//                                 "valueStr": null
//                             },
//                             {
//                                 "key": "add_count_max_stack",
//                                 "value": 4.0,
//                                 "valueStr": null
//                             }
//                         ],
//                         "tokenKey": null,
//                         "isHideTalent": false
//                     }
//                 ]
//             }
//         ],
//         "potentialRanks": [
//             {
//                 "type": "BUFF",
//                 "description": "DP Cost -1",
//                 "buff": {
//                     "attributes": {
//                         "abnormalFlags": null,
//                         "abnormalImmunes": null,
//                         "abnormalAntis": null,
//                         "abnormalCombos": null,
//                         "abnormalComboImmunes": null,
//                         "attributeModifiers": [
//                             {
//                                 "attributeType": "COST",
//                                 "formulaItem": "ADDITION",
//                                 "value": -1.0,
//                                 "loadFromBlackboard": false,
//                                 "fetchBaseValueFromSourceEntity": false
//                             }
//                         ]
//                     }
//                 },
//                 "equivalentCost": null
//             },
//             {
//                 "type": "BUFF",
//                 "description": "DEF +22",
//                 "buff": {
//                     "attributes": {
//                         "abnormalFlags": null,
//                         "abnormalImmunes": null,
//                         "abnormalAntis": null,
//                         "abnormalCombos": null,
//                         "abnormalComboImmunes": null,
//                         "attributeModifiers": [
//                             {
//                                 "attributeType": "DEF",
//                                 "formulaItem": "ADDITION",
//                                 "value": 22.0,
//                                 "loadFromBlackboard": false,
//                                 "fetchBaseValueFromSourceEntity": false
//                             }
//                         ]
//                     }
//                 },
//                 "equivalentCost": null
//             },
//             {
//                 "type": "BUFF",
//                 "description": "ATK +26",
//                 "buff": {
//                     "attributes": {
//                         "abnormalFlags": null,
//                         "abnormalImmunes": null,
//                         "abnormalAntis": null,
//                         "abnormalCombos": null,
//                         "abnormalComboImmunes": null,
//                         "attributeModifiers": [
//                             {
//                                 "attributeType": "ATK",
//                                 "formulaItem": "ADDITION",
//                                 "value": 26.0,
//                                 "loadFromBlackboard": false,
//                                 "fetchBaseValueFromSourceEntity": false
//                             }
//                         ]
//                     }
//                 },
//                 "equivalentCost": null
//             },
//             {
//                 "type": "CUSTOM",
//                 "description": "Improves First Talent",
//                 "buff": null,
//                 "equivalentCost": null
//             },
//             {
//                 "type": "BUFF",
//                 "description": "DP Cost -1",
//                 "buff": {
//                     "attributes": {
//                         "abnormalFlags": null,
//                         "abnormalImmunes": null,
//                         "abnormalAntis": null,
//                         "abnormalCombos": null,
//                         "abnormalComboImmunes": null,
//                         "attributeModifiers": [
//                             {
//                                 "attributeType": "COST",
//                                 "formulaItem": "ADDITION",
//                                 "value": -1.0,
//                                 "loadFromBlackboard": false,
//                                 "fetchBaseValueFromSourceEntity": false
//                             }
//                         ]
//                     }
//                 },
//                 "equivalentCost": null
//             }
//         ],
//         "favorKeyFrames": [
//             {
//                 "level": 0,
//                 "data": {
//                     "maxHp": 0,
//                     "atk": 0,
//                     "def": 0,
//                     "magicResistance": 0.0,
//                     "cost": 0,
//                     "blockCnt": 0,
//                     "moveSpeed": 0.0,
//                     "attackSpeed": 0.0,
//                     "baseAttackTime": 0.0,
//                     "respawnTime": 0,
//                     "hpRecoveryPerSec": 0.0,
//                     "spRecoveryPerSec": 0.0,
//                     "maxDeployCount": 0,
//                     "maxDeckStackCnt": 0,
//                     "tauntLevel": 0,
//                     "massLevel": 0,
//                     "baseForceLevel": 0,
//                     "stunImmune": false,
//                     "silenceImmune": false,
//                     "sleepImmune": false,
//                     "frozenImmune": false,
//                     "levitateImmune": false,
//                     "disarmedCombatImmune": false,
//                     "fearedImmune": false,
//                     "palsyImmune": false,
//                     "attractImmune": false,
//                     "teleportImmune": false,
//                     "groundBoundImmune": false
//                 }
//             },
//             {
//                 "level": 50,
//                 "data": {
//                     "maxHp": 0,
//                     "atk": 70,
//                     "def": 30,
//                     "magicResistance": 0.0,
//                     "cost": 0,
//                     "blockCnt": 0,
//                     "moveSpeed": 0.0,
//                     "attackSpeed": 0.0,
//                     "baseAttackTime": 0.0,
//                     "respawnTime": 0,
//                     "hpRecoveryPerSec": 0.0,
//                     "spRecoveryPerSec": 0.0,
//                     "maxDeployCount": 0,
//                     "maxDeckStackCnt": 0,
//                     "tauntLevel": 0,
//                     "massLevel": 0,
//                     "baseForceLevel": 0,
//                     "stunImmune": false,
//                     "silenceImmune": false,
//                     "sleepImmune": false,
//                     "frozenImmune": false,
//                     "levitateImmune": false,
//                     "disarmedCombatImmune": false,
//                     "fearedImmune": false,
//                     "palsyImmune": false,
//                     "attractImmune": false,
//                     "teleportImmune": false,
//                     "groundBoundImmune": false
//                 }
//             }
//         ],
//         "allSkillLvlup": [
//             {
//                 "unlockCond": {
//                     "phase": "PHASE_0",
//                     "level": 1
//                 },
//                 "lvlUpCost": [
//                     {
//                         "id": "3301",
//                         "count": 5,
//                         "type": "MATERIAL"
//                     }
//                 ]
//             },
//             {
//                 "unlockCond": {
//                     "phase": "PHASE_0",
//                     "level": 1
//                 },
//                 "lvlUpCost": [
//                     {
//                         "id": "3301",
//                         "count": 5,
//                         "type": "MATERIAL"
//                     },
//                     {
//                         "id": "30061",
//                         "count": 4,
//                         "type": "MATERIAL"
//                     },
//                     {
//                         "id": "30031",
//                         "count": 4,
//                         "type": "MATERIAL"
//                     }
//                 ]
//             },
//             {
//                 "unlockCond": {
//                     "phase": "PHASE_0",
//                     "level": 1
//                 },
//                 "lvlUpCost": [
//                     {
//                         "id": "3302",
//                         "count": 8,
//                         "type": "MATERIAL"
//                     },
//                     {
//                         "id": "30012",
//                         "count": 7,
//                         "type": "MATERIAL"
//                     }
//                 ]
//             },
//             {
//                 "unlockCond": {
//                     "phase": "PHASE_1",
//                     "level": 1
//                 },
//                 "lvlUpCost": [
//                     {
//                         "id": "3302",
//                         "count": 8,
//                         "type": "MATERIAL"
//                     },
//                     {
//                         "id": "30022",
//                         "count": 4,
//                         "type": "MATERIAL"
//                     },
//                     {
//                         "id": "30052",
//                         "count": 4,
//                         "type": "MATERIAL"
//                     }
//                 ]
//             },
//             {
//                 "unlockCond": {
//                     "phase": "PHASE_1",
//                     "level": 1
//                 },
//                 "lvlUpCost": [
//                     {
//                         "id": "3302",
//                         "count": 8,
//                         "type": "MATERIAL"
//                     },
//                     {
//                         "id": "30033",
//                         "count": 7,
//                         "type": "MATERIAL"
//                     }
//                 ]
//             },
//             {
//                 "unlockCond": {
//                     "phase": "PHASE_1",
//                     "level": 1
//                 },
//                 "lvlUpCost": [
//                     {
//                         "id": "3303",
//                         "count": 8,
//                         "type": "MATERIAL"
//                     },
//                     {
//                         "id": "30023",
//                         "count": 6,
//                         "type": "MATERIAL"
//                     },
//                     {
//                         "id": "30083",
//                         "count": 4,
//                         "type": "MATERIAL"
//                     }
//                 ]
//             }
//         ]
//     },
