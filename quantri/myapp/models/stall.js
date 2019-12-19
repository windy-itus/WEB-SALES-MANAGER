// const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DATA;
const mongoose = require('mongoose');

mongoose.connect(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  autoReconnect: true
});

var db = mongoose.connection;
var prodSchema = new mongoose.Schema({
  _id: Object,
  name: String,
  id: Number
}, {
  collection: 'Category'
});
const Category = db.useDb("ManagerStore").model("Category", prodSchema);
module.exports.getCategory = Category;