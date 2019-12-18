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
}, {
  collection: 'Order'
});

const Order = db.useDb("ManagerStore").model("Order", prodSchema);
module.exports.getOrder = Order;