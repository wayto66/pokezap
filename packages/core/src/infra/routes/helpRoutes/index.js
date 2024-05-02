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
exports.helpRoutes = void 0;
const AppErrors_1 = require("../../errors/AppErrors");
const pokemonSkills_1 = require("../pokemonRoutes/skills/pokemonSkills");
const helpSkill_1 = require("./helpSkill");
const items_1 = require("./items");
const clanText = `
📖 PokeZap Wiki - *CLANS*
Monte seu time com 6 pokémons de um clã para receber bonus!

*NOME*                   *TIPAGENS*                   *BÔNUS*
VOLCANIC              Fire/Ground                 Crítico
TOXIBUG                Poison/Bug                   Roubo de vida
GARDESTRIKE        Normal/Fighting           Dano crescente a cada round
MASTERMIND        Dark/Psychic/Ghost      Regeneração de mana e precisão
SEAVELL                 Ice/Water                       HP e limpeza de efeito de status
WINGEON              Dragon/Flying               Speed e evasão crescente a cada round
WONDERLEAF        Grass/Fairy                    HP, cura e efeito de status
THUNDERFORGE    Steel/Rock/Electric        Def e spDef
`;
const pokeballsText = `
📖 PokeZap Wiki - *POKEBALLS*
Alem das pokeballs normais, existem pokeballs elementais.
Elas possuem uma chance muito maior de catch quando usadas contra certos elementos:

*NOME*                 *TIPAGEM - PROBABILIDADE DE CAPTURA AUMENTADA*
MAGU-BALL         Fire/Ground
TALE-BALL            Dragon/Fairy
TINKER-BALL        Electric/Steel
MOON-BALL        Ghost/Dark
YUME-BALL          Normal/Psychic
DUSK-BALL           Lutador/Rock
JANGURU-BALL    Grass/Poison
NET-BALL              Water/Bug
SORA-BALL           Flying/Ice

BEAST-BALL          Todos com bônus de captura altíssimo
`;
const platesText = `
📖 PokeZap Wiki - *PLATES*
Plate é um tipo de item que seu pokemon pode segurar.

BÔNUS: *7% ATK* AO *ELEMENTO*

*NOME*                 *TIPAGEM*
Draco Plate          Dragon
Dread Plate          Dark
Earth Plate           Ground
Fist Plate              Fighting
Flame Plate          Fire
Icicle Plate            Ice
Insect Plate          Bug
Iron Plate             Steel
Meadow Plate      Grass
Mind Plate           Psychic
Pixie Plate            Fairy
Sky Plate              Flying
Splash Plate         Water
Spooky Plate       Ghost
Stone Plate          Rock
Toxic Plate            Poison
Zap Plate              Electric
Normal Plate        Normal
`;
const gemText = `
📖 PokeZap Wiki - *GEMS*
Gema é um tipo de item que seu pokémon pode segurar.

BÔNUS: *15% ATK* AO *ELEMENTO*

*NOME*                 *TIPAGEM*
Dragon Gem          Dragon
Fire Gem          Fire
Water Gem         Water
Grass Gem      Grass
Electric Gem              Electric
Ice Gem            Ice
Fighting Gem              Fighting
Poison Gem            Poison
Ground Gem           Ground
Flying Gem              Flying
Psychic Gem           Psychic
Rock Gem          Rock
Bug Gem          Bug
Ghost Gem       Ghost
Steel Gem             Steel
Dark Gem          Dark
Fairy Gem            Fairy
Normal Gem      Normal
`;
const heldXText = `
📖 PokeZap Wiki - HELD X
HELD X é um tipo de item que seu pokémon pode segurar.

X-ATTACK   - 11% DE ATK À TODOS OS ELEMENTOS
X-DEFENSE - 11% DE DEFESA
`;
const commandsText = `
📖 PokeZap Wiki - *COMMANDS* - [d]
Para utilizar um comando no jogo é obrigatório informar o prefixo pz.
(Exemplo: pz. inventory).
Tente abreviar os comandos também! (pz. inventory item, pode ser pz. i i)

*INÍCIO*
➡️ *start -*  _Criar personagem_

*PERSONAGEM*
➡️ *player -* _Informações sobre seu personagem_
➡️ *cash -* _Exibe rapidamente seu dinheiro_
➡️ *energy -* _Exibe rapidamente sua energia_

*INVENTÁRIO*
➡️ *inventory -* _Início do inventário_
➡️ *inventory item -* _Exibe seus items_
➡️ *inventory pokemon -* _Exibe todos os seus pokemons_
➡️ *inventory pokemon type fire -* _Exibe todos os seus pokemons do tipo fire_
➡️ *inventory pokemon name pidgey -* _Exibe todos os seus pidgey
➡️ *inventory pokemon talent ice -* _Exibe todos os seus pokemons com talento de gelo

*USAR ITEM*
➡️ *useitem _(nome do item)_ -* _User item com o nome fornecido_

*POKÉMONS*
➡️ *poke info _(nome ou id do pokemon)_ -* _Informações do pokémon_
➡️ *poke sell _(nome ou id do pokemon)_ -* _Vender pokémon_
➡️ *poke evolve _(nome ou id do pokemon)_ -* _Evoluir pokémon_
➡️ *poke mega-evolve _(nome ou id do pokemon)_ -* _Mega evoluir pokémon_
➡️ *poke skills _(nome ou id do pokemon)_ -* _Informações de habilidades do pokémon_
➡️ *poke giveitem _(nome ou id do pokemon)_ _(nome do item)_ -* _Dar item ao pokémon_
➡️ *poke dropitem _(nome ou id do pokemon)_ _(nome do item)_ -* _Remover item do pokémon_

*TIME POKEMON*
➡️ *team -* _Informações do time atual_
➡️ *team _(nome ou id do pokemon)_ -* _Inserir pokémons ao time atual (Máximo: 6)_
▶▶ Exemplo: pz. team charizard electrode murkrow
▶▶ Exemplo: pz. team 15567 10889 20122
➡️ *team main _(nome ou id do pokemon)_ -* _Troca apenas o pokemon principal, mantendo o time_
➡️ *team save _(nome do time)_ -* _Salva o time atual com o nome definido, para uso posterior_
➡️ *team load _(nome do time)_ -* _Carrega o time salvo com o nome fornecido, se disponível_

*ROTA*
➡️ *route start -* _Iniciar rota no grupo_
➡️ *route enter -* _Entrar na rota_
➡️ *route leave -* _Sair da rota_
➡️ *route info -* _Informações da rota_
➡️ *route upgrade _(nome do upgrade)_ -* _Realizar upgrade na rota. (Consulte os diferentes tipos de upgrade utilizando o comando pz. help upgrade)_
➡️ *route incense _(nome do incenso)_ -* _Ativar incenso na rota. (Consulte os diferentes tipos de incenso utilizando o comando pz. help incense)_
➡️ *route lock _(level)_ -* _Limitar nível máximo de aparição de pokémons na rota_
➡️ *route verify -* _Informar boss que está afugentando os pokémons da rota_
➡️ *route forfeit -* _Utilizar poké-coins e experiencia da rota para remover o boss que está afugentando os pokémons da rota_
➡️ *route pokeranch _(id do pokemon)_ -* _Resgatar pokémon (Caso ele tenha fugido dentro de 6 horas)_
➡️ *route daycare _(id do pokemon)_ -* _Adicionar pokémon ao day-care (O pokémon será treinado até alcançar o nível da rota)_
➡️ *route travel -* _Mover a rota para o destino, onde é possível capturar pokémons daquela região_

*CAPTURA*
➡️ *catch _(nome-da-pokebola)_ _(id do pokemon)_ -* _Utilizar pokébola especial para capturar o pokémon_

*INVENTÁRIO*
➡️ *inventory items -* _Exibir inventário de items_
➡️ *inventory poke -* _Exibir inventário de pokémons_

*DUELO*
➡️ *duel x1 _(id-do-oponente)_ -* _Convidar jogador para um duelo 1v1. (Utilizará o primeiro slot de pokémons de cada jogador)_
➡️ *duel x2 _(id-do-oponente)_ -* _Convidar jogador para um duelo 2v2. (Utilizará os primeiros 2 slots de pokémons de cada jogador)_
➡️ *duel z6 _(id-do-oponente)_ -* _Convidar jogador para um duelo 6x6. (Utilizará os 6 slots de pokémons de cada jogador)_

*TROCAS*
➡️ *trade poke _(id-do-pokemon)_ _(id-do-pokemon)_ -* _Trocar seu pokémon com o pokémon de outro jogador, respectivamente._

*LOJA*
➡️ *loja -* _Exibir a loja do jogo_
➡️ *loja _(nome do item OU posição dele na loja)_ _(quantidade)_ -* _Comprar item da loja_

*RANQUEAMENTO*
➡️ *rank elo -* _Exibir ranking de duelos_
➡️ *rank catch -* _Exibir ranking de capturas (Pontos adquiridos em capturas únicas)_

*COMBINAÇÃO DE POKÉMON*
➡️ *breed _(id-do-pokemon)_ _(id-do-pokemon)_ -* _Combinar pokémons para gerar filhotes_
➡️ *hatch -* _Chocar ovo do filhote para gerar um pokémon_

*ENVIAR*
➡️ *send poke _(id-do-pokemon)_ _(id-do-jogador)_ -* _Enviar pokémon para outro jogador_
➡️ *send item _(nome-do-item)_ _(quantidade)_ _(id-do-jogador)_ -* _Enviar items para outro jogador_
➡️ *send cash _(quantidade)_ _(id-do-jogador)_ -* _Enviar poké-coins para outro jogador_

*INVASÃO*
➡️ *invasion defend _(id-do-pokemon)_ -* _Defender invasão_

*ATAQUE*
➡️ *raid start _(raidName)_ _(nivel)_ -* _Iniciar raid_
➡️ *raid enter _(raidId)_ -* _Participar da raid_
➡️ *raid cancel -* _Deixar a raid_
➡️ *raid team -* _Exibir time para raid_
➡️ *raid team _(id-do-pokemon)_ -* _Atualizar time para raid_

*VENDAS*
➡️ *sell poke _(id-do-pokemon)_ -* _Vender pokémon_
➡️ *sell all-poke eggs 3 -* _Vender todos os pokémons com 3 ou mais ovos_
➡️ *sell item _(nome-do-item)_ _(quantidade)_-* _Vender item_
`;
const incenseText = `
📖 PokeZap Wiki - *INCENSOS* - [d]

*NOME*                    *DESCRIÇÃO*
full-incense             Aparição mínima de 10 pokémons em 30 minutos
shiny-incense          Aparição mínima de 10 pokémons em 30 minutos, podendo haver shiny
elemental-incense   Aparição mínima de 10 pokémons em 30 minutos dos tipos escolhidos

Para usar:
pz. rota incenso
pz. rota incenso shiny-incense
pz. rota incenso elemental-incense fire grass (diga os tipos que deseja)
`;
const upgradesText = `
📖 PokeZap Wiki - *UPGRADES* [d]

*NOME*                   *DESCRIÇÃO*
ponte-de-pesca      Possibilidade de pesca (Em desenvolvimento)
poke-ranch             Resgate de pokémons que já fugiram dentro de 12 horas
minivan                  (Em desenvolvimento)
daycare                  Treinar pokémons, limitado ao nível da sua rota
casino                    Aposte seus itens e tente lucrar
lab                       Reduz o tempo de nascimento dos pokemon
bikeshop               Possibilidade de raid na rota
barco                     Viajar para outras localidades de pokémons especificos
pokemon-center   +2 energia bônus de tempo em tempo

Para mais informação utilize:
pz. help upgrade (nome-do-upgrade)
`;
const talentsText = `
📖 PokeZap Wiki - *TALENTOS* [d]

Em PokeZap, cada pokemon possui 9 talentos que podem ser vistos no canto inferior esquerdo.
Os talento servem para:

*1. Aumentar o dano dos poderes exponencialmente*
*2. Aumentar a defesa*
*3. Permitir o uso de golpes TM que não seja da tipagem do pokemon* 
⚙ - Um charizard do tipo fogo/voador, pode usar o golpe THUNDER-PUNCH (tm) se:
    Possuir 3 TMs
    Ter 2 talentos do tipo elétrico (mesma tipagem do golpe tm)

    Para saber quantos talentos necessários:
    1 - Golpe com até 40 de poder
    2 - Golpe com até 75 de poder
    3 - Todos os golpes
`;
const helpTextMap = new Map([
    // INCENSE ROUTES
    ['INCENSE', incenseText],
    ['INCENSES', incenseText],
    ['INCENSO', incenseText],
    ['INCENSOS', incenseText],
    // UPGRADE ROUTES
    ['UPGRADE', upgradesText],
    ['UPGRADES', upgradesText],
    ['MELHORIA', upgradesText],
    ['MELHORIAS', upgradesText],
    // COMMANDS ROUTES
    ['COMANDO', commandsText],
    ['COMANDOS', commandsText],
    ['COMMAND', commandsText],
    ['COMMANDS', commandsText],
    // CLAN ROUTES
    ['CLAN', clanText],
    ['CLANS', clanText],
    // POKEBALLS ROUTES
    ['POKEBOLA', pokeballsText],
    ['POKEBOLAS', pokeballsText],
    ['POKEBALL', pokeballsText],
    ['POKEBALLS', pokeballsText],
    // PLATES ROUTES
    ['PLATE', platesText],
    ['PLATES', platesText],
    ['PLACA', platesText],
    ['PLACAS', platesText],
    // GEM ROUTES
    ['GEM', gemText],
    ['GEMS', gemText],
    ['GEMA', gemText],
    ['GEMAS', gemText],
    // HELD X ROUTES
    ['HELDX', heldXText],
    ['HELD-X', heldXText],
    // TALENT ROUTES
    ['TALENT', talentsText],
    ['TALENTS', talentsText],
    ['TALENTO', talentsText],
    ['TALENTOS', talentsText],
    // ITEM ROUTES
    ['TM', items_1.tm],
    ['TM-CASE', items_1.tmCase],
    ['TMCASE', items_1.tmCase],
    ['POKEBALL-BOX', items_1.pokeBallBox],
    ['POKE-BALL-BOX', items_1.pokeBallBox],
    ['POKEBALLBOX', items_1.pokeBallBox],
    ['RARE-CANDY', items_1.rareCandy],
    ['RARECANDY', items_1.rareCandy],
    ['PROPCASE', items_1.propCase],
    ['PROP-CASE', items_1.propCase],
]);
const subRouteMap = new Map([
    // SKILL ROUTES
    ['SKILL', helpSkill_1.helpSkill],
    ['MOVE', helpSkill_1.helpSkill],
    ['ABILITY', helpSkill_1.helpSkill],
    // SKILLS ROUTES
    ['SKILLS', pokemonSkills_1.pokemonSkills],
    ['MOVES', pokemonSkills_1.pokemonSkills],
]);
const helpRoutes = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , subRoute] = data.routeParams;
    if (!subRoute)
        throw new AppErrors_1.MissingParametersHelpRouteError();
    const route = subRouteMap.get(subRoute);
    if (route)
        return yield route(data);
    const helpText = helpTextMap.get(subRoute);
    if (!helpText)
        throw new AppErrors_1.SubRouteNotFoundError(subRoute);
    return {
        message: helpText,
        status: 200,
        data: null,
    };
});
exports.helpRoutes = helpRoutes;
