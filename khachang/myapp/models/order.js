const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DATA;
const mongoose = require('mongoose');

mongoose.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  module.exports.addOrder=function(order,productsIncart){
    MongoClient.connect(uri, function (err, db) {
      if (err) throw err;
      var dbo = db.db("ManagerStore");
      dbo.collection("Order").insertOne(order, function (err, res) {
          if (err) throw err;
          db.close();
      });
  });

  MongoClient.connect(uri, function (err, db) {
    if (err) throw err;
    var dbo = db.db("ManagerStore");
    dbo.collection("ProductInOrder").insertMany(productsIncart, function (err, res) {
        if (err) throw err;
        db.close();
    });
});
} 