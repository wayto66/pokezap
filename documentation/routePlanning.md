route0: ROUTE

- pokezap. rota criar : cria a gameroom[rota]
- pokezap. rota entrar: tenta incluir o requisitante na rota atual
- pokezap. rota sair: ...
- pokezap. rota upgrade: mostra os upgrades disponiveis para aquela rota
- pokezap. rota info: mostra as informacoes da rota atual
- pokezap. rota info [id]: mostra as informacoes da rota [id]

=====
route1: NEWUSER
---- pokezap. iniciar
---- pokezap. iniciar menino / pokezap. iniciar menina
---- pokezap. iniciar menino 12 [id-da-sprite]
newuser1 = explicação sobre o game e pergunta se é male ou female
newuser2 = baseado na escolha acima, mostra opcoes de avatares
newuser3 = cria o starter pokemon e o kit inicial
=====

route2: INVENTARIO

- pokezap. inventario: rota principal, pergunta se o jogador quer ver itens, pokemons guardados ou time pokemon atual.
- pokezap. inventario itens: rota de itens, mostra a bolsa de itens
- - pokezap. inventario itens vender [id] [qtd] [preço] - anuncia a venda de uma qtd de itens
- pokezap. inventario pc: rota de mostrar os pokemons guardados
- - pokezap. inventario pc [id] time : move o pokemon para o time e manda o ultimo pokemon do time para o pc.
- pokezap. inventario time: rota de mostrar os pokemons do time
- - pokezap. inventario time [id] remover : remove do time
- - pokezap. inventario time [id] : info
- - pokezap. inventario time [id] principal : define aquele pokemon como o principal

route3: JOGADOR

- pokezap. jogador: essa rota mostra informações do jogador que chamou a rota, como ELO e time atual.
- pokezap. jogador [id]: essa rota mostra informações do jogador com o [id]

route4: POKEMON

- pokezap. pokemon info [id]: essa rota mostra informações do pokemon com o [id]
- pokezap. pokemon trocar [id1] [id2]: essa rota inicia a troca dos 2 pokemons
- pokezap. pokemon breed [id1] [id2]: essa rota inicia o breed de 2 pokemons
- - - pokezap. pokemon breed [id1] [id2] aceitar: essa rota inicia o breed de 2 pokemons e pula a etapa de aceitar
- pokezap. pokemon catch [id] : essa rota permite inciar o processo de captura. verifica se o requisitante derrotou o pokemon.

route 4B CATCH

- pokezap. catch [id]
- pokezap. catch pokeball [id]

route5: LOJA

- pokezap. loja : rota principal, mostra os itens da loja
- pokezap. loja comprar : vai pedir o id e a quantidade
- pokezap. loja vender : vai pedir o id e a quantidade
- pokezap. loja comprar [id] [qtd] : inicia o processo de compra do item [id] na quantidade [qtd]

route6: DUELO

- pokezap. duelo : rota principal, explica o processo de duelo
- pokezap. duelo [id] : chama o duelo do requisitante ao player [id] - o player [id] pode reagir e confirmar, iniciando o duelo.
- - quando um duelo é confirmado, uma duelsession écriada.
- - a duelsession é mostrada então aos jogadores, que podem reagir a mensagem, fazendo apostas
- - as apostas sao fechadas e o duelo inicia.
- - o duelo tem 3 fases: cada fase é enviada uma mensagem, contando a narrativa do duelo.
- - oq influencia o resultado de cada fase:
- - - stats de todos os pokemons, interações tipo a tipo, efeitos passivos dos talentos, estrategia individual.
- - cada fase tem um vencedor, a alteração de elo depende do placar.

===============================================================

CRON-ACTIONS

[1] - aparição de pokemon selvagem

- aparição do pokemon na rota, baseado no nivel da rota. é enviada a mensagem no grupo
- o jogador pode reagir à mensagem, iniciando o combate usando o pokemon principal do time dele.
- o bot lança uma nova mensagem, marcando o jogador, anunciando o resultado da batalha. mostrando uma imagem com as balls disponveis e quanidades
- o jogador reage a iamgem para lançar uma ball
- o bot manda uma nova mensagem marcando o jogador anunciando o resultado
