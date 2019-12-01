let aguardandoRespostas = false;
let reqRespostas = undefined;

function onload() {
    requestSaldo();
}

function requestSaldo(willReload) {
    var req = new XMLHttpRequest();
    req.open('POST', "/reqSaldo", true);
    req.setRequestHeader('Content-Type', 'plain/text;charset=UTF-8');
    req.send();

    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) { 
            document.getElementById("saldoDisplay").innerHTML = "Saldo: " + req.responseText + "₿";
            document.saldo = req.responseText;
            if (willReload || willReload == undefined)
                reloadCurrency();
        }
    }
}

document.apostaStates = {
    // "Duzia 1": 0,
    // "Duzia 2": 0, 
    // "Duzia 3": 0, 
    // "Baixo": 0,
    // "Alto": 0,
    // "Vermelho": 0,
    // "Preto": 0,
    // "Ímpar": 0,
    // "Par": 0,
    // "Coluna 1": 0,
    // "Coluna 2": 0,
    // "Coluna 3": 0
}

document.replyTokens = {}

function enviarAposta(apostaData) {
    // var valor = parseInt(document.getElementById("fieldValor").value);
    // document.getElementById("fieldValor").value = ""

    var req = new XMLHttpRequest();
    var url = '/tryAposta';
    req.open('POST', url, true);

    console.log("Chamei com valor = ", apostaData);
    // msgData = {valor:valor, tipo:"vermelho"}
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    console.log("enviando: " + JSON.stringify(apostaData));
    req.send(JSON.stringify(apostaData));

    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            //alert(req.responseText);
            var parsed = JSON.parse(req.responseText);
            //requestSaldo();
            if (parsed["token"] != undefined) {
                // Impedir que o usuário mexa nas moedas
                $("div[id='currencyCoin']").draggable("disable");
                document.replyTokens[parsed["token"]] = apostaData["tipo"] + (apostaData["arg"] != undefined ? " " + apostaData["arg"] : "");
                console.log("New tokens = ", document.replyTokens);
            } else {
                alert("Sua aposta não pode ser efetivada");
            }
        }
    }

    // Iniciar uma espera assincrona pelo resultado da aposta
    if (!aguardandoRespostas) {
        reqRespostas = new XMLHttpRequest();
        reqRespostas.open('POST','/replyAposta',true);
        reqRespostas.addEventListener('load',onLoadReply);
        reqRespostas.addEventListener('error',onErrorReply);
        reqRespostas.send();
        aguardandoRespostas = true;
    }
}

function onLoadReply() {
    var response = this.responseText;
    var parsedResponse = JSON.parse(response);
    // Armazenar resposta para os outros elementos tratarem
    document.latestParsedResponse = parsedResponse;
    // Verificar qual o número sorteado
    var numSorteio = parseInt(parsedResponse[0]["valorSorteio"]["_numero"]);
    // Girar a roleta para aquele número
    document.spinTo(numSorteio);
}

function onErrorReply() {
    // Oof
    alert("fudeo");
}

// ================================================== FRONT ROLETA ==================================================

var numorder = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
var numred = [32, 19, 21, 25, 34, 27, 36, 30, 23, 5, 16, 1, 14, 9, 18, 7, 12, 3];
var numblack = [15, 4, 2, 17, 6, 13, 11, 8, 10, 24, 33, 20, 31, 22, 29, 28, 35, 26];
var numgreen = [0];

document.numberLoc = [];

function createWheel() {
    console.log("Creating wheel...");
    var rinner = $("#rcircle");
    var temparc = 360 / numorder.length;
    for (var i = 0; i < numorder.length; i++) {
        document.numberLoc[numorder[i]] = [];
        document.numberLoc[numorder[i]][0] = i * temparc;
        document.numberLoc[numorder[i]][1] = i * temparc + temparc;

        newSlice = document.createElement("div");
        $(newSlice).addClass("hold");
        
        newHold = document.createElement("div");
        $(newHold).addClass("pie");
        
        newNumber = document.createElement("div");
        $(newNumber).addClass("num");

        newNumber.innerHTML = numorder[i];
        $(newSlice).attr("id", "rSlice" + i);
        $(newSlice).css(
            "transform",
            "rotate(" + document.numberLoc[numorder[i]][0] + "deg)"
        );

        $(newHold).css("transform", "rotate(9.73deg)");
        $(newHold).css("-webkit-transform", "rotate(9.73deg)");

        if ($.inArray(numorder[i], numgreen) > -1) {
            $(newHold).addClass("greenbg");
        } else if ($.inArray(numorder[i], numred) > -1) {
            $(newHold).addClass("redbg");
        } else if ($.inArray(numorder[i], numblack) > -1) {
            $(newHold).addClass("greybg");
        }

        $(newNumber).appendTo(newSlice);
        $(newHold).appendTo(newSlice);
        $(newSlice).appendTo(rinner);
    }
}

