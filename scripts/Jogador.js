const D = new (require("./Banco.js")).B();

const Apostas = require("./Apostas.js");
const red = {
    "roleta": Apostas.RoletaAuto,
    "blackjack": Apostas.Blackjack,
    "winWheel": Apostas.WinWheelAuto
}

class Jogador {
    constructor(nome, UUID) {
        this._nome = nome;
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

    async apostar(params) {
        // Checando token de autenticação
        if (params["authToken"] != this._authToken) return undefined;
        console.log("[Jogador] Autenticado");
        // Checando se o preço é tabelado
        if (params["valor"] == undefined || params["jogo"] in Apostas.PrecosTabelados) params["valor"] = Apostas.PrecosTabelados[params["jogo"]];
        console.log("[Jogador] Novo valor = " + params["valor"]);
        // Checando se tem saldo
        //if (this.rmDinheiro(params["valor"]) == undefined) return undefined;
        var s = await D.saldo(this.UUID);
        //console.log("ASUHASOIUDH" + s);
        console.log("[Jogador] Saldo OK");
        var _ = await D.atualizarSaldo(this.UUID, -params["valor"]);
        // Gerando aposta
        console.log("[Jogador] Gerando aposta no valor de " + params["valor"] + " em " + params["jogo"] + (params["tipo"] != undefined ? (" (tipo " + params["tipo"] + ")") : ""));
        params["jogadorPtr"] = this;
        // Retornando a resposta instanciada no jogo correto
        return red[params["jogo"]](params);
    }
}

exports.Jogador = Jogador;