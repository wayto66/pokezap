import { Image } from 'canvas';
import { DuelNxNRoundData, RoundPokemonData } from '../duel/duelNXN';
export type TDuelRoundData = {
    leftTeam: RoundPokemonData[];
    rightTeam: RoundPokemonData[];
    roundCount: number;
    duelMap: Map<number, DuelNxNRoundData>;
    winnerSide: 'right' | 'left';
    backgroundTypeName?: string;
    staticImage?: boolean;
};
export type TFlagSpriteObject = {
    skillFlag: Image;
    ultimateFlag: Image;
};
export declare const iGenDuel2X1Rounds: (data: TDuelRoundData) => Promise<string>;
