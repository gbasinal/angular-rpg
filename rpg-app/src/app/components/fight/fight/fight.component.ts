import { Component, OnInit } from '@angular/core';
import { GameControllerService } from 'src/app/services/game-controller.service';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { Hero, Monster, BaseCharacter, FightOptions, Warrior, Ranger, Mage, Cleric } from 'src/app/models/character';
import { hasLifecycleHook } from '@angular/compiler/src/lifecycle_reflector';


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
    if(this.freezeActons && this.heroTurn){
      return;
    }
    if(target.isIncapacitated) {
      this.displayMessage = "The target is already incapacitated.";
      return;
    }

    if(this.currentCharacter instanceof Monster && target instanceof Hero){
      if(target.hasTrapDefence){
        this.currentCharacter.isTrapped = true;

        if(target.hasDamagingTrap){
          let damage = Math.floor(Math.random() *8) + 1;
          this.currentCharacter.currentHealth -= damage;
          this.displayMessage = `${target.name} was protected by a trap. ${this.currentCharacter.name} is stuck in the trap, taking ${damage} damage.`;
          if(this.currentCharacter.currentHealth <= 0){
            this.currentCharacter.isIncapacitated = true;
            this.enemiesIncapacitated++;
          }
        }else {
          this.displayMessage = `${target.name} was protected by a trap. ${this.currentCharacter.name} is stuck in the trap`;
        }

        target.hasTrapDefence = false;
        target.hasDamagingTrap = false;
        setTimeout(()=> {
          this.checkIfWin();
        },this.actionDelay);
        return;
      }
    }

    if(this.selectedAction === FightOptions.attack){
      this.freezeActons = true;
      this.attack(target);
    }else if(this.currentCharacter instanceof Hero && this.currentCharacter.level >2 && this.selectedAction === FightOptions.specialAttack) {
      const upgraded : boolean = this.currentCharacter.level > 5;
      
      if(this.currentCharacter instanceof Warrior){
        this.warriorSpecialAttack(target, upgraded);
      }
      if(this.currentCharacter instanceof Ranger){
        this.rangerSpecialAttack(target, upgraded);
      }
      if(this.currentCharacter instanceof Mage){
        this.mageSpecialAttack(target, upgraded);
      }
      if(this.currentCharacter instanceof Cleric){
        this.clericSpecialAttack(target, upgraded);
      }
    }else {
      this.displayMessage = `Please select an action option.`;
    }
  }

  warriorSpecialAttack(target: BaseCharacter, upgraded: boolean){
    if(!(target instanceof Monster)){
      this.displayMessage = `Only enemies can be targeted for a warrior's special attack`;
      return;
    }

    this.selectedTargets.push(target);
    if(this.selectedTargets.length < 2){
      this.displayMessage = `Select a second target for your warrior's special attack`;
    }else if(this.currentCharacter instanceof Hero){
      this.freezeActons = true;
      this.currentCharacter.turnsUntilSpecialAvailableAgain = this.turnsBetweenSpecial;
      let doubleAttackPenalty = upgraded ? 0 : 4;
      let firstTarget : BaseCharacter = this.selectedTargets[0];
      let secondTarget : BaseCharacter = this.selectedTargets[1];

      if(this.currentCharacter.attack() - doubleAttackPenalty >= firstTarget.barriers.attack){
        let damage = this.currentCharacter.dealDamage();
        firstTarget.currentHealth -= damage;
        this.displayMessage = `${this.currentCharacter.name} hit ${firstTarget.name} dealing ${damage} damage`;
        if(firstTarget.currentHealth <= 0){
          firstTarget.isIncapacitated = true;
          this.enemiesIncapacitated++;
        }
      }else {
        this.displayMessage = `${this.currentCharacter.name} Missed.`
      }

      setTimeout(()=> {
        if(this.currentCharacter.attack() - doubleAttackPenalty >= secondTarget.barriers.attack){
          let damage = this.currentCharacter.dealDamage();
          secondTarget.currentHealth -= damage;
          this.displayMessage = `${this.currentCharacter.name} hit ${secondTarget.name} dealing ${damage} damage`;
          // the reason why there's another flag for this if statement is to make sure that the target is not already dead. this flag is good if you have attacked the same enemy twice.
          if(secondTarget.currentHealth <= 0 && !secondTarget.isIncapacitated){
            secondTarget.isIncapacitated = true;
            this.enemiesIncapacitated++;
          }
        }else {
          this.displayMessage = `${this.currentCharacter.name} Missed`;
        }
        setTimeout(()=> {
          this.selectedTargets = [];
          this.checkIfWin();
          
        },this.actionDelay);
      },this.actionDelay);
    }

  }

  rangerSpecialAttack(target : BaseCharacter, upgraded : boolean) {
    if(!(target instanceof Hero)){
      this.displayMessage = `Only a hero can be targeted for a ranger's special attack`;
      return;
    }

    if(target.hasTrapDefence){
      this.displayMessage = `Target hero alread has a trap defense in place.`;
      return;
    }

    this.freezeActons = true;
    if(this.currentCharacter instanceof Hero){
      this.currentCharacter.turnsUntilSpecialAvailableAgain = this.turnsBetweenSpecial;
    }
    this.displayMessage = `${this.currentCharacter.name} set up a trap to protect ${target.name}`;
    target.hasTrapDefence = true;
    target.hasDamagingTrap = upgraded;
    setTimeout(()=> {
      this.nextTurn();
    }, this.actionDelay);
  }

  mageSpecialAttack(target: BaseCharacter, upgraded: boolean){
    if(!(target instanceof Monster)){
      this.displayMessage = `Only a monster can be targeted for the Mage's special attack`;
      return;
    }
    this.freezeActons = true;
    if(this.currentCharacter instanceof Hero) {
      this.currentCharacter.turnsUntilSpecialAvailableAgain = this.turnsBetweenSpecial;
    }
    target.isStrongPoisoned = upgraded;
    target.poisonStacks++;
    this.displayMessage = `${target.name} was poisoned. (${target.poisonStacks} stack(s))`;
    setTimeout(()=>{
      this.nextTurn();
    },this.actionDelay);
  }

  clericSpecialAttack(target: BaseCharacter, upgraded: boolean){
    if(!(target instanceof Hero)){
      this.displayMessage = `Only a hero can be targeted for the Cleric's special attack`;
    }

    if(upgraded){
      this.selectedTargets.push(target);
      if(this.selectedTargets.length < 2){
        this.displayMessage = `Select a second target to heal`;
        return;
      }
      this.freezeActons = true;
      if(this.currentCharacter instanceof Hero){
        this.currentCharacter.turnsUntilSpecialAvailableAgain = this.turnsBetweenSpecial;
      }
      let heal1 = Math.floor(Math.random() * 6) + 1 + this.currentCharacter.skills.intelligence;
      let heal2 = Math.floor(Math.random() * 6) + 1 + this.currentCharacter.skills.intelligence;
      let target1 = this.selectedTargets[0];
      let target2 = this.selectedTargets[1];

      target1.currentHealth = target1.currentHealth + heal1 > target1.maxHealth ? target1.maxHealth : target1.currentHealth + heal1;
      this.displayMessage = `${target1.name} was healed for ${heal1} health.`;

      setTimeout(()=> {
        target2.currentHealth = target2.currentHealth + heal2 > target2.maxHealth ? target2.maxHealth : target2.currentHealth + heal2;
        this.displayMessage = `${target2.name} was healed for ${heal2} health`;
        this.selectedTargets = [];
        setTimeout(()=> {
          this.nextTurn()
        },this.actionDelay);
      },this.actionDelay);



    }else {
      this.freezeActons = true;
      if(this.currentCharacter instanceof Hero){
        this.currentCharacter.turnsUntilSpecialAvailableAgain = this.turnsBetweenSpecial;
      }
      let healing = Math.floor(Math.random() * 6) + 1 + this.currentCharacter.skills.intelligence;
      target.currentHealth = target.currentHealth + healing > target.maxHealth ? target.maxHealth : target.currentHealth + healing;
      this.displayMessage = `${target.name} was healed for ${healing} health`;
      setTimeout(()=> {
        this.nextTurn();
      },this.actionDelay);
    }
  }

  attack(target : BaseCharacter) {
    // this will unset the target by removing the class for adding borders for the selected hero/enemy
    this.availableTargets = Teams.none;
    if(this.currentCharacter.attack() >= target.barriers.attack){
      let damage = this.currentCharacter.dealDamage();
      target.currentHealth -= damage;
      this.displayMessage = `${this.currentCharacter.name} hit ${target.name} dealing ${damage} damage.`;
      setTimeout(()=> {
        if(target.currentHealth <=0 ) {
          target.isIncapacitated = true;
          // this condition will increase the number of dead/incapacitated in the party of either hero or enemy
          this.heroTurn ? this.enemiesIncapacitated++ : this.heroesIncapacitated++;
          this.checkIfWin();
        }else {
          this.nextTurn();
        }
      }, this.actionDelay);
    }else {
      this.displayMessage = `${this.currentCharacter.name} Missed.`;
      setTimeout(()=>{
        this.nextTurn();
      },this.actionDelay)
    }
  }

  checkIfWin(){
    this.selectedAction = FightOptions.none;
    if(this.enemiesIncapacitated === this.enemyParty.length){
      this.displayMessage = `All enemies have been defeated!`;
      this.successMessages = this.gameController.encounterSuccess();
      this.showNextChapterButton = true;
      this.gameController.isFighting = false;
      return;
    }
    if(this.heroesIncapacitated === this.heroParty.length) {
      this.displayMessage = `All heroes have been defeated. You have lost.`;
      this.showGameOverButton = true;
      this.gameController.isFighting = false;
      return;
    }
    this.nextTurn();
  }

  nextTurn() {
    if(this.currentCharacter instanceof Monster && this.currentCharacter.poisonStacks && !this.currentCharacter.hasTakenPoisonDamageThisTurn) {
      this.currentCharacter.hasTakenPoisonDamageThisTurn = true;
      let maxDamage = this.currentCharacter.isStrongPoisoned ? 6 : 3;
      let poisonDamage = (Math.floor(Math.random() * maxDamage) + 1) * this.currentCharacter.poisonStacks;
      this.currentCharacter.currentHealth -= poisonDamage;
      this.displayMessage = `${this.currentCharacter.name} took ${poisonDamage} poison damage`;
      if(this.currentCharacter.currentHealth <= 0 ) {
        this.currentCharacter.isIncapacitated = true;
        this.enemiesIncapacitated++;
      }
      setTimeout(()=>{
        this.checkIfWin();
      },this.actionDelay);
      return;
    }

    if(this.currentCharacter instanceof Monster && this.currentCharacter.hasTakenPoisonDamageThisTurn) {
      this.currentCharacter.hasTakenPoisonDamageThisTurn = false;
    }

    this.availableTargets = Teams.none;
    this.selectedAction = FightOptions.none;
    this.characterIndex++;
    let nextCharacter;

    if(this.heroTurn){
      nextCharacter = this.heroParty[this.characterIndex];
    }else {
      nextCharacter = this.enemyParty[this.characterIndex];
    }

    if(nextCharacter){
      // this will check if character is dead
        if(!nextCharacter.isIncapacitated){
          this.currentCharacter = nextCharacter;
          this.displayMessage = `It's ${this.currentCharacter.name}'s turn.`;
          // if the next character is a hero ...
          if(this.currentCharacter instanceof Hero){
            this.freezeActons = false;
            // this condition was added to make sure that if its a turn of the hero, the special attack counter will decrease
            if(this.currentCharacter.turnsUntilSpecialAvailableAgain){
              this.currentCharacter.turnsUntilSpecialAvailableAgain--;
            }
          }else {
            setTimeout(()=>{
              this.takeEnemyTurn();
            }, this.actionDelay);
          }
        }else {
          this.nextTurn();
        }
    }else {
      this.heroTurn = !this.heroTurn;
      this.characterIndex = -1;
      this.nextTurn();
    }
  }
  takeEnemyTurn(){
    if(this.currentCharacter instanceof Monster && this.currentCharacter.isTrapped){
      this.currentCharacter.isTrapped = false;
      this.displayMessage = `${this.currentCharacter.name} freed itself from the trap!`;
      setTimeout(()=>{
        this.nextTurn();
      },this.actionDelay);
    }else {
      let target: Hero;
      this.selectedAction = FightOptions.attack;

      // this will run until there are no more targets for the  monster turn
      while(!target){
        let randomTargetIndex = Math.floor(Math.random() * this.heroParty.length)
        let potentialTarget = this.heroParty[randomTargetIndex];
        if(!potentialTarget.isIncapacitated){
          target = potentialTarget;
        }
      }
      this.displayMessage = `${this.currentCharacter.name} attacks ${target.name}.`;

      setTimeout(()=>{
        this.tryAttack(target);
        
      },this.actionDelay);
    }
  }

  nextChapter(){
    this.gameController.nextChapter();
    this.router.navigateByUrl("/story");
  }
  gameOver(){
    this.gameController.gameOver();
    
  }
}
