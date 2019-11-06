const express = require('express');
const app = express();
const M = new (require("./scripts/Manager.js")).MGR();
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

// Escolhar salas individuais
app.get('/escolharSalaIndividual', function(req, res){
    var jogo = req.query.jogo;

    var cookies = parseCookies(req);
    var usuario = cookies['usuario'];
    var authToken = M.sentarEmMesa(usuario, jogo, 0);

    res.set("Set-Cookie", "roomData="+(jogo + "|" + 0 + "|" + authToken));

    switch (jogo){
        case "winWheel":
            res.sendFile(fetchFile("/htmls/winWheel.html"));
            break;
        default:
            res.send("404");
    }
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

    console.log("[Server] aposta template = ", aposta)
    var ok = M.gerarAposta(aposta);
    if (ok) {
        res.send("Aposta efetuada!");
    } else {
        res.send("A aposta não pode ser feita, cheque seu saldo...");
    }
});

// Requisições de saldo
app.post('/reqSaldo', function(req, res) {
    console.log("[Server] Novo pedido de saldo");
    // Parsear dados do request
    var cookies = parseCookies(req);
    var usuario = cookies['usuario'];

    res.send( "" + M.obterSaldo(usuario) );
});

// Requisições de resultado de apostas
app.post('/replyAposta', function(req, res) {
    console.log("[Server] Novo pedido de resultados adiantado");

    // Parsear dados do request
    var cookies = parseCookies(req);
    var usuario = cookies['usuario'];
    var roomData = cookies['roomData'].split("|");
    var sala = roomData[1];
    var authToken = roomData[2];
    var jogo = roomData[0];

    M.addWaitlist(usuario, jogo, sala, res);
});

//================ Page require ================ 

// Require peão da casa propria

/* Inicio Roleta */
app.all('/roletaDOM.js', function(req, res){
    res.sendFile(fetchFile("/scripts/roletaDOM.js"));
});
/* Fim Roleta */

/* Inicio Manager */
app.all('/Jogador.js', function(req, res){
    res.sendFile(fetchFile("/scripts/Jogador.js"));
});

app.all('/Jogos.js', function(req, res){
    res.sendFile(fetchFile("/scripts/Jogos.js"));
});

app.all('/Apostas.js', function(req, res){
    res.sendFile(fetchFile("/scripts/Apostas.js"));
});
/* Fim Manager */

/* Inicio Peão casa própria */
app.all('/mainWinWheel.css', function(req, res){
    res.sendFile(fetchFile("/styles/mainWinWheel.css"));
});

app.all('/Winwheel.js', function(req, res){
    res.sendFile(fetchFile("/scripts/Winwheel.js"));
});

app.all('/spin_on.png', function(req, res){
    res.sendFile(fetchFile("/recursos/imagens/spin_on.png"));
});

app.all('/spin_off.png', function(req, res){
    res.sendFile(fetchFile("/recursos/imagens/spin_off.png"));
});

app.all('/wheel_back.png', function(req, res){
    res.sendFile(fetchFile("/recursos/imagens/wheel_back.png"));
});

app.all('/tick.mp3', function(req, res){
    res.sendFile(fetchFile("/recursos/sons/tick.mp3"));
});
/* Fim Peão casa própria */

//=============== End page require ============== 


// Listen on port
const port = 8080;
app.listen(port);
console.log("[Server] Listening on port " + port);