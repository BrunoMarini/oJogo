const precosTabelados = {
    "winWheel": 500
}
    //{"jogo": winWheel, "valor": 500}


class ResultadoRoleta {
    constructor(numero) {
        this._numero = numero
    }

    between(min, max) { return this._numero >= min && this._numero <= max; }
    get numero() { return this._numero; }
    get cor() { 
        if (this._numero == 0) return "verde";
        var par = this._numero % 2 ? false : true;
        if (this.between(1, 10) || this.between(19, 28)) {
            return par ? "preto" : "vermelho";
        } else {
            return par ? "vermelho" : "preto";
        }
    }
    get isNumero() { return (this._numero > 0); }

    // Impar ou par
    get isImpar() { return this.isNumero && (this._numero % 2 ? true : false); }
    get isPar() { return this.isNumero && (this._numero % 2 ? false : true); }

    // Preto ou vermelho
    get isPreto() { return this.cor == "preto"; }
    get isVermelho() { return this.cor == "vermelho"; }

    // Alto ou baixo
    get isAlto() { return this._numero > 18; }
    get isBaixo() { return this.isNumero && this._numero < 19; }
}

// ================================ APOSTAS ================================
class Aposta {
    constructor(valor, jogador) {
        this._valor = valor;
        this._jogador = jogador;
        this._UUID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        console.log("[Aposta] Construída!");
    }
    get valor() { return this._valor; }
    get jogador() { return this._jogador; }
    get UUID() { return this._UUID; }
}

// ================================ APOSTA ROLETA ================================
class ApostaRoleta extends Aposta {
    constructor(params) {
        super(params["valor"], params["jogadorPtr"]);
        this._condição = params["condição"];
        this._payout = params["valor"] * params["multiplicador"];
    }
    
    verificarAposta(resultado) {
        var res = (eval(this._condição));
        if (res) {
            console.log("[Aposta] Correta!")
        } else {
            console.log("[Aposta] Incorreta!")
        }
        return res;
    }
    
    verificarGanhos(resultado) {
        if (this.verificarAposta(resultado)) {
            return this._payout;
        } else {
            return 0;
        }
    }

    aplicarGanhos(resultado) {
        if (this.verificarAposta(resultado)) {
            console.log("[Aposta] Aplicando + " + this._payout + " para " + this._jogador.nome)
            this._jogador.addDinheiro( this._payout );
            return {"premio": this._payout, "justificativa": "Acertou a aposta!"};
        }
        return {"premio": 0, "justificativa": "Errou a aposta..."};
    }
}

function ApostaRoletaAuto(params) {
    let Auto = {
        "par"      : {"condição": "resultado.isPar",                                                                                                                    "multiplicador": 2 },
        "impar"    : {"condição": "resultado.isImpar",                                                                                                                  "multiplicador": 2 },
        "preto"    : {"condição": "resultado.isPreto",                                                                                                                  "multiplicador": 2 },
        "vermelho" : {"condição": "resultado.isVermelho",                                                                                                               "multiplicador": 2 },
        "alto"     : {"condição": "resultado.isAlto",                                                                                                                   "multiplicador": 2 },
        "baixo"    : {"condição": "resultado.isBaixo",                                                                                                                  "multiplicador": 2 },
        "duzia"    : {"condição": "resultado.between(" + ((params["duzia"] - 1) * 12 + 1) + ", " + (params["duzia"] * 12) + ")",                                        "multiplicador": 3 },
        "coluna"   : {"condição": "resultado.numero % 3 == " + params["coluna"] % 3,                                                                                    "multiplicador": 3 },
        "linha"    : {"condição": "resultado.between(" + ((params["linha"] - 1) * 6 + 1) + ", " + (params["linha"] * 6) + ")",                                          "multiplicador": 6 },
        "canto"    : {"condição": "resultado.numero in [" + params["min"] + ", " + (params["min"] + 1) + ", " + (params["min"] + 3) + ", " + (params["min"] + 4) + "]", "multiplicador": 9 },
        "rua"      : {"condição": "resultado.between(" + ((params["rua"] - 1) * 3 + 1) + ", " + (params["rua"] * 3) + ")",                                              "multiplicador": 12},
        "split"    : {"condição": "resultado.numero == " + params["num1"] + " || resultado.numero == " + params["num2"],                                                "multiplicador": 18},
        "valor"    : {"condição": "resultado.numero == " + params["numero"],                                                                                            "multiplicador": 36}
    }
    let autopar = Auto[params["tipo"]];
    for (var k in params) { autopar[k] = params[k]; }
    return new ApostaRoleta(autopar);
}

// ================================ APOSTA BLACKJACK ================================
class ApostaBlackjack extends Aposta {
    constructor(params) {
        super(params["valor"], params["jogadorPtr"]);
        this._valor = params["valor"];
        this._multi = 2;
        this.__params__ = params;
    }

    split() { this._jogador.apostar(this.__params__) }//return new ApostaBlackjack(this._valor, this._jogador); }

    double() { this._multi = 4; }

    aplicarGanhos(resultado) {
        if (resultado['jogador'] > 21) return {"premio": 0, "justificativa": "Estourou a mão..."}; // Estourou
        if (resultado['jogador'] == 21 && resultado['ncartas_jogador'] == 2 && !(resultado['crupie'] == 21 && resultado['ncartas_crupie'] == 2)) { // Blackjack
            console.log("[Aposta] Aplicando + " + (this._valor * 4) + " para " + this._jogador.nome)
            this._jogador.addDinheiro( this._valor * 4 );
            return {"premio": this._valor * 4, "justificativa": "Blackjack!"};
        }
        if (resultado['jogador'] == resultado['crupie']) { // Devolução
            console.log("[Aposta] Aplicando + " + (this._valor * 1) + " para " + this._jogador.nome)
            this._jogador.addDinheiro( this._valor * 1 );
            return {"premio": this._valor, "justificativa": "Empatou com a mesa"};
        }
        if (resultado['jogador'] > resultado['crupie']) { // Venceu
            console.log("[Aposta] Aplicando + " + (this._valor * 2) + " para " + this._jogador.nome)
            this._jogador.addDinheiro( this._valor * 2 );
            return {"premio": this._valor * 2, "justificativa": "Ganhou!"};
        }
    }
}

//exports.Roleta = ApostaRoleta;
exports.RoletaAuto = ApostaRoletaAuto;
exports.RRoleta = ResultadoRoleta;
exports.Blackjack = ApostaBlackjack;
exports.PrecosTabelados = precosTabelados;