const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DATA;
const mongoose = require('mongoose');
mongoose.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    autoReconnect: true
  });
var db = mongoose.connection;

var productInOrder = new mongoose.Schema({
    _id: String,
    _idOrder: String,
    _idProduct: String
}, {
    collection: 'ProductInOrder'
});
const ProductInOrder = db.useDb("ManagerStore").model("ProductInOrder", productInOrder);
module.exports.getProductInOrder = ProductInOrder;
module.exports.getProductInOrderByQuery = function (query) {
    return new Promise(function (resolve, reject) {
        ProductInOrder.find(query).then((docs) => {
            resolve(docs);
        });
    });
}
module.exports.deleteProductInOrder = function (query) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            var dbo = db.db("ManagerStore");
            dbo.collection("ProductInOrder").deleteMany(query, function (err, res) {
                if (err) throw err;
                resolve(true);
                db.close();
            });
        });
    });
}
