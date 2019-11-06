// Exemplo de execução do servidor
const M = new (require("./Manager.js")).MGR();

// Simulação de cadastro de jogadores
M.init();

// Simulação de requisições de apostas
// Formato do json:
/*
{
    "jogo": string - nome do jogo,
    "mesa": int - código da mesa,
    "jogador": UUID do jogador,
    "valor": int - valor da aposta (pode ser undefined para jogos tabelados),
    "tipo": string - identificador do tipo de aposta (usado dentro de cada jogo),
    "**kwargs": valores diversos - usados dentro de cada jogo para determinar uma aposta
}
*/
// Exemplos
M.gerarAposta({
    "jogo": "roleta", 
    "mesa": 0,
    "jogador": "asdf", 
    "valor": 50,
    "tipo": "valor",
    "numero": 11
});
M.gerarAposta({
    "jogo": "roleta", 
    "mesa": 0,
    "jogador": "fdsa", 
    "valor": 50,
    "tipo": "par"
});
M.gerarAposta({
    "jogo": "roleta", 
    "mesa": 0,
    "jogador": "uiop", 
    "valor": 50,
    "tipo": "impar"
});

// Geração de apostas irá ativar uma contagem para calcular a rodada (ainda não implementado)
// Simulação
M.acessarMesa("roleta", 0).calcularRodada();