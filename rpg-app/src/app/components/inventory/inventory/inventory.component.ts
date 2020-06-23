import { Component, OnInit } from '@angular/core';
import { GameControllerService } from 'src/app/services/game-controller.service';
import { CharacterSkills, Hero, Weapon, Armor, ExperienceTolevel } from 'src/app/models/character';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'inventory-component',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

  constructor(private gameControllerService : GameControllerService) { }

  ngOnInit(): void {
  }

  inventoryIsOpen : boolean = false;
  
  _characterSkills : typeof CharacterSkills = CharacterSkills;
  heroParty : Hero[] = this.gameControllerService.heroParty;
  mainCharacter : Hero = this.gameControllerService.mainCharacter;
  availableHeroes: Hero[] = this.gameControllerService.availableHeroes;
  inventory : (Weapon | Armor)[] = this.gameControllerService.partyInventory;
  _experienceToLevel : typeof ExperienceTolevel = ExperienceTolevel;

  selectedHero: Hero = this.heroParty[0];
  showAvailableHeroesScreen: boolean = false;
  isFighting : boolean = this.gameControllerService.isFighting;


  openInventory() {
    this.inventoryIsOpen = true;
    // the properties below refreshes the data 
    this.heroParty = this.gameControllerService.heroParty;
    this.availableHeroes = this.gameControllerService.availableHeroes;
    this.inventory = this.gameControllerService.partyInventory;
    this.selectedHero = this.heroParty[0];
    this.showAvailableHeroesScreen = false;
    this.isFighting = this.gameControllerService.isFighting;
  }

  closeInventory(){
    this.inventoryIsOpen = false;
  }

  setSelectedHero(newHero: Hero) {
    this.showAvailableHeroesScreen = false;
    if(this.selectedHero !== newHero) {
      this.selectedHero = newHero;
    }
  }

  improveSkill(skill: CharacterSkills){
    this.selectedHero.skills[skill]++;
    this.selectedHero.availableSkillPoints--;
  }

  equipItem(item: Weapon | Armor){ 
    if(item instanceof Weapon) {
      this.inventory.push(this.selectedHero.equippedWeapon);
      this.selectedHero.equippedNewWeapon(item);
    }else if (item instanceof Armor) {
      this.inventory.push(this.selectedHero.equippedArmor);
      this.selectedHero.equippedNewArmor(item);
    }

    // this will remove 1 item to your inventory
    this.inventory.splice(this.inventory.indexOf(item), 1)
  }

  removeCharacterFromParty(){
    this.availableHeroes.push(this.selectedHero);
    this.heroParty.splice(this.heroParty.indexOf(this.selectedHero), 1);
    this.selectedHero = this.mainCharacter;
  }

  showAvailableHeroes() {
    this.selectedHero = undefined;
    this.showAvailableHeroesScreen = true;
  }

  addHeroToParty(hero: Hero) {
    this.heroParty.push(hero);
    this.availableHeroes.splice(this.availableHeroes.indexOf(hero), 1);
    this.setSelectedHero(hero);
  } 
}
