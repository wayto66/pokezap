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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.iGenAvatarChoose = void 0;
const canvas_1 = require("canvas");
const memory_cache_1 = __importDefault(require("memory-cache"));
const canvasHelper_1 = require("../../helpers/canvasHelper"); // Importação de funções auxiliares relacionadas ao canvas
const fileHelper_1 = require("../../helpers/fileHelper"); // Importação de funções auxiliares relacionadas a arquivos
let canvas2d; // Declaração da variável 'canvas2d'
const iGenAvatarChoose = (data) => __awaiter(void 0, void 0, void 0, function* () {
    canvas2d = yield (0, canvasHelper_1.createCanvas2d)(1); // Criação de um novo canvas
    const backgroundImage = yield loadBackgroundImage(); // Carregamento da imagem de plano de fundo
    (0, canvasHelper_1.drawBackground)(canvas2d, backgroundImage); // Desenho do plano de fundo no canvas
    const imageCount = 4; // Número de imagens de avatar
    const { images, positions } = yield loadAvatarImages(`./src/assets/sprites/avatars/${data.genre}/`, imageCount); // Carregamento das imagens de avatar e suas posições
    yield drawAvatarImages(canvas2d, images, positions, imageCount); // Desenho das imagens de avatar no canvas
    const filepath = yield (0, fileHelper_1.saveFileOnDisk)(canvas2d); // Salvamento do canvas como um arquivo no disco
    (0, fileHelper_1.removeFileFromDisk)(filepath); // Remoção do arquivo do disco
    return filepath; // Retorno do caminho do arquivo
});
exports.iGenAvatarChoose = iGenAvatarChoose;
const loadBackgroundImage = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, canvas_1.loadImage)('./src/assets/sprites/UI/hud/player_choose_avatar.png'); // Carregamento da imagem de plano de fundo
});
const loadAvatarImages = (avatarUrlBase, imageCount) => __awaiter(void 0, void 0, void 0, function* () {
    const images = []; // Array para armazenar as imagens de avatar
    const positions = []; // Matriz para armazenar as posições das imagens de avatar
    for (let i = 0; i < imageCount; i++) {
        const row = []; // Array para armazenar as posições de uma linha
        for (let j = 0; j < imageCount; j++) {
            const positionX = 35 + j * 112; // Cálculo da posição X da imagem
            const positionY = 37 + i * 107; // Cálculo da posição Y da imagem
            const imageUrl = `${avatarUrlBase}${imageCount * i + j + 1}.png`; // URL da imagem de avatar
            let image = memory_cache_1.default.get(imageUrl); // Recuperação da imagem do cache, se disponível
            if (!image) {
                const imageData = yield (0, canvas_1.loadImage)(imageUrl); // Carregamento da imagem de avatar
                image = new canvas_1.Image(); // Criação de uma nova instância de Image
                image.src = imageData.src; // Atribuição do src da imagem
                memory_cache_1.default.put(imageUrl, imageData); // Armazenamento da imagem no cache
            }
            images.push(image); // Adição da imagem ao array de imagens
            row.push({ positionX, positionY }); // Adição da posição ao array de posições da linha
        }
        positions.push(row); // Adição da linha de posições à matriz de posições
    }
    return { images, positions }; // Retorno das imagens e posições
});
const drawAvatarImages = (canvas2d, images, positions, imageCount) => {
    const imagePromises = []; // Array de promessas para o desenho das imagens
    const imageSize = 100; // Tamanho da imagem
    for (let i = 0; i < images.length; i++) {
        const image = images[i]; // Imagem atual
        const position = positions[Math.floor(i / imageCount)][i % imageCount]; // Posição atual da imagem
        imagePromises.push(canvas2d.draw({
            image,
            positionX: position.positionX,
            positionY: position.positionY,
            width: imageSize,
            height: imageSize,
        }) // Adição da promessa de desenho da imagem ao array
        );
    }
    return Promise.all(imagePromises); // Retorno de uma promessa que aguarda todas as imagens serem desenhadas
};
//# sourceMappingURL=iGenAvatarChoose.js.map