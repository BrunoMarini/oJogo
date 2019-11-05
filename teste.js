const M = new (require("./Manager.js")).MGR();
M.init()
M.gerarAposta("roleta", 0, "asdf", 25, "resultado.isAlto", 2);
M.gerarAposta("roleta", 0, "fdsa", 25, "resultado.isBaixo", 2);
console.log("Antes:")
console.log(M.acessarMesa("roleta", 0)._jogadores)
M.acessarMesa("roleta", 0).calcularRodada();
console.log("Depois:")
console.log(M.acessarMesa("roleta", 0)._jogadores)