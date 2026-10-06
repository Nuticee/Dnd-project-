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


// ============================================================
// COMBAT ENGINE v1 — D&D 5e CLASSIC (2014)
// ============================================================

export const ACTION_TYPES = {
  ACTION: "action",
  BONUS_ACTION: "bonus_action",
  REACTION: "reaction",
  MOVEMENT: "movement",
  FREE: "free"
};

export function createCombatant(source, side = "player") {
  return {
    id: source.id ?? crypto.randomUUID(),
    name: source.name,
    side,
    hp: source.hp?.current ?? source.hp ?? 1,
    maxHP: source.hp?.max ?? source.maxHP ?? 1,
    ac: source.ac ?? 10,
    initiativeModifier: source.initiative ?? 0,
    speed: source.speed ?? 30,
    conditions: [],
    defeated: false,
    deathSaves: { successes: 0, failures: 0 },
    resources: {
      action: true,
      bonusAction: true,
      reaction: true,
      movement: source.speed ?? 30
    },
    attacks: source.attacks ?? []
  };
}

export function rollInitiativeForCombatants(combatants) {
  return combatants
    .map(c => ({
      ...c,
      initiativeRoll: initiative(c.initiativeModifier),
    }))
    .sort((a, b) => b.initiativeRoll.total - a.initiativeRoll.total)
    .map((c, index) => ({ ...c, initiativeOrder: index + 1 }));
}

export function createCombat(playerSources, enemySources = []) {
  const players = playerSources.map(c => createCombatant(c, "player"));
  const enemies = enemySources.map(c => createCombatant(c, "enemy"));
  const rolled = rollInitiativeForCombatants([...players, ...enemies]);

  return {
    id: `combat-${Date.now()}`,
    round: 1,
    turnIndex: 0,
    status: "active",
    combatants: rolled,
    log: [],
    startedAt: new Date().toISOString()
  };
}

export function currentCombatant(combat) {
  return combat.combatants[combat.turnIndex] ?? null;
}

export function resetTurnResources(combatant) {
  return {
    ...combatant,
    resources: {
      action: true,
      bonusAction: true,
      reaction: true,
      movement: combatant.speed
    }
  };
}

export function startNextTurn(combat) {
  if (!combat.combatants.length) return combat;

  let nextIndex = combat.turnIndex;
  let loops = 0;

  do {
    nextIndex = (nextIndex + 1) % combat.combatants.length;
    loops++;
    if (loops > combat.combatants.length) return combat;
  } while (combat.combatants[nextIndex].defeated);

  let round = combat.round;
  if (nextIndex <= combat.turnIndex) round++;

  const combatants = combat.combatants.map((c, i) =>
    i === nextIndex ? resetTurnResources(c) : c
  );

  return {
    ...combat,
    round,
    turnIndex: nextIndex,
    combatants
  };
}

export function spendAction(combatant, type = ACTION_TYPES.ACTION) {
  const resources = { ...combatant.resources };

  if (type === ACTION_TYPES.ACTION && !resources.action) {
    throw new Error("Action already used this turn.");
  }
  if (type === ACTION_TYPES.BONUS_ACTION && !resources.bonusAction) {
    throw new Error("Bonus action already used this turn.");
  }
  if (type === ACTION_TYPES.REACTION && !resources.reaction) {
    throw new Error("Reaction already used.");
  }

  if (type === ACTION_TYPES.ACTION) resources.action = false;
  if (type === ACTION_TYPES.BONUS_ACTION) resources.bonusAction = false;
  if (type === ACTION_TYPES.REACTION) resources.reaction = false;

  return { ...combatant, resources };
}

export function moveCombatant(combatant, distance) {
  const amount = Math.max(0, Number(distance) || 0);
  if (amount > combatant.resources.movement) {
    throw new Error("Not enough movement.");
  }

  return {
    ...combatant,
    resources: {
      ...combatant.resources,
      movement: combatant.resources.movement - amount
    }
  };
}

export function performAttack(attacker, defender, attackData, mode = "normal") {
  const attack = attackRoll(
    attackData.attackBonus ?? 0,
    defender.ac,
    mode
  );

  let damageResult = null;
  let nextDefender = defender;

  if (attack.hit) {
    damageResult = damage(
      attackData.damage ?? "1d4",
      attack.critical,
      attackData.damageModifier ?? 0
    );

    nextDefender = applyDamage(defender, damageResult.total);
  }

  return {
    attacker,
    defender: nextDefender,
    attack,
    damage: damageResult
  };
}

