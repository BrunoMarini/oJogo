//Constantes Base de Dados
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const fs = require('fs');
const path = require('path');
function fetchFile(filename) { return path.join(__dirname + filename); }

let mongourl = "";
if (process.env.mongourl == undefined) {
    var authdata = JSON.parse(fs.readFileSync(fetchFile("/mongo_auth.json")));
    mongourl = authdata["protocol"] + "://" + authdata["user"] + ":" + authdata["pass"] + "@" + authdata["url"] + "/" + authdata["get"]; //"//'mongodb://localhost:27017';
} else {
    mongourl = process.env.mongourl;
}
console.log("[Banco] MongoDB server @ " + mongourl);

const dbName = 'Clientes';
const MONGO_CONFIG = {useUnifiedTopology: true, useNewUrlParser: true};

class Banco {

    constructor() {

    }

    async inserir(n, e, p, s){
       
        var db = await MongoClient.connect(mongourl, MONGO_CONFIG);
        //MongoClient.connect(mongourl, MONGO_CONFIG, function(err, db) {
        //if (err) throw err;

        var dbo = db.db("Clientes");
        var result = await dbo.collection("Cadastros").findOne({email: e});
        //dbo.collection("Cadastros").findOne({email: e}, function(err, result) {
            
        //if (err) throw err;          

        if(result == null){
            var res = await dbo.collection("Cadastros").insertOne({nome: n, email: e, senha: p, saldo: s});//, function(err, res){
            //if(err) throw err;
            //console.log("[Banco] Resultado cadastro =", res);
            if(res.insertedCount == 1){
                console.log("Cadastrado com Sucesso!");
                db.close();
                return {"sucesso": true};
            }else{
                console.log("Erro ao Cadastrar (erro no mongodb!)");
                db.close();
                return {"sucesso": false, "motivo":"erro no banco de dados"};
            }
            //});
        }else{    
            console.log("Erro ao Cadastrar (email existente!)");
            db.close();
            return {"sucesso": false, "motivo":"email já existente"};
        }
        //});
        //});
    }    

    async logar(e, s){
        
        var db = await MongoClient.connect(mongourl, MONGO_CONFIG); //function(err, db) {
        
        var dbo = db.db("Clientes");
        var res = await dbo.collection("Cadastros").findOne({email: e});
        
        db.close();

        if (res == null) return false;

        if(res.senha != null){
            if(s == res.senha)
                return true;
            
            return false;
        }
        return false;
    }

    async saldo(e){
        
        var db = await MongoClient.connect(mongourl, MONGO_CONFIG); //function(err, db) {
        
        var dbo = db.db("Clientes");
        var res = await dbo.collection("Cadastros").findOne({email: e});
        
        db.close();

        if(res != null)
            return res.saldo;
        else
            return false;
    }

    async reqNome(e){
        
        var db = await MongoClient.connect(mongourl, MONGO_CONFIG); //function(err, db) {
        
        var dbo = db.db("Clientes");
        var res = await dbo.collection("Cadastros").findOne({email: e});
        
        db.close();

        if(res != null)
            return res.nome;
        else
            return false;
    }

    async atualizarSaldo(e, v){

        var db = await MongoClient.connect(mongourl, MONGO_CONFIG); //function(err, db) {
        
        var dbo = db.db("Clientes");
        var res = await dbo.collection("Cadastros").findOne({email: e});
        
        var atualizar = 
        {   
            _id: res._id,
            nome: res.nome,
            email: res.email,
            senha: res.senha,
            saldo: (res.saldo + v)
        }

        dbo.collection("Cadastros").update({email:e}, atualizar);

        db.close();

        // if(s == res.senha)
        //     return true;
        // else
        //     return false;

    }
}

exports.B = Banco;