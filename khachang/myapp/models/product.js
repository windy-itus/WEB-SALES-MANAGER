const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DATA;
var db=[];
var dbif=[];

MongoClient.connect(uri, function (err, client) {
    if (err) throw err;// throw if error
    // Connect to DB 'ManagerStore'
    var dbo = client.db("ManagerStore");
    // Get data from document 'Product'

    var cursor=dbo.collection("Product").find({});
    cursor.forEach(function(doc){
      db.push(doc);
    });
      client.close();// close connection
         
});
var getProductByIf=function(query){
  var result=[];
   MongoClient.connect(uri, function (err, client) {
    if (err) throw err;// throw if error
    // Connect to DB 'ManagerStore'
    var dbo = client.db("ManagerStore");
    // Get data from document 'Product'
    
    var cursor=dbo.collection("Product").find(query);
    cursor.forEach(function(doc){
      result.push(doc);    
    });
    console.log(result);
      client.close();// close connection
});
console.log(result);
return result;
}



module.exports.getFullProduct=db;
module.exports.getProductByIf=getProductByIf;
