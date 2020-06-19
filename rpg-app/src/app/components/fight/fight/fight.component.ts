import { Component, OnInit } from '@angular/core';
import { GameControllerService } from 'src/app/services/game-controller.service';
import { Route } from '@angular/compiler/src/core';

@Component({
  selector: 'fight-component',
  templateUrl: './fight.component.html',
  styleUrls: ['./fight.component.scss']
})
export class FightComponent implements OnInit {

  constructor(
    private gameController : GameControllerService , 
    private route : Route
  ) { }

  ngOnInit(): void {
  }




}
