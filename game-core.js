// ============================================================
// D&D AI DM — GAME CORE v1
// D&D 5e CLASSIC (2014) foundation
// Single-file mobile-friendly core: CHARACTER DATA + DICE ENGINE
// ============================================================

export const RULESET = {
  name: "D&D 5e",
  edition: "2014",
  note: "Classic 5e foundation. Do not use 2024 rules in this module."
};

// ------------------------------------------------------------
// CHARACTER DATABASE — seed data
// Player Name from D&D Beyond is intentionally not stored.
// Character Name is the identity used by the app.
// ------------------------------------------------------------

export const CHARACTERS = [
  {
    id: "ilgar-zamani",
    name: "Ilgar Zamani",
    race: "Human",
    class: "Wizard",
    level: 3,
    background: "Sage",
    alignment: "Neutral",
    xp: 900,
    hp: { current: 16, max: 16 },
    hitDie: "d6",
    ac: 12,
    speed: 30,
    proficiencyBonus: 2,
    abilityScores: { STR: 9, DEX: 13, CON: 14, INT: 16, WIS: 14, CHA: 12 },
    abilityModifiers: { STR: -1, DEX: 1, CON: 2, INT: 3, WIS: 2, CHA: 1 },
    savingThrows: { STR: -1, DEX: 1, CON: 2, INT: 5, WIS: 2, CHA: 1 },
    initiative: 1,
    passivePerception: 12,
    skills: {
      Arcana: 5, History: 5, Insight: 4, Investigation: 5,
      Medicine: 2, Nature: 3, Perception: 4, Religion: 5
    },
    resistances: ["Cold"],
    spellcasting: {
      ability: "INT",
      saveDC: 13,
      attackBonus: 5,
      spellSlots: { "1": 4, "2": 2 },
      prepared: [
        "Mage Armor", "Magic Missile", "Sleep", "Detect Magic",
        "Find Familiar", "Fog Cloud"
      ]
    },
    spells: {
      cantrips: ["Ray of Frost", "Mage Hand", "Minor Illusion"],
      level1: ["Mage Armor", "Magic Missile", "Sleep", "Detect Magic", "Find Familiar"],
      level2: ["Misty Step", "Scorching Ray", "Web"]
    },
    features: [
      "Arcane Recovery",
      "Arcane Tradition: School of Evocation",
      "Sculpt Spells"
    ],
    attacks: [
      { name: "Ray of Frost", type: "spell", attackBonus: 5, damage: "1d8", damageType: "cold" },
      { name: "Quarterstaff", type: "weapon", attackBonus: 1, damage: "1d6-1", damageType: "bludgeoning" }
    ],
    equipment: [
      "Staff of Frost", "Quarterstaff", "Leather Armor",
      "Spellbook", "Arcane Focus", "Backpack", "Parchment", "Ink Pen"
    ],
    gold: 1,
    attunement: ["Staff of Frost"],
    personality: {
      ideal: "Self-Improvement",
      bond: "Protect students and preserve the library/university/scriptorium/monastery.",
      flaw: "Easily distracted by information."
    },
    backstory:
      "A village threatened by drought and volcanic eruption was saved after Ilgar called an entity from the Plane of Ice. The entity lent him the Staff of Frost and tasked him with travelling the world to balance excessive heat. If he fails or the staff is destroyed, his village freezes forever."
  },

  {
    id: "four",
    name: "Four",
    race: "Wood Elf",
    class: "Ranger",
    level: 3,
    background: "Sage",
    alignment: "Neutral",
    xp: 900,
    hp: { current: 22, max: 22 },
    hitDie: "d10",
    ac: 15,
    speed: 35,
    proficiencyBonus: 2,
    abilityScores: { STR: 12, DEX: 16, CON: 10, INT: 13, WIS: 14, CHA: 13 },
    abilityModifiers: { STR: 1, DEX: 3, CON: 0, INT: 1, WIS: 2, CHA: 1 },
    savingThrows: { STR: 3, DEX: 5, CON: 0, INT: 1, WIS: 2, CHA: 1 },
    initiative: 3,
    passivePerception: 14,
    darkvision: "60 ft",
    resistances: [],
    defenses: ["Immune to magical sleep", "Advantage against being charmed"],
    skills: {
      Acrobatics: 3, AnimalHandling: 4, Arcana: 3, Athletics: 1,
      Deception: 1, History: 3, Insight: 2, Intimidation: 1,
      Investigation: 3, Medicine: 2, Nature: 1, Perception: 4,
      Performance: 1, Persuasion: 1, Religion: 1, SleightOfHand: 3,
      Stealth: 5, Survival: 2
    },
    features: [
      "Favored Enemy: Humanoids",
      "Natural Explorer: Forest",
      "Fighting Style: Archery",
      "Ranger spellcasting",
      "Wood Elf: Darkvision",
      "Wood Elf: Keen Senses",
      "Wood Elf: Fey Ancestry",
      "Wood Elf: Trance",
      "Wood Elf: Elf Weapon Training",
      "Wood Elf: Fleet of Foot",
      "Wood Elf: Mask of the Wild"
    ],
    spellcasting: {
      ability: "WIS",
      saveDC: 12,
      attackBonus: 4,
      spellSlots: { "1": 3 },
      prepared: ["Hunter's Mark", "Cure Wounds"]
    },
    attacks: [
      { name: "Longbow", type: "weapon", attackBonus: 7, damage: "1d8+3", damageType: "piercing", range: "150/600 ft" },
      { name: "Shortsword", type: "weapon", attackBonus: 5, damage: "1d6+3", damageType: "piercing" },
      { name: "Unarmed Strike", type: "weapon", attackBonus: 3, damage: "1d4+1", damageType: "bludgeoning" }
    ],
    equipment: [
      "Studded Leather", "Shortsword", "Longbow", "17 Arrows",
      "Backpack", "Bedroll", "Mess Kit", "10 Rations",
      "50 ft Hemp Rope", "Tinderbox", "10 Torches", "Waterskin"
    ],
    gold: 16
  },

  {
    id: "copy-of-yusss-character",
    name: "Copy of Yusss's Character",
    race: "Human",
    class: "Rogue",
    level: 3,
    background: "Criminal / Spy",
    alignment: "Neutral",
    xp: 900,
    hp: { current: 24, max: 24 },
    hitDie: "d8",
    ac: 13,
    speed: 30,
    proficiencyBonus: 2,
    abilityScores: { STR: 10, DEX: 15, CON: 14, INT: 11, WIS: 13, CHA: 12 },
    abilityModifiers: { STR: 0, DEX: 2, CON: 2, INT: 0, WIS: 1, CHA: 1 },
    savingThrows: { STR: 0, DEX: 4, CON: 2, INT: 2, WIS: 1, CHA: 1 },
    initiative: 2,
    passivePerception: 13,
    skills: {
      Acrobatics: 6, AnimalHandling: 1, Arcana: 0, Athletics: 2,
      Deception: 3, History: 0, Insight: 3, Intimidation: 3,
      Investigation: 2, Medicine: 1, Nature: 0, Perception: 3,
      Performance: 1, Persuasion: 1, Religion: 0,
      SleightOfHand: 4, Stealth: 6, Survival: 1
    },
    expertise: ["Acrobatics", "Stealth"],
    proficiencies: [
      "Light Armor", "Hand Crossbow", "Rapier", "Scimitar",
      "Shortsword", "Simple Weapons", "Whip",
      "Thieves' Tools", "Forgery Kit", "Poisoner's Kit", "Darts"
    ],
    languages: ["Common", "Common Sign Language", "Draconic", "Thieves' Cant", "Undercommon"],
    features: [
      "Expertise",
      "Sneak Attack (2d6)",
      "Thieves' Cant",
      "Cunning Action",
      "Roguish Archetype: Thief",
      "Fast Hands",
      "Second-Story Work"
    ],
    attacks: [
      { name: "Dagger", type: "weapon", attackBonus: 4, damage: "1d4+2", damageType: "piercing" },
      { name: "Shortbow", type: "weapon", attackBonus: 4, damage: "1d6+2", damageType: "piercing", range: "80/320 ft" },
      { name: "Shortsword", type: "weapon", attackBonus: 4, damage: "1d6+2", damageType: "piercing" }
    ],
    sneakAttack: "2d6",
    equipment: [
      "Leather Armor", "Dagger", "Shortbow", "Shortsword",
      "Common Clothes", "Crowbar", "Backpack", "Quiver",
      "Thieves' Tools", "20 Arrows", "7 Oil", "1000 Ball Bearings",
      "5 Rations", "Rope", "Bell", "Tinderbox", "Waterskin",
      "Hooded Lantern", "10 Candles"
    ],
    gold: 23
  }
];

