const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DATA;
const mongoose = require('mongoose');
const {ObjectId} = require('mongodb');

mongoose.connect(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  autoReconnect: true
});

var db = mongoose.connection;
var prodSchema = new mongoose.Schema({
  _id:  Object,
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
    Product.findOne({_id:ObjectId(id)},(err,doc)=>{
      resolve(doc);
    });
  });
}


module.exports.count=function(query){
  return new Promise(function(resolve, reject){
    Product.count(query).then((docs)=>{
      resolve(docs);
    });
  });
};