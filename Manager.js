const Jogador = require("./Jogador.js");
const Jogos = require("./Jogos.js");
const Apostas = require("./Apostas.js");

class Manager {
    constructor() {
        this._mesas = {
            "roleta": [new Jogos.Roleta()]
        }
    }

    acessarMesa(jogo, mesa) {
        return this._mesas[jogo][mesa];
    }

    init() {
        var jog1 = new Jogador.Jogador("asdf");
        console.log("[Manager] Gerei um jogador com UUID " + jog1.UUID);
        this.acessarMesa("roleta", 0).addJogador(jog1);
        var jog2 = new Jogador.Jogador("fdsa");
        console.log("[Manager] Gerei um jogador com UUID " + jog2.UUID);
        this.acessarMesa("roleta", 0).addJogador(jog2);
    }

    gerarAposta(jogo, mesa, jogador, valor, condição, multi) {
        this.acessarMesa(jogo, mesa).addAposta(this.acessarMesa(jogo, mesa).getJogador(jogador).apostar(valor, jogo, condição, multi));
    }
}

exports.MGR = Manager;