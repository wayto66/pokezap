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
exports.loadOrSaveImageFromCache = void 0;
const canvas_1 = require("canvas");
const memory_cache_1 = __importDefault(require("memory-cache"));
const loadOrSaveImageFromCache = (imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const imageInCache = memory_cache_1.default.get(imageUrl); // Recuperação da imagem do cache, se disponível
    if (imageInCache)
        return imageInCache;
    const newImage = yield (0, canvas_1.loadImage)(imageUrl);
    memory_cache_1.default.put(imageUrl, newImage); // Armazenamento da imagem no cache
    return newImage;
});
exports.loadOrSaveImageFromCache = loadOrSaveImageFromCache;
//# sourceMappingURL=loadOrSaveImageFromCache.js.map