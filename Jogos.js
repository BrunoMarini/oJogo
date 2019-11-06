const Apostas = require("./Apostas.js");
const Cartas = require("./Cartas.js");
const chancesWinWheel = [
    {"premio":    0, "chance": 5},
    {"premio": 1000, "chance": 5},
    {"premio":  500, "chance": 5},
    {"premio":  400, "chance": 5},
    {"premio":  300, "chance": 5},
    {"premio":  200, "chance": 5},
    {"premio":  100, "chance": 5},
    {"premio":  400, "chance": 5},
    {"premio":  300, "chance": 5},
    {"premio":  200, "chance": 5},
    {"premio":  100, "chance": 1},
    {"premio":   50, "chance": 1},
    {"premio":    0, "chance": 1},
    {"premio":  600, "chance": 1},
    {"premio":  500, "chance": 1},
    {"premio":  400, "chance": 5},
    {"premio":  300, "chance": 5},
    {"premio":  200, "chance": 5},
    {"premio":  100, "chance": 5},
    {"premio":  400, "chance": 5},
    {"premio":  300, "chance": 5},
    {"premio":  200, "chance": 5},
    {"premio":  100, "chance": 5},
    {"premio":   50, "chance": 5},
]; // Rever chances
		
class Jogo {
    constructor(nome, mgr) {
        this._jogadores = {};
        this._apostas = [];
        this._timer = undefined;
        this._timerTime = 10000;
        this._nome = nome;
        this._UUID = this.genToken();
        this.__M__ = mgr;
    }

    get UUID() { return this._UUID; }

    genToken() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    addJogador(jogadorPtr) {
        console.log("[Jogos] Jogador " + jogadorPtr.nome + " entrando em " + this._nome);
        jogadorPtr.salaAtiva = this;
        var auth = this.genToken();
        jogadorPtr.authToken = auth
        this._jogadores[jogadorPtr.UUID] = jogadorPtr;
        return jogadorPtr.authToken;
    }
    getJogador(UUID) { return this._jogadores[UUID]; }

    addAposta(aposta) {
        //console.log("Aposta: ", aposta);
        if (aposta != undefined && aposta["jogador"].UUID in this._jogadores) {
            this._apostas.push(aposta);
            // Iniciar contagem para calcular a rodada (pode ser modificado em subclasses)
            if (this._timer == undefined) {
                console.log("[Jogos] Iniciando contagem regressiva de " + this._timerTime + "ms para processar " + this._nome + " - " + this._UUID);
                this._timer = setTimeout( this.calcularRodada.bind(this), this._timerTime );
            }
        }
        // Retornar valor para verificação
        return aposta;
    }
    aplicarTodasApostas(resultado) {
        var resultados = [];
        for (var i in this._apostas) {
            //console.log("[Jogos] Processando aposta", this._apostas[i])
            resultados.push({"aposta": this._apostas[i], "resultado": this._apostas[i].aplicarGanhos(resultado)});
        }
        this.__M__.processDone(resultados);
        return resultados;
    }
    limparApostas() {
        console.log("[Roleta] Limpando apostas");
        this._apostas = [];
        this._timer = undefined;
    }
    logarApostas() {
        for (var i in this._apostas) {
            console.log(this._apostas[i]);
        }
    }
    rmJogador(jogador) {
        this._jogadores[jogador].salaAtiva = undefined;
        this._jogadores[jogador].authToken = undefined;
        // Remover o jogador da sala
        delete(this._jogadores[jogador]);
        // Limpar apostas ativas do jogador
        for (var i in this._apostas) { if (this._apostas[i].jogador.UUID == jogador.UUID) delete(this._apostas[i]); } 
    }

    calcularRodada() { 
        // Abstract
    }
}

// ================================= BEGIN ROLETA =================================
class Roleta extends Jogo {
    constructor(mgr) {
        super("roleta", mgr);
    }

    girarRoleta() {
        var valor = Math.floor(Math.random() * 37);
        return new Apostas.RRoleta(valor);
    }

    calcularRodada() {
        console.log("[Roleta] Apostas encerradas...")
        var res = this.girarRoleta();
        console.log("[Roleta] Número " + res.numero + " (cor: " + res.cor + ", alto: " + res.isAlto + ")");
        var resultados = this.aplicarTodasApostas(res);
        // Enviar resultados para os donos
        this.limparApostas();
    }
}

exports.Roleta = Roleta;
// =================================  END ROLETA  =================================

// ================================= BEGIN BLACKJACK =================================
class Blackjack extends Jogo {
    constructor(mgr) {
        super("blackjack", mgr);
        this._mãos = {};
        this._baralho = new Cartas.Baralho();
        for (var k in this._jogadores) this._mãos[this._jogadores[k]] = [];
    }

    puxarCarta() {
        return this._baralho.removerCarta();
    }

    iniciarRodada() {
        // Coletar apostas

        // Dar duas cartas para cada (inclusive crupie)

        // Checar blackjacks

        // Para cada jogador, adicionar cartas enquanto quiser

        // Puxar cartas para o crupie ate que soma > 16
    }
}
// =================================  END BLACKJACK  =================================

// ================================= BEGIN WIN WHEEL =================================
class WinWheel extends Jogo {
	
	constructor(mgr) {
        super("winWheel", mgr);
    }
    
    addAposta(aposta) {
        this._apostas.push(aposta);
        // Calcular resultado imediatamente
        this.calcularRodada();
    }
	
	sortear(){
        let result = Math.random();
        if (result == 0) return 0;
		let pos = -1;
		
		while (result > 0) { result -= chances[++pos]['chance'] / 100.0; }
        return pos;
	}
	
	calcularRodada(){
        let pos = this.sortear();
		console.log("Result = " + pos + "; valor = " + chances[pos]['premio']);
		return {"posicao": pos, "recompensa": chances[pos]['premio']};	
	}
}

exports.WinWheel = WinWheel;
// =================================  END WIN WHEEL  =================================
