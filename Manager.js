const Jogador = require("./Jogador.js");
const Jogos = require("./Jogos.js");
const Apostas = require("./Apostas.js");

class Manager {
    constructor() {
        this._mesas = {
            "roleta": [new Jogos.Roleta()],
			"winWheel": [new Jogos.WinWheel()]
        }
        this._jogadores = {}
    }

    acrescentarJogador(jogador) { if (!(jogador.UUID in this._jogadores)) this._jogadores[jogador.UUID] = jogador; }
    logarJogador(usuario, senha) {
        if (usuario in this._jogadores) return this._jogadores[usuario].login(senha);
        return false;
    }

    acessarMesa(jogo, mesa) { return this._mesas[jogo][mesa]; }

    init() {
        var jog1 = new Jogador.Jogador("asdf", "asdf");
        this.acrescentarJogador(jog1);
        console.log("[Manager] Gerei um jogador com UUID " + jog1.UUID);
        this.acessarMesa("roleta", 0).addJogador(jog1);
        var jog2 = new Jogador.Jogador("fdsa", "fdsa");
        this.acrescentarJogador(jog2);
        console.log("[Manager] Gerei um jogador com UUID " + jog2.UUID);
        this.acessarMesa("roleta", 0).addJogador(jog2);
        var jog3 = new Jogador.Jogador("uiop", "uiop");
        this.acrescentarJogador(jog3);
        console.log("[Manager] Gerei um jogador com UUID " + jog3.UUID);
        this.acessarMesa("roleta", 0).addJogador(jog3);
    }

    gerarAposta(params) {
        console.log("[Manager] Gerando aposta para " + params["jogador"] + " em " + params["jogo"] + ", sala " + params["mesa"] + " (valor = " + params["valor"] + ", token = " + params["authToken"] + ")");
        var r = this.acessarMesa(params["jogo"], params["mesa"]).addAposta(this.acessarMesa(params["jogo"], params["mesa"]).getJogador(params["jogador"]).apostar(params));
        return (r == undefined ? false : true);
    }

    sentarEmMesa(jogador, jogo, mesa) {
        let jogadorPtr = this._jogadores[jogador];
        // Remover o jogador da sala anterior
        if (jogadorPtr.salaAtiva != undefined) jogadorPtr.salaAtiva.rmJogador(jogador);
        // Retornar o token autenticador gerado pela nova sala (servidor salvará como cookie no cliente)
        return this.acessarMesa(jogo, mesa).addJogador(jogadorPtr);
    }
}

exports.MGR = Manager;