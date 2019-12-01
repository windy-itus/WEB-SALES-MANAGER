const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DATA;

module.exports.register=function(){
  var user=[];
    MongoClient.connect(uri, function (err, client) {
    if (err) throw err;// throw if error
    // Connect to DB 'ManagerStore'
    var dbo = client.db("ManagerStore");
    // Get data from document 'Product'

    var cursor=dbo.collection("Account").find({});
    cursor.forEach(function(doc){
      user.push(doc);
    });
      client.close();// close connection     
});
return user;
}