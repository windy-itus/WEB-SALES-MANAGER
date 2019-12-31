const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DATA;
var mongoose = require('mongoose');

mongoose.connect(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

var db = mongoose.connection;
var inforSchema = new mongoose.Schema({
  writter: String,
  id_product: Object,
  context:String
}, {
  collection: 'Comment'
});
const Comment = db.useDb("ManagerStore").model("Comment", inforSchema);
module.exports.get = Comment;

module.exports.addComment = function (item) {
  return new Promise(function (resolve, reject) {
    Comment.insertMany(item).then(()=>
    {
        console.log("Một comment đã được thêm");
        resolve(true);
    })
    .catch((err)=>{
        console.log("Lỗi"+err);
    });
  });
}


module.exports.getListComment = (query) => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(uri, function (err, db) {
      if (err) throw err;
      var dbo = db.db("ManagerStore");
      dbo.collection("Comment").find(query).toArray(function (err, result) {
        if (err) throw err;
        resolve(result);
        db.close();
      });
    });
  });
}