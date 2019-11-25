var notes = [];
const uri = process.env.DATA;
const MongoClient = require('mongodb').MongoClient;
exports.create =function(){
    MongoClient.connect(uri, function (err, client) {
    if (err) throw err;// throw if error
    // Connect to DB 'ManagerStore'
    var dbo = client.db("ManagerStore");
    // Get data from document 'Product'
    dbo.collection("Product").find({}).toArray(function (err, doc) {
      if (err) throw err;// throw if error
      // Render viewlistproducts.hbs with product data
      notes=doc;
      client.close();// close connection
    });
  });
  return notes;
}
exports.update =  function(key, title, body) {
    notes[key] = { title: title, body: body };
}
 
exports.read = function(key) {
    return notes[key];
}
 
exports.destroy = function(key) {
    delete notes[key];
}
 
exports.keys = function() {
    return Object.keys(notes);
}