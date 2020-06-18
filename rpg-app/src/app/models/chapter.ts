import {Hero , Monster , Weapon, Armor} from "./character";

// This will define the options the characters have to move on the story
export enum CharacterActions {
    attack = "Attack",
    sneak = "Sneak",
    persuade = "Persuade",
    doNothing = "Do Nothing"
}

export enum FailureOptions {
    gameOver, 
    nextChapter,
    savePoint
}

export enum SuccessOptions {
    rewardExperience,
    rewardEquipment,
    addHeroToParty
}


export class Chapter {
    // we set it to array so that we can display 1 line per paragraph insted of a bulk of text
    story : string[];
    options: CharacterActions[];
    enemyPart: Monster[];
    sneakPersuadeFail: CharacterActions;
    ifFail: FailureOptions;
    ifSucceed: SuccessOptions[];
    reward: {
        experience : number;
        equipment : (Weapon | Armor) [];
        newHero: Hero;
    }
    nextChapter: Chapter;

}