import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

  constructor() { }

  gameTitle : string = "AngularRPG"
  isDelayOver : boolean = false;
  delay : number = 1500;


  ngOnInit(): void {
    setTimeout(()=> {
      this.isDelayOver = true;
    },this.delay)
    
  }

}