export function updateCombatant(combat, updated) {
  return {
    ...combat,
    combatants: combat.combatants.map(c =>
      c.id === updated.id ? updated : c
    )
  };
}

export function checkCombatEnd(combat) {
  const playersAlive = combat.combatants.some(
    c => c.side === "player" && !c.defeated
  );
  const enemiesAlive = combat.combatants.some(
    c => c.side === "enemy" && !c.defeated
  );

  let status = "active";
  if (!enemiesAlive) status = "victory";
  else if (!playersAlive) status = "defeat";

  return { ...combat, status };
}

export function playerAttack(combat, attackerId, defenderId, attackIndex = 0, mode = "normal") {
  if (combat.status !== "active") throw new Error("Combat has ended.");

  const attacker = combat.combatants.find(c => c.id === attackerId);
  const defender = combat.combatants.find(c => c.id === defenderId);

  if (!attacker || !defender) throw new Error("Combatant not found.");
  if (attacker.defeated || defender.defeated) throw new Error("Invalid defeated combatant.");
  if (currentCombatant(combat)?.id !== attackerId) throw new Error("It is not this combatant's turn.");
  if (attacker.side !== "player") throw new Error("Only player attacks use this helper.");

  const attackData = attacker.attacks[attackIndex];
  if (!attackData) throw new Error("Attack not found.");

  const spent = spendAction(attacker, ACTION_TYPES.ACTION);
  let result = performAttack(spent, defender, attackData, mode);

  let next = updateCombatant(combat, spent);
  next = updateCombatant(next, result.defender);

  next = {
    ...next,
    log: [
      ...next.log,
      {
        type: "attack",
        attackerId,
        defenderId,
        attack: result.attack,
        damage: result.damage
      }
    ]
  };

  return checkCombatEnd(next);
}

// ------------------------------------------------------------
// MONSTER DATABASE — SRD / 2014-style baseline
// These are seed monsters for testing the combat engine.
// ------------------------------------------------------------

