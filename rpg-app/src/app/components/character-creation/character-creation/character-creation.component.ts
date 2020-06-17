import { Component, OnInit } from '@angular/core';
import {CharacterOptions} from '../../../models/character-options';

@Component({
  selector: 'app-character-creation',
  templateUrl: './character-creation.component.html',
  styleUrls: ['./character-creation.component.scss']
})
export class CharacterCreationComponent implements OnInit {

  constructor() { }

  character = {
    race : "--Choose--",
    class : "--Choose--",
    gender : undefined,
    name : undefined
  }

  characterComplete: boolean = false;

  races = CharacterOptions.races;
  classes = CharacterOptions.classes;
  genders = CharacterOptions.genders;


  ngOnInit(): void {
  }

  checkCompleted() {
    this.characterComplete = this.character.race !== "--Choose--"
      && this.character.class ! == "--Choose--"
      && this.character.gender
      && this.character.name

    console.log(this.characterComplete)
  };

  changeRace (race: string) {
    this.character.race = race;
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

    console.log(this.character);
  }


}
