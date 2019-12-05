const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DATA;
var mongoose = require('mongoose');
const bcrypt=require('bcryptjs');

mongoose.connect(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

var db = mongoose.connection;
var inforSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  address: String,
  email: String,
  phone: String
}, {
  collection: 'Account'
});
const User = db.useDb("ManagerStore").model("User", inforSchema);
module.exports.getAccount=User;

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