export const MONSTERS = {
  goblin: {
    id: "goblin",
    name: "Goblin",
    size: "Small",
    type: "humanoid",
    alignment: "neutral evil",
    ac: 15,
    hp: { current: 7, max: 7 },
    speed: 30,
    challengeRating: "1/4",
    proficiencyBonus: 2,
    abilityScores: { STR: 8, DEX: 14, CON: 10, INT: 10, WIS: 8, CHA: 8 },
    abilities: ["Nimble Escape"],
    attacks: [
      { name: "Scimitar", attackBonus: 4, damage: "1d6+2", damageType: "slashing" },
      { name: "Shortbow", attackBonus: 4, damage: "1d6+2", damageType: "piercing", range: "80/320 ft" }
    ]
  },

  kobold: {
    id: "kobold",
    name: "Kobold",
    size: "Small",
    type: "humanoid",
    alignment: "lawful evil",
    ac: 12,
    hp: { current: 5, max: 5 },
    speed: 30,
    challengeRating: "1/8",
    proficiencyBonus: 2,
    abilityScores: { STR: 7, DEX: 15, CON: 9, INT: 8, WIS: 7, CHA: 8 },
    abilities: ["Sunlight Sensitivity", "Pack Tactics"],
    attacks: [
      { name: "Dagger", attackBonus: 4, damage: "1d4+2", damageType: "piercing" },
      { name: "Sling", attackBonus: 4, damage: "1d4+2", damageType: "bludgeoning", range: "30/120 ft" }
    ]
  },

  bandit: {
    id: "bandit",
    name: "Bandit",
    size: "Medium",
    type: "humanoid",
    alignment: "any non-lawful",
    ac: 12,
    hp: { current: 11, max: 11 },
    speed: 30,
    challengeRating: "1/8",
    proficiencyBonus: 2,
    abilityScores: { STR: 11, DEX: 12, CON: 12, INT: 10, WIS: 10, CHA: 10 },
    abilities: [],
    attacks: [
      { name: "Scimitar", attackBonus: 3, damage: "1d6+1", damageType: "slashing" },
      { name: "Light Crossbow", attackBonus: 3, damage: "1d8+1", damageType: "piercing", range: "80/320 ft" }
    ]
  },

  wolf: {
    id: "wolf",
    name: "Wolf",
    size: "Medium",
    type: "beast",
    alignment: "unaligned",
    ac: 13,
    hp: { current: 11, max: 11 },
    speed: 40,
    challengeRating: "1/4",
    proficiencyBonus: 2,
    abilityScores: { STR: 12, DEX: 15, CON: 12, INT: 3, WIS: 12, CHA: 6 },
    abilities: ["Keen Hearing and Smell", "Pack Tactics"],
    attacks: [
      { name: "Bite", attackBonus: 4, damage: "2d4+2", damageType: "piercing", special: "Target may be knocked prone on failed STR save." }
    ]
  },

  skeleton: {
    id: "skeleton",
    name: "Skeleton",
    size: "Medium",
    type: "undead",
    alignment: "lawful evil",
    ac: 13,
    hp: { current: 13, max: 13 },
    speed: 30,
    challengeRating: "1/4",
    proficiencyBonus: 2,
    abilityScores: { STR: 10, DEX: 14, CON: 15, INT: 6, WIS: 8, CHA: 5 },
    abilities: ["Damage Vulnerabilities: bludgeoning", "Poison Immunity"],
    attacks: [
      { name: "Shortsword", attackBonus: 4, damage: "1d6+2", damageType: "piercing" },
      { name: "Shortbow", attackBonus: 4, damage: "1d6+2", damageType: "piercing", range: "80/320 ft" }
    ]
  },

  orc: {
    id: "orc",
    name: "Orc",
    size: "Medium",
    type: "humanoid",
    alignment: "chaotic evil",
    ac: 13,
    hp: { current: 15, max: 15 },
    speed: 30,
    challengeRating: "1/2",
    proficiencyBonus: 2,
    abilityScores: { STR: 16, DEX: 12, CON: 16, INT: 7, WIS: 11, CHA: 10 },
    abilities: ["Aggressive"],
    attacks: [
      { name: "Greataxe", attackBonus: 5, damage: "1d12+3", damageType: "slashing" },
      { name: "Javelin", attackBonus: 5, damage: "1d6+3", damageType: "piercing", range: "30/120 ft" }
    ]
  },

  cultist: {
    id: "cultist",
    name: "Cultist",
    size: "Medium",
    type: "humanoid",
    alignment: "any non-good",
    ac: 12,
    hp: { current: 9, max: 9 },
    speed: 30,
    challengeRating: "1/8",
    proficiencyBonus: 2,
    abilityScores: { STR: 11, DEX: 12, CON: 10, INT: 10, WIS: 11, CHA: 10 },
    abilities: [],
    attacks: [
      { name: "Scimitar", attackBonus: 3, damage: "1d6+1", damageType: "slashing" }
    ]
  },

  bugbear: {
    id: "bugbear",
    name: "Bugbear",
    size: "Medium",
    type: "humanoid",
    alignment: "chaotic evil",
    ac: 16,
    hp: { current: 27, max: 27 },
    speed: 30,
    challengeRating: "1",
    proficiencyBonus: 2,
    abilityScores: { STR: 15, DEX: 14, CON: 13, INT: 8, WIS: 11, CHA: 9 },
    abilities: ["Brute", "Surprise Attack"],
    attacks: [
      { name: "Morningstar", attackBonus: 4, damage: "2d8+2", damageType: "piercing" },
      { name: "Javelin", attackBonus: 4, damage: "1d6+2", damageType: "piercing", range: "30/120 ft" }
    ]
  }
};

export function getMonster(id) {
  const template = MONSTERS[id];
  return template ? structuredClone(template) : null;
}

export function spawnMonster(id, side = "enemy") {
  const monster = getMonster(id);
  if (!monster) throw new Error(`Monster not found: ${id}`);
  return createCombatant(monster, side);
}

export function listMonsters() {
  return Object.values(MONSTERS).map(m => ({
    id: m.id,
    name: m.name,
    challengeRating: m.challengeRating,
    hp: m.hp.max,
    ac: m.ac
  }));
}


// ============================================================
// ADVENTURE STATE v1 — world/session state for AI DM
// ============================================================

export function createAdventureState({
  campaignId = "the-frozen-passage",
  title = "The Frozen Passage",
  characterIds = ["ilgar-zamani"],
  location = "Old Snowy Stone Gate"
} = {}) {
  return {
    version: 1,
    campaignId,
    title,
    characterIds: [...characterIds],
    scene: {
      location,
      description: "",
      weather: "snow",
      timeOfDay: "unknown"
    },
    world: {
      flags: {},
      discoveredLocations: [location],
      knownNPCs: [],
      quests: [],
      inventory: [],
      consequences: []
    },
    activeEncounter: null,
    combat: null,
    turn: 0,
    status: "active",
    dm: {
      lastSummary: "",
      pendingCheck: null,
      pendingQuestion: null
    },
    history: []
  };
}

