const M = new (require("./Manager.js")).MGR();

// var jog1 = new Jogador.Jogador("asdf");
// console.log("[Manager] Gerei um jogador com UUID " + jog1.UUID);
// this.acessarMesa("roleta", 0).addJogador(jog1);

// var jog2 = new Jogador.Jogador("fdsa");
// console.log("[Manager] Gerei um jogador com UUID " + jog2.UUID);
// this.acessarMesa("roleta", 0).addJogador(jog2);
M.init();

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
console.log("Antes:")
console.log(M.acessarMesa("roleta", 0)._jogadores)
M.acessarMesa("roleta", 0).calcularRodada();
console.log("Depois:")
console.log(M.acessarMesa("roleta", 0)._jogadores)