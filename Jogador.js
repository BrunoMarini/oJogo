const Apostas = require("./Apostas.js");
const red = {
    "roleta": Apostas.RoletaAuto,
    "blackjack": Apostas.Blackjack
}

class Jogador {
    constructor(nome, senha, dinheiro, UUID) {
        this._nome = nome;
        this._senha = senha;
        if (dinheiro == undefined) dinheiro = 100;
        this._dinheiro = dinheiro;
        if (UUID == undefined) UUID = nome //+ Math.floor(Math.random() * 10000);
        this._UUID = UUID;
        this._salaAtiva = undefined;
    }

    login(senha) { return this._senha == senha; }

    get nome() { return this._nome; }
    get UUID() { return this._UUID; }
    get dinheiro() { return this._dinheiro; }

    set authToken(t) { this._authToken = t; }
    get authToken() { return this._authToken; }
    set salaAtiva(s) { this._salaAtiva = s; }
    get salaAtiva() { return this._salaAtiva; }

    addDinheiro(dinheiro) { this._dinheiro += dinheiro; }
    rmDinheiro(dinheiro) { 
        if (this._dinheiro < dinheiro) return undefined;
        this._dinheiro -= dinheiro; 
        return this._dinheiro;
    }

    apostar(params) {
        // Checando token de autenticação
        if (params["authToken"] != this._authToken) return undefined;
        // Checando se o preço é tabelado
        if (params["valor"] == undefined) params["valor"] = Apostas.PrecosTabelados[params["jogo"]];
        // Checando se tem saldo
        if (this.rmDinheiro(params["valor"]) == undefined) return undefined;
        // Gerando aposta
        console.log("[Jogador] Gerando aposta no valor de " + params["valor"] + " em " + params["jogo"] + (params["tipo"] != undefined ? (" (tipo " + params["tipo"] + ")") : ""));
        params["jogadorPtr"] = this;
        // Retornando a resposta instanciada no jogo correto
        return red[params["jogo"]](params);
    }
}

exports.Jogador = Jogador;