const Apostas = require("./Apostas.js");
const red = {
    "roleta": Apostas.Roleta,
    "blackjack": Apostas.Blackjack
}

class Jogador {
    constructor(nome, dinheiro, UUID) {
        this._nome = nome;
        if (dinheiro == undefined) dinheiro = 100;
        this._dinheiro = dinheiro;
        if (UUID == undefined) UUID = nome //+ Math.floor(Math.random() * 10000);
        this._UUID = UUID;
    }

    get nome() { return this._nome; }
    get UUID() { return this._UUID; }
    get dinheiro() { return this._dinheiro; }

    addDinheiro(dinheiro) { this._dinheiro += dinheiro; }
    rmDinheiro(dinheiro) { 
        if (this._dinheiro < dinheiro) return undefined;
        this._dinheiro -= dinheiro; 
        return this._dinheiro;
    }

    apostar(valor, jogo, condição, multi) {
        if (this.rmDinheiro(valor) == undefined) return undefined;
        console.log("[Jogador] Gerando aposta no valor de " + valor + " em " + jogo);
        return new red[jogo](valor, this, condição, multi);
    }
}

exports.Jogador = Jogador;