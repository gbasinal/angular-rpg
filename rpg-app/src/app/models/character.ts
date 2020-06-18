import {RaceOptions, ClassOptions, GenderOptions} from './character-options';


export class Armor {
    constructor(name : string , defensePts : number) {
        this.name = name ;
        this.defensePts = defensePts;
    }

    name: string;
    defensePts: number;
}


export class Weapon {
    constructor(name: string , minDamage : number, maxDamage: number) {
        this.name = name ;
        this.minDamage = minDamage; 
        this.maxDamage = maxDamage;
    }

    name : string;
    minDamage: number; 
    maxDamage: number;
}


export enum CharacterSkills {
    attack = "attack",
    sneak = "sneak",
    persuade = "persuade",
    intelligence = "intelligence"
}


export enum FightOptions {
    attack = "Atack",
    specialAttack = "Special Attack" ,
    none = "None"
}


export const ExperienceTolevel = {
    1 : 1000,
    2 : 2000,
    3 : 3000,
    4 : 4000,
    5 : 5000,
    6 : 6000,
    7 : 7000,
    8 : 8000,
    9 : 9000,
    10 : 10000
}


export class BaseCharacter {

    constructor (name : string , health : number , skills = { attack : 0, sneak : 0, persuade : 0,  intelligence: 0 }) {
        this.name = name ;
        this.maxHealth = health;
        this.currentHealth = health;
        this.skills = skills; 
        this.isIncapacitated = false ;
        this.barriers = {
            attack : 10,
            sneak : 10,
            persuade : 10
        }
    }

    spriteUrl : string;
    name : string ;
    maxHealth : number;
    currentHealth : number;
    isIncapacitated : boolean;
    barriers : {
        attack : number,
        sneak: number ,
        persuade : number
    };
    skills : {
        attack : number,
        sneak: number ,
        persuade : number,
        intelligence : number
    };
    equippedWeapon : Weapon;
    equippedArmor: Armor;

    attack(){
        return Math.floor(Math.random() * 20) + 1 + this.skills.attack;
    }

    sneak(){
        return Math.floor(Math.random() * 20) + 1 + this.skills.sneak;
    }

    persuade(){
        return Math.floor(Math.random() * 20) + 1 + this.skills.persuade;
    }

    dealDamage(){
        return Math.floor(Math.random() * (this.equippedWeapon.maxDamage - this.equippedWeapon.minDamage + 1) ) + this.equippedWeapon.minDamage;
    }


}


export class Monster extends BaseCharacter {

    constructor( name, health, skills, barriers : {attack: number , sneak: number, persuade: number}, minDamage, maxDamage, spriteUrl){
        super(name, health, skills);

        this.barriers = barriers;
        this.equippedWeapon = new Weapon(undefined, minDamage, maxDamage);
        this.spriteUrl = spriteUrl;
    }

    isTrapped : boolean = false;
    poisonStacks : number = 0;
    isStrongPoison : boolean = false;
    hasTakenDamageThisTrun : boolean = false;

}

export class Hero extends BaseCharacter {
    gender : string;
    race: string; 
    characterRole : string;
    experience : number;
    level: number;
    availableSkillPoints: number;
    hasTrapDefence : boolean;
    hasDamagingTrap: boolean;
    turnsUntilSpecialAvailableAgain : number;

    constructor(name, gender, race, level, health, skills, weapon, armor){
        super(name, health, skills);

        this.gender = gender ;
        this.race = race ;
        this.experience = 0;
        this.level = level;
        this.equippedWeapon = weapon;
        this.equippedNewArmor(armor);
    }

    // if you dont want to do anything in your data type, you can assign it as void
    levelUp(): void{

        // this is to reset the exp points when leveling up
        this.experience -= ExperienceTolevel[this.level];
        this.level++;
        this.availableSkillPoints += 2;

        // this checks if the exp points surpasses the current exp limit many times it calls the levelUp method again. 
        if(this.experience >= ExperienceTolevel[this.level]){
            this.levelUp();
        }
    }

    equippedNewArmor(armor: Armor) : void{
        // this condition will check if the hero has an equipped armor
        if(this.equippedArmor){
            // this refreshes the value of defense points once we equip different armors
            this.barriers.attack -= this.equippedArmor.defensePts;
        }
        // this sets the armor we passed from the creation of hero class and setting it as the armor of the character
        this.equippedArmor = armor;
        // this adds the current defense points to the attack barrier of the character
        this.barriers.attack += armor.defensePts;
    }

    equippedNewWeapon(weapon: Weapon) : void{
        this.equippedWeapon = weapon;
    }

    rest(): void {
        this.currentHealth = this.maxHealth;
        this.isIncapacitated = false;
        this.turnsUntilSpecialAvailableAgain = 0;
    }

}

export class Warrior  extends Hero {
    constructor(name, gender, race, level, health, skills, weapon, armor){
        super(name, gender, race, level, health, skills, weapon, armor);

    }


}
export class Archer  extends Hero {
    constructor(name, gender, race, level, health, skills, weapon, armor){
        super(name, gender, race, level, health, skills, weapon, armor);

    }

}
export class Mage  extends Hero {
    constructor(name, gender, race, level, health, skills, weapon, armor){
        super(name, gender, race, level, health, skills, weapon, armor);

    }

}
export class Cleric  extends Hero {
    constructor(name, gender, race, level, health, skills, weapon, armor){
        super(name, gender, race, level, health, skills, weapon, armor);

    }

}