const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DATA;
var mongoose = require('mongoose');
const bcrypt=require('bcryptjs');

mongoose.connect(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

var db = mongoose.connection;
var inforSchema = new mongoose.Schema({
  _id:Object,
  id_user:String,
  id_product:String
}, {
  collection: 'Cart'
});
const Cart = db.useDb("ManagerStore").model("Cart", inforSchema);
module.exports.get=Cart;

module.exports.addCart=function(item){
return new Promise(function(resolve, reject){
  MongoClient.connect(uri, function (err, db) {
    if (err) throw err;
    var dbo = db.db("ManagerStore");
    dbo.collection("Cart").insertOne(item, function (err, res) {
        if (err) throw err;
        resolve(true);
        db.close();
    });
});
});
}

module.exports.deleteCart=function(query){
    return new Promise(function(resolve, reject){
    MongoClient.connect(uri, function (err, db) {
      if (err) throw err;
      var dbo = db.db("ManagerStore");
      dbo.collection("Cart").deleteOne(query, function (err, res) {
          if (err) throw err;
          resolve(true);
          db.close();
      });
  });
    });
  }

module.exports.getListCart=(query)=>{
    return new Promise((resolve,reject)=>{
      MongoClient.connect(uri, function (err, db) {
        if (err) throw err;
        var dbo = db.db("ManagerStore");
        dbo.collection("Cart").find(query).toArray(function (err, result) {
          if (err) throw err;
          resolve(result);
          db.close();
      });
  });
  });
  }