export function appendAdventureEvent(state, event) {
  return {
    ...state,
    turn: state.turn + 1,
    history: [
      ...state.history,
      {
        id: `evt-${Date.now()}-${state.turn + 1}`,
        at: new Date().toISOString(),
        ...event
      }
    ]
  };
}

export function setScene(state, scenePatch) {
  return {
    ...state,
    scene: { ...state.scene, ...scenePatch }
  };
}

export function setWorldFlag(state, key, value) {
  return {
    ...state,
    world: {
      ...state.world,
      flags: { ...state.world.flags, [key]: value }
    }
  };
}

export function addNPC(state, npc) {
  const exists = state.world.knownNPCs.some(n => n.id === npc.id);
  return exists ? state : {
    ...state,
    world: {
      ...state.world,
      knownNPCs: [...state.world.knownNPCs, npc]
    }
  };
}

export function addQuest(state, quest) {
  const exists = state.world.quests.some(q => q.id === quest.id);
  return exists ? state : {
    ...state,
    world: {
      ...state.world,
      quests: [...state.world.quests, quest]
    }
  };
}

export function setPendingDMCheck(state, check) {
  return {
    ...state,
    dm: { ...state.dm, pendingCheck: check }
  };
}

export function clearPendingDM(state) {
  return {
    ...state,
    dm: { ...state.dm, pendingCheck: null, pendingQuestion: null }
  };
}

export function summarizeAdventureState(state) {
  return {
    campaignId: state.campaignId,
    title: state.title,
    location: state.scene.location,
    scene: state.scene.description,
    characterIds: state.characterIds,
    flags: state.world.flags,
    knownNPCs: state.world.knownNPCs,
    quests: state.world.quests,
    activeEncounter: state.activeEncounter,
    turn: state.turn,
    status: state.status,
    pendingCheck: state.dm.pendingCheck,
    lastEvents: state.history.slice(-8)
  };
}

// ============================================================
// AI DM ADAPTER v1
// IMPORTANT: model/API secret stays on a server/Edge Function.
// The browser sends game state + player action to a safe endpoint.
// ============================================================

export function buildDMRequest(state, playerAction, {
  character = null,
  ruleset = RULESET
} = {}) {
  return {
    ruleset: {
      name: ruleset.name,
      edition: ruleset.edition
    },
    role: "dungeon_master",
    policy: {
      freeformPlayerActions: true,
      neverForceABCChoices: true,
      rulesEngineOwnsDice: true,
      rulesEngineOwnsState: true,
      dmOwnsNarration: true,
      dmMayRequestChecks: true,
      dmMayDescribeConsequences: true
    },
    character,
    adventure: summarizeAdventureState(state),
    playerAction: String(playerAction).trim()
  };
}

export async function askAIDM(state, playerAction, {
  character = null,
  endpoint = "/functions/v1/ai-dm",
  fetchImpl = fetch
} = {}) {
  const payload = buildDMRequest(state, playerAction, { character });

  const response = await fetchImpl(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`AI DM request failed: HTTP ${response.status}`);
  }

  return response.json();
}

// Expected safe response shape from the server/Edge Function:
// {
//   narration: "...",
//   statePatch: {...},
//   requestCheck: null | {
//      type: "skill" | "save" | "attack",
//      abilityOrSkill: "Perception",
//      modifier: 4,
//      dc: 13,
//      reason: "You search the gate..."
//   },
//   encounter: null | {...}
// }
//
// The client/rules engine must validate and apply mechanical changes.
// The AI DM response is not trusted as a source of dice/HP truth.

// ============================================================
// SUPABASE SAVE ADAPTER v1
// Uses @supabase/supabase-js v2.
// Put only the publishable key in browser code.
// Never put a Supabase secret/service key here.
// ============================================================

export function createSupabaseGameStore(supabaseClient) {
  if (!supabaseClient) throw new Error("Supabase client is required.");

  return {
    async saveSession(sessionId, userId, state) {
      const row = {
        id: sessionId,
        user_id: userId,
        campaign_id: state.campaignId,
        state,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabaseClient
        .from("game_sessions")
        .upsert(row, { onConflict: "id" })
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async loadSession(sessionId) {
      const { data, error } = await supabaseClient
        .from("game_sessions")
        .select("*")
        .eq("id", sessionId)
        .maybeSingle();

      if (error) throw error;
      return data?.state ?? null;
    },

    async saveEvent(sessionId, userId, event) {
      const { data, error } = await supabaseClient
        .from("game_events")
        .insert({
          session_id: sessionId,
          user_id: userId,
          event
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  };
}
