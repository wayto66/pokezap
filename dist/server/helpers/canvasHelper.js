"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeSkills = exports.getTalent = exports.drawTalents = exports.drawPokemon = exports.drawAvatarPlayer = exports.drawBackground = exports.createCanvas2d = exports.SPRITE_AVATAR_HEIGHT = exports.SPRITE_AVATAR_WIDTH = exports.CANVAS_HEIGHT = exports.CANVAS_WIDTH = void 0;
const canvas_1 = require("canvas");
exports.CANVAS_WIDTH = 500;
exports.CANVAS_HEIGHT = 500;
exports.SPRITE_AVATAR_WIDTH = 200;
exports.SPRITE_AVATAR_HEIGHT = 200;
const createCanvas2d = (globalAlpha, isSmoothing = false, width) => __awaiter(void 0, void 0, void 0, function* () {
    const canvas = (0, canvas_1.createCanvas)(width !== null && width !== void 0 ? width : exports.CANVAS_WIDTH, exports.CANVAS_HEIGHT);
    const context = canvas.getContext('2d');
    context.globalAlpha = globalAlpha;
    context.imageSmoothingEnabled = isSmoothing;
    const draw = ({ height, image, positionX, positionY, width }) => __awaiter(void 0, void 0, void 0, function* () {
        context.drawImage(image, positionX, positionY, width, height);
    });
    const fillRect = ({ x, y, w, h, fillStyle }) => __awaiter(void 0, void 0, void 0, function* () {
        if (fillStyle)
            context.fillStyle = fillStyle;
        context.fillRect(x, y, w, h);
    });
    const drawCircle = ({ circleColor, circleRadius, positionX, positionY }) => {
        context.beginPath();
        context.arc(positionX + 21, positionY + 21, circleRadius, 0, Math.PI * 2);
        context.fillStyle = circleColor;
        context.fill();
    };
    const write = ({ fillStyle, strokeStyle, strokeText = false, font, positionX, positionY, text, textAlign, }) => {
        context.font = font;
        context.fillStyle = fillStyle;
        context.textAlign = textAlign;
        if (strokeStyle)
            context.strokeStyle = strokeStyle;
        if (strokeText)
            context.strokeText(text, positionX, positionY);
        context.fillText(text, positionX, positionY);
    };
    const createStream = () => {
        return canvas.createPNGStream({ compressionLevel: 0 });
    };
    const clearArea = () => {
        context.clearRect(0, 0, exports.CANVAS_WIDTH, exports.CANVAS_HEIGHT);
    };
    const drawBar = ({ type, xOffset, value }) => {
        if (type === 'hp') {
            context.fillStyle = 'rgb(160, 40, 40)';
            context.fillRect(xOffset, 108, Math.max(0, value * 125), 7);
        }
        else {
            context.fillStyle = 'rgb(50,121,211)';
            context.fillRect(xOffset - 55, 145, Math.max(0, value * 175), 3);
        }
    };
    const addFrameToEncoder = (encoder) => {
        encoder.addFrame(context);
    };
    const toBuffer = () => canvas.toBuffer();
    const getImageData = () => context.getImageData(0, 0, exports.CANVAS_WIDTH, exports.CANVAS_HEIGHT).data;
    const toDataURL = () => canvas.toDataURL();
    const invertHorizontally = () => {
        context.translate(width !== null && width !== void 0 ? width : 500, 0);
        context.scale(-1, 1);
    };
    const createJPEGStream = canvas.createJPEGStream;
    const createPDFStream = canvas.createPDFStream;
    const createPNGStream = canvas.createPNGStream;
    const getContext = canvas.getContext;
    return {
        invertHorizontally,
        fillRect,
        draw,
        drawBar,
        drawCircle,
        write,
        createStream,
        clearArea,
        addFrameToEncoder,
        toBuffer,
        getImageData,
        toDataURL,
        width: exports.CANVAS_WIDTH,
        height: exports.CANVAS_HEIGHT,
        type: 'image',
        stride: 0,
        PNG_FILTER_AVG: 0,
        PNG_ALL_FILTERS: 0,
        PNG_FILTER_NONE: 0,
        PNG_FILTER_PAETH: 0,
        PNG_FILTER_SUB: 0,
        PNG_FILTER_UP: 0,
        PNG_NO_FILTERS: 0,
        createJPEGStream,
        createPDFStream,
        createPNGStream,
        getContext,
        canvas,
    };
});
exports.createCanvas2d = createCanvas2d;
const drawBackground = (canvas2d, backgroundImage) => {
    const backgroundPositionX = 0;
    const backgroundPositionY = 0;
    canvas2d.draw({
        image: backgroundImage,
        positionX: backgroundPositionX,
        positionY: backgroundPositionY,
        width: exports.CANVAS_WIDTH,
        height: exports.CANVAS_HEIGHT,
    });
};
exports.drawBackground = drawBackground;
const drawAvatarPlayer = ({ canvas2d, avatarPositionX, avatarPositionY, spriteUrl, name, namePositionX, namePositionY, elo, eloPositionX, eloPositionY, textAlign, }) => __awaiter(void 0, void 0, void 0, function* () {
    const player1ImageUrl = `./src/assets/sprites/avatars/${spriteUrl}`;
    const player1AvatarImage = yield (0, canvas_1.loadImage)(player1ImageUrl);
    canvas2d.draw({
        image: player1AvatarImage,
        positionX: avatarPositionX,
        positionY: avatarPositionY,
        width: exports.SPRITE_AVATAR_WIDTH,
        height: exports.SPRITE_AVATAR_HEIGHT,
    });
    canvas2d.write({
        font: '21px Righteous',
        fillStyle: 'white',
        textAlign,
        text: `${name.toUpperCase()}`,
        positionX: namePositionX,
        positionY: namePositionY,
    });
    canvas2d.write({
        font: '14px Righteous',
        fillStyle: 'white',
        textAlign,
        text: `RANK: ${elo}`,
        positionX: eloPositionX,
        positionY: eloPositionY,
    });
});
exports.drawAvatarPlayer = drawAvatarPlayer;
const drawPokemon = ({ canvas2d, positionX, positionY, imageUrl, id, idPositionX, idPositionY, textAlign, isGiant, }) => __awaiter(void 0, void 0, void 0, function* () {
    const pokemonPlayer1Image = yield (0, canvas_1.loadImage)(imageUrl);
    canvas2d.draw({
        image: pokemonPlayer1Image,
        positionX,
        positionY,
        width: exports.SPRITE_AVATAR_WIDTH * (isGiant ? 1.5 : 1),
        height: exports.SPRITE_AVATAR_HEIGHT * (isGiant ? 1.5 : 1),
    });
    canvas2d.write({
        font: '16px Righteous',
        fillStyle: 'white',
        textAlign,
        text: `#${id}`,
        positionX: idPositionX,
        positionY: idPositionY,
    });
});
exports.drawPokemon = drawPokemon;
const drawTalents = (canvas2d, talentImageMap, talents, xOffset) => {
    if (!talents)
        return;
    const NUM_TALENTS = 9;
    for (let i = 0; i < NUM_TALENTS; i++) {
        const talent = talents[i];
        if (!talent)
            return;
        const image = talentImageMap.get(talent);
        if (!image)
            return;
        const positionX = xOffset + i * 22;
        const positionY = 400;
        canvas2d.drawCircle({
            circleRadius: 10,
            circleColor: 'rgba(0,0,0,0.5)',
            positionX,
            positionY,
        });
        canvas2d.draw({
            image,
            positionX,
            positionY,
            width: 21,
            height: 21,
        });
    }
};
exports.drawTalents = drawTalents;
const getTalent = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const talentImageUrl = `./src/assets/sprites/UI/types/circle/${name}.png`;
    return yield (0, canvas_1.loadImage)(talentImageUrl);
});
exports.getTalent = getTalent;
const writeSkills = ({ canvas2d, value, positionX, positionY }) => {
    canvas2d.write({
        font: '18px Righteous',
        fillStyle: 'white',
        textAlign: 'start',
        text: value,
        positionX,
        positionY,
    });
};
exports.writeSkills = writeSkills;
//# sourceMappingURL=canvasHelper.js.map