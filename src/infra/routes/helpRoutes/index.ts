import { IResponse } from '../../../server/models/IResponse'
import { MissingParametersHelpRouteError, SubRouteNotFoundError } from '../../errors/AppErrors'
import { TRouteParams } from '../router'

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
`
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
`

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
`

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
`

const heldXText = `
📖 PokeZap Wiki - HELD X
HELD X é um tipo de item que seu pokémon pode segurar.

X-ATTACK   - 11% DE ATK À TODOS OS ELEMENTOS
X-DEFENSE - 11% DE DEFESA
`

const commandsText = `
📖 PokeZap Wiki - *COMMANDS*
Para utilizar um comando no jogo é obrigatório informar o prefixo pokezap ou pz
(Ex. poke**p. start).

*INÍCIO*
➡️ *start -*  _Criar personagem_

*PERSONAGEM*
➡️ *player -* _Informações sobre seu personagem_

*POKÉMONS*
➡️ *poke info _(pokemonName/ID)_ -* _Informações do pokémon_
➡️ *poke team -* _Informações do time atual_
➡️ *poke team _(pokemonName/ID)_ -* _Inserir pokémons ao time atual (Máximo: 6)_
➡️ *poke sell _(pokemonName/ID)_ -* _Vender pokémon_
➡️ *poke evolve _(pokemonName/ID)_ -* _Evoluir pokémon_
➡️ *poke mega-evolve _(pokemonName/ID)_ -* _Mega evoluir pokémon_
➡️ *poke skills _(skillType)_ _(pokemonName/ID)_ -* _Informações de habilidades do tipo X do pokémon_
➡️ *poke give-item _(pokemonName/ID)_ _(itemName/ID)_ -* _Inserir item ao pokémon_
➡️ *poke drop-item _(pokemonName/ID)_ _(itemName/ID)_ -* _Remover item do pokémon_

*ROTA*
➡️ *route start -* _Iniciar rota no grupo_
➡️ *route enter -* _Entrar na rota_
➡️ *route leave -* _Sair da rota_
➡️ *route info -* _Informações da rota_
➡️ *route upgrade _(upgradeName)_ -* _Realizar upgrade na rota. (Consulte os diferentes tipos de upgrade utilizando o comando pokez**p. help upgrade)_
➡️ *route incense _(incenseName)_ -* _Ativar incenso na rota. (Consulte os diferentes tipos de incenso utilizando o comando pokez**p. help incense)_
➡️ *route lock _(level)_ -* _Limitar nível máximo de aparição de pokémons na rota_
➡️ *route verify -* _Informar boss que está afugentando os pokémons da rota_
➡️ *route forfeit -* _Utilizar poké-coins e experiencia da rota para remover o boss que está afugentando os pokémons da rota_
➡️ *route poke-ranch _(pokemonName/ID)_ -* _Resgatar pokémon (Caso ele tenha fugido dentro de 6 horas)_
➡️ *route day-care _(pokemonName/ID)_ -* _Adicionar pokémon ao day-care (O pokémon será treinado até alcançar o nível da rota)_
➡️ *route travel _(cityName)_ -* _Mover a rota para o destino, onde é possível capturar pokémons daquela região (Ex. alola e galar)_

*CAPTURA*
➡️ *catch _(pokeballName/ID)_ _(pokemonName/ID)_ -* _Utilizar pokébola específica para capturar o pokémon_

*INVENTÁRIO*
➡️ *inventory items -* _Exibir inventário de items_
➡️ *inventory items names -* _Exibir inventário de items informando os nomes_
➡️ *inventory poke -* _Exibir inventário de pokémons_

*DUELO*
➡️ *duel x1 _(playerID)_ -* _Convidar jogador para um duelo 1v1. (Utilizará o primeiro slot de pokémons de cada jogador)_
➡️ *duel x2 _(playerID)_ -* _Convidar jogador para um duelo 2v2. (Utilizará os primeiros 2 slots de pokémons de cada jogador)_

*TROCAS*
➡️ *trade poke _(pokemonID)_ _(pokemonID)_ -* _Trocar seu pokémon com o pokémon de outro jogador, respectivamente._

*LOJA*
➡️ *shop -* _Exibir a loja do jogo_
➡️ *shop _(itemName/ID)_ _(amount)_ -* _Comprar item da loja_

*BATALHA*
➡️ *battle _(pokemonID)_ -* _Enfrentar pokémon_

*RANQUEAMENTO*
➡️ *ranking elo -* _Exibir ranking de duelos_
➡️ *ranking catch -* _Exibir ranking de capturas (Pontos adquiridos em capturas únicas)_

*COMBINAÇÃO DE POKÉMON*
➡️ *breed _(pokemonID)_ _(pokemonID)_ -* _Combinar pokémons para gerar filhotes_
➡️ *hatch _(pokemonID)_ -* _Chocar ovo do filhote para gerar um pokémon_

*ENVIAR*
➡️ *send poke _(pokemonID)_ _(playerID)_ -* _Enviar pokémon para outro jogador_
➡️ *send items _(itemID)_ _(amount)_ _(playerID)_ -* _Enviar items para outro jogador_
➡️ *send cash _(amount)_ _(playerID)_ -* _Enviar poké-coins para outro jogador_

*INVASÃO*
➡️ *invasion defend _(pokemonID)_ -* _Defender invasão_

*ATAQUE*
➡️ *raid start _(raidName)_ _(nivel)_ -* _Iniciar raid_
➡️ *raid enter _(raidId)_ -* _Participar da raid_
➡️ *raid cancel -* _Deixar a raid_
➡️ *raid team -* _Exibir time para raid_
➡️ *raid team _(pokemonID)_ -* _Atualizar time para raid_

*VENDAS*
➡️ *sell poke _(pokemonID)_ -* _Vender pokémon_
➡️ *sell item _(itemID)_ -* _Vender item_
`

const incenseText = `
📖 PokeZap Wiki - *INCENSOS*

*NOME*                    *DESCRIÇÃO*
full-incense             Aparição mínima de 10 pokémons em 30 minutos
shiny-incense          Aparição mínima de 10 pokémons em 30 minutos, podendo haver shiny
elemental-incense   Aparição mínima de 10 pokémons em 30 minutos dos tipos escolhidos
`

const upgradesText = `
📖 PokeZap Wiki - *UPGRADES*

*NOME*                   *DESCRIÇÃO*
ponte-de-pesca      Possibilidade de pesca (Em desenvolvimento)
poke-ranch             Resgate de pokémons que já fugiram dentro de 6 horas
minivan                  (Em desenvolvimento)
daycare                  Treinar pokémons, limitado ao nível da sua rota
bazar                     (Em desenvolvimento)
lab                         (Em desenvolvimento)
bikeshop               Possibilidade de raid na rota
barco                     Viajar para outras localidades de pokémons especificos
pokemon-center   +2 energia bônus de tempo em tempo
`

const subRouteMap = new Map<string, any>([
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
])

export const helpRoutes = async (data: TRouteParams): Promise<IResponse> => {
  const [, , subRoute] = data.routeParams
  if (!subRoute) throw new MissingParametersHelpRouteError()

  const route = subRouteMap.get(subRoute)
  if (!route) throw new SubRouteNotFoundError(subRoute)

  return {
    message: route,
    status: 200,
    data: null,
  }
}
