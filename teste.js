const M = new (require("./Manager.js")).MGR();
M.init()
M.gerarAposta({
    "jogo": "roleta", 
    "mesa": 0,
    "jogador": "asdf", 
    "valor": 25,
    "tipo": "baixo"
});
M.gerarAposta({
    "jogo": "roleta", 
    "mesa": 0,
    "jogador": "fdsa", 
    "valor": 25,
    "tipo": "alto"
});
M.gerarAposta({
    "jogo": "roleta", 
    "mesa": 0,
    "jogador": "fdsa", 
    "valor": 25,
    "tipo": "duzia",
    "duzia": 1
});
console.log("Antes:")
console.log(M.acessarMesa("roleta", 0)._jogadores)
M.acessarMesa("roleta", 0).calcularRodada();
console.log("Depois:")
console.log(M.acessarMesa("roleta", 0)._jogadores)