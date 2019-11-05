const Apostas = require("./Apostas.js");
const Cartas = require("./Cartas.js");
const chancesWinWheel chances = [
			{“premio”:    0, “chance”: 5},
			{“premio”: 1000, “chance”: 5},
			{“premio”:  500, “chance”: 5},
			{“premio”:  400, “chance”: 5},
			{“premio”:  300, “chance”: 5},
			{“premio”:  200, “chance”: 5},
			{“premio”:  100, “chance”: 5},
			{“premio”:  400, “chance”: 5},
			{“premio”:  300, “chance”: 5},
			{“premio”:  200, “chance”: 5},
			{“premio”:  100, “chance”: 1},
			{“premio”:   50, “chance”: 1},
			{“premio”:    0, “chance”: 1},
			{“premio”:  600, “chance”: 1},
			{“premio”:  500, “chance”: 1},
			{“premio”:  400, “chance”: 5},
			{“premio”:  300, “chance”: 5},
			{“premio”:  200, “chance”: 5},
			{“premio”:  100, “chance”: 5},
			{“premio”:  400, “chance”: 5},
			{“premio”:  300, “chance”: 5},
			{“premio”:  200, “chance”: 5},
			{“premio”:  100, “chance”: 5},
			{“premio”:   50, “chance”: 5},
			
		];
		
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

// ================================= BEGIN ROLETA =================================
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
// =================================  END ROLETA  =================================

// ================================= BEGIN BLACKJACK =================================
class Blackjack extends Jogo {
    constructor() {
        super()
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

// ================================= BEGIN WIN WHEEL =================================
class WinWheel extends Jogo {
	constructor(){
		
		

		
	}
	
}
// =================================  END WIN WHEEL  =================================

