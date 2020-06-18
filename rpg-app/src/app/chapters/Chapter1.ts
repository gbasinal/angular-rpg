import {Chapter, CharacterActions, FailureOptions, SuccessOptions} from "../models/chapter";
import {Weapon, Armor, Warrior, Monster} from "../models/character";
import {GenderOptions, RaceOptions, ClassOptions} from "../models/character-options";


// making this of type "Chapter" ensures that we will be getting all the things we need from the class Chapter
export const Chapter1: Chapter = {
    // This will provide the narrative of the story, you can add any story to your liking
    story : [
        "This is a placeholder text. You have encountered an enemy.",
        "What will you do?"
    ],
    // This will provide the options you will be presenting to the user. 
    options : [
        CharacterActions.attack,
        CharacterActions.sneak,
        CharacterActions.persuade
    ],
    // This will be the base stats of the monster or enemy that the hero will encounter
    enemyParty : [
        new Monster("Slime", 5, {attack : 2 , sneak : 1 , persuade: 0}, {attack: 10, sneak: 10, persuade: 10}, 1 , 3, "../../assets/monster/slime.png")
    ],
    // If sneaking or persuading fails, character will only have an option to attack
    sneakPersuadeFail : CharacterActions.attack,
    // If ecounter is a failure, game will end and will start over
    ifFail : FailureOptions.gameOver,
    // If encounter succeeds, system will reward the user an exp points, equipment and another hero for your party
    ifSucceed : [
        SuccessOptions.rewardExperience,
        SuccessOptions.rewardEquipment,
        SuccessOptions.addHeroToParty
    ],
    // Rewards will consist of exp of 500pts, an equipment called rusty sword with a damage between 1 and 6 , a new party member named Ryan, a male elf with a a level of 1 and hp of 8, with stats of 2 for atk, 1 for sneaking, 0 for persuading and intelligence of 1. he has a weapon called old bottle with a damage between 1 and 3 and an armor called clothes who has 0 defense points
    rewards : {
        experience : 500,
        equipment: [new Weapon("Rusty Sword", 1, 6)],
        newHero: new Warrior("Ryan", GenderOptions.male, RaceOptions.elf, 1 , 8 , {attack: 2, sneak: 1, persuade: 0, intelligence: 1}, new Weapon("Old Bottle", 1 , 3), new Armor("Clothes", 0))
    },
    nextChapter : null
}