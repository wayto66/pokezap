import { BaseItem, BasePokemon, HeldItem, Pokemon, RaidPokemon, Skill } from './prisma';
export type enemyName = string;
export type attackPower = number;
export type PokemonBaseDataSkillsHeld = Pokemon & {
    baseData: BasePokemon & {
        skills: Skill[];
    };
    heldItem: (HeldItem & {
        baseItem: BaseItem;
    }) | null | undefined;
};
export type RaidPokemonBaseDataSkillsHeld = RaidPokemon & {
    baseData: BasePokemon & {
        skills: Skill[];
    };
    heldItem?: (HeldItem & {
        baseItem: BaseItem;
    }) | null | undefined;
};
export type RoundPokemonData = {
    [key: string]: any;
    name: string;
    pokemonBaseData: PokemonBaseDataSkillsHeld | RaidPokemonBaseDataSkillsHeld;
    id: number;
    ownerId?: number | null;
    team: string;
    spriteUrl: string;
    type1: string;
    type2: string | undefined | null;
    level: number;
    maxHp: number;
    heldItemName: string | undefined;
    hp: number;
    atk: number;
    spAtk: number;
    def: number;
    spDef: number;
    isGiant: boolean;
    damageResistance: number;
    damageAmplifying: number;
    speed: number;
    skillMap: {
        damageSkills: Map<Skill, Map<enemyName, attackPower>>;
        tankerSkills: Skill[];
        supportSkills: Skill[];
    } | undefined;
    currentSkillPower?: number;
    currentSkillName?: string;
    currentSkillType?: string;
    currentSkillPP?: number;
    crit: boolean;
    block: boolean;
    mana: number;
    roleBonusDamage: number;
    manaBonus: number;
    lifeSteal: number;
    critChance: number;
    blockChance: number;
    crescentBonuses?: {
        block?: number;
        damage?: number;
    };
    statusCleanseChance?: number;
    healingBonus?: number;
    buffBonus?: number;
    role: 'TANKER' | 'DAMAGE' | 'SUPPORT' | string;
    behavior?: any;
    totalDamageDealt: number;
    totalDamageReceived: number;
    totalHealing: number;
    buffData: {
        [key: string]: any;
        atk: 0;
        spAtk: 0;
        def: 0;
        spDef: 0;
    };
};
export type DuelNxNRoundData = {
    leftTeamData: RoundPokemonData[];
    rightTeamData: RoundPokemonData[];
};
export type PokemonBaseData = Pokemon & {
    baseData: BasePokemon;
};
export type RaidPokemonBaseData = RaidPokemon & {
    baseData: BasePokemon;
};
export type PokemonBaseDataSkills = Pokemon & {
    baseData: BasePokemon & {
        skills: Skill[];
    };
};
export type RaidPokemonBaseDataSkills = RaidPokemon & {
    baseData: BasePokemon & {
        skills: Skill[];
    };
};
export type TDuelNXNResponse = {
    winnerTeam: RoundPokemonData[];
    loserTeam: RoundPokemonData[];
    message: string;
    isDraw: boolean;
    imageUrl: string;
    defeatedPokemonsIds?: number[];
    damageDealtMessage: string;
};
