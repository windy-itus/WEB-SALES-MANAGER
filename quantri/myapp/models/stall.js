const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DATA;
// const mongoose = require('mongoose');

// mongoose.connect(uri, {
//   useUnifiedTopology: true,
//   useNewUrlParser: true,
//   autoReconnect: true
// });

// var db = mongoose.connection;
// var prodSchema = new mongoose.Schema({
//   _id: Object,
//   name: String,
//   id: Number
// }, {
//   collection: 'Category'
// });
module.exports.AddStall =function(name,id){
  return new Promise((resolve,reject)=>{
    MongoClient.connect(uri, function (err, db) {
      if (err) throw err;
      var dbo = db.db("ManagerStore");
      var dbt=dbo.collection("Category");
      dbt.insertOne({name:name,id:id},(err,res)=>{
        if(err) throw err;
        else resolve(true);
      })
    db.close();
  });
});
}
module.exports.DeleteStall=(query)=>{
  return new Promise((resolve,reject)=>{
    MongoClient.connect(uri, function (err, db) {
      if (err) throw err;
      var dbo = db.db("ManagerStore");
      var dbt=dbo.collection("Category");
      dbt.deleteOne(query,(err,res)=>{
        if(err) throw err;
        else resolve(true);
      })
    db.close();
  });
});
}
module.exports.ListStall=(query)=>{
  return new Promise((resolve,reject)=>{
    MongoClient.connect(uri,function (err, db) {
      if (err) throw err;
      var dbo = db.db("ManagerStore");
      dbo.collection("Category").find({}).toArray(function (err, result) {
        if (err) throw err;
        resolve(result);
        db.close();
    });
});
});
}
// const Category = db.useDb("ManagerStore").model("Category", prodSchema);
// module.exports.getCategory = Category;