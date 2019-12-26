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
module.exports.getProduct=Product;

module.exports.getListProductByQuery = function (query) {
  return new Promise(function(resolve, reject){
     Product.find(query).then((docs)=>{
      resolve(docs);
    });
  });
}
module.exports.getListProductByCount=function (query,count) {
  return new Promise(function(resolve, reject){
    Product.find(query).limit(count).then((docs)=>{
      resolve(docs);
    });
  });
}
module.exports.getListProductByIf=function (query,sort,prodPerPage,pageNo) {
  return new Promise(function(resolve, reject){
    Product.find(query).sort(sort)
    .limit(prodPerPage)
    .skip(prodPerPage * (pageNo - 1)).then((docs)=>{
      resolve(docs);
    });
  });
}

module.exports.getProductByIDString=function (id) {
  return new Promise(function(resolve, reject){
    Product.find({}).then((docs)=>{
      docs.forEach((doc)=>{
        if(doc._id==id)  resolve(doc);
      });
    });
  });
}
module.exports.getListProductByIDString=function (arrid) {
  return new Promise(function(resolve, reject){
    Product.find({}).then(async(docs)=>{
      var arr=[];

      docs.forEach(async(doc)=>{
        await arrid.forEach((idproduct)=>{
          if(doc._id==idproduct)
          arr.push(doc);
          });
      });
      resolve(arr);
    });
  });
}
module.exports.DeleteOneProduct=function (query) {
  return new Promise(function(resolve, reject){
    MongoClient.connect(uri, function (err, db) {
      if (err) throw err;
      var dbo = db.db("ManagerStore");
      dbo.collection("Product").deleteOne(query, function (err, res) {
          if (err) throw err;
          resolve(true);
          db.close();
      });
    });
  });
}
module.exports.InsertOneProduct=function (product) {
  return new Promise(function(resolve, reject){
    MongoClient.connect(uri, function (err, db) {
      if (err) throw err;
      var dbo = db.db("ManagerStore");
      dbo.collection("Product").insertOne(product, function (err, res) {
          if (err) throw err;
          resolve(true);
          db.close();
      });
    });
  });
}
module.exports.UpdateOneProduct=function (product,condition) {
  return new Promise(function(resolve, reject){
    MongoClient.connect(uri,async function (err, db) {
      if (err) throw err;
      var dbo = db.db("ManagerStore");
      var dbt=dbo.collection("Product");
      await dbt.updateOne(
        condition,
        {
          $set: product
        }
    )
    db.close();
    resolve(true);
  });
  });
}



module.exports.count=Product.count({});