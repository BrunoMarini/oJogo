class Carta {
    constructor(valor, naipe) {
        this._valor = valor 
        this._naipe = naipe
    }
    get valor() { return this._valor; }
    get naipe() { return this._naipe; }
    get cor() { return this._naipe in ["espadas", "paus"] ? "preto" : "vermelho"; }
    get isFigura() { return this._valor in ["dama", "valete", "rei"]; }
    get isNumero() { return !this.isFigura; }
    get valorNumerico() {
        if (this._valor == 'A') return 1;
        if (typeof this._valor == 'number') return this._valor;
        return {
            'dama': 11,
            'valete': 12,
            'reis': 13
        }[this._valor]
    }
    get valorAbsoluto() {
        if (this._valor == 'A') return 1;
        if (typeof this._valor == 'number') return this._valor;
        return 10;
    }
    get string() { return "" + this.valor + " de " + this.naipe; }
}
exports.Carta = Carta;

class Baralho {
    constructor() {
        this._baralho = []
        var naipes = ["ouros", "espadas", "copas", "paus"]
        var figuras = ["dama", "valete", "rei"]
        for (var k in naipes) {
            this._baralho.push(new Carta('A', naipes[k]))
            for (var i = 2; i < 11; i++) {
                this._baralho.push(new Carta(i, naipes[k]))
            }
            for (var f in figuras) {
                this._baralho.push(new Carta(figuras[f], naipes[k]))
            }
        }
    }

    embaralhar() {
        console.log("[Baralho] Embaralhando...");
        for (let i = this._baralho.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this._baralho[i], this._baralho[j]] = [this._baralho[j], this._baralho[i]];
        }
    }

    exibirLog() {
        for (var i in this._baralho) {
            console.log(this._baralho[i].string)
        }
    }

    removerCarta() { return this._baralho.pop(); }

    reiniciar() {
        this._baralho = []
        var naipes = ["ouros", "espadas", "copas", "paus"]
        var figuras = ["dama", "valete", "rei"]
        for (var k in naipes) {
            this._baralho.push(new Carta('A', naipes[k]))
            for (var i = 2; i < 11; i++) {
                this._baralho.push(new Carta(i, naipes[k]))
            }
            for (var f in figuras) {
                this._baralho.push(new Carta(figuras[f], naipes[k]))
            }
        }
    }
}
exports.Baralho = Baralho;