// class Resultado {
//     constructor() {

//     }
// }

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

class Aposta {
    constructor(valor, jogador, condição, multi) {
        this._valor = valor;
        this._jogador = jogador;
        this._condição = condição;
        this._multi = multi;
        console.log("[Aposta] Construída!");
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
            return this._valor * this._multi;
        } else {
            return 0;
        }
    }

    aplicarGanhos(resultado) {
        if (this.verificarAposta(resultado)) {
            console.log("[Aposta] Aplicando + " + (this._valor * this._multi) + " para " + this._jogador.nome)
            this._jogador.addDinheiro( this._valor * this._multi );
        }
    }
}

class ApostaRoleta extends Aposta{
    constructor(valor, jogador, condição, multi) {
        super(valor, jogador, condição, multi);
    }
}

exports.Roleta = ApostaRoleta;
exports.RRoleta = ResultadoRoleta;