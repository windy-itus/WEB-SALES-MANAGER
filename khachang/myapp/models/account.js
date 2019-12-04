const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DATA;
var mongoose = require('mongoose');
const bcrypt=require('bcryptjs');

mongoose.connect(uri, {
  useNewUrlParser: true
});

var db = mongoose.connection;
var inforSchema = new mongoose.Schema({
  username: String,
  password: String,
}, {
  collection: 'Account'
});
const User = db.useDb("ManagerStore").model("User", inforSchema);
module.exports.getAccount=User;


module.exports.getListUser=function(){
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

module.exports.addAccount=function(name,username,password,address,email,phone){
  MongoClient.connect(uri, function (err, db) {
    if (err) throw err;
    var dbo = db.db("ManagerStore");
    var myobj = {
        name: name,
        username:username,
        password:password,
        address:address,
        email:email,
        phone:phone
    };
    dbo.collection("Account").insertOne(myobj, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
    });
});
}

module.exports.hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        var result =await bcrypt.hash(password, salt);
        return result;
    } catch (error) {
        throw new Error('Hashing failed', error)
    }
}