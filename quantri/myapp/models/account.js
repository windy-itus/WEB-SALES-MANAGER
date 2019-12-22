  const MongoClient = require('mongodb').MongoClient;
  const uri = process.env.DATA;
  // var mongoose = require('mongoose');
  const bcrypt=require('bcryptjs');

  // mongoose.connect(uri, {
  //   useUnifiedTopology: true,
  //   useNewUrlParser: true,
  // });

  // var db = mongoose.connection;
  // var inforSchema = new mongoose.Schema({
  //   _id:Object,
  //   name: String,
  //   username: String,
  //   password: String,
  //   address: String,
  //   email: String,
  //   phone: String,
  //   admin: Boolean,
  //   token: String,
  //   lock: Boolean
  // }, {
  //   collection: 'Account'
  // });
  // const User = db.useDb("ManagerStore").model("User", inforSchema);
  // module.exports.getAccount=User;

  module.exports.addAccount=function(user){
    MongoClient.connect(uri, function (err, db) {
      if (err) throw err;
      var dbo = db.db("ManagerStore");
      dbo.collection("Account").insertOne(user, function (err, res) {
          if (err) throw err;
          db.close();
      });
  });
  } 

  module.exports.UpdateInfoAccount=function(user,query){
    return new Promise((resolve,reject)=>{
      MongoClient.connect(uri, function (err, db) {
        if (err) throw err;
        var dbo = db.db("ManagerStore");
        var dbt=dbo.collection("Account");
        dbt.updateOne(
          query,
          {
            $set: user
          }
      )
      db.close();
      resolve(true);
    });
    });
  }

  module.exports.CheckUserName=(query)=>{
    return new Promise((resolve,reject)=>{
      MongoClient.connect(uri, function (err, db) {
        if (err) throw err;
        var dbo = db.db("ManagerStore");
        dbo.collection("Account").find(query).toArray(function (err, result) {
          if (err) throw err;
          if(result.length==0) resolve(true);
          else resolve(false);
          db.close();
      });
  });
  });
  }

  module.exports.getOneAccount=(query)=>{
    return new Promise((resolve,reject)=>{
      MongoClient.connect(uri, function (err, db) {
        if (err) throw err;
        var dbo = db.db("ManagerStore");
        dbo.collection("Account").findOne(query, (err, result)=> {
          if (err) throw err;
          resolve(result);
          db.close();
      });
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