function addToAposta(tipo, valor) { console.log("Add " + valor + " to " + tipo.toLowerCase()); document.apostaStates[tipo.toLowerCase()] += parseInt(valor); }
function rmFromAposta(tipo, valor) { console.log("Rm " + valor + " to " + tipo.toLowerCase()); document.apostaStates[tipo.toLowerCase()] -= parseInt(valor); }
function sendAllApostas() {
    // Não tratar nada se estiver aguardando a resposta do servidor
    if (aguardandoRespostas) return;
    document.replyTokens = {};
    var template = {
        "duzia 1": {tipo:"duzia", arg:1},
        "duzia 2": {tipo:"duzia", arg:2},
        "duzia 3": {tipo:"duzia", arg:3},
        "baixo": {tipo:"baixo"},
        "alto": {tipo:"alto"},
        "vermelho": {tipo:"vermelho"},
        "preto": {tipo:"preto"},
        "ímpar": {tipo:"impar"},
        "par": {tipo:"par"},
        "coluna 1": {tipo:"coluna", arg:1},
        "coluna 2": {tipo:"coluna", arg:2},
        "coluna 3": {tipo:"coluna", arg:3}
    }
    var a = document.apostaStates
    console.log("A = ", a)
    var t;
    for (var k in a) {
        if (a[k] > 0) {
            var val = parseInt(k) || undefined;
            if (val != undefined) {
                enviarAposta({valor: a[k], tipo:"valor", arg:val});
            } else {
                t = template[k];
                t["valor"] = a[k];
                enviarAposta(t);
            }
        }
    }
}

function reloadCurrency() {
    var saldo = document.saldo;
    console.log("reloadando to " + saldo)
    // Removendo moedas antigas
    $("div[id='currencyCoin']").remove();
    
    // Adicionando novas
    var valores = [1000, 500, 100, 50, 20, 10, 5, 1];
    var cuoins = [0, 0, 0, 0, 0, 0, 0, 0];
    var pos = 0;
    while (saldo > 0) {
        while (saldo < valores[pos]) pos++;
        cuoins[pos]++;
        saldo -= valores[pos];
    }
    while (pos < cuoins.length - 1) {
        cuoins[pos]--;
        saldo = valores[pos];
        pos++;
        while (saldo > 0) {
            while (saldo < valores[pos]) pos++;
            cuoins[pos]++;
            saldo -= valores[pos];
        }
    }
    for (var i in cuoins) {
        for (var c = 0; c < cuoins[i]; c++) {
            $("div[id='saldoContainer']").append("<div id='currencyCoin' class='ui-widget-content currencyCoin currency_" + valores[i] + "' valor='" + valores[i] + "'><p class='currencyCoinVisor'>" + valores[i] + "₿</p></div>");
        }
    }
    $( "div[id='currencyCoin']" ).draggable();
}

function resetApostaStates() {
    document.apostaStates = {
        "duzia 1": 0,
        "duzia 2": 0, 
        "duzia 3": 0, 
        "baixo": 0,
        "alto": 0,
        "vermelho": 0,
        "preto": 0,
        "ímpar": 0,
        "par": 0,
        "coluna 1": 0,
        "coluna 2": 0,
        "coluna 3": 0
    }
    for (var i = 0; i < 37; i++) document.apostaStates[i] = 0;
}

