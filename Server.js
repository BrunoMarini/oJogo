const express = require('express');
const app = express();
const M = new (require("./scripts/Manager.js")).MGR();
const D = new (require("./scripts/Banco.js")).B();

//M.init();

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

// // Requests
// app.post('/logarUsuario', function(req, res) {
//     console.log("[Server] Body =", req.body);
//     var usuario = req.body.email_login;
//     var senha = req.body.senha_login;

//     var login = M.logarJogador(usuario, senha);
//     if (login) {
//         res.set("Set-Cookie", "usuario="+usuario);
//         res.sendFile(fetchFile("/htmls/jogos.html"));
//     } else {
//         res.set("Set-Cookie", "usuario="+undefined);
//         res.sendFile(fetchFile("/htmls/login.html"));
//     }
// });

// Escolher o número da sala
app.get('/escolheSala', function(req, res) {
    var jogo = req.query.jogo;

    res.set("Set-Cookie", "jogo="+jogo);
    res.sendFile(fetchFile("/htmls/escolheSala.html"));
});

// Escolhar salas individuais
app.get('/escolherSalaIndividual', function(req, res){
    var jogo = req.query.jogo;

    var cookies = parseCookies(req);
    var usuario = cookies['usuario'];
    var authToken = M.sentarEmMesa(usuario, jogo, 0);

    res.set("Set-Cookie", "roomData="+(jogo + "|" + 0 + "|" + authToken));

    switch (jogo){
        case "winWheel":
            res.sendFile(fetchFile("/htmls/winWheel.html"));
            break;
        case "darts":
            res.sendFile(fetchFile("/htmls/dart.html"));
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
    if (req.body.arg != undefined)  aposta["arg"] = req.body.arg;
    //if (req.body.numero != undefined) aposta["numero"] = req.body.numero;

    console.log("[Server] aposta template = ", aposta)
    var tokenOK = M.gerarAposta(aposta);
    if (tokenOK) {
        res.send(JSON.stringify({sucesso: true, texto:"Aposta efetuada!", token:tokenOK}));
    } else {
        res.send(JSON.stringify({sucesso: false, texto:"A aposta não pode ser feita, cheque seu saldo..."}));
    }
});

// Requisições de saldo
app.post('/reqSaldo', function(req, res) {
    console.log("[Server] Novo pedido de saldo");
    // Parsear dados do request
    var cookies = parseCookies(req);
    var usuario = cookies['usuario'];
    //M.obterSaldo(usuario);
    
    D.saldo(usuario).then((resultado)=>{
        //console.log("[SERVER] " + resultado);
        res.send( "" + resultado);
        //return resultado;
    });
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
    //var tokenAposta = req.body.tokenAposta;
    var tokenAposta = undefined;
    
    M.addWaitlist(usuario, jogo, sala, tokenAposta, res);
});

//============= Requires de Banco =============

app.post('/cadastrarNovoUsuario', function(req, res){
    
    console.log("[Server] Body =", req.body);
    var nome = req.body.nome_cad;
    var email = req.body.email_cad;
    var senha = req.body.senha_cad;
    var saldo = 1000;

    D.inserir(nome, email, senha, saldo).then((resultado) => res.send(JSON.stringify(resultado)));
});

app.post('/loginDeUsuario', function(req, res){
    console.log("[Server] Body =", req.body);
    var email = req.body.email_login;
    var senha = req.body.senha_login;

    D.logar(email, senha).then((resultado)=>{
        if(resultado){
            res.set("Set-Cookie", "usuario="+email);
            M.newLogin(email, email);
            res.sendFile(fetchFile("/htmls/jogos.html")); 
        }else{
            res.set("Set-Cookie", "usuario="+undefined);
            res.sendFile(fetchFile("/htmls/index.html"));
            console.log("Deu ruim!");
        }
    });

});

app.all('/exitRoom', function(req, res){
    // Parsear dados do request
    var cookies = parseCookies(req);
    var usuario = cookies['usuario'];
    var roomData = cookies['roomData'].split("|");
    var sala = roomData[1];
    var authToken = roomData[2];
    var jogo = roomData[0];

    // Desautenticar usuário daquela mesa
    M.sairDeMesa(usuario, jogo, sala);

    // Enviar página padrão de jogos
    res.sendFile(fetchFile("/htmls/jogos.html")); 
});

app.all('/logout', function(req, res){
    // Parsear dados do request
    var cookies = parseCookies(req);
    var usuario = cookies['usuario'];
    var roomData = cookies['roomData'].split("|");
    var sala = roomData[1];
    var authToken = roomData[2];
    var jogo = roomData[0];

    // Desautenticar usuário 
    M.deslogar(usuario, jogo, sala);

    // Enviar página padrão de index
    res.set("Set-Cookie", "roomData="+undefined);
    res.sendFile(fetchFile("/htmls/index.html")); 
});



//================ Page require ================ 

/* Inicio Login */

app.all('/login.css', (req, res) => { res.sendFile(fetchFile("/styles/login.css")); });
app.all('/images/logo.png', (req, res) => { res.sendFile(fetchFile("/recursos/imagens/logo.png")); });
app.all('/styleJogos.css', (req, res) => { res.sendFile(fetchFile("/styles/styleJogos.css")); });
app.all('/styleIndex.css', (req, res) => { res.sendFile(fetchFile("/styles/styleIndex.css")); });
app.all('/mainIndex.js', (req, res) => { res.sendFile(fetchFile("/scripts/mainIndex.js")); });
app.all('/images/logoIndex.png', (req, res) => { res.sendFile(fetchFile("/recursos/imagens/logoIndex.png")); });
app.all('/images/trio.jpg', (req, res) => { res.sendFile(fetchFile("/recursos/imagens/trio.jpg")); });

/* Fim login */

/* Inicio Roleta */
app.all('/roletaDOM.js', function(req, res){
    res.sendFile(fetchFile("/scripts/roletaDOM.js"));
});
app.all('/roletaDisco.css', (req, res) => { res.sendFile(fetchFile("/styles/roletaDisco.css")); });
app.all('/roletaTabela.css', (req, res) => { res.sendFile(fetchFile("/styles/roletaTabela.css")); });
app.all('/roletaGeneral.css', (req, res) => { res.sendFile(fetchFile("/styles/roletaGeneral.css")); });
/* Fim Roleta */

/* Inicio Darts */
app.all('/dartsDOM.js', function(req, res){
    res.sendFile(fetchFile("/scripts/dartsDOM.js"));
});
app.all('/dartsStyle.css', (req, res) => { res.sendFile(fetchFile("/styles/dartsStyle.css")); });
app.all('/darts/dardo.png', (req, res) => { res.sendFile(fetchFile("/recursos/imagens/darts/dardo.png")); });
app.all('/darts/target.png', (req, res) => { res.sendFile(fetchFile("/recursos/imagens/darts/target.png")); });
/* Fim Darts */

/* Inicio Manager */
app.all('/Banco.js', function(req, res){
    res.sendFile(fetchFile("/scripts/Banco.js"));
});

app.all('/Jogador.js', function(req, res){
    res.sendFile(fetchFile("/scripts/Jogador.js"));
});

app.all('/Jogos.js', function(req, res){
    res.sendFile(fetchFile("/scripts/Jogos.js"));
});

app.all('/Apostas.js', function(req, res){
    res.sendFile(fetchFile("/scripts/Apostas.js"));
});

app.all('/jquery.keyframes.min.js', (req, res) => { res.sendFile(fetchFile("/scripts/jquery.keyframes.min.js")); });
app.all('/jquery.min.js', (req, res) => { res.sendFile(fetchFile("/scripts/jquery.min.js")); });
app.all('/jquery-3.3.1.slim.min.js', (req, res) => { res.sendFile(fetchFile("/scripts/jquery.min.js")); });
app.all('/CasinoRoyale.ttf', (req, res) => { res.sendFile(fetchFile("/recursos/fontes/UpperEastSide.ttf")); });
app.all('/poker.jpg', (req, res) => { res.sendFile(fetchFile("/recursos/imagens/poker.jpg")); });
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
let port = process.env.PORT;
if (port == undefined) port = 8080;

app.listen(port);
console.log("[Server] Listening on port " + port);