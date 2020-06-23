import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'introduction-component',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss']
})
export class IntroductionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  introductionMessage : string[] = [];

}
