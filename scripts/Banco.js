//Constantes Base de Dados
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';
const dbName = 'Clientes';
const MONGO_CONFIG = {useUnifiedTopology: true, useNewUrlParser: true};

class Banco {

    constructor(){

    }

    inserir(n, e, p, s){
       
        MongoClient.connect(url, MONGO_CONFIG, function(err, db) {
            if (err) throw err;

            var dbo = db.db("Clientes");
            dbo.collection("Cadastros").findOne({email: e}, function(err, result) {
                
                if (err) throw err;          

                if(result == null){

                    dbo.collection("Cadastros").insertOne({nome: n, email: e, senha: p, saldo: s}, function(err, res){
                        if(err) throw err;
                       
                        if(res.insertedCount == 1){
                            console.log("Cadastrado com Sucesso!");
                        }else{
                            console.log("Erro ao Cadastrar!");
                        }
                    });

                    db.close();
                    
                }else{    
                    console.log("Erro ao Cadastrar!");
                    db.close();
                }
            });
        });
    }    

    logar(e, s){

        console.log("I will try the login");

        MongoClient.connect(url, MONGO_CONFIG, function(err, db) {
            if (err) throw err;

            var dbo = db.db("Clientes");
            dbo.collection("Cadastros").findOne({email: e}, function(err, result) {
                
                if (err) throw err;          
                console.log(result);
                if(result.senha == s){

                    console.log("È ISTO");

                }
            });
        });
    }

}

exports.B = Banco;