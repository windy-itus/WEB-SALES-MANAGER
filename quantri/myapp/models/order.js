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
  status: String,
  amount: Number,
  date: Date,
}, {
  collection: 'Order'
});
const Order = db.useDb("ManagerStore").model("Order", prodSchema);
module.exports.getOrder = Order;



var productInOrder=new mongoose.Schema({
  _id: String,
  _idOrder:String,
  _idProduct: String
}, {
  collection: 'ProductInOrder'
});
const ProductInOrder = db.useDb("ManagerStore").model("ProductInOrder", productInOrder);
module.exports.getProductInOrder = ProductInOrder;
