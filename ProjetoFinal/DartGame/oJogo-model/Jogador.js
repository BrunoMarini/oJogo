const Apostas = require("./Apostas.js");
const red = {
    "roleta": Apostas.RoletaAuto,
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

    apostar(params) {
        if (this.rmDinheiro(params["valor"]) == undefined) return undefined;
        console.log("[Jogador] Gerando aposta no valor de " + params["valor"] + " em " + params["jogo"] + (params["tipo"] != undefined ? (" (tipo " + params["tipo"] + ")") : ""));
        params["jogadorPtr"] = this;
        return red[params["jogo"]](params);
    }
}

exports.Jogador = Jogador;