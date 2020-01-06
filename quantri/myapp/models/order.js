const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DATA;
const mongoose = require('mongoose');

mongoose.connect(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  autoReconnect: true
});

var db = mongoose.connection;
var prodSchema = new mongoose.Schema({
  _id: String,
  ID_Usser: String,
  recipient: String,
  phone_number: String,
  address: String,
  status: Number,
  amount: Number,
  date: Date,
  note: String
}, {
  collection: 'Order'
});
const Order = db.useDb("ManagerStore").model("Order", prodSchema);
module.exports.getOrder = Order;
module.exports.getOrderByQuery = function (query) {
  return new Promise(function (resolve, reject) {
    Order.find(query).then((docs) => {
      resolve(docs);
    });
  });
}
module.exports.getOneOrderByQuery = function (query) {
  return new Promise(function (resolve, reject) {
    Order.findOne(query).then((docs) => {
      resolve(docs);
    });
  });
}
module.exports.deleteOrder = function (query) {
  return new Promise(function (resolve, reject) {
    MongoClient.connect(uri, function (err, db) {
      if (err) throw err;
      var dbo = db.db("ManagerStore");
      dbo.collection("Order").deleteOne(query, function (err, res) {
          if (err) throw err;
          resolve(true);
          db.close();
      });
    });
  });
}
module.exports.CheckStatusByQuery = (query,input) => {
  return new Promise(function (resolve, reject) {
    Order.updateOne(query,
      {
        $set: input
      }).then(() => {
        resolve(true);
      });
  });
}



