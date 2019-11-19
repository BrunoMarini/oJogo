const Jogador = require("./Jogador.js");
const Jogos = require("./Jogos.js");
const Apostas = require("./Apostas.js");

class Manager {
    constructor() {
        this._mesas = {
            "roleta": [new Jogos.Roleta()]
        }
        this._jogadores = {}
    }

    //acrescentarJogador(jogador)

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
        var jog3 = new Jogador.Jogador("uiop");
        console.log("[Manager] Gerei um jogador com UUID " + jog3.UUID);
        this.acessarMesa("roleta", 0).addJogador(jog3);
    }

    gerarAposta(params) {//jogo, mesa, jogador, valor, condição, multi
        this.acessarMesa(params["jogo"], params["mesa"]).addAposta(this.acessarMesa(params["jogo"], params["mesa"]).getJogador(params["jogador"]).apostar(params));
    }

    //sentarEmMesa(jogador, jogo, mesa) {
    //    this.acessarMesa(jogo, mesa).addJogador
    //}
}

exports.MGR = Manager;