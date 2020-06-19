import { Component, OnInit } from '@angular/core';
import { GameControllerService } from 'src/app/services/game-controller.service';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { Hero, Monster, BaseCharacter, FightOptions, Warrior, Ranger, Mage, Cleric } from 'src/app/models/character';

enum Teams {
  heroes , 
  enemies ,
  none
}


@Component({
  selector: 'fight-component',
  templateUrl: './fight.component.html',
  styleUrls: ['./fight.component.scss']
})
export class FightComponent implements OnInit {

  constructor(
    private gameController : GameControllerService , 
    private router : Router
  ) { }

  ngOnInit(): void {
  }


  heroTurn: boolean = true;
  actionDelay : number = this.gameController.actionDelay;
  turnsBetweenSpecial: number = 2;
  characterIndex: number = 0;
  // this is a flag for making sure that the user cant click or do anything while the turn of the enemy is in play
  freezeActons: boolean = false;

  heroParty: Hero[] = this.gameController.heroParty;
  // checks how many heroes are dead
  heroesIncapacitated: number = 0;
  enemyParty : Monster[] = this.gameController.enemyParty;
  enemiesIncapacitated : number =0;

  // this will check whos turn it is in this round
  currentCharacter: BaseCharacter = this.heroParty[this.characterIndex];
  // this selects what kind of attk the user can have
  _fightOptions: typeof FightOptions = FightOptions;
  // this selects who to target.
  _teams: typeof Teams = Teams;
  selectedAction: FightOptions = FightOptions.none;
  availableTargets: Teams = Teams.none;
  // this is for special attacks. some attacks can target multiple enemies/heroes at once. it will store the selected targets to the empty array
  selectedTargets: BaseCharacter[] = [];

  displayMessage: string = `${this.currentCharacter.name}'s turn`
  successMessages: string[] = [];
  showNextChapterButton : boolean = false;
  showGameOverButton : boolean = false;


  selectOption (selectedOption : FightOptions) {
    // if they try to do anything while the actions are froze or if its not the heros turn it will just return and not work
    if(this.freezeActons && this.heroTurn) {
      return;
    }
    this.selectedAction = selectedOption;
    this.selectedTargets = [];

    // if the selected option is attack it will display who to attack
    if(this.selectedAction === FightOptions.attack) {
      this.availableTargets = Teams.enemies;
      this.displayMessage = "Select a target for your attack";
      // condition for checking if user is trying to attack a hero who is less than level 3
      // instanceof hero conditional statement was added so that we can access the currentcharacter.level property
    }else if(this.selectedAction === FightOptions.specialAttack && this.currentCharacter instanceof Hero && this.currentCharacter.level < 3) {
      this.displayMessage = "Special attacks unlock for a character once they reached level 3";
    }else if (this.selectedAction === FightOptions.specialAttack && this.currentCharacter instanceof Hero && this.currentCharacter.level > 2 ){
      if(this.currentCharacter.turnsUntilSpecialAvailableAgain) {
        this.displayMessage = `Cannot use special attack yet. ${this.currentCharacter.turnsUntilSpecialAvailableAgain} turn(s) until it is available again.`;
      }else {
        if(this.currentCharacter instanceof Warrior) {
          this.availableTargets = Teams.enemies;
          this.displayMessage = `Attack two targets at once with a small attack penalty. At level 6 and above, the attack penalty is removed. The two targets may be the same enemy`;
        }
        if(this.currentCharacter instanceof Ranger) {
          this.availableTargets = Teams.heroes;
          this.displayMessage = `Setup a trap to protect one of your heroes. The trap will prevent all damage and the enemy will take a turn to free itself from the trap. At level 6 and above, the trap will also deal up to 8 damage.`;
        }
        if(this.currentCharacter instanceof Mage) {
          this.availableTargets = Teams.enemies;
          this.displayMessage = `Poison an enemy or add another stack of poison to an enemy to do up to 3 damage, with each stack of poison multiplying the damage. At level 6 and above, the damage is 1 - 6 times the number of poison stacks.`;
        }
        if(this.currentCharacter instanceof Cleric) {
          this.availableTargets = Teams.heroes;
          this.displayMessage = `Select a hero to heal for up to 3 health for each point in the intelligence skill. At level 6 and above, you can choose two targets to heal. The 2 targets can be the same hero.`
        }
      }
    }
  }

  tryAttack(target: BaseCharacter){
    // checks if it's your turn
    if(this.freezeActons){
      return;
    }
    if(target.isIncapacitated) {
      this.displayMessage = "The target is already incapacitated.";
      return;
    }

    if(this.currentCharacter instanceof Monster && target instanceof Hero){

    }

    if(this.selectedAction === FightOptions.attack){
      this.freezeActons = true;
      this.attack(target);
    }else if(this.currentCharacter instanceof Hero) {

    }else {
      this.displayMessage = `Please select an action option.`;
    }
  }
}
