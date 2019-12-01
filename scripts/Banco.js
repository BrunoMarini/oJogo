//Constantes Base de Dados
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';
const dbName = 'Clientes';
const MONGO_CONFIG = {useUnifiedTopology: true, useNewUrlParser: true};

class Banco {

    constructor(){

    }

    inserir(n, e, p){
       
        MongoClient.connect(url, MONGO_CONFIG, function(err, db) {
            if (err) throw err;

            var dbo = db.db("Clientes");
            dbo.collection("Cadastros").findOne({email: e}, function(err, result) {
                
                if (err) throw err;          

                if(result == null){

                    dbo.collection("Cadastros").insertOne({nome: n, email: e, senha: p}, function(err, res){
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

    async logar(e, s){
        
        var db = await MongoClient.connect(url, MONGO_CONFIG); //function(err, db) {
        
        var dbo = db.db("Clientes");
        var res = await dbo.collection("Cadastros").findOne({email: e});
        
        db.close();

        if(res.senha != null){
            if(s == res.senha)
                return true;
            
            return false;
        }
        return false;
    }

    async saldo(e){
        
        var db = await MongoClient.connect(url, MONGO_CONFIG); //function(err, db) {
        
        var dbo = db.db("Clientes");
        var res = await dbo.collection("Cadastros").findOne({email: e});
        
        db.close();
        if(res != null)
            return res.saldo;
        else
            return false;
    }

    async atualizarSaldo(e, v){

        var db = await MongoClient.connect(url, MONGO_CONFIG); //function(err, db) {
        
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

        dbo.collection("Cadastros").update(atualizar);

        db.close();

        if(s == res.senha)
            return true;
        else
            return false;

    }
}

exports.B = Banco;