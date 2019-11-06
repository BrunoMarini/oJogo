let aguardandoRespostas = true;
let reqRespostas = undefined;

function enviarAposta() {
    var valor = parseInt(document.getElementById("fieldValor").value);
    document.getElementById("fieldValor").value = ""

    var req = new XMLHttpRequest();
    var url = '/tryAposta';
    req.open('POST', url, true);

    console.log("Chamei com valor = " + valor)
    msgData = {valor:valor, tipo:"vermelho"}
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    console.log("enviando: " + JSON.stringify(msgData));
    req.send(JSON.stringify(msgData));

    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200)
            alert(req.responseText);
    }

    // Iniciar uma espera assincrona pelo resultado da aposta
    if (!aguardandoRespostas) {
        reqRespostas = new XMLHttpRequest();
        reqRespostas.open('GET','/replyAposta',true); // set this to POST if you would like
        reqRespostas.addEventListener('load',onLoadReply);
        reqRespostas.addEventListener('error',onErrorReply);
        reqRespostas.send();
        aguardandoRespostas = true;
    }
}

function onLoadReply() {
    var response = this.responseText;
    var parsedResponse = JSON.parse(response);
}

function onErrorReply() {

}