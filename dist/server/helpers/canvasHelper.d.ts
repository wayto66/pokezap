/// <reference types="node" />
import { Canvas, Image, PNGStream } from 'canvas';
import GIFEncoder from 'gifencoder';
export declare const CANVAS_WIDTH = 500;
export declare const CANVAS_HEIGHT = 500;
export declare const SPRITE_AVATAR_WIDTH = 200;
export declare const SPRITE_AVATAR_HEIGHT = 200;
type TDrawBar = {
    type: 'hp' | 'mana';
    xOffset: number;
    value: number;
};
type TDraw = {
    image: Image | Canvas;
    positionX: number;
    positionY: number;
    width: number;
    height: number;
};
type TDrawCircle = {
    circleRadius: number;
    circleColor: string;
    positionX: number;
    positionY: number;
};
type TFillRect = {
    fillStyle?: string;
    x: number;
    y: number;
    w: number;
    h: number;
};
type TWrite = {
    font: string;
    fillStyle: string;
    textAlign: CanvasTextAlign;
    text: string;
    positionX: number;
    positionY: number;
    strokeStyle?: string;
    strokeText?: boolean;
};
export type TCanvas2D = {
    canvas: Canvas;
    draw: (data: TDraw) => Promise<void>;
    fillRect: (data: TFillRect) => void;
    drawCircle: (data: TDrawCircle) => void;
    drawBar: (data: TDrawBar) => void;
    write: (data: TWrite) => void;
    createStream: () => PNGStream;
    clearArea: () => void;
    addFrameToEncoder: (encoder: GIFEncoder) => void;
    toBuffer: () => Buffer;
    getImageData: () => Uint8ClampedArray;
    toDataURL: () => string;
    invertHorizontally: () => void;
};
type TDrawPlayerData = {
    canvas2d: TCanvas2D;
    avatarPositionX: number;
    avatarPositionY: number;
    spriteUrl: string;
    name: string;
    namePositionX: number;
    namePositionY: number;
    elo: string;
    eloPositionX: number;
    eloPositionY: number;
    textAlign: CanvasTextAlign;
};
type TDrawPokemonData = {
    canvas2d: TCanvas2D;
    positionX: number;
    positionY: number;
    imageUrl: string;
    id: string;
    idPositionX: number;
    idPositionY: number;
    textAlign: CanvasTextAlign;
    isGiant: boolean;
};
type TWriteSkills = {
    canvas2d: TCanvas2D;
    value: string;
    positionX: number;
    positionY: number;
};
export declare const createCanvas2d: (globalAlpha: number, isSmoothing?: boolean, width?: number) => Promise<Canvas & TCanvas2D>;
export declare const drawBackground: (canvas2d: TCanvas2D, backgroundImage: Image | Canvas) => void;
export declare const drawAvatarPlayer: ({ canvas2d, avatarPositionX, avatarPositionY, spriteUrl, name, namePositionX, namePositionY, elo, eloPositionX, eloPositionY, textAlign, }: TDrawPlayerData) => Promise<void>;
export declare const drawPokemon: ({ canvas2d, positionX, positionY, imageUrl, id, idPositionX, idPositionY, textAlign, isGiant, }: TDrawPokemonData) => Promise<void>;
export declare const drawTalents: (canvas2d: TCanvas2D, talentImageMap: Map<string, Image>, talents: (string | undefined)[], xOffset: number) => void;
export declare const getTalent: (name: string) => Promise<Image>;
export declare const writeSkills: ({ canvas2d, value, positionX, positionY }: TWriteSkills) => void;
export {};
