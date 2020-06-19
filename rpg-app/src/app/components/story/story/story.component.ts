import { Component, OnInit } from '@angular/core';
import { GameControllerService } from 'src/app/services/game-controller.service';
import { Router } from '@angular/router';
import { Hero, Monster } from 'src/app/models/character';
import { CharacterActions } from 'src/app/models/chapter';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'story-component',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss']
})
export class StoryComponent implements OnInit {

  constructor(
    private gameControllerService: GameControllerService, 
    private router: Router
    ) { }

  ngOnInit(): void {
  }

  currentChapter = this.gameControllerService.currentChapter;
  heroParty: Hero[] = this.gameControllerService.heroParty;
  enemyParty: Monster[] = this.currentChapter.enemyParty;

  actionDelay: number = this.gameControllerService.actionDelay;
  displayMessage : string = "";
  successMessages: string[] = [];
  showNextChapterButton: boolean = false;


  chooseAction(action: string): void {
    if(this.successMessages.length){
      return;
    }

    this.displayMessage = `You decide to ${action}.`;
    setTimeout(()=>{
        switch(action) {
            case CharacterActions.attack:
                this.tryAttack();
                break;
            case CharacterActions.sneak:
                this.trySneak();
                break;
            case CharacterActions.persuade:
                this.tryPersuade();
                break;
            case CharacterActions.doNothing:
                this.doNothing();
                break;
            default :
              console.log("Error found")
        }
    }, this.actionDelay);
  };

  tryAttack(): void {

    this.gameControllerService.isFighting = true;
    this.router.navigateByUrl("/fight");
  
  };

  trySneak(): void {

    let sneakBarrier = 0;
    let sneakPower = 0;

    this.enemyParty.forEach(enemy => {
      sneakBarrier += enemy.barriers.sneak;
    });
    this.heroParty.forEach(hero => {
      sneakPower += hero.sneak();
    })

    if(sneakPower >= sneakBarrier) {
      this.displayMessage = `Your attempt at sneaking is a success!`;
      setTimeout(()=>{
        this.onSuccess();
      }, this.actionDelay);
    }else {
      this.displayMessage = `Your attempt at sneaking failed!`;
      setTimeout(()=>{
        this.onSneakPersuadeFailure();
      }, this.actionDelay);
    };

 
  };

  tryPersuade(): void {

    let persuadeBarrier = 0;
    let persuadePower = 0;

    this.enemyParty.forEach( enemy => {
      persuadeBarrier += enemy.barriers.persuade;
    });

    this.heroParty.forEach( hero => {
      persuadePower += hero.persuade();
    })

    if(persuadePower >= persuadeBarrier) {
      this.displayMessage = `Your attempt at persuading is a success!`;
      setTimeout(() => {
        this.onSuccess();
      },this.actionDelay);
    }else {
      this.displayMessage = `Your attempt at persuading failed`;
      setTimeout(() => {
        this.onSneakPersuadeFailure();
      },this.actionDelay);
    }
  
  };

  doNothing(): void {
    this.displayMessage = `You decided to do nothing and move on`;
    setTimeout(()=> {
      this.nextChapter();
    }, this.actionDelay);
  };

  onSuccess(): void {
    this.successMessages = this.gameControllerService.encounterSuccess();
    this.showNextChapterButton = true;
  };

  onSneakPersuadeFailure(): void {
    switch(this.currentChapter.sneakPersuadeFail){
        case CharacterActions.attack:
        default:
            this.displayMessage = `The enemy attacks you!`;
            setTimeout(()=>{
              this.tryAttack();
            }, this.actionDelay);
            break;
        case CharacterActions.doNothing:
            this.displayMessage = `Your failure spoiled the opportunity and your party has moved on.`;
            setTimeout(()=>{
              this.nextChapter();
            },this.actionDelay);
            break;
    }
  };


  nextChapter(): void {
    this.gameControllerService.nextChapter();
    this.currentChapter = this.gameControllerService.currentChapter;
    this.heroParty = this.gameControllerService.heroParty;
    this.enemyParty = this.gameControllerService.enemyParty;
    this.displayMessage = "";
    this.successMessages = [];
    this.showNextChapterButton = false;
  }

}
