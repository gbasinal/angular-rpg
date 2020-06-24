export enum RaceOptions {
    human = "Human",
    elf = "Elf",
    dwarf = "Dwarf",
    beast = "Beast"
}

export enum ClassOptions {
    warrior = "Warrior",
    mage = "Mage",
    ranger = "Ranger",
    cleric = "Cleric"
}

export enum GenderOptions {
    male = "Male",
    female = "Female",
}




export const CharacterOptions = {
    races : [
        RaceOptions.human,
        RaceOptions.elf,
        RaceOptions.dwarf,
        RaceOptions.beast,
    ],
    classes: [
        ClassOptions.warrior,
        ClassOptions.mage,
        ClassOptions.ranger,
        ClassOptions.cleric,
    ],
    genders : [
        GenderOptions.male,
        GenderOptions.female
    ]
}