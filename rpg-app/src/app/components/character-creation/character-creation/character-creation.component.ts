import { Component, OnInit } from '@angular/core';

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

  ngOnInit(): void {
  }

  changeRace = () => {

  }

  changeClass = () => {
    
  }

  changeName = () => {
    
  }

  changeGender = () => {
    
  }

  createCharacter = () => {
    
  }




}
