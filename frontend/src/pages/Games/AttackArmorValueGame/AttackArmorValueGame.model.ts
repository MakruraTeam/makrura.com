export class Armor {
  name: ArmorType;
  image: string;
  constructor(name: ArmorType, image: string) {
    this.name = name;
    this.image = image;
  }
}

export class Attack {
  name: AttackType;
  image: string;
  constructor(name: AttackType, image: string) {
    this.name = name;
    this.image = image;
  }
}

export class DamageGame {
  damageTable: DamageTable = {
    Normal: { Heavy: 100, Medium: 150, Light: 100, Unarmored: 100, Hero: 100, Fortified: 70 },
    Piercing: { Heavy: 90, Medium: 75, Light: 200, Unarmored: 150, Hero: 50, Fortified: 35 },
    Magic: { Heavy: 200, Medium: 75, Light: 125, Unarmored: 100, Hero: 50, Fortified: 35 },
    Siege: { Heavy: 100, Medium: 50, Light: 100, Unarmored: 150, Hero: 50, Fortified: 150 },
    Hero: { Heavy: 100, Medium: 100, Light: 100, Unarmored: 100, Hero: 100, Fortified: 50 },
    Chaos: { Heavy: 100, Medium: 100, Light: 100, Unarmored: 100, Hero: 100, Fortified: 100 },
    Spell: { Heavy: 100, Medium: 100, Light: 100, Unarmored: 100, Hero: 70, Fortified: 100 },
  };

  getDamageValue(attack: AttackType, armor: ArmorType): number {
    return this.damageTable[attack][armor];
  }
}

export type ArmorType = 'Heavy' | 'Medium' | 'Light' | 'Unarmored' | 'Hero' | 'Fortified';
export type AttackType = 'Normal' | 'Piercing' | 'Magic' | 'Siege' | 'Hero' | 'Chaos' | 'Spell';

export type DamageTable = {
  [attackType in AttackType]: { [armorType in ArmorType]: number };
};
