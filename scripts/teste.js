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
// =====================================================
let result = 0/360;
let orig = result * 360;
let pos = -1;
const chances = [
    {"premio":   50, "chance": 5},
    {"premio":  100, "chance": 5},
    {"premio":  200, "chance": 5},
    {"premio":  300, "chance": 5},
    {"premio":  400, "chance": 5},
    {"premio":  100, "chance": 5},
    {"premio":  200, "chance": 5},
    {"premio":  300, "chance": 5},
    {"premio":  400, "chance": 5},
    {"premio":  500, "chance": 1},
    {"premio":  600, "chance": 1},
    {"premio":    0, "chance": 1},
    
    {"premio":   50, "chance": 1},
    {"premio":  100, "chance": 1},
    {"premio":  300, "chance": 5},
    {"premio":  200, "chance": 5},
    {"premio":  400, "chance": 5},
    {"premio":  100, "chance": 5},
    {"premio":  200, "chance": 5},
    {"premio":  300, "chance": 5},
    {"premio":  400, "chance": 5},
    {"premio":  500, "chance": 5},
    {"premio": 1000, "chance": 5},
    {"premio":    0, "chance": 5},
];
while (result > 0) { result -= chances[++pos]['chance'] / 100.0; }
console.log("Result = " + orig + "; pos = " + pos + "; valor = " + chances[pos]['premio']);