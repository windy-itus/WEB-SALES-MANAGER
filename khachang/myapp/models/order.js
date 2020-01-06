const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DATA;
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

mongoose.connect(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

var db = mongoose.connection;
var prodSchema = new mongoose.Schema({
  _id: String,
  ID_Usser: Object,
  recipient: String,
  phone_number: String,
  address: String,
  status: String,
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

module.exports.addOrder = function (order, productsIncart) {
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
module.exports.getOderByIDUserString = function (id) {
  return new Promise(function (resolve, reject) {
    Order.findOne({ ID_Usser: ObjectId(id) }).then((docs) => {
      resolve(doc);
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
module.exports.DeleteOrderByQuery = (query) => {
  return new Promise(function (resolve, reject) {
    Order.deleteOne(query).then(() => {
        resolve(true);
      });
  });
}