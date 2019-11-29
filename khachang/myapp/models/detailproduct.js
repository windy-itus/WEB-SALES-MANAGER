const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DATA;
var db;

var getDetailProduct=function(query){
     MongoClient.connect(uri, function (err, client) {
      if (err) throw err;// throw if error
      // Connect to DB 'ManagerStore'
      var dbo = client.db("ManagerStore");
      // Get data from document 'Product'
      
      var cursor=dbo.collection("Product").find(query).limit(1);
      cursor.forEach(function(doc){
        db=doc;   
      });
      console.log(db);
    client.close();// close connection
  });
  return db;
}
module.exports.getDetailProduct=getDetailProduct;    