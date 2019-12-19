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
  count: Number,
  count_sell: Number,
  description: String,
  discount: String,
  id_category: Number,
  image_link: String,
  name: String,
  price: Number
}, {
  collection: 'Product'
});

const Product = db.useDb("ManagerStore").model("Product", prodSchema);
module.exports.getProduct = Product;

module.exports.getDBProduct = function () {
  var db = [];
  MongoClient.connect(uri, function (err, client) {
    if (err) throw err;// throw if error
    // Connect to DB 'ManagerStore'
    var dbo = client.db("ManagerStore");
    // Get data from document 'Product'

    var cursor = dbo.collection("Product").find({});
    cursor.forEach(function (doc) {
      db.push(doc);
    });
    client.close();// close connection     
  });
  return db;
}

module.exports.Addproduct=function(nameproduct,category,price,count,countsell,decription,discount,image)
{
  MongoClient.connect(uri,function(error,db){
    var dbo = db.db("ManagerStore");
    var myobj = {
        name: nameproduct,
        id_category:category,
        price:price,
        count:count,
        count_sell:countsell,
        image_link:image,
        description:decription,
        discount:discount
    };
    dbo.collection("Product").insertOne(myobj, function (err, res) {
        if (err) throw err;
        db.close();
    });
  });
}