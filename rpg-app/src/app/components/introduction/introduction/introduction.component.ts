import { Component, OnInit } from '@angular/core';
// import { gsap } from "gsap";

declare let gsap :any;

@Component({
  selector: 'introduction-component',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss']
})
export class IntroductionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.introductionMessageAnimation(); 
  }

  delay : number = 1500;
  

  introductionMessageAnimation():void {
    setTimeout(()=> {
      gsap.to(".animated-child", {
        y: 0, opacity: 1,
        stagger: { 
          each: .3,
          from: 0,
          ease: "ease.inOut"
        }
      });
    },this.delay)

  }
  


  introductionMessage : string[] = [];


}
