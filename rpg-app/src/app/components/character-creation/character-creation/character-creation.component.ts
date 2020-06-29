import { Component, OnInit } from '@angular/core';
import {CharacterOptions} from '../../../models/character-options';
import { GameControllerService } from "../../../services/game-controller.service";
import { checkRace, Hero } from 'src/app/models/character';
declare let gsap :any;

@Component({
  selector: 'app-character-creation',
  templateUrl: './character-creation.component.html',
  styleUrls: ['./character-creation.component.scss']
})
export class CharacterCreationComponent implements OnInit {

  constructor(private gameControllerService: GameControllerService ) { }

  character = {
    race : undefined,
    class : undefined,
    gender : undefined,
    name : undefined
  }

  stats = {
    Human : {
      attack : 2,
      sneak : 0,
      persuade : 3,
      intelligence : 1,
    },
    Elf : {
      attack : 0,
      sneak : 3,
      persuade : 1,
      intelligence : 2,
    },
    Dwarf : {
      attack : 3,
      sneak : 2,
      persuade : 0,
      intelligence : 1,
    },
    Beast : {
      attack : 3,
      sneak : 3,
      persuade : 0,
      intelligence : 0,
    }
  }

  options = {
    Human : {
      isSelected : false,
      isFlipped : false
    },
    Elf : {
      isSelected : false,
      isFlipped : false
    },
    Dwarf : {
      isSelected : false,
      isFlipped : false
    },
    Beast : {
      isSelected : false,
      isFlipped : false
    },
    Warrior : {
      isSelected : false,
      isFlipped : false
    },
    Mage : {
      isSelected : false,
      isFlipped : false
    },
    Ranger : {
      isSelected : false,
      isFlipped : false
    },
    Cleric : {
      isSelected : false,
      isFlipped : false
    }
  }


  abilities = {
    Warrior : "Can attack two targets at once with a small attack penalty. At level 6 and above, the attack penalty is removed. The two targets may be the same enemy.",
    Mage : "Poison an enemy or add another stack of poison to an enemy to do up to 3 damage, with each stack of poison multiplying the damage. At level 6 and above, the damage is 1 - 6 times the number of poison stacks.",
    Ranger : "Setup a trap to protect one of your heroes. The trap will prevent all damage and the enemy will take a turn to free itself from the trap. At level 6 and above, the trap will also deal up to 8 damage.",
    Cleric : "Select a hero to heal for up to 3 health for each point in the intelligence skill. At level 6 and above, you can choose two targets to heal. The 2 targets can be the same hero."
  }


  characterComplete: boolean = false;

  races = CharacterOptions.races;
  classes = CharacterOptions.classes;
  genders = CharacterOptions.genders;

  isModalOpen : boolean = false;
  delayForModal : number = 2000;
  delay : number = 500;
  // prevRace:string = "";
  isRaceActive : boolean = true;
  isClassActive : boolean = false;
  isNameActive : boolean = false;
  selectedClass = document.getElementsByClassName('item-wrapper');

  ngOnInit(): void {
    setTimeout(()=> {
      this.isModalOpen = true;
    },this.delayForModal)
  }


  changeRace (race: string, isSelected : boolean) {
    this.character.race = race;

    if(document.getElementsByClassName('selected-tab').length !== 0){
        for(let i= 0; i< this.selectedClass.length; i++){
          this.selectedClass[i].classList.remove("selected-tab");
        }
    }

    
    if (this.options[race].isSelected  === isSelected) {
      this.options[race].isSelected  = false;
    }
    else {
      this.options[race].isSelected  = isSelected;
    }

    
    

   
  };

  changeClass (newClass: string, isSelected : boolean) {
    this.character.class = newClass;

    if(document.getElementsByClassName('selected-tab').length !== 0){
      for(let i= 0; i< this.selectedClass.length; i++){
        this.selectedClass[i].classList.remove("selected-tab");
      }
    }

    if (this.options[newClass].isSelected  === isSelected) {
      this.options[newClass].isSelected  = false;
    }
    else {
      this.options[newClass].isSelected  = isSelected;
    }
    
  };

  changeGender (gender: string) {

    this.character.gender = gender;
    
  };

  changeName (name : string){
    
    
    this.character.name = name;
    
    if(!this.character.name){
      this.character.name = undefined;
    }
    this.characterComplete = true;
  };

  createCharacter(){
    if(!this.characterComplete){
      return;
    }

    this.gameControllerService.setMainCharacter(this.character)
    
  }

  

  makeFlipAnimation(race: string, flipped: boolean){

    if(flipped){
      this.options[race].isFlipped = true;
     
    }else {
      setTimeout(()=> {
        this.options[race].isFlipped = false;
        
      },100)

    }
   
  }

  nextStep(next : string , back : string) {
    console.log(this.character);
    if(next !== undefined) {
      switch (next) {
        case "class":
            this.isClassActive = true;
            this.isRaceActive = false;
            this.isNameActive = false
            break;
        case "name":
          this.isClassActive = false;
          this.isRaceActive = false;
          this.isNameActive = true;
          break;
        case "close":
          this.isClassActive = false;
          this.isRaceActive = false;
          this.isNameActive = false; 
          break;
        default:
          this.isClassActive = true;
          this.isRaceActive = false;
          this.isNameActive = false;
            break;
      }
    }

    if(back !== undefined) {
      console.log("kjhkjh");
      switch (back) {
        case "race":
            this.isClassActive = false;
            this.isRaceActive = true;
            this.isNameActive = false
            break;
        case "name":
          this.isClassActive = false;
          this.isRaceActive = false;
          this.isNameActive = true;
            break;
  
        default:
          this.isClassActive = true;
          this.isRaceActive = false;
          this.isNameActive = false;
            break;
      }
    }

  }

  makeReadMoreAnimate(options: string, isOnHover : boolean) {
    let optionsItem = options.toLocaleLowerCase() + "-item";
        if(isOnHover){
          gsap.to("."+optionsItem +" .btn--read-more i", {
            x: 5, 
            stagger: { 
              each: .2,
              from: 0,
              ease: "elastic.out"
            }
          });
        }else {
          gsap.to("."+optionsItem +" .btn--read-more i", {
            x: 0, 
            stagger: { 
              each: .2,
              from: 0,
              ease: "power2.in"
            }
          });
        }

      
  }


}
