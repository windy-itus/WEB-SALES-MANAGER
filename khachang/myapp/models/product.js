const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DATA;

module.exports.getDBProduct=function(){
  var db=[];
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
return db;
}
