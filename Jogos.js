const Apostas = require("./Apostas.js");

class Jogo {
    constructor() {
        this._jogadores = {};
        this._apostas = []
    }
    addJogador(jogador) {
        this._jogadores[jogador.UUID] = jogador;
    }
    getJogador(UUID) {
        return this._jogadores[UUID];
    }

    addAposta(aposta) {
        this._apostas.push(aposta)
    }
    aplicarTodasApostas(resultado) {
        for (var i in this._apostas) {
            this._apostas[i].aplicarGanhos(resultado);
        }
    }
    limparApostas() {
        console.log("[Roleta] Limpando apostas");
        this._apostas = []
    }
    logarApostas() {
        for (var i in this._apostas) {
            console.log(this._apostas[i]);
        }
    }
}

class Roleta extends Jogo {
    constructor() {
        super()
    }

    girarRoleta() {
        var valor = Math.floor(Math.random() * 37);
        return new Apostas.RRoleta(valor);
    }

    calcularRodada() {
        console.log("[Roleta] Apostas encerradas...")
        var res = this.girarRoleta();
        console.log("[Roleta] Número " + res.numero + " (cor: " + res.cor + ", alto: " + res.isAlto + ")");
        this.aplicarTodasApostas(res);
        this.limparApostas();
    }
}

exports.Roleta = Roleta;