// ------------------------------------------------------------
// DICE ENGINE
// ------------------------------------------------------------

export const DICE_SIDES = [4, 6, 8, 10, 12, 20];

function assertSides(sides) {
  if (!DICE_SIDES.includes(sides)) throw new Error(`Unsupported die: d${sides}`);
}

function randomInt(max) {
  return Math.floor(Math.random() * max) + 1;
}

export function rollDie(sides) {
  assertSides(sides);
  return randomInt(sides);
}

export function rollDice(count, sides) {
  if (!Number.isInteger(count) || count < 1) {
    throw new Error("count must be >= 1");
  }
  assertSides(sides);
  return Array.from({ length: count }, () => rollDie(sides));
}

export function roll(expression, modifier = 0) {
  const match = String(expression).trim().match(/^(\d+)d(4|6|8|10|12|20)$/i);
  if (!match) throw new Error("Use expressions like 1d20, 1d8, or 2d6.");
  const count = Number(match[1]);
  const sides = Number(match[2]);
  const rolls = rollDice(count, sides);

  return {
    expression: `${count}d${sides}`,
    rolls,
    modifier,
    total: rolls.reduce((a, b) => a + b, 0) + modifier
  };
}

export function d20(modifier = 0, mode = "normal") {
  const first = rollDie(20);

  if (mode === "normal") {
    return {
      rolls: [first],
      kept: first,
      modifier,
      total: first + modifier
    };
  }

  if (mode !== "advantage" && mode !== "disadvantage") {
    throw new Error("d20 mode must be normal, advantage, or disadvantage.");
  }

  const second = rollDie(20);
  const kept = mode === "advantage"
    ? Math.max(first, second)
    : Math.min(first, second);

  return {
    rolls: [first, second],
    kept,
    modifier,
    total: kept + modifier
  };
}

