const express = require('express');
const app = express();
const M = new (require("./Manager.js")).MGR();
M.init();
const path = require('path');

// JSON via post
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Cookies
function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}
// Static pages
app.use(express.static('htmls'));

function fetchFile(filename) { return path.join(__dirname + filename); }

// Requests
app.post('/logarUsuario', function(req, res) {
    console.log("[Server] Body =", req.body);
    var usuario = req.body.usuario;
    var senha = req.body.senha;

    var login = M.logarJogador(usuario, senha);
    if (login) {
        res.set("Set-Cookie", "usuario="+usuario);
        res.sendFile(fetchFile("/htmls/jogos.html"));
    } else {
        res.set("Set-Cookie", "usuario="+undefined);
        res.sendFile(fetchFile("/htmls/login.html"));
    }
});

// Escolher o número da sala
app.get('/escolheSala', function(req, res) {
    var jogo = req.query.jogo;

    res.set("Set-Cookie", "jogo="+jogo);
    res.sendFile(fetchFile("/htmls/escolheSala.html"));
});

// Entrar na sala
app.get('/entrarSala', function(req, res) {
    var sala = parseInt(req.query.sala);

    var cookies = parseCookies(req);
    var jogo = cookies['jogo'];
    var usuario = cookies['usuario'];

    console.log("[Server] Usuario " + usuario + " entrando em " + jogo + ", sala " + sala)
    var authToken = M.sentarEmMesa(usuario, jogo, sala);

    //res.set("Set-Cookie", "sala="+sala);
    //res.send();

    res.set("Set-Cookie", "roomData="+(jogo + "|" + sala + "|" + authToken));

    switch (jogo) {
        case "roleta":
            res.sendFile(fetchFile("/htmls/roleta.html"));
            break;
        default:
            res.send("404");
    }
});

// Receber apostas
app.post('/tryAposta', function(req, res) {
    console.log("[Server] Novo pedido de aposta");
    console.log("[Server] Body =", req.body);
    // Parsear dados do request
    var valor = req.body.valor;
    var cookies = parseCookies(req);
    var usuario = cookies['usuario'];
    var roomData = cookies['roomData'].split("|");
    //console.log("roomData = " + roomData)
    var sala = roomData[1];
    var authToken = roomData[2];
    var jogo = roomData[0];

    console.log("[Server] valor = " + req.body.valor);
    // Gerar template de aposta
    var aposta = {
        "jogo":jogo,
        "mesa":sala,
        "jogador":usuario,
        "valor":valor,
        "authToken":authToken
    }

    // Checar particularidades
    if (req.body.tipo != undefined) aposta["tipo"] = req.body.tipo;
    if (req.body.numero != undefined) aposta["numero"] = req.body.numero;

    console.log("[Server] aposta template = " + aposta)
    var ok = M.gerarAposta(aposta);
    if (ok) {
        res.send("Aposta efetuada!");
    } else {
        res.send("A aposta não pode ser feita, cheque seu saldo...");
    }
});

// Listen on port
const port = 8080;
app.listen(port);
console.log("[Server] Listening on port " + port);