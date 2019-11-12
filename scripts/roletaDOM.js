let aguardandoRespostas = false;
let reqRespostas = undefined;

function onload() {
    requestSaldo();
}

function requestSaldo() {
    var req = new XMLHttpRequest();
    req.open('POST', "/reqSaldo", true);
    req.setRequestHeader('Content-Type', 'plain/text;charset=UTF-8');
    req.send();

    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) { 
            document.getElementById("saldoDisplay").innerHTML = "Saldo: " + req.responseText + "₿";
            document.saldo = req.responseText;
            reloadCurrency();
        }
    }
}

document.apostaStates = {
    "Duzia 1": 0,
    "Duzia 2": 0, 
    "Duzia 3": 0, 
    "Baixo": 0,
    "Alto": 0,
    "Vermelho": 0,
    "Preto": 0,
    "Ímpar": 0,
    "Par": 0,
    "Coluna 1": 0,
    "Coluna 2": 0,
    "Coluna 3": 0
}

function enviarAposta(apostaData) {
    // var valor = parseInt(document.getElementById("fieldValor").value);
    // document.getElementById("fieldValor").value = ""

    var req = new XMLHttpRequest();
    var url = '/tryAposta';
    req.open('POST', url, true);

    console.log("Chamei com valor = " + apostaData);
    // msgData = {valor:valor, tipo:"vermelho"}
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    console.log("enviando: " + JSON.stringify(apostaData));
    req.send(JSON.stringify(apostaData));

    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            alert(req.responseText);
            //requestSaldo();
        }
    }

    // Iniciar uma espera assincrona pelo resultado da aposta
    if (!aguardandoRespostas) {
        reqRespostas = new XMLHttpRequest();
        reqRespostas.open('POST','/replyAposta',true); // set this to POST if you would like
        reqRespostas.addEventListener('load',onLoadReply);
        reqRespostas.addEventListener('error',onErrorReply);
        reqRespostas.send();
        aguardandoRespostas = true;
    }
}

function onLoadReply() {
    var response = this.responseText;
    //alert("Servidor respondeu: " + response);
    var parsedResponse = JSON.parse(response);
    document.latestParsedResponse = parsedResponse;
    var numSorteio = parseInt(parsedResponse[0]["valorSorteio"]["_numero"]);
    document.spinTo(numSorteio);
    aguardandoRespostas = false;
    reqRespostas = undefined;
    //requestSaldo();
}

function onErrorReply() {
    alert("fudeo");
}

// ================================================== FRONT ROLETA ==================================================

var numorder = [
    0,
    32,
    15,
    19,
    4,
    21,
    2,
    25,
    17,
    34,
    6,
    27,
    13,
    36,
    11,
    30,
    8,
    23,
    10,
    5,
    24,
    16,
    33,
    1,
    20,
    14,
    31,
    9,
    22,
    18,
    29,
    7,
    28,
    12,
    35,
    3,
    26
  ];
  var numred = [
    32,
    19,
    21,
    25,
    34,
    27,
    36,
    30,
    23,
    5,
    16,
    1,
    14,
    9,
    18,
    7,
    12,
    3
  ];
  var numblack = [
    15,
    4,
    2,
    17,
    6,
    13,
    11,
    8,
    10,
    24,
    33,
    20,
    31,
    22,
    29,
    28,
    35,
    26
  ];
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

    //console.log(document.numberLoc);
}

function addToAposta(tipo, valor) { console.log("Add " + valor + " to " + tipo); document.apostaStates[tipo] += parseInt(valor); }
function rmFromAposta(tipo, valor) { console.log("Rm " + valor + " to " + tipo); document.apostaStates[tipo] -= parseInt(valor); }
function sendAllApostas() {
    // Remover chips colocados na mesa
    //$("div[placedCoin=true]").remove();
    // Impedir que o usuário mexa nas moedas
    $("div[id='currencyCoin']").draggable("disable");
    var template = {
        "Duzia 1": {tipo:"duzia", duzia:1},
        "Duzia 2": {tipo:"duzia", duzia:2},
        "Duzia 3": {tipo:"duzia", duzia:3},
        "Baixo": {tipo:"baixo"},
        "Alto": {tipo:"alto"},
        "Vermelho": {tipo:"vermelho"},
        "Preto": {tipo:"preto"},
        "Ímpar": {tipo:"impar"},
        "Par": {tipo:"par"},
        "Coluna 1": {tipo:"coluna", coluna:1},
        "Coluna 2": {tipo:"coluna", coluna:2},
        "Coluna 3": {tipo:"coluna", coluna:3}
    }
    var a = document.apostaStates
    var t;
    for (var k in a) {
        if (a[k] > 0) {
            var val = parseInt(k) || undefined;
            if (val != undefined) {
                enviarAposta({valor: a[k], tipo:"valor", numero:val});
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
        //console.log("appendando moeda de " + valores[pos]);
        cuoins[pos]++;
        //$("div[id='saldoContainer']").append("<div id='currencyCoin' class='ui-widget-content currencyCoin currency_" + valores[pos] + "' valor='" + valores[pos] + "'>" + valores[pos] + "₿</div>");
        saldo -= valores[pos];
    }
    while (pos < cuoins.length - 1) {
        cuoins[pos]--;
        //console.log("removendo moeda de " + valores[pos]);
        saldo = valores[pos];
        pos++;
        while (saldo > 0) {
            while (saldo < valores[pos]) pos++;
            //console.log("appendando moeda de " + valores[pos]);
            cuoins[pos]++;
            //$("div[id='saldoContainer']").append("<div id='currencyCoin' class='ui-widget-content currencyCoin currency_" + valores[pos] + "' valor='" + valores[pos] + "'>" + valores[pos] + "₿</div>");
            saldo -= valores[pos];
            //console.log("new saldo = " + saldo);
        }
    }
    for (var i in cuoins) {
        for (var c = 0; c < cuoins[i]; c++) {
            $("div[id='saldoContainer']").append("<div id='currencyCoin' class='ui-widget-content currencyCoin currency_" + valores[i] + "' valor='" + valores[i] + "'><p class='currencyCoinVisor'>" + valores[i] + "₿</p></div>");
            //console.log("added moeda ", valores[i])
        }
    }
    $( "div[id='currencyCoin']" ).draggable();
}

function resetApostaStates() {
    document.apostaStates = {
        "Duzia 1": 0,
        "Duzia 2": 0, 
        "Duzia 3": 0, 
        "Baixo": 0,
        "Alto": 0,
        "Vermelho": 0,
        "Preto": 0,
        "Ímpar": 0,
        "Par": 0,
        "Coluna 1": 0,
        "Coluna 2": 0,
        "Coluna 3": 0
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
        requestSaldo();
    }
}
//createWheel();

