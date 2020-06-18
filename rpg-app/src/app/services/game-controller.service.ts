import { Injectable } from '@angular/core';
import {Router} from '@angular/router'
import { Hero, Weapon, Armor, Monster, Warrior, Ranger, Mage, Cleric, checkRace, ExperienceTolevel } from '../models/character';
import { Chapter, SuccessOptions } from '../models/chapter';
import { Chapter1 } from "../chapters/Chapter1";
import { ClassOptions, RaceOptions, GenderOptions } from '../models/character-options';

@Injectable()
export class GameControllerService {
  // this will help to navigate the user to different components and different  pages within the game
  constructor(private router : Router) {}

  mainCharacter: Hero;
  currentChapter: Chapter = Chapter1;
  // this flag is to make sure that when there is a fighting encounter, the user can only do fighting options and not using items in inventory
  isFighting: boolean = false;

  // this will set the delay per action whenever you are in an encounter.
  actionDelay: number = 1500;

  // this is the base settings for the user regarding a party. since there are no party members in the beggining of the story, we will be setting it to an empty array
  heroParty: Hero[] = [];
  // this tells you if the party inventory has a weapon or an armor. the default setting is an empty array
  partyInventory: (Weapon | Armor)[] = [];
  // this is a storage for the xtra acquired hero for the party since the max is 3 per party
  availableHeroes: Hero[] = [];

  // this is where the enemies will be referenced.
  enemyParty: Monster[] = this.currentChapter.enemyParty;

  // this method will accept the values for creating the main character. it will accept the name of the character, the class , the race and the gender
  setMainCharacter( character: {name: string, class: ClassOptions, race: RaceOptions, gender: GenderOptions} )  {

    // this will apply a condition if wherein the user selects a certain class, it instantiate based on the class that is selected
    switch(character.class) {

        case ClassOptions.warrior:
            // if selected, this will create a warrior class with the below stats and equipments
            this.mainCharacter = new Warrior(character.name, character.gender, character.race, 1, 10, {attack: 0, sneak: 0, persusade: 0, intelligence: 0}, new Weapon("Knife", 1, 3), new Armor("Cloth", 0));
            break;
        case ClassOptions.ranger:
            this.mainCharacter = new Ranger(character.name, character.gender, character.race, 1, 10, {attack: 0, sneak: 0, persusade: 0, intelligence: 0}, new Weapon("Knife", 1, 3), new Armor("Cloth", 0));
            break;
        case ClassOptions.mage: 
            this.mainCharacter = new Mage(character.name, character.gender, character.race, 1, 10, {attack: 0, sneak: 0, persusade: 0, intelligence: 0}, new Weapon("Knife", 1, 3), new Armor("Cloth", 0));
            break;
        case ClassOptions.cleric:
            this.mainCharacter = new Cleric(character.name, character.gender, character.race, 1, 10, {attack: 0, sneak: 0, persusade: 0, intelligence: 0}, new Weapon("Knife", 1, 3), new Armor("Cloth", 0));
            

    }

    // this will check the method created before in the character file. this method will apply the default bonus stats of the race selected
    checkRace(this.mainCharacter)

    this.heroParty.push(this.mainCharacter);

    this.router.navigateByUrl("/story");
  }
  
  encounterSuccess(): string[] {
    let messages : string[] = [];
    this.currentChapter.ifSucceed.forEach(reward => {
      switch(reward){
          case SuccessOptions.rewardExperience:
              messages.push(`Each member of your party received ${this.currentChapter.rewards.experience} experience`);
              this.heroParty.forEach(hero => {
                hero.experience += this.currentChapter.rewards.experience;
                if(hero.experience >= ExperienceTolevel[hero.level]) {
                  messages.push(`${hero.name} leveled up! Upgrade their stats on the inventory sreen.`)
                  hero.levelUp();
                };
              })
              break;
          case SuccessOptions.rewardEquipment:
              messages.push("You received the following equipments: ");
              this.currentChapter.rewards.equipment.forEach(equipment => {
                if(equipment instanceof Armor) {
                  messages.push(`${equipment.name} -- Defense Points: ${equipment.defensePts}`)
                }else {
                  messages.push(`${equipment.name} -- Min Damage: ${equipment.minDamage}, Max Damage: ${equipment.maxDamage}`)
                }
                this.partyInventory.push(equipment);
              });
              break;
          case SuccessOptions.addHeroToParty:
            let newHero : Hero = this.currentChapter.rewards.newHero;
            if(this.heroParty.length < 3) {
              messages.push(`A new hero has joined your party! ${newHero.name} - ${newHero.characterRole} - lvl ${newHero.level}`);
              this.heroParty.push(newHero);
            }else {
              messages.push(`A new hero is available to joined your party! ${newHero.name} - ${newHero.characterRole} - lvl ${newHero.level}`);
              this.availableHeroes.push(newHero);
            }
            break;
      }
    })
    return messages;
  }
  nextChapter(): void {
    this.heroParty.forEach(hero => hero.rest());
    this.currentChapter = this.currentChapter.nextChapter;
    this.enemyParty = this.currentChapter.enemyParty;
  }

  gameOver(): void {
    this.mainCharacter = undefined;
    this.currentChapter = Chapter1;
    this.heroParty = [];
    this.partyInventory = [];
    this.availableHeroes = [];
    this.enemyParty = this.currentChapter.enemyParty;

    this.router.navigateByUrl("/");
  }

}