window.onload = function() {
    requestSaldo();
    // ========== Creating aposta table ==========
    resetApostaStates();

    var rotationsTime = 8;
    var wheelSpinTime = 6;
    var ballSpinTime = 5;
    var numbg = $(".pieContainer");
    var ballbg = $(".ball");
    var btnSpin = $("#btnSpin");
    var toppart = $("#toppart");
    var pfx = $.keyframe.getVendorPrefix;
    //console.log("pfx = ",pfx);
    var transform = pfx + "transform";
    var rinner = $("#rcircle");
    var numberLoc = [];
    $.keyframe.debug = true;

    console.log("Support for keyframes = ", $.keyframe.isSupported());
    this.createWheel();

    
    function resetAni() {
        animationPlayState = "animation-play-state";
        playStateRunning = "running";

        $(ballbg)
            .css(pfx + animationPlayState, playStateRunning)
            .css(pfx + "animation", "none");

        $(numbg)
            .css(pfx + animationPlayState, playStateRunning)
            .css(pfx + "animation", "none");

        $(toppart)
            .css(pfx + animationPlayState, playStateRunning)
            .css(pfx + "animation", "none");

        $("#rotate2").html("");
        $("#rotate").html("");
    }

    document.spinTo = function(num) {
        //get location
        //console.log(document.numberLoc);
        var temp = document.numberLoc[num][0] + 4;

        //randomize
        var rndSpace = Math.floor(Math.random() * 360 + 1);

        resetAni();
        setTimeout(function() {
            document.bgrotateTo(rndSpace);
            document.ballrotateTo(rndSpace + temp);
        }, 500);
    }

    document.ballrotateTo = function(deg) {
        var temptime = rotationsTime + 's';
        var dest = -360 * ballSpinTime - (360 - deg);
        $.keyframe.define({
            name: "rotate2",
            from: {
            transform: "rotate(0deg)"
            },
            to: {
            transform: "rotate(" + dest + "deg)"
            }
        });

        $(ballbg).playKeyframe({
            name: "rotate2", // name of the keyframe you want to bind to the selected element
            duration: temptime, // [optional, default: 0, in ms] how long you want it to last in milliseconds
            timingFunction: "ease-in-out", // [optional, default: ease] specifies the speed curve of the animation
            complete: function() {
                document.finishSpin();
            } //[optional]  Function fired after the animation is complete. If repeat is infinite, the function will be fired every time the animation is restarted.
        });
    }

    document.bgrotateTo = function(deg) {
        var dest = 360 * wheelSpinTime + deg;
        var temptime = (rotationsTime * 1000 - 1000) / 1000 + 's';

        $.keyframe.define({
            name: "rotate",
            from: {
            transform: "rotate(0deg)"
            },
            to: {
            transform: "rotate(" + dest + "deg)"
            }
        });

        $(numbg).playKeyframe({
            name: "rotate", // name of the keyframe you want to bind to the selected element
            duration: temptime, // [optional, default: 0, in ms] how long you want it to last in milliseconds
            timingFunction: "ease-in-out", // [optional, default: ease] specifies the speed curve of the animation
            complete: function() {} //[optional]  Function fired after the animation is complete. If repeat is infinite, the function will be fired every time the animation is restarted.
        });

        $(toppart).playKeyframe({
            name: "rotate", // name of the keyframe you want to bind to the selected element
            duration: temptime, // [optional, default: 0, in ms] how long you want it to last in milliseconds
            timingFunction: "ease-in-out", // [optional, default: ease] specifies the speed curve of the animation
            complete: function() {} //[optional]  Function fired after the animation is complete. If repeat is infinite, the function will be fired every time the animation is restarted.
        });
    }

    document.finishSpin = function() {
        var p = document.latestParsedResponse;
        console.log(p);
        var total = 0;
        for (var i in p) {
            total += parseInt(p[i]["resultado"]["premio"]);
        }
        if (total > 0) {
            alert ("Você ganhou " + total + "₿!!");
        } else {
            alert ("Não foi dessa vez...");
        }
        requestSaldo(true);
        replaceCoins(document.latestParsedResponse);
        $("div[id='currencyCoin']").draggable("enable");
        aguardandoRespostas = false;
        reqRespostas = undefined;
    }
}
//createWheel();

function replaceCoins(parsedResponse) {
    resetApostaStates();
    for (var i in parsedResponse){
        var rpl = parsedResponse[i];
        var tokn = rpl["apostaOriginal"]["fetchToken"];
        var tipo = document.replyTokens[tokn];
        console.log("tipo = " + tipo);
        var premio = parseInt(rpl["resultado"]["premio"]);
        document.apostaStates[tipo] = premio;
        if (premio > 0) {
            // Adicionar moedas na casa
            //var dif = premio - parseInt(rpl["apostaOriginal"]["valor"]);
            var multi = premio / parseInt(rpl["apostaOriginal"]["valor"]) - 1;
            console.log("Multi = " + multi);
            // Para cada moeda já existente na casa
            $("div[id='currencyCoin'][place='" + tipo + "']").each((index, value) => {
                //console.log("Value ", value);
                var html = value.outerHTML;
                console.log("Html = " + html);
                // Copia-la n vezes para simular o premio
                for (var this_m = 0; this_m < multi; this_m++) {
                    console.log("adding 1... " + this_m);
                    //$("div[tipo='" + tipo + "']").append(html);
                    $("div[id='saldoContainer']").append(html);
                }
                $("div[id='currencyCoin']").draggable();
                console.log("Done " + tipo);
            });
        } else {
            console.log("Got premio = 0 @ " + tipo);
            // Limpar casa (nao houve premio daquele tipo)
            $("div[id='currencyCoin'][place='" + tipo + "']").remove();
        }
    }
}