export function checkD20(modifier = 0, { mode = "normal", dc = null } = {}) {
  const result = d20(modifier, mode);
  const nat20 = result.kept === 20;
  const nat1 = result.kept === 1;

  let success = null;
  if (dc !== null) {
    success = nat20 ? true : nat1 ? false : result.total >= dc;
  }

  return { ...result, nat20, nat1, dc, success };
}

export function attackRoll(attackBonus, targetAC, mode = "normal") {
  const result = d20(attackBonus, mode);

  const critical = result.kept === 20;
  const criticalMiss = result.kept === 1;

  const hit =
    critical ||
    (!criticalMiss && result.total >= targetAC);

  return {
    ...result,
    targetAC,
    hit,
    critical,
    criticalMiss
  };
}

export function damage(expression, critical = false, modifier = 0) {
  const match = String(expression).trim().match(/^(\d+)d(4|6|8|10|12|20)$/i);
  if (!match) throw new Error("Damage must look like 1d8 or 2d6.");

  const count = Number(match[1]);
  const sides = Number(match[2]);

  // 2014 5e: critical hit doubles the number of damage dice.
  const diceCount = critical ? count * 2 : count;
  const rolls = rollDice(diceCount, sides);

  return {
    expression: `${diceCount}d${sides}`,
    rolls,
    modifier,
    total: Math.max(
      0,
      rolls.reduce((a, b) => a + b, 0) + modifier
    )
  };
}

export function applyDamage(target, amount) {
  const damageAmount = Math.max(0, amount);
  const hp = Math.max(0, target.hp - damageAmount);

  return {
    ...target,
    hp,
    defeated: hp === 0
  };
}

export function heal(target, amount) {
  const healing = Math.max(0, amount);
  const hp = Math.min(target.maxHP, target.hp + healing);

  return {
    ...target,
    hp,
    defeated: false
  };
}

export function initiative(dexModifier, bonus = 0) {
  return d20(dexModifier + bonus);
}

export function contestedCheck(modA, modB, modeA = "normal", modeB = "normal") {
  const a = d20(modA, modeA);
  const b = d20(modB, modeB);

  return {
    a,
    b,
    winner:
      a.total === b.total ? "tie" :
      a.total > b.total ? "A" : "B"
  };
}

// ------------------------------------------------------------
// SIMPLE HELPERS FOR THE FUTURE COMBAT ENGINE
// ------------------------------------------------------------

export function getCharacter(id) {
  return CHARACTERS.find(c => c.id === id) ?? null;
}

export function cloneCharacter(id) {
  const character = getCharacter(id);
  return character ? structuredClone(character) : null;
}

export function resetCharacterHP(id) {
  const character = cloneCharacter(id);
  if (!character) return null;
  character.hp.current = character.hp.max;
  return character;
}
