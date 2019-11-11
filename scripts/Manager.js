const Jogador = require("./Jogador.js");
const Jogos = require("./Jogos.js");
const Apostas = require("./Apostas.js");

class Manager {
    constructor() {
        this._mesas = {
            "roleta": [new Jogos.Roleta(this)],
			"winWheel": [new Jogos.WinWheel(this)]
        }
        this._jogadores = {}
        this._objetos = {}
        this._waitlist = []
    }

    acrescentarObjeto(objeto) {
        var token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        while (token in this._objetos) token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        this._objetos[token] = objeto;
        return token;
    }

    acrescentarJogador(jogador) { 
        if (!(jogador.UUID in this._jogadores)) {
            this._jogadores[jogador.UUID] = jogador; 
            this.acrescentarObjeto(jogador);
        }
    }
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
        var r = this.acessarMesa(params["jogo"], params["mesa"]).addAposta(
            this.acessarMesa(params["jogo"], params["mesa"]).getJogador(params["jogador"]).apostar(params)
        );
        if (r != undefined) {
            var token = this.acrescentarObjeto(r);
            r.fetchToken = token;
            return token;
        } else {
            return undefined;
        }
    }

    sentarEmMesa(jogador, jogo, mesa) {
        let jogadorPtr = this._jogadores[jogador];
        // Remover o jogador da sala anterior
        if (jogadorPtr.salaAtiva != undefined) jogadorPtr.salaAtiva.rmJogador(jogador);
        // Retornar o token autenticador gerado pela nova sala (servidor salvará como cookie no cliente)
        return this.acessarMesa(jogo, mesa).addJogador(jogadorPtr);
    }

    obterSaldo(jogador) {
        if (jogador in this._jogadores) return this._jogadores[jogador].dinheiro;
    }

    addWaitlist(jogador, jogo, mesa, token, response) {
        //console.log("Adding, response", response);
        var obj = {"jogador":jogador, "jogo":jogo, "mesa":mesa, "token":token, "response":response, "responseElements":[], "processed":false}
        this._waitlist.push(obj);
    }

    processDone(resultList) {
        //console.log("[Manager] Processando resultados", resultList);
        for (var kr in resultList) {
            for (var kw in this._waitlist) {
                //if ( resultList[kr]["aposta"].) {
                if ( resultList[kr]["aposta"].jogador.nome == this._waitlist[kw]["jogador"] ) {
                    console.log("[Manager] Found matching request for " + this._waitlist[kw]["jogador"]);
                    this._waitlist[kw]["processed"] = true;
                    this._waitlist[kw]["responseElements"].push(resultList[kr])
                }
            }
        }
        // After all results are processed, check which ones to reply
        var answered = 0;
        for (var kw in this._waitlist) {
            if ( this._waitlist[kw]["processed"] ) {
                var response = this._waitlist[kw]["response"];
                var elements = this._waitlist[kw]["responseElements"];
                var data = [];
                for (var ke in elements) {
                    var obj = {
                        "apostaOriginal" : elements[ke]["aposta"].valor,
                    }
                    for (var key in elements[ke]) {
                        if (!(["aposta"].includes(key))) {
                            console.log("[Manager] Key = " + key + ", val = ", elements[ke][key]);
                            obj[key] = elements[ke][key];
                        }
                    }
                    data.push(obj);
                } 
                response.send(JSON.stringify(data));
                answered++;
            }
        }
        // After all results are replied, check which ones to delete
        var newwaitlist = [];
        for (var kw in this._waitlist) {
            if ( !this._waitlist[kw]["processed"] ) { newwaitlist.push(this._waitlist[kw]) }
        }
        this._waitlist = newwaitlist;
        console.log("[Server] " + answered + " requests answered, " + this._waitlist.length + " remaining");
    }

    getDateNextRound(jogo, mesa) { return this.acessarMesa(jogo, mesa).dateNextRound; }
    getTimeToNextRound(jogo, mesa) { return this.acessarMesa(jogo, mesa).timeToNextRound; }
}

exports.MGR = Manager;