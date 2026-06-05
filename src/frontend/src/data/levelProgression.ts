export interface LevelProgressionEntry {
  level: number;
  proficiencyIncrease: boolean;
  hpIncrease: number;
  evasionIncrease: number;
  armorThresholdIncrease: number;
  domainCardChoice: boolean;
  experienceIncrease: number;
  unlock: string;
}

export const LEVEL_PROGRESSION: LevelProgressionEntry[] = [
  {
    level: 1,
    proficiencyIncrease: false,
    hpIncrease: 0,
    evasionIncrease: 0,
    armorThresholdIncrease: 0,
    domainCardChoice: false,
    experienceIncrease: 0,
    unlock: "",
  },
  {
    level: 2,
    proficiencyIncrease: false,
    hpIncrease: 1,
    evasionIncrease: 0,
    armorThresholdIncrease: 0,
    domainCardChoice: true,
    experienceIncrease: 1,
    unlock: "",
  },
  {
    level: 3,
    proficiencyIncrease: true,
    hpIncrease: 1,
    evasionIncrease: 1,
    armorThresholdIncrease: 0,
    domainCardChoice: false,
    experienceIncrease: 1,
    unlock: "specialization",
  },
  {
    level: 4,
    proficiencyIncrease: false,
    hpIncrease: 1,
    evasionIncrease: 0,
    armorThresholdIncrease: 1,
    domainCardChoice: true,
    experienceIncrease: 1,
    unlock: "",
  },
  {
    level: 5,
    proficiencyIncrease: true,
    hpIncrease: 1,
    evasionIncrease: 1,
    armorThresholdIncrease: 0,
    domainCardChoice: false,
    experienceIncrease: 1,
    unlock: "",
  },
  {
    level: 6,
    proficiencyIncrease: false,
    hpIncrease: 1,
    evasionIncrease: 0,
    armorThresholdIncrease: 1,
    domainCardChoice: true,
    experienceIncrease: 1,
    unlock: "",
  },
  {
    level: 7,
    proficiencyIncrease: true,
    hpIncrease: 1,
    evasionIncrease: 1,
    armorThresholdIncrease: 0,
    domainCardChoice: false,
    experienceIncrease: 1,
    unlock: "mastery",
  },
  {
    level: 8,
    proficiencyIncrease: false,
    hpIncrease: 1,
    evasionIncrease: 0,
    armorThresholdIncrease: 1,
    domainCardChoice: true,
    experienceIncrease: 1,
    unlock: "",
  },
  {
    level: 9,
    proficiencyIncrease: true,
    hpIncrease: 1,
    evasionIncrease: 1,
    armorThresholdIncrease: 0,
    domainCardChoice: false,
    experienceIncrease: 1,
    unlock: "",
  },
  {
    level: 10,
    proficiencyIncrease: false,
    hpIncrease: 1,
    evasionIncrease: 0,
    armorThresholdIncrease: 1,
    domainCardChoice: true,
    experienceIncrease: 1,
    unlock: "",
  },
];
