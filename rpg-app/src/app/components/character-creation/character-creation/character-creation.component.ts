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
      isSelected : false
    },
    Elf : {
      attack : 0,
      sneak : 3,
      persuade : 1,
      intelligence : 2,
      isSelected : false
    },
    Dwarf : {
      attack : 3,
      sneak : 2,
      persuade : 0,
      intelligence : 1,
      isSelected : false
    },
    Beast : {
      attack : 3,
      sneak : 3,
      persuade : 0,
      intelligence : 0,
      isSelected : false
    }
  }

  itemFlipped = {
    Human :{
      isFlipped : false
    },
    Elf :{
      isFlipped : false
    },
    Dwarf :{
      isFlipped : false
    },
    Beast :{
      isFlipped : false
    }
  }



  characterComplete: boolean = false;

  races = CharacterOptions.races;
  classes = CharacterOptions.classes;
  genders = CharacterOptions.genders;

  isModalOpen : boolean = false;
  delayForModal : number = 2000;
  isItemFlipped : boolean = false;
  delay : number = 500;
  prevRace:string = "";


  ngOnInit(): void {
    setTimeout(()=> {
      this.isModalOpen = true;
    },this.delayForModal)
  }

  checkCompleted() {
    this.characterComplete = this.character.race !== "--Choose--"
      && this.character.class ! == "--Choose--"
      && this.character.gender
      && this.character.name

  };

  changeRace (race: string) {
    this.character.race = race;

    
    this.prevRace = race;
    this.stats[race].isSelected = true;
    
    // this.stats[this.prevRace].isSelected = false;

    // this.makeFlipAnimation(race , true);

    

    this.checkCompleted();
  };

  changeClass (newClass: string) {
    this.character.class = newClass;
    this.checkCompleted();
  };

  changeGender (gender: string) {

    this.character.gender = gender;
    this.checkCompleted();
  };

  changeName (){
    this.checkCompleted();
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
      this.itemFlipped[race].isFlipped = true;
     
    }else {
      setTimeout(()=> {
        this.itemFlipped[race].isFlipped = false;
        
      },100)

    }
   
  }


}
